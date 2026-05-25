/**
 * Serviço de autenticação da API GCEI.
 *
 * Funções finas sobre o cliente HTTP. A autenticação é por cookies
 * (`accessToken`/`refreshToken`), setados pelo backend — não há token
 * manipulado no cliente. O `http.ts` cuida do fluxo `401 → refresh → retry`.
 */

import { api } from "./http"
import type {
  ApiEnvelope,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
  User,
} from "./types"

/** `POST /auth/login` — autentica, seta os cookies e retorna o usuário. */
export async function login(payload: LoginPayload): Promise<User> {
  const res = await api.post<ApiEnvelope<User>>("/auth/login", payload)
  return res.data
}

/** `POST /auth/register` — cria a conta e retorna o usuário. */
export async function register(payload: RegisterPayload): Promise<User> {
  const res = await api.post<ApiEnvelope<User>>("/auth/register", payload)
  return res.data
}

/**
 * `POST /auth/reset-password`.
 * Obs.: o backend ainda responde `501 Not Implemented` para esta rota.
 */
export async function resetPassword(payload: ResetPasswordPayload): Promise<void> {
  await api.post<void>("/auth/reset-password", payload)
}

/** `POST /auth/refresh` — rotaciona os cookies (responde `204`). */
export async function refresh(): Promise<void> {
  await api.post<void>("/auth/refresh")
}
