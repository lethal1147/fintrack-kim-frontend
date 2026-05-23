"use client"

import { useEffect } from "react"
import { IconChevronLeft, IconChevronRight, IconArrowDown, IconArrowUp } from "@tabler/icons-react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { SpendingDonut } from "@/components/app/reports/spending-donut"
import { TrendBarChart } from "@/components/app/reports/trend-bar-chart"
import { TopMerchantsCard } from "@/components/app/reports/top-merchants-card"
import { stringUtil } from "@/lib/string-util"
import { useReportsStore } from "@/store/reports-store"
import { cn } from "@/lib/utils"
import { useState } from "react"

// ─── constants ────────────────────────────────────────────────────────────────

const TABS = ["Spending", "Income"] as const
type Tab = (typeof TABS)[number]

const MIN_YEAR = new Date().getFullYear() - 4

// ─── page ─────────────────────────────────────────────────────────────────────

export default function ReportsPage() {
  const t = useTranslations("reports")
  const { analytics, isLoading, year, fetchAnalytics, setYear } = useReportsStore()
  const [tab, setTab] = useState<Tab>("Spending")

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  const totalIncome  = analytics?.total_income  ?? 0
  const totalExpense = analytics?.total_expense ?? 0
  const net          = analytics?.net           ?? 0
  const savingsRate  = analytics?.savings_rate  ?? 0
  const txCount      = analytics?.tx_count      ?? 0

  const expenseCategories = (analytics?.by_category ?? [])
    .filter((c) => c.type === "expense")
    .map((c) => ({ name: c.category, value: c.total }))

  const incomeCategories = (analytics?.by_category ?? [])
    .filter((c) => c.type === "income")
    .map((c) => ({ name: c.category, value: c.total }))

  const activeData = tab === "Spending" ? expenseCategories : incomeCategories

  const trendData = (analytics?.by_month ?? []).map((m) => ({
    month: m.month.slice(5), // "YYYY-MM" → "MM"
    income: m.income,
    expense: m.expense,
  }))

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">

      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{t("subtitle")}</p>
      </div>

      {/* ── Year selector ── */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => setYear(year - 1)}
          disabled={year <= MIN_YEAR}
        >
          <IconChevronLeft className="size-3.5" />
        </Button>
        <span className="text-sm font-semibold w-16 text-center">{year}</span>
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => setYear(year + 1)}
          disabled={year >= new Date().getFullYear()}
        >
          <IconChevronRight className="size-3.5" />
        </Button>
      </div>

      {/* ── Loading / empty ── */}
      {isLoading ? (
        <div className="py-20 text-center text-muted-foreground text-sm">{t("loading")}</div>
      ) : !analytics ? null : (
        <>
          {/* ── KPI strip ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border border-border bg-card px-4 py-3">
              <div className="flex items-center gap-1.5 mb-0.5">
                <IconArrowDown className="size-3.5 text-emerald-600 shrink-0" />
                <p className="text-xs text-muted-foreground">{t("statTotalIncome")}</p>
              </div>
              <p className="text-lg font-bold tabular-nums text-emerald-600">{stringUtil.formatMoney(totalIncome)}</p>
            </div>
            <div className="rounded-xl border border-border bg-card px-4 py-3">
              <div className="flex items-center gap-1.5 mb-0.5">
                <IconArrowUp className="size-3.5 text-destructive shrink-0" />
                <p className="text-xs text-muted-foreground">{t("statTotalSpent")}</p>
              </div>
              <p className="text-lg font-bold tabular-nums">{stringUtil.formatMoney(totalExpense)}</p>
            </div>
            <div className="rounded-xl border border-border bg-card px-4 py-3">
              <p className="text-xs text-muted-foreground mb-0.5">{t("statNetCashFlow")}</p>
              <p className={cn("text-lg font-bold tabular-nums", net >= 0 ? "text-emerald-600" : "text-destructive")}>
                {stringUtil.formatMoney(net)}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card px-4 py-3">
              <p className="text-xs text-muted-foreground mb-0.5">{t("statSavingsRate")}</p>
              <p className={cn("text-lg font-bold tabular-nums", savingsRate >= 0 ? "text-emerald-600" : "text-destructive")}>
                {savingsRate.toFixed(1)}%
              </p>
              <p className="text-xs text-muted-foreground">{t("statTransactions", { count: txCount })}</p>
            </div>
          </div>

          {/* ── 12-month trend ── */}
          <TrendBarChart data={trendData} />

          {/* ── Tabs ── */}
          <div className="flex rounded-lg border border-border overflow-hidden text-sm w-fit">
            {TABS.map((tabItem) => (
              <button
                key={tabItem}
                onClick={() => setTab(tabItem)}
                className={cn(
                  "px-4 py-1.5 transition-colors",
                  tab === tabItem ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-muted"
                )}
              >
                {tabItem === "Spending" ? t("tabSpending") : t("tabIncome")}
              </button>
            ))}
          </div>

          {/* ── Category donut ── */}
          {activeData.length > 0 ? (
            <SpendingDonut data={activeData} tab={tab} />
          ) : (
            <div className="rounded-xl border border-border bg-card px-5 py-10 text-center text-sm text-muted-foreground">
              {tab === "Spending" ? t("noExpenseData", { year }) : t("noIncomeData", { year })}
            </div>
          )}

          {/* ── Top merchants ── */}
          <TopMerchantsCard
            merchants={analytics.top_merchants ?? []}
            expenseTotal={totalExpense}
          />
        </>
      )}
    </div>
  )
}
