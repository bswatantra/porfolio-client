import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { type About } from '../schemas'

export type CreateAboutPayload = Omit<About, 'id' | 'projectsCount' | 'skillsCount'>
export type UpdateAboutPayload = Partial<CreateAboutPayload>

export async function fetchAboutList(): Promise<About[]> {
  const response = await apiClient.get<About[]>('/about')
  return response.data
}

export async function fetchActiveAbout(): Promise<About | null> {
  const response = await apiClient.get<About | null>('/about/active')
  return response.data
}

export async function fetchAboutById(id: string): Promise<About> {
  const response = await apiClient.get<About>(`/about/${id}`)
  return response.data
}

export async function createAbout(payload: CreateAboutPayload): Promise<About> {
  const response = await apiClient.post<About>('/about', payload)
  return response.data
}

export async function updateAbout(
  id: string,
  payload: UpdateAboutPayload
): Promise<About> {
  const response = await apiClient.put<About>(`/about/${id}`, payload)
  return response.data
}

export async function deleteAbout(id: string): Promise<{ message: string }> {
  const response = await apiClient.delete<{ message: string }>(`/about/${id}`)
  return response.data
}

export async function bulkDeleteAbout(
  ids: string[]
): Promise<{ deleted_count: number; message: string }> {
  const response = await apiClient.post<{
    deleted_count: number
    message: string
  }>('/about/bulk-delete', { ids })
  return response.data
}

export function useGetAboutListQuery() {
  return useQuery({
    queryKey: ['about'],
    queryFn: fetchAboutList,
  })
}

export function useGetActiveAboutQuery() {
  return useQuery({
    queryKey: ['about', 'active'],
    queryFn: fetchActiveAbout,
  })
}

export function useGetAboutQuery(id: string | undefined) {
  return useQuery({
    queryKey: ['about', id],
    queryFn: () => fetchAboutById(id as string),
    enabled: Boolean(id),
  })
}

export function useCreateAboutMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createAbout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['about'] })
    },
  })
}

export function useUpdateAboutMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateAboutPayload }) =>
      updateAbout(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['about'] })
      queryClient.invalidateQueries({ queryKey: ['about', variables.id] })
    },
  })
}

export function useDeleteAboutMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteAbout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['about'] })
    },
  })
}

export function useBulkDeleteAboutMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: bulkDeleteAbout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['about'] })
    },
  })
}

