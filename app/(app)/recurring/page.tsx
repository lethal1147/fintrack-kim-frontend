"use client"

import { useState, useMemo } from "react"
import {
  IconPlus,
  IconPlayerPause,
  IconPlayerPlay,
  IconTrash,
  IconRepeat,
  IconSearch,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { recurringItems as initialItems, type RecurringItem, type RecurringKind } from "@/lib/mock-data"
import { AddRecurringDialog } from "@/components/app/recurring/add-recurring-dialog"
import { cn } from "@/lib/utils"

// ─── helpers ─────────────────────────────────────────────────────────────────

const TODAY = new Date(2026, 2, 11) // March 11 2026

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n)
}

function daysUntil(dateStr: string) {
  const due  = new Date(dateStr)
  const diff = Math.round((due.getTime() - TODAY.getTime()) / (1000 * 60 * 60 * 24))
  return diff
}

function dueBadge(days: number) {
  if (days < 0)  return { label: `${Math.abs(days)}d overdue`, cls: "bg-destructive/10 text-destructive border-destructive/20" }
  if (days === 0) return { label: "Due today",    cls: "bg-amber-500/10 text-amber-600 border-amber-500/20" }
  if (days <= 5)  return { label: `in ${days}d`,  cls: "bg-amber-500/10 text-amber-600 border-amber-500/20" }
  return              { label: `in ${days}d`,  cls: "bg-muted text-muted-foreground border-border" }
}

function monthlyEquivalent(item: RecurringItem) {
  if (item.frequency === "monthly") return item.amount
  if (item.frequency === "weekly")  return item.amount * 4.33
  if (item.frequency === "annual")  return item.amount / 12
  return item.amount
}

const FREQ_LABEL: Record<string, string> = {
  weekly: "Weekly", monthly: "Monthly", annual: "Annual",
}

const KIND_TABS = ["all", "expense", "income"] as const
type KindTab = (typeof KIND_TABS)[number]

// ─── Row ─────────────────────────────────────────────────────────────────────

function RecurringRow({
  item,
  onToggleStatus,
  onDelete,
}: {
  item: RecurringItem
  onToggleStatus: (id: string) => void
  onDelete: (id: string) => void
}) {
  const days  = daysUntil(item.nextDue)
  const due   = dueBadge(days)
  const paused = item.status === "paused"

  return (
    <div className={cn(
      "flex items-center gap-3 px-4 py-3.5 hover:bg-muted/30 transition-colors group",
      paused && "opacity-60"
    )}>
      {/* Color avatar */}
      <div
        className="size-9 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0"
        style={{ background: item.color }}
      >
        {item.name.slice(0, 2).toUpperCase()}
      </div>

      {/* Name + meta */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={cn("text-sm font-medium", paused && "line-through")}>{item.name}</span>
          <Badge variant="outline" className="text-xs px-1.5 py-0 rounded-md font-normal">
            {item.category}
          </Badge>
          <Badge variant="outline" className="text-xs px-1.5 py-0 rounded-md font-normal gap-0.5">
            <IconRepeat className="size-2.5" />
            {FREQ_LABEL[item.frequency]}
          </Badge>
          {paused && (
            <Badge variant="outline" className="text-xs px-1.5 py-0 rounded-md text-muted-foreground">
              Paused
            </Badge>
          )}
        </div>
        {/* Next due chip */}
        {!paused && (
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-xs text-muted-foreground">Next:</span>
            <span className="text-xs text-muted-foreground">
              {new Date(item.nextDue).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
            <span className={cn("text-xs px-1.5 py-0.5 rounded-full border", due.cls)}>
              {due.label}
            </span>
          </div>
        )}
      </div>

      {/* Amount */}
      <div className="text-right shrink-0 mr-2">
        <p className={cn(
          "text-sm font-semibold tabular-nums",
          item.kind === "income" ? "text-emerald-600" : "text-foreground"
        )}>
          {item.kind === "income" ? "+" : "-"}{fmt(item.amount)}
        </p>
        {item.frequency !== "monthly" && (
          <p className="text-xs text-muted-foreground">
            ≈ {fmt(monthlyEquivalent(item))}/mo
          </p>
        )}
      </div>

      {/* Actions (visible on hover) */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button
          onClick={() => onToggleStatus(item.id)}
          title={paused ? "Resume" : "Pause"}
          className="size-7 rounded-md hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          {paused
            ? <IconPlayerPlay className="size-3.5" />
            : <IconPlayerPause className="size-3.5" />
          }
        </button>
        <button
          onClick={() => onDelete(item.id)}
          title="Delete"
          className="size-7 rounded-md hover:bg-destructive/10 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
        >
          <IconTrash className="size-3.5" />
        </button>
      </div>
    </div>
  )
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function RecurringPage() {
  const [items, setItems]       = useState<RecurringItem[]>(initialItems)
  const [addOpen, setAddOpen]   = useState(false)
  const [search, setSearch]     = useState("")
  const [kindTab, setKindTab]   = useState<KindTab>("all")

  function handleAdd(item: RecurringItem) {
    setItems((prev) => [...prev, item])
  }

  function handleToggleStatus(id: string) {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, status: i.status === "active" ? "paused" : "active" } : i
      )
    )
  }

  function handleDelete(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

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
  const active       = items.filter((i) => i.status === "active")
  const monthlyOut   = active.filter((i) => i.kind === "expense").reduce((s, i) => s + monthlyEquivalent(i), 0)
  const monthlyIn    = active.filter((i) => i.kind === "income").reduce((s, i) => s + monthlyEquivalent(i), 0)
  const upcomingCount = active.filter((i) => daysUntil(i.nextDue) <= 7 && daysUntil(i.nextDue) >= 0).length

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
          <p className="text-lg font-bold tabular-nums text-destructive mt-0.5">-{fmt(monthlyOut)}</p>
        </div>
        <div className="rounded-xl border border-border bg-card px-4 py-3">
          <p className="text-xs text-muted-foreground">Monthly in</p>
          <p className="text-lg font-bold tabular-nums text-emerald-600 mt-0.5">+{fmt(monthlyIn)}</p>
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
              onToggleStatus={handleToggleStatus}
              onDelete={handleDelete}
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
        onAdd={handleAdd}
      />
    </div>
  )
}
