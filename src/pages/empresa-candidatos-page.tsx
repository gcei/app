import { NavLink, useSearchParams } from "react-router-dom"
import { XIcon } from "@phosphor-icons/react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  useUserResumeDetail,
  useUserResumes,
  useUsers,
} from "@/hooks/api/use-users"
import type { UsersFilters } from "@/lib/api/users"
import type { User } from "@/lib/api/types"

/** Campo de filtro da UI → parâmetro de query da API. */
const filterFields = [
  { key: "name", label: "Nome", placeholder: "Busque por nome…", autoComplete: "name" },
  { key: "hardSkill", label: "Hard Skills", placeholder: "Busque por hard skills…", autoComplete: "off" },
  { key: "softSkill", label: "Soft Skills", placeholder: "Busque por soft skills…", autoComplete: "off" },
  { key: "course", label: "Formação", placeholder: "Busque por formação…", autoComplete: "off" },
  { key: "city", label: "Cidade", placeholder: "Busque por cidade…", autoComplete: "address-level2" },
  { key: "language", label: "Idioma", placeholder: "Busque por idioma…", autoComplete: "off" },
] as const

type FilterKey = (typeof filterFields)[number]["key"]

const PAGE_SIZE = 8

function getInitials(nome: string) {
  return nome
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase() ?? "")
    .join("")
}

export function EmpresaCandidatosPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentPage = Number.parseInt(searchParams.get("pagina") ?? "1", 10) || 1

  const filters: Record<FilterKey, string> = {
    name: searchParams.get("name") ?? "",
    hardSkill: searchParams.get("hardSkill") ?? "",
    softSkill: searchParams.get("softSkill") ?? "",
    course: searchParams.get("course") ?? "",
    city: searchParams.get("city") ?? "",
    language: searchParams.get("language") ?? "",
  }

  const apiFilters: UsersFilters = {
    ...filters,
    page: currentPage,
    size: PAGE_SIZE,
  }

  const usersQuery = useUsers(apiFilters)
  // A API não filtra por papel; candidatos são egressos (STUDENT).
  const candidatos = (usersQuery.data?.data ?? []).filter(
    (user) => user.role === "STUDENT",
  )
  const total = usersQuery.data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const hasActiveFilters = Object.values(filters).some((value) => value.length > 0)

  const updateFilter = (key: FilterKey, value: string) => {
    const nextParams = new URLSearchParams(searchParams)
    nextParams.set("pagina", "1")
    if (value.trim().length === 0) {
      nextParams.delete(key)
    } else {
      nextParams.set(key, value)
    }
    setSearchParams(nextParams)
  }

  const createPageHref = (page: number) => {
    const nextParams = new URLSearchParams(searchParams)
    nextParams.set("pagina", String(page))
    return `?${nextParams.toString()}`
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Gestão de Currículos de Egressos do IFAL
        </h1>
        <p className="text-sm leading-6 text-muted-foreground">
          Banco de Talentos - Visualize e gerencie currículos de egressos.
        </p>
      </div>

      <section className="rounded-xl border border-border/80 bg-card p-4 shadow-sm sm:p-5">
        <form
          className="flex flex-col gap-4"
          onSubmit={(event) => event.preventDefault()}
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filterFields.map((field) => (
              <div key={field.key} className="flex flex-col gap-2">
                <label
                  htmlFor={`filtro-${field.key}`}
                  className="text-sm font-medium text-foreground"
                >
                  {field.label}
                </label>
                <Input
                  id={`filtro-${field.key}`}
                  name={field.key}
                  autoComplete={field.autoComplete}
                  value={filters[field.key]}
                  onChange={(event) => updateFilter(field.key, event.target.value)}
                  placeholder={field.placeholder}
                  className="bg-background"
                />
              </div>
            ))}
          </div>

          {hasActiveFilters ? (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSearchParams(new URLSearchParams())}
              >
                <XIcon aria-hidden="true" />
                Limpar filtros
              </Button>
            </div>
          ) : null}
        </form>
      </section>

      <section className="flex flex-col gap-4">
        {usersQuery.isLoading ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Carregando candidatos…
          </p>
        ) : usersQuery.isError ? (
          <div className="flex flex-col items-center gap-3 py-8">
            <p className="text-sm text-destructive">
              Não foi possível carregar os candidatos.
            </p>
            <Button variant="outline" size="sm" onClick={() => usersQuery.refetch()}>
              Tentar novamente
            </Button>
          </div>
        ) : candidatos.length > 0 ? (
          <>
            <div className="grid gap-4 xl:grid-cols-2">
              {candidatos.map((candidato) => (
                <CandidatoCard key={candidato.id} candidato={candidato} />
              ))}
            </div>

            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    text="Anterior"
                    href={createPageHref(Math.max(1, currentPage - 1))}
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                  (page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href={createPageHref(page)}
                        isActive={page === currentPage}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ),
                )}

                <PaginationItem>
                  <PaginationNext
                    text="Próximo"
                    href={createPageHref(Math.min(totalPages, currentPage + 1))}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </>
        ) : (
          <div className="rounded-xl border border-dashed border-border/80 bg-card/60 p-8 text-center shadow-sm">
            <p className="text-sm font-medium text-foreground">
              Nenhum candidato encontrado
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Ajuste os filtros para ampliar a busca por candidatos.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}

function SkillTags({
  titulo,
  skills,
  badgeClassName,
}: {
  titulo: string
  skills: { id: string; title: string }[]
  badgeClassName: string
}) {
  if (skills.length === 0) return null
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {titulo}
      </p>
      <div className="flex flex-wrap gap-2">
        {skills.slice(0, 4).map((skill) => (
          <span key={skill.id} className={badgeClassName}>
            {skill.title}
          </span>
        ))}
      </div>
    </div>
  )
}

function CandidatoCard({ candidato }: { candidato: User }) {
  // Descrição e skills vêm do currículo público do egresso (o objeto User não
  // tem esses dados): a lista dá a descrição e o id do 1º currículo; o detalhe
  // desse currículo traz hardSkills/softSkills.
  const resumesQuery = useUserResumes(candidato.id)
  const primeiro = resumesQuery.data?.data?.[0]
  const resumeQuery = useUserResumeDetail(candidato.id, primeiro?.id)

  const descricao = primeiro?.coverLetter ?? null
  const hardSkills = resumeQuery.data?.hardSkills ?? []
  const softSkills = resumeQuery.data?.softSkills ?? []

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border/80 bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start gap-4">
        <Avatar size="lg">
          <AvatarFallback className="bg-primary text-primary-foreground">
            {getInitials(candidato.name)}
          </AvatarFallback>
        </Avatar>

        <div className="flex min-w-0 flex-col gap-1">
          <p className="text-base font-medium text-foreground">{candidato.name}</p>
          <p className="text-sm text-muted-foreground">{candidato.email}</p>
          {candidato.city ? (
            <p className="text-sm text-muted-foreground">{candidato.city}</p>
          ) : null}
        </div>
      </div>

      {descricao ? (
        <p className="text-sm leading-6 text-muted-foreground">{descricao}</p>
      ) : null}

      {hardSkills.length > 0 || softSkills.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <SkillTags
            titulo="Hard skills"
            skills={hardSkills}
            badgeClassName="rounded-md border border-primary/20 bg-accent/60 px-2 py-1 text-xs font-medium text-accent-foreground"
          />
          <SkillTags
            titulo="Soft skills"
            skills={softSkills}
            badgeClassName="rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground"
          />
        </div>
      ) : null}

      <div className="flex justify-end">
        <Button asChild variant="outline">
          <NavLink to={`/home/interno/candidatos/${candidato.id}`}>
            Visualizar currículo
          </NavLink>
        </Button>
      </div>
    </div>
  )
}
