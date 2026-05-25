export type CurriculoMock = {
  id: string
  nome: string
  ultimaAtualizacao: string
  status: string
  resumo: string
  vagasUtilizadas: string[]
  nomeCompleto: string
  email: string
  telefone: string
  cidade: string
  objetivo: string
  habilidades: string[]
  idiomas: string[]
  experiencias: string[]
  formacao: string[]
}

export const curriculosMockados: CurriculoMock[] = [
  {
    id: "curriculo-dev-web",
    nome: "Currículo - Desenvolvimento Web",
    ultimaAtualizacao: "31/03/2026 14:30",
    status: "Ativo",
    resumo:
      "Versão focada em vagas de desenvolvimento front-end e construção de interfaces web.",
    vagasUtilizadas: [
      "Pessoa Desenvolvedora Front-end Júnior",
      "Estágio em Qualidade de Software",
    ],
    nomeCompleto: "Nicolas Egresso",
    email: "nicolas.egresso@ifal.edu.br",
    telefone: "(82) 99999-0001",
    cidade: "Maceió, AL",
    objetivo:
      "Atuar com desenvolvimento web, construção de interfaces e manutenção de aplicações institucionais.",
    habilidades: [
      "React e TypeScript",
      "Tailwind CSS e shadcn/ui",
      "Integração com APIs REST",
      "Versionamento com Git",
    ],
    idiomas: ["Português - nativo", "Inglês - intermediário"],
    experiencias: [
      "Desenvolvimento de interfaces para sistemas acadêmicos e administrativos.",
      "Apoio em manutenção de aplicações web com foco em usabilidade e consistência visual.",
    ],
    formacao: [
      "Bacharelado em Sistemas de Informação - IFAL",
      "Cursos complementares em desenvolvimento front-end e acessibilidade web",
    ],
  },
  {
    id: "curriculo-dados-suporte",
    nome: "Currículo - Dados e Suporte",
    ultimaAtualizacao: "27/03/2026 09:15",
    status: "Ativo",
    resumo:
      "Versão ajustada para oportunidades de suporte, indicadores operacionais e dados.",
    vagasUtilizadas: ["Analista de Suporte e Dados"],
    nomeCompleto: "Nicolas Egresso",
    email: "nicolas.egresso@ifal.edu.br",
    telefone: "(82) 99999-0001",
    cidade: "Maceió, AL",
    objetivo:
      "Contribuir em rotinas de suporte, acompanhamento de indicadores e organização de dados operacionais.",
    habilidades: [
      "Atendimento e suporte ao usuário",
      "Planilhas e organização de dados",
      "Documentação de processos",
      "Acompanhamento de indicadores",
    ],
    idiomas: ["Português - nativo", "Espanhol - básico"],
    experiencias: [
      "Apoio em rotinas de atendimento e acompanhamento de chamados internos.",
      "Organização de relatórios operacionais e consolidação de dados para acompanhamento.",
    ],
    formacao: [
      "Bacharelado em Sistemas de Informação - IFAL",
      "Formação complementar em análise de dados e suporte técnico",
    ],
  },
  {
    id: "curriculo-geral",
    nome: "Currículo - Perfil Geral",
    ultimaAtualizacao: "18/03/2026 16:45",
    status: "Rascunho",
    resumo:
      "Versão ampla para candidaturas gerais, ainda em revisão de conteúdo e organização.",
    vagasUtilizadas: [],
    nomeCompleto: "Nicolas Egresso",
    email: "nicolas.egresso@ifal.edu.br",
    telefone: "(82) 99999-0001",
    cidade: "Maceió, AL",
    objetivo:
      "Apresentar um perfil profissional geral para participação em processos seletivos de entrada.",
    habilidades: [
      "Comunicação escrita e organização",
      "Aprendizado rápido",
      "Trabalho em equipe",
      "Conhecimentos básicos em tecnologia",
    ],
    idiomas: ["Português - nativo"],
    experiencias: [
      "Participação em projetos acadêmicos integradores com foco em resolução de problemas.",
    ],
    formacao: [
      "Bacharelado em Sistemas de Informação - IFAL",
    ],
  },
]
