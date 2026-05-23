"use client"

import { useState, useEffect } from "react"
import dayjs from "dayjs"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTranslations } from "next-intl"
import { type RecurringItem, type RecurringFrequency, type RecurringKind, type UpdateRecurringBody } from "@/lib/api-client"
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from "@/lib/categories"
import { cn } from "@/lib/utils"
import { useCategoryLabel } from "@/lib/category-util"

// ─── constants ────────────────────────────────────────────────────────────────

const COLOR_OPTIONS = [
  "#0ea5e9", "#ef4444", "#22c55e", "#f97316",
  "#8b5cf6", "#10b981", "#f59e0b", "#ec4899",
]

// ─── helpers ─────────────────────────────────────────────────────────────────

function firstOfNextMonth() {
  return dayjs().add(1, "month").date(1).format("YYYY-MM-DD")
}

function endOfNextMonth() {
  return dayjs().add(1, "month").endOf("month").format("YYYY-MM-DD")
}

// ─── component ────────────────────────────────────────────────────────────────

type Props = {
  open: boolean
  item: RecurringItem | null
  onClose: () => void
  onEdit: (id: string, body: UpdateRecurringBody) => void
}

export function EditRecurringDialog({ open, item, onClose, onEdit }: Props) {
  const t = useTranslations("recurring.editDialog")
  const getCategoryLabel = useCategoryLabel()
  const [kind, setKind]           = useState<RecurringKind>("expense")
  const [name, setName]           = useState("")
  const [category, setCategory]   = useState("")
  const [amount, setAmount]       = useState("")
  const [frequency, setFrequency] = useState<RecurringFrequency | "">("")
  const [nextDue, setNextDue]     = useState("")
  const [color, setColor]         = useState(COLOR_OPTIONS[0])

  useEffect(() => {
    if (item) {
      setKind(item.kind)
      setName(item.name)
      setCategory(item.category)
      setAmount(String(item.amount))
      setFrequency(item.frequency)
      setNextDue(item.next_due)
      setColor(item.color)
    }
  }, [item])

  const categories = kind === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
  const showMonthHelper = frequency === "monthly" || frequency === "annual"

  function handleKindChange(k: RecurringKind) {
    setKind(k)
    setCategory("")
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!item || !name || !category || !amount || !frequency || !nextDue) return
    onEdit(item.id, { name, category, amount: parseFloat(amount), frequency: frequency as RecurringFrequency, next_due: nextDue, kind, color })
    onClose()
  }

  const valid = name && category && amount && frequency && nextDue

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">

          {/* Kind toggle */}
          <div className="flex rounded-lg border border-border overflow-hidden text-sm">
            {(["expense", "income"] as RecurringKind[]).map((k) => (
              <button key={k} type="button" onClick={() => handleKindChange(k)}
                className={cn("flex-1 py-1.5 capitalize transition-colors",
                  kind === k ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-muted"
                )}>{k === "expense" ? t("kindExpense") : t("kindIncome")}</button>
            ))}
          </div>

          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-rec-name">{t("nameLabel")}</Label>
            <Input id="edit-rec-name" placeholder={t("namePlaceholder")}
              value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label>{t("categoryLabel")}</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue placeholder={t("categoryPlaceholder")} /></SelectTrigger>
              <SelectContent>
                {categories.map((c) => <SelectItem key={c} value={c}>{getCategoryLabel(c)}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Amount + Frequency */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="edit-rec-amount">{t("amountLabel")}</Label>
              <Input id="edit-rec-amount" type="number" min="0.01" step="0.01" placeholder={t("amountPlaceholder")}
                value={amount} onChange={(e) => setAmount(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label>{t("frequencyLabel")}</Label>
              <Select value={frequency} onValueChange={(v) => setFrequency(v as RecurringFrequency)}>
                <SelectTrigger><SelectValue placeholder={t("frequencyPlaceholder")} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">{t("freqWeekly")}</SelectItem>
                  <SelectItem value="monthly">{t("freqMonthly")}</SelectItem>
                  <SelectItem value="annual">{t("freqAnnual")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Next due date + month helpers */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-rec-due">{t("nextDueLabel")}</Label>
            {showMonthHelper && (
              <div className="flex gap-1.5 mb-1.5">
                <button type="button" onClick={() => setNextDue(firstOfNextMonth())}
                  className="text-xs px-2.5 py-1 rounded-md border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                  {t("helperFirstOfMonth")}
                </button>
                <button type="button" onClick={() => setNextDue(endOfNextMonth())}
                  className="text-xs px-2.5 py-1 rounded-md border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                  {t("helperEndOfMonth")}
                </button>
              </div>
            )}
            <Input id="edit-rec-due" type="date" value={nextDue}
              onChange={(e) => setNextDue(e.target.value)} required />
          </div>

          {/* Color */}
          <div className="space-y-1.5">
            <Label>{t("colourLabel")}</Label>
            <div className="flex gap-2">
              {COLOR_OPTIONS.map((c) => (
                <button key={c} type="button" onClick={() => setColor(c)}
                  className={cn("size-7 rounded-full border-2 transition-transform",
                    color === c ? "border-foreground scale-110" : "border-transparent"
                  )}
                  style={{ background: c }} />
              ))}
            </div>
          </div>

          <DialogFooter className="gap-2 pt-1">
            <Button type="button" variant="outline" onClick={onClose}>{t("cancelButton")}</Button>
            <Button type="submit" disabled={!valid}>{t("saveButton")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
