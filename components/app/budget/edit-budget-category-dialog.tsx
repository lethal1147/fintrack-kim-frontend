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
import { type BudgetCategory, type BudgetGroup, type UpdateBudgetBody } from "@/lib/api-client"
import { EXPENSE_CATEGORIES } from "@/lib/categories"
import { cn } from "@/lib/utils"

// ─── constants ────────────────────────────────────────────────────────────────

const GROUPS: BudgetGroup[] = ["Fixed", "Flexible", "Non-Monthly"]

const COLOR_OPTIONS = [
  { label: "Blue",   value: "var(--chart-1)" },
  { label: "Green",  value: "var(--chart-2)" },
  { label: "Violet", value: "var(--chart-3)" },
  { label: "Orange", value: "var(--chart-4)" },
  { label: "Pink",   value: "var(--chart-5)" },
]

// ─── component ────────────────────────────────────────────────────────────────

type Props = {
  open: boolean
  item: BudgetCategory | null
  onClose: () => void
  onEdit: (id: string, body: UpdateBudgetBody) => void
}

export function EditBudgetCategoryDialog({ open, item, onClose, onEdit }: Props) {
  const [name, setName]     = useState("")
  const [group, setGroup]   = useState<BudgetGroup | "">("")
  const [amount, setAmount] = useState("")
  const [color, setColor]   = useState(COLOR_OPTIONS[0].value)

  useEffect(() => {
    if (item) {
      setName(item.name)
      setGroup(item.group)
      setAmount(String(item.budgeted))
      setColor(item.color)
    }
  }, [item])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!item || !name || !group || !amount) return
    onEdit(item.id, {
      name,
      group: group as BudgetGroup,
      budgeted: parseFloat(amount),
      color,
    })
    onClose()
  }

  const valid = name !== "" && group !== "" && amount !== ""

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Budget Category</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-1">

          {/* Category name */}
          <div className="space-y-1.5">
            <Label>Category name</Label>
            <Select value={name} onValueChange={setName}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {EXPENSE_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Group */}
          <div className="space-y-1.5">
            <Label>Group</Label>
            <Select value={group} onValueChange={(v) => setGroup(v as BudgetGroup)}>
              <SelectTrigger>
                <SelectValue placeholder="Select group" />
              </SelectTrigger>
              <SelectContent>
                {GROUPS.map((g) => (
                  <SelectItem key={g} value={g}>{g}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Monthly budget */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-cat-amount">Monthly budget ($)</Label>
            <Input
              id="edit-cat-amount"
              type="number"
              min="0"
              step="1"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          {/* Color */}
          <div className="space-y-1.5">
            <Label>Color</Label>
            <div className="flex gap-2">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  title={c.label}
                  onClick={() => setColor(c.value)}
                  className={cn(
                    "size-7 rounded-full border-2 transition-transform",
                    color === c.value ? "border-foreground scale-110" : "border-transparent"
                  )}
                  style={{ background: c.value }}
                />
              ))}
            </div>
          </div>

          <DialogFooter className="gap-2 pt-1">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!valid}>
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
