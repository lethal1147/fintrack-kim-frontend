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
import { type RecurringItem, type RecurringFrequency, type RecurringKind } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const CATEGORIES = [
  "Housing", "Utilities", "Entertainment", "Health",
  "Subscriptions", "Food & Dining", "Transport", "Education", "Income", "Other",
]

const COLOR_OPTIONS = [
  "#0ea5e9", "#ef4444", "#22c55e", "#f97316",
  "#8b5cf6", "#10b981", "#f59e0b", "#ec4899",
]

type Props = {
  open: boolean
  onClose: () => void
  onAdd: (item: RecurringItem) => void
}

export function AddRecurringDialog({ open, onClose, onAdd }: Props) {
  const [kind, setKind]           = useState<RecurringKind>("expense")
  const [name, setName]           = useState("")
  const [category, setCategory]   = useState("")
  const [amount, setAmount]       = useState("")
  const [frequency, setFrequency] = useState<RecurringFrequency | "">("")
  const [nextDue, setNextDue]     = useState("")
  const [color, setColor]         = useState(COLOR_OPTIONS[0])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !category || !amount || !frequency || !nextDue) return

    onAdd({
      id:        Date.now().toString(),
      name,
      category,
      amount:    parseFloat(amount),
      frequency: frequency as RecurringFrequency,
      nextDue,
      kind,
      status:    "active",
      color,
    })

    setName(""); setCategory(""); setAmount(""); setFrequency(""); setNextDue("")
    setColor(COLOR_OPTIONS[0])
    onClose()
  }

  const valid = name && category && amount && frequency && nextDue

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Recurring Item</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">

          {/* Kind toggle */}
          <div className="flex rounded-lg border border-border overflow-hidden text-sm">
            {(["expense", "income"] as RecurringKind[]).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setKind(k)}
                className={cn(
                  "flex-1 py-1.5 capitalize transition-colors",
                  kind === k ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-muted"
                )}
              >
                {k}
              </button>
            ))}
          </div>

          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="rec-name">Name</Label>
            <Input
              id="rec-name"
              placeholder="e.g. Netflix, Rent, Salary…"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Amount + Frequency */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="rec-amount">Amount ($)</Label>
              <Input
                id="rec-amount"
                type="number" min="0.01" step="0.01" placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Frequency</Label>
              <Select value={frequency} onValueChange={(v) => setFrequency(v as RecurringFrequency)}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="annual">Annual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Next due date */}
          <div className="space-y-1.5">
            <Label htmlFor="rec-due">Next due date</Label>
            <Input
              id="rec-due"
              type="date"
              value={nextDue}
              onChange={(e) => setNextDue(e.target.value)}
              required
            />
          </div>

          {/* Color */}
          <div className="space-y-1.5">
            <Label>Colour</Label>
            <div className="flex gap-2">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={cn(
                    "size-7 rounded-full border-2 transition-transform",
                    color === c ? "border-foreground scale-110" : "border-transparent"
                  )}
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>

          <DialogFooter className="gap-2 pt-1">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={!valid}>Add item</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
