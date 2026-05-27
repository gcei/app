import { useState } from "react"
import { NavLink, useParams } from "react-router-dom"
import { DownloadSimpleIcon } from "@phosphor-icons/react"

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  useForm,
  useFormResults,
  useFormResultsStats,
} from "@/hooks/api/use-forms"
import { exportFormResultsCsv } from "@/lib/api/forms"
import { apiErrorMessage } from "@/lib/api/http"
import { downloadBlob } from "@/lib/download"

function formatDateTime(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })
}

export function EmpresaPesquisaAnualRespostasPage() {
  const { formId } = useParams()
  const formQuery = useForm(formId)
  const statsQuery = useFormResultsStats(formId)
  const resultsQuery = useFormResults(formId)
  const [exporting, setExporting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const stats = statsQuery.data
  const results = resultsQuery.data?.data ?? []

  const handleExport = async () => {
    if (!formId) return
    setError(null)
    setExporting(true)
    try {
      const blob = await exportFormResultsCsv(formId)
      downloadBlob(blob, `${formQuery.data?.title ?? "respostas"}-respostas.csv`)
    } catch (err) {
      setError(apiErrorMessage(err, "Não foi possível exportar as respostas."))
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <NavLink to="/home/interno/pesquisa-anual">Formulários</NavLink>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Respostas</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {formQuery.data?.title ?? "Respostas"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {stats ? `${stats.totalSubmissions} submissão(ões)` : "Carregando…"}
          </p>
        </div>
        <Button onClick={handleExport} disabled={exporting} variant="outline">
          <DownloadSimpleIcon aria-hidden="true" />
          {exporting ? "Exportando…" : "Exportar CSV"}
        </Button>
      </div>

      {error ? (
        <p role="alert" className="whitespace-pre-line text-sm font-medium text-destructive">
          {error}
        </p>
      ) : null}

      {/* Estatísticas por pergunta */}
      <Card>
        <CardHeader>
          <CardTitle>Estatísticas</CardTitle>
          <CardDescription>Distribuição das respostas por pergunta.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {statsQuery.isLoading ? (
            <p className="text-sm text-muted-foreground">Carregando estatísticas…</p>
          ) : !stats || stats.questions.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Ainda não há respostas para exibir.
            </p>
          ) : (
            stats.questions.map((question) => (
              <div key={question.id} className="flex flex-col gap-2">
                <p className="text-sm font-medium text-foreground">
                  {question.title}
                </p>
                <div className="flex flex-col gap-1.5">
                  {question.options.map((option) => (
                    <div key={option.id} className="flex flex-col gap-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{option.title}</span>
                        <span className="text-muted-foreground">
                          {option.totalAnswers} (
                          {Math.round(option.percentageOfQuestionAnswers)}%)
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{
                            width: `${Math.min(100, option.percentageOfQuestionAnswers)}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Submissões por egresso */}
      <Card>
        <CardHeader>
          <CardTitle>Respostas por egresso</CardTitle>
        </CardHeader>
        <CardContent>
          {resultsQuery.isLoading ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Carregando respostas…
            </p>
          ) : results.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Nenhuma resposta recebida ainda.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Egresso</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Enviado em</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell className="font-medium">{result.user.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {result.user.email}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDateTime(result.createdAt)}
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
