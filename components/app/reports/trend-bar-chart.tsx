"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useTranslations } from "next-intl"
import { stringUtil } from "@/lib/string-util"

// ─── types ────────────────────────────────────────────────────────────────────

type TrendEntry = { month: string; income: number; expense: number }

type Props = {
  data: TrendEntry[]
}

// ─── custom tooltip ───────────────────────────────────────────────────────────

function BarTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { name: string; value: number; fill: string }[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="border-border bg-card space-y-1 rounded-lg border px-3 py-2 text-sm shadow-md">
      <p className="text-muted-foreground text-xs font-medium">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="size-2 shrink-0 rounded-full" style={{ background: p.fill }} />
          <span className="text-muted-foreground capitalize">{p.name}:</span>
          <span className="font-semibold">{stringUtil.formatMoney(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

// ─── component ────────────────────────────────────────────────────────────────

export function TrendBarChart({ data }: Props) {
  const t = useTranslations("reports.trendChart")

  return (
    <div className="border-border bg-card rounded-xl border p-5">
      <p className="mb-4 text-sm font-semibold">{t("title")}</p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }} barGap={4}>
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
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            width={36}
          />
          <Tooltip content={<BarTooltip />} cursor={{ fill: "var(--muted)", opacity: 0.5 }} />
          <Bar
            dataKey="income"
            name={t("legendIncome")}
            fill="#10b981"
            radius={[4, 4, 0, 0]}
            maxBarSize={32}
          />
          <Bar
            dataKey="expense"
            name={t("legendExpense")}
            fill="var(--chart-1)"
            radius={[4, 4, 0, 0]}
            maxBarSize={32}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="mt-3 flex items-center justify-center gap-4">
        <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
          <span className="size-2.5 rounded-full bg-emerald-500" />
          {t("legendIncome")}
        </div>
        <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
          <span className="size-2.5 rounded-full" style={{ background: "var(--chart-1)" }} />
          {t("legendExpense")}
        </div>
      </div>
    </div>
  )
}
