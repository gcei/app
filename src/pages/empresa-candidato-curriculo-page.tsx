import { useState } from "react"
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
import {
  useUserById,
  useUserResumeDetail,
  useUserResumes,
} from "@/hooks/api/use-users"
import type { Resume } from "@/lib/api/types"

function formatPeriod(from: string, until: string) {
  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString("pt-BR", {
      month: "2-digit",
      year: "numeric",
    })
  return `${fmt(from)} – ${fmt(until)}`
}

export function EmpresaCandidatoCurriculoPage() {
  const { candidatoId } = useParams()
  const userQuery = useUserById(candidatoId)
  const resumesQuery = useUserResumes(candidatoId)
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined)

  const resumes = resumesQuery.data?.data ?? []
  const effectiveId = selectedId ?? resumes[0]?.id
  const resumeQuery = useUserResumeDetail(candidatoId, effectiveId)

  const candidato = userQuery.data

  if (userQuery.isLoading || resumesQuery.isLoading) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        Carregando candidato…
      </p>
    )
  }

  if (userQuery.isError || !candidato) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Candidato não encontrado</CardTitle>
          <CardDescription>
            O currículo solicitado não está disponível.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline">
            <NavLink to="/home/interno/candidatos">Voltar para candidatos</NavLink>
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
                <NavLink to="/home/interno/candidatos">Candidatos</NavLink>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Currículo</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {candidato.name}
          </h1>
          <div className="flex flex-col gap-1 text-sm text-muted-foreground">
            <span>{candidato.email}</span>
            {candidato.city ? <span>{candidato.city}</span> : null}
          </div>
        </div>
      </div>

      {resumes.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Sem currículo público</CardTitle>
            <CardDescription>
              Este candidato ainda não tem um currículo público disponível.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <>
          {resumes.length > 1 ? (
            <div className="flex flex-wrap gap-2">
              {resumes.map((resume) => (
                <Button
                  key={resume.id}
                  type="button"
                  variant={resume.id === effectiveId ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedId(resume.id)}
                >
                  {resume.title}
                </Button>
              ))}
            </div>
          ) : null}

          {resumeQuery.isLoading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Carregando currículo…
            </p>
          ) : resumeQuery.isError || !resumeQuery.data ? (
            <p className="py-8 text-center text-sm text-destructive">
              Não foi possível carregar o currículo.
            </p>
          ) : (
            <ResumeDetail resume={resumeQuery.data} />
          )}
        </>
      )}
    </div>
  )
}

function ResumeDetail({ resume }: { resume: Resume }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{resume.title}</CardTitle>
        {resume.coverLetter ? (
          <CardDescription>{resume.coverLetter}</CardDescription>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-6">
        {resume.courses.length > 0 ? (
          <section className="flex flex-col gap-2">
            <h2 className="text-sm font-medium text-foreground">Formação</h2>
            <div className="flex flex-col gap-2">
              {resume.courses.map((course) => (
                <div
                  key={course.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3 text-sm"
                >
                  <span className="text-foreground">{course.title}</span>
                  <span className="text-muted-foreground">
                    {formatPeriod(course.from, course.until)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {resume.abilities.length > 0 ? (
          <section className="flex flex-col gap-2">
            <h2 className="text-sm font-medium text-foreground">Habilidades</h2>
            <div className="flex flex-wrap gap-2">
              {resume.abilities.map((ability) => (
                <span
                  key={ability.id}
                  className="rounded-md border px-2 py-1 text-xs text-muted-foreground"
                >
                  {ability.title}
                </span>
              ))}
            </div>
          </section>
        ) : null}

        {resume.hardSkills.length > 0 ? (
          <section className="flex flex-col gap-2">
            <h2 className="text-sm font-medium text-foreground">Hard Skills</h2>
            <div className="flex flex-wrap gap-2">
              {resume.hardSkills.map((skill) => (
                <span
                  key={skill.id}
                  className="rounded-md border px-2 py-1 text-xs text-muted-foreground"
                >
                  {skill.title}
                </span>
              ))}
            </div>
          </section>
        ) : null}

        {resume.softSkills.length > 0 ? (
          <section className="flex flex-col gap-2">
            <h2 className="text-sm font-medium text-foreground">Soft Skills</h2>
            <div className="flex flex-wrap gap-2">
              {resume.softSkills.map((skill) => (
                <span
                  key={skill.id}
                  className="rounded-md border px-2 py-1 text-xs text-muted-foreground"
                >
                  {skill.title}
                </span>
              ))}
            </div>
          </section>
        ) : null}

        {resume.languages.length > 0 ? (
          <section className="flex flex-col gap-2">
            <h2 className="text-sm font-medium text-foreground">Idiomas</h2>
            <div className="flex flex-wrap gap-2">
              {resume.languages.map((language) => (
                <span
                  key={language.id}
                  className="rounded-md border px-2 py-1 text-xs text-muted-foreground"
                >
                  {language.title} — {language.level}
                </span>
              ))}
            </div>
          </section>
        ) : null}

        {resume.experiences.length > 0 ? (
          <section className="flex flex-col gap-2">
            <h2 className="text-sm font-medium text-foreground">Experiências</h2>
            <div className="flex flex-col gap-2">
              {resume.experiences.map((experience) => (
                <div
                  key={experience.id}
                  className="flex flex-col gap-1 rounded-lg border p-3 text-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-medium text-foreground">
                      {experience.role} — {experience.company}
                    </span>
                    <span className="text-muted-foreground">
                      {formatPeriod(experience.from, experience.until)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </CardContent>
    </Card>
  )
}
