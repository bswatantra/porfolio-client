import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { type Project } from '../schemas'

export type CreateProjectPayload = Omit<Project, 'id'>
export type UpdateProjectPayload = Partial<CreateProjectPayload>

export async function fetchProjects(): Promise<Project[]> {
  const response = await apiClient.get<Project[]>('/projects')
  return response.data
}

export async function fetchProjectById(id: string): Promise<Project> {
  const response = await apiClient.get<Project>(`/projects/${id}`)
  return response.data
}

export async function createProject(
  payload: CreateProjectPayload
): Promise<Project> {
  const response = await apiClient.post<Project>('/projects', payload)
  return response.data
}

export async function updateProject(
  id: string,
  payload: UpdateProjectPayload
): Promise<Project> {
  const response = await apiClient.put<Project>(`/projects/${id}`, payload)
  return response.data
}

export async function deleteProject(id: string): Promise<{ message: string }> {
  const response = await apiClient.delete<{ message: string }>(`/projects/${id}`)
  return response.data
}

export async function bulkDeleteProjects(
  ids: string[]
): Promise<{ deleted_count: number; message: string }> {
  const response = await apiClient.post<{
    deleted_count: number
    message: string
  }>('/projects/bulk-delete', { ids })
  return response.data
}

export function useGetProjectsQuery() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  })
}

export function useGetProjectQuery(id: string | undefined) {
  return useQuery({
    queryKey: ['projects', id],
    queryFn: () => fetchProjectById(id as string),
    enabled: Boolean(id),
  })
}

export function useCreateProjectMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

export function useUpdateProjectMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateProjectPayload
    }) => updateProject(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['projects', variables.id] })
    },
  })
}

export function useDeleteProjectMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

export function useBulkDeleteProjectsMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: bulkDeleteProjects,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

