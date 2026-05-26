/**
 * Serviço de formulários/pesquisa (`/forms`) e preenchimento (`/form/fill/{slug}`).
 *
 * Observações da API:
 * - Sem campo "ativo"/"descrição": o período de coleta é a janela
 *   `opensAt`/`closesAt` (closesAt pode ser null = sem fechamento).
 * - `PATCH /forms/{id}` aceita `questions` inline → substitui o conjunto de
 *   perguntas (não há endpoints aninhados por pergunta).
 * - Preenchimento é por `slug`; `GET /form/fill/{slug}` traz `alreadySubmitted`.
 * - Export de respostas em **CSV** (`text/csv`).
 */

import { api, ApiError } from "./http"
import type {
  ApiEnvelope,
  CreateFormPayload,
  Form,
  FormFill,
  FormListItem,
  FormResult,
  FormResultsStats,
  Paginated,
  SubmitFormPayload,
  UpdateFormPayload,
} from "./types"

// --- CRUD ---

/** `GET /forms` — lista paginada de formulários. */
export async function listForms(params?: {
  page?: number
  size?: number
}): Promise<Paginated<FormListItem>> {
  const query = new URLSearchParams()
  if (params?.page != null) query.set("page", String(params.page))
  if (params?.size != null) query.set("size", String(params.size))
  const qs = query.toString()
  return api.get<Paginated<FormListItem>>(`/forms${qs ? `?${qs}` : ""}`)
}

/** `GET /forms/{id}` — formulário completo (com perguntas e opções). */
export async function getForm(id: string): Promise<Form> {
  const res = await api.get<ApiEnvelope<Form>>(`/forms/${id}`)
  return res.data
}

/** `POST /forms` — cria um formulário (perguntas/opções inline). */
export async function createForm(payload: CreateFormPayload): Promise<Form> {
  const res = await api.post<ApiEnvelope<Form>>("/forms", payload)
  return res.data
}

/** `PATCH /forms/{id}` — atualiza o formulário (questions substitui o conjunto). */
export async function updateForm(
  id: string,
  payload: UpdateFormPayload,
): Promise<Form> {
  const res = await api.patch<ApiEnvelope<Form>>(`/forms/${id}`, payload)
  return res.data
}

/** `DELETE /forms/{id}` — remove o formulário. */
export async function deleteForm(id: string): Promise<void> {
  await api.del<void>(`/forms/${id}`)
}

// --- Resultados e estatísticas ---

/** `GET /forms/{id}/results` — submissões (paginadas), cada uma com usuário e respostas. */
export async function getFormResults(
  id: string,
  params?: { page?: number; size?: number },
): Promise<Paginated<FormResult>> {
  const query = new URLSearchParams()
  if (params?.page != null) query.set("page", String(params.page))
  if (params?.size != null) query.set("size", String(params.size))
  const qs = query.toString()
  return api.get<Paginated<FormResult>>(
    `/forms/${id}/results${qs ? `?${qs}` : ""}`,
  )
}

/** `GET /forms/{id}/results/stats` — estatísticas agregadas. */
export async function getFormResultsStats(id: string): Promise<FormResultsStats> {
  const res = await api.get<ApiEnvelope<FormResultsStats>>(
    `/forms/${id}/results/stats`,
  )
  return res.data
}

/** `GET /forms/{id}/results/export` — baixa as respostas em CSV (blob). */
export async function exportFormResultsCsv(id: string): Promise<Blob> {
  return api.getBlob(`/forms/${id}/results/export`, {
    headers: { Accept: "text/csv" },
  })
}

// --- Form ativo (gate do egresso) ---

/**
 * `GET /forms/active` — formulário atualmente ativo (a janela `opensAt`/`closesAt`
 * é decidida pelo backend). Retorna `null` quando não há nenhum ativo (404).
 *
 * Obs.: a resposta é `FormResponseDto` e **não traz `alreadySubmitted`** — para
 * saber se o egresso já respondeu, consulte `getFormFill(slug)`.
 */
export async function getActiveForm(): Promise<Form | null> {
  try {
    const res = await api.get<ApiEnvelope<Form>>("/forms/active")
    return res.data
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null
    throw error
  }
}

// --- Preenchimento (egresso) ---

/** `GET /form/fill/{slug}` — formulário para preenchimento (+ `alreadySubmitted`). */
export async function getFormFill(slug: string): Promise<FormFill> {
  const res = await api.get<ApiEnvelope<FormFill>>(`/form/fill/${slug}`)
  return res.data
}

/** `POST /form/fill/{slug}` — envia as respostas do egresso. */
export async function submitFormFill(
  slug: string,
  payload: SubmitFormPayload,
): Promise<void> {
  await api.post<unknown>(`/form/fill/${slug}`, payload)
}
