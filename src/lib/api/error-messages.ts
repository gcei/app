/**
 * Mapeia os CÓDIGOS de erro do backend (vêm no campo `message` da resposta de
 * erro de domínio, ex.: `"auth/invalid-credentials"`) para mensagens amigáveis
 * em pt-BR.
 *
 * A fonte da verdade dos *códigos* é o backend (o `error-mapping` de lá);
 * aqui ficam apenas as *mensagens de exibição*. Mantenha as chaves em sincronia
 * com o backend.
 */
export const errorMessages = {
  "ability/not-found": "Habilidade não encontrada.",
  "auth/forbidden": "Você não tem permissão para acessar este recurso.",
  "auth/invalid-credentials": "E-mail ou senha inválidos.",
  "auth/reset-password-not-implemented":
    "A redefinição de senha ainda não foi implementada.",
  "auth/unauthorized": "Autenticação necessária para acessar este recurso.",
  "course/not-found": "Curso não encontrado.",
  "experience/not-found": "Experiência não encontrada.",
  "form/already-closed": "Este formulário já foi encerrado.",
  "form/already-submitted": "Você já respondeu este formulário.",
  "form/invalid-answers": "As respostas enviadas são inválidas.",
  "form/invalid-period": "O período informado para o formulário é inválido.",
  "form/not-found": "Formulário não encontrado.",
  "form/not-open": "Este formulário não está aberto para respostas.",
  "form/period-conflict": "Já existe um formulário aberto no período informado.",
  "form/question-not-found": "Pergunta do formulário não encontrada.",
  "hard-skill/not-found": "Hard skill não encontrada.",
  "language/not-found": "Idioma não encontrado.",
  "resume/not-found": "Currículo não encontrado.",
  "soft-skill/not-found": "Soft skill não encontrada.",
  "user/email-conflict": "Já existe um usuário cadastrado com este e-mail.",
  "user/not-found": "Usuário não encontrado.",
} as const

export type ApiErrorCode = keyof typeof errorMessages

/**
 * Traduz o `code` (campo `message` dos erros de domínio) para a mensagem em
 * pt-BR. Se o code for desconhecido/ausente, devolve `fallback`.
 */
export function messageForErrorCode(code: unknown, fallback: string): string {
  if (typeof code === "string" && code in errorMessages) {
    return errorMessages[code as ApiErrorCode]
  }
  return fallback
}
