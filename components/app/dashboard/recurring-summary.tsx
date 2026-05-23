import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { recurringItems } from "@/lib/mock-data"
import { stringUtil } from "@/lib/string-util"

// ─── constants ────────────────────────────────────────────────────────────────

const ACTIVE_MONTHLY = recurringItems
  .filter((r) => r.status === "active" && r.frequency === "monthly" && r.kind === "expense")
  .sort((a, b) => b.amount - a.amount)

const MONTHLY_TOTAL = ACTIVE_MONTHLY.reduce((s, r) => s + r.amount, 0)

const TOP_ITEMS = ACTIVE_MONTHLY.slice(0, 4)

// ─── component ────────────────────────────────────────────────────────────────

export function RecurringSummary() {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-baseline justify-between gap-2">
          <CardTitle className="text-base">Recurring</CardTitle>
          <span className="text-lg font-bold tabular-nums">
            {stringUtil.formatMoney(MONTHLY_TOTAL)}
            <span className="text-xs font-normal text-muted-foreground">/mo</span>
          </span>
        </div>
        <CardDescription>Monthly committed expenses</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 pt-0 flex-1">
        {TOP_ITEMS.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <span
              className="size-2.5 rounded-full shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="flex-1 text-sm truncate">{item.name}</span>
            <span className="text-sm tabular-nums font-medium shrink-0">
              {stringUtil.formatMoney(item.amount)}
              <span className="text-xs text-muted-foreground font-normal">/mo</span>
            </span>
          </div>
        ))}
      </CardContent>
      <div className="px-6 pb-4">
        <Link href="/recurring" className="text-xs text-primary hover:underline underline-offset-4">
          {ACTIVE_MONTHLY.length} active subscriptions · View all →
        </Link>
      </div>
    </Card>
  )
}
