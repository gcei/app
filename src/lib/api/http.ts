/**
 * Cliente HTTP da API GCEI.
 *
 * Wrapper sobre `fetch` com:
 * - baseURL = `API_BASE_URL` e `credentials: "include"` (auth por cookies);
 * - serialização/parse JSON automáticos e `ApiError` em respostas não-ok;
 * - fluxo `401 → POST /auth/refresh (uma vez) → retry`, com single-flight;
 * - handler de "não autenticado" desacoplado do React (ver `setUnauthorizedHandler`).
 */

import { API_BASE_URL } from "@/config/env"
import type { ApiErrorBody } from "./types"

/** Erro lançado quando a API responde com status fora da faixa 2xx. */
export class ApiError extends Error {
  readonly status: number
  readonly body: unknown

  constructor(status: number, message: string, body: unknown) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.body = body
  }
}

/**
 * Handler chamado quando a sessão é considerada perdida (refresh falhou).
 * Default: redireciona para `/login`. O `AuthContext` (Fase 1) sobrescreve
 * via `setUnauthorizedHandler` para limpar o estado antes de navegar.
 */
let onUnauthorized: () => void = () => {
  if (typeof window !== "undefined") {
    window.location.assign("/login")
  }
}

/** Registra o handler executado quando a autenticação expira de vez. */
export function setUnauthorizedHandler(handler: () => void): void {
  onUnauthorized = handler
}

/** Opções aceitas por `request`, espelhando `RequestInit` com `body` flexível. */
export interface RequestOptions extends Omit<RequestInit, "body"> {
  /** Corpo da requisição. Objetos comuns são serializados para JSON. */
  body?: unknown
}

/** Monta a URL absoluta a partir de um path relativo (ou repassa URLs absolutas). */
function resolveUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`
}

/** `true` para corpos que devem ser serializados como JSON. */
function isJsonBody(body: unknown): boolean {
  if (body == null) return false
  if (typeof body === "string") return false
  if (body instanceof FormData) return false
  if (body instanceof Blob) return false
  if (body instanceof URLSearchParams) return false
  if (body instanceof ArrayBuffer) return false
  return true
}

/** Constrói o `RequestInit` final a partir das opções recebidas. */
function buildInit(options: RequestOptions): RequestInit {
  const { body, headers, ...rest } = options
  const finalHeaders = new Headers(headers)
  finalHeaders.set("Accept", "application/json")

  let finalBody: BodyInit | undefined
  if (isJsonBody(body)) {
    finalHeaders.set("Content-Type", "application/json")
    finalBody = JSON.stringify(body)
  } else if (body != null) {
    finalBody = body as BodyInit
  }

  return {
    ...rest,
    credentials: "include",
    headers: finalHeaders,
    body: finalBody,
  }
}

/** Extrai uma mensagem legível do corpo de erro da API. */
function messageFromBody(body: unknown, fallback: string): string {
  if (body && typeof body === "object" && "message" in body) {
    const { message } = body as ApiErrorBody
    if (Array.isArray(message)) return message.join(", ")
    if (typeof message === "string") return message
  }
  return fallback
}

/** Lê o corpo da resposta conforme o `Content-Type` (JSON, texto ou nada). */
async function parseBody(response: Response): Promise<unknown> {
  if (response.status === 204) return undefined
  const contentType = response.headers.get("Content-Type") ?? ""
  if (contentType.includes("application/json")) {
    const text = await response.text()
    return text ? (JSON.parse(text) as unknown) : undefined
  }
  const text = await response.text()
  return text || undefined
}

/** Single-flight: garante uma única chamada de refresh concorrente. */
let refreshPromise: Promise<boolean> | null = null

/** Renova os cookies via `POST /auth/refresh`. Retorna `true` em sucesso. */
function refreshTokens(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = fetch(resolveUrl("/auth/refresh"), {
      method: "POST",
      credentials: "include",
      headers: { Accept: "application/json" },
    })
      .then((res) => res.ok)
      .catch(() => false)
      .finally(() => {
        refreshPromise = null
      })
  }
  return refreshPromise
}

/** Rotas de auth que NÃO devem disparar o fluxo de refresh em 401. */
function isAuthEndpoint(path: string): boolean {
  return path.startsWith("/auth/")
}

/**
 * Executa uma requisição e devolve a resposta crua (`Response`),
 * já tratando o fluxo de refresh em 401. Não lança em status não-ok.
 */
async function rawRequest(path: string, options: RequestOptions): Promise<Response> {
  const url = resolveUrl(path)
  const init = buildInit(options)

  let response = await fetch(url, init)

  if (response.status === 401 && !isAuthEndpoint(path)) {
    const refreshed = await refreshTokens()
    if (refreshed) {
      response = await fetch(url, buildInit(options))
    }
    if (response.status === 401) {
      onUnauthorized()
    }
  }

  return response
}

/**
 * Requisição JSON. Retorna o corpo parseado (tipado como `T`) ou lança
 * `ApiError` em respostas fora da faixa 2xx.
 */
export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await rawRequest(path, options)
  const body = await parseBody(response)

  if (!response.ok) {
    throw new ApiError(response.status, messageFromBody(body, response.statusText), body)
  }

  return body as T
}

/**
 * Requisição para conteúdo binário (PDF/CSV de exports). Retorna o `Blob`
 * ou lança `ApiError`. Usado nas Fases 2 (currículo PDF) e 4 (respostas CSV).
 */
export async function requestBlob(path: string, options: RequestOptions = {}): Promise<Blob> {
  const response = await rawRequest(path, options)
  if (!response.ok) {
    const body = await parseBody(response)
    throw new ApiError(response.status, messageFromBody(body, response.statusText), body)
  }
  return response.blob()
}

/** Atalhos por verbo HTTP. */
export const api = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "POST", body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PATCH", body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PUT", body }),
  del: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "DELETE" }),
  getBlob: (path: string, options?: RequestOptions) =>
    requestBlob(path, { ...options, method: "GET" }),
}
