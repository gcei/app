import { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"

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
import { PasswordInput } from "@/components/ui/password-input"
import { useCreateUser } from "@/hooks/api/use-users"
import { ApiError } from "@/lib/api/http"

const LISTA_PATH = "/home/interno/usuarios"

export function EmpresaUsuarioNovoPage() {
  const navigate = useNavigate()
  const createUser = useCreateUser()
  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const [erro, setErro] = useState<string | null>(null)

  const update =
    (key: keyof typeof form) =>
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: event.target.value }))

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErro(null)
    createUser.mutate(
      {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role: "ADMIN",
      },
      {
        onSuccess: () => navigate(LISTA_PATH),
        onError: (err) => {
          if (err instanceof ApiError && err.status === 409) {
            setErro("Já existe uma conta com este e-mail.")
          } else if (err instanceof ApiError) {
            setErro(err.message)
          } else {
            setErro("Não foi possível criar o administrador.")
          }
        },
      },
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <NavLink to={LISTA_PATH}>Usuários</NavLink>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Novo administrador</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <CardTitle>Novo administrador</CardTitle>
          <CardDescription>
            Crie uma conta com acesso administrativo à plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="novo-admin-form"
            className="flex flex-col gap-4"
            onSubmit={handleSubmit}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="admin-nome" className="text-sm font-medium">
                  Nome
                </label>
                <Input
                  id="admin-nome"
                  name="name"
                  autoComplete="name"
                  value={form.name}
                  onChange={update("name")}
                  placeholder="Nome do administrador"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="admin-email" className="text-sm font-medium">
                  E-mail
                </label>
                <Input
                  id="admin-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  spellCheck={false}
                  value={form.email}
                  onChange={update("email")}
                  placeholder="email@dominio.com"
                  required
                />
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <label htmlFor="admin-senha" className="text-sm font-medium">
                  Senha
                </label>
                <PasswordInput
                  id="admin-senha"
                  name="password"
                  autoComplete="new-password"
                  value={form.password}
                  onChange={update("password")}
                  placeholder="Defina uma senha"
                  required
                />
              </div>
            </div>

            {erro ? (
              <p role="alert" className="whitespace-pre-line text-sm font-medium text-destructive">
                {erro}
              </p>
            ) : null}
          </form>
        </CardContent>
        <CardFooter className="justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate(LISTA_PATH)}>
            Cancelar
          </Button>
          <Button
            type="submit"
            form="novo-admin-form"
            disabled={createUser.isPending}
          >
            {createUser.isPending ? "Criando…" : "Criar administrador"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
