import { createContext, useContext, useState } from "react"
import type { ReactNode } from "react"

export interface UserData {
  nome: string
  email: string
}

interface UserContextType {
  userData: UserData
  updateUserData: (data: Partial<UserData>) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

const initialUserData: UserData = {
  nome: "Nicolas Egresso",
  email: "nicolas.egresso@ifal.edu.br",
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserData>(initialUserData)

  const updateUserData = (data: Partial<UserData>) => {
    setUserData((current) => ({ ...current, ...data }))
  }

  return (
    <UserContext.Provider value={{ userData, updateUserData }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
