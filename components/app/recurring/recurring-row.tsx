"use client"

import {
  IconPlayerPause,
  IconPlayerPlay,
  IconTrash,
  IconRepeat,
  IconPencil,
} from "@tabler/icons-react"
import { useTranslations } from "next-intl"
import { Badge } from "@/components/ui/badge"
import { type RecurringItem } from "@/lib/api-client"
import { stringUtil } from "@/lib/string-util"
import { dateUtil } from "@/lib/date-util"
import { cn } from "@/lib/utils"
import { useCategoryLabel } from "@/lib/category-util"

function monthlyEquivalent(item: RecurringItem) {
  if (item.frequency === "monthly") return item.amount
  if (item.frequency === "weekly") return item.amount * 4.33
  if (item.frequency === "annual") return item.amount / 12
  return item.amount
}

// ─── component ────────────────────────────────────────────────────────────────

type Props = {
  item: RecurringItem
  onToggleStatus: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (item: RecurringItem) => void
}

export function RecurringRow({ item, onToggleStatus, onDelete, onEdit }: Props) {
  const t = useTranslations("recurring.row")
  const getCategoryLabel = useCategoryLabel()
  const days = dateUtil.daysUntil(item.next_due)
  const paused = item.status === "paused"

  function dueBadge(d: number) {
    if (d < 0)
      return {
        label: t("overdueDays", { days: Math.abs(d) }),
        cls: "bg-destructive/10 text-destructive border-destructive/20",
      }
    if (d === 0)
      return { label: t("dueToday"), cls: "bg-amber-500/10 text-amber-600 border-amber-500/20" }
    if (d <= 5)
      return {
        label: t("dueInDays", { days: d }),
        cls: "bg-amber-500/10 text-amber-600 border-amber-500/20",
      }
    return {
      label: t("dueInDays", { days: d }),
      cls: "bg-muted text-muted-foreground border-border",
    }
  }

  const due = dueBadge(days)

  const FREQ_LABEL: Record<string, string> = {
    weekly: t("freqWeekly"),
    monthly: t("freqMonthly"),
    annual: t("freqAnnual"),
  }

  return (
    <div
      className={cn(
        "hover:bg-muted/30 group flex items-center gap-3 px-4 py-3.5 transition-colors",
        paused && "opacity-60"
      )}
    >
      {/* Color avatar */}
      <div
        className="flex size-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white"
        style={{ background: item.color }}
      >
        {item.name.slice(0, 2).toUpperCase()}
      </div>

      {/* Name + meta */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className={cn("text-sm font-medium", paused && "line-through")}>{item.name}</span>
          <Badge variant="outline" className="rounded-md px-1.5 py-0 text-xs font-normal">
            {getCategoryLabel(item.category)}
          </Badge>
          <Badge variant="outline" className="gap-0.5 rounded-md px-1.5 py-0 text-xs font-normal">
            <IconRepeat className="size-2.5" />
            {FREQ_LABEL[item.frequency]}
          </Badge>
          {paused && (
            <Badge
              variant="outline"
              className="text-muted-foreground rounded-md px-1.5 py-0 text-xs"
            >
              {t("statusPaused")}
            </Badge>
          )}
        </div>
        {/* Next due chip */}
        {!paused && (
          <div className="mt-1 flex items-center gap-1.5">
            <span className="text-muted-foreground text-xs">{t("nextLabel")}</span>
            <span className="text-muted-foreground text-xs">
              {dateUtil.format(item.next_due, "MMM D")}
            </span>
            <span className={cn("rounded-full border px-1.5 py-0.5 text-xs", due.cls)}>
              {due.label}
            </span>
          </div>
        )}
      </div>

      {/* Amount */}
      <div className="mr-2 shrink-0 text-right">
        <p
          className={cn(
            "text-sm font-semibold tabular-nums",
            item.kind === "income" ? "text-emerald-600" : "text-destructive"
          )}
        >
          {item.kind === "income" ? "+" : "-"}
          {stringUtil.formatMoneyFull(item.amount)}
        </p>
        {item.frequency !== "monthly" && (
          <p className="text-muted-foreground text-xs">
            {t("monthlyEquivalent", {
              amount: stringUtil.formatMoneyFull(monthlyEquivalent(item)),
            })}
          </p>
        )}
      </div>

      {/* Actions (visible on hover) */}
      <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={() => onEdit(item)}
          title={t("actionEdit")}
          className="hover:bg-muted text-muted-foreground hover:text-foreground flex size-7 items-center justify-center rounded-md transition-colors"
        >
          <IconPencil className="size-3.5" />
        </button>
        <button
          onClick={() => onToggleStatus(item.id)}
          title={paused ? t("actionResume") : t("actionPause")}
          className="hover:bg-muted text-muted-foreground hover:text-foreground flex size-7 items-center justify-center rounded-md transition-colors"
        >
          {paused ? (
            <IconPlayerPlay className="size-3.5" />
          ) : (
            <IconPlayerPause className="size-3.5" />
          )}
        </button>
        <button
          onClick={() => onDelete(item.id)}
          title={t("actionDelete")}
          className="hover:bg-destructive/10 text-muted-foreground hover:text-destructive flex size-7 items-center justify-center rounded-md transition-colors"
        >
          <IconTrash className="size-3.5" />
        </button>
      </div>
    </div>
  )
}

// ─── exported freq label helper (still available for external use) ────────────
export const FREQ_LABEL: Record<string, string> = {
  weekly: "Weekly",
  monthly: "Monthly",
  annual: "Annual",
}
