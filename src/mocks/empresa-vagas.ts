export type VagaEmpresaMock = {
  id: string
  titulo: string
  localidade: string
  modalidade: string
  regime: string
  status: "Ativa" | "Pausada"
  publicadaEm: string
  resumo: string
  descricao: string
  requisitos: string[]
  atividades: string[]
}

export type CandidaturaEmpresaMock = {
  id: string
  vagaId: string
  candidatoId: string
  status: "Nova" | "Em análise" | "Contato realizado"
  enviadaEm: string
}

export const vagasEmpresaMockadas: VagaEmpresaMock[] = [
  {
    id: "vaga-front-end-junior",
    titulo: "Pessoa Desenvolvedora Front-end Júnior",
    localidade: "Maceió, AL",
    modalidade: "Híbrida",
    regime: "CLT",
    status: "Ativa",
    publicadaEm: "29/03/2026",
    resumo:
      "Vaga para apoiar a evolução de interfaces, componentes e fluxos de produto.",
    descricao:
      "A vaga é voltada para atuação em interfaces web, manutenção de componentes e integração com APIs da plataforma.",
    requisitos: [
      "Conhecimento em React e TypeScript",
      "Boa base de HTML, CSS e JavaScript",
      "Organização para atuar em equipe",
    ],
    atividades: [
      "Implementar telas e componentes de produto",
      "Ajustar integrações com APIs",
      "Apoiar refinamentos de interface e usabilidade",
    ],
  },
  {
    id: "vaga-suporte-dados",
    titulo: "Analista de Suporte e Dados",
    localidade: "Arapiraca, AL",
    modalidade: "Presencial",
    regime: "CLT",
    status: "Ativa",
    publicadaEm: "27/03/2026",
    resumo:
      "Vaga para atendimento, organização de chamados e acompanhamento de indicadores operacionais.",
    descricao:
      "A pessoa atuará em suporte ao usuário, documentação de processos e organização de relatórios operacionais.",
    requisitos: [
      "Boa comunicação com usuários",
      "Organização de dados e planilhas",
      "Capacidade de documentação",
    ],
    atividades: [
      "Atender chamados e orientar usuários",
      "Consolidar relatórios operacionais",
      "Acompanhar indicadores de atendimento",
    ],
  },
  {
    id: "vaga-estagio-qa",
    titulo: "Estágio em Qualidade de Software",
    localidade: "Remota",
    modalidade: "Remota",
    regime: "Estágio",
    status: "Pausada",
    publicadaEm: "23/03/2026",
    resumo:
      "Vaga para apoio em testes, documentação de cenários e acompanhamento de correções.",
    descricao:
      "A vaga apoia o time de produto em testes funcionais, abertura de inconsistências e acompanhamento de melhorias.",
    requisitos: [
      "Organização e atenção a detalhes",
      "Boa comunicação escrita",
      "Interesse em qualidade de software",
    ],
    atividades: [
      "Executar testes funcionais",
      "Documentar cenários e resultados",
      "Acompanhar correções com o time técnico",
    ],
  },
]

export const candidaturasEmpresaMockadas: CandidaturaEmpresaMock[] = [
  {
    id: "cand-front-1",
    vagaId: "vaga-front-end-junior",
    candidatoId: "cand-nicolas-egresso",
    status: "Em análise",
    enviadaEm: "31/03/2026",
  },
  {
    id: "cand-front-2",
    vagaId: "vaga-front-end-junior",
    candidatoId: "cand-maria-clara",
    status: "Nova",
    enviadaEm: "31/03/2026",
  },
  {
    id: "cand-suporte-1",
    vagaId: "vaga-suporte-dados",
    candidatoId: "cand-larissa-silva",
    status: "Contato realizado",
    enviadaEm: "30/03/2026",
  },
  {
    id: "cand-suporte-2",
    vagaId: "vaga-suporte-dados",
    candidatoId: "cand-joao-henrique",
    status: "Em análise",
    enviadaEm: "29/03/2026",
  },
]
