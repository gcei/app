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
import { candidatosEmpresaMockados } from "@/mocks/empresa-candidatos"

export function EmpresaCandidatoCurriculoPage() {
  const { candidatoId } = useParams()

  const candidato = useMemo(
    () => candidatosEmpresaMockados.find((item) => item.id === candidatoId),
    [candidatoId]
  )

  if (!candidato) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Candidato não encontrado</CardTitle>
          <CardDescription>
            O currículo solicitado não está disponível nesta etapa.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline">
            <NavLink to="/home/empresas/candidatos">Voltar para candidatos</NavLink>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Gestão de Currículos de Egressos do IFAL
        </h1>
        <p className="text-sm leading-6 text-muted-foreground">
          Banco de Talentos - Visualize currículo detalhado do candidato.
        </p>
      </div>
      
      <div className="flex flex-col gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <NavLink to="/home/empresas/candidatos">Candidatos</NavLink>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Currículo</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {candidato.nome}
            </h1>
            <div className="flex flex-col gap-1 text-sm text-muted-foreground">
              <span>{candidato.email}</span>
              <span>{candidato.cidade}</span>
            </div>
          </div>

          <Button asChild>
            <NavLink to={`/home/empresas/conversas/${candidato.conversaId}`}>
              Enviar mensagem
            </NavLink>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resumo profissional</CardTitle>
          <CardDescription>{candidato.resumo}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <section className="flex flex-col gap-2">
            <h2 className="text-sm font-medium text-foreground">Objetivo</h2>
            <p className="text-sm leading-6 text-muted-foreground">{candidato.objetivo}</p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-sm font-medium text-foreground">Formação</h2>
            <div className="flex flex-wrap gap-2">
              {candidato.formacoes.map((formacao) => (
                <span
                  key={formacao}
                  className="rounded-md border px-2 py-1 text-xs text-muted-foreground"
                >
                  {formacao}
                </span>
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-sm font-medium text-foreground">Habilidades</h2>
            <div className="flex flex-wrap gap-2">
              {candidato.habilidades.map((habilidade) => (
                <span
                  key={habilidade}
                  className="rounded-md border px-2 py-1 text-xs text-muted-foreground"
                >
                  {habilidade}
                </span>
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-sm font-medium text-foreground">Idiomas</h2>
            <div className="flex flex-wrap gap-2">
              {candidato.idiomas.map((idioma) => (
                <span
                  key={idioma}
                  className="rounded-md border px-2 py-1 text-xs text-muted-foreground"
                >
                  {idioma}
                </span>
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-sm font-medium text-foreground">Experiências</h2>
            <div className="flex flex-col gap-2">
              {candidato.experiencias.map((experiencia) => (
                <div key={experiencia} className="rounded-lg border p-3 text-sm text-foreground">
                  {experiencia}
                </div>
              ))}
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  )
}
