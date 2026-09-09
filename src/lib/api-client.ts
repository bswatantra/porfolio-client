import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios'
import { useAuthStore } from '@/stores/auth-store'

/**
 * Base API URL for API requests.
 * Defaults to `/api/v1` which is proxied to the backend in development.
 */
const BASE_URL: string =
  (import.meta.env.VITE_API_URL as string | undefined) || '/api/v1'

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor: inject JWT Bearer token if available
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token: string = useAuthStore.getState().auth.accessToken
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: unknown): Promise<never> => {
    return Promise.reject(error)
  }
)

// Response interceptor: handle 401 unauthorized session expiry
apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown): Promise<never> => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const isLoginRequest = error.config?.url?.includes('/auth/login')
      if (!isLoginRequest) {
        useAuthStore.getState().auth.reset()
        if (
          typeof window !== 'undefined' &&
          !window.location.pathname.startsWith('/sign-in')
        ) {
          const currentPath = window.location.pathname + window.location.search
          window.location.href = `/sign-in?redirect=${encodeURIComponent(currentPath)}`
        }
      }
    }
    return Promise.reject(error)
  }
)

