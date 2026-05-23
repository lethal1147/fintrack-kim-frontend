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

// ─── Accounts ────────────────────────────────────────────────────────────────

export type AccountType = "checking" | "savings" | "credit_card" | "loan" | "investment"

export type Account = {
  id: string
  name: string
  institution: string
  type: AccountType
  /** Positive = asset balance. Negative = amount owed (liability). */
  balance: number
  lastFour?: string
}

export const accounts: Account[] = [
  // Cash
  { id: "ac1", name: "Chase Checking",     institution: "Chase",           type: "checking",    balance: 8420.50,  lastFour: "4821" },
  { id: "ac2", name: "Chase Savings",      institution: "Chase",           type: "savings",     balance: 12340.00, lastFour: "9034" },
  // Credit Cards
  { id: "ac3", name: "Sapphire Reserve",   institution: "Chase",           type: "credit_card", balance: -1240.75, lastFour: "5731" },
  { id: "ac4", name: "Freedom Unlimited",  institution: "Chase",           type: "credit_card", balance: -320.50,  lastFour: "2219" },
  // Loans
  { id: "ac5", name: "Auto Loan",          institution: "Toyota Financial", type: "loan",        balance: -9800.00 },
  // Investments
  { id: "ac6", name: "Roth IRA",           institution: "Fidelity",        type: "investment",  balance: 24580.00 },
  { id: "ac7", name: "401(k)",             institution: "Vanguard",        type: "investment",  balance: 38400.00 },
]

// ─── Monthly trend (for Reports) ─────────────────────────────────────────────

export type MonthlyTrend = {
  month: string
  income: number
  expense: number
}

export const monthlyTrend: MonthlyTrend[] = [
  { month: "Oct", income: 4280, expense: 2410 },
  { month: "Nov", income: 4280, expense: 2780 },
  { month: "Dec", income: 5100, expense: 3240 },
  { month: "Jan", income: 4280, expense: 1950 },
  { month: "Feb", income: 4280, expense: 2310 },
  { month: "Mar", income: 5250, expense: 1887 },
]

export type Goal = {
  id: string
  name: string
  emoji: string
  target: number
  current: number
  /** ISO date string e.g. "2026-09-01" */
  targetDate: string
  /** Monthly amount being set aside */
  monthlyContribution: number
  color: string
}

export const goals: Goal[] = [
  {
    id: "g1", name: "Emergency Fund", emoji: "🛡️",
    target: 10000, current: 6800, targetDate: "2026-09-01",
    monthlyContribution: 400, color: "#0ea5e9",
  },
  {
    id: "g2", name: "Vacation to Japan", emoji: "✈️",
    target: 3000, current: 1240, targetDate: "2026-08-01",
    monthlyContribution: 250, color: "#8b5cf6",
  },
  {
    id: "g3", name: "New Laptop", emoji: "💻",
    target: 1500, current: 900, targetDate: "2026-05-01",
    monthlyContribution: 150, color: "#f97316",
  },
  {
    id: "g4", name: "House Down Payment", emoji: "🏠",
    target: 50000, current: 12400, targetDate: "2029-01-01",
    monthlyContribution: 800, color: "#10b981",
  },
]

// ─── Recurring ────────────────────────────────────────────────────────────────

export type RecurringFrequency = "weekly" | "monthly" | "annual"
export type RecurringStatus    = "active" | "paused"
export type RecurringKind      = "expense" | "income"

export type RecurringItem = {
  id: string
  name: string
  category: string
  amount: number
  frequency: RecurringFrequency
  nextDue: string        // ISO date "YYYY-MM-DD"
  kind: RecurringKind
  status: RecurringStatus
  color: string
}

export const recurringItems: RecurringItem[] = [
  // Expenses – monthly
  { id: "r1",  name: "Rent",           category: "Housing",       amount: 1200,   frequency: "monthly", nextDue: "2026-04-01", kind: "expense", status: "active", color: "#0ea5e9" },
  { id: "r2",  name: "Netflix",        category: "Entertainment", amount: 15.99,  frequency: "monthly", nextDue: "2026-03-18", kind: "expense", status: "active", color: "#ef4444" },
  { id: "r3",  name: "Spotify",        category: "Entertainment", amount: 9.99,   frequency: "monthly", nextDue: "2026-03-22", kind: "expense", status: "active", color: "#22c55e" },
  { id: "r4",  name: "Gym Membership", category: "Health",        amount: 40,     frequency: "monthly", nextDue: "2026-03-15", kind: "expense", status: "active", color: "#f97316" },
  { id: "r5",  name: "Internet Bill",  category: "Utilities",     amount: 59.99,  frequency: "monthly", nextDue: "2026-04-08", kind: "expense", status: "active", color: "#64748b" },
  { id: "r6",  name: "Phone Plan",     category: "Utilities",     amount: 45,     frequency: "monthly", nextDue: "2026-03-25", kind: "expense", status: "active", color: "#8b5cf6" },
  { id: "r7",  name: "iCloud+",        category: "Subscriptions", amount: 2.99,   frequency: "monthly", nextDue: "2026-03-30", kind: "expense", status: "paused", color: "#94a3b8" },
  // Expenses – annual
  { id: "r8",  name: "Amazon Prime",   category: "Subscriptions", amount: 139,    frequency: "annual",  nextDue: "2026-11-14", kind: "expense", status: "active", color: "#f59e0b" },
  { id: "r9",  name: "Adobe CC",       category: "Subscriptions", amount: 599.88, frequency: "annual",  nextDue: "2026-08-01", kind: "expense", status: "paused", color: "#ec4899" },
  // Income – monthly
  { id: "r10", name: "Salary",         category: "Income",        amount: 4500,   frequency: "monthly", nextDue: "2026-03-31", kind: "income",  status: "active", color: "#10b981" },
  { id: "r11", name: "Freelance",      category: "Income",        amount: 750,    frequency: "monthly", nextDue: "2026-04-05", kind: "income",  status: "active", color: "#14b8a6" },
]

// ─── Category expense stats (for dashboard donut) ─────────────────────────────

export type CategoryStat = {
  category: string
  total:    number
  pct:      number
  color:    string
}

export const categoryStats: CategoryStat[] = [
  { category: "Housing",       total: 1200.00, pct: 57.0, color: "var(--chart-1)" },
  { category: "Food & Dining", total: 421.45,  pct: 20.0, color: "var(--chart-2)" },
  { category: "Shopping",      total: 198.89,  pct: 9.4,  color: "var(--chart-3)" },
  { category: "Utilities",     total: 134.19,  pct: 6.4,  color: "var(--chart-4)" },
  { category: "Health",        total: 73.50,   pct: 3.5,  color: "var(--chart-5)" },
  { category: "Transport",     total: 94.25,   pct: 4.5,  color: "var(--chart-1)" },
  { category: "Education",     total: 39.00,   pct: 1.8,  color: "var(--chart-2)" },
  { category: "Entertainment", total: 25.98,   pct: 1.2,  color: "var(--chart-3)" },
]
