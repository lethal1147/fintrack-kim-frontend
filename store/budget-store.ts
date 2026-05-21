import { create } from "zustand"
import { budgetApi, type BudgetCategory, type CreateBudgetBody, type UpdateBudgetBody } from "@/lib/api-client"
import { useAuthStore } from "@/store/auth-store"

type BudgetState = {
  categories: BudgetCategory[]
  isLoading: boolean
  error: string | null

  fetchCategories(year: number, month: number): Promise<void>
  addCategory(body: CreateBudgetBody): Promise<void>
  editCategory(id: string, body: UpdateBudgetBody): Promise<void>
  deleteCategory(id: string): Promise<void>
}

export const useBudgetStore = create<BudgetState>((set) => ({
  categories: [],
  isLoading: false,
  error: null,

  async fetchCategories(year, month) {
    const token = useAuthStore.getState().accessToken
    if (!token) return
    set({ isLoading: true, error: null })
    try {
      const categories = await budgetApi.list(year, month, token)
      set({ categories, isLoading: false })
    } catch (err) {
      set({ isLoading: false, error: (err as Error).message ?? "Failed to load budget" })
    }
  },

  async addCategory(body) {
    const token = useAuthStore.getState().accessToken
    if (!token) return
    const cat = await budgetApi.create(body, token)
    set((s) => ({ categories: [...s.categories, cat] }))
  },

  async editCategory(id, body) {
    const token = useAuthStore.getState().accessToken
    if (!token) return
    const updated = await budgetApi.update(id, body, token)
    set((s) => ({ categories: s.categories.map((c) => (c.id === id ? updated : c)) }))
  },

  async deleteCategory(id) {
    const token = useAuthStore.getState().accessToken
    if (!token) return
    await budgetApi.delete(id, token)
    set((s) => ({ categories: s.categories.filter((c) => c.id !== id) }))
  },
}))
