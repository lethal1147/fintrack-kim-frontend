"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useBudgetStore } from "@/store/budget-store"
import { stringUtil } from "@/lib/string-util"

// ─── constants ────────────────────────────────────────────────────────────────

const TOP_N = 5
const SKELETON_ROWS = 4

// ─── component ────────────────────────────────────────────────────────────────

export function BudgetPerformance() {
  const { categories } = useBudgetStore()

  const topCategories = [...categories]
    .sort((a, b) => b.spent - a.spent)
    .slice(0, TOP_N)

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Budget Performance</CardTitle>
        <CardDescription>Top 5 categories by spend</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-0 flex-1">
        {categories.length === 0 ? (
          <div className="space-y-3">
            {Array.from({ length: SKELETON_ROWS }).map((_, i) => (
              <div key={i} className="h-5 rounded bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          topCategories.map((cat) => {
            const pct       = Math.min(Math.round((cat.spent / cat.budgeted) * 100), 100)
            const over      = cat.spent > cat.budgeted
            const remaining = cat.budgeted - cat.spent

            return (
              <div key={cat.name} className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5 min-w-0">
                    <span className="text-sm font-medium truncate">{cat.name}</span>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 shrink-0">
                      {cat.group}
                    </Badge>
                  </span>
                  <span className={cn(
                    "text-xs tabular-nums shrink-0",
                    over ? "text-destructive font-medium" : "text-muted-foreground"
                  )}>
                    {stringUtil.formatMoney(cat.spent)} / {stringUtil.formatMoney(cat.budgeted)}
                  </span>
                </div>
                <Progress
                  value={pct}
                  className={cn("h-1.5", over && "[&>div]:bg-destructive")}
                />
                <p className={cn(
                  "text-xs tabular-nums",
                  over ? "text-destructive" : "text-emerald-600"
                )}>
                  {over
                    ? `฿${Math.abs(remaining).toFixed(0)} over budget`
                    : `฿${remaining.toFixed(0)} remaining`}
                </p>
              </div>
            )
          })
        )}
      </CardContent>
      <div className="px-6 pb-4">
        <Link href="/budget" className="text-xs text-primary hover:underline underline-offset-4">
          View all budgets →
        </Link>
      </div>
    </Card>
  )
}
