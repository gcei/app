import { useMemo, useState } from "react"
import { DownloadSimpleIcon, TrashIcon } from "@phosphor-icons/react"

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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
  getForms,
  getRespostas,
  limparRespostas,
} from "@/lib/pesquisa-form-storage"

export function InternoPesquisaAnualPerguntasPage() {
  const [forms, setForms] = useState<PesquisaForm[]>(() => getForms())
  const [respostasByForm, setRespostasByForm] = useState<Record<string, number>>(() =>
    forms.reduce<Record<string, number>>((acc, f) => {
      acc[f.id] = getRespostas(f.id).length
      return acc
    }, {})
  )

  const totalForms = forms.length
  const ativos = useMemo(() => forms.filter((f) => f.ativo).length, [forms])

  const handleLimpar = (formId: string) => {
    limparRespostas(formId)
    setRespostasByForm((prev) => ({ ...prev, [formId]: 0 }))
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Formulários cadastrados</CardTitle>
          <CardDescription>
            {totalForms} formulário(s) — {ativos} ativo(s). Para criar, editar ou ativar
            formulários, acesse o painel da empresa em "Pesquisa do egresso".
          </CardDescription>
        </CardHeader>
        <CardContent>
          {totalForms === 0 ? (
            <div className="rounded-xl border border-dashed border-border/80 bg-card/60 p-8 text-center">
              <p className="text-sm font-medium text-foreground">
                Nenhum formulário cadastrado
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Os formulários cadastrados aparecerão aqui para consulta e exportação.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Formulário</TableHead>
                  <TableHead>Perguntas</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Respostas</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {forms.map((form) => {
                  const total = respostasByForm[form.id] ?? 0
                  return (
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
                      <TableCell>
                        <span
                          className={`text-xs font-medium ${
                            form.ativo ? "text-primary" : "text-muted-foreground"
                          }`}
                        >
                          {form.ativo ? "Ativo" : "Inativo"}
                        </span>
                      </TableCell>
                      <TableCell>{total}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1.5">
                          <ExportPesquisaDialog
                            form={form}
                            disabled={total === 0}
                            trigger={
                              <Button
                                variant="outline"
                                size="icon"
                                title="Exportar resultados"
                                aria-label="Exportar resultados"
                                disabled={total === 0}
                              >
                                <DownloadSimpleIcon aria-hidden="true" />
                              </Button>
                            }
                          />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                title="Limpar respostas"
                                aria-label="Limpar respostas"
                                disabled={total === 0}
                              >
                                <TrashIcon aria-hidden="true" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Limpar respostas?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Todas as respostas do formulário{" "}
                                  <span className="font-medium text-foreground">
                                    {form.titulo}
                                  </span>{" "}
                                  serão removidas. Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleLimpar(form.id)}>
                                  Limpar respostas
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
