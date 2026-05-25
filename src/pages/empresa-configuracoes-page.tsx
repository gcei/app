import { useState } from "react"
import { useOutletContext } from "react-router-dom"

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
import { Switch } from "@/components/ui/switch"

type EmpresaConfiguracoesState = {
  nome: string
  email: string
  exibirNome: boolean
  exibirEmail: boolean
  senhaAtual: string
  novaSenha: string
  confirmarSenha: string
}

const initialState: EmpresaConfiguracoesState = {
  nome: "Usuário parceiro",
  email: "contato@ifal.com.br",
  exibirNome: false,
  exibirEmail: false,
  senhaAtual: "",
  novaSenha: "",
  confirmarSenha: "",
}

export function EmpresaConfiguracoesPage() {
  const [formState, setFormState] = useState<EmpresaConfiguracoesState>(initialState)
  const [mensagemPerfil, setMensagemPerfil] = useState("")
  const updateSidebarData = useOutletContext<(data: { nome: string; email: string }) => void>()
  const [mensagemSenha, setMensagemSenha] = useState("")

  const empresaConfidencial = !formState.exibirNome && !formState.exibirEmail

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Gestão de Currículos de Egressos do IFAL
        </h1>
        <p className="text-sm leading-6 text-muted-foreground">
          Configurações - Gerencie seu perfil de acesso.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Perfil do usuário</CardTitle>
          <CardDescription>
            Configure seu perfil.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="empresa-perfil-form"
            className="flex flex-col gap-6"
            onSubmit={(event) => {
              event.preventDefault()
              updateSidebarData({ nome: formState.nome, email: formState.email })
              setMensagemPerfil("Dados do usuário atualizados.")
            }}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="empresa-nome" className="text-sm font-medium">
                  Nome do usuário
                </label>
                <Input
                  id="empresa-nome"
                  name="nome"
                  autoComplete="organization"
                  value={formState.nome}
                  onChange={(event) => {
                    setFormState((current) => ({ ...current, nome: event.target.value }))
                    setMensagemPerfil("")
                  }}
                  placeholder="Digite o nome do usuário…"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="empresa-email" className="text-sm font-medium">
                  E-mail
                </label>
                <Input
                  id="empresa-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  spellCheck={false}
                  value={formState.email}
                  onChange={(event) => {
                    setFormState((current) => ({ ...current, email: event.target.value }))
                    setMensagemPerfil("")
                  }}
                  placeholder="Digite o e-mail do usuário…"
                />
              </div>
            </div>

          </form>
        </CardContent>
        <CardFooter className="justify-between gap-3">
          <p aria-live="polite" className="text-sm text-muted-foreground">
            {mensagemPerfil}
          </p>
          <Button type="submit" form="empresa-perfil-form">
            Salvar perfil
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Senha</CardTitle>
          <CardDescription>
            Atualize a senha de acesso da conta do usuário.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="empresa-senha-form"
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
                <label htmlFor="empresa-senha-atual" className="text-sm font-medium">
                  Senha atual
                </label>
                <Input
                  id="empresa-senha-atual"
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
                <label htmlFor="empresa-nova-senha" className="text-sm font-medium">
                  Nova senha
                </label>
                <Input
                  id="empresa-nova-senha"
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
                <label htmlFor="empresa-confirmar-senha" className="text-sm font-medium">
                  Confirmar nova senha
                </label>
                <Input
                  id="empresa-confirmar-senha"
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
          <Button type="submit" form="empresa-senha-form">
            Atualizar senha
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
