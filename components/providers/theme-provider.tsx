"use client"

import { useEffect } from "react"
import { useThemeStore } from "@/store/theme-store"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((s) => s.theme)

  useEffect(() => {
    const root = document.documentElement

    if (theme === "light") {
      root.classList.remove("dark")
      return
    }

    if (theme === "dark") {
      root.classList.add("dark")
      return
    }

    // system
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const apply = (dark: boolean) => root.classList.toggle("dark", dark)
    apply(mq.matches)
    mq.addEventListener("change", (e) => apply(e.matches))
    return () => mq.removeEventListener("change", (e) => apply(e.matches))
  }, [theme])

  return <>{children}</>
}
