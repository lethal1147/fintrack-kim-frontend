"use client"

import { useState, useMemo } from "react"
import { IconChevronLeft, IconChevronRight, IconDownload } from "@tabler/icons-react"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Button } from "@/components/ui/button"
import { allTransactions, monthlyTrend } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

// ─── helpers ─────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n)
}
function fmtFull(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n)
}

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
]

const CATEGORY_COLORS: Record<string, string> = {
  "Housing":       "#0ea5e9",
  "Food & Dining": "#f97316",
  "Transport":     "#3b82f6",
  "Entertainment": "#8b5cf6",
  "Health":        "#ec4899",
  "Shopping":      "#f59e0b",
  "Utilities":     "#64748b",
  "Education":     "#14b8a6",
  "Other":         "#9ca3af",
}

const TABS = ["Spending", "Income"] as const
type Tab = (typeof TABS)[number]

// ─── custom tooltip for donut ─────────────────────────────────────────────────

function DonutTooltip({ active, payload }: { active?: boolean; payload?: { name: string; value: number }[] }) {
  if (!active || !payload?.length) return null
  const { name, value } = payload[0]
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 text-sm shadow-md">
      <p className="font-medium">{name}</p>
      <p className="text-muted-foreground">{fmtFull(value)}</p>
    </div>
  )
}

// ─── custom tooltip for bar ───────────────────────────────────────────────────

function BarTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; fill: string }[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 text-sm shadow-md space-y-1">
      <p className="font-medium text-xs text-muted-foreground">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="size-2 rounded-full shrink-0" style={{ background: p.fill }} />
          <span className="capitalize text-muted-foreground">{p.name}:</span>
          <span className="font-semibold">{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function ReportsPage() {
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
  const totalAmount  = activeData.reduce((s, d) => s + d.value, 0)
  const largestItem  = activeData[0]

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
        <span className="text-sm font-semibold w-36 text-center">{MONTHS[monthIdx]} 2026</span>
        <Button variant="outline" size="icon-sm"
          onClick={() => setMonthIdx((i) => Math.min(11, i + 1))} disabled={monthIdx === 11}>
          <IconChevronRight className="size-3.5" />
        </Button>
      </div>

      {/* ── Summary stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Spent",    value: fmt(expenseTotal),             color: "text-foreground" },
          { label: "Total Income",   value: fmt(incomeTotal),              color: "text-emerald-600" },
          { label: "Net Cash Flow",  value: fmt(incomeTotal - expenseTotal), color: incomeTotal >= expenseTotal ? "text-emerald-600" : "text-destructive" },
          { label: "Transactions",   value: `${allTransactions.length}`,   color: "text-foreground" },
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
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-start gap-6 flex-wrap">

          {/* Donut */}
          <div className="relative shrink-0 mx-auto">
            <PieChart width={240} height={240}>
              <Pie
                data={activeData}
                cx={115}
                cy={115}
                innerRadius={72}
                outerRadius={108}
                paddingAngle={2}
                dataKey="value"
                strokeWidth={0}
              >
                {activeData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={tab === "Spending"
                      ? (CATEGORY_COLORS[entry.name] ?? "#9ca3af")
                      : "#10b981"}
                  />
                ))}
              </Pie>
              <Tooltip content={<DonutTooltip />} />
            </PieChart>

            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-xs text-muted-foreground">{tab === "Spending" ? "Total spent" : "Total income"}</p>
              <p className="text-lg font-bold tabular-nums">{fmt(totalAmount)}</p>
            </div>
          </div>

          {/* Legend */}
          <div className="flex-1 min-w-48 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              {tab === "Spending" ? "By Category" : "By Source"}
            </p>
            {activeData.map((item) => {
              const pct = totalAmount === 0 ? 0 : Math.round((item.value / totalAmount) * 100)
              const color = tab === "Spending"
                ? (CATEGORY_COLORS[item.name] ?? "#9ca3af")
                : "#10b981"
              return (
                <div key={item.name} className="flex items-center gap-2.5">
                  <span className="size-2.5 rounded-full shrink-0" style={{ background: color }} />
                  <span className="text-sm flex-1 truncate">{item.name}</span>
                  <span className="text-xs text-muted-foreground tabular-nums w-8 text-right">{pct}%</span>
                  <span className="text-sm font-semibold tabular-nums w-20 text-right">{fmt(item.value)}</span>
                </div>
              )
            })}
            {largestItem && (
              <div className="pt-3 mt-3 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Largest: <span className="font-medium text-foreground">{largestItem.name}</span>
                  {" "}— {fmtFull(largestItem.value)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Monthly trend bar chart ── */}
      <div className="rounded-xl border border-border bg-card p-5">
        <p className="text-sm font-semibold mb-4">6-Month Trend</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={monthlyTrend} margin={{ top: 0, right: 0, bottom: 0, left: 0 }} barGap={4}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              width={36}
            />
            <Tooltip content={<BarTooltip />} cursor={{ fill: "var(--muted)", opacity: 0.5 }} />
            <Bar dataKey="income"  name="Income"  fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={32} />
            <Bar dataKey="expense" name="Expense" fill="var(--chart-1)" radius={[4, 4, 0, 0]} maxBarSize={32} />
          </BarChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-3 justify-center">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="size-2.5 rounded-full bg-emerald-500" />
            Income
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="size-2.5 rounded-full" style={{ background: "var(--chart-1)" }} />
            Expense
          </div>
        </div>
      </div>

    </div>
  )
}
