/**
 * Hooks TanStack Query para hard/soft skills do usuário logado
 * (`/me/hardskills`, `/me/softskills`).
 *
 * São recursos de PERFIL (do usuário), não do currículo: as mesmas skills valem
 * para todos os currículos e persistem independentemente deles. `useSaveSkills`
 * sincroniza as duas listas (add novos, atualiza alterados, remove ausentes).
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  addHardSkill,
  addSoftSkill,
  deleteHardSkill,
  deleteSoftSkill,
  listHardSkills,
  listSoftSkills,
  updateHardSkill,
  updateSoftSkill,
} from "@/lib/api/skills"
import type { CreateSkillPayload, Skill } from "@/lib/api/types"
import { queryKeys } from "@/lib/query/keys"

/** Item de skill vindo do formulário; `id` ausente = skill nova. */
export interface SkillFormItem {
  id?: string
  title: string
}

export function useHardSkills() {
  return useQuery({
    queryKey: queryKeys.me.hardSkills(),
    queryFn: () => listHardSkills(),
  })
}

export function useSoftSkills() {
  return useQuery({
    queryKey: queryKeys.me.softSkills(),
    queryFn: () => listSoftSkills(),
  })
}

export interface SaveSkillsInput {
  hard: SkillFormItem[]
  soft: SkillFormItem[]
  originalHard: Skill[]
  originalSoft: Skill[]
}

/** Sincroniza uma lista de skills com os endpoints do recurso. */
async function syncSkillList(
  items: SkillFormItem[],
  original: Skill[],
  add: (payload: CreateSkillPayload) => Promise<unknown>,
  update: (id: string, payload: CreateSkillPayload) => Promise<unknown>,
  remove: (id: string) => Promise<unknown>,
): Promise<void> {
  const originalById = new Map(original.map((o) => [o.id, o]))
  const keptIds = new Set(items.map((i) => i.id).filter(Boolean) as string[])

  await Promise.all([
    ...items.map((item) => {
      if (!item.id) return add({ title: item.title })
      // Só faz PATCH se o título realmente mudou.
      const orig = originalById.get(item.id)
      if (orig && orig.title === item.title) return Promise.resolve()
      return update(item.id, { title: item.title })
    }),
    ...original
      .filter((o) => !keptIds.has(o.id))
      .map((o) => remove(o.id)),
  ])
}

/**
 * Salva hard e soft skills do usuário. Independente do currículo — pode ser
 * chamado tanto na criação quanto na edição.
 */
export function useSaveSkills() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: SaveSkillsInput): Promise<void> => {
      await Promise.all([
        syncSkillList(
          input.hard,
          input.originalHard,
          addHardSkill,
          updateHardSkill,
          deleteHardSkill,
        ),
        syncSkillList(
          input.soft,
          input.originalSoft,
          addSoftSkill,
          updateSoftSkill,
          deleteSoftSkill,
        ),
      ])
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.me.hardSkills() })
      queryClient.invalidateQueries({ queryKey: queryKeys.me.softSkills() })
    },
  })
}
