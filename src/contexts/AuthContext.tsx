/**
 * Contexto de autenticação.
 *
 * Fonte da verdade sobre a sessão: no bootstrap consulta `GET /me` (via
 * TanStack Query), expõe `user`/`isAuthenticated`/`isLoading` e as ações
 * `login`/`logout`. Também registra no `http.ts` o handler de "não
 * autenticado" (disparado quando o refresh falha), substituindo o default
 * que recarrega a página.
 */

import { createContext, useContext, useEffect } from "react"
import type { ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import { useQuery, useQueryClient } from "@tanstack/react-query"

import { login as apiLogin } from "@/lib/api/auth"
import { ApiError, setUnauthorizedHandler } from "@/lib/api/http"
import { getMe } from "@/lib/api/me"
import type { LoginPayload, User } from "@/lib/api/types"
import { queryKeys } from "@/lib/query/keys"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (payload: LoginPayload) => Promise<User>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const meQuery = useQuery({
    queryKey: queryKeys.me.detail(),
    queryFn: async (): Promise<User | null> => {
      try {
        return await getMe()
      } catch (error) {
        // 401 = sem sessão / sessão expirada → tratamos como não autenticado.
        if (error instanceof ApiError && error.status === 401) return null
        throw error
      }
    },
    retry: false,
    staleTime: 5 * 60_000,
  })

  // Quando o refresh falha de vez, o http.ts chama este handler.
  useEffect(() => {
    setUnauthorizedHandler(() => {
      queryClient.setQueryData(queryKeys.me.detail(), null)
      if (window.location.pathname !== "/login") {
        navigate("/login", { replace: true })
      }
    })
  }, [navigate, queryClient])

  const login = async (payload: LoginPayload): Promise<User> => {
    const user = await apiLogin(payload)
    queryClient.setQueryData(queryKeys.me.detail(), user)
    return user
  }

  const logout = () => {
    // A API não expõe endpoint de logout e os cookies são HttpOnly (não dá
    // para limpá-los via JS). Logout do lado do cliente: zeramos o usuário e
    // voltamos ao login; os cookies expiram sozinhos (accessToken ~15min).
    // TODO(backend): rota de logout que invalide/limpe os cookies.
    queryClient.setQueryData(queryKeys.me.detail(), null)
    navigate("/login", { replace: true })
  }

  const user = meQuery.data ?? null
  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading: meQuery.isLoading,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
