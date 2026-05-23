"use client"

import { useState } from "react"
import {
  IconTrendingDown,
  IconTrendingUp,
  IconWallet,
  IconPigMoney,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { StatCard } from "@/components/app/dashboard/stat-card"
import { RecentTransactions } from "@/components/app/dashboard/recent-transactions"
import { CashFlowChart } from "@/components/app/dashboard/cash-flow-chart"
import { CategoryDonut } from "@/components/app/dashboard/category-donut"
import { BudgetPerformance } from "@/components/app/dashboard/budget-performance"
import { RecurringSummary } from "@/components/app/dashboard/recurring-summary"
import { stats, monthlyTrend } from "@/lib/mock-data"
import { stringUtil } from "@/lib/string-util"

// ─── constants ────────────────────────────────────────────────────────────────

type Period = "month" | "year"

const YEAR_INCOME  = monthlyTrend.reduce((s, m) => s + m.income,  0)
const YEAR_EXPENSE = monthlyTrend.reduce((s, m) => s + m.expense, 0)
const YEAR_SAVINGS_RATE = Math.round((1 - YEAR_EXPENSE / YEAR_INCOME) * 100)

// ─── helpers ──────────────────────────────────────────────────────────────────

function kpiData(period: Period) {
  if (period === "year") {
    const net = YEAR_INCOME - YEAR_EXPENSE
    return {
      income:      YEAR_INCOME,
      expense:     YEAR_EXPENSE,
      net,
      savingsRate: YEAR_SAVINGS_RATE,
    }
  }
  const net = stats.monthlyIncome - stats.monthlySpent
  return {
    income:      stats.monthlyIncome,
    expense:     stats.monthlySpent,
    net,
    savingsRate: stats.savingsRate,
  }
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [period, setPeriod] = useState<Period>("month")
  const kpi = kpiData(period)

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {period === "month" ? "March 2026 overview" : "2026 year-to-date overview"}
          </p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button
            size="sm"
            variant={period === "month" ? "default" : "outline"}
            onClick={() => setPeriod("month")}
          >
            This Month
          </Button>
          <Button
            size="sm"
            variant={period === "year" ? "default" : "outline"}
            onClick={() => setPeriod("year")}
          >
            This Year
          </Button>
        </div>
      </div>

      {/* Row 1 — KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Income"
          value={stringUtil.formatMoney(kpi.income)}
          delta={period === "month" ? stats.incomeDelta : undefined}
          deltaLabel="vs last month"
          icon={IconTrendingUp}
        />
        <StatCard
          title="Total Expenses"
          value={stringUtil.formatMoney(kpi.expense)}
          delta={period === "month" ? stats.spentDelta : undefined}
          deltaLabel="vs last month"
          icon={IconTrendingDown}
        />
        <StatCard
          title="Net Cash Flow"
          value={stringUtil.formatMoney(kpi.net)}
          icon={IconWallet}
        />
        <StatCard
          title="Savings Rate"
          value={`${kpi.savingsRate}%`}
          deltaLabel="of income saved"
          icon={IconPigMoney}
        />
      </div>

      {/* Row 2 — Cash Flow Chart */}
      <CashFlowChart />

      {/* Row 3 — Category Donut + Budget Performance (stubs) */}
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-4">
        <CategoryDonut />
        <BudgetPerformance />
      </div>

      {/* Row 4 — Recurring Summary + Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-4">
        <RecurringSummary />
        <RecentTransactions />
      </div>
    </div>
  )
}
