import { createContext, useContext } from "react"
import type { ReactNode } from "react"

import { useAuth } from "@/contexts/AuthContext"

export interface UserData {
  nome: string
  email: string
}

interface UserContextType {
  userData: UserData
}

const UserContext = createContext<UserContextType | undefined>(undefined)

/**
 * Adaptador de leitura sobre o `AuthContext`: expõe `userData` ({ nome, email })
 * derivado do usuário autenticado (`/me`), mantendo a interface usada pelas
 * telas (ex.: sidebar do egresso). A edição de perfil é persistida via
 * `useUpdateUser` (PATCH /users/{id}), que invalida o `/me` e atualiza aqui.
 */
export function UserProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()

  const userData: UserData = {
    nome: user?.name ?? "",
    email: user?.email ?? "",
  }

  return (
    <UserContext.Provider value={{ userData }}>{children}</UserContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
