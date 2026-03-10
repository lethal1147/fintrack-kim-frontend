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
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { accounts as initialAccounts, type Account, type AccountType } from "@/lib/mock-data"
import { AddAccountDialog } from "@/components/app/accounts/add-account-dialog"
import { cn } from "@/lib/utils"

// ─── helpers ─────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD", maximumFractionDigits: 2,
  }).format(Math.abs(n))
}

function initials(str: string) {
  return str.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
}

const GROUP_CONFIG: {
  label: string
  types: AccountType[]
  isLiability: boolean
  icon: React.ElementType
  color: string
}[] = [
  { label: "Cash",         types: ["checking", "savings"],  isLiability: false, icon: IconBuildingBank, color: "bg-emerald-500/10 text-emerald-600" },
  { label: "Credit Cards", types: ["credit_card"],           isLiability: true,  icon: IconCreditCard,  color: "bg-rose-500/10 text-rose-600" },
  { label: "Loans",        types: ["loan"],                  isLiability: true,  icon: IconCar,         color: "bg-orange-500/10 text-orange-600" },
  { label: "Investments",  types: ["investment"],            isLiability: false, icon: IconTrendingUp,  color: "bg-violet-500/10 text-violet-600" },
]

const TYPE_LABEL: Record<AccountType, string> = {
  checking:    "Checking",
  savings:     "Savings",
  credit_card: "Credit Card",
  loan:        "Loan",
  investment:  "Investment",
}

// ─── sub-components ───────────────────────────────────────────────────────────

function AccountRow({ account }: { account: Account }) {
  const isLiability = account.balance < 0
  return (
    <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted/40 transition-colors">
      <div className="size-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
        <span className="text-xs font-bold text-muted-foreground">{initials(account.institution)}</span>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{account.name}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-muted-foreground">{account.institution}</span>
          {account.lastFour && (
            <span className="text-xs text-muted-foreground">•••• {account.lastFour}</span>
          )}
          <Badge variant="secondary" className="text-xs px-1.5 py-0 rounded-md font-normal">
            {TYPE_LABEL[account.type]}
          </Badge>
        </div>
      </div>

      <p className={cn(
        "text-sm font-semibold tabular-nums shrink-0",
        isLiability ? "text-destructive" : "text-foreground"
      )}>
        {isLiability ? "-" : ""}{fmt(account.balance)}
      </p>
    </div>
  )
}

function GroupSection({
  label, icon: Icon, color, accounts, isLiability,
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
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/40 transition-colors text-left"
      >
        <div className={cn("size-8 rounded-lg flex items-center justify-center shrink-0", color)}>
          <Icon className="size-4" />
        </div>
        <div className="flex-1">
          <span className="text-sm font-semibold">{label}</span>
          <span className="ml-2 text-xs text-muted-foreground">
            {accounts.length} account{accounts.length !== 1 ? "s" : ""}
          </span>
        </div>
        <p className={cn(
          "text-sm font-semibold tabular-nums",
          isLiability ? "text-destructive" : "text-foreground"
        )}>
          {isLiability ? "-" : ""}{fmt(subtotal)}
        </p>
        {open
          ? <IconChevronUp className="size-4 text-muted-foreground ml-2" />
          : <IconChevronDown className="size-4 text-muted-foreground ml-2" />
        }
      </button>

      {open && (
        <div className="divide-y divide-border border-t border-border">
          {accounts.map((a) => <AccountRow key={a.id} account={a} />)}
        </div>
      )}
    </div>
  )
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts)
  const [dialogOpen, setDialogOpen] = useState(false)

  function handleAdd(account: Account) {
    setAccounts((prev) => [...prev, account])
  }

  const totalAssets      = accounts.filter((a) => a.balance > 0).reduce((s, a) => s + a.balance, 0)
  const totalLiabilities = accounts.filter((a) => a.balance < 0).reduce((s, a) => s + Math.abs(a.balance), 0)
  const netWorth         = totalAssets - totalLiabilities
  const assetPct         = totalAssets + totalLiabilities === 0 ? 0
    : Math.round((totalAssets / (totalAssets + totalLiabilities)) * 100)

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Accounts</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Your connected accounts and balances</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 text-muted-foreground">
            <IconRefresh className="size-3.5" />
            Refresh
          </Button>
          <Button className="gap-1.5" onClick={() => setDialogOpen(true)}>
            <IconPlus className="size-4" />
            Add account
          </Button>
        </div>
      </div>

      {/* ── Net Worth Card ── */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Net Worth</p>
          <p className="text-3xl font-bold tabular-nums mt-1">{fmt(netWorth)}</p>
        </div>

        {/* Assets vs Liabilities bar */}
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${assetPct}%` }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="size-2 rounded-full bg-emerald-500 shrink-0" />
              <p className="text-xs text-muted-foreground">Total Assets</p>
            </div>
            <p className="text-xl font-bold tabular-nums text-emerald-600">{fmt(totalAssets)}</p>
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="size-2 rounded-full bg-destructive shrink-0" />
              <p className="text-xs text-muted-foreground">Total Liabilities</p>
            </div>
            <p className="text-xl font-bold tabular-nums text-destructive">{fmt(totalLiabilities)}</p>
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

      <AddAccountDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onAdd={handleAdd}
      />
    </div>
  )
}
