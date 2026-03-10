"use client"

import { useState } from "react"
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

// ─── component ────────────────────────────────────────────────────────────────

export function PreferencesTab() {
  const [currency,   setCurrency]   = useState("USD")
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY")
  const [language,   setLanguage]   = useState("en")
  const [saved, setSaved]           = useState(false)

  return (
    <div className="space-y-6">
      <SectionHeader title="Preferences" description="Localisation and display settings." />

      <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
        <div className="p-4 grid grid-cols-[160px_1fr] gap-4 items-center">
          <Label className="text-sm font-medium">Currency</Label>
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD — US Dollar</SelectItem>
              <SelectItem value="EUR">EUR — Euro</SelectItem>
              <SelectItem value="GBP">GBP — British Pound</SelectItem>
              <SelectItem value="JPY">JPY — Japanese Yen</SelectItem>
              <SelectItem value="CAD">CAD — Canadian Dollar</SelectItem>
              <SelectItem value="AUD">AUD — Australian Dollar</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="p-4 grid grid-cols-[160px_1fr] gap-4 items-center">
          <Label className="text-sm font-medium">Date format</Label>
          <Select value={dateFormat} onValueChange={setDateFormat}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
              <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
              <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="p-4 grid grid-cols-[160px_1fr] gap-4 items-center">
          <Label className="text-sm font-medium">Language</Label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Español</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="de">Deutsch</SelectItem>
              <SelectItem value="ja">日本語</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
