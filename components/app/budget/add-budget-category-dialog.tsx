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
import { type BudgetCategory, type BudgetGroup } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const GROUPS: BudgetGroup[] = ["Fixed", "Flexible", "Non-Monthly"]

const COLOR_OPTIONS = [
  { label: "Blue",   value: "var(--chart-1)" },
  { label: "Green",  value: "var(--chart-2)" },
  { label: "Violet", value: "var(--chart-3)" },
  { label: "Orange", value: "var(--chart-4)" },
  { label: "Pink",   value: "var(--chart-5)" },
]

type Props = {
  open: boolean
  onClose: () => void
  onAdd: (cat: BudgetCategory) => void
}

export function AddBudgetCategoryDialog({ open, onClose, onAdd }: Props) {
  const [name, setName]     = useState("")
  const [group, setGroup]   = useState<BudgetGroup | "">("")
  const [amount, setAmount] = useState("")
  const [color, setColor]   = useState(COLOR_OPTIONS[0].value)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !group || !amount) return

    onAdd({
      name,
      group: group as BudgetGroup,
      budgeted: parseFloat(amount),
      spent: 0,
      color,
    })

    // reset
    setName("")
    setGroup("")
    setAmount("")
    setColor(COLOR_OPTIONS[0].value)
    onClose()
  }

  const valid = name.trim() !== "" && group !== "" && amount !== ""

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Budget Category</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-1">

          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="cat-name">Category name</Label>
            <Input
              id="cat-name"
              placeholder="e.g. Gym, Pet care"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
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
            <Label htmlFor="cat-amount">Monthly budget ($)</Label>
            <Input
              id="cat-amount"
              type="number"
              min="1"
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
              Add category
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
