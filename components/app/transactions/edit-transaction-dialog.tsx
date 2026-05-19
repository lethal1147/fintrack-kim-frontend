"use client"

import { useState, useEffect } from "react"
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
import { type Transaction, type UpdateTransactionBody } from "@/lib/api-client"
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from "@/lib/categories"
import { cn } from "@/lib/utils"

type Props = {
  open: boolean
  transaction: Transaction | null
  onClose: () => void
  onUpdate: (id: string, body: UpdateTransactionBody) => Promise<void>
}

export function EditTransactionDialog({ open, transaction, onClose, onUpdate }: Props) {
  const [type, setType]         = useState<"income" | "expense">("expense")
  const [merchant, setMerchant] = useState("")
  const [amount, setAmount]     = useState("")
  const [date, setDate]         = useState("")
  const [category, setCategory] = useState("")
  const [notes, setNotes]       = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (transaction) {
      setType(transaction.type)
      setMerchant(transaction.merchant)
      setAmount(String(transaction.amount))
      setDate(transaction.date)
      setCategory(transaction.category)
      setNotes(transaction.note ?? "")
    }
  }, [transaction])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!transaction || !merchant || !amount || !category) return

    setIsSubmitting(true)
    try {
      await onUpdate(transaction.id, {
        merchant,
        category,
        note: notes,
        date,
        amount: parseFloat(amount),
        type,
      })
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-1">
          {/* Type toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-lg">
            {(["expense", "income"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => { setType(t); setCategory("") }}
                className={cn(
                  "py-1.5 rounded-md text-sm font-medium transition-colors capitalize",
                  type === t
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Merchant */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-merchant">
              {type === "income" ? "Source" : "Merchant"}
            </Label>
            <Input
              id="edit-merchant"
              placeholder={type === "income" ? "e.g. Salary, Freelance" : "e.g. Starbucks"}
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              required
            />
          </div>

          {/* Amount + Date side by side */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="edit-amount">Amount (฿)</Label>
              <Input
                id="edit-amount"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-date">Date</Label>
              <Input
                id="edit-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {(type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-notes">Notes <span className="text-muted-foreground">(optional)</span></Label>
            <Input
              id="edit-notes"
              placeholder="Any extra details..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <DialogFooter className="gap-2 pt-1">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!merchant || !amount || !category || isSubmitting}
            >
              {isSubmitting ? "Saving…" : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
