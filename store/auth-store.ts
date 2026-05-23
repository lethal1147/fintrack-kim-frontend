import { create } from "zustand"
import { authApi, profileApi, ApiError, type UserProfile } from "@/lib/api-client"

type AuthState = {
  user:                UserProfile | null
  accessToken:         string | null
  totpChallengeToken:  string | null
  isLoading:           boolean
  error:               string | null

  login(email: string, password: string): Promise<void>
  register(name: string, email: string, password: string): Promise<void>
  logout(): Promise<void>
  forceLogout(): void
  deleteAccount(password: string): Promise<void>
  refreshAccessToken(): Promise<boolean>
  loadUser(): Promise<void>
  updateProfile(name: string, email: string): Promise<void>
  uploadAvatar(file: File): Promise<void>
  verifyTOTP(code: string): Promise<void>
  clearError(): void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user:               null,
  accessToken:        null,
  totpChallengeToken: null,
  isLoading:          false,
  error:              null,

  async login(email, password) {
    set({ isLoading: true, error: null })
    try {
      const resp = await authApi.login(email, password)
      if ("totp_required" in resp) {
        set({ totpChallengeToken: resp.challenge_token, isLoading: false })
      } else {
        set({ accessToken: resp.access_token, user: resp.user, totpChallengeToken: null, isLoading: false })
      }
    } catch (err) {
      set({ isLoading: false, error: errorMessage(err) })
      throw err
    }
  },

  async register(name, email, password) {
    set({ isLoading: true, error: null })
    try {
      const resp = await authApi.register(name, email, password)
      set({ accessToken: resp.access_token, user: resp.user, isLoading: false })
    } catch (err) {
      set({ isLoading: false, error: errorMessage(err) })
      throw err
    }
  },

  async logout() {
    const { accessToken } = get()
    set({ isLoading: true })
    try {
      await authApi.logout()
      if (accessToken) {
        await authApi.logoutAll(accessToken).catch(() => {})
      }
    } catch {
      // best-effort — always clear local state
    } finally {
      set({ user: null, accessToken: null, isLoading: false, error: null })
    }
  },

  forceLogout() {
    set({ user: null, accessToken: null, totpChallengeToken: null, isLoading: false, error: null })
  },

  async refreshAccessToken() {
    set({ isLoading: true })
    try {
      const resp = await authApi.refresh()
      set({ accessToken: resp.access_token, isLoading: false })
      return true
    } catch {
      set({ user: null, accessToken: null, isLoading: false })
      return false
    }
  },

  async loadUser() {
    const { accessToken } = get()
    if (!accessToken) return
    try {
      const user = await authApi.me(accessToken)
      set({ user })
    } catch {
      // if /me fails, keep existing user state — access token may still be valid
    }
  },

  async updateProfile(name, email) {
    const { accessToken } = get()
    if (!accessToken) return
    set({ isLoading: true, error: null })
    try {
      const user = await profileApi.update({ name, email }, accessToken)
      set({ user, isLoading: false })
    } catch (err) {
      set({ isLoading: false, error: errorMessage(err) })
      throw err
    }
  },

  async uploadAvatar(file) {
    const { accessToken } = get()
    if (!accessToken) return
    set({ isLoading: true, error: null })
    try {
      const { avatar_url } = await profileApi.uploadAvatar(file, accessToken)
      set((s) => ({
        isLoading: false,
        user: s.user ? { ...s.user, avatar_url } : s.user,
      }))
    } catch (err) {
      set({ isLoading: false, error: errorMessage(err) })
      throw err
    }
  },

  async verifyTOTP(code) {
    const { totpChallengeToken } = get()
    if (!totpChallengeToken) return
    set({ isLoading: true, error: null })
    try {
      const resp = await authApi.totpVerify(totpChallengeToken, code)
      set({ accessToken: resp.access_token, user: resp.user, totpChallengeToken: null, isLoading: false })
    } catch (err) {
      set({ isLoading: false, error: errorMessage(err) })
      throw err
    }
  },

  async deleteAccount(password) {
    const { accessToken } = get()
    if (!accessToken) return
    set({ isLoading: true, error: null })
    try {
      await profileApi.deleteAccount(password, accessToken)
      set({ user: null, accessToken: null, totpChallengeToken: null, isLoading: false, error: null })
    } catch (err) {
      set({ isLoading: false, error: errorMessage(err) })
      throw err
    }
  },

  clearError() {
    set({ error: null })
  },
}))

function errorMessage(err: unknown): string {
  if (err instanceof ApiError) return err.message
  return "Something went wrong. Please try again."
}
