// @mock-fallback: sem endpoint na API ainda.
//
// Os candidatos (banco de talentos) foram migrados para a API
// (`GET /users` + `GET /users/{userId}/resumes`). O que resta aqui é o
// chat/contato empresa↔candidato, que não tem endpoint nem tela ainda —
// preservado para quando o recurso de mensagens for implementado.

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
