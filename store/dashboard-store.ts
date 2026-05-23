import { create } from "zustand"
import dayjs, { type Dayjs } from "dayjs"
import { transactionApi, type AnalyticsData } from "@/lib/api-client"
import { useAuthStore } from "@/store/auth-store"

type DashboardState = {
  monthly:       AnalyticsData | null
  prevMonth:     AnalyticsData | null
  trend:         AnalyticsData | null
  isLoading:     boolean
  error:         string | null
  selectedMonth: Dayjs

  setMonth(m: Dayjs): void
  fetchDashboard(): Promise<void>
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  monthly:       null,
  prevMonth:     null,
  trend:         null,
  isLoading:     false,
  error:         null,
  selectedMonth: dayjs().startOf("month"),

  setMonth(m: Dayjs) {
    set({ selectedMonth: m })
  },

  async fetchDashboard() {
    const token = useAuthStore.getState().accessToken
    if (!token) return

    const month = get().selectedMonth
    set({ isLoading: true, error: null })
    try {
      const monthFrom     = month.startOf("month").format("YYYY-MM-DD")
      const monthTo       = month.endOf("month").format("YYYY-MM-DD")
      const prevMonthFrom = month.subtract(1, "month").startOf("month").format("YYYY-MM-DD")
      const prevMonthTo   = month.subtract(1, "month").endOf("month").format("YYYY-MM-DD")
      const trendFrom     = month.subtract(5, "month").startOf("month").format("YYYY-MM-DD")
      const trendTo       = month.endOf("month").format("YYYY-MM-DD")

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
