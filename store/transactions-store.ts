import { create } from "zustand"
import { allTransactions, type Transaction } from "@/lib/mock-data"

type TransactionsState = {
  transactions: Transaction[]
  addTransaction: (tx: Transaction) => void
  deleteTransaction: (id: string) => void
}

export const useTransactionsStore = create<TransactionsState>((set) => ({
  transactions: allTransactions,

  addTransaction: (tx) =>
    set((s) => ({
      transactions: [tx, ...s.transactions].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    })),

  deleteTransaction: (id) =>
    set((s) => ({ transactions: s.transactions.filter((t) => t.id !== id) })),
}))
