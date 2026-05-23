"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useTranslations } from "next-intl"
import { useRecurringStore } from "@/store/recurring-store"
import { stringUtil } from "@/lib/string-util"

// ─── constants ────────────────────────────────────────────────────────────────

const TOP_N = 4
const SKELETON_ROWS = 4

// ─── component ────────────────────────────────────────────────────────────────

export function RecurringSummary() {
  const t = useTranslations("dashboard.recurringSummary")
  const { items } = useRecurringStore()

  const activeMonthly = items
    .filter((r) => r.status === "active" && r.frequency === "monthly" && r.kind === "expense")
    .sort((a, b) => b.amount - a.amount)

  const monthlyTotal = activeMonthly.reduce((s, r) => s + r.amount, 0)
  const topItems = activeMonthly.slice(0, TOP_N)

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-baseline justify-between gap-2">
          <CardTitle className="text-base">{t("title")}</CardTitle>
          <span className="text-lg font-bold tabular-nums">
            {stringUtil.formatMoney(monthlyTotal)}
            <span className="text-xs font-normal text-muted-foreground">{t("perMonth")}</span>
          </span>
        </div>
        <CardDescription>{t("subtitle")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 pt-0 flex-1">
        {items.length === 0 ? (
          <div className="space-y-3">
            {Array.from({ length: SKELETON_ROWS }).map((_, i) => (
              <div key={i} className="h-5 rounded bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          topItems.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <span
                className="size-2.5 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="flex-1 text-sm truncate">{item.name}</span>
              <span className="text-sm tabular-nums font-medium shrink-0">
                {stringUtil.formatMoney(item.amount)}
                <span className="text-xs text-muted-foreground font-normal">/mo</span>
              </span>
            </div>
          ))
        )}
      </CardContent>
      <div className="px-6 pb-4">
        <Link href="/recurring" className="text-xs text-primary hover:underline underline-offset-4">
          {t("activeSubscriptions", { count: activeMonthly.length })}
        </Link>
      </div>
    </Card>
  )
}
