import { useEffect, useMemo, useState } from "react"
import { NavLink, useNavigate, useParams } from "react-router-dom"
import {
  PencilSimpleIcon,
  PlusIcon,
  TrashIcon,
} from "@phosphor-icons/react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import {
  type PesquisaForm,
  type PesquisaQuestion,
  addPergunta,
  getFormById,
  removePergunta,
  setFormAtivo,
  updateFormMeta,
  updatePergunta,
} from "@/lib/pesquisa-form-storage"

type OpcaoEdit = { id: string; value: string }

function createOpcao(value = ""): OpcaoEdit {
  return { id: crypto.randomUUID(), value }
}

export function EmpresaPesquisaAnualEditarPage() {
  const { formId } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState<PesquisaForm | undefined>(() =>
    formId ? getFormById(formId) : undefined
  )

  const [titulo, setTitulo] = useState(form?.titulo ?? "")
  const [descricao, setDescricao] = useState(form?.descricao ?? "")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [enunciado, setEnunciado] = useState("")
  const [opcoes, setOpcoes] = useState<OpcaoEdit[]>([createOpcao(), createOpcao()])

  useEffect(() => {
    if (form) {
      setTitulo(form.titulo)
      setDescricao(form.descricao)
    }
  }, [form])

  const metaDirty = useMemo(() => {
    if (!form) return false
    return titulo.trim() !== form.titulo || descricao.trim() !== form.descricao
  }, [titulo, descricao, form])

  const isDialogValid =
    enunciado.trim().length > 0 &&
    opcoes.filter((o) => o.value.trim().length > 0).length >= 2

  if (!form || !formId) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Gestão de Currículos de Egressos do IFAL
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">
            Pesquisa do egresso - Editar formulário.
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Formulário não encontrado</CardTitle>
            <CardDescription>
              O formulário solicitado não existe ou já foi removido.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <NavLink to="/home/empresas/pesquisa-anual">
                Voltar para listagem
              </NavLink>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleToggleAtivo = (next: boolean) => {
    setFormAtivo(formId, next)
    const updated = getFormById(formId)
    if (updated) setForm(updated)
  }

  const handleSaveMeta = () => {
    if (!metaDirty) return
    const updated = updateFormMeta(formId, {
      titulo: titulo.trim(),
      descricao: descricao.trim(),
    })
    if (updated) setForm(updated)
  }

  const openNew = () => {
    setEditingId(null)
    setEnunciado("")
    setOpcoes([createOpcao(), createOpcao()])
    setDialogOpen(true)
  }

  const openEdit = (pergunta: PesquisaQuestion) => {
    setEditingId(pergunta.id)
    setEnunciado(pergunta.enunciado)
    setOpcoes(pergunta.opcoes.map((o) => createOpcao(o)))
    setDialogOpen(true)
  }

  const handleSavePergunta = () => {
    if (!isDialogValid) return
    const opcoesValidas = opcoes.map((o) => o.value.trim()).filter(Boolean)

    const updated = editingId
      ? updatePergunta(formId, editingId, {
          enunciado: enunciado.trim(),
          opcoes: opcoesValidas,
        })
      : addPergunta(formId, { enunciado: enunciado.trim(), opcoes: opcoesValidas })

    if (updated) setForm(updated)
    setDialogOpen(false)
  }

  const handleRemovePergunta = (id: string) => {
    const updated = removePergunta(formId, id)
    if (updated) setForm(updated)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Gestão de Currículos de Egressos do IFAL
        </h1>
        <p className="text-sm leading-6 text-muted-foreground">
          Pesquisa do egresso - Edite título, descrição e perguntas.
        </p>
      </div>

      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <NavLink to="/home/empresas/pesquisa-anual">Formulários</NavLink>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{form.titulo}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col gap-1">
              <CardTitle>Configurações do formulário</CardTitle>
              <CardDescription>
                Ao ativar este formulário, qualquer outro ativo é desativado automaticamente.
              </CardDescription>
            </div>
            <label className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2 shadow-sm">
              <span className="text-sm font-medium text-foreground">
                {form.ativo ? "Formulário ativo" : "Formulário inativo"}
              </span>
              <Switch
                checked={form.ativo}
                onCheckedChange={handleToggleAtivo}
                aria-label="Alternar formulário ativo"
              />
            </label>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="form-titulo" className="text-sm font-medium text-foreground">
              Título
            </label>
            <Input
              id="form-titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Título do formulário"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="form-descricao" className="text-sm font-medium text-foreground">
              Descrição
            </label>
            <Textarea
              id="form-descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={3}
              placeholder="Descrição apresentada ao egresso"
            />
          </div>
        </CardContent>
        <CardFooter className="justify-between gap-3">
          <Button
            variant="outline"
            onClick={() => navigate("/home/empresas/pesquisa-anual")}
          >
            Voltar
          </Button>
          <Button onClick={handleSaveMeta} disabled={!metaDirty}>
            Salvar alterações
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col gap-1">
              <CardTitle>Perguntas</CardTitle>
              <CardDescription>
                {form.perguntas.length} pergunta(s) configurada(s).
              </CardDescription>
            </div>
            <Button onClick={openNew}>
              <PlusIcon aria-hidden="true" />
              Nova pergunta
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {form.perguntas.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border/80 bg-card/60 p-8 text-center">
              <p className="text-sm font-medium text-foreground">
                Nenhuma pergunta cadastrada
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Clique em "Nova pergunta" para começar a montar o formulário.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pergunta</TableHead>
                  <TableHead>Opções</TableHead>
                  <TableHead className="w-32 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {form.perguntas.map((pergunta) => (
                  <TableRow key={pergunta.id}>
                    <TableCell className="max-w-xl whitespace-normal font-medium">
                      {pergunta.enunciado}
                    </TableCell>
                    <TableCell className="max-w-xl whitespace-normal text-muted-foreground">
                      {pergunta.opcoes.join(" • ")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          title="Editar pergunta"
                          aria-label="Editar pergunta"
                          onClick={() => openEdit(pergunta)}
                        >
                          <PencilSimpleIcon aria-hidden="true" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                              title="Excluir pergunta"
                              aria-label="Excluir pergunta"
                            >
                              <TrashIcon aria-hidden="true" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir pergunta?</AlertDialogTitle>
                              <AlertDialogDescription>
                                A pergunta será removida do formulário.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleRemovePergunta(pergunta.id)}
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingId ? "Editar pergunta" : "Nova pergunta"}</DialogTitle>
            <DialogDescription>
              Cadastre o enunciado e ao menos duas opções de resposta.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="dialog-enunciado" className="text-sm font-medium">
                Enunciado
              </label>
              <Input
                id="dialog-enunciado"
                value={enunciado}
                onChange={(e) => setEnunciado(e.target.value)}
                placeholder="Digite o enunciado da pergunta…"
              />
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-foreground">Opções de resposta</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setOpcoes((current) => [...current, createOpcao()])}
                >
                  <PlusIcon aria-hidden="true" />
                  Adicionar opção
                </Button>
              </div>

              <div className="flex flex-col gap-2">
                {opcoes.map((opcao, index) => (
                  <div key={opcao.id} className="flex items-center gap-2">
                    <Input
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
                      placeholder={`Opção ${index + 1}`}
                    />
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
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSavePergunta} disabled={!isDialogValid}>
              {editingId ? "Salvar alterações" : "Adicionar pergunta"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
