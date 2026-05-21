"use client"

import { create } from "zustand"
import { securityApi, type SessionInfo, type TOTPSetupResult } from "@/lib/api-client"
import { useAuthStore } from "@/store/auth-store"

type SecurityState = {
  sessions:    SessionInfo[]
  isLoading:   boolean
  error:       string | null

  fetchSessions():                                       Promise<void>
  revokeSession(id: string):                             Promise<void>
  requestPasswordChange():                               Promise<void>
  changePassword(otp: string, newPassword: string):      Promise<void>
  setupTOTP():                                           Promise<TOTPSetupResult | null>
  confirmTOTP(code: string):                             Promise<string[]>
  disableTOTP(code: string):                             Promise<void>
}

export const useSecurityStore = create<SecurityState>((set) => ({
  sessions:  [],
  isLoading: false,
  error:     null,

  async fetchSessions() {
    const token = useAuthStore.getState().accessToken
    if (!token) return
    set({ isLoading: true, error: null })
    try {
      const sessions = await securityApi.listSessions(token)
      set({ sessions, isLoading: false })
    } catch (err) {
      set({ isLoading: false, error: (err as Error).message ?? "Failed to load sessions" })
    }
  },

  async revokeSession(id) {
    const token = useAuthStore.getState().accessToken
    if (!token) return
    await securityApi.revokeSession(id, token)
    set((s) => ({ sessions: s.sessions.filter((sess) => sess.id !== id) }))
  },

  async requestPasswordChange() {
    const token = useAuthStore.getState().accessToken
    if (!token) return
    set({ isLoading: true, error: null })
    try {
      await securityApi.requestPasswordChange(token)
      set({ isLoading: false })
    } catch (err) {
      set({ isLoading: false, error: (err as Error).message ?? "Failed to send code" })
      throw err
    }
  },

  async changePassword(otp, newPassword) {
    const token = useAuthStore.getState().accessToken
    if (!token) return
    set({ isLoading: true, error: null })
    try {
      await securityApi.changePassword(otp, newPassword, token)
      set({ isLoading: false })
      await useAuthStore.getState().logout()
    } catch (err) {
      set({ isLoading: false, error: (err as Error).message ?? "Failed to change password" })
      throw err
    }
  },

  async setupTOTP() {
    const token = useAuthStore.getState().accessToken
    if (!token) return null
    set({ isLoading: true, error: null })
    try {
      const result = await securityApi.setupTOTP(token)
      set({ isLoading: false })
      return result
    } catch (err) {
      set({ isLoading: false, error: (err as Error).message ?? "Failed to setup 2FA" })
      return null
    }
  },

  async confirmTOTP(code) {
    const token = useAuthStore.getState().accessToken
    if (!token) return []
    set({ isLoading: true, error: null })
    try {
      const { backup_codes } = await securityApi.confirmTOTP(code, token)
      set({ isLoading: false })
      useAuthStore.setState((s) => ({
        user: s.user ? { ...s.user, totp_enabled: true } : s.user,
      }))
      return backup_codes
    } catch (err) {
      set({ isLoading: false, error: (err as Error).message ?? "Failed to confirm 2FA" })
      throw err
    }
  },

  async disableTOTP(code) {
    const token = useAuthStore.getState().accessToken
    if (!token) return
    set({ isLoading: true, error: null })
    try {
      await securityApi.disableTOTP(code, token)
      set({ isLoading: false })
      useAuthStore.setState((s) => ({
        user: s.user ? { ...s.user, totp_enabled: false } : s.user,
      }))
    } catch (err) {
      set({ isLoading: false, error: (err as Error).message ?? "Failed to disable 2FA" })
      throw err
    }
  },
}))
