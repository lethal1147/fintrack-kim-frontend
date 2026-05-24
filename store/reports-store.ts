import { create } from "zustand"
import { transactionApi, type AnalyticsData } from "@/lib/api-client"
import { useAuthStore } from "@/store/auth-store"

const CURRENT_YEAR = new Date().getFullYear()

type ReportsState = {
  analytics: AnalyticsData | null
  isLoading: boolean
  error: string | null
  year: number

  fetchAnalytics(year?: number): Promise<void>
  setYear(year: number): void
}

export const useReportsStore = create<ReportsState>((set, get) => ({
  analytics: null,
  isLoading: false,
  error: null,
  year: CURRENT_YEAR,

  async fetchAnalytics(year?: number) {
    const token = useAuthStore.getState().accessToken
    if (!token) return

    const y = year ?? get().year
    const now = new Date()
    const from = `${y}-01-01`
    const to = y === now.getFullYear() ? now.toISOString().slice(0, 10) : `${y}-12-31`

    set({ isLoading: true, error: null })
    try {
      const data = await transactionApi.analytics({ from, to }, token)
      set({ analytics: data, isLoading: false })
    } catch (err) {
      set({ isLoading: false, error: (err as Error).message ?? "Failed to load analytics" })
    }
  },

  setYear(year: number) {
    set({ year })
    get().fetchAnalytics(year)
  },
}))
