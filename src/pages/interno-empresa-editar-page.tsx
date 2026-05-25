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
import { empresasInternasMockadas } from "@/mocks/interno-cadastros"

export function InternoEmpresaEditarPage() {
  const navigate = useNavigate()
  const { empresaId } = useParams()

  const empresa = useMemo(
    () => empresasInternasMockadas.find((item) => item.id === empresaId),
    [empresaId]
  )

  const [nome, setNome] = useState(empresa?.nome ?? "")
  const [email, setEmail] = useState(empresa?.email ?? "")

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <NavLink to="/home/interno/empresas-cadastradas">Empresas cadastradas</NavLink>
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
          <CardTitle>Editar empresa</CardTitle>
          <CardDescription>Atualize nome e e-mail da empresa cadastrada.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="editar-empresa-form"
            className="flex flex-col gap-4"
            onSubmit={(event) => {
              event.preventDefault()
              navigate("/home/interno/empresas-cadastradas")
            }}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="editar-empresa-nome" className="text-sm font-medium">
                  Nome da empresa
                </label>
                <Input
                  id="editar-empresa-nome"
                  name="nome"
                  autoComplete="organization"
                  value={nome}
                  onChange={(event) => setNome(event.target.value)}
                  placeholder="Digite o nome da empresa…"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="editar-empresa-email" className="text-sm font-medium">
                  E-mail
                </label>
                <Input
                  id="editar-empresa-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  spellCheck={false}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Digite o e-mail da empresa…"
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/home/interno/empresas-cadastradas")}
          >
            Cancelar
          </Button>
          <Button type="submit" form="editar-empresa-form">
            Salvar alterações
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
