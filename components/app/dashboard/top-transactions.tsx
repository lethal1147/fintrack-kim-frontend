"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { useDashboardStore } from "@/store/dashboard-store"
import { stringUtil } from "@/lib/string-util"
import { useCategoryLabel } from "@/lib/category-util"

// ─── constants ────────────────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, string> = {
  Income:        "bg-emerald-500",
  Entertainment: "bg-violet-500",
  Food:          "bg-orange-500",
  Transport:     "bg-blue-500",
  Health:        "bg-pink-500",
}

const RANK_LABELS = ["1st", "2nd", "3rd", "4th", "5th"]

// ─── component ────────────────────────────────────────────────────────────────

export function TopTransactions() {
  const t = useTranslations("dashboard.topTransactions")
  const { topTransactions } = useDashboardStore()
  const getCategoryLabel = useCategoryLabel()

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{t("title")}</CardTitle>
        <CardDescription>{t("subtitle")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-1 pt-0">
        {topTransactions.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">{t("empty")}</p>
        ) : (
          topTransactions.map((tx, i) => (
            <div
              key={tx.id}
              className="flex items-center gap-3 px-1 py-2.5 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <span className="text-xs font-bold text-muted-foreground w-6 shrink-0 text-right">
                {RANK_LABELS[i]}
              </span>
              <div className={cn("size-2 rounded-full shrink-0", CATEGORY_COLORS[tx.category] ?? "bg-muted-foreground")} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{tx.merchant}</p>
                <p className="text-xs text-muted-foreground">{getCategoryLabel(tx.category)} · {tx.date}</p>
              </div>
              <p className={cn("text-sm font-semibold tabular-nums shrink-0", tx.type === "income" ? "text-emerald-600" : "text-destructive")}>
                {tx.type === "income" ? "+" : "-"}{stringUtil.formatMoneyFull(tx.amount)}
              </p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
