/**
 * Serviço de usuários (`/users`) e currículos públicos
 * (`/users/{userId}/resumes`). Usado pela visão de empresa (candidatos) e,
 * futuramente, pela área interna (cadastros).
 *
 * `GET /users` aceita filtros server-side (name, email, hardSkill, softSkill,
 * course, city, language, blocked, unavailable) + paginação. Não há filtro por
 * papel; a resposta traz apenas dados básicos do usuário (sem skills/currículo).
 */

import { api } from "./http"
import type {
  ApiEnvelope,
  Paginated,
  Resume,
  ResumeListItem,
  UpdateUserPayload,
  User,
} from "./types"

export interface UsersFilters {
  name?: string
  email?: string
  hardSkill?: string
  softSkill?: string
  course?: string
  city?: string
  language?: string
  blocked?: boolean
  unavailable?: boolean
  page?: number
  size?: number
}

function toQuery(filters: UsersFilters): string {
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === null || value === "") continue
    query.set(key, String(value))
  }
  const qs = query.toString()
  return qs ? `?${qs}` : ""
}

/** `GET /users` — lista paginada de usuários, com filtros opcionais. */
export async function listUsers(filters: UsersFilters = {}): Promise<Paginated<User>> {
  return api.get<Paginated<User>>(`/users${toQuery(filters)}`)
}

/** `GET /users/{id}` — usuário por id. */
export async function getUser(id: string): Promise<User> {
  const res = await api.get<ApiEnvelope<User>>(`/users/${id}`)
  return res.data
}

/** `PATCH /users/{id}` — atualiza nome/e-mail/senha/papel (self-update permitido). */
export async function updateUser(
  id: string,
  payload: UpdateUserPayload,
): Promise<User> {
  const res = await api.patch<ApiEnvelope<User>>(`/users/${id}`, payload)
  return res.data
}

/** `GET /users/{userId}/resumes` — currículos públicos do usuário. */
export async function listUserResumes(
  userId: string,
): Promise<Paginated<ResumeListItem>> {
  return api.get<Paginated<ResumeListItem>>(`/users/${userId}/resumes`)
}

/** `GET /users/{userId}/resumes/{id}` — currículo público completo. */
export async function getUserResume(userId: string, id: string): Promise<Resume> {
  const res = await api.get<ApiEnvelope<Resume>>(`/users/${userId}/resumes/${id}`)
  return res.data
}
