"use client"

import { useState, useMemo } from "react"
import {
  IconPlus,
  IconSearch,
  IconArrowUp,
  IconArrowDown,
  IconLayoutList,
  IconTable,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AddTransactionDialog } from "@/components/app/transactions/add-transaction-dialog"
import { allTransactions, CATEGORIES, type Transaction } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

// ─── constants ───────────────────────────────────────────────────────────────

const PAGE_SIZE = 8

// ─── helpers ─────────────────────────────────────────────────────────────────

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n)
}

function formatDateLabel(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

function formatDateShort(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

function formatDateDisplay(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

const categoryColors: Record<string, string> = {
  Income:          "bg-emerald-500",
  Housing:         "bg-sky-500",
  "Food & Dining": "bg-orange-500",
  Transport:       "bg-blue-500",
  Entertainment:   "bg-violet-500",
  Health:          "bg-pink-500",
  Shopping:        "bg-amber-500",
  Utilities:       "bg-slate-500",
  Education:       "bg-teal-500",
  Other:           "bg-gray-400",
}

function groupByDate(txs: Transaction[]): [string, Transaction[]][] {
  const map = new Map<string, Transaction[]>()
  for (const tx of txs) {
    const existing = map.get(tx.date) ?? []
    map.set(tx.date, [...existing, tx])
  }
  return Array.from(map.entries()).sort(([a], [b]) => b.localeCompare(a))
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(allTransactions)
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<"all" | "income" | "expense">("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [view, setView] = useState<"list" | "table">("list")
  const [page, setPage] = useState(1)
  const [dialogOpen, setDialogOpen] = useState(false)

  // reset to page 1 on any filter change
  function updateSearch(v: string)   { setSearch(v);        setPage(1) }
  function updateType(v: typeof typeFilter) { setTypeFilter(v); setPage(1) }
  function updateCategory(v: string) { setCategoryFilter(v); setPage(1) }
  function updateView(v: typeof view){ setView(v);           setPage(1) }

  // ── filtered list (sorted newest first) ──────────────────────────────────
  const filtered = useMemo(() => {
    return transactions
      .filter((tx) => {
        const matchSearch =
          !search ||
          tx.merchant.toLowerCase().includes(search.toLowerCase()) ||
          tx.category.toLowerCase().includes(search.toLowerCase())
        const matchType = typeFilter === "all" || tx.type === typeFilter
        const matchCat  = categoryFilter === "all" || tx.category === categoryFilter
        return matchSearch && matchType && matchCat
      })
      .sort((a, b) => b.date.localeCompare(a.date))
  }, [transactions, search, typeFilter, categoryFilter])

  // ── pagination ────────────────────────────────────────────────────────────
  const totalPages  = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage    = Math.min(page, totalPages)
  const paginated   = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)
  const grouped     = useMemo(() => groupByDate(paginated), [paginated])

  // ── summary (over full filtered set, not just current page) ──────────────
  const totalIncome  = filtered.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0)
  const totalExpense = filtered.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0)

  function handleAdd(tx: Transaction) {
    setTransactions((prev) => [tx, ...prev])
    setPage(1)
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{filtered.length} entries</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="gap-1.5">
          <IconPlus className="size-4" />
          Add transaction
        </Button>
      </div>

      {/* ── Summary strip ── */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2.5 rounded-xl border border-border bg-card px-4 py-3">
          <div className="flex items-center justify-center size-8 rounded-lg bg-emerald-500/10 text-emerald-600 shrink-0">
            <IconArrowDown className="size-4" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total income</p>
            <p className="text-base font-bold text-emerald-600">{formatCurrency(totalIncome)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 rounded-xl border border-border bg-card px-4 py-3">
          <div className="flex items-center justify-center size-8 rounded-lg bg-destructive/10 text-destructive shrink-0">
            <IconArrowUp className="size-4" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total spent</p>
            <p className="text-base font-bold">{formatCurrency(totalExpense)}</p>
          </div>
        </div>
      </div>

      {/* ── Filter bar + view toggle ── */}
      <div className="flex flex-wrap gap-2">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => updateSearch(e.target.value)}
            className="pl-8"
          />
        </div>

        {/* Type filter */}
        <div className="flex rounded-lg border border-border overflow-hidden text-sm shrink-0">
          {(["all", "income", "expense"] as const).map((t) => (
            <button
              key={t}
              onClick={() => updateType(t)}
              className={cn(
                "px-3 py-1.5 capitalize transition-colors",
                typeFilter === t
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground hover:bg-muted"
              )}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Category filter */}
        <Select value={categoryFilter} onValueChange={updateCategory}>
          <SelectTrigger className="w-44 shrink-0">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* View toggle */}
        <div className="flex rounded-lg border border-border overflow-hidden shrink-0">
          <button
            onClick={() => updateView("list")}
            className={cn(
              "flex items-center justify-center px-2.5 py-1.5 transition-colors",
              view === "list"
                ? "bg-primary text-primary-foreground"
                : "bg-background text-muted-foreground hover:bg-muted"
            )}
            title="List view"
          >
            <IconLayoutList className="size-4" />
          </button>
          <button
            onClick={() => updateView("table")}
            className={cn(
              "flex items-center justify-center px-2.5 py-1.5 transition-colors",
              view === "table"
                ? "bg-primary text-primary-foreground"
                : "bg-background text-muted-foreground hover:bg-muted"
            )}
            title="Table view"
          >
            <IconTable className="size-4" />
          </button>
        </div>
      </div>

      {/* ── Content ── */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground text-sm">
          No transactions match your filters.
        </div>
      ) : view === "list" ? (

        /* ── LIST VIEW ─────────────────────────────────────────────────── */
        <div className="space-y-6">
          {grouped.map(([date, txs]) => (
            <div key={date}>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
                {formatDateLabel(date)}
              </p>
              <div className="rounded-xl border border-border bg-card overflow-hidden divide-y divide-border">
                {txs.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-muted/40 transition-colors"
                  >
                    <div className={cn("size-2.5 rounded-full shrink-0", categoryColors[tx.category] ?? "bg-muted-foreground")} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{tx.merchant}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="secondary" className="text-xs px-1.5 py-0 rounded-md font-normal">
                          {tx.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{formatDateDisplay(tx.date)}</span>
                      </div>
                    </div>
                    <p className={cn(
                      "text-sm font-semibold tabular-nums shrink-0",
                      tx.type === "income" ? "text-emerald-600" : "text-foreground"
                    )}>
                      {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      ) : (

        /* ── TABLE VIEW ────────────────────────────────────────────────── */
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground w-32">Date</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Merchant</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground w-36">Category</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground w-24">Type</th>
                <th className="text-right px-4 py-2.5 font-medium text-muted-foreground w-32">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginated.map((tx) => (
                <tr key={tx.id} className="hover:bg-muted/40 transition-colors">
                  <td className="px-4 py-3 text-muted-foreground tabular-nums whitespace-nowrap">
                    {formatDateShort(tx.date)}
                  </td>
                  <td className="px-4 py-3 font-medium">{tx.merchant}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <div className={cn("size-2 rounded-full shrink-0", categoryColors[tx.category] ?? "bg-muted-foreground")} />
                      <span className="text-muted-foreground">{tx.category}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={tx.type === "income" ? "default" : "secondary"}
                      className={cn(
                        "capitalize text-xs px-1.5 py-0 rounded-md font-normal",
                        tx.type === "income" && "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-0"
                      )}
                    >
                      {tx.type}
                    </Badge>
                  </td>
                  <td className={cn(
                    "px-4 py-3 text-right font-semibold tabular-nums",
                    tx.type === "income" ? "text-emerald-600" : "text-foreground"
                  )}>
                    {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Pagination ── */}
      {filtered.length > 0 && (
        <div className="flex items-center justify-between pt-1">
          <p className="text-xs text-muted-foreground">
            Showing {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
            >
              <IconChevronLeft className="size-3.5" />
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
              .reduce<(number | "…")[]>((acc, p, i, arr) => {
                if (i > 0 && (p as number) - (arr[i - 1] as number) > 1) acc.push("…")
                acc.push(p)
                return acc
              }, [])
              .map((p, i) =>
                p === "…" ? (
                  <span key={`ellipsis-${i}`} className="w-7 text-center text-xs text-muted-foreground">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p as number)}
                    className={cn(
                      "size-7 rounded-md text-xs font-medium transition-colors",
                      safePage === p
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {p}
                  </button>
                )
              )}

            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
            >
              <IconChevronRight className="size-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* ── Dialog ── */}
      <AddTransactionDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onAdd={handleAdd}
      />
    </div>
  )
}
