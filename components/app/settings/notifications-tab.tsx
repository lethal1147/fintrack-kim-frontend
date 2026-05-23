"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
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
  const t = useTranslations("settings.notifications")
  const [prefs, setPrefs] = useState<NotifPrefs>(DEFAULT_PREFS)
  const [saved, setSaved] = useState(false)

  const NOTIFICATION_ITEMS: { key: keyof NotifPrefs; label: string; description: string }[] = [
    { key: "weeklySummary",      label: t("weeklySummaryLabel"),      description: t("weeklySummaryDescription") },
    { key: "budgetAlerts",       label: t("budgetAlertsLabel"),       description: t("budgetAlertsDescription") },
    { key: "goalMilestones",     label: t("goalMilestonesLabel"),     description: t("goalMilestonesDescription") },
    { key: "largeTransactions",  label: t("largeTransactionsLabel"),  description: t("largeTransactionsDescription") },
    { key: "recurringReminders", label: t("recurringRemindersLabel"), description: t("recurringRemindersDescription") },
    { key: "newFeatures",        label: t("newFeaturesLabel"),        description: t("newFeaturesDescription") },
  ]

  function toggle(key: keyof NotifPrefs) {
    setPrefs((p) => ({ ...p, [key]: !p[key] }))
  }

  return (
    <div className="space-y-6">
      <SectionHeader title={t("sectionTitle")} description={t("sectionDescription")} />

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
          {t("saveButton")}
        </Button>
      </div>

      <SaveToast visible={saved} />
    </div>
  )
}
