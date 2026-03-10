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
import { type Account, type AccountType } from "@/lib/mock-data"

const TYPE_OPTIONS: { value: AccountType; label: string }[] = [
  { value: "checking",    label: "Checking" },
  { value: "savings",     label: "Savings" },
  { value: "credit_card", label: "Credit Card" },
  { value: "loan",        label: "Loan / Mortgage" },
  { value: "investment",  label: "Investment" },
]

type Props = {
  open: boolean
  onClose: () => void
  onAdd: (account: Account) => void
}

export function AddAccountDialog({ open, onClose, onAdd }: Props) {
  const [name, setName]           = useState("")
  const [institution, setInstitution] = useState("")
  const [type, setType]           = useState<AccountType | "">("")
  const [balance, setBalance]     = useState("")
  const [lastFour, setLastFour]   = useState("")

  const isLiability = type === "credit_card" || type === "loan"

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !institution || !type || !balance) return

    const raw = parseFloat(balance)
    onAdd({
      id:          Date.now().toString(),
      name,
      institution,
      type:        type as AccountType,
      balance:     isLiability ? -Math.abs(raw) : Math.abs(raw),
      lastFour:    lastFour || undefined,
    })

    setName(""); setInstitution(""); setType(""); setBalance(""); setLastFour("")
    onClose()
  }

  const valid = name && institution && type && balance

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Account</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">

          {/* Account type */}
          <div className="space-y-1.5">
            <Label>Account type</Label>
            <Select value={type} onValueChange={(v) => setType(v as AccountType)}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {TYPE_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Name + Institution */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="acc-name">Account name</Label>
              <Input
                id="acc-name"
                placeholder="e.g. Main Checking"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="acc-inst">Institution</Label>
              <Input
                id="acc-inst"
                placeholder="e.g. Chase"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Balance + Last 4 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="acc-balance">
                {isLiability ? "Amount owed ($)" : "Current balance ($)"}
              </Label>
              <Input
                id="acc-balance"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="acc-last4">
                Last 4 digits <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="acc-last4"
                placeholder="1234"
                maxLength={4}
                value={lastFour}
                onChange={(e) => setLastFour(e.target.value.replace(/\D/g, ""))}
              />
            </div>
          </div>

          {isLiability && (
            <p className="text-xs text-muted-foreground">
              Credit card and loan balances are treated as liabilities and subtracted from your net worth.
            </p>
          )}

          <DialogFooter className="gap-2 pt-1">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={!valid}>Add account</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
