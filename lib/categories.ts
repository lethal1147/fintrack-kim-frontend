export const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Business",
  "Gift Received",
  "Investment Returns",
  "Rental Income",
  "Other Income",
] as const

export const EXPENSE_CATEGORIES = [
  "Housing",
  "Food & Dining",
  "Transport",
  "Entertainment",
  "Health",
  "Shopping",
  "Utilities",
  "Education",
  "Investment",
  "Travel",
  "Gifts & Donations",
  "Subscriptions",
  "Other",
] as const

export const ALL_CATEGORIES = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES] as const

export type IncomeCategory = (typeof INCOME_CATEGORIES)[number]
export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number]
export type TransactionCategory = IncomeCategory | ExpenseCategory
