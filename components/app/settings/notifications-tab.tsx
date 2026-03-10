"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { SectionHeader } from "./section-header"
import { SaveToast } from "./save-toast"

// ─── constants ────────────────────────────────────────────────────────────────

type NotifPrefs = {
  weeklySummary:      boolean
  budgetAlerts:       boolean
  goalMilestones:     boolean
  largeTransactions:  boolean
  recurringReminders: boolean
  newFeatures:        boolean
}

const NOTIFICATION_ITEMS: { key: keyof NotifPrefs; label: string; description: string }[] = [
  { key: "weeklySummary",      label: "Weekly summary",      description: "Spending digest every Monday morning." },
  { key: "budgetAlerts",       label: "Budget alerts",       description: "Notify when a category nears or exceeds budget." },
  { key: "goalMilestones",     label: "Goal milestones",     description: "Celebrate when you hit 25%, 50%, 75%, 100% of a goal." },
  { key: "largeTransactions",  label: "Large transactions",  description: "Alert for transactions over $200." },
  { key: "recurringReminders", label: "Recurring reminders", description: "Remind me 3 days before a bill is due." },
  { key: "newFeatures",        label: "Product updates",     description: "News about new features and improvements." },
]

const DEFAULT_PREFS: NotifPrefs = {
  weeklySummary:      true,
  budgetAlerts:       true,
  goalMilestones:     true,
  largeTransactions:  false,
  recurringReminders: true,
  newFeatures:        false,
}

// ─── component ────────────────────────────────────────────────────────────────

export function NotificationsTab() {
  const [prefs, setPrefs] = useState<NotifPrefs>(DEFAULT_PREFS)
  const [saved, setSaved] = useState(false)

  function toggle(key: keyof NotifPrefs) {
    setPrefs((p) => ({ ...p, [key]: !p[key] }))
  }

  return (
    <div className="space-y-6">
      <SectionHeader title="Notifications" description="Choose what you want to be notified about." />

      <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
        {NOTIFICATION_ITEMS.map((item) => (
          <div key={item.key} className="px-4 py-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">{item.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
            </div>
            <Switch checked={prefs[item.key]} onCheckedChange={() => toggle(item.key)} />
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2500) }}>
          Save preferences
        </Button>
      </div>

      <SaveToast visible={saved} />
    </div>
  )
}
