import { useMemo } from "react"
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
import { candidatosEmpresaMockados } from "@/mocks/empresa-candidatos"

const filterFields = [
  {
    key: "nome",
    label: "Nome",
    placeholder: "Busque por nome…",
    autoComplete: "name",
  },
  {
    key: "hardSkills",
    label: "Hard Skills",
    placeholder: "Busque por hard skills…",
    autoComplete: "off",
  },
  {
    key: "softSkills",
    label: "Soft Skills",
    placeholder: "Busque por soft skills…",
    autoComplete: "off",
  },
  {
    key: "formacao",
    label: "Formação",
    placeholder: "Busque por formação…",
    autoComplete: "off",
  },
  {
    key: "cidade",
    label: "Cidade",
    placeholder: "Busque por cidade…",
    autoComplete: "address-level2",
  },
  {
    key: "idioma",
    label: "Idioma",
    placeholder: "Busque por idioma…",
    autoComplete: "off",
  },
] as const

function normalizeValue(value: string) {
  return value.trim().toLowerCase()
}

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
  const pageSize = 4

  const filters = {
    nome: searchParams.get("nome") ?? "",
    hardSkills: searchParams.get("hardSkills") ?? "",
    softSkills: searchParams.get("softSkills") ?? "",
    formacao: searchParams.get("formacao") ?? "",
    cidade: searchParams.get("cidade") ?? "",
    idioma: searchParams.get("idioma") ?? "",
  }

  const candidatosFiltrados = useMemo(() => {
    return candidatosEmpresaMockados.filter((candidato) => {
      const nome = normalizeValue(filters.nome)
      const hardSkills = normalizeValue(filters.hardSkills)
      const softSkills = normalizeValue(filters.softSkills)
      const formacao = normalizeValue(filters.formacao)
      const cidade = normalizeValue(filters.cidade)
      const idioma = normalizeValue(filters.idioma)

      const matchesNome =
        !nome || normalizeValue(candidato.nome).includes(nome)
      const matchesHardSkills =
        !hardSkills ||
        candidato.hardSkills.some((item) =>
          normalizeValue(item).includes(hardSkills)
        )
      const matchesSoftSkills =
        !softSkills ||
        candidato.softSkills.some((item) =>
          normalizeValue(item).includes(softSkills)
        )
      const matchesFormacao =
        !formacao ||
        candidato.formacoes.some((item) =>
          normalizeValue(item).includes(formacao)
        )
      const matchesCidade =
        !cidade || normalizeValue(candidato.cidade).includes(cidade)
      const matchesIdioma =
        !idioma ||
        candidato.idiomas.some((item) => normalizeValue(item).includes(idioma))

      return (
        matchesNome &&
        matchesHardSkills &&
        matchesSoftSkills &&
        matchesFormacao &&
        matchesCidade &&
        matchesIdioma
      )
    })
  }, [
    filters.cidade,
    filters.formacao,
    filters.hardSkills,
    filters.idioma,
    filters.nome,
    filters.softSkills,
  ])

  const hasActiveFilters = Object.values(filters).some((value) => value.length > 0)
  const totalPages = Math.max(1, Math.ceil(candidatosFiltrados.length / pageSize))
  const safePage = Math.min(Math.max(currentPage, 1), totalPages)
  const candidatosPaginados = candidatosFiltrados.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  )

  const updateFilter = (key: keyof typeof filters, value: string) => {
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

          <div className="flex flex-wrap items-center justify-between gap-3">
            {hasActiveFilters ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setSearchParams(new URLSearchParams())}
              >
                <XIcon aria-hidden="true" />
                Limpar filtros
              </Button>
            ) : null}
          </div>
        </form>
      </section>

      <section className="flex flex-col gap-4">
        {candidatosFiltrados.length > 0 ? (
          <>
            <div className="grid gap-4 xl:grid-cols-2">
              {candidatosPaginados.map((candidato) => (
                <div
                  key={candidato.id}
                  className="flex flex-col gap-4 rounded-xl border border-border/80 bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <Avatar size="lg">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(candidato.nome)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex min-w-0 flex-col gap-1">
                      <p className="text-base font-medium text-foreground">
                        {candidato.nome}
                      </p>
                      <p className="text-sm text-muted-foreground">{candidato.email}</p>
                      <p className="text-sm text-muted-foreground">{candidato.cidade}</p>
                    </div>
                  </div>

                  <p className="text-sm leading-6 text-muted-foreground">
                    {candidato.resumo}
                  </p>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Hard skills
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {candidato.hardSkills.slice(0, 4).map((habilidade) => (
                          <span
                            key={habilidade}
                            className="rounded-md border border-primary/20 bg-accent/60 px-2 py-1 text-xs font-medium text-accent-foreground"
                          >
                            {habilidade}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Soft skills
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {candidato.softSkills.slice(0, 4).map((habilidade) => (
                          <span
                            key={habilidade}
                            className="rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground"
                          >
                            {habilidade}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button asChild variant="outline">
                      <NavLink to={`/home/empresas/candidatos/${candidato.id}`}>
                        Visualizar currículo
                      </NavLink>
                    </Button>
                  </div>
                </div>
              ))}
            </div>

              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      text="Anterior"
                      href={createPageHref(Math.max(1, safePage - 1))}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink href={createPageHref(page)} isActive={page === safePage}>
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      text="Próximo"
                      href={createPageHref(Math.min(totalPages, safePage + 1))}
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
