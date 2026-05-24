"use client"

import {
  IconPlus,
  IconTarget,
  IconCheck,
  IconAlertTriangle,
  IconPigMoney,
} from "@tabler/icons-react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { type Goal } from "@/lib/mock-data"
import { stringUtil } from "@/lib/string-util"
import { dateUtil } from "@/lib/date-util"

// ─── types ────────────────────────────────────────────────────────────────────

type GoalStatus = "completed" | "on-track" | "behind"

// ─── helpers ─────────────────────────────────────────────────────────────────

function getStatus(goal: Goal): GoalStatus {
  if (goal.current >= goal.target) return "completed"
  const months = dateUtil.monthsUntil(goal.targetDate)
  if (months === 0) return "behind"
  const projectedTotal = goal.current + goal.monthlyContribution * months
  return projectedTotal >= goal.target ? "on-track" : "behind"
}

// ─── component ────────────────────────────────────────────────────────────────

type Props = {
  goal: Goal
  onAddFunds: (goal: Goal) => void
}

export function GoalCard({ goal, onAddFunds }: Props) {
  const t = useTranslations("goals.card")
  const pct = Math.min(Math.round((goal.current / goal.target) * 100), 100)
  const months = dateUtil.monthsUntil(goal.targetDate)
  const status = getStatus(goal)
  const needed = goal.target - goal.current
  const neededPerMonth = months > 0 ? Math.ceil(needed / months) : needed

  return (
    <div className="border-border bg-card flex flex-col overflow-hidden rounded-xl border">
      {/* Coloured top band */}
      <div className="h-1.5 w-full" style={{ background: goal.color }} />

      <div className="flex flex-1 flex-col gap-4 p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div
              className="flex size-11 shrink-0 items-center justify-center rounded-xl text-xl"
              style={{ background: goal.color + "22" }}
            >
              {goal.emoji}
            </div>
            <div>
              <p className="text-sm leading-tight font-semibold">{goal.name}</p>
              <p className="text-muted-foreground mt-0.5 text-xs">
                {t("targetDate", { date: dateUtil.format(goal.targetDate, "MMM YYYY") })}
              </p>
            </div>
          </div>

          {/* Status badge */}
          {status === "completed" && (
            <Badge className="shrink-0 gap-1 border-emerald-500/20 bg-emerald-500/10 text-emerald-600">
              <IconCheck className="size-3" /> {t("statusDone")}
            </Badge>
          )}
          {status === "on-track" && (
            <Badge className="shrink-0 gap-1 border-sky-500/20 bg-sky-500/10 text-sky-600">
              <IconTarget className="size-3" /> {t("statusOnTrack")}
            </Badge>
          )}
          {status === "behind" && (
            <Badge className="shrink-0 gap-1 border-amber-500/20 bg-amber-500/10 text-amber-600">
              <IconAlertTriangle className="size-3" /> {t("statusBehind")}
            </Badge>
          )}
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-xl font-bold tabular-nums">
                {stringUtil.formatMoney(goal.current)}
              </span>
              <span className="text-muted-foreground text-sm">
                {" "}
                / {stringUtil.formatMoney(goal.target)}
              </span>
            </div>
            <span className="text-sm font-semibold tabular-nums" style={{ color: goal.color }}>
              {pct}%
            </span>
          </div>
          <div className="bg-muted h-2.5 overflow-hidden rounded-full">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${pct}%`, background: goal.color }}
            />
          </div>
        </div>

        {/* Meta row */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-muted/50 rounded-lg px-3 py-2">
            <p className="text-muted-foreground">{t("stillNeededLabel")}</p>
            <p className="mt-0.5 font-semibold tabular-nums">
              {status === "completed" ? "—" : stringUtil.formatMoney(needed)}
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg px-3 py-2">
            <p className="text-muted-foreground">
              {months > 0 ? t("monthsLeft", { months }) : t("overdueLabel")}
            </p>
            <p className="mt-0.5 font-semibold tabular-nums">
              {status === "completed"
                ? t("achieved")
                : months > 0
                  ? t("neededPerMonth", { amount: stringUtil.formatMoney(neededPerMonth) })
                  : "—"}
            </p>
          </div>
        </div>

        {/* Footer */}
        {status !== "completed" && (
          <Button
            size="sm"
            variant="outline"
            className="mt-auto w-full gap-1.5"
            onClick={() => onAddFunds(goal)}
          >
            <IconPigMoney className="size-3.5" />
            {t("addFundsButton")}
          </Button>
        )}
        {status === "completed" && (
          <div className="flex items-center justify-center gap-2 rounded-lg bg-emerald-500/10 py-1 text-sm font-medium text-emerald-600">
            <IconCheck className="size-4" />
            {t("goalAchieved")}
          </div>
        )}
      </div>
    </div>
  )
}
