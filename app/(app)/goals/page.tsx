"use client"

import { useState } from "react"
import { IconPlus, IconTarget, IconCheck, IconAlertTriangle, IconPigMoney } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { goals as initialGoals, type Goal } from "@/lib/mock-data"
import { AddGoalDialog } from "@/components/app/goals/add-goal-dialog"
import { cn } from "@/lib/utils"

// ─── helpers ─────────────────────────────────────────────────────────────────

const TODAY = new Date(2026, 2, 11) // March 11 2026 (matches mock data)

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n)
}

function monthsUntil(dateStr: string) {
  const target = new Date(dateStr)
  const diff =
    (target.getFullYear() - TODAY.getFullYear()) * 12 +
    (target.getMonth() - TODAY.getMonth())
  return Math.max(0, diff)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", year: "numeric" })
}

type GoalStatus = "completed" | "on-track" | "behind"

function getStatus(goal: Goal): GoalStatus {
  if (goal.current >= goal.target) return "completed"
  const months = monthsUntil(goal.targetDate)
  if (months === 0) return "behind"
  const projectedTotal = goal.current + goal.monthlyContribution * months
  return projectedTotal >= goal.target ? "on-track" : "behind"
}

// ─── Add Funds dialog ─────────────────────────────────────────────────────────

function AddFundsDialog({
  goal,
  onClose,
  onAdd,
}: {
  goal: Goal
  onClose: () => void
  onAdd: (amount: number) => void
}) {
  const [amount, setAmount] = useState("")
  const remaining = goal.target - goal.current

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Add funds — {goal.emoji} {goal.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-1">
          <div className="rounded-lg bg-muted/50 px-4 py-3 text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Saved so far</span>
              <span className="font-medium">{fmt(goal.current)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Still needed</span>
              <span className="font-medium">{fmt(remaining)}</span>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="funds-amount">Amount to add ($)</Label>
            <Input
              id="funds-amount"
              type="number"
              min="1"
              step="1"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              autoFocus
            />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            disabled={!amount || parseFloat(amount) <= 0}
            onClick={() => { onAdd(parseFloat(amount)); onClose() }}
          >
            Add funds
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Goal Card ────────────────────────────────────────────────────────────────

function GoalCard({
  goal,
  onAddFunds,
}: {
  goal: Goal
  onAddFunds: (goal: Goal) => void
}) {
  const pct     = Math.min(Math.round((goal.current / goal.target) * 100), 100)
  const months  = monthsUntil(goal.targetDate)
  const status  = getStatus(goal)
  const needed  = goal.target - goal.current
  const neededPerMonth = months > 0 ? Math.ceil(needed / months) : needed

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden flex flex-col">
      {/* Coloured top band */}
      <div className="h-1.5 w-full" style={{ background: goal.color }} />

      <div className="p-5 flex flex-col gap-4 flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div
              className="size-11 rounded-xl flex items-center justify-center text-xl shrink-0"
              style={{ background: goal.color + "22" }}
            >
              {goal.emoji}
            </div>
            <div>
              <p className="font-semibold text-sm leading-tight">{goal.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Target: {formatDate(goal.targetDate)}
              </p>
            </div>
          </div>

          {/* Status badge */}
          {status === "completed" && (
            <Badge className="gap-1 bg-emerald-500/10 text-emerald-600 border-emerald-500/20 shrink-0">
              <IconCheck className="size-3" /> Done
            </Badge>
          )}
          {status === "on-track" && (
            <Badge className="gap-1 bg-sky-500/10 text-sky-600 border-sky-500/20 shrink-0">
              <IconTarget className="size-3" /> On track
            </Badge>
          )}
          {status === "behind" && (
            <Badge className="gap-1 bg-amber-500/10 text-amber-600 border-amber-500/20 shrink-0">
              <IconAlertTriangle className="size-3" /> Behind
            </Badge>
          )}
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-xl font-bold tabular-nums">{fmt(goal.current)}</span>
              <span className="text-sm text-muted-foreground"> / {fmt(goal.target)}</span>
            </div>
            <span className="text-sm font-semibold tabular-nums" style={{ color: goal.color }}>
              {pct}%
            </span>
          </div>
          <div className="h-2.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${pct}%`, background: goal.color }}
            />
          </div>
        </div>

        {/* Meta row */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-lg bg-muted/50 px-3 py-2">
            <p className="text-muted-foreground">Still needed</p>
            <p className="font-semibold mt-0.5 tabular-nums">{status === "completed" ? "—" : fmt(needed)}</p>
          </div>
          <div className="rounded-lg bg-muted/50 px-3 py-2">
            <p className="text-muted-foreground">
              {months > 0 ? `${months} mo. left` : "Overdue"}
            </p>
            <p className="font-semibold mt-0.5 tabular-nums">
              {status === "completed" ? "Achieved!" : months > 0 ? `${fmt(neededPerMonth)}/mo needed` : "—"}
            </p>
          </div>
        </div>

        {/* Footer */}
        {status !== "completed" && (
          <Button
            size="sm"
            variant="outline"
            className="w-full gap-1.5 mt-auto"
            onClick={() => onAddFunds(goal)}
          >
            <IconPigMoney className="size-3.5" />
            Add funds
          </Button>
        )}
        {status === "completed" && (
          <div className="flex items-center justify-center gap-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 text-sm font-medium">
            <IconCheck className="size-4" />
            Goal achieved!
          </div>
        )}
      </div>
    </div>
  )
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function GoalsPage() {
  const [goals, setGoals]         = useState<Goal[]>(initialGoals)
  const [addOpen, setAddOpen]     = useState(false)
  const [fundsGoal, setFundsGoal] = useState<Goal | null>(null)

  function handleAddGoal(goal: Goal) {
    setGoals((prev) => [...prev, goal])
  }

  function handleAddFunds(goal: Goal, amount: number) {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === goal.id
          ? { ...g, current: Math.min(g.current + amount, g.target) }
          : g
      )
    )
  }

  const totalSaved  = goals.reduce((s, g) => s + g.current, 0)
  const totalTarget = goals.reduce((s, g) => s + g.target, 0)
  const completed   = goals.filter((g) => g.current >= g.target).length

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Goals</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Track your savings milestones</p>
        </div>
        <Button className="gap-1.5" onClick={() => setAddOpen(true)}>
          <IconPlus className="size-4" />
          New goal
        </Button>
      </div>

      {/* ── Summary strip ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Saved",   value: fmt(totalSaved),   color: "text-foreground" },
          { label: "Total Target",  value: fmt(totalTarget),  color: "text-foreground" },
          { label: "Goals Reached", value: `${completed} / ${goals.length}`, color: "text-emerald-600" },
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
          <p className="text-muted-foreground text-sm">No goals yet. Create your first one!</p>
          <Button className="mt-4 gap-1.5" onClick={() => setAddOpen(true)}>
            <IconPlus className="size-4" /> New goal
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
        onAdd={handleAddGoal}
      />

      {fundsGoal && (
        <AddFundsDialog
          goal={fundsGoal}
          onClose={() => setFundsGoal(null)}
          onAdd={(amount) => handleAddFunds(fundsGoal, amount)}
        />
      )}
    </div>
  )
}
