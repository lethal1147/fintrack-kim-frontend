"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/app/sidebar"
import { useAuthStore } from "@/store/auth-store"
import { usePreferencesStore } from "@/store/preferences-store"
import { recurringApi } from "@/lib/api-client"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isLoading, accessToken, refreshAccessToken, loadUser } = useAuthStore()
  const { initLocale } = usePreferencesStore()

  useEffect(() => {
    refreshAccessToken().then((ok) => {
      if (!ok) {
        router.replace("/login")
      } else {
        loadUser().then(() => {
          const user = useAuthStore.getState().user
          initLocale(user?.locale)
        })
        const token = useAuthStore.getState().accessToken
        if (token) recurringApi.process(token).catch(() => {})
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (isLoading || !accessToken) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="border-primary size-6 animate-spin rounded-full border-2 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="bg-background flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
