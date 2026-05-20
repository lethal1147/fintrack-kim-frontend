import { create } from "zustand"
import { recurringApi, type RecurringItem, type CreateRecurringBody } from "@/lib/api-client"
import { useAuthStore } from "@/store/auth-store"

type RecurringState = {
  items: RecurringItem[]
  isLoading: boolean
  error: string | null

  fetchItems(): Promise<void>
  addItem(body: CreateRecurringBody): Promise<void>
  editItem(id: string, body: CreateRecurringBody): Promise<void>
  toggleStatus(id: string): Promise<void>
  deleteItem(id: string): Promise<void>
}

export const useRecurringStore = create<RecurringState>((set) => ({
  items: [],
  isLoading: false,
  error: null,

  async fetchItems() {
    const token = useAuthStore.getState().accessToken
    if (!token) return
    set({ isLoading: true, error: null })
    try {
      const items = await recurringApi.list(token)
      set({ items, isLoading: false })
    } catch (err) {
      set({ isLoading: false, error: (err as Error).message ?? "Failed to load recurring items" })
    }
  },

  async addItem(body) {
    const token = useAuthStore.getState().accessToken
    if (!token) return
    const item = await recurringApi.create(body, token)
    set((s) => ({ items: [item, ...s.items] }))
  },

  async editItem(id, body) {
    const token = useAuthStore.getState().accessToken
    if (!token) return
    const updated = await recurringApi.update(id, body, token)
    set((s) => ({ items: s.items.map((i) => (i.id === id ? updated : i)) }))
  },

  async toggleStatus(id) {
    const token = useAuthStore.getState().accessToken
    if (!token) return
    const updated = await recurringApi.toggleStatus(id, token)
    set((s) => ({ items: s.items.map((i) => (i.id === id ? updated : i)) }))
  },

  async deleteItem(id) {
    const token = useAuthStore.getState().accessToken
    if (!token) return
    await recurringApi.delete(id, token)
    set((s) => ({ items: s.items.filter((i) => i.id !== id) }))
  },
}))
