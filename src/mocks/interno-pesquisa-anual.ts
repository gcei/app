export type PerguntaPesquisaAnualMock = {
  id: string
  enunciado: string
  opcoes: string[]
}

export type RespostaPesquisaAnualMock = {
  id: string
  egressoId: string
  egresso: string
  perguntaId: string
  resposta: string
  respondidaEm: string
}

export const perguntasPesquisaAnualMockadas: PerguntaPesquisaAnualMock[] = [
  {
    id: "situacao-profissional",
    enunciado: "Qual é a sua situação profissional atual?",
    opcoes: [
      "Empregado(a)",
      "Desempregado(a) em busca de oportunidade",
      "Estudando em tempo integral",
      "Empreendendo ou atuando como autônomo(a)",
    ],
  },
  {
    id: "atuacao-area",
    enunciado: "Você atua na área da sua formação no IFAL?",
    opcoes: [
      "Sim, diretamente",
      "Sim, parcialmente",
      "Não atuo na área",
      "Ainda não estou trabalhando",
    ],
  },
  {
    id: "faixa-renda",
    enunciado: "Qual é a sua faixa de renda mensal atual?",
    opcoes: [
      "Até 1 salário mínimo",
      "De 1 a 2 salários mínimos",
      "De 2 a 4 salários mínimos",
      "Acima de 4 salários mínimos",
      "Prefiro não informar",
    ],
  },
  {
    id: "modelo-trabalho",
    enunciado: "Qual modelo de trabalho você prefere atualmente?",
    opcoes: ["Presencial", "Híbrido", "Remoto", "Sem preferência"],
  },
]

export const respostasPesquisaAnualMockadas: RespostaPesquisaAnualMock[] = [
  {
    id: "resp-1",
    egressoId: "egresso-nicolas",
    egresso: "Nicolas Egresso",
    perguntaId: "situacao-profissional",
    resposta: "Empregado(a)",
    respondidaEm: "31/03/2026 10:42",
  },
  {
    id: "resp-2",
    egressoId: "egresso-nicolas",
    egresso: "Nicolas Egresso",
    perguntaId: "atuacao-area",
    resposta: "Sim, diretamente",
    respondidaEm: "31/03/2026 10:44",
  },
  {
    id: "resp-3",
    egressoId: "egresso-larissa",
    egresso: "Larissa Silva",
    perguntaId: "situacao-profissional",
    resposta: "Empregado(a)",
    respondidaEm: "30/03/2026 15:18",
  },
  {
    id: "resp-4",
    egressoId: "egresso-larissa",
    egresso: "Larissa Silva",
    perguntaId: "modelo-trabalho",
    resposta: "Híbrido",
    respondidaEm: "30/03/2026 15:22",
  },
  {
    id: "resp-5",
    egressoId: "egresso-joao",
    egresso: "João Henrique",
    perguntaId: "faixa-renda",
    resposta: "De 2 a 4 salários mínimos",
    respondidaEm: "29/03/2026 09:31",
  },
  {
    id: "resp-6",
    egressoId: "egresso-maria",
    egresso: "Maria Clara",
    perguntaId: "modelo-trabalho",
    resposta: "Remoto",
    respondidaEm: "28/03/2026 18:05",
  },
]
