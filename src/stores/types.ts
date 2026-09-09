export interface AuthUser {
  accountNo: string
  email: string
  role: string[]
  exp: number
  username?: string
  fullName?: string | null
}

export interface AuthState {
  auth: {
    user: AuthUser | null
    setUser: (user: AuthUser | null) => void
    accessToken: string
    setAccessToken: (accessToken: string) => void
    resetAccessToken: () => void
    reset: () => void
  }
}
