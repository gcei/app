/**
 * Tipos compartilhados da API GCEI.
 *
 * Escritos à mão e reconciliados com `components.schemas` do spec OpenAPI
 * (`http://localhost:3000/api-json`). Nesta etapa (Fase 0) ficam apenas os
 * tipos fundacionais (envelopes, erro, paginação) e os de `User`/auth.
 * Os tipos por recurso (Resume, Form, Skills...) entram nas fases que os usam.
 */

/** Envelope padrão de um recurso único: `{ data: T }`. */
export interface ApiEnvelope<T> {
  data: T
}

/** Envelope padrão de listagens paginadas. */
export interface Paginated<T> {
  data: T[]
  page: number
  size: number
  total: number
}

/**
 * Corpo de erro retornado pela API (`ErrorResponseDto`).
 * `message` pode ser uma string única ou uma lista (erros de validação).
 */
export interface ApiErrorBody {
  statusCode: number
  message: string | string[]
  error?: string
}

/** Papéis de usuário conhecidos pela API (`UserRole`). */
export type UserRole = "STUDENT" | "ADMIN"

/**
 * Usuário retornado pela API (`UserResponseDto`).
 *
 * Obs.: o spec marca `phoneNumber`/`photoRef`/`city` como `object nullable`,
 * mas os exemplos são strings — tipamos como `string | null`.
 */
export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  available: boolean
  blocked: boolean
  phoneNumber: string | null
  photoRef: string | null
  city: string | null
  createdAt: string
}

/** Payload de `POST /auth/login` (`LoginDto`). */
export interface LoginPayload {
  email: string
  password: string
}

/** Payload de `POST /auth/register` (`RegisterDto`). */
export interface RegisterPayload {
  name: string
  email: string
  password: string
  role: UserRole
  city?: string
}

/** Payload de `POST /auth/reset-password` (`ResetPasswordDto`). */
export interface ResetPasswordPayload {
  email: string
  password: string
}
