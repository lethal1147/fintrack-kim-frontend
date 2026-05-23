"use client"

import { Pie, PieChart, Cell } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { type CategoryStatWithPct } from "@/lib/api-client"
import { stringUtil } from "@/lib/string-util"

// ─── constants ────────────────────────────────────────────────────────────────

const CHART_COLORS = [
  "var(--chart-1)", "var(--chart-2)", "var(--chart-3)",
  "var(--chart-4)", "var(--chart-5)",
]

const SKELETON_ROWS = 4

// ─── component ────────────────────────────────────────────────────────────────

type Props = { data: CategoryStatWithPct[] }

export function CategoryDonut({ data }: Props) {
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
        <CardTitle className="text-base">Spending by Category</CardTitle>
        <CardDescription>Expense breakdown this month</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        {chartData.length === 0 ? (
          <div className="space-y-3">
            {Array.from({ length: SKELETON_ROWS }).map((_, i) => (
              <div key={i} className="h-5 rounded bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center gap-6">
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
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-base font-bold tabular-nums leading-tight">
                  {stringUtil.formatMoney(totalExpense)}
                </p>
              </div>
            </div>

            {/* Legend */}
            <ul className="flex-1 space-y-2 min-w-0">
              {chartData.map((c) => (
                <li key={c.category} className="flex items-center justify-between gap-2 text-sm">
                  <span className="flex items-center gap-2 min-w-0">
                    <span
                      className="size-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: c.color }}
                    />
                    <span className="truncate text-muted-foreground">{c.category}</span>
                  </span>
                  <span className="tabular-nums shrink-0 font-medium">
                    {stringUtil.formatMoney(c.total)}
                    <span className="text-xs text-muted-foreground font-normal ml-1">
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
