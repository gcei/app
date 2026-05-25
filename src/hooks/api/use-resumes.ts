/**
 * Hooks TanStack Query para currículos (`/me/resumes`).
 *
 * `useSaveResume` encapsula create vs edit: na criação envia tudo inline; na
 * edição faz PATCH da meta e sincroniza os aninhados (add/update/delete) item
 * a item, já que a API só altera os aninhados pelos endpoints próprios.
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  addAbility,
  addCourse,
  addExperience,
  addLanguage,
  createResume,
  deleteAbility,
  deleteCourse,
  deleteExperience,
  deleteLanguage,
  deleteResume,
  getResume,
  listResumes,
  updateAbility,
  updateCourse,
  updateExperience,
  updateLanguage,
  updateResume,
} from "@/lib/api/resumes"
import type { Resume } from "@/lib/api/types"
import { queryKeys } from "@/lib/query/keys"

/** Item aninhado vindo do formulário; `id` ausente = item novo. */
export interface ResumeFormItems {
  experiences: Array<{
    id?: string
    role: string
    company: string
    from: string
    until: string
  }>
  languages: Array<{ id?: string; title: string; level: string }>
  abilities: Array<{ id?: string; title: string }>
  courses: Array<{ id?: string; title: string; from: string; until: string }>
}

export interface ResumeFormPayload extends ResumeFormItems {
  title: string
  coverLetter: string | null
  public: boolean
}

export type SaveResumeInput =
  | { mode: "create"; payload: ResumeFormPayload }
  | { mode: "edit"; id: string; payload: ResumeFormPayload; original: Resume }

/** Lista paginada dos currículos do usuário logado. */
export function useResumes() {
  return useQuery({
    queryKey: queryKeys.me.resumes.list(),
    queryFn: () => listResumes(),
  })
}

/** Currículo completo (com aninhados). Desabilitado sem `id`. */
export function useResume(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.me.resumes.detail(id ?? ""),
    queryFn: () => getResume(id as string),
    enabled: !!id,
  })
}

export function useDeleteResume() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteResume(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.me.resumes.all() }),
  })
}

/** Sincroniza os aninhados do currículo (add novos, atualiza existentes, remove ausentes). */
async function syncNested(
  resumeId: string,
  payload: ResumeFormPayload,
  original: Resume,
): Promise<void> {
  const keptIds = (items: Array<{ id?: string }>) =>
    new Set(items.map((i) => i.id).filter(Boolean) as string[])

  await Promise.all([
    ...payload.experiences.map((e) =>
      e.id
        ? updateExperience(resumeId, e.id, {
            role: e.role,
            company: e.company,
            from: e.from,
            until: e.until,
          })
        : addExperience(resumeId, {
            role: e.role,
            company: e.company,
            from: e.from,
            until: e.until,
          }),
    ),
    ...original.experiences
      .filter((o) => !keptIds(payload.experiences).has(o.id))
      .map((o) => deleteExperience(resumeId, o.id)),

    ...payload.languages.map((l) =>
      l.id
        ? updateLanguage(resumeId, l.id, { title: l.title, level: l.level })
        : addLanguage(resumeId, { title: l.title, level: l.level }),
    ),
    ...original.languages
      .filter((o) => !keptIds(payload.languages).has(o.id))
      .map((o) => deleteLanguage(resumeId, o.id)),

    ...payload.abilities.map((a) =>
      a.id
        ? updateAbility(resumeId, a.id, { title: a.title })
        : addAbility(resumeId, { title: a.title }),
    ),
    ...original.abilities
      .filter((o) => !keptIds(payload.abilities).has(o.id))
      .map((o) => deleteAbility(resumeId, o.id)),

    ...payload.courses.map((c) =>
      c.id
        ? updateCourse(resumeId, c.id, {
            title: c.title,
            from: c.from,
            until: c.until,
          })
        : addCourse(resumeId, { title: c.title, from: c.from, until: c.until }),
    ),
    ...original.courses
      .filter((o) => !keptIds(payload.courses).has(o.id))
      .map((o) => deleteCourse(resumeId, o.id)),
  ])
}

export function useSaveResume() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: SaveResumeInput): Promise<Resume> => {
      if (input.mode === "create") {
        return createResume({
          title: input.payload.title,
          coverLetter: input.payload.coverLetter,
          public: input.payload.public,
          experiences: input.payload.experiences.map((e) => ({
            role: e.role,
            company: e.company,
            from: e.from,
            until: e.until,
          })),
          languages: input.payload.languages.map((l) => ({
            title: l.title,
            level: l.level,
          })),
          abilities: input.payload.abilities.map((a) => ({ title: a.title })),
          courses: input.payload.courses.map((c) => ({
            title: c.title,
            from: c.from,
            until: c.until,
          })),
        })
      }

      await updateResume(input.id, {
        title: input.payload.title,
        coverLetter: input.payload.coverLetter,
        public: input.payload.public,
      })
      await syncNested(input.id, input.payload, input.original)
      return getResume(input.id)
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.me.resumes.all() }),
  })
}
