"use client"

import { useState, useMemo } from "react"
import {
  IconPlus,
  IconSearch,
  IconArrowUp,
  IconArrowDown,
  IconLayoutList,
  IconTable,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AddTransactionDialog } from "@/components/app/transactions/add-transaction-dialog"
import { TransactionListView } from "@/components/app/transactions/transaction-list-view"
import { TransactionTableView } from "@/components/app/transactions/transaction-table-view"
import { TransactionPagination } from "@/components/app/transactions/transaction-pagination"
import { CATEGORIES } from "@/lib/mock-data"
import { stringUtil } from "@/lib/string-util"
import { useTransactionsStore } from "@/store/transactions-store"
import { cn } from "@/lib/utils"

// ─── constants ───────────────────────────────────────────────────────────────

const PAGE_SIZE    = 8
const TYPE_FILTERS = ["all", "income", "expense"] as const
const VIEW_LIST = "list" as const
const VIEW_TABLE = "table" as const

// ─── page ─────────────────────────────────────────────────────────────────────

export default function TransactionsPage() {
  const { transactions, addTransaction } = useTransactionsStore()

  // UI-only state
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<"all" | "income" | "expense">("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [view, setView] = useState<typeof VIEW_LIST | typeof VIEW_TABLE>(VIEW_LIST)
  const [page, setPage] = useState(1)
  const [dialogOpen, setDialogOpen] = useState(false)

  // reset to page 1 on any filter change
  function updateSearch(v: string)              { setSearch(v);        setPage(1) }
  function updateType(v: typeof typeFilter)     { setTypeFilter(v);    setPage(1) }
  function updateCategory(v: string)            { setCategoryFilter(v); setPage(1) }
  function updateView(v: typeof view)           { setView(v);          setPage(1) }

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
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage   = Math.min(page, totalPages)
  const paginated  = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  // ── summary (over full filtered set, not just current page) ──────────────
  const totalIncome  = filtered.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0)
  const totalExpense = filtered.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0)

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
            <p className="text-base font-bold text-emerald-600">{stringUtil.formatMoneyFull(totalIncome)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 rounded-xl border border-border bg-card px-4 py-3">
          <div className="flex items-center justify-center size-8 rounded-lg bg-destructive/10 text-destructive shrink-0">
            <IconArrowUp className="size-4" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total spent</p>
            <p className="text-base font-bold">{stringUtil.formatMoneyFull(totalExpense)}</p>
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
          {TYPE_FILTERS.map((t) => (
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
            onClick={() => updateView(VIEW_LIST)}
            className={cn(
              "flex items-center justify-center px-2.5 py-1.5 transition-colors",
              view === VIEW_LIST
                ? "bg-primary text-primary-foreground"
                : "bg-background text-muted-foreground hover:bg-muted"
            )}
            title="List view"
          >
            <IconLayoutList className="size-4" />
          </button>
          <button
            onClick={() => updateView(VIEW_TABLE)}
            className={cn(
              "flex items-center justify-center px-2.5 py-1.5 transition-colors",
              view === VIEW_TABLE
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
      ) : view === VIEW_LIST ? (
        <TransactionListView paginated={paginated} />
      ) : (
        <TransactionTableView paginated={paginated} />
      )}

      {/* ── Pagination ── */}
      {filtered.length > 0 && (
        <TransactionPagination
          safePage={safePage}
          totalPages={totalPages}
          filteredCount={filtered.length}
          onPageChange={setPage}
        />
      )}

      {/* ── Dialog ── */}
      <AddTransactionDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onAdd={addTransaction}
      />
    </div>
  )
}
