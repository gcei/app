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
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { vagasMockadas } from "@/mocks/egresso-vagas"

export function EgressoVagaDetalhePage() {
  const { vagaId } = useParams()

  const vaga = useMemo(
    () => vagasMockadas.find((item) => item.id === vagaId),
    [vagaId]
  )

  if (!vaga) {
    return (
      <Card className="border py-0 ring-0 shadow-none">
        <CardHeader className="border-b py-6">
          <CardTitle>Vaga não encontrada</CardTitle>
          <CardDescription>
            A vaga solicitada não está disponível nesta etapa.
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
      <div className="flex flex-col gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <NavLink to="/home/egresso/vagas">Vagas</NavLink>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{vaga.titulo}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-muted-foreground">{vaga.empresa}</p>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              {vaga.titulo}
            </h1>
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
              {vaga.descricao}
            </p>
          </div>

          <Button>Candidatar-se</Button>
        </div>
      </div>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <Card className="border py-0 ring-0 shadow-none">
          <CardHeader className="border-b py-6">
            <CardTitle>Detalhes da vaga</CardTitle>
            <CardDescription>
              Informações principais da oportunidade.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6 py-6">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-lg border px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Localidade
                </p>
                <p className="mt-2 text-sm font-medium">{vaga.localidade}</p>
              </div>
              <div className="rounded-lg border px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Modalidade
                </p>
                <p className="mt-2 text-sm font-medium">{vaga.modalidade}</p>
              </div>
              <div className="rounded-lg border px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Regime
                </p>
                <p className="mt-2 text-sm font-medium">{vaga.regime}</p>
              </div>
              <div className="rounded-lg border px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Nível
                </p>
                <p className="mt-2 text-sm font-medium">{vaga.nivel}</p>
              </div>
            </div>

            <section className="flex flex-col gap-3">
              <h2 className="text-lg font-medium">Descrição da vaga</h2>
              <div className="rounded-lg border px-4 py-4">
                <p className="text-sm leading-6 text-muted-foreground">
                  {vaga.descricao}
                </p>
              </div>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="text-lg font-medium">Responsabilidades</h2>
              <div className="flex flex-col gap-2">
                {vaga.responsabilidades.map((item) => (
                  <div key={item} className="rounded-lg border px-4 py-3 text-sm">
                    {item}
                  </div>
                ))}
              </div>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="text-lg font-medium">Requisitos</h2>
              <div className="flex flex-col gap-2">
                {vaga.requisitos.map((item) => (
                  <div key={item} className="rounded-lg border px-4 py-3 text-sm">
                    {item}
                  </div>
                ))}
              </div>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="text-lg font-medium">Diferenciais</h2>
              <div className="flex flex-col gap-2">
                {vaga.diferenciais.map((item) => (
                  <div key={item} className="rounded-lg border px-4 py-3 text-sm">
                    {item}
                  </div>
                ))}
              </div>
            </section>
          </CardContent>
        </Card>

        <Card className="border py-0 ring-0 shadow-none">
          <CardHeader className="border-b py-6">
            <CardTitle>Resumo da oportunidade</CardTitle>
            <CardDescription>
              Informações rápidas para avaliar a candidatura.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 py-6">
            <div className="rounded-lg border px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Faixa salarial
              </p>
              <p className="mt-2 text-sm font-medium">{vaga.faixaSalarial}</p>
            </div>
            <div className="rounded-lg border px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Empresa
              </p>
              <p className="mt-2 text-sm font-medium">{vaga.empresa}</p>
            </div>
            <div className="rounded-lg border px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Regime
              </p>
              <p className="mt-2 text-sm font-medium">{vaga.regime}</p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
