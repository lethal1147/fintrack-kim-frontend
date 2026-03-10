"use client"

import { useState } from "react"
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronDown,
  IconChevronUp,
  IconPlus,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { budgetCategories as initialCategories, type BudgetCategory, type BudgetGroup } from "@/lib/mock-data"
import { AddBudgetCategoryDialog } from "@/components/app/budget/add-budget-category-dialog"
import { cn } from "@/lib/utils"

// ─── helpers ─────────────────────────────────────────────────────────────────

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n)
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

const GROUPS: BudgetGroup[] = ["Fixed", "Flexible", "Non-Monthly"]

const groupDescriptions: Record<BudgetGroup, string> = {
  Fixed:        "Same amount every month",
  Flexible:     "Varies month to month",
  "Non-Monthly": "Occasional or seasonal expenses",
}

// ─── sub-components ───────────────────────────────────────────────────────────

function CategoryRow({ cat }: { cat: BudgetCategory }) {
  const pct      = cat.budgeted === 0 ? 0 : Math.min(Math.round((cat.spent / cat.budgeted) * 100), 100)
  const over     = cat.spent > cat.budgeted
  const remaining = cat.budgeted - cat.spent

  return (
    <div className="flex items-center gap-4 px-4 py-3 hover:bg-muted/40 transition-colors">
      {/* Dot + name */}
      <div className="flex items-center gap-2.5 w-36 shrink-0">
        <span
          className="size-2.5 rounded-full shrink-0"
          style={{ background: cat.color }}
        />
        <span className="text-sm font-medium truncate">{cat.name}</span>
      </div>

      {/* Progress bar */}
      <div className="flex-1 min-w-0">
        <Progress
          value={pct}
          className={cn("h-2", over && "[&>div]:bg-destructive")}
        />
      </div>

      {/* Numbers */}
      <div className="flex gap-6 shrink-0 text-sm tabular-nums text-right">
        <div className="w-20">
          <p className="text-xs text-muted-foreground leading-none mb-0.5">Budgeted</p>
          <p className="font-medium">{formatCurrency(cat.budgeted)}</p>
        </div>
        <div className="w-20">
          <p className="text-xs text-muted-foreground leading-none mb-0.5">Spent</p>
          <p className={cn("font-medium", over ? "text-destructive" : "text-foreground")}>
            {formatCurrency(cat.spent)}
          </p>
        </div>
        <div className="w-20">
          <p className="text-xs text-muted-foreground leading-none mb-0.5">Remaining</p>
          <p className={cn("font-medium", over ? "text-destructive" : "text-emerald-600")}>
            {over ? "-" : ""}{formatCurrency(Math.abs(remaining))}
          </p>
        </div>
      </div>
    </div>
  )
}

function GroupSection({
  group,
  categories,
}: {
  group: BudgetGroup
  categories: BudgetCategory[]
}) {
  const [open, setOpen] = useState(true)

  const totalBudgeted = categories.reduce((s, c) => s + c.budgeted, 0)
  const totalSpent    = categories.reduce((s, c) => s + c.spent, 0)
  const totalPct      = totalBudgeted === 0 ? 0 : Math.min(Math.round((totalSpent / totalBudgeted) * 100), 100)
  const over          = totalSpent > totalBudgeted

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Group header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-muted/40 hover:bg-muted/60 transition-colors text-left"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">{group}</span>
            <span className="text-xs text-muted-foreground">{groupDescriptions[group]}</span>
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm tabular-nums shrink-0">
          <span className="text-muted-foreground text-xs">
            {formatCurrency(totalSpent)} / {formatCurrency(totalBudgeted)}
          </span>
          <span className={cn("text-xs font-medium", over ? "text-destructive" : "text-muted-foreground")}>
            {totalPct}%
          </span>
          {open
            ? <IconChevronUp className="size-4 text-muted-foreground" />
            : <IconChevronDown className="size-4 text-muted-foreground" />
          }
        </div>
      </button>

      {/* Category rows */}
      {open && (
        <div className="divide-y divide-border">
          {categories.map((cat) => (
            <CategoryRow key={cat.name} cat={cat} />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function BudgetPage() {
  const [monthIdx, setMonthIdx]   = useState(2) // March (0-indexed)
  const [categories, setCategories] = useState<BudgetCategory[]>(initialCategories)
  const [dialogOpen, setDialogOpen] = useState(false)

  function handleAddCategory(cat: BudgetCategory) {
    setCategories((prev) => [...prev, cat])
  }
  const year = 2026

  const totalBudgeted = categories.reduce((s, c) => s + c.budgeted, 0)
  const totalSpent    = categories.reduce((s, c) => s + c.spent, 0)
  const totalRemaining = totalBudgeted - totalSpent
  const overallPct    = Math.min(Math.round((totalSpent / totalBudgeted) * 100), 100)

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Budget</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Plan and track your monthly spending</p>
        </div>
        <Button className="gap-1.5" onClick={() => setDialogOpen(true)}>
          <IconPlus className="size-4" />
          Add category
        </Button>
      </div>

      {/* ── Month selector ── */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => setMonthIdx((i) => Math.max(0, i - 1))}
          disabled={monthIdx === 0}
        >
          <IconChevronLeft className="size-3.5" />
        </Button>
        <span className="text-sm font-semibold w-36 text-center">
          {MONTHS[monthIdx]} {year}
        </span>
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => setMonthIdx((i) => Math.min(11, i + 1))}
          disabled={monthIdx === 11}
        >
          <IconChevronRight className="size-3.5" />
        </Button>
      </div>

      {/* ── Summary strip ── */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Total Budgeted</p>
            <p className="text-lg font-bold tabular-nums">{formatCurrency(totalBudgeted)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Spent</p>
            <p className="text-lg font-bold tabular-nums">{formatCurrency(totalSpent)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Remaining</p>
            <p className={cn(
              "text-lg font-bold tabular-nums",
              totalRemaining < 0 ? "text-destructive" : "text-emerald-600"
            )}>
              {totalRemaining < 0 ? "-" : ""}{formatCurrency(Math.abs(totalRemaining))}
            </p>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{overallPct}% of budget used</span>
            <span>{formatCurrency(totalSpent)} / {formatCurrency(totalBudgeted)}</span>
          </div>
          <Progress
            value={overallPct}
            className={cn("h-2.5", totalSpent > totalBudgeted && "[&>div]:bg-destructive")}
          />
        </div>
      </div>

      {/* ── Category groups ── */}
      <div className="space-y-4">
        {GROUPS.map((group) => {
          const cats = categories.filter((c) => c.group === group)
          if (cats.length === 0) return null
          return <GroupSection key={group} group={group} categories={cats} />
        })}
      </div>

      <AddBudgetCategoryDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onAdd={handleAddCategory}
      />
    </div>
  )
}
