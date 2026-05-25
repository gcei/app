import { useMemo, useState } from "react"
import { NavLink, useNavigate, useParams } from "react-router-dom"

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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { egressosInternosMockados } from "@/mocks/interno-cadastros"

export function InternoEgressoEditarPage() {
  const navigate = useNavigate()
  const { egressoId } = useParams()

  const egresso = useMemo(
    () => egressosInternosMockados.find((item) => item.id === egressoId),
    [egressoId]
  )

  const [nome, setNome] = useState(egresso?.nome ?? "")
  const [email, setEmail] = useState(egresso?.email ?? "")
  const [curso, setCurso] = useState(egresso?.curso ?? "")

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <NavLink to="/home/interno/egressos-cadastrados">Egressos cadastrados</NavLink>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Editar</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <CardTitle>Editar egresso</CardTitle>
          <CardDescription>Atualize nome, e-mail e curso do egresso cadastrado.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="editar-egresso-form"
            className="flex flex-col gap-4"
            onSubmit={(event) => {
              event.preventDefault()
              navigate("/home/interno/egressos-cadastrados")
            }}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="editar-egresso-nome" className="text-sm font-medium">
                  Nome
                </label>
                <Input
                  id="editar-egresso-nome"
                  name="nome"
                  autoComplete="name"
                  value={nome}
                  onChange={(event) => setNome(event.target.value)}
                  placeholder="Digite o nome do egresso…"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="editar-egresso-email" className="text-sm font-medium">
                  E-mail
                </label>
                <Input
                  id="editar-egresso-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  spellCheck={false}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Digite o e-mail do egresso…"
                />
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <label htmlFor="editar-egresso-curso" className="text-sm font-medium">
                  Curso
                </label>
                <Input
                  id="editar-egresso-curso"
                  name="curso"
                  autoComplete="off"
                  value={curso}
                  onChange={(event) => setCurso(event.target.value)}
                  placeholder="Digite o curso do egresso…"
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/home/interno/egressos-cadastrados")}
          >
            Cancelar
          </Button>
          <Button type="submit" form="editar-egresso-form">
            Salvar alterações
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
