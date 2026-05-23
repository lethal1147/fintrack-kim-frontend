"use client"

import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SectionHeader } from "./section-header"
import { SaveToast } from "./save-toast"
import { usePreferencesStore } from "@/store/preferences-store"
import type { Locale } from "@/lib/i18n-config"
import { useState } from "react"

// ─── component ────────────────────────────────────────────────────────────────

export function PreferencesTab() {
  const t = useTranslations("settings.preferences")
  const { locale, setLocale, isLoading } = usePreferencesStore()
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    await setLocale(locale)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="space-y-6">
      <SectionHeader title={t("sectionTitle")} description={t("sectionDescription")} />

      <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
        <div className="p-4 grid grid-cols-[160px_1fr] gap-4 items-center">
          <Label className="text-sm font-medium">{t("languageLabel")}</Label>
          <Select value={locale} onValueChange={(v) => setLocale(v as Locale)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">{t("langEnglish")}</SelectItem>
              <SelectItem value="th">{t("langThai")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading}>
          {t("saveButton")}
        </Button>
      </div>

      <SaveToast visible={saved} />
    </div>
  )
}
