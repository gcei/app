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
import { PasswordInput } from "@/components/ui/password-input"
import { useAuth } from "@/contexts/AuthContext"
import { useUpdateUser } from "@/hooks/api/use-users"
import { apiErrorMessage } from "@/lib/api/http"
import {
  isValidPhone,
  maskPhone,
  onlyDigits,
  PHONE_INVALID_MESSAGE,
  PHONE_MAX_LENGTH,
} from "@/lib/phone"
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
        // Remonta os forms quando o usuário carrega, inicializando o estado a
        // partir dos dados (evita set-state em effect).
        <>
          <PerfilForm key={user.id} user={user} />
          <SenhaForm key={`${user.id}-senha`} user={user} />
        </>
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
    // Normaliza o valor salvo (pode vir só com dígitos) reaplicando a máscara.
    telefone: maskPhone(user.phoneNumber ?? ""),
  })

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMensagem(null)

    // Telefone é opcional: só valida quando preenchido (10 ou 11 dígitos).
    if (!isValidPhone(formState.telefone)) {
      setMensagem({ tipo: "erro", texto: PHONE_INVALID_MESSAGE })
      return
    }

    updateUser.mutate(
      {
        id: user.id,
        payload: {
          name: formState.nome.trim(),
          email: formState.email.trim(),
          city: formState.cidade.trim(),
          // Envia apenas os dígitos; a máscara é puramente visual.
          phoneNumber: onlyDigits(formState.telefone),
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
                inputMode="numeric"
                autoComplete="tel"
                value={formState.telefone}
                onChange={(event) => {
                  setFormState((current) => ({
                    ...current,
                    telefone: maskPhone(event.target.value),
                  }))
                  setMensagem(null)
                }}
                placeholder="(00) 00000-0000"
                maxLength={PHONE_MAX_LENGTH}
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
          className={`whitespace-pre-line text-sm ${
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

function SenhaForm({ user }: { user: User }) {
  const updatePassword = useUpdateUser()
  const [mensagem, setMensagem] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(
    null,
  )
  const [senha, setSenha] = useState({ novaSenha: "", confirmarSenha: "" })

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMensagem(null)

    // Validação client-side mínima; a força da senha é validada no backend.
    if (senha.novaSenha.length < 6) {
      setMensagem({
        tipo: "erro",
        texto: "A nova senha deve ter ao menos 6 caracteres.",
      })
      return
    }
    if (senha.novaSenha !== senha.confirmarSenha) {
      setMensagem({ tipo: "erro", texto: "As senhas não coincidem." })
      return
    }

    updatePassword.mutate(
      { id: user.id, payload: { password: senha.novaSenha } },
      {
        onSuccess: () => {
          setMensagem({ tipo: "ok", texto: "Senha atualizada." })
          setSenha({ novaSenha: "", confirmarSenha: "" })
        },
        onError: (err) =>
          setMensagem({
            tipo: "erro",
            texto: apiErrorMessage(err, "Não foi possível atualizar a senha."),
          }),
      },
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Senha</CardTitle>
        <CardDescription>Atualize a senha de acesso da sua conta.</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="senha-form" className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="configuracao-nova-senha" className="text-sm font-medium">
                Nova senha
              </label>
              <PasswordInput
                id="configuracao-nova-senha"
                name="nova_senha"
                autoComplete="new-password"
                value={senha.novaSenha}
                onChange={(event) => {
                  setSenha((current) => ({ ...current, novaSenha: event.target.value }))
                  setMensagem(null)
                }}
                placeholder="Digite a nova senha…"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="configuracao-confirmar-senha"
                className="text-sm font-medium"
              >
                Confirmar nova senha
              </label>
              <PasswordInput
                id="configuracao-confirmar-senha"
                name="confirmar_senha"
                autoComplete="new-password"
                value={senha.confirmarSenha}
                onChange={(event) => {
                  setSenha((current) => ({
                    ...current,
                    confirmarSenha: event.target.value,
                  }))
                  setMensagem(null)
                }}
                placeholder="Confirme a nova senha…"
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="justify-between gap-3">
        <p
          aria-live="polite"
          className={`whitespace-pre-line text-sm ${
            mensagem?.tipo === "erro" ? "text-destructive" : "text-muted-foreground"
          }`}
        >
          {mensagem?.texto ?? ""}
        </p>
        <Button type="submit" form="senha-form" disabled={updatePassword.isPending}>
          {updatePassword.isPending ? "Salvando…" : "Atualizar senha"}
        </Button>
      </CardFooter>
    </Card>
  )
}
