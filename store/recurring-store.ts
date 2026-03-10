import { create } from "zustand"
import { recurringItems, type RecurringItem } from "@/lib/mock-data"

type RecurringState = {
  items: RecurringItem[]
  addItem: (item: RecurringItem) => void
  toggleStatus: (id: string) => void
  deleteItem: (id: string) => void
}

export const useRecurringStore = create<RecurringState>((set) => ({
  items: recurringItems,

  addItem: (item) =>
    set((s) => ({ items: [...s.items, item] })),

  toggleStatus: (id) =>
    set((s) => ({
      items: s.items.map((i) =>
        i.id === id
          ? { ...i, status: i.status === "active" ? "paused" : "active" }
          : i
      ),
    })),

  deleteItem: (id) =>
    set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
}))
