"use client"

import { create } from "zustand"
import { DEFAULT_LOCALE, detectLocale, SUPPORTED_LOCALES, type Locale } from "@/lib/i18n-config"
import enMessages from "@/messages/en.json"
import thMessages from "@/messages/th.json"

type Messages = typeof enMessages

const MESSAGES: Record<Locale, Messages> = {
  en: enMessages,
  th: thMessages,
}

interface PreferencesState {
  locale:   Locale
  messages: Messages
  isLoading: boolean
  setLocale:   (locale: Locale) => Promise<void>
  initLocale:  (backendLocale?: string | null) => void
}

export const usePreferencesStore = create<PreferencesState>((set, get) => ({
  locale:    DEFAULT_LOCALE,
  messages:  MESSAGES[DEFAULT_LOCALE],
  isLoading: false,

  initLocale(backendLocale) {
    const resolved = (backendLocale && (SUPPORTED_LOCALES as readonly string[]).includes(backendLocale))
      ? (backendLocale as Locale)
      : detectLocale()

    if (resolved !== get().locale) {
      set({ locale: resolved, messages: MESSAGES[resolved] })
    }
  },

  async setLocale(locale) {
    if (!SUPPORTED_LOCALES.includes(locale)) return
    set({ locale, messages: MESSAGES[locale], isLoading: true })
    try {
      const { profileApi } = await import("@/lib/api-client")
      const { useAuthStore } = await import("@/store/auth-store")
      const token = useAuthStore.getState().accessToken
      if (token) {
        const user = useAuthStore.getState().user
        if (user) {
          await profileApi.update({ name: user.name, email: user.email, locale }, token)
        }
      }
    } catch {
      // locale already switched in store; backend sync is best-effort
    } finally {
      set({ isLoading: false })
    }
  },
}))
