"use client"

import { Line, LineChart, ResponsiveContainer } from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// ─── types ────────────────────────────────────────────────────────────────────

type StatCardProps = {
  title: string
  value: string
  delta?: number
  deltaLabel?: string
  icon: React.ComponentType<{ className?: string }>
  sparkData?: number[]
  sparkColor?: string
}

// ─── component ────────────────────────────────────────────────────────────────

export function StatCard({
  title,
  value,
  delta,
  deltaLabel,
  icon: Icon,
  sparkData,
  sparkColor = "var(--chart-1)",
}: StatCardProps) {
  const positive = delta !== undefined && delta >= 0

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1 space-y-3">
            <p className="text-muted-foreground text-sm">{title}</p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            {delta !== undefined && (
              <p
                className={cn(
                  "text-xs font-medium",
                  positive ? "text-emerald-600" : "text-destructive"
                )}
              >
                {positive ? "+" : ""}
                {delta}% <span className="text-muted-foreground font-normal">{deltaLabel}</span>
              </p>
            )}
          </div>
          <div className="bg-primary/10 text-primary ml-3 flex size-9 shrink-0 items-center justify-center rounded-lg">
            <Icon className="size-4.5" />
          </div>
        </div>

        {/* Spark chart — line only, no fill */}
        {sparkData && sparkData.length > 1 && (
          <div className="mt-3 h-10 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={sparkData.map((v, i) => ({ v, i }))}
                margin={{ top: 2, right: 0, bottom: 2, left: 0 }}
              >
                <Line
                  dataKey="v"
                  type="monotone"
                  stroke={sparkColor}
                  strokeWidth={1.5}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
