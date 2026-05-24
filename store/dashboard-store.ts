import { create } from "zustand"
import dayjs, { type Dayjs } from "dayjs"
import { transactionApi, type AnalyticsData, type Transaction } from "@/lib/api-client"
import { useAuthStore } from "@/store/auth-store"

const TOP_TX_LIMIT = 100
const TOP_TX_COUNT = 5

type DashboardState = {
  monthly:         AnalyticsData | null
  prevMonth:       AnalyticsData | null
  trend:           AnalyticsData | null
  topTransactions: Transaction[]
  isLoading:       boolean
  error:           string | null
  selectedMonth:   Dayjs

  setMonth(m: Dayjs): void
  fetchDashboard(): Promise<void>
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  monthly:         null,
  prevMonth:       null,
  trend:           null,
  topTransactions: [],
  isLoading:       false,
  error:           null,
  selectedMonth:   dayjs().startOf("month"),

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
      // Full year trend so the chart always has a 12-month spine
      const trendFrom     = month.startOf("year").format("YYYY-MM-DD")
      const trendTo       = month.endOf("month").format("YYYY-MM-DD")

      const [monthly, trend, prevMonth, txResult] = await Promise.all([
        transactionApi.analytics({ from: monthFrom, to: monthTo }, token),
        transactionApi.analytics({ from: trendFrom, to: trendTo }, token),
        transactionApi.analytics({ from: prevMonthFrom, to: prevMonthTo }, token),
        transactionApi.list({ from: monthFrom, to: monthTo, limit: TOP_TX_LIMIT }, token),
      ])

      const topTransactions = (txResult.transactions ?? [])
        .sort((a, b) => b.amount - a.amount)
        .slice(0, TOP_TX_COUNT)

      set({ monthly, trend, prevMonth, topTransactions, isLoading: false })
    } catch (err) {
      console.error("fetchDashboard failed:", err)
      set({ isLoading: false, error: (err as Error).message ?? "Failed to load dashboard" })
    }
  },
}))
