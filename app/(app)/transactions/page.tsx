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
import { useTranslations } from "next-intl"
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
import { useCategoryLabel } from "@/lib/category-util"
import { useTransactionsStore } from "@/store/transactions-store"
import { cn } from "@/lib/utils"

// ─── constants ───────────────────────────────────────────────────────────────

const TYPE_FILTERS = ["all", "income", "expense"] as const
const VIEW_LIST = "list" as const
const VIEW_TABLE = "table" as const

// ─── page ─────────────────────────────────────────────────────────────────────

export default function TransactionsPage() {
  const t = useTranslations("transactions")
  const getCategoryLabel = useCategoryLabel()
  const {
    transactions,
    total,
    pages,
    isLoading,
    filter,
    monthlySummary,
    fetchTransactions,
    fetchMonthlySummary,
    setFilter,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransactionsStore()

  const [view, setView] = useState<typeof VIEW_LIST | typeof VIEW_TABLE>(VIEW_LIST)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Transaction | null>(null)

  useEffect(() => {
    fetchTransactions()
    fetchMonthlySummary()
  }, [fetchTransactions, fetchMonthlySummary])

  const totalIncome = monthlySummary?.totalIncome ?? 0
  const totalExpense = monthlySummary?.totalExpense ?? 0

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">
            {t("entriesCount", { count: total })}
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="gap-1.5">
          <IconPlus className="size-4" />
          {t("addButton")}
        </Button>
      </div>

      {/* ── Summary strip ── */}
      <div className="grid grid-cols-2 gap-3">
        <div className="border-border bg-card flex items-center gap-2.5 rounded-xl border px-4 py-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
            <IconArrowDown className="size-4" />
          </div>
          <div>
            <p className="text-muted-foreground text-xs">{t("incomeThisMonth")}</p>
            <p className="text-base font-bold text-emerald-600">
              {stringUtil.formatMoneyFull(totalIncome)}
            </p>
          </div>
        </div>
        <div className="border-border bg-card flex items-center gap-2.5 rounded-xl border px-4 py-3">
          <div className="bg-destructive/10 text-destructive flex size-8 shrink-0 items-center justify-center rounded-lg">
            <IconArrowUp className="size-4" />
          </div>
          <div>
            <p className="text-muted-foreground text-xs">{t("spentThisMonth")}</p>
            <p className="text-base font-bold">{stringUtil.formatMoneyFull(totalExpense)}</p>
          </div>
        </div>
      </div>

      {/* ── Filter bar + view toggle ── */}
      <div className="flex flex-wrap gap-2">
        {/* Search */}
        <div className="relative min-w-48 flex-1">
          <IconSearch className="text-muted-foreground absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
          <Input
            placeholder={t("searchPlaceholder")}
            value={filter.search}
            onChange={(e) => setFilter({ search: e.target.value })}
            className="pl-8"
          />
        </div>

        {/* Type filter */}
        <div className="border-border flex shrink-0 overflow-hidden rounded-lg border text-sm">
          {TYPE_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter({ type: f })}
              className={cn(
                "px-3 py-1.5 capitalize transition-colors",
                filter.type === f
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground hover:bg-muted"
              )}
            >
              {f === "all"
                ? t("filterAll")
                : f === "income"
                  ? t("filterIncome")
                  : t("filterExpense")}
            </button>
          ))}
        </div>

        {/* Category filter */}
        <Select
          value={filter.category || "all"}
          onValueChange={(v) => setFilter({ category: v === "all" ? "" : v })}
        >
          <SelectTrigger className="w-44 shrink-0">
            <SelectValue placeholder={t("categoryAll")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("categoryAll")}</SelectItem>
            {ALL_CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {getCategoryLabel(c)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Date range */}
        <div className="flex shrink-0 items-center gap-1">
          <Input
            type="date"
            value={filter.from}
            onChange={(e) => setFilter({ from: e.target.value })}
            className="w-36"
            title={t("fromDateTitle")}
          />
          <span className="text-muted-foreground px-0.5 text-xs">–</span>
          <Input
            type="date"
            value={filter.to}
            onChange={(e) => setFilter({ to: e.target.value })}
            className="w-36"
            title={t("toDateTitle")}
          />
        </div>

        {/* View toggle */}
        <div className="border-border flex shrink-0 overflow-hidden rounded-lg border">
          <button
            onClick={() => setView(VIEW_LIST)}
            className={cn(
              "flex items-center justify-center px-2.5 py-1.5 transition-colors",
              view === VIEW_LIST
                ? "bg-primary text-primary-foreground"
                : "bg-background text-muted-foreground hover:bg-muted"
            )}
            title={t("viewTitleList")}
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
            title={t("viewTitleTable")}
          >
            <IconTable className="size-4" />
          </button>
        </div>
      </div>

      {/* ── Content ── */}
      {isLoading ? (
        <div className="text-muted-foreground py-20 text-center text-sm">{t("loading")}</div>
      ) : transactions.length === 0 ? (
        <div className="text-muted-foreground py-20 text-center text-sm">{t("emptyFilters")}</div>
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
