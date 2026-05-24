"use client"

import { useState, useEffect } from "react"
import dayjs from "dayjs"
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronDown,
  IconChevronUp,
  IconPlus,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { type BudgetCategory, type BudgetGroup } from "@/lib/api-client"
import { AddBudgetCategoryDialog } from "@/components/app/budget/add-budget-category-dialog"
import { EditBudgetCategoryDialog } from "@/components/app/budget/edit-budget-category-dialog"
import { useBudgetStore } from "@/store/budget-store"
import { stringUtil } from "@/lib/string-util"
import { dateUtil } from "@/lib/date-util"
import { cn } from "@/lib/utils"

// ─── constants ────────────────────────────────────────────────────────────────

const GROUPS: BudgetGroup[] = ["Fixed", "Flexible", "Non-Monthly"]

// ─── sub-components ───────────────────────────────────────────────────────────

function CategoryRow({
  cat,
  onEdit,
  onDelete,
}: {
  cat: BudgetCategory
  onEdit: (cat: BudgetCategory) => void
  onDelete: (id: string) => void
}) {
  const t = useTranslations("budget.categoryRow")
  const pct = cat.budgeted === 0 ? 0 : Math.min(Math.round((cat.spent / cat.budgeted) * 100), 100)
  const over = cat.spent > cat.budgeted
  const remaining = cat.budgeted - cat.spent

  return (
    <div className="group hover:bg-muted/40 flex items-center gap-4 px-4 py-3 transition-colors">
      {/* Dot + name */}
      <div className="flex w-36 shrink-0 items-center gap-2.5">
        <span className="size-2.5 shrink-0 rounded-full" style={{ background: cat.color }} />
        <span className="truncate text-sm font-medium">{cat.name}</span>
      </div>

      {/* Progress bar */}
      <div className="min-w-0 flex-1">
        <Progress value={pct} className={cn("h-2", over && "[&>div]:bg-destructive")} />
      </div>

      {/* Numbers */}
      <div className="flex shrink-0 gap-6 text-right text-sm tabular-nums">
        <div className="w-20">
          <p className="text-muted-foreground mb-0.5 text-xs leading-none">{t("budgetedLabel")}</p>
          <p className="font-medium">{stringUtil.formatMoney(cat.budgeted)}</p>
        </div>
        <div className="w-20">
          <p className="text-muted-foreground mb-0.5 text-xs leading-none">{t("spentLabel")}</p>
          <p className={cn("font-medium", over ? "text-destructive" : "text-foreground")}>
            {stringUtil.formatMoney(cat.spent)}
          </p>
        </div>
        <div className="w-20">
          <p className="text-muted-foreground mb-0.5 text-xs leading-none">{t("remainingLabel")}</p>
          <p className={cn("font-medium", over ? "text-destructive" : "text-emerald-600")}>
            {over ? "-" : ""}
            {stringUtil.formatMoney(Math.abs(remaining))}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={() => onEdit(cat)}
          className="hover:bg-muted text-muted-foreground hover:text-foreground rounded-md p-1.5 transition-colors"
        >
          <IconPencil className="size-3.5" />
        </button>
        <button
          onClick={() => onDelete(cat.id)}
          className="hover:bg-muted text-muted-foreground hover:text-destructive rounded-md p-1.5 transition-colors"
        >
          <IconTrash className="size-3.5" />
        </button>
      </div>
    </div>
  )
}

function GroupSection({
  group,
  categories,
  onEdit,
  onDelete,
}: {
  group: BudgetGroup
  categories: BudgetCategory[]
  onEdit: (cat: BudgetCategory) => void
  onDelete: (id: string) => void
}) {
  const tg = useTranslations("budget.groups")
  const [open, setOpen] = useState(true)

  const totalBudgeted = categories.reduce((s, c) => s + c.budgeted, 0)
  const totalSpent = categories.reduce((s, c) => s + c.spent, 0)
  const totalPct =
    totalBudgeted === 0 ? 0 : Math.min(Math.round((totalSpent / totalBudgeted) * 100), 100)
  const over = totalSpent > totalBudgeted

  const groupLabel =
    group === "Fixed" ? tg("fixed") : group === "Flexible" ? tg("flexible") : tg("nonMonthly")
  const groupDesc =
    group === "Fixed"
      ? tg("fixedDescription")
      : group === "Flexible"
        ? tg("flexibleDescription")
        : tg("nonMonthlyDescription")

  return (
    <div className="border-border bg-card overflow-hidden rounded-xl border">
      <button
        onClick={() => setOpen((v) => !v)}
        className="bg-muted/40 hover:bg-muted/60 flex w-full items-center gap-3 px-4 py-3 text-left transition-colors"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">{groupLabel}</span>
            <span className="text-muted-foreground text-xs">{groupDesc}</span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-6 text-sm tabular-nums">
          <span className="text-muted-foreground text-xs">
            {stringUtil.formatMoney(totalSpent)} / {stringUtil.formatMoney(totalBudgeted)}
          </span>
          <span
            className={cn(
              "text-xs font-medium",
              over ? "text-destructive" : "text-muted-foreground"
            )}
          >
            {totalPct}%
          </span>
          {open ? (
            <IconChevronUp className="text-muted-foreground size-4" />
          ) : (
            <IconChevronDown className="text-muted-foreground size-4" />
          )}
        </div>
      </button>

      {open && (
        <div className="divide-border divide-y">
          {categories.map((cat) => (
            <CategoryRow key={cat.id} cat={cat} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function BudgetPage() {
  const t = useTranslations("budget")
  const currentYear = dayjs().year()

  const [monthIdx, setMonthIdx] = useState(dayjs().month()) // 0-indexed
  const [addOpen, setAddOpen] = useState(false)
  const [editItem, setEditItem] = useState<BudgetCategory | null>(null)

  const { categories, fetchCategories, addCategory, editCategory, deleteCategory } =
    useBudgetStore()

  useEffect(() => {
    fetchCategories(currentYear, monthIdx + 1)
  }, [monthIdx, fetchCategories, currentYear])

  const totalBudgeted = categories.reduce((s, c) => s + c.budgeted, 0)
  const totalSpent = categories.reduce((s, c) => s + c.spent, 0)
  const totalRemaining = totalBudgeted - totalSpent
  const overallPct =
    totalBudgeted === 0 ? 0 : Math.min(Math.round((totalSpent / totalBudgeted) * 100), 100)

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">{t("subtitle")}</p>
        </div>
        <Button className="gap-1.5" onClick={() => setAddOpen(true)}>
          <IconPlus className="size-4" />
          {t("addButton")}
        </Button>
      </div>

      {/* ── Month selector ── */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => setMonthIdx((i) => Math.max(0, i - 1))}
          disabled={monthIdx === 0}
        >
          <IconChevronLeft className="size-3.5" />
        </Button>
        <span className="w-36 text-center text-sm font-semibold">
          {dateUtil.formatMonth(monthIdx, currentYear)}
        </span>
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => setMonthIdx((i) => Math.min(11, i + 1))}
          disabled={monthIdx === 11}
        >
          <IconChevronRight className="size-3.5" />
        </Button>
      </div>

      {/* ── Summary strip ── */}
      <div className="border-border bg-card space-y-3 rounded-xl border p-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-muted-foreground text-xs">{t("totalBudgeted")}</p>
            <p className="text-lg font-bold tabular-nums">
              {stringUtil.formatMoney(totalBudgeted)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">{t("totalSpent")}</p>
            <p className="text-lg font-bold tabular-nums">{stringUtil.formatMoney(totalSpent)}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">{t("remaining")}</p>
            <p
              className={cn(
                "text-lg font-bold tabular-nums",
                totalRemaining < 0 ? "text-destructive" : "text-emerald-600"
              )}
            >
              {totalRemaining < 0 ? "-" : ""}
              {stringUtil.formatMoney(Math.abs(totalRemaining))}
            </p>
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-muted-foreground flex justify-between text-xs">
            <span>{t("overallUsed", { pct: overallPct })}</span>
            <span>
              {stringUtil.formatMoney(totalSpent)} / {stringUtil.formatMoney(totalBudgeted)}
            </span>
          </div>
          <Progress
            value={overallPct}
            className={cn("h-2.5", totalSpent > totalBudgeted && "[&>div]:bg-destructive")}
          />
        </div>
      </div>

      {/* ── Category groups ── */}
      <div className="space-y-4">
        {GROUPS.map((group) => {
          const cats = categories.filter((c) => c.group === group)
          if (cats.length === 0) return null
          return (
            <GroupSection
              key={group}
              group={group}
              categories={cats}
              onEdit={setEditItem}
              onDelete={deleteCategory}
            />
          )
        })}
      </div>

      <AddBudgetCategoryDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={addCategory}
      />

      <EditBudgetCategoryDialog
        open={editItem !== null}
        item={editItem}
        onClose={() => setEditItem(null)}
        onEdit={(id, body) => {
          editCategory(id, body)
          setEditItem(null)
        }}
      />
    </div>
  )
}
