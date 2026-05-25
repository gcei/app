import { useEffect, useRef, useState } from "react"
import { CameraIcon } from "@phosphor-icons/react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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

function getInitials(nome: string) {
  return (
    nome
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((parte) => parte[0]?.toUpperCase() ?? "")
      .join("") || "?"
  )
}

export function EgressoConfiguracoesPage() {
  const { user } = useAuth()
  const updateUser = useUpdateUser()
  const inputFotoRef = useRef<HTMLInputElement>(null)
  const [fotoPreview, setFotoPreview] = useState<string | null>(null)
  const [mensagem, setMensagem] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(
    null,
  )
  const [formState, setFormState] = useState({
    nome: user?.name ?? "",
    email: user?.email ?? "",
  })

  useEffect(() => {
    return () => {
      if (fotoPreview) {
        URL.revokeObjectURL(fotoPreview)
      }
    }
  }, [fotoPreview])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!user) return
    setMensagem(null)
    updateUser.mutate(
      {
        id: user.id,
        payload: { name: formState.nome.trim(), email: formState.email.trim() },
      },
      {
        onSuccess: () =>
          setMensagem({ tipo: "ok", texto: "Dados do perfil atualizados." }),
        onError: () =>
          setMensagem({
            tipo: "erro",
            texto: "Não foi possível atualizar o perfil. Tente novamente.",
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
          Configurações - Atualize seus dados de acesso.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Dados do perfil</CardTitle>
          <CardDescription>
            Atualize seu nome e e-mail exibidos na plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="perfil-form" className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <Avatar size="lg" className="size-20">
                  {fotoPreview ? (
                    <AvatarImage src={fotoPreview} alt="Foto do perfil" />
                  ) : null}
                  <AvatarFallback className="bg-primary text-base text-primary-foreground">
                    {getInitials(formState.nome)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-foreground">Foto do perfil</p>
                  <p className="text-sm text-muted-foreground">
                    A pré-visualização é local (o envio de foto ainda não é suportado
                    pela API).
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  ref={inputFotoRef}
                  id="foto-perfil"
                  name="foto_perfil"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(event) => {
                    const arquivo = event.target.files?.[0]
                    if (!arquivo) return
                    setFotoPreview((current) => {
                      if (current) URL.revokeObjectURL(current)
                      return URL.createObjectURL(arquivo)
                    })
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => inputFotoRef.current?.click()}
                >
                  <CameraIcon aria-hidden="true" />
                  Alterar foto
                </Button>
              </div>
            </div>

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
    </div>
  )
}
