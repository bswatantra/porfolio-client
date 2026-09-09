import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import {
  type User,
  type UserListResponse,
  type UserCreatePayload,
  type UserUpdatePayload,
} from '../schemas'

export async function fetchUsers(params?: {
  page?: number
  page_size?: number
}): Promise<UserListResponse> {
  const response = await apiClient.get<UserListResponse>('/users', {
    params: {
      page: params?.page ?? 1,
      page_size: params?.page_size ?? 100,
    },
  })
  return response.data
}

export async function fetchUserById(id: string): Promise<User> {
  const response = await apiClient.get<User>(`/users/${id}`)
  return response.data
}

export async function createUser(payload: UserCreatePayload): Promise<User> {
  const response = await apiClient.post<User>('/users', payload)
  return response.data
}

export async function updateUser(
  id: string,
  payload: UserUpdatePayload
): Promise<User> {
  const response = await apiClient.put<User>(`/users/${id}`, payload)
  return response.data
}

export async function deleteUser(id: string): Promise<{ message: string }> {
  const response = await apiClient.delete<{ message: string }>(`/users/${id}`)
  return response.data
}

export async function bulkDeleteUsers(
  ids: string[]
): Promise<{ deleted_count: number; message: string }> {
  const response = await apiClient.post<{
    deleted_count: number
    message: string
  }>('/users/bulk-delete', { ids })
  return response.data
}

export function useGetUsersQuery(params?: { page?: number; page_size?: number }) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => fetchUsers(params),
  })
}

export function useGetUserQuery(id: string | undefined) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => fetchUserById(id as string),
    enabled: Boolean(id),
  })
}

export function useCreateUserMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export function useUpdateUserMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UserUpdatePayload }) =>
      updateUser(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export function useDeleteUserMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export function useBulkDeleteUsersMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: bulkDeleteUsers,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
