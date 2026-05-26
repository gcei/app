/**
 * Hooks TanStack Query para formulários/pesquisa (`/forms`) e preenchimento.
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  createForm,
  deleteForm,
  getActiveForm,
  getForm,
  getFormFill,
  getFormResults,
  getFormResultsStats,
  listForms,
  submitFormFill,
  updateForm,
} from "@/lib/api/forms"
import type {
  CreateFormPayload,
  FormFill,
  SubmitFormPayload,
  UpdateFormPayload,
} from "@/lib/api/types"
import { queryKeys } from "@/lib/query/keys"

export function useForms() {
  return useQuery({
    queryKey: queryKeys.forms.list(),
    queryFn: () => listForms(),
  })
}

export function useForm(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.forms.detail(id ?? ""),
    queryFn: () => getForm(id as string),
    enabled: !!id,
  })
}

export function useCreateForm() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateFormPayload) => createForm(payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.forms.all }),
  })
}

export function useUpdateForm() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateFormPayload }) =>
      updateForm(id, payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.forms.all }),
  })
}

export function useDeleteForm() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteForm(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.forms.all }),
  })
}

export function useFormResults(id: string | undefined) {
  return useQuery({
    queryKey: id ? queryKeys.forms.results(id) : queryKeys.forms.all,
    queryFn: () => getFormResults(id as string),
    enabled: !!id,
  })
}

export function useFormResultsStats(id: string | undefined) {
  return useQuery({
    queryKey: id ? queryKeys.forms.resultsStats(id) : queryKeys.forms.all,
    queryFn: () => getFormResultsStats(id as string),
    enabled: !!id,
  })
}

/**
 * Form atualmente ativo (`/forms/active`). `enabled` permite restringir a
 * consulta ao egresso (STUDENT) — ver gate `RequireSurvey`.
 */
export function useActiveForm(enabled = true) {
  return useQuery({
    queryKey: queryKeys.forms.active(),
    queryFn: getActiveForm,
    enabled,
  })
}

export function useFormFill(slug: string | undefined) {
  return useQuery({
    queryKey: queryKeys.forms.fill(slug ?? ""),
    queryFn: () => getFormFill(slug as string),
    enabled: !!slug,
  })
}

export function useSubmitFormFill(slug: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: SubmitFormPayload) => submitFormFill(slug, payload),
    onSuccess: () => {
      // Marca como já enviado de imediato no cache: evita que o gate
      // (RequireSurvey) redirecione de volta para a pesquisa na janela entre
      // o sucesso e o refetch disparado pelo invalidate.
      queryClient.setQueryData<FormFill>(queryKeys.forms.fill(slug), (prev) =>
        prev ? { ...prev, alreadySubmitted: true } : prev,
      )
      queryClient.invalidateQueries({ queryKey: queryKeys.forms.fill(slug) })
    },
  })
}
