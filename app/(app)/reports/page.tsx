"use client"

import { useState, useMemo } from "react"
import { IconChevronLeft, IconChevronRight, IconDownload } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { allTransactions, monthlyTrend } from "@/lib/mock-data"
import { SpendingDonut } from "@/components/app/reports/spending-donut"
import { TrendBarChart } from "@/components/app/reports/trend-bar-chart"
import { stringUtil } from "@/lib/string-util"
import { dateUtil } from "@/lib/date-util"
import { cn } from "@/lib/utils"

// ─── constants ────────────────────────────────────────────────────────────────

const TABS = ["Spending", "Income"] as const
type Tab = (typeof TABS)[number]

const CURRENT_YEAR = 2026

// ─── page ─────────────────────────────────────────────────────────────────────

export default function ReportsPage() {
  // UI-only state
  const [monthIdx, setMonthIdx] = useState(2) // March
  const [tab, setTab] = useState<Tab>("Spending")

  // Compute spending by category from mock transactions (expense only)
  const spendingByCategory = useMemo(() => {
    const map: Record<string, number> = {}
    allTransactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        map[t.category] = (map[t.category] ?? 0) + t.amount
      })
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [])

  // Income by source
  const incomeBySource = useMemo(() => {
    const map: Record<string, number> = {}
    allTransactions
      .filter((t) => t.type === "income")
      .forEach((t) => {
        map[t.merchant] = (map[t.merchant] ?? 0) + t.amount
      })
    return Object.entries(map)
      .map(([name, value]) => ({ name, value, color: "#10b981" }))
      .sort((a, b) => b.value - a.value)
  }, [])

  const activeData   = tab === "Spending" ? spendingByCategory : incomeBySource
  const expenseTotal = spendingByCategory.reduce((s, d) => s + d.value, 0)
  const incomeTotal  = incomeBySource.reduce((s, d) => s + d.value, 0)

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Analyse your spending and income patterns</p>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5 text-muted-foreground">
          <IconDownload className="size-3.5" />
          Export CSV
        </Button>
      </div>

      {/* ── Month selector ── */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon-sm"
          onClick={() => setMonthIdx((i) => Math.max(0, i - 1))} disabled={monthIdx === 0}>
          <IconChevronLeft className="size-3.5" />
        </Button>
        <span className="text-sm font-semibold w-36 text-center">
          {dateUtil.formatMonth(monthIdx, CURRENT_YEAR)}
        </span>
        <Button variant="outline" size="icon-sm"
          onClick={() => setMonthIdx((i) => Math.min(11, i + 1))} disabled={monthIdx === 11}>
          <IconChevronRight className="size-3.5" />
        </Button>
      </div>

      {/* ── Summary stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Spent",    value: stringUtil.formatMoney(expenseTotal),               color: "text-foreground" },
          { label: "Total Income",   value: stringUtil.formatMoney(incomeTotal),                color: "text-emerald-600" },
          { label: "Net Cash Flow",  value: stringUtil.formatMoney(incomeTotal - expenseTotal), color: incomeTotal >= expenseTotal ? "text-emerald-600" : "text-destructive" },
          { label: "Transactions",   value: `${allTransactions.length}`,                        color: "text-foreground" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card px-4 py-3">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className={cn("text-lg font-bold tabular-nums mt-0.5", s.color)}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div className="flex rounded-lg border border-border overflow-hidden text-sm w-fit">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "px-4 py-1.5 transition-colors",
              tab === t ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-muted"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ── Donut chart + Legend ── */}
      <SpendingDonut data={activeData} tab={tab} />

      {/* ── Monthly trend bar chart ── */}
      <TrendBarChart data={monthlyTrend} />

    </div>
  )
}
