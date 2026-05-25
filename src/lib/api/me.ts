/**
 * Serviço do usuário autenticado (`/me`).
 */

import { api } from "./http"
import type { ApiEnvelope, User } from "./types"

/** `GET /me` — dados do usuário autenticado atual. */
export async function getMe(): Promise<User> {
  const res = await api.get<ApiEnvelope<User>>("/me")
  return res.data
}
