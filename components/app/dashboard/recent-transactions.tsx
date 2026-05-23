import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { recentTransactions } from "@/lib/mock-data"
import { stringUtil } from "@/lib/string-util"

const categoryColors: Record<string, string> = {
  Income:        "bg-emerald-500",
  Entertainment: "bg-violet-500",
  Food:          "bg-orange-500",
  Transport:     "bg-blue-500",
  Health:        "bg-pink-500",
}

export function RecentTransactions() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">Recent Transactions</CardTitle>
            <CardDescription>Last 5 entries</CardDescription>
          </div>
          <Link href="/transactions" className="text-xs text-primary hover:underline underline-offset-4">
            View all →
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-1 pt-0">
        {recentTransactions.map((tx) => (
          <div
            key={tx.id}
            className="flex items-center gap-3 px-1 py-2.5 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className={cn("size-2 rounded-full shrink-0", categoryColors[tx.category] ?? "bg-muted-foreground")} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{tx.merchant}</p>
              <p className="text-xs text-muted-foreground">{tx.category} · {tx.date}</p>
            </div>
            <p className={cn("text-sm font-semibold tabular-nums shrink-0", tx.type === "income" ? "text-emerald-600" : "text-foreground")}>
              {tx.type === "income" ? "+" : "-"}{stringUtil.formatMoneyFull(tx.amount)}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
