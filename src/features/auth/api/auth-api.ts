import { useMutation, type UseMutationResult } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthUserDto {
  id: string
  email: string
  username: string
  full_name: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface LoginResponse {
  access_token: string
  token_type: string
  expires_in: number
  user: AuthUserDto
}

export type CurrentUserResponse = AuthUserDto

/**
 * Direct API request using Axios to authenticate user credentials.
 */
export async function loginUser(
  credentials: LoginCredentials
): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>(
    '/auth/login',
    credentials
  )
  return response.data
}

/**
 * Direct API request using Axios to retrieve current authenticated user.
 */
export async function fetchCurrentUser(): Promise<CurrentUserResponse> {
  const response = await apiClient.get<CurrentUserResponse>('/auth/me')
  return response.data
}

/**
 * Custom TanStack Query mutation hook for user authentication.
 * Suppresses global error toasts so validation errors are only rendered directly in the form.
 */
export function useLoginMutation(): UseMutationResult<
  LoginResponse,
  unknown,
  LoginCredentials
> {
  return useMutation({
    mutationFn: loginUser,
    meta: {
      suppressToast: true,
    },
    onError: () => {
      // Intentionally empty: suppress global toast so errors only render below form fields
    },
  })
}
