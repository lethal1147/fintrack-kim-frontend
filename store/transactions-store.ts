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

const DEFAULT_FILTER: FilterState = {
  type: "all",
  category: "",
  search: "",
  from: "",
  to: "",
  page: 1,
  limit: 8,
}

type TransactionsState = {
  transactions: Transaction[]
  total: number
  pages: number
  isLoading: boolean
  error: string | null
  filter: FilterState

  fetchTransactions(): Promise<void>
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

  setFilter(patch) {
    const next: FilterState = { ...get().filter, ...patch }
    // reset to page 1 on any filter change except explicit page changes
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
      await get().fetchTransactions()
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
      await get().fetchTransactions()
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
      await get().fetchTransactions()
    } catch (err) {
      set({ error: (err as Error).message ?? "Failed to delete transaction" })
      throw err
    }
  },
}))
