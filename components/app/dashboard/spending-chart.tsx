"use client"

"use client"

import { useTranslations } from "next-intl"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { spendingData } from "@/lib/mock-data"

export function SpendingChart() {
  const t = useTranslations("dashboard.spendingChart")

  const chartConfig = {
    thisMonth: {
      label: t("legendThisMonth"),
      color: "var(--chart-1)",
    },
    lastMonth: {
      label: t("legendLastMonth"),
      color: "var(--chart-3)",
    },
  } satisfies ChartConfig

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{t("title")}</CardTitle>
        <CardDescription>Cumulative spend — March 2026</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <ChartContainer config={chartConfig} className="h-55 w-full">
          <AreaChart data={spendingData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="thisMonthGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="var(--chart-1)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="lastMonthGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="var(--chart-3)" stopOpacity={0.15} />
                <stop offset="95%" stopColor="var(--chart-3)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              interval={2}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              tickFormatter={(v) => `$${v}`}
              width={48}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              dataKey="lastMonth"
              type="monotone"
              stroke="var(--chart-3)"
              strokeWidth={1.5}
              fill="url(#lastMonthGrad)"
              strokeDasharray="4 2"
            />
            <Area
              dataKey="thisMonth"
              type="monotone"
              stroke="var(--chart-1)"
              strokeWidth={2}
              fill="url(#thisMonthGrad)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
