/**
 * Query keys centralizadas do TanStack Query.
 *
 * Organizadas por recurso da API GCEI, seguindo o padrão de "key factory"
 * hierárquico: chaves mais específicas estendem as mais genéricas, o que
 * permite invalidar em lote (ex.: `queryKeys.forms.all` invalida toda a
 * árvore de formulários). Cada fase consome/estende as chaves que precisar.
 */

export const queryKeys = {
  /** Usuário logado e seus recursos (`/me`, `/me/hardskills`, ...). */
  me: {
    all: ["me"] as const,
    detail: () => [...queryKeys.me.all, "detail"] as const,
    hardSkills: () => [...queryKeys.me.all, "hardskills"] as const,
    softSkills: () => [...queryKeys.me.all, "softskills"] as const,
    resumes: {
      all: () => [...queryKeys.me.all, "resumes"] as const,
      list: () => [...queryKeys.me.resumes.all(), "list"] as const,
      detail: (id: string) => [...queryKeys.me.resumes.all(), "detail", id] as const,
    },
  },

  /** Usuários (`/users`) — visão interna/admin. */
  users: {
    all: ["users"] as const,
    list: (params?: object) =>
      [...queryKeys.users.all, "list", params ?? {}] as const,
    detail: (id: string) => [...queryKeys.users.all, "detail", id] as const,
    /** Currículos públicos de um usuário (`/users/{userId}/resumes`). */
    resumes: {
      list: (userId: string) =>
        [...queryKeys.users.detail(userId), "resumes"] as const,
      detail: (userId: string, id: string) =>
        [...queryKeys.users.detail(userId), "resumes", id] as const,
    },
  },

  /** Formulários/pesquisas (`/forms`). */
  forms: {
    all: ["forms"] as const,
    list: (params?: object) =>
      [...queryKeys.forms.all, "list", params ?? {}] as const,
    detail: (id: string) => [...queryKeys.forms.all, "detail", id] as const,
    results: (id: string) => [...queryKeys.forms.detail(id), "results"] as const,
    resultsStats: (id: string) =>
      [...queryKeys.forms.detail(id), "results", "stats"] as const,
    questionAnswers: (id: string, questionId: string) =>
      [...queryKeys.forms.detail(id), "results", questionId, "answers"] as const,
    /** Formulário público para preenchimento (`/form/fill/{slug}`). */
    fill: (slug: string) => ["form-fill", slug] as const,
  },
} as const
