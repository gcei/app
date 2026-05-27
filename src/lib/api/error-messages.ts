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

/**
 * Mensagens dos erros de VALIDAÇÃO (class-validator). O backend manda, em 400 de
 * validação, o campo `message` como um array de CÓDIGOS no formato
 * `validation/{regra}/{propriedade}` (ex.: `"validation/is-date-string/closesAt"`).
 *
 * As chaves específicas (com propriedade) já são mensagens prontas; as genéricas
 * (só `validation/{regra}`) usam o placeholder `{property}` (interpolado com um
 * rótulo amigável) e, em algumas regras, `{constraint1}`/`{constraint2}` — que o
 * payload atual NÃO carrega (ver tratamento em `messageForValidationCode`).
 */
export const validationErrorMessages = {
  "validation/is-not-empty": "{property} é obrigatório.",
  "validation/is-not-empty/name": "Nome é obrigatório.",
  "validation/is-not-empty/email": "E-mail é obrigatório.",
  "validation/is-not-empty/password": "Senha é obrigatória.",
  "validation/is-not-empty/role": "Cargo é obrigatório.",
  "validation/is-not-empty/company": "Empresa é obrigatória.",
  "validation/is-not-empty/title": "Título é obrigatório.",
  "validation/is-not-empty/level": "Nível é obrigatório.",
  "validation/is-not-empty/from": "Data de início é obrigatória.",
  "validation/is-not-empty/until": "Data de término é obrigatória.",
  "validation/is-not-empty/closesAt": "Data de encerramento é obrigatória.",
  "validation/is-not-empty/questionId": "Pergunta é obrigatória.",
  "validation/is-not-empty/optionId": "Opção é obrigatória.",
  "validation/is-email": "{property} deve ser um e-mail válido.",
  "validation/is-email/email": "E-mail inválido.",
  "validation/is-string": "{property} deve ser um texto.",
  "validation/is-boolean": "{property} deve ser verdadeiro ou falso.",
  "validation/is-number": "{property} deve ser um número.",
  "validation/is-enum": "{property} possui um valor inválido.",
  "validation/is-enum/role":
    "Perfil inválido. Valores aceitos: STUDENT, ADMIN.",
  "validation/is-strong-password":
    "{property} deve conter letras maiúsculas, minúsculas, números e caracteres especiais.",
  "validation/is-strong-password/password":
    "Senha fraca. Deve conter letras maiúsculas, minúsculas, números e caracteres especiais.",
  "validation/is-date-string": "{property} deve ser uma data válida.",
  "validation/is-array": "{property} deve ser uma lista.",
  "validation/array-min-size":
    "{property} deve ter no mínimo {constraint1} item(ns).",
  "validation/array-min-size/options":
    "Opções deve ter no mínimo 2 itens.",
  "validation/array-min-size/questions":
    "Perguntas deve ter no mínimo 1 item.",
  "validation/array-min-size/answers":
    "Respostas deve ter no mínimo 1 item.",
  "validation/min": "{property} não pode ser menor que {constraint1}.",
  "validation/min/page":     "Página deve ser no mínimo 1.",
  "validation/min/size":     "Tamanho deve ser no mínimo 1.",
  "validation/is-length":
    "{property} deve ter entre {constraint1} e {constraint2} caracteres.",
  "validation/is-length/name":
    "Nome deve ter entre 3 e 255 caracteres.",
  "validation/is-length/password":
    "Senha deve ter entre 6 e 255 caracteres.",
  "validation/is-length/role":
    "Cargo deve ter entre 1 e 255 caracteres.",
  "validation/is-length/company":
    "Empresa deve ter entre 1 e 255 caracteres.",
  "validation/is-length/title":
    "Título deve ter entre 1 e 255 caracteres.",
  "validation/is-length/level":
    "Nível deve ter entre 1 e 255 caracteres.",
  "validation/is-length/coverLetter":
    "Carta de apresentação deve ter no máximo 2000 caracteres.",
  "validation/validate-nested": "{property} possui dados inválidos.",
} as const;

export type ValidationErrorCode = keyof typeof validationErrorMessages

/**
 * Rótulos amigáveis (pt-BR) por propriedade, usados para interpolar `{property}`
 * nas mensagens genéricas. Derivados dos campos do domínio (ver `types.ts`).
 */
const propertyLabels: Record<string, string> = {
  name: "Nome",
  email: "E-mail",
  password: "Senha",
  role: "Cargo",
  company: "Empresa",
  title: "Título",
  level: "Nível",
  from: "Data de início",
  until: "Data de término",
  closesAt: "Data de encerramento",
  opensAt: "Data de abertura",
  questionId: "Pergunta",
  optionId: "Opção",
  options: "Opções",
  questions: "Perguntas",
  answers: "Respostas",
  coverLetter: "Carta de apresentação",
  page: "Página",
  size: "Tamanho",
  city: "Cidade",
  phoneNumber: "Telefone",
}

/**
 * Mensagens genéricas de degradação por REGRA, usadas quando a mensagem do mapa
 * ainda contém `{constraint...}` não resolvido — o payload de validação atual
 * (`["validation/{regra}/{propriedade}"]`) NÃO traz os valores numéricos das
 * constraints, então preferimos um texto legível a expor `{constraint1}` ao
 * usuário. Se quisermos os números exatos, o backend precisa incluí-los no payload.
 */
const constraintFallbackByRule: Record<string, string> = {
  length: "{property} tem tamanho inválido.",
  min: "{property} é menor que o mínimo permitido.",
  "array-min-size": "{property} não tem itens suficientes.",
}

/**
 * Traduz UM código de validação (`validation/{regra}/{propriedade}`) para uma
 * mensagem amigável em pt-BR. Estratégia:
 * 1. Lookup EXATO do código completo no mapa (chaves com propriedade já são
 *    mensagens prontas).
 * 2. Fallback GENÉRICO: remove o último segmento (`/{propriedade}`) para achar a
 *    chave da regra e interpola `{property}` com o rótulo amigável.
 * 3. Se nada casar, devolve o próprio código (não esconde o erro).
 */
export function messageForValidationCode(code: string): string {
  // O código vem sempre como `validation/{regra}/{propriedade}`: o último
  // segmento é a propriedade; o restante (`validation/{regra}`) é a chave da regra.
  const lastSlash = code.lastIndexOf("/")
  const property = lastSlash > 0 ? code.slice(lastSlash + 1) : ""
  const ruleKey = lastSlash > 0 ? code.slice(0, lastSlash) : code
  const label = propertyLabels[property] ?? property

  // Seleciona a mensagem: 1) lookup EXATO do código completo (chaves com
  // propriedade já são mensagens prontas); 2) fallback GENÉRICO pela regra.
  let message: string | undefined
  if (code in validationErrorMessages) {
    message = validationErrorMessages[code as ValidationErrorCode]
  } else if (ruleKey in validationErrorMessages) {
    message = validationErrorMessages[ruleKey as ValidationErrorCode]
  }

  // 3. Código desconhecido: devolve como veio (não esconde o erro).
  if (message === undefined) return code

  message = message.replaceAll("{property}", label)

  // Degradação limpa: o payload não traz os valores de `{constraint...}`. Vale
  // tanto para a mensagem exata quanto para a genérica — nunca expor
  // "{constraint1}" ao usuário; cai no texto genérico da regra.
  if (message.includes("{constraint")) {
    const rule = ruleKey.slice(ruleKey.lastIndexOf("/") + 1)
    const fallback = constraintFallbackByRule[rule]
    if (fallback) return fallback.replaceAll("{property}", label)
  }
  return message
}
