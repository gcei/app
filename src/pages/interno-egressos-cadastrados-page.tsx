import { useState } from "react"
import { NavLink } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { egressosInternosMockados } from "@/mocks/interno-cadastros"

export function InternoEgressosCadastradosPage() {
  const [egressos, setEgressos] = useState(egressosInternosMockados)

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Egresso</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {egressos.map((egresso) => (
                <TableRow key={egresso.id}>
                  <TableCell className="font-medium">{egresso.nome}</TableCell>
                  <TableCell>{egresso.email}</TableCell>
                  <TableCell>{egresso.curso}</TableCell>
                  <TableCell>{egresso.status}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setEgressos((current) =>
                            current.map((item) =>
                              item.id === egresso.id
                                ? {
                                    ...item,
                                    status: item.status === "Ativo" ? "Bloqueado" : "Ativo",
                                  }
                                : item
                            )
                          )
                        }
                      >
                        {egresso.status === "Ativo" ? "Bloquear" : "Desbloquear"}
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <NavLink to={`/home/interno/egressos-cadastrados/${egresso.id}/editar`}>
                          Editar
                        </NavLink>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink href="/home/interno/egressos-cadastrados?pagina=1" isActive>
              1
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
