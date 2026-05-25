import { useState, useEffect } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { curriculosMockados } from "@/mocks/egresso-curriculos"
import { saveCurriculum, updateCurriculum } from "@/lib/curriculo-storage"

type ExperienciaFormItem = {
  id: string
  cargo: string
  organizacao: string
  periodo: string
}

type HabilidadeFormItem = {
  id: string
  nome: string
}

type IdiomaFormItem = {
  id: string
  idioma: string
  nivel: string
}

type FormacaoFormItem = {
  id: string
  curso: string
  instituicao: string
  situacao: string
}

type CurriculoFormState = {
  titulo: string
  nomeCompleto: string
  email: string
  telefone: string
  cidade: string
  objetivo: string
  habilidades: HabilidadeFormItem[]
  idiomas: IdiomaFormItem[]
  experiencias: ExperienciaFormItem[]
  formacoes: FormacaoFormItem[]
}

const createHabilidade = (): HabilidadeFormItem => {
  return {
    id: crypto.randomUUID(),
    nome: "",
  }
}

const createIdioma = (): IdiomaFormItem => {
  return {
    id: crypto.randomUUID(),
    idioma: "",
    nivel: "",
  }
}

const createExperiencia = (): ExperienciaFormItem => {
  return {
    id: crypto.randomUUID(),
    cargo: "",
    organizacao: "",
    periodo: "",
  }
}

const createFormacao = (): FormacaoFormItem => {
  return {
    id: crypto.randomUUID(),
    curso: "Curso técnico do egresso",
    instituicao: "IFAL",
    situacao: "Concluído",
  }
}

const initialState: CurriculoFormState = {
  titulo: "",
  nomeCompleto: "",
  email: "",
  telefone: "",
  cidade: "",
  objetivo: "",
  habilidades: [createHabilidade()],
  idiomas: [createIdioma()],
  experiencias: [createExperiencia()],
  formacoes: [createFormacao()],
}

export function EgressoCurriculoGerarPage() {
  const navigate = useNavigate()
  const { curriculoId } = useParams()
  const [isEditMode, setIsEditMode] = useState(false)
  const [formState, setFormState] = useState<CurriculoFormState>(initialState)

  useEffect(() => {
    if (curriculoId) {
      setIsEditMode(true)
      const curriculum = curriculosMockados.find(c => c.id === curriculoId)
      if (curriculum) {
        setFormState({
          titulo: curriculum.nome,
          nomeCompleto: curriculum.nomeCompleto,
          email: curriculum.email,
          telefone: curriculum.telefone,
          cidade: curriculum.cidade,
          objetivo: curriculum.objetivo,
          habilidades: curriculum.habilidades.map(h => ({ id: crypto.randomUUID(), nome: h })),
          idiomas: curriculum.idiomas.map(i => {
            const [idioma, nivel] = i.split(' - ')
            return { id: crypto.randomUUID(), idioma, nivel }
          }),
          experiencias: curriculum.experiencias.map(e => ({ 
            id: crypto.randomUUID(), 
            cargo: "", 
            organizacao: "", 
            periodo: "" 
          })),
          formacoes: curriculum.formacao.map(f => {
            const parts = f.split(' - ')
            return { 
              id: crypto.randomUUID(), 
              curso: parts[0] || "", 
              instituicao: parts[1] || "", 
              situacao: parts[2] || "" 
            }
          })
        })
      }
    }
  }, [curriculoId])

  const updateExperiencia = (
    itemId: string,
    field: keyof Omit<ExperienciaFormItem, "id">,
    value: string
  ) => {
    setFormState((current) => ({
      ...current,
      experiencias: current.experiencias.map((item) =>
        item.id === itemId ? { ...item, [field]: value } : item
      ),
    }))
  }

  const updateFormacao = (
    itemId: string,
    field: keyof Omit<FormacaoFormItem, "id">,
    value: string
  ) => {
    setFormState((current) => ({
      ...current,
      formacoes: current.formacoes.map((item) =>
        item.id === itemId ? { ...item, [field]: value } : item
      ),
    }))
  }

  const updateHabilidade = (itemId: string, value: string) => {
    setFormState((current) => ({
      ...current,
      habilidades: current.habilidades.map((item) =>
        item.id === itemId ? { ...item, nome: value } : item
      ),
    }))
  }

  const updateIdioma = (
    itemId: string,
    field: keyof Omit<IdiomaFormItem, "id">,
    value: string
  ) => {
    setFormState((current) => ({
      ...current,
      idiomas: current.idiomas.map((item) =>
        item.id === itemId ? { ...item, [field]: value } : item
      ),
    }))
  }

  return (
    <div className="flex flex-col gap-6 pb-20">
      <div className="flex flex-col gap-3">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <NavLink to="/home/egresso/curriculo">Currículo</NavLink>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{isEditMode ? "Editar currículo" : "Gerar currículo"}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? "Editar dados do currículo" : "Dados do currículo"}</CardTitle>
          <CardDescription>
            {isEditMode 
              ? "Atualize as informações do seu currículo."
              : "Informações básicas para criação de uma nova versão."
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-6"
            onSubmit={(event) => {
              event.preventDefault()
              
              const curriculumData = {
                nome: formState.titulo,
                nomeCompleto: formState.nomeCompleto,
                email: formState.email,
                telefone: formState.telefone,
                cidade: formState.cidade,
                objetivo: formState.objetivo,
                habilidades: formState.habilidades.map(h => h.nome),
                idiomas: formState.idiomas.map(i => `${i.idioma} - ${i.nivel}`),
                experiencias: formState.experiencias.map(e => `${e.cargo} - ${e.organizacao} - ${e.periodo}`),
                formacao: formState.formacoes.map(f => `${f.curso} - ${f.instituicao} - ${f.situacao}`)
              }
              
              if (isEditMode && curriculoId) {
                updateCurriculum(curriculoId, curriculumData)
              } else {
                saveCurriculum(curriculumData)
              }
              
              navigate("/home/egresso/curriculo")
            }}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="curriculo-titulo" className="text-sm font-medium">
                  Título da versão
                </label>
                <Input
                  id="curriculo-titulo"
                  name="titulo"
                  autoComplete="off"
                  value={formState.titulo}
                  onChange={(event) =>
                    setFormState((current) => ({
                      ...current,
                      titulo: event.target.value,
                    }))
                  }
                  placeholder="Ex.: Currículo - Desenvolvimento Web"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="nome-completo" className="text-sm font-medium">
                  Nome completo
                </label>
                <Input
                  id="nome-completo"
                  name="nome_completo"
                  autoComplete="name"
                  value={formState.nomeCompleto}
                  onChange={(event) =>
                    setFormState((current) => ({
                      ...current,
                      nomeCompleto: event.target.value,
                    }))
                  }
                  placeholder="Digite seu nome completo"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="email-curriculo" className="text-sm font-medium">
                  E-mail
                </label>
                <Input
                  id="email-curriculo"
                  type="email"
                  name="email"
                  autoComplete="email"
                  spellCheck={false}
                  value={formState.email}
                  onChange={(event) =>
                    setFormState((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  placeholder="Digite seu e-mail"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="telefone-curriculo" className="text-sm font-medium">
                  Telefone
                </label>
                <Input
                  id="telefone-curriculo"
                  name="telefone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={formState.telefone}
                  onChange={(event) =>
                    setFormState((current) => ({
                      ...current,
                      telefone: event.target.value,
                    }))
                  }
                  placeholder="Digite seu telefone"
                />
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <label htmlFor="cidade-curriculo" className="text-sm font-medium">
                  Cidade
                </label>
                <Input
                  id="cidade-curriculo"
                  name="cidade"
                  autoComplete="address-level2"
                  value={formState.cidade}
                  onChange={(event) =>
                    setFormState((current) => ({
                      ...current,
                      cidade: event.target.value,
                    }))
                  }
                  placeholder="Informe sua cidade"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="objetivo-curriculo" className="text-sm font-medium">
                Objetivo profissional
              </label>
              <Textarea
                id="objetivo-curriculo"
                name="objetivo"
                value={formState.objetivo}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    objetivo: event.target.value,
                  }))
                }
                placeholder="Descreva seu objetivo profissional"
                className="min-h-24"
              />
            </div>

            <section className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <h2 className="text-base font-medium text-foreground">Habilidades</h2>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setFormState((current) => ({
                      ...current,
                      habilidades: [...current.habilidades, createHabilidade()],
                    }))
                  }
                >
                  <PlusIcon aria-hidden="true" />
                  Adicionar habilidade
                </Button>
              </div>

              <div className="flex flex-col gap-4">
                {formState.habilidades.map((habilidade, index) => (
                  <div
                    key={habilidade.id}
                    className="grid gap-4 rounded-lg border p-4 lg:grid-cols-[minmax(0,1fr)_auto]"
                  >
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor={`habilidade-nome-${habilidade.id}`}
                        className="text-sm font-medium"
                      >
                        Habilidade
                      </label>
                      <Input
                        id={`habilidade-nome-${habilidade.id}`}
                        name={`habilidade_nome_${index}`}
                        autoComplete="off"
                        value={habilidade.nome}
                        onChange={(event) =>
                          updateHabilidade(habilidade.id, event.target.value)
                        }
                        placeholder="Ex.: React e TypeScript…"
                      />
                    </div>

                    <div className="flex items-end justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() =>
                          setFormState((current) => ({
                            ...current,
                            habilidades:
                              current.habilidades.length > 1
                                ? current.habilidades.filter(
                                    (item) => item.id !== habilidade.id
                                  )
                                : current.habilidades,
                          }))
                        }
                      >
                        <TrashIcon aria-hidden="true" />
                        Remover
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <h2 className="text-base font-medium text-foreground">Idiomas</h2>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setFormState((current) => ({
                      ...current,
                      idiomas: [...current.idiomas, createIdioma()],
                    }))
                  }
                >
                  <PlusIcon aria-hidden="true" />
                  Adicionar idioma
                </Button>
              </div>

              <div className="flex flex-col gap-4">
                {formState.idiomas.map((idioma, index) => (
                  <div
                    key={idioma.id}
                    className="grid gap-4 rounded-lg border p-4 lg:grid-cols-[minmax(0,1fr)_14rem_auto]"
                  >
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor={`idioma-nome-${idioma.id}`}
                        className="text-sm font-medium"
                      >
                        Idioma
                      </label>
                      <Input
                        id={`idioma-nome-${idioma.id}`}
                        name={`idioma_nome_${index}`}
                        autoComplete="off"
                        value={idioma.idioma}
                        onChange={(event) =>
                          updateIdioma(idioma.id, "idioma", event.target.value)
                        }
                        placeholder="Ex.: Inglês…"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor={`idioma-nivel-${idioma.id}`}
                        className="text-sm font-medium"
                      >
                        Nível
                      </label>
                      <Input
                        id={`idioma-nivel-${idioma.id}`}
                        name={`idioma_nivel_${index}`}
                        autoComplete="off"
                        value={idioma.nivel}
                        onChange={(event) =>
                          updateIdioma(idioma.id, "nivel", event.target.value)
                        }
                        placeholder="Ex.: Intermediário…"
                      />
                    </div>

                    <div className="flex items-end justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() =>
                          setFormState((current) => ({
                            ...current,
                            idiomas:
                              current.idiomas.length > 1
                                ? current.idiomas.filter(
                                    (item) => item.id !== idioma.id
                                  )
                                : current.idiomas,
                          }))
                        }
                      >
                        <TrashIcon aria-hidden="true" />
                        Remover
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <h2 className="text-base font-medium text-foreground">Experiências</h2>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setFormState((current) => ({
                      ...current,
                      experiencias: [...current.experiencias, createExperiencia()],
                    }))
                  }
                >
                  <PlusIcon aria-hidden="true" />
                  Adicionar experiência
                </Button>
              </div>

              <div className="flex flex-col gap-4">
                {formState.experiencias.map((experiencia, index) => (
                  <div
                    key={experiencia.id}
                    className="grid gap-4 rounded-lg border p-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_12rem_auto]"
                  >
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor={`experiencia-cargo-${experiencia.id}`}
                        className="text-sm font-medium"
                      >
                        Cargo
                      </label>
                      <Input
                        id={`experiencia-cargo-${experiencia.id}`}
                        name={`experiencia_cargo_${index}`}
                        autoComplete="off"
                        value={experiencia.cargo}
                        onChange={(event) =>
                          updateExperiencia(experiencia.id, "cargo", event.target.value)
                        }
                        placeholder="Ex.: Estagiário de desenvolvimento…"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor={`experiencia-organizacao-${experiencia.id}`}
                        className="text-sm font-medium"
                      >
                        Empresa ou projeto
                      </label>
                      <Input
                        id={`experiencia-organizacao-${experiencia.id}`}
                        name={`experiencia_organizacao_${index}`}
                        autoComplete="off"
                        value={experiencia.organizacao}
                        onChange={(event) =>
                          updateExperiencia(
                            experiencia.id,
                            "organizacao",
                            event.target.value
                          )
                        }
                        placeholder="Ex.: Projeto integrador…"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor={`experiencia-periodo-${experiencia.id}`}
                        className="text-sm font-medium"
                      >
                        Período
                      </label>
                      <Input
                        id={`experiencia-periodo-${experiencia.id}`}
                        name={`experiencia_periodo_${index}`}
                        autoComplete="off"
                        value={experiencia.periodo}
                        onChange={(event) =>
                          updateExperiencia(experiencia.id, "periodo", event.target.value)
                        }
                        placeholder="Ex.: 2025 - 2026…"
                      />
                    </div>

                    <div className="flex items-end justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() =>
                          setFormState((current) => ({
                            ...current,
                            experiencias:
                              current.experiencias.length > 1
                                ? current.experiencias.filter(
                                    (item) => item.id !== experiencia.id
                                  )
                                : current.experiencias,
                          }))
                        }
                      >
                        <TrashIcon aria-hidden="true" />
                        Remover
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <h2 className="text-base font-medium text-foreground">Formação</h2>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setFormState((current) => ({
                      ...current,
                      formacoes: [...current.formacoes, createFormacao()],
                    }))
                  }
                >
                  <PlusIcon aria-hidden="true" />
                  Adicionar formação
                </Button>
              </div>

              <div className="flex flex-col gap-4">
                {formState.formacoes.map((formacao, index) => (
                  <div
                    key={formacao.id}
                    className="grid gap-4 rounded-lg border p-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_12rem_auto]"
                  >
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor={`formacao-curso-${formacao.id}`}
                        className="text-sm font-medium"
                      >
                        Curso
                      </label>
                      <Input
                        id={`formacao-curso-${formacao.id}`}
                        name={`formacao_curso_${index}`}
                        autoComplete="off"
                        value={formacao.curso}
                        onChange={(event) =>
                          updateFormacao(formacao.id, "curso", event.target.value)
                        }
                        placeholder="Ex.: Técnico em Informática…"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor={`formacao-instituicao-${formacao.id}`}
                        className="text-sm font-medium"
                      >
                        Instituição
                      </label>
                      <Input
                        id={`formacao-instituicao-${formacao.id}`}
                        name={`formacao_instituicao_${index}`}
                        autoComplete="organization"
                        value={formacao.instituicao}
                        onChange={(event) =>
                          updateFormacao(formacao.id, "instituicao", event.target.value)
                        }
                        placeholder="Ex.: IFAL…"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor={`formacao-situacao-${formacao.id}`}
                        className="text-sm font-medium"
                      >
                        Situação
                      </label>
                      <Input
                        id={`formacao-situacao-${formacao.id}`}
                        name={`formacao_situacao_${index}`}
                        autoComplete="off"
                        value={formacao.situacao}
                        onChange={(event) =>
                          updateFormacao(formacao.id, "situacao", event.target.value)
                        }
                        placeholder="Ex.: Concluído…"
                      />
                    </div>

                    <div className="flex items-end justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() =>
                          setFormState((current) => ({
                            ...current,
                            formacoes:
                              current.formacoes.length > 1
                                ? current.formacoes.filter(
                                    (item) => item.id !== formacao.id
                                  )
                                : current.formacoes,
                          }))
                        }
                      >
                        <TrashIcon aria-hidden="true" />
                        Remover
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </form>
        </CardContent>
      </Card>

      {/* Sticky buttons at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 z-50">
        <div className="max-w-4xl mx-auto flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/home/egresso/curriculo")}
          >
            Cancelar
          </Button>
          <Button 
            type="submit"
            onClick={() => {
              const form = document.querySelector('form') as HTMLFormElement
              form?.requestSubmit()
            }}
          >
            {isEditMode ? "Atualizar currículo" : "Salvar currículo"}
          </Button>
        </div>
      </div>
    </div>
  )
}
