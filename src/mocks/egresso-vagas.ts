export type VagaMock = {
  id: string
  titulo: string
  empresa: string
  localidade: string
  modalidade: string
  regime: string
  resumo: string
  nivel: string
  faixaSalarial: string
  descricao: string
  responsabilidades: string[]
  requisitos: string[]
  diferenciais: string[]
}

export type ContatoVagaMock = {
  id: string
  empresa: string
  vaga: string
  mensagemInicial: string
  momento: string
  status: string
  mensagens: Array<{
    id: string
    autor: "empresa" | "egresso"
    texto: string
    momento: string
  }>
}

export const vagasMockadas: VagaMock[] = [
  {
    id: "vaga-frontend-jr",
    titulo: "Pessoa Desenvolvedora Front-end Júnior",
    empresa: "TecNova Soluções",
    localidade: "Maceió, AL",
    modalidade: "Híbrido",
    regime: "CLT",
    nivel: "Júnior",
    faixaSalarial: "R$ 2.800 a R$ 3.400",
    resumo:
      "Atuação com interfaces web, manutenção de componentes e apoio na evolução do produto.",
    descricao:
      "A TecNova Soluções busca uma pessoa desenvolvedora front-end júnior para apoiar a construção e manutenção das interfaces do produto principal da empresa.",
    responsabilidades: [
      "Desenvolver interfaces web responsivas",
      "Apoiar a manutenção de componentes reutilizáveis",
      "Colaborar com design e back-end na evolução do produto",
    ],
    requisitos: [
      "Conhecimento em HTML, CSS e JavaScript",
      "Experiência inicial com React",
      "Boa organização e atenção a detalhes de interface",
    ],
    diferenciais: [
      "Contato com bibliotecas de componentes",
      "Experiência com testes de interface",
      "Participação em projetos acadêmicos ou portfólio",
    ],
  },
  {
    id: "vaga-suporte-dados",
    titulo: "Analista de Suporte e Dados",
    empresa: "Litoral Sistemas",
    localidade: "Arapiraca, AL",
    modalidade: "Presencial",
    regime: "CLT",
    nivel: "Pleno inicial",
    faixaSalarial: "R$ 2.500 a R$ 3.200",
    resumo:
      "Atendimento técnico, acompanhamento de indicadores e apoio na análise de dados operacionais.",
    descricao:
      "A Litoral Sistemas procura uma pessoa para atuar com suporte técnico e acompanhamento de indicadores operacionais em rotinas internas.",
    responsabilidades: [
      "Atender demandas de suporte de primeiro e segundo nível",
      "Consolidar relatórios e indicadores operacionais",
      "Apoiar análises para melhoria do atendimento",
    ],
    requisitos: [
      "Boa comunicação com usuários",
      "Conhecimento em planilhas e organização de dados",
      "Capacidade de registro e acompanhamento de chamados",
    ],
    diferenciais: [
      "Experiência anterior com suporte",
      "Noções de SQL",
      "Vivência com ferramentas de gestão de chamados",
    ],
  },
  {
    id: "vaga-qa-estagio",
    titulo: "Estágio em Qualidade de Software",
    empresa: "Ponte Digital",
    localidade: "Remoto",
    modalidade: "Remoto",
    regime: "Estágio",
    nivel: "Estágio",
    faixaSalarial: "Bolsa de R$ 1.100",
    resumo:
      "Apoio na criação de cenários de teste, registro de defeitos e validação de fluxos da aplicação.",
    descricao:
      "A Ponte Digital oferece uma oportunidade de estágio em qualidade de software para apoiar testes funcionais e documentação de cenários.",
    responsabilidades: [
      "Executar testes manuais em fluxos da aplicação",
      "Registrar defeitos com clareza",
      "Ajudar na documentação de casos de teste",
    ],
    requisitos: [
      "Interesse em qualidade de software",
      "Boa escrita para documentação",
      "Disponibilidade para estágio remoto",
    ],
    diferenciais: [
      "Conhecimento básico em testes",
      "Contato com ferramentas de gestão de tarefas",
      "Participação em projetos de software na graduação",
    ],
  },
]

export const contatosVagasMockados: ContatoVagaMock[] = [
  {
    id: "contato-tecnova-01",
    empresa: "TecNova Soluções",
    vaga: "Pessoa Desenvolvedora Front-end Júnior",
    mensagemInicial:
      "Seu perfil chamou atenção para a vaga de front-end júnior. Gostaríamos de conversar.",
    momento: "Hoje, 09:14",
    status: "Novo contato",
    mensagens: [
      {
        id: "m1",
        autor: "empresa",
        texto:
          "Olá! Analisamos seu perfil no GCEI e acreditamos que você pode ter aderência à vaga.",
        momento: "09:14",
      },
      {
        id: "m2",
        autor: "egresso",
        texto:
          "Olá! Obrigado pelo contato. Tenho interesse em saber mais sobre a oportunidade.",
        momento: "09:28",
      },
      {
        id: "m3",
        autor: "empresa",
        texto:
          "Perfeito. Podemos seguir com uma conversa inicial ainda nesta semana.",
        momento: "09:41",
      },
    ],
  },
  {
    id: "contato-litoral-02",
    empresa: "Litoral Sistemas",
    vaga: "Analista de Suporte e Dados",
    mensagemInicial:
      "Entramos em contato por meio da plataforma para apresentar uma oportunidade em suporte e dados.",
    momento: "Ontem, 15:47",
    status: "Respondido",
    mensagens: [
      {
        id: "m1",
        autor: "empresa",
        texto:
          "Olá! Encontramos seu perfil no banco de talentos e queremos apresentar a vaga.",
        momento: "15:47",
      },
      {
        id: "m2",
        autor: "egresso",
        texto:
          "Obrigado pelo contato. Tenho disponibilidade para conversar no período da tarde.",
        momento: "16:10",
      },
    ],
  },
  {
    id: "contato-ponte-03",
    empresa: "Ponte Digital",
    vaga: "Estágio em Qualidade de Software",
    mensagemInicial:
      "Gostaríamos de entender seu interesse em uma oportunidade de estágio na área de QA.",
    momento: "Seg, 10:03",
    status: "Aguardando retorno",
    mensagens: [
      {
        id: "m1",
        autor: "empresa",
        texto:
          "Olá! Temos uma oportunidade de estágio em qualidade de software e seu perfil foi indicado.",
        momento: "10:03",
      },
    ],
  },
]
