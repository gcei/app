import { useMemo, useState } from "react"
import { NavLink, useNavigate, useSearchParams } from "react-router-dom"
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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  addPergunta,
  getActiveForm,
  updatePergunta,
} from "@/lib/pesquisa-form-storage"

type OpcaoFormItem = {
  id: string
  value: string
}

function createOpcao(value = ""): OpcaoFormItem {
  return {
    id: crypto.randomUUID(),
    value,
  }
}

export function InternoPesquisaAnualCadastroPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const perguntaId = searchParams.get("id")

  const activeForm = useMemo(() => getActiveForm(), [])

  const perguntaExistente = useMemo(() => {
    if (!perguntaId || !activeForm) return null
    return activeForm.perguntas.find((p) => p.id === perguntaId) ?? null
  }, [perguntaId, activeForm])

  const [enunciado, setEnunciado] = useState(perguntaExistente?.enunciado ?? "")
  const [opcoes, setOpcoes] = useState<OpcaoFormItem[]>(() =>
    perguntaExistente
      ? perguntaExistente.opcoes.map((opt) => createOpcao(opt))
      : [createOpcao(), createOpcao()]
  )

  if (!activeForm) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Nenhum formulário ativo</CardTitle>
          <CardDescription>
            Ative um formulário no painel da empresa antes de cadastrar perguntas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline">
            <NavLink to="/home/interno/pesquisa-anual/perguntas">Voltar</NavLink>
          </Button>
        </CardContent>
      </Card>
    )
  }

  const isEdit = Boolean(perguntaExistente)
  const titulo = isEdit ? "Editar pergunta" : "Nova pergunta"

  const isValid =
    enunciado.trim().length > 0 &&
    opcoes.filter((o) => o.value.trim().length > 0).length >= 2

  const handleSubmit = () => {
    if (!isValid) return
    const opcoesValidas = opcoes.map((o) => o.value.trim()).filter(Boolean)

    if (perguntaExistente) {
      updatePergunta(activeForm.id, perguntaExistente.id, {
        enunciado: enunciado.trim(),
        opcoes: opcoesValidas,
      })
    } else {
      addPergunta(activeForm.id, {
        enunciado: enunciado.trim(),
        opcoes: opcoesValidas,
      })
    }

    navigate("/home/interno/pesquisa-anual/perguntas")
  }

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <NavLink to="/home/interno/pesquisa-anual/perguntas">Pesquisa anual</NavLink>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{titulo}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <CardTitle>{titulo}</CardTitle>
          <CardDescription>
            Operação realizada no formulário ativo "{activeForm.titulo}".
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="cadastro-pergunta-form"
            className="flex flex-col gap-4"
            onSubmit={(event) => {
              event.preventDefault()
              handleSubmit()
            }}
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="pergunta-enunciado" className="text-sm font-medium">
                Enunciado
              </label>
              <Input
                id="pergunta-enunciado"
                name="enunciado"
                autoComplete="off"
                value={enunciado}
                onChange={(e) => setEnunciado(e.target.value)}
                placeholder="Digite o enunciado da pergunta…"
              />
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-foreground">Opções de resposta</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpcoes((current) => [...current, createOpcao()])}
                >
                  <PlusIcon aria-hidden="true" />
                  Adicionar opção
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {opcoes.map((opcao, index) => (
                  <div key={opcao.id} className="flex items-end gap-2">
                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                      <label
                        htmlFor={`pergunta-opcao-${opcao.id}`}
                        className="text-sm font-medium"
                      >
                        Opção {index + 1}
                      </label>
                      <Input
                        id={`pergunta-opcao-${opcao.id}`}
                        name={`opcao_${index + 1}`}
                        autoComplete="off"
                        value={opcao.value}
                        onChange={(event) =>
                          setOpcoes((current) =>
                            current.map((item) =>
                              item.id === opcao.id
                                ? { ...item, value: event.target.value }
                                : item
                            )
                          )
                        }
                        placeholder={`Digite a opção ${index + 1}…`}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Remover opção ${index + 1}`}
                      onClick={() =>
                        setOpcoes((current) =>
                          current.length > 2
                            ? current.filter((item) => item.id !== opcao.id)
                            : current
                        )
                      }
                    >
                      <TrashIcon aria-hidden="true" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/home/interno/pesquisa-anual/perguntas")}
          >
            Cancelar
          </Button>
          <Button type="submit" form="cadastro-pergunta-form" disabled={!isValid}>
            {isEdit ? "Salvar alterações" : "Salvar pergunta"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
