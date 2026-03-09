import { type LucideIcon } from "lucide-react"
import { type Icon as TablerIcon } from "@tabler/icons-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type StatCardProps = {
  title: string
  value: string
  delta?: number
  deltaLabel?: string
  icon: React.ComponentType<{ className?: string }>
}

export function StatCard({ title, value, delta, deltaLabel, icon: Icon }: StatCardProps) {
  const positive = delta !== undefined && delta >= 0

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            {delta !== undefined && (
              <p className={cn("text-xs font-medium", positive ? "text-emerald-600" : "text-destructive")}>
                {positive ? "+" : ""}{delta}%{" "}
                <span className="text-muted-foreground font-normal">{deltaLabel}</span>
              </p>
            )}
          </div>
          <div className="flex items-center justify-center size-9 rounded-lg bg-primary/10 text-primary shrink-0">
            <Icon className="size-4.5" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
