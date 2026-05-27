import { useState } from "react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
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
import { useDeleteUser, useUpdateUser } from "@/hooks/api/use-users"
import { apiErrorMessage } from "@/lib/api/http"

export function EmpresaConfiguracoesPage() {
  const { user, logout } = useAuth()
  const updateProfile = useUpdateUser()
  const updatePassword = useUpdateUser()
  const deleteAccount = useDeleteUser()

  const [perfil, setPerfil] = useState({
    nome: user?.name ?? "",
    email: user?.email ?? "",
  })
  const [senha, setSenha] = useState({ novaSenha: "", confirmarSenha: "" })
  const [mensagemPerfil, setMensagemPerfil] = useState<
    { tipo: "ok" | "erro"; texto: string } | null
  >(null)
  const [mensagemSenha, setMensagemSenha] = useState<
    { tipo: "ok" | "erro"; texto: string } | null
  >(null)
  const [erroExcluir, setErroExcluir] = useState<string | null>(null)

  const handleSavePerfil = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!user) return
    setMensagemPerfil(null)
    updateProfile.mutate(
      {
        id: user.id,
        payload: { name: perfil.nome.trim(), email: perfil.email.trim() },
      },
      {
        onSuccess: () =>
          setMensagemPerfil({ tipo: "ok", texto: "Dados do usuário atualizados." }),
        onError: (err) =>
          setMensagemPerfil({
            tipo: "erro",
            texto: apiErrorMessage(err, "Não foi possível atualizar o perfil."),
          }),
      },
    )
  }

  const handleSaveSenha = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!user) return
    setMensagemSenha(null)
    if (senha.novaSenha.length < 6) {
      setMensagemSenha({
        tipo: "erro",
        texto: "A nova senha deve ter ao menos 6 caracteres.",
      })
      return
    }
    if (senha.novaSenha !== senha.confirmarSenha) {
      setMensagemSenha({ tipo: "erro", texto: "As senhas não coincidem." })
      return
    }
    updatePassword.mutate(
      { id: user.id, payload: { password: senha.novaSenha } },
      {
        onSuccess: () => {
          setMensagemSenha({ tipo: "ok", texto: "Senha atualizada." })
          setSenha({ novaSenha: "", confirmarSenha: "" })
        },
        onError: (err) =>
          setMensagemSenha({
            tipo: "erro",
            texto: apiErrorMessage(err, "Não foi possível atualizar a senha."),
          }),
      },
    )
  }

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
          <CardDescription>Atualize seu nome e e-mail.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="empresa-perfil-form"
            className="flex flex-col gap-6"
            onSubmit={handleSavePerfil}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="empresa-nome" className="text-sm font-medium">
                  Nome do usuário
                </label>
                <Input
                  id="empresa-nome"
                  name="nome"
                  autoComplete="name"
                  value={perfil.nome}
                  onChange={(event) => {
                    setPerfil((c) => ({ ...c, nome: event.target.value }))
                    setMensagemPerfil(null)
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
                  value={perfil.email}
                  onChange={(event) => {
                    setPerfil((c) => ({ ...c, email: event.target.value }))
                    setMensagemPerfil(null)
                  }}
                  placeholder="Digite o e-mail do usuário…"
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="justify-between gap-3">
          <p
            aria-live="polite"
            className={`whitespace-pre-line text-sm ${
              mensagemPerfil?.tipo === "erro"
                ? "text-destructive"
                : "text-muted-foreground"
            }`}
          >
            {mensagemPerfil?.texto ?? ""}
          </p>
          <Button
            type="submit"
            form="empresa-perfil-form"
            disabled={updateProfile.isPending}
          >
            {updateProfile.isPending ? "Salvando…" : "Salvar perfil"}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Senha</CardTitle>
          <CardDescription>Atualize a senha de acesso da conta.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="empresa-senha-form"
            className="flex flex-col gap-4"
            onSubmit={handleSaveSenha}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="empresa-nova-senha" className="text-sm font-medium">
                  Nova senha
                </label>
                <PasswordInput
                  id="empresa-nova-senha"
                  name="nova_senha"
                  autoComplete="new-password"
                  value={senha.novaSenha}
                  onChange={(event) => {
                    setSenha((c) => ({ ...c, novaSenha: event.target.value }))
                    setMensagemSenha(null)
                  }}
                  placeholder="Digite a nova senha…"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="empresa-confirmar-senha" className="text-sm font-medium">
                  Confirmar nova senha
                </label>
                <PasswordInput
                  id="empresa-confirmar-senha"
                  name="confirmar_senha"
                  autoComplete="new-password"
                  value={senha.confirmarSenha}
                  onChange={(event) => {
                    setSenha((c) => ({ ...c, confirmarSenha: event.target.value }))
                    setMensagemSenha(null)
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
              mensagemSenha?.tipo === "erro"
                ? "text-destructive"
                : "text-muted-foreground"
            }`}
          >
            {mensagemSenha?.texto ?? ""}
          </p>
          <Button
            type="submit"
            form="empresa-senha-form"
            disabled={updatePassword.isPending}
          >
            {updatePassword.isPending ? "Salvando…" : "Atualizar senha"}
          </Button>
        </CardFooter>
      </Card>

      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle>Excluir conta</CardTitle>
          <CardDescription>
            Remove permanentemente sua conta e seus dados. Esta ação não pode ser
            desfeita.
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-between gap-3">
          <p aria-live="polite" className="whitespace-pre-line text-sm text-destructive">
            {erroExcluir ?? ""}
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={deleteAccount.isPending}>
                {deleteAccount.isPending ? "Excluindo…" : "Excluir minha conta"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir sua conta?</AlertDialogTitle>
                <AlertDialogDescription>
                  Sua conta e seus dados serão removidos permanentemente. Esta
                  ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-white hover:bg-destructive/90"
                  onClick={() => {
                    if (!user) return
                    setErroExcluir(null)
                    deleteAccount.mutate(user.id, {
                      onSuccess: () => logout(),
                      onError: (err) =>
                        setErroExcluir(
                          apiErrorMessage(err, "Não foi possível excluir a conta."),
                        ),
                    })
                  }}
                >
                  Excluir conta
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </div>
  )
}
