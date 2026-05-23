import { create } from "zustand"
import { transactionApi, type Transaction, type CreateTransactionBody, type UpdateTransactionBody } from "@/lib/api-client"
import { useAuthStore } from "@/store/auth-store"

export type FilterState = {
  type: "all" | "income" | "expense"
  category: string
  search: string
  from: string
  to: string
  page: number
  limit: number
}

export type MonthlySummary = {
  totalIncome: number
  totalExpense: number
}

const DEFAULT_FILTER: FilterState = {
  type: "all",
  category: "",
  search: "",
  from: "",
  to: "",
  page: 1,
  limit: 8,
}

function currentMonthRange(): { from: string; to: string } {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, "0")
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  return { from: `${y}-${m}-01`, to: `${y}-${m}-${String(lastDay).padStart(2, "0")}` }
}

type TransactionsState = {
  transactions: Transaction[]
  total: number
  pages: number
  isLoading: boolean
  error: string | null
  filter: FilterState
  monthlySummary: MonthlySummary | null
  recentTransactions: Transaction[]

  fetchTransactions(): Promise<void>
  fetchMonthlySummary(): Promise<void>
  fetchRecent(limit?: number): Promise<void>
  setFilter(patch: Partial<FilterState>): void
  addTransaction(body: CreateTransactionBody): Promise<void>
  updateTransaction(id: string, body: UpdateTransactionBody): Promise<void>
  deleteTransaction(id: string): Promise<void>
}

export const useTransactionsStore = create<TransactionsState>((set, get) => ({
  transactions: [],
  total: 0,
  pages: 1,
  isLoading: false,
  error: null,
  filter: DEFAULT_FILTER,
  monthlySummary: null,
  recentTransactions: [],

  async fetchTransactions() {
    const token = useAuthStore.getState().accessToken
    if (!token) return
    set({ isLoading: true, error: null })
    try {
      const f = get().filter
      const result = await transactionApi.list(
        {
          type: f.type === "all" ? undefined : f.type,
          category: f.category || undefined,
          search: f.search || undefined,
          from: f.from || undefined,
          to: f.to || undefined,
          page: f.page,
          limit: f.limit,
        },
        token,
      )
      set({
        transactions: result.transactions ?? [],
        total: result.total,
        pages: result.pages,
        isLoading: false,
      })
    } catch (err) {
      set({ isLoading: false, error: (err as Error).message ?? "Failed to load transactions" })
    }
  },

  async fetchRecent(limit = 5) {
    const token = useAuthStore.getState().accessToken
    if (!token) return
    try {
      const result = await transactionApi.list({ limit }, token)
      set({ recentTransactions: result.transactions ?? [] })
    } catch {
      // non-critical
    }
  },

  async fetchMonthlySummary() {
    const token = useAuthStore.getState().accessToken
    if (!token) return
    try {
      const result = await transactionApi.summary(currentMonthRange(), token)
      set({ monthlySummary: { totalIncome: result.total_income, totalExpense: result.total_expense } })
    } catch {
      // non-critical — leave previous value in place
    }
  },

  setFilter(patch) {
    const next: FilterState = { ...get().filter, ...patch }
    if (!("page" in patch)) next.page = 1
    set({ filter: next })
    get().fetchTransactions()
  },

  async addTransaction(body) {
    const token = useAuthStore.getState().accessToken
    if (!token) throw new Error("Not authenticated")
    set({ isLoading: true, error: null })
    try {
      await transactionApi.create(body, token)
      await Promise.all([get().fetchTransactions(), get().fetchMonthlySummary()])
    } catch (err) {
      set({ isLoading: false, error: (err as Error).message ?? "Failed to create transaction" })
      throw err
    }
  },

  async updateTransaction(id, body) {
    const token = useAuthStore.getState().accessToken
    if (!token) throw new Error("Not authenticated")
    set({ isLoading: true, error: null })
    try {
      await transactionApi.update(id, body, token)
      await Promise.all([get().fetchTransactions(), get().fetchMonthlySummary()])
    } catch (err) {
      set({ isLoading: false, error: (err as Error).message ?? "Failed to update transaction" })
      throw err
    }
  },

  async deleteTransaction(id) {
    const token = useAuthStore.getState().accessToken
    if (!token) throw new Error("Not authenticated")
    try {
      await transactionApi.delete(id, token)
      await Promise.all([get().fetchTransactions(), get().fetchMonthlySummary()])
    } catch (err) {
      set({ error: (err as Error).message ?? "Failed to delete transaction" })
      throw err
    }
  },
}))
