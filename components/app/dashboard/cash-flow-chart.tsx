"use client"

import dayjs from "dayjs"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { useTranslations } from "next-intl"
import { type MonthStat } from "@/lib/api-client"

function formatMonthLabel(yyyyMM: string): string {
  return dayjs(yyyyMM + "-01").format("MMM")
}

// ─── component ────────────────────────────────────────────────────────────────

type Props = { data: MonthStat[] }

export function CashFlowChart({ data }: Props) {
  const t = useTranslations("dashboard.cashFlowChart")

  const CHART_CONFIG = {
    income:  { label: t("legendIncome"),   color: "var(--chart-2)" },
    expense: { label: t("legendExpenses"), color: "var(--chart-5)" },
  } satisfies ChartConfig

  const chartData = data.map((m) => ({ ...m, month: formatMonthLabel(m.month) }))

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{t("title")}</CardTitle>
        <CardDescription>{t("subtitle")}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <ChartContainer config={CHART_CONFIG} className="h-55 w-full">
          <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }} barGap={4}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              tickFormatter={(v: number) => `฿${(v / 1000).toFixed(0)}k`}
              width={44}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="income"  fill="var(--chart-2)" radius={[3, 3, 0, 0]} maxBarSize={36} />
            <Bar dataKey="expense" fill="var(--chart-5)" radius={[3, 3, 0, 0]} maxBarSize={36} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
