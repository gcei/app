import { NavLink } from "react-router-dom"

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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { contatosVagasMockados, vagasMockadas } from "@/mocks/egresso-vagas"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export function EgressoVagasPage() {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Contatos das vagas</CardTitle>
          <CardDescription>
            Clique em um contato para abrir a conversa com a empresa.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead>Vaga</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Recebido em</TableHead>
                <TableHead className="text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contatosVagasMockados.map((contato) => (
                <TableRow key={contato.id}>
                  <TableCell className="font-medium">{contato.empresa}</TableCell>
                  <TableCell>{contato.vaga}</TableCell>
                  <TableCell>{contato.status}</TableCell>
                  <TableCell>{contato.momento}</TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                      <NavLink to={`/home/egresso/vagas/contatos/${contato.id}`}>
                        Abrir contato
                      </NavLink>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious text="Anterior" href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">
                  2
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext text="Próximo" href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>
      </Card>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Vagas disponíveis
          </h1>
        </div>

        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {vagasMockadas.map((vaga) => (
            <Card key={vaga.id} className="border py-0 ring-0 shadow-none">
              <CardHeader className="border-b py-6">
                <CardDescription>{vaga.empresa}</CardDescription>
                <CardTitle className="text-base">{vaga.titulo}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 py-6">
                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                  <span className="rounded-md border px-2 py-1">{vaga.localidade}</span>
                  <span className="rounded-md border px-2 py-1">{vaga.modalidade}</span>
                  <span className="rounded-md border px-2 py-1">{vaga.regime}</span>
                </div>
                <p className="text-sm leading-6 text-muted-foreground">
                  {vaga.resumo}
                </p>
                <Button asChild variant="outline" className="w-full">
                  <NavLink to={`/home/egresso/vagas/${vaga.id}`}>
                    Ver detalhes
                  </NavLink>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious text="Anterior" href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext text="Próximo" href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </section>
    </div>
  )
}
