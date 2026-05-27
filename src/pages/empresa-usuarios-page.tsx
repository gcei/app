import { useNavigate } from "react-router-dom"
import { PlusIcon } from "@phosphor-icons/react"

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
import { useUsers } from "@/hooks/api/use-users"

function formatDate(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return "—"
  // Formata em UTC para o dia bater com o armazenado (evita o "−1 dia" em
  // fusos atrás de UTC, ex.: UTC-3).
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  })
}

/**
 * Lista os administradores (role ADMIN). O `GET /users` não filtra por papel,
 * então filtramos no client; `blocked`/`unavailable` garantem que todos
 * apareçam.
 */
export function EmpresaUsuariosPage() {
  const navigate = useNavigate()
  const usersQuery = useUsers({ size: 100, blocked: true, unavailable: true })
  const admins = (usersQuery.data?.data ?? []).filter(
    (user) => user.role === "ADMIN",
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Gestão de Currículos de Egressos do IFAL
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">
            Usuários - Administradores com acesso à plataforma.
          </p>
        </div>
        <Button onClick={() => navigate("/home/interno/usuarios/novo")}>
          <PlusIcon aria-hidden="true" />
          Novo administrador
        </Button>
      </div>

      <Card>
        <CardContent>
          {usersQuery.isLoading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Carregando usuários…
            </p>
          ) : usersQuery.isError ? (
            <div className="flex flex-col items-center gap-3 py-8">
              <p className="text-sm text-destructive">
                Não foi possível carregar os usuários.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => usersQuery.refetch()}
              >
                Tentar novamente
              </Button>
            </div>
          ) : admins.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Nenhum administrador cadastrado.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Administrador</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Cadastrado em</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell className="font-medium">{admin.name}</TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(admin.createdAt)}
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
