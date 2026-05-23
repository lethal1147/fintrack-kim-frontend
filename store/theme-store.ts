"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export const THEME_OPTIONS = ["light", "dark", "system"] as const
export type Theme = (typeof THEME_OPTIONS)[number]
export const DEFAULT_THEME: Theme = "system"

interface ThemeState {
  theme: Theme
  setTheme: (t: Theme) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: DEFAULT_THEME,
      setTheme: (theme) => set({ theme }),
    }),
    { name: "theme" }
  )
)
