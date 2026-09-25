import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { Blog, BlogSection } from '../types'

export interface CreateBlogPayload {
  title: string
  slug: string
  excerpt: string
  content?: string
  sections?: BlogSection[]
  coverImage: string
  category: string
  tags: string[]
  readTime: string
  featured?: boolean
  published?: boolean
  authorName: string
  authorRole?: string
  authorAvatarUrl?: string
}

export type UpdateBlogPayload = Partial<CreateBlogPayload>

export interface BlogFilterParams {
  category?: string
  tag?: string
  search?: string
  featured?: boolean
  published_only?: boolean
  page?: number
  limit?: number
}

export async function fetchBlogs(params?: BlogFilterParams): Promise<Blog[]> {
  const response = await apiClient.get<Blog[]>('/blogs', { params })
  return response.data
}

export async function fetchBlogByIdOrSlug(idOrSlug: string): Promise<Blog> {
  const response = await apiClient.get<Blog>(`/blogs/${idOrSlug}`)
  return response.data
}

export async function createBlog(payload: CreateBlogPayload): Promise<Blog> {
  const response = await apiClient.post<Blog>('/blogs', payload)
  return response.data
}

export async function updateBlog(
  id: string,
  payload: UpdateBlogPayload
): Promise<Blog> {
  const response = await apiClient.put<Blog>(`/blogs/${id}`, payload)
  return response.data
}

export async function deleteBlog(id: string): Promise<{ message: string }> {
  const response = await apiClient.delete<{ message: string }>(`/blogs/${id}`)
  return response.data
}

export async function bulkDeleteBlogs(
  ids: string[]
): Promise<{ deleted_count: number; message: string }> {
  const response = await apiClient.post<{ deleted_count: number; message: string }>(
    '/blogs/bulk-delete',
    { ids }
  )
  return response.data
}

export async function clapBlog(idOrSlug: string): Promise<{ claps: number; message: string }> {
  const response = await apiClient.post<{ claps: number; message: string }>(
    `/blogs/${idOrSlug}/clap`
  )
  return response.data
}

export async function seedBlogs(): Promise<{ message: string }> {
  const response = await apiClient.post<{ message: string }>('/blogs/seed')
  return response.data
}

export async function uploadBlogCover(file: File): Promise<{ url: string; filename: string }> {
  const formData = new FormData()
  formData.append('file', file)
  const response = await apiClient.post<{ url: string; filename: string }>(
    '/blogs/upload-cover',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )
  return response.data
}

// React Query Hooks

export function useGetBlogsQuery(params?: BlogFilterParams) {
  return useQuery({
    queryKey: ['blogs', params],
    queryFn: () => fetchBlogs(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useGetBlogQuery(idOrSlug: string | undefined) {
  return useQuery({
    queryKey: ['blogs', 'detail', idOrSlug],
    queryFn: () => fetchBlogByIdOrSlug(idOrSlug as string),
    enabled: Boolean(idOrSlug),
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreateBlogMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })
}

export function useUpdateBlogMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateBlogPayload }) =>
      updateBlog(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      queryClient.invalidateQueries({ queryKey: ['blogs', 'detail', variables.id] })
    },
  })
}

export function useDeleteBlogMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })
}

export function useBulkDeleteBlogsMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: bulkDeleteBlogs,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })
}

export function useClapBlogMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (idOrSlug: string) => clapBlog(idOrSlug),
    onSuccess: (_data, idOrSlug) => {
      queryClient.invalidateQueries({ queryKey: ['blogs', 'detail', idOrSlug] })
    },
  })
}

export function useSeedBlogsMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: seedBlogs,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })
}
