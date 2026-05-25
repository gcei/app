import { useMemo } from "react"
import { NavLink, useParams } from "react-router-dom"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
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
import { getFormById, getRespostas } from "@/lib/pesquisa-form-storage"

function formatarData(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })
}

export function InternoPesquisaAnualRespostasEgressoPage() {
  const { egressoId } = useParams()

  const resposta = useMemo(
    () => getRespostas().find((r) => r.egressoCpf === egressoId),
    [egressoId]
  )

  const form = useMemo(
    () => (resposta ? getFormById(resposta.formId) : undefined),
    [resposta]
  )

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <NavLink to="/home/interno/pesquisa-anual/respostas">Respostas</NavLink>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{resposta?.egressoNome ?? "Egresso"}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <CardTitle>Respostas do egresso</CardTitle>
          <CardDescription>
            {resposta
              ? `Submetido em ${formatarData(resposta.submetidoEm)} por ${resposta.egressoNome}.`
              : "Nenhuma resposta encontrada para este egresso."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {resposta && form ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pergunta</TableHead>
                  <TableHead>Resposta</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {form.perguntas.map((pergunta) => (
                  <TableRow key={pergunta.id}>
                    <TableCell className="max-w-xl whitespace-normal font-medium">
                      {pergunta.enunciado}
                    </TableCell>
                    <TableCell>{resposta.respostas[pergunta.id] ?? "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="rounded-xl border border-dashed border-border/80 bg-card/60 p-8 text-center">
              <p className="text-sm font-medium text-foreground">
                Nenhuma resposta encontrada
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Este egresso ainda não respondeu ao formulário.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
