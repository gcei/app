import { useMemo } from "react"
import { NavLink, useParams } from "react-router-dom"

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
import { Textarea } from "@/components/ui/textarea"
import { contatosVagasMockados } from "@/mocks/egresso-vagas"

export function EgressoContatoChatPage() {
  const { contatoId } = useParams()

  const contato = useMemo(
    () => contatosVagasMockados.find((item) => item.id === contatoId),
    [contatoId]
  )

  if (!contato) {
    return (
      <Card className="border py-0 ring-0 shadow-none">
        <CardHeader className="border-b py-6">
          <CardTitle>Contato não encontrado</CardTitle>
          <CardDescription>
            O contato solicitado não está disponível nesta etapa.
          </CardDescription>
        </CardHeader>
        <CardContent className="py-6">
          <Button asChild variant="outline">
            <NavLink to="/home/egresso/vagas">Voltar para vagas</NavLink>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <NavLink to="/home/egresso/vagas">Vagas</NavLink>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Contato</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Conversa com {contato.empresa}
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">
            Vaga: {contato.vaga}
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="space-y-2">
          {contato.mensagens.map((mensagem) => (
            <div
              key={mensagem.id}
              className={
                mensagem.autor === "egresso"
                  ? "ml-auto flex w-full max-w-xl flex-col gap-2 rounded-lg border bg-primary/8 px-4 py-3 text-right"
                  : "flex w-full max-w-xl flex-col gap-2 rounded-lg border px-4 py-3"
              }
            >
              <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                <span>
                  {mensagem.autor === "empresa" ? contato.empresa : "Você"}
                </span>
                <span>{mensagem.momento}</span>
              </div>
              <p className="text-sm leading-6 text-foreground">{mensagem.texto}</p>
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Textarea
            placeholder="Digite sua mensagem para a empresa"
            className="min-h-28"
          />
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-end">
            <Button variant="outline">Enviar currículo</Button>
            <Button>Enviar mensagem</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
