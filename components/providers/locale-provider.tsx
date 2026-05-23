"use client"

import { useEffect } from "react"
import { NextIntlClientProvider } from "next-intl"
import { usePreferencesStore } from "@/store/preferences-store"

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const { locale, messages, initLocale } = usePreferencesStore()

  useEffect(() => {
    // Auto-detect locale from navigator.language on first client render.
    // The (app)/layout overrides this with the backend value after login.
    initLocale()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone="UTC">
      {children}
    </NextIntlClientProvider>
  )
}
