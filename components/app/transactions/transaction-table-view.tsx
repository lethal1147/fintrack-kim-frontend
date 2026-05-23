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
  onEdit: (tx: Transaction) => void
  onDelete: (id: string) => Promise<void>
}

export function TransactionTableView({ paginated, onEdit, onDelete }: Props) {
  const t = useTranslations("transactions.tableView")
  const getCategoryLabel = useCategoryLabel()

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            <th className="text-left px-4 py-2.5 font-medium text-muted-foreground w-32">{t("colDate")}</th>
            <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">{t("colMerchant")}</th>
            <th className="text-left px-4 py-2.5 font-medium text-muted-foreground w-36">{t("colCategory")}</th>
            <th className="text-left px-4 py-2.5 font-medium text-muted-foreground w-24">{t("colType")}</th>
            <th className="text-right px-4 py-2.5 font-medium text-muted-foreground w-32">{t("colAmount")}</th>
            <th className="w-16" />
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {paginated.map((tx) => (
            <tr key={tx.id} className="group hover:bg-muted/40 transition-colors">
              <td className="px-4 py-3 text-muted-foreground tabular-nums whitespace-nowrap">
                {dateUtil.format(tx.date, "MMM D, YYYY")}
              </td>
              <td className="px-4 py-3 font-medium">{tx.merchant}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <div className={cn("size-2 rounded-full shrink-0", CATEGORY_COLORS[tx.category] ?? "bg-muted-foreground")} />
                  <span className="text-muted-foreground">{getCategoryLabel(tx.category)}</span>
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
                tx.type === "income" ? "text-emerald-600" : "text-destructive"
              )}>
                {tx.type === "income" ? "+" : "-"}{stringUtil.formatMoneyFull(tx.amount)}
              </td>
              <td className="px-2 py-3">
                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEdit(tx)}
                    className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    title={t("actionEdit")}
                  >
                    <IconPencil className="size-3.5" />
                  </button>
                  <button
                    onClick={() => onDelete(tx.id)}
                    className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    title={t("actionDelete")}
                  >
                    <IconTrash className="size-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
