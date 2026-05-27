import { NavLink } from "react-router-dom"

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
import { useUpdateUser, useUsers } from "@/hooks/api/use-users"

/**
 * Egressos = usuários com role STUDENT. `GET /users` não tem filtro por papel,
 * então buscamos e filtramos STUDENT no client. A API não expõe `course`, então
 * a coluna passou a mostrar a cidade.
 *
 * ⚠️ Bloquear/desbloquear chama `PATCH /users/{id}` com `{ blocked }`, mas o
 * `UpdateUserDto` do backend ainda não aceita esse campo — o toggle só terá
 * efeito quando a API expô-lo (ver `UpdateUserPayload.blocked`).
 */
export function EmpresaEgressosCadastradosPage() {
  // `blocked`/`unavailable` são flags de INCLUSÃO: sem elas o `GET /users`
  // esconde egressos bloqueados/indisponíveis. Como é uma lista de cadastro
  // (todos devem aparecer), incluímos ambos; o botão alterna Bloquear/Desbloquear
  // conforme `blocked`.
  const usersQuery = useUsers({ size: 100, blocked: true, unavailable: true })
  const updateUser = useUpdateUser()

  const egressos = (usersQuery.data?.data ?? []).filter(
    (user) => user.role === "STUDENT",
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Gestão de Currículos de Egressos do IFAL
        </h1>
        <p className="text-sm leading-6 text-muted-foreground">
          Egressos cadastrados - Visualize, edite e gerencie o acesso dos egressos.
        </p>
      </div>

      <Card>
        <CardContent>
          {usersQuery.isLoading ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Carregando egressos…
            </p>
          ) : usersQuery.isError ? (
            <p className="py-10 text-center text-sm text-destructive">
              Não foi possível carregar os egressos.
            </p>
          ) : egressos.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Nenhum egresso cadastrado.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Egresso</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Cidade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {egressos.map((egresso) => {
                  const salvandoEste =
                    updateUser.isPending &&
                    updateUser.variables?.id === egresso.id
                  return (
                    <TableRow key={egresso.id}>
                      <TableCell className="font-medium">{egresso.name}</TableCell>
                      <TableCell>{egresso.email}</TableCell>
                      <TableCell>{egresso.city ?? "—"}</TableCell>
                      <TableCell>
                        {egresso.blocked ? "Bloqueado" : "Ativo"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={salvandoEste}
                            onClick={() =>
                              updateUser.mutate({
                                id: egresso.id,
                                payload: { blocked: !egresso.blocked },
                              })
                            }
                          >
                            {salvandoEste
                              ? "Salvando…"
                              : egresso.blocked
                                ? "Desbloquear"
                                : "Bloquear"}
                          </Button>
                          <Button asChild variant="outline" size="sm">
                            <NavLink
                              to={`/home/interno/egressos-cadastrados/${egresso.id}/editar`}
                            >
                              Editar
                            </NavLink>
                          </Button>
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
