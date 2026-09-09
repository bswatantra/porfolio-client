import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { type Hero } from '../schemas'

export type CreateHeroPayload = Omit<Hero, 'id'>
export type UpdateHeroPayload = Partial<CreateHeroPayload>

export async function fetchHeroes(): Promise<Hero[]> {
  const response = await apiClient.get<Hero[]>('/heroes')
  return response.data
}

export async function fetchActiveHero(): Promise<Hero | null> {
  const response = await apiClient.get<Hero | null>('/heroes/active')
  return response.data
}

export async function fetchHeroById(id: string): Promise<Hero> {
  const response = await apiClient.get<Hero>(`/heroes/${id}`)
  return response.data
}

export async function createHero(payload: CreateHeroPayload): Promise<Hero> {
  const response = await apiClient.post<Hero>('/heroes', payload)
  return response.data
}

export async function updateHero(
  id: string,
  payload: UpdateHeroPayload
): Promise<Hero> {
  const response = await apiClient.put<Hero>(`/heroes/${id}`, payload)
  return response.data
}

export async function deleteHero(id: string): Promise<{ message: string }> {
  const response = await apiClient.delete<{ message: string }>(`/heroes/${id}`)
  return response.data
}

export async function bulkDeleteHeroes(
  ids: string[]
): Promise<{ deleted_count: number; message: string }> {
  const response = await apiClient.post<{
    deleted_count: number
    message: string
  }>('/heroes/bulk-delete', { ids })
  return response.data
}

export function useGetHeroesQuery() {
  return useQuery({
    queryKey: ['heroes'],
    queryFn: fetchHeroes,
  })
}

export function useGetActiveHeroQuery() {
  return useQuery({
    queryKey: ['heroes', 'active'],
    queryFn: fetchActiveHero,
  })
}

export function useGetHeroQuery(id: string | undefined) {
  return useQuery({
    queryKey: ['heroes', id],
    queryFn: () => fetchHeroById(id as string),
    enabled: Boolean(id),
  })
}

export function useCreateHeroMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createHero,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['heroes'] })
    },
  })
}

export function useUpdateHeroMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateHeroPayload }) =>
      updateHero(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['heroes'] })
      queryClient.invalidateQueries({ queryKey: ['heroes', variables.id] })
    },
  })
}

export function useDeleteHeroMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteHero,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['heroes'] })
    },
  })
}

export function useBulkDeleteHeroesMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: bulkDeleteHeroes,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['heroes'] })
    },
  })
}

