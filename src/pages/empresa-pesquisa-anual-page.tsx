import { useMemo, useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { DownloadSimpleIcon, PencilSimpleIcon, PlusIcon, TrashIcon } from "@phosphor-icons/react"

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
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ExportPesquisaDialog } from "@/components/export-pesquisa-dialog"
import {
  type PesquisaForm,
  createForm,
  deleteForm,
  getForms,
  getRespostas,
  setFormAtivo,
} from "@/lib/pesquisa-form-storage"

function formatarData(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })
}

export function EmpresaPesquisaAnualPage() {
  const navigate = useNavigate()
  const [forms, setForms] = useState<PesquisaForm[]>(() => getForms())
  const respostasCount = useMemo<Record<string, number>>(
    () =>
      forms.reduce<Record<string, number>>((acc, f) => {
        acc[f.id] = getRespostas(f.id).length
        return acc
      }, {}),
    [forms]
  )

  const handleToggleAtivo = (id: string, ativo: boolean) => {
    setForms(setFormAtivo(id, ativo))
  }

  const handleCreate = () => {
    const novo = createForm()
    setForms(getForms())
    navigate(`/home/empresas/pesquisa-anual/${novo.id}/editar`)
  }

  const handleDelete = (id: string) => {
    setForms(deleteForm(id))
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Gestão de Currículos de Egressos do IFAL
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">
            Pesquisa do egresso - Cadastre e ative formulários aplicados no login dos egressos.
          </p>
        </div>
        <Button onClick={handleCreate}>
          <PlusIcon aria-hidden="true" />
          Novo formulário
        </Button>
      </div>

      <Card>
        <CardContent>
          {forms.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border/80 bg-card/60 p-8 text-center">
              <p className="text-sm font-medium text-foreground">
                Nenhum formulário cadastrado
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Clique em "Novo formulário" para criar o primeiro.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Formulário</TableHead>
                  <TableHead>Perguntas</TableHead>
                  <TableHead>Respostas</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Última atualização</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {forms.map((form) => (
                  <TableRow key={form.id}>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="font-medium">{form.titulo}</span>
                        {form.descricao ? (
                          <span className="text-sm text-muted-foreground line-clamp-2">
                            {form.descricao}
                          </span>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell>{form.perguntas.length}</TableCell>
                    <TableCell>{respostasCount[form.id] ?? 0}</TableCell>
                    <TableCell>
                      <label className="flex items-center gap-2">
                        <Switch
                          checked={form.ativo}
                          onCheckedChange={(next) => handleToggleAtivo(form.id, next)}
                          aria-label={`Ativar formulário ${form.titulo}`}
                        />
                        <span
                          className={`text-xs font-medium ${
                            form.ativo ? "text-primary" : "text-muted-foreground"
                          }`}
                        >
                          {form.ativo ? "Ativo" : "Inativo"}
                        </span>
                      </label>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatarData(form.atualizadoEm)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1.5">
                        <ExportPesquisaDialog
                          form={form}
                          disabled={(respostasCount[form.id] ?? 0) === 0}
                          trigger={
                            <Button
                              variant="outline"
                              size="icon"
                              title="Exportar resultados"
                              aria-label="Exportar resultados"
                              disabled={(respostasCount[form.id] ?? 0) === 0}
                            >
                              <DownloadSimpleIcon aria-hidden="true" />
                            </Button>
                          }
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          asChild
                          title="Editar formulário"
                        >
                          <NavLink
                            to={`/home/empresas/pesquisa-anual/${form.id}/editar`}
                            aria-label="Editar formulário"
                          >
                            <PencilSimpleIcon aria-hidden="true" />
                          </NavLink>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                              title="Excluir formulário"
                              aria-label="Excluir formulário"
                            >
                              <TrashIcon aria-hidden="true" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir formulário</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir{" "}
                                <span className="font-medium text-foreground">
                                  {form.titulo}
                                </span>
                                ? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(form.id)}
                                className="bg-destructive text-white hover:bg-destructive/90"
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
    </div>
  )
}
