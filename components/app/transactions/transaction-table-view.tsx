"use client"

import { Badge } from "@/components/ui/badge"
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

type Props = {
  paginated: Transaction[]
}

export function TransactionTableView({ paginated }: Props) {
  return (
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
                {dateUtil.format(tx.date, "MMM D, YYYY")}
              </td>
              <td className="px-4 py-3 font-medium">{tx.merchant}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <div className={cn("size-2 rounded-full shrink-0", CATEGORY_COLORS[tx.category] ?? "bg-muted-foreground")} />
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
                {tx.type === "income" ? "+" : "-"}{stringUtil.formatMoneyFull(tx.amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
