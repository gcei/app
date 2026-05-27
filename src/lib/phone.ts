/**
 * Máscara e validação de telefone no formato brasileiro.
 *
 * Cobre celular (11 dígitos) e fixo (10 dígitos), aplicando a máscara de forma
 * dinâmica conforme o usuário digita:
 * - 11 dígitos: `(00) 00000-0000`
 * - 10 dígitos: `(00) 0000-0000`
 *
 * O helper é puramente visual: não depende de libs externas. Para enviar ao
 * backend use `onlyDigits` e mande apenas os dígitos.
 */

/** Comprimento máximo da string já mascarada (ex.: `(82) 99999-9999`). */
export const PHONE_MAX_LENGTH = 15

/** Mensagem de erro padrão (pt-BR) para telefone inválido. */
export const PHONE_INVALID_MESSAGE =
  "Telefone inválido. Use DDD + número, ex.: (82) 99999-9999."

/** Remove tudo que não for dígito. */
export function onlyDigits(value: string) {
  return value.replace(/\D/g, "")
}

/**
 * Aplica a máscara de telefone BR a partir de qualquer entrada (dígitos puros
 * ou já formatada). Limita a 11 dígitos e reaplica os separadores.
 */
export function maskPhone(value: string) {
  const digits = onlyDigits(value).slice(0, 11)

  if (digits.length === 0) return ""
  if (digits.length <= 2) return `(${digits}`
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`

  // 7 a 10 dígitos: formato fixo `(00) 0000-0000`.
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  }

  // 11 dígitos: formato celular `(00) 00000-0000`.
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

/**
 * Valida um telefone BR considerando apenas os dígitos. Aceita 10 (fixo) ou 11
 * (celular). Vazio é considerado válido aqui — quem precisa de obrigatoriedade
 * deve checar o campo vazio separadamente.
 */
export function isValidPhone(value: string) {
  const length = onlyDigits(value).length
  return length === 0 || length === 10 || length === 11
}
