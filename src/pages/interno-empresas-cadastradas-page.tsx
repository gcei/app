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
import { empresasInternasMockadas } from "@/mocks/interno-cadastros"

export function InternoEmpresasCadastradasPage() {
  const [empresas, setEmpresas] = useState(empresasInternasMockadas)

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Cadastrada em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {empresas.map((empresa) => (
                <TableRow key={empresa.id}>
                  <TableCell className="font-medium">{empresa.nome}</TableCell>
                  <TableCell>{empresa.email}</TableCell>
                  <TableCell>{empresa.status}</TableCell>
                  <TableCell>{empresa.cadastradaEm}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setEmpresas((current) =>
                            current.map((item) =>
                              item.id === empresa.id
                                ? {
                                    ...item,
                                    status: item.status === "Ativa" ? "Bloqueada" : "Ativa",
                                  }
                                : item
                            )
                          )
                        }
                      >
                        {empresa.status === "Ativa" ? "Bloquear" : "Desbloquear"}
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <NavLink to={`/home/interno/empresas-cadastradas/${empresa.id}/editar`}>
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
            <PaginationLink href="/home/interno/empresas-cadastradas?pagina=1" isActive>
              1
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
