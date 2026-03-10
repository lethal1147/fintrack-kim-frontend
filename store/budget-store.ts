import { create } from "zustand"
import { budgetCategories, type BudgetCategory } from "@/lib/mock-data"

type BudgetState = {
  categories: BudgetCategory[]
  addCategory: (cat: BudgetCategory) => void
}

export const useBudgetStore = create<BudgetState>((set) => ({
  categories: budgetCategories,

  addCategory: (cat) =>
    set((s) => ({ categories: [...s.categories, cat] })),
}))
