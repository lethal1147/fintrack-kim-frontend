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

export type BudgetCategory = {
  name: string
  budgeted: number
  spent: number
  color: string
}

export const budgetCategories: BudgetCategory[] = [
  { name: "Housing",       budgeted: 1200, spent: 1200, color: "var(--chart-1)" },
  { name: "Food & Dining", budgeted: 500,  spent: 420,  color: "var(--chart-2)" },
  { name: "Transport",     budgeted: 200,  spent: 185,  color: "var(--chart-3)" },
  { name: "Entertainment", budgeted: 150,  spent: 210,  color: "var(--chart-4)" }, // over budget
  { name: "Health",        budgeted: 100,  spent: 60,   color: "var(--chart-5)" },
]

export type Transaction = {
  id: string
  merchant: string
  category: string
  date: string
  amount: number
  type: "income" | "expense"
}

export const recentTransactions: Transaction[] = [
  { id: "1", merchant: "Salary",         category: "Income",      date: "Mar 25", amount: 4280,  type: "income"  },
  { id: "2", merchant: "Netflix",         category: "Entertainment", date: "Mar 22", amount: 15.99, type: "expense" },
  { id: "3", merchant: "Whole Foods",     category: "Food",        date: "Mar 21", amount: 87.40, type: "expense" },
  { id: "4", merchant: "Shell Gas",       category: "Transport",   date: "Mar 20", amount: 62.00, type: "expense" },
  { id: "5", merchant: "Gym Membership",  category: "Health",      date: "Mar 18", amount: 45.00, type: "expense" },
]

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
