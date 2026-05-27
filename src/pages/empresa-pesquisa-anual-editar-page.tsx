import { useState } from "react"
import { NavLink, useNavigate, useParams } from "react-router-dom"
import { PlusIcon, TrashIcon } from "@phosphor-icons/react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useCreateForm, useForm, useUpdateForm } from "@/hooks/api/use-forms"
import type { CreateFormPayload, Form } from "@/lib/api/types"

interface OptionRow {
  key: string
  title: string
}
interface QuestionRow {
  key: string
  title: string
  options: OptionRow[]
}
interface FormEditorState {
  title: string
  opensAt: string
  closesAt: string
  questions: QuestionRow[]
}

const newKey = () => crypto.randomUUID()
const emptyOption = (): OptionRow => ({ key: newKey(), title: "" })
const emptyQuestion = (): QuestionRow => ({
  key: newKey(),
  title: "",
  options: [emptyOption(), emptyOption()],
})
const emptyState = (): FormEditorState => ({
  title: "",
  opensAt: "",
  closesAt: "",
  questions: [emptyQuestion()],
})

const isoToDateInput = (iso: string | null) => (iso ? iso.slice(0, 10) : "")
const dateInputToIso = (date: string) => `${date}T00:00:00.000Z`

function mapFormToState(form: Form): FormEditorState {
  return {
    title: form.title,
    opensAt: isoToDateInput(form.opensAt),
    closesAt: isoToDateInput(form.closesAt),
    questions: form.questions.map((q) => ({
      key: newKey(),
      title: q.title,
      options: q.options.map((o) => ({ key: newKey(), title: o.title })),
    })),
  }
}

export function EmpresaPesquisaAnualEditarPage() {
  const { formId } = useParams()
  if (!formId) {
    return <FormEditorScreen mode="create" initial={emptyState()} />
  }
  return <EditLoader id={formId} />
}

function EditLoader({ id }: { id: string }) {
  const { data: form, isLoading, isError, refetch } = useForm(id)

  if (isLoading) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        Carregando formulário…
      </p>
    )
  }
  if (isError || !form) {
    return (
      <div className="flex flex-col items-center gap-3 py-10">
        <p className="text-sm text-destructive">
          Não foi possível carregar o formulário.
        </p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Tentar novamente
        </Button>
      </div>
    )
  }
  return (
    <FormEditorScreen
      key={form.id}
      mode="edit"
      formId={form.id}
      initial={mapFormToState(form)}
    />
  )
}

interface FormEditorScreenProps {
  mode: "create" | "edit"
  initial: FormEditorState
  formId?: string
}

function FormEditorScreen({ mode, initial, formId }: FormEditorScreenProps) {
  const navigate = useNavigate()
  const createForm = useCreateForm()
  const updateForm = useUpdateForm()
  const [state, setState] = useState<FormEditorState>(initial)
  const [error, setError] = useState<string | null>(null)
  const isEdit = mode === "edit"
  const isPending = createForm.isPending || updateForm.isPending

  const updateQuestion = (key: string, patch: Partial<QuestionRow>) =>
    setState((s) => ({
      ...s,
      questions: s.questions.map((q) => (q.key === key ? { ...q, ...patch } : q)),
    }))

  const updateOption = (qKey: string, oKey: string, title: string) =>
    setState((s) => ({
      ...s,
      questions: s.questions.map((q) =>
        q.key === qKey
          ? {
              ...q,
              options: q.options.map((o) =>
                o.key === oKey ? { ...o, title } : o,
              ),
            }
          : q,
      ),
    }))

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (!state.title.trim()) {
      setError("Informe o título do formulário.")
      return
    }
    if (!state.opensAt) {
      setError("Informe a data de abertura.")
      return
    }
    if (state.closesAt && state.closesAt < state.opensAt) {
      setError("A data de fechamento não pode ser anterior à de abertura.")
      return
    }

    const questions = state.questions
      .map((q) => ({
        title: q.title.trim(),
        options: q.options.map((o) => o.title.trim()).filter(Boolean),
      }))
      .filter((q) => q.title && q.options.length >= 2)

    if (questions.length === 0) {
      setError("Adicione ao menos uma pergunta com duas opções.")
      return
    }

    const payload: CreateFormPayload = {
      title: state.title.trim(),
      opensAt: dateInputToIso(state.opensAt),
      closesAt: state.closesAt ? dateInputToIso(state.closesAt) : null,
      questions: questions.map((q) => ({
        title: q.title,
        options: q.options.map((title) => ({ title })),
      })),
    }

    const onSuccess = () => navigate("/home/interno/pesquisa-anual")
    const onError = () =>
      setError("Não foi possível salvar o formulário. Tente novamente.")

    if (isEdit && formId) {
      updateForm.mutate({ id: formId, payload }, { onSuccess, onError })
    } else {
      createForm.mutate(payload, { onSuccess, onError })
    }
  }

  return (
    <div className="flex flex-col gap-6 pb-24">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <NavLink to="/home/interno/pesquisa-anual">Formulários</NavLink>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {isEdit ? "Editar formulário" : "Novo formulário"}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <form id="form-editor" className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Configurações do formulário</CardTitle>
            <CardDescription>
              Defina o título e o período de coleta. Deixe “Fecha em” em branco para
              não ter data de encerramento.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2 md:col-span-2">
              <label htmlFor="form-title" className="text-sm font-medium">
                Título
              </label>
              <Input
                id="form-title"
                value={state.title}
                onChange={(e) => setState((s) => ({ ...s, title: e.target.value }))}
                placeholder="Ex.: Pesquisa anual do egresso"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="form-opens" className="text-sm font-medium">
                Abre em
              </label>
              <Input
                id="form-opens"
                type="date"
                value={state.opensAt}
                onChange={(e) =>
                  setState((s) => ({ ...s, opensAt: e.target.value }))
                }
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="form-closes" className="text-sm font-medium">
                Fecha em (opcional)
              </label>
              <Input
                id="form-closes"
                type="date"
                value={state.closesAt}
                min={state.opensAt || undefined}
                onChange={(e) =>
                  setState((s) => ({ ...s, closesAt: e.target.value }))
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex flex-col gap-1">
                <CardTitle>Perguntas</CardTitle>
                <CardDescription>
                  Cada pergunta é de múltipla escolha (mínimo duas opções).
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setState((s) => ({
                    ...s,
                    questions: [...s.questions, emptyQuestion()],
                  }))
                }
              >
                <PlusIcon aria-hidden="true" />
                Nova pergunta
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            {state.questions.map((question, index) => (
              <div key={question.key} className="flex flex-col gap-4 rounded-lg border p-4">
                <div className="flex items-start gap-3">
                  <div className="flex flex-1 flex-col gap-2">
                    <label className="text-sm font-medium">
                      Pergunta {index + 1}
                    </label>
                    <Input
                      value={question.title}
                      onChange={(e) =>
                        updateQuestion(question.key, { title: e.target.value })
                      }
                      placeholder="Enunciado da pergunta"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="mt-7 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    aria-label="Remover pergunta"
                    onClick={() =>
                      setState((s) => ({
                        ...s,
                        questions:
                          s.questions.length > 1
                            ? s.questions.filter((q) => q.key !== question.key)
                            : s.questions,
                      }))
                    }
                  >
                    <TrashIcon aria-hidden="true" />
                  </Button>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Opções
                  </span>
                  {question.options.map((option, oIndex) => (
                    <div key={option.key} className="flex items-center gap-2">
                      <Input
                        value={option.title}
                        onChange={(e) =>
                          updateOption(question.key, option.key, e.target.value)
                        }
                        placeholder={`Opção ${oIndex + 1}`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Remover opção ${oIndex + 1}`}
                        onClick={() =>
                          updateQuestion(question.key, {
                            options:
                              question.options.length > 2
                                ? question.options.filter(
                                    (o) => o.key !== option.key,
                                  )
                                : question.options,
                          })
                        }
                      >
                        <TrashIcon aria-hidden="true" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="self-start"
                    onClick={() =>
                      updateQuestion(question.key, {
                        options: [...question.options, emptyOption()],
                      })
                    }
                  >
                    <PlusIcon aria-hidden="true" />
                    Adicionar opção
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {error ? (
          <p role="alert" className="text-sm font-medium text-destructive">
            {error}
          </p>
        ) : null}
      </form>

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background p-4">
        <div className="mx-auto flex max-w-4xl flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/home/interno/pesquisa-anual")}
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button type="submit" form="form-editor" disabled={isPending}>
            {isPending
              ? "Salvando…"
              : isEdit
                ? "Salvar alterações"
                : "Criar formulário"}
          </Button>
        </div>
      </div>
    </div>
  )
}
