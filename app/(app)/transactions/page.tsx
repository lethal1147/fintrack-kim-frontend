"use client"

import { useEffect, useState } from "react"
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
import { EditTransactionDialog } from "@/components/app/transactions/edit-transaction-dialog"
import { TransactionListView } from "@/components/app/transactions/transaction-list-view"
import { TransactionTableView } from "@/components/app/transactions/transaction-table-view"
import { TransactionPagination } from "@/components/app/transactions/transaction-pagination"
import { type Transaction } from "@/lib/api-client"
import { ALL_CATEGORIES } from "@/lib/categories"
import { stringUtil } from "@/lib/string-util"
import { useTransactionsStore } from "@/store/transactions-store"
import { cn } from "@/lib/utils"

// ─── constants ───────────────────────────────────────────────────────────────

const TYPE_FILTERS = ["all", "income", "expense"] as const
const VIEW_LIST  = "list" as const
const VIEW_TABLE = "table" as const

// ─── page ─────────────────────────────────────────────────────────────────────

export default function TransactionsPage() {
  const {
    transactions,
    total,
    pages,
    isLoading,
    filter,
    fetchTransactions,
    setFilter,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransactionsStore()

  const [view, setView]               = useState<typeof VIEW_LIST | typeof VIEW_TABLE>(VIEW_LIST)
  const [dialogOpen, setDialogOpen]   = useState(false)
  const [editTarget, setEditTarget]   = useState<Transaction | null>(null)

  useEffect(() => { fetchTransactions() }, [fetchTransactions])

  // ── summary (current page) ─────────────────────────────────────────────────
  const totalIncome  = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0)
  const totalExpense = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0)

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{total} entries</p>
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
            value={filter.search}
            onChange={(e) => setFilter({ search: e.target.value })}
            className="pl-8"
          />
        </div>

        {/* Type filter */}
        <div className="flex rounded-lg border border-border overflow-hidden text-sm shrink-0">
          {TYPE_FILTERS.map((t) => (
            <button
              key={t}
              onClick={() => setFilter({ type: t })}
              className={cn(
                "px-3 py-1.5 capitalize transition-colors",
                filter.type === t
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground hover:bg-muted"
              )}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Category filter */}
        <Select
          value={filter.category || "all"}
          onValueChange={(v) => setFilter({ category: v === "all" ? "" : v })}
        >
          <SelectTrigger className="w-44 shrink-0">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {ALL_CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Date range */}
        <div className="flex items-center gap-1 shrink-0">
          <Input
            type="date"
            value={filter.from}
            onChange={(e) => setFilter({ from: e.target.value })}
            className="w-36"
            title="From date"
          />
          <span className="text-xs text-muted-foreground px-0.5">–</span>
          <Input
            type="date"
            value={filter.to}
            onChange={(e) => setFilter({ to: e.target.value })}
            className="w-36"
            title="To date"
          />
        </div>

        {/* View toggle */}
        <div className="flex rounded-lg border border-border overflow-hidden shrink-0">
          <button
            onClick={() => setView(VIEW_LIST)}
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
            onClick={() => setView(VIEW_TABLE)}
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
      {isLoading ? (
        <div className="py-20 text-center text-muted-foreground text-sm">Loading…</div>
      ) : transactions.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground text-sm">
          No transactions match your filters.
        </div>
      ) : view === VIEW_LIST ? (
        <TransactionListView
          paginated={transactions}
          onEdit={setEditTarget}
          onDelete={deleteTransaction}
        />
      ) : (
        <TransactionTableView
          paginated={transactions}
          onEdit={setEditTarget}
          onDelete={deleteTransaction}
        />
      )}

      {/* ── Pagination ── */}
      {total > 0 && (
        <TransactionPagination
          safePage={filter.page}
          totalPages={pages}
          filteredCount={total}
          onPageChange={(p) => setFilter({ page: p })}
        />
      )}

      {/* ── Dialogs ── */}
      <AddTransactionDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onAdd={addTransaction}
      />
      <EditTransactionDialog
        open={editTarget !== null}
        transaction={editTarget}
        onClose={() => setEditTarget(null)}
        onUpdate={updateTransaction}
      />
    </div>
  )
}
