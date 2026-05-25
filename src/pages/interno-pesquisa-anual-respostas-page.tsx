import { useMemo } from "react"
import { NavLink } from "react-router-dom"

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
import { getRespostas } from "@/lib/pesquisa-form-storage"

function formatarData(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })
}

export function InternoPesquisaAnualRespostasPage() {
  const respostas = useMemo(() => getRespostas(), [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Respostas por egresso</CardTitle>
        <CardDescription>
          Acompanhe quais egressos responderam à pesquisa e acesse o detalhamento individual.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {respostas.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/80 bg-card/60 p-8 text-center">
            <p className="text-sm font-medium text-foreground">
              Nenhuma resposta recebida ainda
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              As respostas aparecerão aqui assim que os egressos preencherem o formulário.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Egresso</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>Submetido em</TableHead>
                <TableHead className="text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {respostas.map((resposta) => (
                <TableRow key={resposta.id}>
                  <TableCell className="font-medium">{resposta.egressoNome}</TableCell>
                  <TableCell>{resposta.egressoCpf || "—"}</TableCell>
                  <TableCell>{formatarData(resposta.submetidoEm)}</TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                      <NavLink
                        to={`/home/interno/pesquisa-anual/respostas/${resposta.egressoCpf}`}
                      >
                        Ver respostas
                      </NavLink>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
