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
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  useResume,
  useSaveResume,
  type ResumeFormPayload,
  type SaveResumeInput,
} from "@/hooks/api/use-resumes"
import type { Resume } from "@/lib/api/types"

interface ExperienceRow {
  key: string
  id?: string
  role: string
  company: string
  from: string
  until: string
}
interface LanguageRow {
  key: string
  id?: string
  title: string
  level: string
}
interface AbilityRow {
  key: string
  id?: string
  title: string
}
interface CourseRow {
  key: string
  id?: string
  title: string
  from: string
  until: string
}
interface ResumeFormState {
  title: string
  coverLetter: string
  public: boolean
  experiences: ExperienceRow[]
  languages: LanguageRow[]
  abilities: AbilityRow[]
  courses: CourseRow[]
}

const newKey = () => crypto.randomUUID()
const emptyExperience = (): ExperienceRow => ({
  key: newKey(),
  role: "",
  company: "",
  from: "",
  until: "",
})
const emptyLanguage = (): LanguageRow => ({ key: newKey(), title: "", level: "" })
const emptyAbility = (): AbilityRow => ({ key: newKey(), title: "" })
const emptyCourse = (): CourseRow => ({
  key: newKey(),
  title: "",
  from: "",
  until: "",
})

const emptyForm = (): ResumeFormState => ({
  title: "",
  coverLetter: "",
  public: false,
  experiences: [],
  languages: [],
  abilities: [],
  courses: [],
})

/** ISO → valor do `<input type="date">` (YYYY-MM-DD). */
const isoToDateInput = (iso: string) => (iso ? iso.slice(0, 10) : "")
/** Valor do `<input type="date">` → ISO 8601 (meia-noite UTC). */
const dateInputToIso = (date: string) => `${date}T00:00:00.000Z`

function mapResumeToForm(resume: Resume): ResumeFormState {
  return {
    title: resume.title,
    coverLetter: resume.coverLetter ?? "",
    public: resume.public,
    experiences: resume.experiences.map((e) => ({
      key: newKey(),
      id: e.id,
      role: e.role,
      company: e.company,
      from: isoToDateInput(e.from),
      until: isoToDateInput(e.until),
    })),
    languages: resume.languages.map((l) => ({
      key: newKey(),
      id: l.id,
      title: l.title,
      level: l.level,
    })),
    abilities: resume.abilities.map((a) => ({
      key: newKey(),
      id: a.id,
      title: a.title,
    })),
    courses: resume.courses.map((c) => ({
      key: newKey(),
      id: c.id,
      title: c.title,
      from: isoToDateInput(c.from),
      until: isoToDateInput(c.until),
    })),
  }
}

function updateList<T extends { key: string }>(
  list: T[],
  key: string,
  patch: Partial<T>,
): T[] {
  return list.map((item) => (item.key === key ? { ...item, ...patch } : item))
}

export function EgressoCurriculoGerarPage() {
  const { curriculoId } = useParams()
  if (!curriculoId) {
    return <ResumeFormScreen mode="create" initial={emptyForm()} />
  }
  return <EditResumeLoader id={curriculoId} />
}

function EditResumeLoader({ id }: { id: string }) {
  const { data: resume, isLoading, isError, refetch } = useResume(id)

  if (isLoading) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        Carregando currículo…
      </p>
    )
  }
  if (isError || !resume) {
    return (
      <div className="flex flex-col items-center gap-3 py-10">
        <p className="text-sm text-destructive">
          Não foi possível carregar o currículo.
        </p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Tentar novamente
        </Button>
      </div>
    )
  }
  return (
    <ResumeFormScreen
      key={resume.id}
      mode="edit"
      resumeId={resume.id}
      original={resume}
      initial={mapResumeToForm(resume)}
    />
  )
}

interface ResumeFormScreenProps {
  mode: "create" | "edit"
  initial: ResumeFormState
  resumeId?: string
  original?: Resume
}

function ResumeFormScreen({
  mode,
  initial,
  resumeId,
  original,
}: ResumeFormScreenProps) {
  const navigate = useNavigate()
  const save = useSaveResume()
  const [form, setForm] = useState<ResumeFormState>(initial)
  const [error, setError] = useState<string | null>(null)
  const isEditMode = mode === "edit"

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (!form.title.trim()) {
      setError("Informe um título para o currículo.")
      return
    }

    const payload: ResumeFormPayload = {
      title: form.title.trim(),
      coverLetter: form.coverLetter.trim() || null,
      public: form.public,
      experiences: form.experiences
        .filter((e) => e.role.trim() && e.company.trim() && e.from && e.until)
        .map((e) => ({
          id: e.id,
          role: e.role.trim(),
          company: e.company.trim(),
          from: dateInputToIso(e.from),
          until: dateInputToIso(e.until),
        })),
      languages: form.languages
        .filter((l) => l.title.trim() && l.level.trim())
        .map((l) => ({ id: l.id, title: l.title.trim(), level: l.level.trim() })),
      abilities: form.abilities
        .filter((a) => a.title.trim())
        .map((a) => ({ id: a.id, title: a.title.trim() })),
      courses: form.courses
        .filter((c) => c.title.trim() && c.from && c.until)
        .map((c) => ({
          id: c.id,
          title: c.title.trim(),
          from: dateInputToIso(c.from),
          until: dateInputToIso(c.until),
        })),
    }

    const input: SaveResumeInput =
      isEditMode && resumeId && original
        ? { mode: "edit", id: resumeId, payload, original }
        : { mode: "create", payload }

    save.mutate(input, {
      onSuccess: () => navigate("/home/egresso/curriculo"),
      onError: () =>
        setError("Não foi possível salvar o currículo. Tente novamente."),
    })
  }

  return (
    <div className="flex flex-col gap-6 pb-24">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <NavLink to="/home/egresso/curriculo">Currículo</NavLink>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {isEditMode ? "Editar currículo" : "Gerar currículo"}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <CardTitle>
            {isEditMode ? "Editar dados do currículo" : "Dados do currículo"}
          </CardTitle>
          <CardDescription>
            Os dados de contato (nome, e-mail, telefone e cidade) vêm do seu
            perfil e aparecem automaticamente no PDF.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="resume-form"
            className="flex flex-col gap-6"
            onSubmit={handleSubmit}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="resume-title" className="text-sm font-medium">
                  Título da versão
                </label>
                <Input
                  id="resume-title"
                  autoComplete="off"
                  value={form.title}
                  onChange={(event) =>
                    setForm((f) => ({ ...f, title: event.target.value }))
                  }
                  placeholder="Ex.: Currículo - Desenvolvimento Web"
                  required
                />
              </div>

              <div className="flex items-end gap-3">
                <Switch
                  id="resume-public"
                  checked={form.public}
                  onCheckedChange={(checked) =>
                    setForm((f) => ({ ...f, public: checked }))
                  }
                />
                <label htmlFor="resume-public" className="text-sm font-medium">
                  Currículo público (visível para empresas)
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="resume-cover" className="text-sm font-medium">
                Objetivo / carta de apresentação
              </label>
              <Textarea
                id="resume-cover"
                value={form.coverLetter}
                onChange={(event) =>
                  setForm((f) => ({ ...f, coverLetter: event.target.value }))
                }
                placeholder="Descreva seu objetivo profissional ou uma breve apresentação"
                className="min-h-24"
              />
            </div>

            <FormSection
              title="Experiências"
              addLabel="Adicionar experiência"
              onAdd={() =>
                setForm((f) => ({
                  ...f,
                  experiences: [...f.experiences, emptyExperience()],
                }))
              }
            >
              {form.experiences.map((item) => (
                <div
                  key={item.key}
                  className="grid gap-4 rounded-lg border p-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_10rem_10rem_auto]"
                >
                  <Field label="Cargo">
                    <Input
                      value={item.role}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          experiences: updateList(f.experiences, item.key, {
                            role: e.target.value,
                          }),
                        }))
                      }
                      placeholder="Ex.: Estagiário de desenvolvimento"
                    />
                  </Field>
                  <Field label="Empresa">
                    <Input
                      value={item.company}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          experiences: updateList(f.experiences, item.key, {
                            company: e.target.value,
                          }),
                        }))
                      }
                      placeholder="Ex.: Acme Inc."
                    />
                  </Field>
                  <Field label="Início">
                    <Input
                      type="date"
                      value={item.from}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          experiences: updateList(f.experiences, item.key, {
                            from: e.target.value,
                          }),
                        }))
                      }
                    />
                  </Field>
                  <Field label="Fim">
                    <Input
                      type="date"
                      value={item.until}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          experiences: updateList(f.experiences, item.key, {
                            until: e.target.value,
                          }),
                        }))
                      }
                    />
                  </Field>
                  <RemoveButton
                    onClick={() =>
                      setForm((f) => ({
                        ...f,
                        experiences: f.experiences.filter(
                          (i) => i.key !== item.key,
                        ),
                      }))
                    }
                  />
                </div>
              ))}
            </FormSection>

            <FormSection
              title="Idiomas"
              addLabel="Adicionar idioma"
              onAdd={() =>
                setForm((f) => ({
                  ...f,
                  languages: [...f.languages, emptyLanguage()],
                }))
              }
            >
              {form.languages.map((item) => (
                <div
                  key={item.key}
                  className="grid gap-4 rounded-lg border p-4 lg:grid-cols-[minmax(0,1fr)_14rem_auto]"
                >
                  <Field label="Idioma">
                    <Input
                      value={item.title}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          languages: updateList(f.languages, item.key, {
                            title: e.target.value,
                          }),
                        }))
                      }
                      placeholder="Ex.: Inglês"
                    />
                  </Field>
                  <Field label="Nível">
                    <Input
                      value={item.level}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          languages: updateList(f.languages, item.key, {
                            level: e.target.value,
                          }),
                        }))
                      }
                      placeholder="Ex.: Intermediário"
                    />
                  </Field>
                  <RemoveButton
                    onClick={() =>
                      setForm((f) => ({
                        ...f,
                        languages: f.languages.filter((i) => i.key !== item.key),
                      }))
                    }
                  />
                </div>
              ))}
            </FormSection>

            <FormSection
              title="Habilidades"
              addLabel="Adicionar habilidade"
              onAdd={() =>
                setForm((f) => ({
                  ...f,
                  abilities: [...f.abilities, emptyAbility()],
                }))
              }
            >
              {form.abilities.map((item) => (
                <div
                  key={item.key}
                  className="grid gap-4 rounded-lg border p-4 lg:grid-cols-[minmax(0,1fr)_auto]"
                >
                  <Field label="Habilidade">
                    <Input
                      value={item.title}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          abilities: updateList(f.abilities, item.key, {
                            title: e.target.value,
                          }),
                        }))
                      }
                      placeholder="Ex.: Liderança, React e TypeScript…"
                    />
                  </Field>
                  <RemoveButton
                    onClick={() =>
                      setForm((f) => ({
                        ...f,
                        abilities: f.abilities.filter((i) => i.key !== item.key),
                      }))
                    }
                  />
                </div>
              ))}
            </FormSection>

            <FormSection
              title="Formação"
              addLabel="Adicionar formação"
              onAdd={() =>
                setForm((f) => ({ ...f, courses: [...f.courses, emptyCourse()] }))
              }
            >
              {form.courses.map((item) => (
                <div
                  key={item.key}
                  className="grid gap-4 rounded-lg border p-4 lg:grid-cols-[minmax(0,1fr)_10rem_10rem_auto]"
                >
                  <Field label="Curso">
                    <Input
                      value={item.title}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          courses: updateList(f.courses, item.key, {
                            title: e.target.value,
                          }),
                        }))
                      }
                      placeholder="Ex.: Sistemas de Informação - IFAL"
                    />
                  </Field>
                  <Field label="Início">
                    <Input
                      type="date"
                      value={item.from}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          courses: updateList(f.courses, item.key, {
                            from: e.target.value,
                          }),
                        }))
                      }
                    />
                  </Field>
                  <Field label="Fim">
                    <Input
                      type="date"
                      value={item.until}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          courses: updateList(f.courses, item.key, {
                            until: e.target.value,
                          }),
                        }))
                      }
                    />
                  </Field>
                  <RemoveButton
                    onClick={() =>
                      setForm((f) => ({
                        ...f,
                        courses: f.courses.filter((i) => i.key !== item.key),
                      }))
                    }
                  />
                </div>
              ))}
            </FormSection>

            {error ? (
              <p role="alert" className="text-sm font-medium text-destructive">
                {error}
              </p>
            ) : null}
          </form>
        </CardContent>
      </Card>

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background p-4">
        <div className="mx-auto flex max-w-4xl flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/home/egresso/curriculo")}
            disabled={save.isPending}
          >
            Cancelar
          </Button>
          <Button type="submit" form="resume-form" disabled={save.isPending}>
            {save.isPending
              ? "Salvando…"
              : isEditMode
                ? "Atualizar currículo"
                : "Salvar currículo"}
          </Button>
        </div>
      </div>
    </div>
  )
}

function FormSection({
  title,
  addLabel,
  onAdd,
  children,
}: {
  title: string
  addLabel: string
  onAdd: () => void
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-medium text-foreground">{title}</h2>
        <Button type="button" variant="outline" onClick={onAdd}>
          <PlusIcon aria-hidden="true" />
          {addLabel}
        </Button>
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">{label}</label>
      {children}
    </div>
  )
}

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="flex items-end justify-end">
      <Button type="button" variant="ghost" onClick={onClick}>
        <TrashIcon aria-hidden="true" />
        Remover
      </Button>
    </div>
  )
}
