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
  Income: "bg-emerald-500",
  Entertainment: "bg-violet-500",
  Food: "bg-orange-500",
  Transport: "bg-blue-500",
  Health: "bg-pink-500",
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
          <Link
            href="/transactions"
            className="text-primary text-xs underline-offset-4 hover:underline"
          >
            {t("viewAll")}
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-1 pt-0">
        {recentTransactions.length === 0 ? (
          <div className="space-y-3">
            {Array.from({ length: SKELETON_ROWS }).map((_, i) => (
              <div key={i} className="bg-muted h-5 animate-pulse rounded" />
            ))}
          </div>
        ) : (
          recentTransactions.map((tx) => (
            <div
              key={tx.id}
              className="hover:bg-muted/50 flex items-center gap-3 rounded-lg px-1 py-2.5 transition-colors"
            >
              <div
                className={cn(
                  "size-2 shrink-0 rounded-full",
                  CATEGORY_COLORS[tx.category] ?? "bg-muted-foreground"
                )}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{tx.merchant}</p>
                <p className="text-muted-foreground text-xs">
                  {getCategoryLabel(tx.category)} · {tx.date}
                </p>
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
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
