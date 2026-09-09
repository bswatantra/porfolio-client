import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { type Experience } from '../schemas'

export type CreateExperiencePayload = Omit<Experience, 'id'>
export type UpdateExperiencePayload = Partial<CreateExperiencePayload>

export async function fetchExperiences(): Promise<Experience[]> {
  const response = await apiClient.get<Experience[]>('/experiences')
  return response.data
}

export async function fetchExperienceById(id: string): Promise<Experience> {
  const response = await apiClient.get<Experience>(`/experiences/${id}`)
  return response.data
}

export async function createExperience(
  payload: CreateExperiencePayload
): Promise<Experience> {
  const response = await apiClient.post<Experience>('/experiences', payload)
  return response.data
}

export async function updateExperience(
  id: string,
  payload: UpdateExperiencePayload
): Promise<Experience> {
  const response = await apiClient.put<Experience>(`/experiences/${id}`, payload)
  return response.data
}

export async function deleteExperience(id: string): Promise<{ message: string }> {
  const response = await apiClient.delete<{ message: string }>(
    `/experiences/${id}`
  )
  return response.data
}

export async function bulkDeleteExperiences(
  ids: string[]
): Promise<{ deleted_count: number; message: string }> {
  const response = await apiClient.post<{
    deleted_count: number
    message: string
  }>('/experiences/bulk-delete', { ids })
  return response.data
}

export function useGetExperiencesQuery() {
  return useQuery({
    queryKey: ['experiences'],
    queryFn: fetchExperiences,
  })
}

export function useGetExperienceQuery(id: string | undefined) {
  return useQuery({
    queryKey: ['experiences', id],
    queryFn: () => fetchExperienceById(id as string),
    enabled: Boolean(id),
  })
}

export function useCreateExperienceMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createExperience,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] })
    },
  })
}

export function useUpdateExperienceMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateExperiencePayload
    }) => updateExperience(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] })
      queryClient.invalidateQueries({ queryKey: ['experiences', variables.id] })
    },
  })
}

export function useDeleteExperienceMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteExperience,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] })
    },
  })
}

export function useBulkDeleteExperiencesMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: bulkDeleteExperiences,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] })
    },
  })
}

