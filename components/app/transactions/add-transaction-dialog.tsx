"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
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
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from "@/lib/categories"
import { cn } from "@/lib/utils"
import { useCategoryLabel } from "@/lib/category-util"

type Props = {
  open: boolean
  onClose: () => void
  onAdd: (tx: { merchant: string; category: string; note: string; date: string; amount: number; type: "income" | "expense" }) => Promise<void>
}

export function AddTransactionDialog({ open, onClose, onAdd }: Props) {
  const t = useTranslations("transactions.addDialog")
  const getCategoryLabel = useCategoryLabel()
  const [type, setType] = useState<"income" | "expense">("expense")
  const [merchant, setMerchant] = useState("")
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [category, setCategory] = useState("")
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!merchant || !amount || !category) return

    setIsSubmitting(true)
    try {
      await onAdd({
        merchant,
        category,
        note: notes,
        date,
        amount: parseFloat(amount),
        type,
      })
      setMerchant("")
      setAmount("")
      setCategory("")
      setNotes("")
      setType("expense")
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-1">
          {/* Type toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-lg">
            {(["expense", "income"] as const).map((kind) => (
              <button
                key={kind}
                type="button"
                onClick={() => { setType(kind); setCategory("") }}
                className={cn(
                  "py-1.5 rounded-md text-sm font-medium transition-colors capitalize",
                  type === kind
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {kind === "expense" ? t("typeExpense") : t("typeIncome")}
              </button>
            ))}
          </div>

          {/* Merchant */}
          <div className="space-y-1.5">
            <Label htmlFor="merchant">
              {type === "income" ? t("sourceLabel") : t("merchantLabel")}
            </Label>
            <Input
              id="merchant"
              placeholder={type === "income" ? t("sourcePlaceholder") : t("merchantPlaceholder")}
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              required
            />
          </div>

          {/* Amount + Date side by side */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="amount">{t("amountLabel")}</Label>
              <Input
                id="amount"
                type="number"
                min="0.01"
                step="0.01"
                placeholder={t("amountPlaceholder")}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="date">{t("dateLabel")}</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label>{t("categoryLabel")}</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger>
                <SelectValue placeholder={t("categoryPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {(type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map((c) => (
                  <SelectItem key={c} value={c}>{getCategoryLabel(c)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="notes">{t("notesLabel")} <span className="text-muted-foreground">{t("notesOptional")}</span></Label>
            <Input
              id="notes"
              placeholder={t("notesPlaceholder")}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <DialogFooter className="gap-2 pt-1">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              {t("cancelButton")}
            </Button>
            <Button
              type="submit"
              disabled={!merchant || !amount || !category || isSubmitting}
            >
              {isSubmitting ? t("addingButton") : t("addButton")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
