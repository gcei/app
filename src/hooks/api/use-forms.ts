/**
 * Hooks TanStack Query para formulários/pesquisa (`/forms`) e preenchimento.
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  createForm,
  deleteForm,
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
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.forms.fill(slug) }),
  })
}
