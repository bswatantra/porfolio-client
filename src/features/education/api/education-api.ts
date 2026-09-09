import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { type Education } from '../schemas'

export type CreateEducationPayload = Omit<Education, 'id'>
export type UpdateEducationPayload = Partial<CreateEducationPayload>

export async function fetchEducationList(): Promise<Education[]> {
  const response = await apiClient.get<Education[]>('/education')
  return response.data
}

export async function fetchEducationById(id: string): Promise<Education> {
  const response = await apiClient.get<Education>(`/education/${id}`)
  return response.data
}

export async function createEducation(
  payload: CreateEducationPayload
): Promise<Education> {
  const response = await apiClient.post<Education>('/education', payload)
  return response.data
}

export async function updateEducation(
  id: string,
  payload: UpdateEducationPayload
): Promise<Education> {
  const response = await apiClient.put<Education>(`/education/${id}`, payload)
  return response.data
}

export async function deleteEducation(id: string): Promise<{ message: string }> {
  const response = await apiClient.delete<{ message: string }>(`/education/${id}`)
  return response.data
}

export async function bulkDeleteEducation(
  ids: string[]
): Promise<{ deleted_count: number; message: string }> {
  const response = await apiClient.post<{
    deleted_count: number
    message: string
  }>('/education/bulk-delete', { ids })
  return response.data
}

export function useGetEducationListQuery() {
  return useQuery({
    queryKey: ['education'],
    queryFn: fetchEducationList,
  })
}

export function useGetEducationQuery(id: string | undefined) {
  return useQuery({
    queryKey: ['education', id],
    queryFn: () => fetchEducationById(id as string),
    enabled: Boolean(id),
  })
}

export function useCreateEducationMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createEducation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['education'] })
    },
  })
}

export function useUpdateEducationMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateEducationPayload
    }) => updateEducation(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['education'] })
      queryClient.invalidateQueries({ queryKey: ['education', variables.id] })
    },
  })
}

export function useDeleteEducationMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteEducation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['education'] })
    },
  })
}

export function useBulkDeleteEducationMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: bulkDeleteEducation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['education'] })
    },
  })
}

