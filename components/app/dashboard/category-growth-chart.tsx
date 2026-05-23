"use client"

import { Bar, BarChart, CartesianGrid, Cell, ReferenceLine, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { type CategoryStatWithPct } from "@/lib/api-client"

// ─── types ────────────────────────────────────────────────────────────────────

type CategoryGrowth = {
  category:  string
  current:   number
  previous:  number
  pctChange: number
  isNew:     boolean
}

// ─── constants ────────────────────────────────────────────────────────────────

const MAX_CATEGORIES = 8
const SKELETON_ROWS  = 5

const CHART_CONFIG = {
  pctChange: { label: "Change" },
} satisfies ChartConfig

// ─── helpers ──────────────────────────────────────────────────────────────────

function computeGrowth(
  current:  CategoryStatWithPct[],
  previous: CategoryStatWithPct[],
): CategoryGrowth[] {
  const prevMap = new Map(
    previous.filter((s) => s.type === "expense").map((s) => [s.category, s.total]),
  )

  return current
    .filter((s) => s.type === "expense")
    .map((s) => {
      const prev = prevMap.get(s.category) ?? 0
      const isNew = prev === 0
      const pctChange = isNew
        ? 100
        : Math.round(((s.total - prev) / prev) * 1000) / 10
      return { category: s.category, current: s.total, previous: prev, pctChange, isNew }
    })
    .sort((a, b) => b.pctChange - a.pctChange)
    .slice(0, MAX_CATEGORIES)
}

function tickFormatter(v: number): string {
  return `${v > 0 ? "+" : ""}${v}%`
}

function tooltipFormatter(
  value: number | string | (number | string)[],
  _: number | string,
  entry: { payload?: CategoryGrowth },
) {
  const v = typeof value === "number" ? value : Number(value)
  const isNew = entry.payload?.isNew
  const label = isNew ? `+${v}% (new this month)` : tickFormatter(v)
  return [label, "Change"] as [string, string]
}

// ─── component ────────────────────────────────────────────────────────────────

type Props = {
  current:  CategoryStatWithPct[]
  previous: CategoryStatWithPct[]
}

export function CategoryGrowthChart({ current, previous }: Props) {
  if (current.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Category Growth</CardTitle>
          <CardDescription>Spending change vs previous month</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {Array.from({ length: SKELETON_ROWS }).map((_, i) => (
              <div key={i} className="h-6 rounded bg-muted animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const data = computeGrowth(current, previous)

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Category Growth</CardTitle>
          <CardDescription>Spending change vs previous month</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground">No expense data for comparison</p>
        </CardContent>
      </Card>
    )
  }

  const chartHeight = data.length * 36 + 16

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Category Growth</CardTitle>
        <CardDescription>Spending change vs previous month</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <ChartContainer config={CHART_CONFIG} style={{ height: chartHeight }} className="w-full">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 48, bottom: 0, left: 0 }}
            barSize={18}
          >
            <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              type="number"
              domain={["auto", "auto"]}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              tickFormatter={tickFormatter}
            />
            <YAxis
              type="category"
              dataKey="category"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: "var(--foreground)" }}
              width={100}
            />
            <ReferenceLine x={0} stroke="var(--border)" strokeWidth={1.5} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={tooltipFormatter}
                />
              }
            />
            <Bar dataKey="pctChange" radius={3}>
              {data.map((entry) => (
                <Cell
                  key={entry.category}
                  fill={entry.pctChange > 0 ? "var(--chart-5)" : "var(--chart-2)"}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
