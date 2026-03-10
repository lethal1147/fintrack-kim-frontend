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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CATEGORIES, type Transaction } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

type Props = {
  open: boolean
  onClose: () => void
  onAdd: (tx: Transaction) => void
}

export function AddTransactionDialog({ open, onClose, onAdd }: Props) {
  const [type, setType] = useState<"income" | "expense">("expense")
  const [merchant, setMerchant] = useState("")
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [category, setCategory] = useState("")
  const [notes, setNotes] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!merchant || !amount || !category) return

    onAdd({
      id: Date.now().toString(),
      merchant,
      category,
      date,
      amount: parseFloat(amount),
      type,
    })

    // Reset
    setMerchant("")
    setAmount("")
    setCategory("")
    setNotes("")
    setType("expense")
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-1">
          {/* Type toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-lg">
            {(["expense", "income"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
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
            <Label htmlFor="merchant">
              {type === "income" ? "Source" : "Merchant"}
            </Label>
            <Input
              id="merchant"
              placeholder={type === "income" ? "e.g. Salary, Freelance" : "e.g. Starbucks"}
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              required
            />
          </div>

          {/* Amount + Date side by side */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
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
              <Label htmlFor="date">Date</Label>
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
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.filter((c) =>
                  type === "income" ? c === "Income" : c !== "Income"
                ).map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes <span className="text-muted-foreground">(optional)</span></Label>
            <Input
              id="notes"
              placeholder="Any extra details..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <DialogFooter className="gap-2 pt-1">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!merchant || !amount || !category}
            >
              Add transaction
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
