import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios'
import { useAuthStore } from '@/stores/auth-store'

/**
 * Resolves and normalizes the base API URL:
 * - Production: checks VITE_API_URL, VITE_BACKEND_URL, VITE_SERVER_URL, or VITE_PROXY_TARGET.
 * - Automatically prepends https:// if protocol was omitted (e.g. your-api.onrender.com).
 * - Automatically ensures /api/v1 is appended so /experiences maps to /api/v1/experiences.
 * - Development: falls back to /api/v1 to use Vite's dev server proxy.
 */
function getBaseUrl(): string {
  let envUrl =
    (import.meta.env.VITE_API_URL as string | undefined)?.trim() ||
    (import.meta.env.VITE_BACKEND_URL as string | undefined)?.trim() ||
    (import.meta.env.VITE_SERVER_URL as string | undefined)?.trim() ||
    (import.meta.env.PROD
      ? (import.meta.env.VITE_PROXY_TARGET as string | undefined)?.trim()
      : undefined)

  if (envUrl) {
    if (
      !envUrl.startsWith('http://') &&
      !envUrl.startsWith('https://') &&
      !envUrl.startsWith('/')
    ) {
      envUrl = `https://${envUrl}`
    }

    const cleaned = envUrl.replace(/\/+$/, '')
    if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) {
      return cleaned.endsWith('/api/v1') ? cleaned : `${cleaned}/api/v1`
    }
    return cleaned
  }

  return '/api/v1'
}

export const BASE_URL: string = getBaseUrl()

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

