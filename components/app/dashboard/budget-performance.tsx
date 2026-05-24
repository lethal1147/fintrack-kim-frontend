"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { useBudgetStore } from "@/store/budget-store"
import { stringUtil } from "@/lib/string-util"

// ─── constants ────────────────────────────────────────────────────────────────

const TOP_N = 5
const SKELETON_ROWS = 4

// ─── component ────────────────────────────────────────────────────────────────

export function BudgetPerformance() {
  const t = useTranslations("dashboard.budgetPerformance")
  const { categories } = useBudgetStore()

  const topCategories = [...categories].sort((a, b) => b.spent - a.spent).slice(0, TOP_N)

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{t("title")}</CardTitle>
        <CardDescription>{t("subtitle")}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-4 pt-0">
        {categories.length === 0 ? (
          <div className="space-y-3">
            {Array.from({ length: SKELETON_ROWS }).map((_, i) => (
              <div key={i} className="bg-muted h-5 animate-pulse rounded" />
            ))}
          </div>
        ) : (
          topCategories.map((cat) => {
            const pct = Math.min(Math.round((cat.spent / cat.budgeted) * 100), 100)
            const over = cat.spent > cat.budgeted
            const remaining = cat.budgeted - cat.spent

            return (
              <div key={cat.name} className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="flex min-w-0 items-center gap-1.5">
                    <span className="truncate text-sm font-medium">{cat.name}</span>
                    <Badge variant="outline" className="shrink-0 px-1.5 py-0 text-[10px]">
                      {cat.group}
                    </Badge>
                  </span>
                  <span
                    className={cn(
                      "shrink-0 text-xs tabular-nums",
                      over ? "text-destructive font-medium" : "text-muted-foreground"
                    )}
                  >
                    {stringUtil.formatMoney(cat.spent)} / {stringUtil.formatMoney(cat.budgeted)}
                  </span>
                </div>
                <Progress value={pct} className={cn("h-1.5", over && "[&>div]:bg-destructive")} />
                <p
                  className={cn(
                    "text-xs tabular-nums",
                    over ? "text-destructive" : "text-emerald-600"
                  )}
                >
                  {over
                    ? t("overBudget", { amount: stringUtil.formatMoney(Math.abs(remaining)) })
                    : t("remaining", { amount: stringUtil.formatMoney(remaining) })}
                </p>
              </div>
            )
          })
        )}
      </CardContent>
      <div className="px-6 pb-4">
        <Link href="/budget" className="text-primary text-xs underline-offset-4 hover:underline">
          {t("viewAll")}
        </Link>
      </div>
    </Card>
  )
}
