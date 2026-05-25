/**
 * Serviço de skills do usuário logado: `/me/hardskills` e `/me/softskills`.
 * São recursos de perfil, independentes dos currículos.
 */

import { api } from "./http"
import type {
  ApiEnvelope,
  CreateSkillPayload,
  Paginated,
  Skill,
  UpdateSkillPayload,
} from "./types"

// --- Hard skills ---

export async function listHardSkills(): Promise<Paginated<Skill>> {
  return api.get<Paginated<Skill>>("/me/hardskills")
}

export async function addHardSkill(payload: CreateSkillPayload): Promise<Skill> {
  const res = await api.post<ApiEnvelope<Skill>>("/me/hardskills", payload)
  return res.data
}

export async function updateHardSkill(
  id: string,
  payload: UpdateSkillPayload,
): Promise<Skill> {
  const res = await api.patch<ApiEnvelope<Skill>>(`/me/hardskills/${id}`, payload)
  return res.data
}

export async function deleteHardSkill(id: string): Promise<void> {
  await api.del<void>(`/me/hardskills/${id}`)
}

// --- Soft skills ---

export async function listSoftSkills(): Promise<Paginated<Skill>> {
  return api.get<Paginated<Skill>>("/me/softskills")
}

export async function addSoftSkill(payload: CreateSkillPayload): Promise<Skill> {
  const res = await api.post<ApiEnvelope<Skill>>("/me/softskills", payload)
  return res.data
}

export async function updateSoftSkill(
  id: string,
  payload: UpdateSkillPayload,
): Promise<Skill> {
  const res = await api.patch<ApiEnvelope<Skill>>(`/me/softskills/${id}`, payload)
  return res.data
}

export async function deleteSoftSkill(id: string): Promise<void> {
  await api.del<void>(`/me/softskills/${id}`)
}
