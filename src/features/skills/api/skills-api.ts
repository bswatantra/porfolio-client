import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { type Skill } from '../schemas'

export type CreateSkillPayload = Omit<Skill, 'id'>
export type UpdateSkillPayload = Partial<CreateSkillPayload>

export async function fetchSkills(): Promise<Skill[]> {
  const response = await apiClient.get<Skill[]>('/skills')
  return response.data
}

export async function fetchSkillById(id: string): Promise<Skill> {
  const response = await apiClient.get<Skill>(`/skills/${id}`)
  return response.data
}

export async function createSkill(payload: CreateSkillPayload): Promise<Skill> {
  const response = await apiClient.post<Skill>('/skills', payload)
  return response.data
}

export async function updateSkill(
  id: string,
  payload: UpdateSkillPayload
): Promise<Skill> {
  const response = await apiClient.put<Skill>(`/skills/${id}`, payload)
  return response.data
}

export async function deleteSkill(id: string): Promise<{ message: string }> {
  const response = await apiClient.delete<{ message: string }>(`/skills/${id}`)
  return response.data
}

export async function bulkDeleteSkills(
  ids: string[]
): Promise<{ deleted_count: number; message: string }> {
  const response = await apiClient.post<{
    deleted_count: number
    message: string
  }>('/skills/bulk-delete', { ids })
  return response.data
}

export function useGetSkillsQuery() {
  return useQuery({
    queryKey: ['skills'],
    queryFn: fetchSkills,
  })
}

export function useGetSkillQuery(id: string | undefined) {
  return useQuery({
    queryKey: ['skills', id],
    queryFn: () => fetchSkillById(id as string),
    enabled: Boolean(id),
  })
}

export function useCreateSkillMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] })
    },
  })
}

export function useUpdateSkillMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateSkillPayload
    }) => updateSkill(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['skills'] })
      queryClient.invalidateQueries({ queryKey: ['skills', variables.id] })
    },
  })
}

export function useDeleteSkillMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] })
    },
  })
}

export function useBulkDeleteSkillsMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: bulkDeleteSkills,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] })
    },
  })
}

