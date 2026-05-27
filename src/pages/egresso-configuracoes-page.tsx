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
import { useAuth } from "@/contexts/AuthContext"
import { useUpdateUser } from "@/hooks/api/use-users"
import { apiErrorMessage } from "@/lib/api/http"
import type { User } from "@/lib/api/types"

export function EgressoConfiguracoesPage() {
  const { user, isLoading } = useAuth()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Gestão de Currículos de Egressos do IFAL
        </h1>
        <p className="text-sm leading-6 text-muted-foreground">
          Configurações - Atualize seus dados de acesso.
        </p>
      </div>
      {isLoading || !user ? (
        <p className="text-sm text-muted-foreground">Carregando perfil…</p>
      ) : (
        // Remonta o form quando o usuário carrega, inicializando o estado a
        // partir dos dados (evita set-state em effect).
        <PerfilForm key={user.id} user={user} />
      )}
    </div>
  )
}

function PerfilForm({ user }: { user: User }) {
  const updateUser = useUpdateUser()
  const [mensagem, setMensagem] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(
    null,
  )
  const [formState, setFormState] = useState({
    nome: user.name ?? "",
    email: user.email ?? "",
    cidade: user.city ?? "",
    telefone: user.phoneNumber ?? "",
  })

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMensagem(null)
    updateUser.mutate(
      {
        id: user.id,
        payload: {
          name: formState.nome.trim(),
          email: formState.email.trim(),
          city: formState.cidade.trim(),
          phoneNumber: formState.telefone.trim(),
        },
      },
      {
        onSuccess: () =>
          setMensagem({ tipo: "ok", texto: "Dados do perfil atualizados." }),
        onError: (err) =>
          setMensagem({
            tipo: "erro",
            texto: apiErrorMessage(
              err,
              "Não foi possível atualizar o perfil. Tente novamente.",
            ),
          }),
      },
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados do perfil</CardTitle>
        <CardDescription>
          Atualize seu nome e e-mail exibidos na plataforma.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="perfil-form" className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="configuracao-nome" className="text-sm font-medium">
                Nome
              </label>
              <Input
                id="configuracao-nome"
                name="nome"
                autoComplete="name"
                value={formState.nome}
                onChange={(event) => {
                  setFormState((current) => ({ ...current, nome: event.target.value }))
                  setMensagem(null)
                }}
                placeholder="Digite seu nome completo…"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="configuracao-email" className="text-sm font-medium">
                E-mail
              </label>
              <Input
                id="configuracao-email"
                name="email"
                type="email"
                autoComplete="email"
                spellCheck={false}
                value={formState.email}
                onChange={(event) => {
                  setFormState((current) => ({ ...current, email: event.target.value }))
                  setMensagem(null)
                }}
                placeholder="Digite seu e-mail…"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="configuracao-telefone" className="text-sm font-medium">
                Telefone
              </label>
              <Input
                id="configuracao-telefone"
                name="telefone"
                type="tel"
                autoComplete="tel"
                value={formState.telefone}
                onChange={(event) => {
                  setFormState((current) => ({
                    ...current,
                    telefone: event.target.value,
                  }))
                  setMensagem(null)
                }}
                placeholder="(00) 00000-0000"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="configuracao-cidade" className="text-sm font-medium">
                Cidade
              </label>
              <Input
                id="configuracao-cidade"
                name="cidade"
                autoComplete="address-level2"
                value={formState.cidade}
                onChange={(event) => {
                  setFormState((current) => ({
                    ...current,
                    cidade: event.target.value,
                  }))
                  setMensagem(null)
                }}
                placeholder="Ex.: Maceió"
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="justify-between gap-3">
        <p
          aria-live="polite"
          className={`text-sm ${
            mensagem?.tipo === "erro" ? "text-destructive" : "text-muted-foreground"
          }`}
        >
          {mensagem?.texto ?? ""}
        </p>
        <Button type="submit" form="perfil-form" disabled={updateUser.isPending}>
          {updateUser.isPending ? "Salvando…" : "Salvar perfil"}
        </Button>
      </CardFooter>
    </Card>
  )
}
