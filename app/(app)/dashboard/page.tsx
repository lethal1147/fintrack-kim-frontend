"use client"

import { useEffect, useState } from "react"
import dayjs from "dayjs"
import {
  IconTrendingDown,
  IconTrendingUp,
  IconWallet,
  IconPigMoney,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { StatCard } from "@/components/app/dashboard/stat-card"
import { RecentTransactions } from "@/components/app/dashboard/recent-transactions"
import { CashFlowChart } from "@/components/app/dashboard/cash-flow-chart"
import { CategoryDonut } from "@/components/app/dashboard/category-donut"
import { BudgetPerformance } from "@/components/app/dashboard/budget-performance"
import { RecurringSummary } from "@/components/app/dashboard/recurring-summary"
import { CategoryGrowthChart } from "@/components/app/dashboard/category-growth-chart"
import { TopTransactions } from "@/components/app/dashboard/top-transactions"
import { useDashboardStore } from "@/store/dashboard-store"
import { useBudgetStore } from "@/store/budget-store"
import { useRecurringStore } from "@/store/recurring-store"
import { useTransactionsStore } from "@/store/transactions-store"
import { stringUtil } from "@/lib/string-util"

// ─── constants ────────────────────────────────────────────────────────────────

type Period = "month" | "year"

const MIN_MONTHS_BACK = 24

// ─── helpers ──────────────────────────────────────────────────────────────────

function pctChange(curr: number, prev: number): number {
  if (prev === 0) return 0
  return Math.round(((curr - prev) / Math.abs(prev)) * 1000) / 10
}

function savingsRate(income: number, expense: number): number {
  if (income <= 0) return 0
  return Math.round((1 - expense / income) * 100)
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const t = useTranslations("dashboard")
  const [period, setPeriod] = useState<Period>("month")

  const { monthly, prevMonth, trend, isLoading, selectedMonth, setMonth, fetchDashboard } = useDashboardStore()
  const { fetchCategories } = useBudgetStore()
  const { fetchItems } = useRecurringStore()
  const { fetchRecent } = useTransactionsStore()

  const today    = dayjs().startOf("month")
  const minMonth = today.subtract(MIN_MONTHS_BACK, "month")

  useEffect(() => {
    const y    = selectedMonth.year()
    const m    = selectedMonth.month() + 1
    const from = selectedMonth.startOf("month").format("YYYY-MM-DD")
    const to   = selectedMonth.endOf("month").format("YYYY-MM-DD")
    fetchDashboard()
    fetchCategories(y, m)
    fetchItems()
    fetchRecent(5, from, to)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth])

  if (isLoading && !trend) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="size-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  const byMonth = trend?.by_month ?? []
  const curr = byMonth[byMonth.length - 1] ?? { income: 0, expense: 0, net: 0 }
  const prev = byMonth[byMonth.length - 2] ?? { income: 0, expense: 0, net: 0 }

  const currSavings = savingsRate(curr.income, curr.expense)
  const prevSavings = savingsRate(prev.income, prev.expense)

  const yearIncome  = byMonth.reduce((s, m) => s + m.income, 0)
  const yearExpense = byMonth.reduce((s, m) => s + m.expense, 0)

  const monthKpi = {
    income:      monthly?.total_income ?? 0,
    expense:     monthly?.total_expense ?? 0,
    net:         monthly?.net ?? 0,
    savingsRate: Math.round(monthly?.savings_rate ?? currSavings),
  }
  const yearKpi = {
    income:      yearIncome,
    expense:     yearExpense,
    net:         yearIncome - yearExpense,
    savingsRate: savingsRate(yearIncome, yearExpense),
  }
  const kpi = period === "year" ? yearKpi : monthKpi

  const sparkIncome  = byMonth.map((m) => m.income)
  const sparkExpense = byMonth.map((m) => m.expense)
  const sparkNet     = byMonth.map((m) => m.net)
  const sparkSavings = byMonth.map((m) => savingsRate(m.income, m.expense))

  const deltaIncome  = pctChange(curr.income,  prev.income)
  const deltaExpense = pctChange(curr.expense, prev.expense)
  const deltaNet     = pctChange(curr.net,     prev.net)
  const deltaSavings = pctChange(currSavings,  prevSavings)

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {period === "month"
              ? selectedMonth.format("MMMM YYYY")
              : today.format("YYYY")}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
          {period === "month" && (
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => setMonth(selectedMonth.subtract(1, "month"))}
                disabled={!selectedMonth.isAfter(minMonth)}
              >
                <IconChevronLeft className="size-3.5" />
              </Button>
              <span className="text-sm font-semibold w-28 text-center">
                {selectedMonth.format("MMMM YYYY")}
              </span>
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => setMonth(selectedMonth.add(1, "month"))}
                disabled={selectedMonth.isSame(today)}
              >
                <IconChevronRight className="size-3.5" />
              </Button>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant={period === "month" ? "default" : "outline"}
              onClick={() => setPeriod("month")}
            >
              {t("periodMonth")}
            </Button>
            <Button
              size="sm"
              variant={period === "year" ? "default" : "outline"}
              onClick={() => setPeriod("year")}
            >
              {t("periodYear")}
            </Button>
          </div>
        </div>
      </div>

      {/* Row 1 — KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t("statTotalIncome")}
          value={stringUtil.formatMoney(kpi.income)}
          delta={deltaIncome}
          deltaLabel={t("vsLastMonth")}
          icon={IconTrendingUp}
          sparkData={sparkIncome}
          sparkColor="var(--chart-2)"
        />
        <StatCard
          title={t("statTotalExpenses")}
          value={stringUtil.formatMoney(kpi.expense)}
          delta={deltaExpense}
          deltaLabel={t("vsLastMonth")}
          icon={IconTrendingDown}
          sparkData={sparkExpense}
          sparkColor="var(--chart-5)"
        />
        <StatCard
          title={t("statNetCashFlow")}
          value={stringUtil.formatMoney(kpi.net)}
          delta={deltaNet}
          deltaLabel={t("vsLastMonth")}
          icon={IconWallet}
          sparkData={sparkNet}
          sparkColor="var(--chart-1)"
        />
        <StatCard
          title={t("statSavingsRate")}
          value={`${kpi.savingsRate}%`}
          delta={deltaSavings}
          deltaLabel={t("vsLastMonth")}
          icon={IconPigMoney}
          sparkData={sparkSavings}
          sparkColor="var(--chart-3)"
        />
      </div>

      {/* Row 2 — Cash Flow Chart */}
      <CashFlowChart data={trend?.by_month ?? []} year={selectedMonth.year()} />

      {/* Row 2b — Category Growth */}
      <CategoryGrowthChart
        current={monthly?.by_category ?? []}
        previous={prevMonth?.by_category ?? []}
      />

      {/* Row 3 — Category Donut + Budget Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-4">
        <CategoryDonut data={monthly?.by_category ?? []} />
        <BudgetPerformance />
      </div>

      {/* Row 4 — Recurring Summary + Top Transactions + Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <RecurringSummary />
        <TopTransactions />
        <RecentTransactions />
      </div>
    </div>
  )
}
