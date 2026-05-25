export type EmpresaInternaMock = {
  id: string
  nome: string
  email: string
  status: "Ativa" | "Bloqueada"
  cadastradaEm: string
}

export type EgressoInternoMock = {
  id: string
  nome: string
  email: string
  curso: string
  status: "Ativo" | "Bloqueado"
  cadastradoEm: string
}

export const empresasInternasMockadas: EmpresaInternaMock[] = [
  {
    id: "empresa-tecnova",
    nome: "TecNova Soluções",
    email: "contato@tecnova.com.br",
    status: "Ativa",
    cadastradaEm: "15/03/2026",
  },
  {
    id: "empresa-litoral",
    nome: "Litoral Sistemas",
    email: "rh@litoralsistemas.com.br",
    status: "Ativa",
    cadastradaEm: "12/03/2026",
  },
  {
    id: "empresa-ponte",
    nome: "Ponte Digital",
    email: "recrutamento@pontedigital.com.br",
    status: "Bloqueada",
    cadastradaEm: "08/03/2026",
  },
]

export const egressosInternosMockados: EgressoInternoMock[] = [
  {
    id: "egresso-nicolas",
    nome: "Nicolas Egresso",
    email: "nicolas.egresso@ifal.edu.br",
    curso: "Técnico em Informática",
    status: "Ativo",
    cadastradoEm: "31/03/2026",
  },
  {
    id: "egresso-larissa",
    nome: "Larissa Silva",
    email: "larissa.silva@ifal.edu.br",
    curso: "Técnico em Informática para Internet",
    status: "Ativo",
    cadastradoEm: "30/03/2026",
  },
  {
    id: "egresso-joao",
    nome: "João Henrique",
    email: "joao.henrique@ifal.edu.br",
    curso: "Técnico em Redes de Computadores",
    status: "Bloqueado",
    cadastradoEm: "29/03/2026",
  },
]
