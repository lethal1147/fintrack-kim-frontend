"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { budgetCategories } from "@/lib/mock-data"
import { stringUtil } from "@/lib/string-util"

export function BudgetOverview() {
  const t = useTranslations("budget")

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{t("title")}</CardTitle>
        <CardDescription>March 2026</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        {budgetCategories.map((cat) => {
          const pct = Math.min(Math.round((cat.spent / cat.budgeted) * 100), 100)
          const over = cat.spent > cat.budgeted
          return (
            <div key={cat.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{cat.name}</span>
                <span className={cn("text-xs tabular-nums", over ? "text-destructive font-medium" : "text-muted-foreground")}>
                  {stringUtil.formatMoney(cat.spent)} / {stringUtil.formatMoney(cat.budgeted)}
                </span>
              </div>
              <Progress
                value={pct}
                className={cn("h-1.5", over && "[&>div]:bg-destructive")}
              />
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
