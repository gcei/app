export type CandidatoEmpresaMock = {
  id: string
  conversaId: string
  nome: string
  email: string
  cidade: string
  resumo: string
  objetivo: string
  formacoes: string[]
  habilidades: string[]
  hardSkills: string[]
  softSkills: string[]
  idiomas: string[]
  experiencias: string[]
  respostasPesquisa: Record<string, string>
}

export type EmpresaConversaMock = {
  id: string
  candidatoId: string
  ultimaAtualizacao: string
  ultimaMensagem: string
  mensagens: Array<{
    id: string
    autor: "empresa" | "candidato"
    momento: string
    texto: string
  }>
}

export const candidatosEmpresaMockados: CandidatoEmpresaMock[] = [
  {
    id: "cand-nicolas-egresso",
    conversaId: "conv-nicolas-egresso",
    nome: "Nicolas Egresso",
    email: "nicolas.egresso@ifal.edu.br",
    cidade: "Maceió, AL",
    resumo:
      "Perfil voltado para desenvolvimento web, interfaces institucionais e manutenção de aplicações.",
    objetivo:
      "Atuar com desenvolvimento web, interfaces e evolução de produtos digitais.",
    formacoes: [
      "Técnico em Informática - IFAL",
      "Bacharelado em Sistemas de Informação - IFAL",
    ],
    habilidades: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Integração com APIs REST",
    ],
    hardSkills: ["React", "TypeScript", "Tailwind CSS", "Integração com APIs REST"],
    softSkills: ["Trabalho em equipe", "Aprendizado rápido", "Comunicação"],
    idiomas: ["Português - nativo", "Inglês - intermediário"],
    experiencias: [
      "Desenvolvimento de interfaces para sistemas acadêmicos e administrativos.",
      "Manutenção de aplicações web com foco em consistência visual e usabilidade.",
    ],
    respostasPesquisa: {
      "situacao-profissional": "Empregado(a)",
      "atuacao-area": "Sim, diretamente",
      "vinculo-trabalho": "CLT",
      "faixa-renda": "De 2 a 4 salários mínimos",
      "tempo-primeira-oportunidade": "Até 6 meses",
      "formacao-continuada": "Graduação ou especialização",
      "atualizacao-profissional": "A cada poucos meses",
      "canal-oportunidade": "Plataformas de vagas",
      "modelo-trabalho": "Híbrido",
      "interesse-vitrine": "Sim, quero manter visível",
    },
  },
  {
    id: "cand-larissa-silva",
    conversaId: "conv-larissa-silva",
    nome: "Larissa Silva",
    email: "larissa.silva@ifal.edu.br",
    cidade: "Arapiraca, AL",
    resumo:
      "Perfil com experiência em suporte, organização de dados operacionais e atendimento ao usuário.",
    objetivo:
      "Contribuir em rotinas de suporte, documentação e organização de dados operacionais.",
    formacoes: [
      "Técnico em Informática para Internet - IFAL",
      "Tecnólogo em Análise e Desenvolvimento de Sistemas",
    ],
    habilidades: [
      "Suporte técnico",
      "Planilhas",
      "Documentação de processos",
      "Atendimento ao usuário",
    ],
    hardSkills: [
      "Suporte técnico",
      "Planilhas",
      "Documentação de processos",
      "Atendimento ao usuário",
    ],
    softSkills: ["Organização", "Comunicação escrita", "Empatia"],
    idiomas: ["Português - nativo", "Espanhol - básico"],
    experiencias: [
      "Apoio em atendimento ao usuário e acompanhamento de chamados.",
      "Organização de relatórios operacionais e consolidação de dados internos.",
    ],
    respostasPesquisa: {
      "situacao-profissional": "Empregado(a)",
      "atuacao-area": "Sim, parcialmente",
      "vinculo-trabalho": "CLT",
      "faixa-renda": "De 1 a 2 salários mínimos",
      "tempo-primeira-oportunidade": "Entre 6 e 12 meses",
      "formacao-continuada": "Curso técnico ou livre",
      "atualizacao-profissional": "Uma vez por ano",
      "canal-oportunidade": "Indicação de contatos",
      "modelo-trabalho": "Presencial",
      "interesse-vitrine": "Sim, mas somente com contato seguro",
    },
  },
  {
    id: "cand-joao-henrique",
    conversaId: "conv-joao-henrique",
    nome: "João Henrique",
    email: "joao.henrique@ifal.edu.br",
    cidade: "Palmeira dos Índios, AL",
    resumo:
      "Perfil com foco em dados, automação de rotinas e acompanhamento de indicadores.",
    objetivo:
      "Atuar com dados, automação e apoio à tomada de decisão por indicadores.",
    formacoes: [
      "Técnico em Redes de Computadores - IFAL",
      "Bacharelado em Sistemas de Informação - IFAL",
    ],
    habilidades: [
      "SQL",
      "Python",
      "Power BI",
      "Indicadores operacionais",
    ],
    hardSkills: ["SQL", "Python", "Power BI", "Indicadores operacionais"],
    softSkills: ["Pensamento analítico", "Proatividade", "Colaboração"],
    idiomas: ["Português - nativo", "Inglês - básico"],
    experiencias: [
      "Construção de painéis e relatórios para acompanhamento de indicadores.",
      "Automação de rotinas para tratamento e consolidação de dados.",
    ],
    respostasPesquisa: {
      "situacao-profissional": "Empregado(a)",
      "atuacao-area": "Sim, diretamente",
      "vinculo-trabalho": "Pessoa jurídica ou contrato por projeto",
      "faixa-renda": "Acima de 4 salários mínimos",
      "tempo-primeira-oportunidade": "Já estava trabalhando antes de concluir",
      "formacao-continuada": "Mestrado ou doutorado",
      "atualizacao-profissional": "Mensalmente",
      "canal-oportunidade": "Redes sociais profissionais",
      "modelo-trabalho": "Remoto",
      "interesse-vitrine": "Sim, quero manter visível",
    },
  },
  {
    id: "cand-maria-clara",
    conversaId: "conv-maria-clara",
    nome: "Maria Clara",
    email: "maria.clara@ifal.edu.br",
    cidade: "Maceió, AL",
    resumo:
      "Perfil generalista para vagas de entrada com boa comunicação, organização e aprendizado rápido.",
    objetivo:
      "Ingressar em uma equipe de tecnologia e desenvolver experiência profissional inicial.",
    formacoes: ["Técnico em Informática - IFAL"],
    habilidades: [
      "Organização",
      "Comunicação escrita",
      "Pacote Office",
      "Trabalho em equipe",
    ],
    hardSkills: ["Pacote Office", "Organização", "Comunicação escrita"],
    softSkills: ["Trabalho em equipe", "Aprendizado rápido", "Comunicação"],
    idiomas: ["Português - nativo"],
    experiencias: [
      "Participação em projetos acadêmicos integradores com foco em resolução de problemas.",
    ],
    respostasPesquisa: {
      "situacao-profissional": "Desempregado(a) em busca de oportunidade",
      "atuacao-area": "Ainda não estou trabalhando",
      "vinculo-trabalho": "Autônomo(a) ou empreendedor(a)",
      "faixa-renda": "Até 1 salário mínimo",
      "tempo-primeira-oportunidade": "Ainda não consegui uma oportunidade",
      "formacao-continuada": "Não continuei os estudos",
      "atualizacao-profissional": "Somente quando preciso buscar vaga",
      "canal-oportunidade": "Concursos ou processos públicos",
      "modelo-trabalho": "Sem preferência",
      "interesse-vitrine": "Vou decidir depois",
    },
  },
]

export const conversasEmpresaMockadas: EmpresaConversaMock[] = [
  {
    id: "conv-nicolas-egresso",
    candidatoId: "cand-nicolas-egresso",
    ultimaAtualizacao: "31/03/2026 15:10",
    ultimaMensagem: "Tenho interesse em conversar sobre a vaga front-end.",
    mensagens: [
      {
        id: "msg-conv-nicolas-1",
        autor: "candidato",
        momento: "31/03/2026 14:38",
        texto: "Olá, vi a oportunidade e gostaria de saber mais sobre a rotina da vaga.",
      },
      {
        id: "msg-conv-nicolas-2",
        autor: "empresa",
        momento: "31/03/2026 14:52",
        texto: "Olá. A vaga atua principalmente com evolução de interfaces e integração com API.",
      },
      {
        id: "msg-conv-nicolas-3",
        autor: "candidato",
        momento: "31/03/2026 15:10",
        texto: "Tenho interesse em conversar sobre a vaga front-end.",
      },
    ],
  },
  {
    id: "conv-larissa-silva",
    candidatoId: "cand-larissa-silva",
    ultimaAtualizacao: "30/03/2026 11:25",
    ultimaMensagem: "Posso compartilhar mais detalhes da minha experiência com suporte.",
    mensagens: [
      {
        id: "msg-conv-larissa-1",
        autor: "empresa",
        momento: "30/03/2026 10:40",
        texto: "Olá, seu perfil chamou atenção para a vaga de suporte e dados.",
      },
      {
        id: "msg-conv-larissa-2",
        autor: "candidato",
        momento: "30/03/2026 11:25",
        texto: "Posso compartilhar mais detalhes da minha experiência com suporte.",
      },
    ],
  },
  {
    id: "conv-joao-henrique",
    candidatoId: "cand-joao-henrique",
    ultimaAtualizacao: "29/03/2026 16:08",
    ultimaMensagem: "Tenho disponibilidade para conversar esta semana.",
    mensagens: [
      {
        id: "msg-conv-joao-1",
        autor: "empresa",
        momento: "29/03/2026 15:42",
        texto: "Seu perfil parece aderente para a frente de dados e automação.",
      },
      {
        id: "msg-conv-joao-2",
        autor: "candidato",
        momento: "29/03/2026 16:08",
        texto: "Tenho disponibilidade para conversar esta semana.",
      },
    ],
  },
]
