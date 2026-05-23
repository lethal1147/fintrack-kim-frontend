"use client"

import { useTranslations } from "next-intl"
import { type MerchantStat } from "@/lib/api-client"
import { stringUtil } from "@/lib/string-util"

type Props = {
  merchants: MerchantStat[]
  expenseTotal: number
}

export function TopMerchantsCard({ merchants, expenseTotal }: Props) {
  const t = useTranslations("reports.topMerchants")

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="text-sm font-semibold mb-4">{t("title")}</p>
      {merchants.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("emptyMessage")}</p>
      ) : (
        <div className="space-y-3">
          {merchants.map((m) => {
            const pct = expenseTotal > 0 ? Math.round((m.total / expenseTotal) * 100) : 0
            return (
              <div key={m.merchant}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium truncate max-w-[60%]">{m.merchant}</span>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-muted-foreground tabular-nums">{t("txnCount", { count: m.count })}</span>
                    <span className="text-sm font-semibold tabular-nums">{stringUtil.formatMoney(m.total)}</span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary/70 transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
