"use client"

import { Badge } from "@/components/ui/badge"
import { IconPencil, IconTrash } from "@tabler/icons-react"
import { useTranslations } from "next-intl"
import { type Transaction } from "@/lib/api-client"
import { stringUtil } from "@/lib/string-util"
import { dateUtil } from "@/lib/date-util"
import { cn } from "@/lib/utils"
import { useCategoryLabel } from "@/lib/category-util"

const CATEGORY_COLORS: Record<string, string> = {
  // Income
  Salary: "bg-emerald-500",
  Freelance: "bg-green-500",
  Business: "bg-lime-500",
  "Gift Received": "bg-teal-400",
  "Investment Returns": "bg-cyan-500",
  "Rental Income": "bg-emerald-400",
  "Other Income": "bg-green-400",
  // Expense
  Housing: "bg-sky-500",
  "Food & Dining": "bg-orange-500",
  Transport: "bg-blue-500",
  Entertainment: "bg-violet-500",
  Health: "bg-pink-500",
  Shopping: "bg-amber-500",
  Utilities: "bg-slate-500",
  Education: "bg-teal-500",
  Investment: "bg-indigo-500",
  Travel: "bg-purple-500",
  "Gifts & Donations": "bg-rose-500",
  Subscriptions: "bg-slate-400",
  Other: "bg-gray-400",
}

function groupByDate(txs: Transaction[]): [string, Transaction[]][] {
  const map = new Map<string, Transaction[]>()
  for (const tx of txs) {
    const existing = map.get(tx.date) ?? []
    map.set(tx.date, [...existing, tx])
  }
  return Array.from(map.entries()).sort(([a], [b]) => b.localeCompare(a))
}

type Props = {
  paginated: Transaction[]
  onEdit: (tx: Transaction) => void
  onDelete: (id: string) => Promise<void>
}

export function TransactionListView({ paginated, onEdit, onDelete }: Props) {
  const t = useTranslations("transactions.listView")
  const getCategoryLabel = useCategoryLabel()
  const grouped = groupByDate(paginated)

  return (
    <div className="space-y-6">
      {grouped.map(([date, txs]) => (
        <div key={date}>
          <p className="text-muted-foreground mb-2 px-1 text-xs font-semibold tracking-wider uppercase">
            {dateUtil.format(date, "dddd, MMMM D, YYYY")}
          </p>
          <div className="border-border bg-card divide-border divide-y overflow-hidden rounded-xl border">
            {txs.map((tx) => (
              <div
                key={tx.id}
                className="group hover:bg-muted/40 flex items-center gap-3 px-4 py-3 transition-colors"
              >
                <div
                  className={cn(
                    "size-2.5 shrink-0 rounded-full",
                    CATEGORY_COLORS[tx.category] ?? "bg-muted-foreground"
                  )}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{tx.merchant}</p>
                  <div className="mt-0.5 flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="rounded-md px-1.5 py-0 text-xs font-normal"
                    >
                      {getCategoryLabel(tx.category)}
                    </Badge>
                    <span className="text-muted-foreground text-xs">
                      {dateUtil.format(tx.date, "MMM D")}
                    </span>
                  </div>
                </div>
                <p
                  className={cn(
                    "shrink-0 text-sm font-semibold tabular-nums",
                    tx.type === "income" ? "text-emerald-600" : "text-destructive"
                  )}
                >
                  {tx.type === "income" ? "+" : "-"}
                  {stringUtil.formatMoneyFull(tx.amount)}
                </p>
                <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => onEdit(tx)}
                    className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-md p-1 transition-colors"
                    title={t("actionEdit")}
                  >
                    <IconPencil className="size-3.5" />
                  </button>
                  <button
                    onClick={() => onDelete(tx.id)}
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md p-1 transition-colors"
                    title={t("actionDelete")}
                  >
                    <IconTrash className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
