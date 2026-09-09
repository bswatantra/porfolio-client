import { create } from 'zustand'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'
import type { AuthUser, AuthState } from './types'

export type { AuthUser, AuthState }

const ACCESS_TOKEN = 'thisisjustarandomstring'
const AUTH_USER = 'portfolio_auth_user'

function parseStoredUser(raw: string | undefined): AuthUser | null {
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

function parseStoredToken(raw: string | undefined): string {
  if (!raw) return ''
  try {
    return JSON.parse(raw) as string
  } catch {
    return raw
  }
}

export const useAuthStore = create<AuthState>()((set) => {
  const cookieToken = getCookie(ACCESS_TOKEN)
  const cookieUser = getCookie(AUTH_USER)

  const initToken: string = parseStoredToken(cookieToken)
  const initUser: AuthUser | null = parseStoredUser(cookieUser)

  return {
    auth: {
      user: initUser,
      setUser: (user: AuthUser | null) =>
        set((state) => {
          if (user) {
            setCookie(AUTH_USER, JSON.stringify(user))
          } else {
            removeCookie(AUTH_USER)
          }
          return { ...state, auth: { ...state.auth, user } }
        }),
      accessToken: initToken,
      setAccessToken: (accessToken: string) =>
        set((state) => {
          setCookie(ACCESS_TOKEN, JSON.stringify(accessToken))
          return { ...state, auth: { ...state.auth, accessToken } }
        }),
      resetAccessToken: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN)
          return { ...state, auth: { ...state.auth, accessToken: '' } }
        }),
      reset: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN)
          removeCookie(AUTH_USER)
          return {
            ...state,
            auth: { ...state.auth, user: null, accessToken: '' },
          }
        }),
    },
  }
})
