import { pesquisaAnualQuestions } from "@/mocks/pesquisa-anual"

const FORMS_KEY = "gcei.pesquisa.forms"
const LEGACY_FORM_KEY = "gcei.pesquisa.form"
const RESPOSTAS_KEY = "gcei.pesquisa.respostas"
const CURRENT_EGRESSO_KEY = "gcei.egresso.atual"

export type PesquisaQuestion = {
  id: string
  enunciado: string
  opcoes: string[]
}

export type PesquisaForm = {
  id: string
  titulo: string
  descricao: string
  ativo: boolean
  perguntas: PesquisaQuestion[]
  atualizadoEm: string
}

export type PesquisaResposta = {
  id: string
  formId: string
  egressoCpf: string
  egressoNome: string
  respostas: Record<string, string>
  submetidoEm: string
}

export type EgressoAtual = {
  email: string
  nome: string
}

function nowIso() {
  return new Date().toISOString()
}

function makeId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

function readJson<T>(key: string): T | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

function writeJson<T>(key: string, value: T) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(key, JSON.stringify(value))
}

function buildSeedForm(): PesquisaForm {
  return {
    id: makeId("form"),
    titulo: "Pesquisa anual do egresso",
    descricao:
      "Responda às questões abaixo para concluir a atualização anual do seu perfil.",
    ativo: true,
    perguntas: pesquisaAnualQuestions.map((q) => ({
      id: q.id,
      enunciado: q.title.replace(/^\d+\.\s*/, ""),
      opcoes: [...q.options],
    })),
    atualizadoEm: nowIso(),
  }
}

function migrateLegacyIfNeeded(): PesquisaForm[] | null {
  if (typeof window === "undefined") return null
  const legacy = readJson<Omit<PesquisaForm, "id"> | null>(LEGACY_FORM_KEY)
  if (!legacy) return null
  const migrated: PesquisaForm = { ...legacy, id: makeId("form") }
  window.localStorage.removeItem(LEGACY_FORM_KEY)
  writeJson(FORMS_KEY, [migrated])
  return [migrated]
}

export function getForms(): PesquisaForm[] {
  const stored = readJson<PesquisaForm[]>(FORMS_KEY)
  if (stored && stored.length > 0) return stored

  const migrated = migrateLegacyIfNeeded()
  if (migrated) return migrated

  const seed = [buildSeedForm()]
  writeJson(FORMS_KEY, seed)
  return seed
}

function persistForms(forms: PesquisaForm[]): PesquisaForm[] {
  writeJson(FORMS_KEY, forms)
  return forms
}

export function getFormById(id: string): PesquisaForm | undefined {
  return getForms().find((f) => f.id === id)
}

export function getActiveForm(): PesquisaForm | undefined {
  return getForms().find((f) => f.ativo)
}

export function createForm(input?: { titulo?: string; descricao?: string }): PesquisaForm {
  const nova: PesquisaForm = {
    id: makeId("form"),
    titulo: input?.titulo?.trim() || "Novo formulário",
    descricao: input?.descricao?.trim() || "",
    ativo: false,
    perguntas: [],
    atualizadoEm: nowIso(),
  }
  persistForms([...getForms(), nova])
  return nova
}

export function updateFormMeta(
  id: string,
  meta: { titulo?: string; descricao?: string }
): PesquisaForm | undefined {
  const forms = getForms()
  const next = forms.map((f) =>
    f.id === id
      ? {
          ...f,
          titulo: meta.titulo?.trim() ?? f.titulo,
          descricao: meta.descricao?.trim() ?? f.descricao,
          atualizadoEm: nowIso(),
        }
      : f
  )
  persistForms(next)
  return next.find((f) => f.id === id)
}

export function setFormAtivo(id: string, ativo: boolean): PesquisaForm[] {
  const forms = getForms()
  const next = forms.map((f) => {
    if (f.id === id) return { ...f, ativo, atualizadoEm: nowIso() }
    return ativo ? { ...f, ativo: false } : f
  })
  return persistForms(next)
}

export function deleteForm(id: string): PesquisaForm[] {
  const next = getForms().filter((f) => f.id !== id)
  return persistForms(next)
}

function makeQuestionId(enunciado: string) {
  const slug = enunciado
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40)
  return `${slug || "pergunta"}-${Math.random().toString(36).slice(2, 7)}`
}

function updateFormInList(
  formId: string,
  updater: (form: PesquisaForm) => PesquisaForm
): PesquisaForm | undefined {
  const forms = getForms()
  const next = forms.map((f) =>
    f.id === formId ? { ...updater(f), atualizadoEm: nowIso() } : f
  )
  persistForms(next)
  return next.find((f) => f.id === formId)
}

export function addPergunta(
  formId: string,
  input: { enunciado: string; opcoes: string[] }
): PesquisaForm | undefined {
  return updateFormInList(formId, (form) => ({
    ...form,
    perguntas: [
      ...form.perguntas,
      {
        id: makeQuestionId(input.enunciado),
        enunciado: input.enunciado.trim(),
        opcoes: input.opcoes.map((o) => o.trim()).filter(Boolean),
      },
    ],
  }))
}

export function updatePergunta(
  formId: string,
  perguntaId: string,
  patch: { enunciado?: string; opcoes?: string[] }
): PesquisaForm | undefined {
  return updateFormInList(formId, (form) => ({
    ...form,
    perguntas: form.perguntas.map((p) =>
      p.id === perguntaId
        ? {
            ...p,
            enunciado: patch.enunciado?.trim() ?? p.enunciado,
            opcoes: patch.opcoes
              ? patch.opcoes.map((o) => o.trim()).filter(Boolean)
              : p.opcoes,
          }
        : p
    ),
  }))
}

export function removePergunta(formId: string, perguntaId: string): PesquisaForm | undefined {
  return updateFormInList(formId, (form) => ({
    ...form,
    perguntas: form.perguntas.filter((p) => p.id !== perguntaId),
  }))
}

export function getRespostas(formId?: string): PesquisaResposta[] {
  const all = readJson<PesquisaResposta[]>(RESPOSTAS_KEY) ?? []
  return formId ? all.filter((r) => r.formId === formId) : all
}

export function addResposta(
  resposta: Omit<PesquisaResposta, "id" | "submetidoEm">
): PesquisaResposta {
  const all = readJson<PesquisaResposta[]>(RESPOSTAS_KEY) ?? []
  const filtrada = all.filter(
    (r) => !(r.formId === resposta.formId && r.egressoCpf === resposta.egressoCpf)
  )
  const nova: PesquisaResposta = {
    ...resposta,
    id: makeId("resp"),
    submetidoEm: nowIso(),
  }
  writeJson(RESPOSTAS_KEY, [...filtrada, nova])
  return nova
}

export function egressoJaRespondeuFormAtivo(email: string): boolean {
  if (!email) return false
  const ativo = getActiveForm()
  if (!ativo) return true
  return getRespostas(ativo.id).some((r) => r.egressoCpf === email)
}

export function limparRespostas(formId?: string): void {
  const all = readJson<PesquisaResposta[]>(RESPOSTAS_KEY) ?? []
  if (!formId) {
    writeJson(RESPOSTAS_KEY, [])
    return
  }
  writeJson(
    RESPOSTAS_KEY,
    all.filter((r) => r.formId !== formId)
  )
}

export function setEgressoAtual(egresso: EgressoAtual): void {
  writeJson(CURRENT_EGRESSO_KEY, egresso)
}

export function getEgressoAtual(): EgressoAtual | null {
  return readJson<EgressoAtual>(CURRENT_EGRESSO_KEY)
}

export function clearEgressoAtual(): void {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(CURRENT_EGRESSO_KEY)
}
