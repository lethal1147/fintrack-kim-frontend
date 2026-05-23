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
import { type Account, type AccountType } from "@/lib/mock-data"

type Props = {
  open: boolean
  onClose: () => void
  onAdd: (account: Account) => void
}

export function AddAccountDialog({ open, onClose, onAdd }: Props) {
  const t = useTranslations("accounts.addDialog")

  const TYPE_OPTIONS: { value: AccountType; label: string }[] = [
    { value: "checking",    label: t("typeChecking") },
    { value: "savings",     label: t("typeSavings") },
    { value: "credit_card", label: t("typeCreditCard") },
    { value: "loan",        label: t("typeLoanMortgage") },
    { value: "investment",  label: t("typeInvestment") },
  ]

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
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">

          {/* Account type */}
          <div className="space-y-1.5">
            <Label>{t("accountTypeLabel")}</Label>
            <Select value={type} onValueChange={(v) => setType(v as AccountType)}>
              <SelectTrigger>
                <SelectValue placeholder={t("accountTypePlaceholder")} />
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
              <Label htmlFor="acc-name">{t("accountNameLabel")}</Label>
              <Input
                id="acc-name"
                placeholder={t("accountNamePlaceholder")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="acc-inst">{t("institutionLabel")}</Label>
              <Input
                id="acc-inst"
                placeholder={t("institutionPlaceholder")}
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
                {isLiability ? t("amountOwedLabel") : t("currentBalanceLabel")}
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
                {t("last4Label")} <span className="text-muted-foreground">{t("last4Optional")}</span>
              </Label>
              <Input
                id="acc-last4"
                placeholder={t("last4Placeholder")}
                maxLength={4}
                value={lastFour}
                onChange={(e) => setLastFour(e.target.value.replace(/\D/g, ""))}
              />
            </div>
          </div>

          {isLiability && (
            <p className="text-xs text-muted-foreground">
              {t("liabilityNote")}
            </p>
          )}

          <DialogFooter className="gap-2 pt-1">
            <Button type="button" variant="outline" onClick={onClose}>{t("cancelButton")}</Button>
            <Button type="submit" disabled={!valid}>{t("addButton")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
