import { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import {
  ChartBarIcon,
  DownloadSimpleIcon,
  LinkIcon,
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
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useDeleteForm, useForms } from "@/hooks/api/use-forms"
import { exportFormResultsCsv } from "@/lib/api/forms"
import { apiErrorMessage } from "@/lib/api/http"
import type { FormListItem } from "@/lib/api/types"
import { downloadBlob } from "@/lib/download"

function formatDate(iso: string | null) {
  if (!iso) return "—"
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return "—"
  // As datas são salvas como meia-noite UTC (dia de calendário). Formatar em
  // UTC evita o "−1 dia" causado por fusos atrás de UTC (ex.: UTC-3).
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  })
}

function formStatus(form: FormListItem): string {
  const now = Date.now()
  const opens = new Date(form.opensAt).getTime()
  const closes = form.closesAt ? new Date(form.closesAt).getTime() : null
  if (now < opens) return "Agendado"
  if (closes && now > closes) return "Encerrado"
  return "Aberto"
}

export function EmpresaPesquisaAnualPage() {
  const navigate = useNavigate()
  const formsQuery = useForms()
  const deleteForm = useDeleteForm()
  const [busyId, setBusyId] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const forms = formsQuery.data?.data ?? []

  const handleExport = async (form: FormListItem) => {
    setActionError(null)
    setBusyId(form.id)
    try {
      const blob = await exportFormResultsCsv(form.id)
      downloadBlob(blob, `${form.title}-respostas.csv`)
    } catch (err) {
      setActionError(apiErrorMessage(err, "Não foi possível exportar as respostas."))
    } finally {
      setBusyId(null)
    }
  }

  const handleCopyLink = async (form: FormListItem) => {
    setActionError(null)
    const url = `${window.location.origin}/pesquisa/${form.slug}`
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      setActionError(`Link da pesquisa: ${url}`)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Gestão de Currículos de Egressos do IFAL
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">
            Pesquisa do egresso - Cadastre formulários e compartilhe o link com os
            egressos.
          </p>
        </div>
        <Button onClick={() => navigate("/home/interno/pesquisa-anual/novo")}>
          <PlusIcon aria-hidden="true" />
          Novo formulário
        </Button>
      </div>

      {actionError ? (
        <p role="alert" className="whitespace-pre-line text-sm font-medium text-destructive">
          {actionError}
        </p>
      ) : null}

      <Card>
        <CardContent>
          {formsQuery.isLoading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Carregando formulários…
            </p>
          ) : formsQuery.isError ? (
            <div className="flex flex-col items-center gap-3 py-8">
              <p className="text-sm text-destructive">
                Não foi possível carregar os formulários.
              </p>
              <Button variant="outline" size="sm" onClick={() => formsQuery.refetch()}>
                Tentar novamente
              </Button>
            </div>
          ) : forms.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border/80 bg-card/60 p-8 text-center">
              <p className="text-sm font-medium text-foreground">
                Nenhum formulário cadastrado
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Clique em “Novo formulário” para criar o primeiro.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Formulário</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Abre em</TableHead>
                  <TableHead>Fecha em</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {forms.map((form) => (
                  <TableRow key={form.id}>
                    <TableCell className="font-medium">{form.title}</TableCell>
                    <TableCell>{formStatus(form)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(form.opensAt)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(form.closesAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1.5">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleCopyLink(form)}
                          title="Copiar link de preenchimento"
                          aria-label="Copiar link de preenchimento"
                        >
                          <LinkIcon aria-hidden="true" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          asChild
                          title="Ver respostas"
                        >
                          <NavLink
                            to={`/home/interno/pesquisa-anual/${form.id}/respostas`}
                            aria-label="Ver respostas"
                          >
                            <ChartBarIcon aria-hidden="true" />
                          </NavLink>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleExport(form)}
                          disabled={busyId === form.id}
                          title="Exportar respostas (CSV)"
                          aria-label="Exportar respostas (CSV)"
                        >
                          <DownloadSimpleIcon aria-hidden="true" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          asChild
                          title="Editar formulário"
                        >
                          <NavLink
                            to={`/home/interno/pesquisa-anual/${form.id}/editar`}
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
                                  {form.title}
                                </span>
                                ? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  deleteForm.mutate(form.id, {
                                    onError: (err) =>
                                      setActionError(
                                        apiErrorMessage(
                                          err,
                                          "Não foi possível excluir o formulário.",
                                        ),
                                      ),
                                  })
                                }
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
