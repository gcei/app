export type PesquisaAnualQuestion = {
  id: string
  title: string
  options: string[]
}

export const pesquisaAnualQuestions: PesquisaAnualQuestion[] = [
  {
    id: "situacao-profissional",
    title: "1. Qual é a sua situação profissional atual?",
    options: [
      "Empregado(a)",
      "Desempregado(a) em busca de oportunidade",
      "Estudando em tempo integral",
      "Empreendendo ou atuando como autônomo(a)",
    ],
  },
  {
    id: "atuacao-area",
    title: "2. Você atua na área da sua formação no IFAL?",
    options: [
      "Sim, diretamente",
      "Sim, parcialmente",
      "Não atuo na área",
      "Ainda não estou trabalhando",
    ],
  },
  {
    id: "vinculo-trabalho",
    title: "3. Qual é o seu principal vínculo de trabalho hoje?",
    options: [
      "CLT",
      "Pessoa jurídica ou contrato por projeto",
      "Servidor(a) público(a)",
      "Autônomo(a) ou empreendedor(a)",
    ],
  },
  {
    id: "faixa-renda",
    title: "4. Qual é a sua faixa de renda mensal atual?",
    options: [
      "Até 1 salário mínimo",
      "De 1 a 2 salários mínimos",
      "De 2 a 4 salários mínimos",
      "Acima de 4 salários mínimos",
    ],
  },
  {
    id: "tempo-primeira-oportunidade",
    title:
      "5. Quanto tempo levou para conseguir sua primeira oportunidade após a conclusão do curso?",
    options: [
      "Já estava trabalhando antes de concluir",
      "Até 6 meses",
      "Entre 6 e 12 meses",
      "Ainda não consegui uma oportunidade",
    ],
  },
  {
    id: "formacao-continuada",
    title: "6. Você continuou seus estudos após o curso no IFAL?",
    options: [
      "Não continuei os estudos",
      "Curso técnico ou livre",
      "Graduação ou especialização",
      "Mestrado ou doutorado",
    ],
  },
  {
    id: "atualizacao-profissional",
    title:
      "7. Com que frequência você atualiza seu currículo ou perfil profissional?",
    options: [
      "Mensalmente",
      "A cada poucos meses",
      "Uma vez por ano",
      "Somente quando preciso buscar vaga",
    ],
  },
  {
    id: "canal-oportunidade",
    title: "8. Qual canal mais gera oportunidades para você?",
    options: [
      "Indicação de contatos",
      "Plataformas de vagas",
      "Redes sociais profissionais",
      "Concursos ou processos públicos",
    ],
  },
  {
    id: "modelo-trabalho",
    title: "9. Qual modelo de trabalho você prefere atualmente?",
    options: ["Presencial", "Híbrido", "Remoto", "Sem preferência"],
  },
  {
    id: "interesse-vitrine",
    title:
      "10. Você deseja manter seu perfil visível no banco de talentos do GCEI?",
    options: [
      "Sim, quero manter visível",
      "Sim, mas somente com contato seguro",
      "Não no momento",
      "Vou decidir depois",
    ],
  },
]
