import { create } from "zustand"
import { accounts, type Account } from "@/lib/mock-data"

type AccountsState = {
  accounts: Account[]
  addAccount: (account: Account) => void
}

export const useAccountsStore = create<AccountsState>((set) => ({
  accounts,

  addAccount: (account) => set((s) => ({ accounts: [...s.accounts, account] })),
}))
