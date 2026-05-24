"use client"

import { PieChart, Pie, Cell, Tooltip } from "recharts"
import { useTranslations } from "next-intl"
import { stringUtil } from "@/lib/string-util"

// ─── constants ────────────────────────────────────────────────────────────────

export const CATEGORY_COLORS: Record<string, string> = {
  Housing: "#0ea5e9",
  "Food & Dining": "#f97316",
  Transport: "#3b82f6",
  Entertainment: "#8b5cf6",
  Health: "#ec4899",
  Shopping: "#f59e0b",
  Utilities: "#64748b",
  Education: "#14b8a6",
  Other: "#9ca3af",
}

// ─── types ────────────────────────────────────────────────────────────────────

type DataItem = { name: string; value: number; color?: string }

type Props = {
  data: DataItem[]
  tab: "Spending" | "Income"
}

// ─── custom tooltip ───────────────────────────────────────────────────────────

function DonutTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: { name: string; value: number }[]
}) {
  if (!active || !payload?.length) return null
  const { name, value } = payload[0]
  return (
    <div className="border-border bg-card rounded-lg border px-3 py-2 text-sm shadow-md">
      <p className="font-medium">{name}</p>
      <p className="text-muted-foreground">{stringUtil.formatMoneyFull(value)}</p>
    </div>
  )
}

// ─── component ────────────────────────────────────────────────────────────────

export function SpendingDonut({ data, tab }: Props) {
  const t = useTranslations("reports.spendingDonut")
  const totalAmount = data.reduce((s, d) => s + d.value, 0)
  const largestItem = data[0]

  return (
    <div className="border-border bg-card rounded-xl border p-5">
      <div className="flex flex-wrap items-start gap-6">
        {/* Donut */}
        <div className="relative mx-auto shrink-0">
          <PieChart width={240} height={240}>
            <Pie
              data={data}
              cx={115}
              cy={115}
              innerRadius={72}
              outerRadius={108}
              paddingAngle={2}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={tab === "Spending" ? (CATEGORY_COLORS[entry.name] ?? "#9ca3af") : "#10b981"}
                />
              ))}
            </Pie>
            <Tooltip content={<DonutTooltip />} />
          </PieChart>

          {/* Center label */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-muted-foreground text-xs">
              {tab === "Spending" ? t("centerLabelSpent") : t("centerLabelIncome")}
            </p>
            <p className="text-lg font-bold tabular-nums">{stringUtil.formatMoney(totalAmount)}</p>
          </div>
        </div>

        {/* Legend */}
        <div className="min-w-48 flex-1 space-y-2">
          <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
            {tab === "Spending" ? t("legendByCategory") : t("legendBySource")}
          </p>
          {data.map((item) => {
            const pct = totalAmount === 0 ? 0 : Math.round((item.value / totalAmount) * 100)
            const color = tab === "Spending" ? (CATEGORY_COLORS[item.name] ?? "#9ca3af") : "#10b981"
            return (
              <div key={item.name} className="flex items-center gap-2.5">
                <span className="size-2.5 shrink-0 rounded-full" style={{ background: color }} />
                <span className="flex-1 truncate text-sm">{item.name}</span>
                <span className="text-muted-foreground w-8 text-right text-xs tabular-nums">
                  {pct}%
                </span>
                <span className="w-20 text-right text-sm font-semibold tabular-nums">
                  {stringUtil.formatMoney(item.value)}
                </span>
              </div>
            )
          })}
          {largestItem && (
            <div className="border-border mt-3 border-t pt-3">
              <p className="text-muted-foreground text-xs">
                {t("largest")}{" "}
                <span className="text-foreground font-medium">{largestItem.name}</span> —{" "}
                {stringUtil.formatMoneyFull(largestItem.value)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
