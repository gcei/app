/**
 * Serviço de currículos (`/me/resumes`) e seus recursos aninhados
 * (experiences, languages, courses).
 *
 * Obs.: `abilities` (aninhadas no currículo) deixaram de ser editadas pelo front
 * — o editor passou a usar hard/soft skills do usuário (`/me/hardskills`,
 * `/me/softskills`, ver `skills.ts`). A API ainda devolve `resume.abilities` na
 * resposta (consumido pela visão de candidato da empresa).
 *
 * Observações da API:
 * - `GET /me/resumes` é paginado (`{ data, page, size, total }`).
 * - `GET /me/resumes/{id}` traz o currículo completo (com os aninhados).
 * - `PATCH /me/resumes/{id}` altera apenas a meta (title/coverLetter/public);
 *   itens aninhados são criados/editados/removidos pelos endpoints próprios.
 * - `GET /me/resumes/{id}/export` retorna **PDF** (blob).
 */

import { api } from "./http"
import type {
  ApiEnvelope,
  Course,
  CreateCoursePayload,
  CreateExperiencePayload,
  CreateLanguagePayload,
  CreateResumePayload,
  Experience,
  Language,
  Paginated,
  Resume,
  ResumeListItem,
  UpdateCoursePayload,
  UpdateExperiencePayload,
  UpdateLanguagePayload,
  UpdateResumePayload,
} from "./types"

// --- Currículo (recurso principal) ---

/** `GET /me/resumes` — lista paginada dos currículos do usuário logado. */
export async function listResumes(params?: {
  page?: number
  size?: number
}): Promise<Paginated<ResumeListItem>> {
  const query = new URLSearchParams()
  if (params?.page != null) query.set("page", String(params.page))
  if (params?.size != null) query.set("size", String(params.size))
  const qs = query.toString()
  return api.get<Paginated<ResumeListItem>>(`/me/resumes${qs ? `?${qs}` : ""}`)
}

/** `GET /me/resumes/{id}` — currículo completo (com aninhados). */
export async function getResume(id: string): Promise<Resume> {
  const res = await api.get<ApiEnvelope<Resume>>(`/me/resumes/${id}`)
  return res.data
}

/** `POST /me/resumes` — cria um currículo (aninhados podem vir inline). */
export async function createResume(payload: CreateResumePayload): Promise<Resume> {
  const res = await api.post<ApiEnvelope<Resume>>("/me/resumes", payload)
  return res.data
}

/** `PATCH /me/resumes/{id}` — atualiza a meta do currículo. */
export async function updateResume(
  id: string,
  payload: UpdateResumePayload,
): Promise<Resume> {
  const res = await api.patch<ApiEnvelope<Resume>>(`/me/resumes/${id}`, payload)
  return res.data
}

/** `DELETE /me/resumes/{id}` — remove o currículo. */
export async function deleteResume(id: string): Promise<void> {
  await api.del<void>(`/me/resumes/${id}`)
}

/** `GET /me/resumes/{id}/export` — baixa o currículo em PDF (blob). */
export async function exportResumePdf(id: string): Promise<Blob> {
  return api.getBlob(`/me/resumes/${id}/export`, {
    headers: { Accept: "application/pdf" },
  })
}

// --- Experiences ---

export async function addExperience(
  resumeId: string,
  payload: CreateExperiencePayload,
): Promise<Experience> {
  const res = await api.post<ApiEnvelope<Experience>>(
    `/me/resumes/${resumeId}/experiences`,
    payload,
  )
  return res.data
}

export async function updateExperience(
  resumeId: string,
  id: string,
  payload: UpdateExperiencePayload,
): Promise<Experience> {
  const res = await api.patch<ApiEnvelope<Experience>>(
    `/me/resumes/${resumeId}/experiences/${id}`,
    payload,
  )
  return res.data
}

export async function deleteExperience(resumeId: string, id: string): Promise<void> {
  await api.del<void>(`/me/resumes/${resumeId}/experiences/${id}`)
}

// --- Languages ---

export async function addLanguage(
  resumeId: string,
  payload: CreateLanguagePayload,
): Promise<Language> {
  const res = await api.post<ApiEnvelope<Language>>(
    `/me/resumes/${resumeId}/languages`,
    payload,
  )
  return res.data
}

export async function updateLanguage(
  resumeId: string,
  id: string,
  payload: UpdateLanguagePayload,
): Promise<Language> {
  const res = await api.patch<ApiEnvelope<Language>>(
    `/me/resumes/${resumeId}/languages/${id}`,
    payload,
  )
  return res.data
}

export async function deleteLanguage(resumeId: string, id: string): Promise<void> {
  await api.del<void>(`/me/resumes/${resumeId}/languages/${id}`)
}

// --- Courses ---

export async function addCourse(
  resumeId: string,
  payload: CreateCoursePayload,
): Promise<Course> {
  const res = await api.post<ApiEnvelope<Course>>(
    `/me/resumes/${resumeId}/courses`,
    payload,
  )
  return res.data
}

export async function updateCourse(
  resumeId: string,
  id: string,
  payload: UpdateCoursePayload,
): Promise<Course> {
  const res = await api.patch<ApiEnvelope<Course>>(
    `/me/resumes/${resumeId}/courses/${id}`,
    payload,
  )
  return res.data
}

export async function deleteCourse(resumeId: string, id: string): Promise<void> {
  await api.del<void>(`/me/resumes/${resumeId}/courses/${id}`)
}
