import {
  IconCurrencyDollar,
  IconTrendingDown,
  IconTrendingUp,
  IconPigMoney,
} from "@tabler/icons-react"
import { StatCard } from "@/components/app/dashboard/stat-card"
import { SpendingChart } from "@/components/app/dashboard/spending-chart"
import { BudgetOverview } from "@/components/app/dashboard/budget-overview"
import { RecentTransactions } from "@/components/app/dashboard/recent-transactions"
import { GoalsOverview } from "@/components/app/dashboard/goals-overview"
import { stats } from "@/lib/mock-data"

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n)
}

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Welcome back, Kim — here&apos;s your overview for March 2026.</p>
      </div>

      {/* Row 1 — Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Balance"
          value={formatCurrency(stats.totalBalance)}
          delta={stats.balanceDelta}
          deltaLabel="vs last month"
          icon={IconCurrencyDollar}
        />
        <StatCard
          title="Monthly Income"
          value={formatCurrency(stats.monthlyIncome)}
          icon={IconTrendingUp}
        />
        <StatCard
          title="Monthly Spent"
          value={formatCurrency(stats.monthlySpent)}
          delta={stats.spentDelta}
          deltaLabel="vs last month"
          icon={IconTrendingDown}
        />
        <StatCard
          title="Savings Rate"
          value={`${stats.savingsRate}%`}
          deltaLabel="of income saved"
          icon={IconPigMoney}
        />
      </div>

      {/* Row 2 — Chart + Budget */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
        <SpendingChart />
        <BudgetOverview />
      </div>

      {/* Row 3 — Transactions + Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
        <RecentTransactions />
        <GoalsOverview />
      </div>
    </div>
  )
}
