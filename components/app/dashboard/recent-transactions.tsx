"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { useTransactionsStore } from "@/store/transactions-store"
import { stringUtil } from "@/lib/string-util"
import { useCategoryLabel } from "@/lib/category-util"

// ─── constants ────────────────────────────────────────────────────────────────

const SKELETON_ROWS = 5

const CATEGORY_COLORS: Record<string, string> = {
  Income:        "bg-emerald-500",
  Entertainment: "bg-violet-500",
  Food:          "bg-orange-500",
  Transport:     "bg-blue-500",
  Health:        "bg-pink-500",
}

// ─── component ────────────────────────────────────────────────────────────────

export function RecentTransactions() {
  const t = useTranslations("dashboard.recentTransactions")
  const { recentTransactions } = useTransactionsStore()
  const getCategoryLabel = useCategoryLabel()

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">{t("title")}</CardTitle>
            <CardDescription>{t("subtitle")}</CardDescription>
          </div>
          <Link href="/transactions" className="text-xs text-primary hover:underline underline-offset-4">
            {t("viewAll")}
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-1 pt-0">
        {recentTransactions.length === 0 ? (
          <div className="space-y-3">
            {Array.from({ length: SKELETON_ROWS }).map((_, i) => (
              <div key={i} className="h-5 rounded bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          recentTransactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center gap-3 px-1 py-2.5 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className={cn("size-2 rounded-full shrink-0", CATEGORY_COLORS[tx.category] ?? "bg-muted-foreground")} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{tx.merchant}</p>
                <p className="text-xs text-muted-foreground">{getCategoryLabel(tx.category)} · {tx.date}</p>
              </div>
              <p className={cn("text-sm font-semibold tabular-nums shrink-0", tx.type === "income" ? "text-emerald-600" : "text-foreground")}>
                {tx.type === "income" ? "+" : "-"}{stringUtil.formatMoneyFull(tx.amount)}
              </p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
