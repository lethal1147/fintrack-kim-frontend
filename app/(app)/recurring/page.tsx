"use client"

import { useState, useMemo } from "react"
import { IconPlus, IconSearch } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AddRecurringDialog } from "@/components/app/recurring/add-recurring-dialog"
import { RecurringRow } from "@/components/app/recurring/recurring-row"
import { useRecurringStore } from "@/store/recurring-store"
import { stringUtil } from "@/lib/string-util"
import { dateUtil } from "@/lib/date-util"
import { cn } from "@/lib/utils"

// ─── constants ────────────────────────────────────────────────────────────────

const KIND_TABS = ["all", "expense", "income"] as const
type KindTab = (typeof KIND_TABS)[number]

// ─── helpers ─────────────────────────────────────────────────────────────────

function monthlyEquivalent(amount: number, frequency: string) {
  if (frequency === "monthly") return amount
  if (frequency === "weekly")  return amount * 4.33
  if (frequency === "annual")  return amount / 12
  return amount
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function RecurringPage() {
  const { items, addItem, toggleStatus, deleteItem } = useRecurringStore()

  // UI-only state
  const [addOpen, setAddOpen] = useState(false)
  const [search, setSearch]   = useState("")
  const [kindTab, setKindTab] = useState<KindTab>("all")

  // Filtered + sorted
  const filtered = useMemo(() => {
    return items
      .filter((i) => {
        if (kindTab !== "all" && i.kind !== kindTab) return false
        if (search && !i.name.toLowerCase().includes(search.toLowerCase())) return false
        return true
      })
      .sort((a, b) => {
        // Active before paused, then by next due date
        if (a.status !== b.status) return a.status === "active" ? -1 : 1
        return new Date(a.nextDue).getTime() - new Date(b.nextDue).getTime()
      })
  }, [items, kindTab, search])

  // Summary numbers (active only)
  const active        = items.filter((i) => i.status === "active")
  const monthlyOut    = active.filter((i) => i.kind === "expense").reduce((s, i) => s + monthlyEquivalent(i.amount, i.frequency), 0)
  const monthlyIn     = active.filter((i) => i.kind === "income").reduce((s, i) => s + monthlyEquivalent(i.amount, i.frequency), 0)
  const upcomingCount = active.filter((i) => {
    const d = dateUtil.daysUntil(i.nextDue)
    return d >= 0 && d <= 7
  }).length

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Recurring</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Bills, subscriptions and regular income</p>
        </div>
        <Button className="gap-1.5" onClick={() => setAddOpen(true)}>
          <IconPlus className="size-4" />
          Add item
        </Button>
      </div>

      {/* ── Summary strip ── */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-border bg-card px-4 py-3">
          <p className="text-xs text-muted-foreground">Monthly out</p>
          <p className="text-lg font-bold tabular-nums text-destructive mt-0.5">-{stringUtil.formatMoneyFull(monthlyOut)}</p>
        </div>
        <div className="rounded-xl border border-border bg-card px-4 py-3">
          <p className="text-xs text-muted-foreground">Monthly in</p>
          <p className="text-lg font-bold tabular-nums text-emerald-600 mt-0.5">+{stringUtil.formatMoneyFull(monthlyIn)}</p>
        </div>
        <div className="rounded-xl border border-border bg-card px-4 py-3">
          <p className="text-xs text-muted-foreground">Due this week</p>
          <p className="text-lg font-bold tabular-nums mt-0.5">
            {upcomingCount} item{upcomingCount !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* ── Filter bar ── */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Kind tabs */}
        <div className="flex rounded-lg border border-border overflow-hidden text-sm">
          {KIND_TABS.map((t) => (
            <button
              key={t}
              onClick={() => setKindTab(t)}
              className={cn(
                "px-3 py-1.5 capitalize transition-colors",
                kindTab === t
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground hover:bg-muted"
              )}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 min-w-40">
          <IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>
      </div>

      {/* ── List ── */}
      <div className="rounded-xl border border-border bg-card overflow-hidden divide-y divide-border">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-muted-foreground">
            No items found.
          </div>
        ) : (
          filtered.map((item) => (
            <RecurringRow
              key={item.id}
              item={item}
              onToggleStatus={toggleStatus}
              onDelete={deleteItem}
            />
          ))
        )}
      </div>

      {/* Item count footer */}
      {filtered.length > 0 && (
        <p className="text-xs text-muted-foreground text-center">
          {filtered.length} item{filtered.length !== 1 ? "s" : ""}
          {search || kindTab !== "all" ? " matching filter" : " total"}
        </p>
      )}

      <AddRecurringDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={addItem}
      />
    </div>
  )
}
