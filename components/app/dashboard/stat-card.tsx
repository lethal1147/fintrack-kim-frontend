"use client"

import { Area, AreaChart, ResponsiveContainer } from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// ─── types ────────────────────────────────────────────────────────────────────

type StatCardProps = {
  title:       string
  value:       string
  delta?:      number
  deltaLabel?: string
  icon:        React.ComponentType<{ className?: string }>
  sparkData?:  number[]
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
          <div className="space-y-3 flex-1 min-w-0">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            {delta !== undefined && (
              <p className={cn("text-xs font-medium", positive ? "text-emerald-600" : "text-destructive")}>
                {positive ? "+" : ""}{delta}%{" "}
                <span className="text-muted-foreground font-normal">{deltaLabel}</span>
              </p>
            )}
          </div>
          <div className="flex items-center justify-center size-9 rounded-lg bg-primary/10 text-primary shrink-0 ml-3">
            <Icon className="size-4.5" />
          </div>
        </div>

        {/* Spark chart */}
        {sparkData && sparkData.length > 1 && (
          <div className="mt-3 h-10 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparkData.map((v, i) => ({ v, i }))} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id={`spark-${title}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor={sparkColor} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={sparkColor} stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <Area
                  dataKey="v"
                  type="monotone"
                  stroke={sparkColor}
                  strokeWidth={1.5}
                  fill={`url(#spark-${title})`}
                  dot={false}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
