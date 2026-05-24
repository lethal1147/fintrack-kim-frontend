"use client"

import { Pie, PieChart, Cell } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { useTranslations } from "next-intl"
import { type CategoryStatWithPct } from "@/lib/api-client"
import { stringUtil } from "@/lib/string-util"
import { useCategoryLabel } from "@/lib/category-util"

// ─── constants ────────────────────────────────────────────────────────────────

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

const SKELETON_ROWS = 4

// ─── component ────────────────────────────────────────────────────────────────

type Props = { data: CategoryStatWithPct[] }

export function CategoryDonut({ data }: Props) {
  const t = useTranslations("dashboard.categoryDonut")
  const getCategoryLabel = useCategoryLabel()
  const chartData = data
    .filter((s) => s.type === "expense")
    .map((s, i) => ({ ...s, color: CHART_COLORS[i % CHART_COLORS.length] }))

  const totalExpense = chartData.reduce((s, c) => s + c.total, 0)

  const chartConfig = chartData.reduce<ChartConfig>((acc, c) => {
    acc[c.category] = { label: c.category, color: c.color }
    return acc
  }, {})

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{t("title")}</CardTitle>
        <CardDescription>{t("subtitle")}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        {chartData.length === 0 ? (
          <div className="space-y-3">
            {Array.from({ length: SKELETON_ROWS }).map((_, i) => (
              <div key={i} className="bg-muted h-5 animate-pulse rounded" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            {/* Donut */}
            <div className="relative shrink-0">
              <ChartContainer config={chartConfig} className="size-45">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Pie
                    data={chartData}
                    dataKey="total"
                    nameKey="category"
                    innerRadius={55}
                    outerRadius={85}
                    strokeWidth={2}
                  >
                    {chartData.map((entry) => (
                      <Cell key={entry.category} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
              {/* Center label */}
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-muted-foreground text-xs">{t("centerLabel")}</p>
                <p className="text-base leading-tight font-bold tabular-nums">
                  {stringUtil.formatMoney(totalExpense)}
                </p>
              </div>
            </div>

            {/* Legend */}
            <ul className="min-w-0 flex-1 space-y-2">
              {chartData.map((c) => (
                <li key={c.category} className="flex items-center justify-between gap-2 text-sm">
                  <span className="flex min-w-0 items-center gap-2">
                    <span
                      className="size-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: c.color }}
                    />
                    <span className="text-muted-foreground truncate">
                      {getCategoryLabel(c.category)}
                    </span>
                  </span>
                  <span className="shrink-0 font-medium tabular-nums">
                    {stringUtil.formatMoney(c.total)}
                    <span className="text-muted-foreground ml-1 text-xs font-normal">
                      {c.pct.toFixed(2)}%
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
