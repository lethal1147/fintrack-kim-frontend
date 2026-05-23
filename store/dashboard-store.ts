import { create } from "zustand"
import dayjs from "dayjs"
import { transactionApi, type AnalyticsData } from "@/lib/api-client"
import { useAuthStore } from "@/store/auth-store"

type DashboardState = {
  monthly:   AnalyticsData | null
  prevMonth: AnalyticsData | null
  trend:     AnalyticsData | null
  isLoading: boolean
  error:     string | null

  fetchDashboard(): Promise<void>
}

export const useDashboardStore = create<DashboardState>((set) => ({
  monthly:   null,
  prevMonth: null,
  trend:     null,
  isLoading: false,
  error:     null,

  async fetchDashboard() {
    const token = useAuthStore.getState().accessToken
    if (!token) return

    set({ isLoading: true, error: null })
    try {
      const today        = dayjs()
      const monthFrom    = today.startOf("month").format("YYYY-MM-DD")
      const monthTo      = today.endOf("month").format("YYYY-MM-DD")
      const trendFrom    = today.subtract(5, "month").startOf("month").format("YYYY-MM-DD")
      const trendTo      = today.format("YYYY-MM-DD")
      const prevMonthFrom = today.subtract(1, "month").startOf("month").format("YYYY-MM-DD")
      const prevMonthTo   = today.subtract(1, "month").endOf("month").format("YYYY-MM-DD")

      const [monthly, trend, prevMonth] = await Promise.all([
        transactionApi.analytics({ from: monthFrom, to: monthTo }, token),
        transactionApi.analytics({ from: trendFrom, to: trendTo }, token),
        transactionApi.analytics({ from: prevMonthFrom, to: prevMonthTo }, token),
      ])

      set({ monthly, trend, prevMonth, isLoading: false })
    } catch (err) {
      console.error("fetchDashboard failed:", err)
      set({ isLoading: false, error: (err as Error).message ?? "Failed to load dashboard" })
    }
  },
}))
