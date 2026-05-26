/**
 * Gate de pesquisa obrigatória do egresso.
 *
 * Usado como rota de layout dentro do `ProtectedRoute`: se o usuário é STUDENT
 * e existe um formulário ativo (`GET /forms/active`) que ele ainda não
 * respondeu (`alreadySubmitted === false` em `GET /form/fill/{slug}`),
 * redireciona toda a navegação para `/pesquisa/{slug}` até o envio. ADMIN não
 * é afetado (só consulta o gate para STUDENT).
 *
 * Decisões:
 * - A página de preenchimento (`/pesquisa/:slug`) fica FORA deste gate, senão o
 *   redirecionamento entraria em loop.
 * - Falha "aberta": se as consultas do gate derem erro (ou não houver form
 *   ativo → 404 → `null`), o acesso é liberado — não trancamos o egresso por
 *   uma falha transitória.
 */

import { Navigate, Outlet } from "react-router-dom"

import { useAuth } from "@/contexts/AuthContext"
import { useActiveForm, useFormFill } from "@/hooks/api/use-forms"

function GateLoading() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background">
      <p className="text-sm text-muted-foreground">Carregando…</p>
    </div>
  )
}

export function RequireSurvey() {
  const { user } = useAuth()
  const isStudent = user?.role === "STUDENT"

  const activeQuery = useActiveForm(isStudent)
  const activeForm = activeQuery.data ?? null
  const fillQuery = useFormFill(isStudent ? activeForm?.slug : undefined)

  // Não-egresso: sem gate.
  if (!isStudent) return <Outlet />

  // Aguarda descobrir o form ativo e, havendo, o status de preenchimento.
  if (activeQuery.isLoading || (activeForm && fillQuery.isLoading)) {
    return <GateLoading />
  }

  const pending =
    !!activeForm && !!fillQuery.data && !fillQuery.data.alreadySubmitted

  if (pending && activeForm) {
    return <Navigate to={`/pesquisa/${activeForm.slug}`} replace />
  }

  return <Outlet />
}
