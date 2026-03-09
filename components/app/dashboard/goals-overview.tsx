import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { goals } from "@/lib/mock-data"

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n)
}

export function GoalsOverview() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Goals</CardTitle>
        <CardDescription>Your savings targets</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 pt-0">
        {goals.map((goal) => {
          const pct = Math.round((goal.current / goal.target) * 100)
          return (
            <div key={goal.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5 font-medium">
                  <span>{goal.emoji}</span>
                  {goal.name}
                </span>
                <span className="text-xs text-muted-foreground tabular-nums">{pct}%</span>
              </div>
              <Progress value={pct} className="h-1.5" />
              <p className="text-xs text-muted-foreground tabular-nums">
                {formatCurrency(goal.current)} of {formatCurrency(goal.target)}
              </p>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
