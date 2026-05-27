import { useState } from "react"
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
import { Switch } from "@/components/ui/switch"
import { useUpdateUser, useUserById } from "@/hooks/api/use-users"
import { apiErrorMessage } from "@/lib/api/http"
import {
  isValidPhone,
  maskPhone,
  onlyDigits,
  PHONE_INVALID_MESSAGE,
  PHONE_MAX_LENGTH,
} from "@/lib/phone"
import type { User } from "@/lib/api/types"

const LISTA_PATH = "/home/interno/egressos-cadastrados"

export function EmpresaEgressoEditarPage() {
  const { egressoId } = useParams()
  const userQuery = useUserById(egressoId)

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <NavLink to={LISTA_PATH}>Egressos cadastrados</NavLink>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Editar</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {userQuery.isLoading ? (
        <p className="text-sm text-muted-foreground">Carregando egresso…</p>
      ) : userQuery.isError || !userQuery.data ? (
        <Card>
          <CardHeader>
            <CardTitle>Egresso não encontrado</CardTitle>
            <CardDescription>
              Não foi possível carregar os dados deste egresso.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        // Remonta o form quando o usuário carrega, inicializando o estado a
        // partir dos dados (evita set-state em effect).
        <EditarEgressoForm key={userQuery.data.id} egresso={userQuery.data} />
      )}
    </div>
  )
}

function EditarEgressoForm({ egresso }: { egresso: User }) {
  const navigate = useNavigate()
  const updateUser = useUpdateUser()
  const [nome, setNome] = useState(egresso.name)
  const [email, setEmail] = useState(egresso.email)
  const [cidade, setCidade] = useState(egresso.city ?? "")
  // Normaliza o valor salvo (pode vir só com dígitos) reaplicando a máscara.
  const [telefone, setTelefone] = useState(maskPhone(egresso.phoneNumber ?? ""))
  const [disponivel, setDisponivel] = useState(egresso.available)
  const [erro, setErro] = useState<string | null>(null)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErro(null)

    // Telefone é opcional: só valida quando preenchido (10 ou 11 dígitos).
    if (!isValidPhone(telefone)) {
      setErro(PHONE_INVALID_MESSAGE)
      return
    }

    updateUser.mutate(
      {
        id: egresso.id,
        payload: {
          name: nome.trim(),
          email: email.trim(),
          city: cidade.trim(),
          // Envia apenas os dígitos; a máscara é puramente visual.
          phoneNumber: onlyDigits(telefone),
          available: disponivel,
        },
      },
      {
        onSuccess: () => navigate(LISTA_PATH),
        onError: (err) =>
          setErro(apiErrorMessage(err, "Não foi possível salvar as alterações.")),
      },
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Editar egresso</CardTitle>
        <CardDescription>Atualize os dados do egresso cadastrado.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="editar-egresso-form"
          className="flex flex-col gap-6"
          onSubmit={handleSubmit}
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

            <div className="flex flex-col gap-2">
              <label htmlFor="editar-egresso-telefone" className="text-sm font-medium">
                Telefone
              </label>
              <Input
                id="editar-egresso-telefone"
                name="telefone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                value={telefone}
                onChange={(event) => setTelefone(maskPhone(event.target.value))}
                placeholder="(00) 00000-0000"
                maxLength={PHONE_MAX_LENGTH}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="editar-egresso-cidade" className="text-sm font-medium">
                Cidade
              </label>
              <Input
                id="editar-egresso-cidade"
                name="cidade"
                autoComplete="address-level2"
                value={cidade}
                onChange={(event) => setCidade(event.target.value)}
                placeholder="Ex.: Maceió"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Switch
              id="editar-egresso-disponivel"
              checked={disponivel}
              onCheckedChange={setDisponivel}
            />
            <label
              htmlFor="editar-egresso-disponivel"
              className="text-sm font-medium"
            >
              Disponível para oportunidades
            </label>
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
          form="editar-egresso-form"
          disabled={updateUser.isPending}
        >
          {updateUser.isPending ? "Salvando…" : "Salvar alterações"}
        </Button>
      </CardFooter>
    </Card>
  )
}
