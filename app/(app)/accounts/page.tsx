"use client"

import { useState } from "react"
import {
  IconPlus,
  IconRefresh,
  IconChevronDown,
  IconChevronUp,
  IconBuildingBank,
  IconCreditCard,
  IconTrendingUp,
  IconCar,
} from "@tabler/icons-react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { type Account, type AccountType } from "@/lib/mock-data"
import { AddAccountDialog } from "@/components/app/accounts/add-account-dialog"
import { useAccountsStore } from "@/store/accounts-store"
import { stringUtil } from "@/lib/string-util"
import { cn } from "@/lib/utils"

// ─── sub-components ───────────────────────────────────────────────────────────

function AccountRow({ account }: { account: Account }) {
  const t = useTranslations("accounts")
  const isLiability = account.balance < 0
  return (
    <div className="hover:bg-muted/40 flex items-center gap-3 px-4 py-3 transition-colors">
      <div className="bg-muted flex size-9 shrink-0 items-center justify-center rounded-lg">
        <span className="text-muted-foreground text-xs font-bold">
          {stringUtil.initials(account.institution)}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{account.name}</p>
        <div className="mt-0.5 flex items-center gap-2">
          <span className="text-muted-foreground text-xs">{account.institution}</span>
          {account.lastFour && (
            <span className="text-muted-foreground text-xs">•••• {account.lastFour}</span>
          )}
          <Badge variant="secondary" className="rounded-md px-1.5 py-0 text-xs font-normal">
            {account.type === "checking"
              ? t("typeChecking")
              : account.type === "savings"
                ? t("typeSavings")
                : account.type === "credit_card"
                  ? t("typeCreditCard")
                  : account.type === "loan"
                    ? t("typeLoan")
                    : t("typeInvestment")}
          </Badge>
        </div>
      </div>

      <p
        className={cn(
          "shrink-0 text-sm font-semibold tabular-nums",
          isLiability ? "text-destructive" : "text-foreground"
        )}
      >
        {isLiability ? "-" : ""}
        {stringUtil.formatMoneyFull(Math.abs(account.balance))}
      </p>
    </div>
  )
}

function GroupSection({
  label,
  icon: Icon,
  color,
  accounts,
  isLiability,
}: {
  label: string
  icon: React.ElementType
  color: string
  accounts: Account[]
  isLiability: boolean
}) {
  const [open, setOpen] = useState(true)
  const subtotal = accounts.reduce((s, a) => s + a.balance, 0)

  if (accounts.length === 0) return null

  return (
    <div className="border-border bg-card overflow-hidden rounded-xl border">
      <button
        onClick={() => setOpen((v) => !v)}
        className="hover:bg-muted/40 flex w-full items-center gap-3 px-4 py-3 text-left transition-colors"
      >
        <div className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg", color)}>
          <Icon className="size-4" />
        </div>
        <div className="flex-1">
          <span className="text-sm font-semibold">{label}</span>
          <span className="text-muted-foreground ml-2 text-xs">
            {accounts.length} account{accounts.length !== 1 ? "s" : ""}
          </span>
        </div>
        <p
          className={cn(
            "text-sm font-semibold tabular-nums",
            isLiability ? "text-destructive" : "text-foreground"
          )}
        >
          {isLiability ? "-" : ""}
          {stringUtil.formatMoneyFull(Math.abs(subtotal))}
        </p>
        {open ? (
          <IconChevronUp className="text-muted-foreground ml-2 size-4" />
        ) : (
          <IconChevronDown className="text-muted-foreground ml-2 size-4" />
        )}
      </button>

      {open && (
        <div className="divide-border border-border divide-y border-t">
          {accounts.map((a) => (
            <AccountRow key={a.id} account={a} />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function AccountsPage() {
  const t = useTranslations("accounts")
  const { accounts, addAccount } = useAccountsStore()
  const [dialogOpen, setDialogOpen] = useState(false)

  const GROUP_CONFIG: {
    label: string
    types: AccountType[]
    isLiability: boolean
    icon: React.ElementType
    color: string
  }[] = [
    {
      label: t("groupCash"),
      types: ["checking", "savings"],
      isLiability: false,
      icon: IconBuildingBank,
      color: "bg-emerald-500/10 text-emerald-600",
    },
    {
      label: t("groupCreditCards"),
      types: ["credit_card"],
      isLiability: true,
      icon: IconCreditCard,
      color: "bg-rose-500/10 text-rose-600",
    },
    {
      label: t("groupLoans"),
      types: ["loan"],
      isLiability: true,
      icon: IconCar,
      color: "bg-orange-500/10 text-orange-600",
    },
    {
      label: t("groupInvestments"),
      types: ["investment"],
      isLiability: false,
      icon: IconTrendingUp,
      color: "bg-violet-500/10 text-violet-600",
    },
  ]

  const totalAssets = accounts.filter((a) => a.balance > 0).reduce((s, a) => s + a.balance, 0)
  const totalLiabilities = accounts
    .filter((a) => a.balance < 0)
    .reduce((s, a) => s + Math.abs(a.balance), 0)
  const netWorth = totalAssets - totalLiabilities
  const assetPct =
    totalAssets + totalLiabilities === 0
      ? 0
      : Math.round((totalAssets / (totalAssets + totalLiabilities)) * 100)

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">{t("subtitle")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-muted-foreground gap-1.5">
            <IconRefresh className="size-3.5" />
            {t("refreshButton")}
          </Button>
          <Button className="gap-1.5" onClick={() => setDialogOpen(true)}>
            <IconPlus className="size-4" />
            {t("addButton")}
          </Button>
        </div>
      </div>

      {/* ── Net Worth Card ── */}
      <div className="border-border bg-card space-y-4 rounded-xl border p-5">
        <div>
          <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
            {t("netWorthLabel")}
          </p>
          <p className="mt-1 text-3xl font-bold tabular-nums">
            {stringUtil.formatMoneyFull(netWorth)}
          </p>
        </div>

        {/* Assets vs Liabilities bar */}
        <div className="bg-muted h-2 overflow-hidden rounded-full">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${assetPct}%` }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="mb-0.5 flex items-center gap-1.5">
              <span className="size-2 shrink-0 rounded-full bg-emerald-500" />
              <p className="text-muted-foreground text-xs">{t("totalAssetsLabel")}</p>
            </div>
            <p className="text-xl font-bold text-emerald-600 tabular-nums">
              {stringUtil.formatMoneyFull(totalAssets)}
            </p>
          </div>
          <div>
            <div className="mb-0.5 flex items-center gap-1.5">
              <span className="bg-destructive size-2 shrink-0 rounded-full" />
              <p className="text-muted-foreground text-xs">{t("totalLiabilitiesLabel")}</p>
            </div>
            <p className="text-destructive text-xl font-bold tabular-nums">
              {stringUtil.formatMoneyFull(totalLiabilities)}
            </p>
          </div>
        </div>
      </div>

      {/* ── Account groups ── */}
      <div className="space-y-3">
        {GROUP_CONFIG.map((g) => (
          <GroupSection
            key={g.label}
            label={g.label}
            icon={g.icon}
            color={g.color}
            isLiability={g.isLiability}
            accounts={accounts.filter((a) => g.types.includes(a.type))}
          />
        ))}
      </div>

      <AddAccountDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onAdd={addAccount} />
    </div>
  )
}
