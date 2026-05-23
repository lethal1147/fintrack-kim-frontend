"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { useTranslations } from "next-intl"
import { type Goal } from "@/lib/mock-data"

const COLOR_OPTIONS = [
  "#0ea5e9", "#8b5cf6", "#f97316", "#10b981",
  "#ec4899", "#f59e0b", "#3b82f6", "#14b8a6",
]

const EMOJI_PRESETS = ["🏠", "✈️", "🎓", "🚗", "💍", "💻", "🛡️", "🎯", "📱", "🎸"]

type Props = {
  open: boolean
  onClose: () => void
  onAdd: (goal: Goal) => void
}

export function AddGoalDialog({ open, onClose, onAdd }: Props) {
  const t = useTranslations("goals.addDialog")
  const [name, setName]                   = useState("")
  const [emoji, setEmoji]                 = useState("🎯")
  const [target, setTarget]               = useState("")
  const [current, setCurrent]             = useState("")
  const [targetDate, setTargetDate]       = useState("")
  const [monthly, setMonthly]             = useState("")
  const [color, setColor]                 = useState(COLOR_OPTIONS[0])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !target || !targetDate) return

    onAdd({
      id:                  Date.now().toString(),
      name,
      emoji,
      target:              parseFloat(target),
      current:             parseFloat(current || "0"),
      targetDate:          targetDate + "-01",
      monthlyContribution: parseFloat(monthly || "0"),
      color,
    })

    setName(""); setEmoji("🎯"); setTarget(""); setCurrent("")
    setTargetDate(""); setMonthly(""); setColor(COLOR_OPTIONS[0])
    onClose()
  }

  const valid = name.trim() !== "" && target !== "" && targetDate !== ""

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">

          {/* Emoji presets */}
          <div className="space-y-1.5">
            <Label>{t("iconLabel")}</Label>
            <div className="flex gap-1.5 flex-wrap">
              {EMOJI_PRESETS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={`size-9 text-xl rounded-lg border-2 transition-colors flex items-center justify-center
                    ${emoji === e ? "border-primary bg-primary/5" : "border-border hover:bg-muted"}`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="goal-name">{t("goalNameLabel")}</Label>
            <Input
              id="goal-name"
              placeholder={t("goalNamePlaceholder")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Target + Current */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="goal-target">{t("targetAmountLabel")}</Label>
              <Input
                id="goal-target"
                type="number" min="1" step="1" placeholder="0"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="goal-current">
                {t("alreadySavedLabel")} <span className="text-muted-foreground">{t("alreadySavedOptional")}</span>
              </Label>
              <Input
                id="goal-current"
                type="number" min="0" step="1" placeholder="0"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
              />
            </div>
          </div>

          {/* Target date + Monthly */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="goal-date">{t("targetDateLabel")}</Label>
              <Input
                id="goal-date"
                type="month"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="goal-monthly">
                {t("monthlyContributionLabel")} <span className="text-muted-foreground">{t("monthlyContributionOptional")}</span>
              </Label>
              <Input
                id="goal-monthly"
                type="number" min="0" step="1" placeholder="0"
                value={monthly}
                onChange={(e) => setMonthly(e.target.value)}
              />
            </div>
          </div>

          {/* Color */}
          <div className="space-y-1.5">
            <Label>{t("colourLabel")}</Label>
            <div className="flex gap-2">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`size-7 rounded-full border-2 transition-transform
                    ${color === c ? "border-foreground scale-110" : "border-transparent"}`}
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>

          <DialogFooter className="gap-2 pt-1">
            <Button type="button" variant="outline" onClick={onClose}>{t("cancelButton")}</Button>
            <Button type="submit" disabled={!valid}>{t("createButton")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
