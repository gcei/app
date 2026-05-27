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
 * Obs.: `phoneNumber`/`photoRef`/`city` não estão em `required` no spec e
 * podem vir **ausentes** (ex.: `POST /auth/login` omite `city`) ou `null` —
 * por isso são opcionais e anuláveis.
 */
export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  available: boolean
  blocked: boolean
  phoneNumber?: string | null
  photoRef?: string | null
  city?: string | null
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

/**
 * Payload de `PATCH /users/{id}` (`UpdateUserDto`). Self-update é permitido
 * (STUDENT e ADMIN podem editar o próprio usuário).
 *
 * Campos atualizáveis: name, email, password, role, blocked, available, city,
 * phoneNumber. (photoRef não é atualizável pela API.)
 */
export interface UpdateUserPayload {
  name?: string
  email?: string
  password?: string
  role?: UserRole
  blocked?: boolean
  available?: boolean
  city?: string
  phoneNumber?: string
}

// ---------------------------------------------------------------------------
// Currículos (Resumes) — `/me/resumes` (+ recursos aninhados)
// ---------------------------------------------------------------------------

/** Experiência profissional (`ExperienceResponseDto`). Datas em ISO 8601. */
export interface Experience {
  id: string
  role: string
  company: string
  from: string
  until: string
  createdAt: string
}

/** Idioma (`LanguageResponseDto`). */
export interface Language {
  id: string
  title: string
  level: string
  createdAt: string
}

/** Habilidade do currículo (`AbilityResponseDto`). */
export interface Ability {
  id: string
  title: string
  createdAt: string
}

/** Formação/curso (`CourseResponseDto`). Datas em ISO 8601. */
export interface Course {
  id: string
  title: string
  from: string
  until: string
  createdAt: string
}

/** Currículo completo (`ResumeResponseDto`), com os recursos aninhados. */
export interface Resume {
  id: string
  title: string
  coverLetter: string | null
  public: boolean
  createdAt: string
  experiences: Experience[]
  languages: Language[]
  /** Legado: o egresso não preenche mais `abilities` (substituídas por hard/soft skills). */
  abilities: Ability[]
  courses: Course[]
  /** Hard/soft skills do usuário, embutidas pela API na resposta do currículo. */
  hardSkills: Skill[]
  softSkills: Skill[]
}

/** Item de listagem de currículo (`ResumeListItemResponseDto`), sem aninhados. */
export interface ResumeListItem {
  id: string
  title: string
  coverLetter: string | null
  public: boolean
  createdAt: string
}

export interface CreateExperiencePayload {
  role: string
  company: string
  from: string
  until: string
}
export interface CreateLanguagePayload {
  title: string
  level: string
}
export interface CreateAbilityPayload {
  title: string
}
export interface CreateCoursePayload {
  title: string
  from: string
  until: string
}

/**
 * Payload de `POST /me/resumes` (`CreateResumeDto`). Os aninhados podem ser
 * enviados inline na criação. Na edição use os endpoints aninhados próprios.
 */
export interface CreateResumePayload {
  title: string
  coverLetter?: string | null
  public?: boolean
  experiences?: CreateExperiencePayload[]
  languages?: CreateLanguagePayload[]
  abilities?: CreateAbilityPayload[]
  courses?: CreateCoursePayload[]
}

/** Payload de `PATCH /me/resumes/{id}` (`UpdateResumeDto`) — só meta. */
export interface UpdateResumePayload {
  title?: string
  coverLetter?: string | null
  public?: boolean
}

export type UpdateExperiencePayload = Partial<CreateExperiencePayload>
export type UpdateLanguagePayload = Partial<CreateLanguagePayload>
export type UpdateAbilityPayload = Partial<CreateAbilityPayload>
export type UpdateCoursePayload = Partial<CreateCoursePayload>

// ---------------------------------------------------------------------------
// Skills — `/me/hardskills` e `/me/softskills`
// ---------------------------------------------------------------------------

/** Habilidade técnica/comportamental (`HardSkillResponseDto`/`SoftSkillResponseDto`). */
export interface Skill {
  id: string
  title: string
  createdAt: string
}

export interface CreateSkillPayload {
  title: string
}
export type UpdateSkillPayload = Partial<CreateSkillPayload>

// ---------------------------------------------------------------------------
// Formulários / pesquisa (Forms) — `/forms` e `/form/fill/{slug}`
// ---------------------------------------------------------------------------

/** Opção de uma pergunta (`FormOptionResponseDto`). */
export interface FormOption {
  id: string
  title: string
}

/** Pergunta de múltipla escolha (`FormQuestionResponseDto`). */
export interface FormQuestion {
  id: string
  title: string
  createdAt: string
  options: FormOption[]
}

/** Formulário completo (`FormResponseDto`). Sem "ativo": usa janela `opensAt`/`closesAt`. */
export interface Form {
  id: string
  slug: string
  title: string
  createdAt: string
  opensAt: string
  closesAt: string | null
  questions: FormQuestion[]
}

/** Item de listagem de formulário (`FormListItemResponseDto`), sem perguntas. */
export interface FormListItem {
  id: string
  slug: string
  title: string
  createdAt: string
  opensAt: string
  closesAt: string | null
}

/** Formulário para preenchimento pelo egresso (`FormFillResponseDto`). */
export interface FormFill {
  id: string
  slug: string
  title: string
  createdAt: string
  opensAt: string
  closesAt: string | null
  questions: FormQuestion[]
  alreadySubmitted: boolean
}

export interface CreateQuestionPayload {
  title: string
  options: { title: string }[]
}

/** Payload de `POST /forms` (`CreateFormDto`). */
export interface CreateFormPayload {
  title: string
  opensAt?: string
  closesAt?: string | null
  questions: CreateQuestionPayload[]
}

/** Payload de `PATCH /forms/{id}` (`UpdateFormDto`) — `questions` substitui o conjunto. */
export interface UpdateFormPayload {
  title?: string
  opensAt?: string
  closesAt?: string | null
  questions?: CreateQuestionPayload[]
}

/** Resposta a uma pergunta no envio (`SubmitFormAnswerDto`). */
export interface SubmitFormAnswer {
  questionId: string
  optionId: string
}

/** Payload de `POST /form/fill/{slug}` (`SubmitFormDto`). */
export interface SubmitFormPayload {
  answers: SubmitFormAnswer[]
}

// Resultados e estatísticas

export interface FormResultAnswer {
  id: string
  questionId: string
  questionTitle: string
  optionId: string
  optionTitle: string
  createdAt: string
}

export interface FormResultUser {
  id: string
  name: string
  email: string
}

/** Uma submissão de resposta (`FormResultResponseDto`). */
export interface FormResult {
  id: string
  createdAt: string
  user: FormResultUser
  answers: FormResultAnswer[]
}

export interface FormOptionStats {
  id: string
  title: string
  totalAnswers: number
  percentageOfQuestionAnswers: number
}

export interface FormQuestionStats {
  id: string
  title: string
  totalAnswers: number
  percentageOfSubmissions: number
  options: FormOptionStats[]
}

/** Estatísticas agregadas das respostas (`FormResultsStatsResponseDto`). */
export interface FormResultsStats {
  totalSubmissions: number
  questions: FormQuestionStats[]
}
