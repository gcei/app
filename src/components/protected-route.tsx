/**
 * Guarda de rota por autenticação.
 *
 * Usado como rota de layout (`<Route element={<ProtectedRoute />}>`): enquanto
 * o `GET /me` do bootstrap carrega, mostra um estado de carregamento; sem
 * sessão, redireciona para `/login`; autenticado, renderiza as rotas filhas.
 *
 * Obs.: por ora a guarda é só de autenticação (qualquer usuário logado passa).
 * O gate por papel (STUDENT × ADMIN) entra quando a distinção de áreas for
 * definida — ver decisão pendente de "empresa × egresso" no plano.
 */

import { Navigate, Outlet } from "react-router-dom"

import { useAuth } from "@/contexts/AuthContext"

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Carregando…</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
