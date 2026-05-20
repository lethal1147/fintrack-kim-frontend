"use client"

import {
  IconPlayerPause,
  IconPlayerPlay,
  IconTrash,
  IconRepeat,
  IconPencil,
} from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { type RecurringItem } from "@/lib/api-client"
import { stringUtil } from "@/lib/string-util"
import { dateUtil } from "@/lib/date-util"
import { cn } from "@/lib/utils"

// ─── constants ────────────────────────────────────────────────────────────────

export const FREQ_LABEL: Record<string, string> = {
  weekly: "Weekly", monthly: "Monthly", annual: "Annual",
}

// ─── helpers ─────────────────────────────────────────────────────────────────

function dueBadge(days: number) {
  if (days < 0)   return { label: `${Math.abs(days)}d overdue`, cls: "bg-destructive/10 text-destructive border-destructive/20" }
  if (days === 0) return { label: "Due today",   cls: "bg-amber-500/10 text-amber-600 border-amber-500/20" }
  if (days <= 5)  return { label: `in ${days}d`, cls: "bg-amber-500/10 text-amber-600 border-amber-500/20" }
  return               { label: `in ${days}d`, cls: "bg-muted text-muted-foreground border-border" }
}

function monthlyEquivalent(item: RecurringItem) {
  if (item.frequency === "monthly") return item.amount
  if (item.frequency === "weekly")  return item.amount * 4.33
  if (item.frequency === "annual")  return item.amount / 12
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
  const days   = dateUtil.daysUntil(item.next_due)
  const due    = dueBadge(days)
  const paused = item.status === "paused"

  return (
    <div className={cn(
      "flex items-center gap-3 px-4 py-3.5 hover:bg-muted/30 transition-colors group",
      paused && "opacity-60"
    )}>
      {/* Color avatar */}
      <div
        className="size-9 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0"
        style={{ background: item.color }}
      >
        {item.name.slice(0, 2).toUpperCase()}
      </div>

      {/* Name + meta */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={cn("text-sm font-medium", paused && "line-through")}>{item.name}</span>
          <Badge variant="outline" className="text-xs px-1.5 py-0 rounded-md font-normal">
            {item.category}
          </Badge>
          <Badge variant="outline" className="text-xs px-1.5 py-0 rounded-md font-normal gap-0.5">
            <IconRepeat className="size-2.5" />
            {FREQ_LABEL[item.frequency]}
          </Badge>
          {paused && (
            <Badge variant="outline" className="text-xs px-1.5 py-0 rounded-md text-muted-foreground">
              Paused
            </Badge>
          )}
        </div>
        {/* Next due chip */}
        {!paused && (
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-xs text-muted-foreground">Next:</span>
            <span className="text-xs text-muted-foreground">
              {dateUtil.format(item.next_due, "MMM D")}
            </span>
            <span className={cn("text-xs px-1.5 py-0.5 rounded-full border", due.cls)}>
              {due.label}
            </span>
          </div>
        )}
      </div>

      {/* Amount */}
      <div className="text-right shrink-0 mr-2">
        <p className={cn(
          "text-sm font-semibold tabular-nums",
          item.kind === "income" ? "text-emerald-600" : "text-foreground"
        )}>
          {item.kind === "income" ? "+" : "-"}{stringUtil.formatMoneyFull(item.amount)}
        </p>
        {item.frequency !== "monthly" && (
          <p className="text-xs text-muted-foreground">
            ≈ {stringUtil.formatMoneyFull(monthlyEquivalent(item))}/mo
          </p>
        )}
      </div>

      {/* Actions (visible on hover) */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button
          onClick={() => onEdit(item)}
          title="Edit"
          className="size-7 rounded-md hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <IconPencil className="size-3.5" />
        </button>
        <button
          onClick={() => onToggleStatus(item.id)}
          title={paused ? "Resume" : "Pause"}
          className="size-7 rounded-md hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          {paused
            ? <IconPlayerPlay className="size-3.5" />
            : <IconPlayerPause className="size-3.5" />
          }
        </button>
        <button
          onClick={() => onDelete(item.id)}
          title="Delete"
          className="size-7 rounded-md hover:bg-destructive/10 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
        >
          <IconTrash className="size-3.5" />
        </button>
      </div>
    </div>
  )
}
