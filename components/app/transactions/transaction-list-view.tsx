"use client"

import { Badge } from "@/components/ui/badge"
import { IconPencil, IconTrash } from "@tabler/icons-react"
import { type Transaction } from "@/lib/api-client"
import { stringUtil } from "@/lib/string-util"
import { dateUtil } from "@/lib/date-util"
import { cn } from "@/lib/utils"

const CATEGORY_COLORS: Record<string, string> = {
  // Income
  Salary:               "bg-emerald-500",
  Freelance:            "bg-green-500",
  Business:             "bg-lime-500",
  "Gift Received":      "bg-teal-400",
  "Investment Returns": "bg-cyan-500",
  "Rental Income":      "bg-emerald-400",
  "Other Income":       "bg-green-400",
  // Expense
  Housing:              "bg-sky-500",
  "Food & Dining":      "bg-orange-500",
  Transport:            "bg-blue-500",
  Entertainment:        "bg-violet-500",
  Health:               "bg-pink-500",
  Shopping:             "bg-amber-500",
  Utilities:            "bg-slate-500",
  Education:            "bg-teal-500",
  Investment:           "bg-indigo-500",
  Travel:               "bg-purple-500",
  "Gifts & Donations":  "bg-rose-500",
  Subscriptions:        "bg-slate-400",
  Other:                "bg-gray-400",
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
  const grouped = groupByDate(paginated)

  return (
    <div className="space-y-6">
      {grouped.map(([date, txs]) => (
        <div key={date}>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
            {dateUtil.format(date, "dddd, MMMM D, YYYY")}
          </p>
          <div className="rounded-xl border border-border bg-card overflow-hidden divide-y divide-border">
            {txs.map((tx) => (
              <div
                key={tx.id}
                className="group flex items-center gap-3 px-4 py-3 hover:bg-muted/40 transition-colors"
              >
                <div className={cn("size-2.5 rounded-full shrink-0", CATEGORY_COLORS[tx.category] ?? "bg-muted-foreground")} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{tx.merchant}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant="secondary" className="text-xs px-1.5 py-0 rounded-md font-normal">
                      {tx.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{dateUtil.format(tx.date, "MMM D")}</span>
                  </div>
                </div>
                <p className={cn(
                  "text-sm font-semibold tabular-nums shrink-0",
                  tx.type === "income" ? "text-emerald-600" : "text-foreground"
                )}>
                  {tx.type === "income" ? "+" : "-"}{stringUtil.formatMoneyFull(tx.amount)}
                </p>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button
                    onClick={() => onEdit(tx)}
                    className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    title="Edit"
                  >
                    <IconPencil className="size-3.5" />
                  </button>
                  <button
                    onClick={() => onDelete(tx.id)}
                    className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    title="Delete"
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
