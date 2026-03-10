"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { type Goal } from "@/lib/mock-data"
import { stringUtil } from "@/lib/string-util"

type Props = {
  goal: Goal
  onClose: () => void
  onAdd: (amount: number) => void
}

export function AddFundsDialog({ goal, onClose, onAdd }: Props) {
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
              <span className="font-medium">{stringUtil.formatMoney(goal.current)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Still needed</span>
              <span className="font-medium">{stringUtil.formatMoney(remaining)}</span>
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
