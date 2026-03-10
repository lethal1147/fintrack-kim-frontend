// Mock data for dashboard — replace with real API data later

export const stats = {
  totalBalance: 24580,
  monthlyIncome: 4280,
  monthlySpent: 2105,
  savingsRate: 51, // percent
  balanceDelta: 3.2, // percent vs last month
  incomeDelta: 0,
  spentDelta: -8.4, // negative = spent less (good)
}

export type SpendingPoint = {
  day: string
  thisMonth: number
  lastMonth: number
}

export const spendingData: SpendingPoint[] = [
  { day: "Mar 1",  thisMonth: 120,  lastMonth: 200 },
  { day: "Mar 3",  thisMonth: 310,  lastMonth: 380 },
  { day: "Mar 5",  thisMonth: 430,  lastMonth: 520 },
  { day: "Mar 7",  thisMonth: 590,  lastMonth: 640 },
  { day: "Mar 9",  thisMonth: 720,  lastMonth: 800 },
  { day: "Mar 11", thisMonth: 850,  lastMonth: 910 },
  { day: "Mar 13", thisMonth: 970,  lastMonth: 1050 },
  { day: "Mar 15", thisMonth: 1100, lastMonth: 1180 },
  { day: "Mar 17", thisMonth: 1280, lastMonth: 1320 },
  { day: "Mar 19", thisMonth: 1450, lastMonth: 1490 },
  { day: "Mar 21", thisMonth: 1620, lastMonth: 1700 },
  { day: "Mar 23", thisMonth: 1780, lastMonth: 1870 },
  { day: "Mar 25", thisMonth: 1920, lastMonth: 2050 },
  { day: "Mar 27", thisMonth: 2040, lastMonth: 2180 },
  { day: "Mar 9",  thisMonth: 2105, lastMonth: 2300 },
]

export type BudgetGroup = "Fixed" | "Flexible" | "Non-Monthly"

export type BudgetCategory = {
  name: string
  budgeted: number
  spent: number
  color: string
  group: BudgetGroup
}

export const budgetCategories: BudgetCategory[] = [
  // Fixed
  { name: "Housing",       budgeted: 1200, spent: 1200, color: "var(--chart-1)", group: "Fixed" },
  { name: "Utilities",     budgeted: 150,  spent: 134,  color: "var(--chart-2)", group: "Fixed" },
  { name: "Internet",      budgeted: 60,   spent: 60,   color: "var(--chart-3)", group: "Fixed" },
  { name: "Subscriptions", budgeted: 50,   spent: 26,   color: "var(--chart-4)", group: "Fixed" },
  // Flexible
  { name: "Food & Dining", budgeted: 500,  spent: 420,  color: "var(--chart-2)", group: "Flexible" },
  { name: "Transport",     budgeted: 200,  spent: 185,  color: "var(--chart-3)", group: "Flexible" },
  { name: "Entertainment", budgeted: 150,  spent: 210,  color: "var(--chart-4)", group: "Flexible" }, // over budget
  { name: "Health",        budgeted: 100,  spent: 60,   color: "var(--chart-5)", group: "Flexible" },
  { name: "Shopping",      budgeted: 200,  spent: 155,  color: "var(--chart-1)", group: "Flexible" },
  // Non-Monthly
  { name: "Education",     budgeted: 100,  spent: 39,   color: "var(--chart-5)", group: "Non-Monthly" },
  { name: "Travel",        budgeted: 300,  spent: 0,    color: "var(--chart-2)", group: "Non-Monthly" },
  { name: "Gifts",         budgeted: 100,  spent: 0,    color: "var(--chart-3)", group: "Non-Monthly" },
]

export type Transaction = {
  id: string
  merchant: string
  category: string
  date: string
  amount: number
  type: "income" | "expense"
}

export const CATEGORIES = [
  "Income",
  "Housing",
  "Food & Dining",
  "Transport",
  "Entertainment",
  "Health",
  "Shopping",
  "Utilities",
  "Education",
  "Other",
] as const

export type Category = (typeof CATEGORIES)[number]

export const allTransactions: Transaction[] = [
  // March 25
  { id: "1",  merchant: "Salary Deposit",    category: "Income",        date: "2026-03-25", amount: 4280.00, type: "income"  },
  // March 22
  { id: "2",  merchant: "Netflix",           category: "Entertainment", date: "2026-03-22", amount: 15.99,  type: "expense" },
  { id: "3",  merchant: "Spotify",           category: "Entertainment", date: "2026-03-22", amount: 9.99,   type: "expense" },
  // March 21
  { id: "4",  merchant: "Whole Foods",       category: "Food & Dining", date: "2026-03-21", amount: 87.40,  type: "expense" },
  { id: "5",  merchant: "Starbucks",         category: "Food & Dining", date: "2026-03-21", amount: 6.50,   type: "expense" },
  // March 20
  { id: "6",  merchant: "Shell Gas",         category: "Transport",     date: "2026-03-20", amount: 62.00,  type: "expense" },
  { id: "7",  merchant: "Uber",              category: "Transport",     date: "2026-03-20", amount: 14.25,  type: "expense" },
  // March 18
  { id: "8",  merchant: "Gym Membership",    category: "Health",        date: "2026-03-18", amount: 45.00,  type: "expense" },
  // March 16
  { id: "9",  merchant: "Freelance Project", category: "Income",        date: "2026-03-16", amount: 850.00, type: "income"  },
  { id: "10", merchant: "Amazon",            category: "Shopping",      date: "2026-03-16", amount: 43.99,  type: "expense" },
  // March 15
  { id: "11", merchant: "Rent",              category: "Housing",       date: "2026-03-15", amount: 1200.00,type: "expense" },
  { id: "12", merchant: "Electric Bill",     category: "Utilities",     date: "2026-03-15", amount: 74.20,  type: "expense" },
  // March 14
  { id: "13", merchant: "McDonald's",        category: "Food & Dining", date: "2026-03-14", amount: 12.80,  type: "expense" },
  // March 12
  { id: "14", merchant: "Coursera",          category: "Education",     date: "2026-03-12", amount: 39.00,  type: "expense" },
  // March 10
  { id: "15", merchant: "Pharmacy",          category: "Health",        date: "2026-03-10", amount: 28.50,  type: "expense" },
  { id: "16", merchant: "Target",            category: "Shopping",      date: "2026-03-10", amount: 65.00,  type: "expense" },
  // March 8
  { id: "17", merchant: "Internet Bill",     category: "Utilities",     date: "2026-03-08", amount: 59.99,  type: "expense" },
  // March 6
  { id: "18", merchant: "Chipotle",          category: "Food & Dining", date: "2026-03-06", amount: 14.75,  type: "expense" },
  // March 4
  { id: "19", merchant: "Parking",           category: "Transport",     date: "2026-03-04", amount: 18.00,  type: "expense" },
  // March 2
  { id: "20", merchant: "Side Project Sale", category: "Income",        date: "2026-03-02", amount: 120.00, type: "income"  },
  { id: "21", merchant: "Zara",              category: "Shopping",      date: "2026-03-02", amount: 89.90,  type: "expense" },
]

// First 5 for the dashboard widget
export const recentTransactions: Transaction[] = allTransactions.slice(0, 5)

export type Goal = {
  name: string
  target: number
  current: number
  emoji: string
}

export const goals: Goal[] = [
  { name: "Emergency Fund", target: 10000, current: 6800,  emoji: "🛡️" },
  { name: "Vacation",       target: 3000,  current: 1240,  emoji: "✈️" },
  { name: "New Laptop",     target: 1500,  current: 900,   emoji: "💻" },
]
