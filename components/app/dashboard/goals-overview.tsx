"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { goals } from "@/lib/mock-data"
import { stringUtil } from "@/lib/string-util"

export function GoalsOverview() {
  const t = useTranslations("dashboard.goalsOverview")

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{t("title")}</CardTitle>
        <CardDescription>{t("subtitle")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 pt-0">
        {goals.map((goal) => {
          const pct = Math.round((goal.current / goal.target) * 100)
          return (
            <div key={goal.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5 font-medium">
                  <span>{goal.emoji}</span>
                  {goal.name}
                </span>
                <span className="text-xs text-muted-foreground tabular-nums">{pct}%</span>
              </div>
              <Progress value={pct} className="h-1.5" />
              <p className="text-xs text-muted-foreground tabular-nums">
                {stringUtil.formatMoney(goal.current)} {t("of")} {stringUtil.formatMoney(goal.target)}
              </p>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
