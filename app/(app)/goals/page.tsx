"use client"

import { useState } from "react"
import { IconPlus } from "@tabler/icons-react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { type Goal } from "@/lib/mock-data"
import { AddGoalDialog } from "@/components/app/goals/add-goal-dialog"
import { GoalCard } from "@/components/app/goals/goal-card"
import { AddFundsDialog } from "@/components/app/goals/add-funds-dialog"
import { useGoalsStore } from "@/store/goals-store"
import { stringUtil } from "@/lib/string-util"
import { cn } from "@/lib/utils"

// ─── page ─────────────────────────────────────────────────────────────────────

export default function GoalsPage() {
  const t = useTranslations("goals")
  const { goals, addGoal, addFunds } = useGoalsStore()

  // UI-only state
  const [addOpen, setAddOpen]     = useState(false)
  const [fundsGoal, setFundsGoal] = useState<Goal | null>(null)

  const totalSaved  = goals.reduce((s, g) => s + g.current, 0)
  const totalTarget = goals.reduce((s, g) => s + g.target, 0)
  const completed   = goals.filter((g) => g.current >= g.target).length

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{t("subtitle")}</p>
        </div>
        <Button className="gap-1.5" onClick={() => setAddOpen(true)}>
          <IconPlus className="size-4" />
          {t("addButton")}
        </Button>
      </div>

      {/* ── Summary strip ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: t("statTotalSaved"),   value: stringUtil.formatMoney(totalSaved),   color: "text-foreground" },
          { label: t("statTotalTarget"),  value: stringUtil.formatMoney(totalTarget),  color: "text-foreground" },
          { label: t("statGoalsReached"), value: `${completed} / ${goals.length}`,     color: "text-emerald-600" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card px-4 py-3">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className={cn("text-lg font-bold tabular-nums mt-0.5", s.color)}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Goals grid ── */}
      {goals.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-16 text-center">
          <p className="text-muted-foreground text-sm">{t("emptyMessage")}</p>
          <Button className="mt-4 gap-1.5" onClick={() => setAddOpen(true)}>
            <IconPlus className="size-4" /> {t("emptyAddButton")}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onAddFunds={(g) => setFundsGoal(g)}
            />
          ))}
        </div>
      )}

      {/* ── Dialogs ── */}
      <AddGoalDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={addGoal}
      />

      {fundsGoal && (
        <AddFundsDialog
          goal={fundsGoal}
          onClose={() => setFundsGoal(null)}
          onAdd={(amount) => { addFunds(fundsGoal.id, amount); setFundsGoal(null) }}
        />
      )}
    </div>
  )
}
