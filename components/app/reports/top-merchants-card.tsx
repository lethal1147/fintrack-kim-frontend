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
    <div className="border-border bg-card rounded-xl border p-5">
      <p className="mb-4 text-sm font-semibold">{t("title")}</p>
      {merchants.length === 0 ? (
        <p className="text-muted-foreground text-sm">{t("emptyMessage")}</p>
      ) : (
        <div className="space-y-3">
          {merchants.map((m) => {
            const pct = expenseTotal > 0 ? Math.round((m.total / expenseTotal) * 100) : 0
            return (
              <div key={m.merchant}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="max-w-[60%] truncate text-sm font-medium">{m.merchant}</span>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-muted-foreground text-xs tabular-nums">
                      {t("txnCount", { count: m.count })}
                    </span>
                    <span className="text-sm font-semibold tabular-nums">
                      {stringUtil.formatMoney(m.total)}
                    </span>
                  </div>
                </div>
                <div className="bg-muted h-1.5 overflow-hidden rounded-full">
                  <div
                    className="bg-primary/70 h-full rounded-full transition-all"
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
