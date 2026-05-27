/**
 * Guarda de rota por papel (role).
 *
 * Usada como rota de layout dentro do `ProtectedRoute` (que garante a
 * autenticação): se o papel do usuário logado não for o exigido, redireciona
 * para a área correspondente ao seu próprio papel — STUDENT só acessa
 * `/home/egresso`, ADMIN só acessa `/home/interno`.
 */

import { Navigate, Outlet } from "react-router-dom"

import { useAuth } from "@/contexts/AuthContext"
import type { UserRole } from "@/lib/api/types"

/** Home de cada papel: STUDENT → egresso, ADMIN → interno. */
function homePathForRole(role: UserRole): string {
  return role === "ADMIN" ? "/home/interno" : "/home/egresso"
}

export function RequireRole({ role }: { role: UserRole }) {
  const { user } = useAuth()
  // ProtectedRoute já garante autenticação; salvaguarda para o type-narrowing.
  if (!user) return null
  if (user.role !== role) {
    return <Navigate to={homePathForRole(user.role)} replace />
  }
  return <Outlet />
}

/** Redireciona "/" para a home do papel do usuário. */
export function HomeRedirect() {
  const { user } = useAuth()
  if (!user) return null
  return <Navigate to={homePathForRole(user.role)} replace />
}
