import { useState } from "react"

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

type InternoConfiguracoesState = {
  nome: string
  email: string
  senhaAtual: string
  novaSenha: string
  confirmarSenha: string
}

const initialState: InternoConfiguracoesState = {
  nome: "Acesso interno",
  email: "interno@ifal.edu.br",
  senhaAtual: "",
  novaSenha: "",
  confirmarSenha: "",
}

export function InternoConfiguracoesPage() {
  const [formState, setFormState] = useState<InternoConfiguracoesState>(initialState)
  const [mensagemPerfil, setMensagemPerfil] = useState("")
  const [mensagemSenha, setMensagemSenha] = useState("")

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Dados do acesso</CardTitle>
          <CardDescription>
            Atualize nome e e-mail do acesso interno.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="interno-perfil-form"
            className="flex flex-col gap-4"
            onSubmit={(event) => {
              event.preventDefault()
              setMensagemPerfil("Dados atualizados.")
            }}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="interno-nome" className="text-sm font-medium">
                  Nome
                </label>
                <Input
                  id="interno-nome"
                  name="nome"
                  autoComplete="name"
                  value={formState.nome}
                  onChange={(event) => {
                    setFormState((current) => ({ ...current, nome: event.target.value }))
                    setMensagemPerfil("")
                  }}
                  placeholder="Digite o nome do acesso…"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="interno-email" className="text-sm font-medium">
                  E-mail
                </label>
                <Input
                  id="interno-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  spellCheck={false}
                  value={formState.email}
                  onChange={(event) => {
                    setFormState((current) => ({ ...current, email: event.target.value }))
                    setMensagemPerfil("")
                  }}
                  placeholder="Digite o e-mail do acesso…"
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="justify-between gap-3">
          <p aria-live="polite" className="text-sm text-muted-foreground">
            {mensagemPerfil}
          </p>
          <Button type="submit" form="interno-perfil-form">
            Salvar dados
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Senha</CardTitle>
          <CardDescription>
            Atualize a senha de acesso da área interna.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="interno-senha-form"
            className="flex flex-col gap-4"
            onSubmit={(event) => {
              event.preventDefault()
              setMensagemSenha("Senha atualizada.")
              setFormState((current) => ({
                ...current,
                senhaAtual: "",
                novaSenha: "",
                confirmarSenha: "",
              }))
            }}
          >
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex flex-col gap-2">
                <label htmlFor="interno-senha-atual" className="text-sm font-medium">
                  Senha atual
                </label>
                <Input
                  id="interno-senha-atual"
                  name="senha_atual"
                  type="password"
                  autoComplete="current-password"
                  value={formState.senhaAtual}
                  onChange={(event) => {
                    setFormState((current) => ({
                      ...current,
                      senhaAtual: event.target.value,
                    }))
                    setMensagemSenha("")
                  }}
                  placeholder="Digite a senha atual…"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="interno-nova-senha" className="text-sm font-medium">
                  Nova senha
                </label>
                <Input
                  id="interno-nova-senha"
                  name="nova_senha"
                  type="password"
                  autoComplete="new-password"
                  value={formState.novaSenha}
                  onChange={(event) => {
                    setFormState((current) => ({
                      ...current,
                      novaSenha: event.target.value,
                    }))
                    setMensagemSenha("")
                  }}
                  placeholder="Digite a nova senha…"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="interno-confirmar-senha" className="text-sm font-medium">
                  Confirmar nova senha
                </label>
                <Input
                  id="interno-confirmar-senha"
                  name="confirmar_senha"
                  type="password"
                  autoComplete="new-password"
                  value={formState.confirmarSenha}
                  onChange={(event) => {
                    setFormState((current) => ({
                      ...current,
                      confirmarSenha: event.target.value,
                    }))
                    setMensagemSenha("")
                  }}
                  placeholder="Confirme a nova senha…"
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="justify-between gap-3">
          <p aria-live="polite" className="text-sm text-muted-foreground">
            {mensagemSenha}
          </p>
          <Button type="submit" form="interno-senha-form">
            Atualizar senha
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
