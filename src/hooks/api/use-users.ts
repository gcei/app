/**
 * Hooks TanStack Query para usuários (`/users`) e currículos públicos.
 * (Nome dos hooks evita colidir com `useUser` do `UserContext`.)
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  getUser,
  getUserResume,
  listUserResumes,
  listUsers,
  updateUser,
  type UsersFilters,
} from "@/lib/api/users"
import type { UpdateUserPayload } from "@/lib/api/types"
import { queryKeys } from "@/lib/query/keys"

/** Lista paginada de usuários com filtros (server-side). */
export function useUsers(filters: UsersFilters) {
  return useQuery({
    queryKey: queryKeys.users.list(filters),
    queryFn: () => listUsers(filters),
  })
}

/** Usuário por id. Desabilitado sem `id`. */
export function useUserById(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.users.detail(id ?? ""),
    queryFn: () => getUser(id as string),
    enabled: !!id,
  })
}

/**
 * Atualiza um usuário (perfil). Invalida `/me` (para o AuthContext refazer o
 * bootstrap) e a lista de usuários.
 */
export function useUpdateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserPayload }) =>
      updateUser(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.me.detail() })
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all })
    },
  })
}

/** Currículos públicos de um usuário. */
export function useUserResumes(userId: string | undefined) {
  return useQuery({
    queryKey: userId
      ? queryKeys.users.resumes.list(userId)
      : queryKeys.users.all,
    queryFn: () => listUserResumes(userId as string),
    enabled: !!userId,
  })
}

/** Currículo público completo (com aninhados). */
export function useUserResumeDetail(
  userId: string | undefined,
  id: string | undefined,
) {
  return useQuery({
    queryKey:
      userId && id
        ? queryKeys.users.resumes.detail(userId, id)
        : queryKeys.users.all,
    queryFn: () => getUserResume(userId as string, id as string),
    enabled: !!userId && !!id,
  })
}
