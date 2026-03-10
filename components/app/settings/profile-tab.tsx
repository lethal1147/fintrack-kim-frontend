"use client"

import { useState } from "react"
import { IconCamera } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { stringUtil } from "@/lib/string-util"
import { SectionHeader } from "./section-header"
import { SaveToast } from "./save-toast"

// ─── constants ────────────────────────────────────────────────────────────────

const MOCK_USER = {
  name:     "Kim Johnson",
  email:    "kim@example.com",
  phone:    "+1 (555) 012-3456",
  currency: "USD",
  timezone: "America/New_York",
  language: "en",
}

// ─── component ────────────────────────────────────────────────────────────────

export function ProfileTab() {
  const [name, setName]   = useState(MOCK_USER.name)
  const [email, setEmail] = useState(MOCK_USER.email)
  const [phone, setPhone] = useState(MOCK_USER.phone)
  const [saved, setSaved] = useState(false)

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <SectionHeader
        title="Profile"
        description="Your personal details shown across FinTrack."
      />

      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="relative size-20 shrink-0">
          <div className="size-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
            {stringUtil.initials(name || "?")}
          </div>
          <button
            type="button"
            className="absolute -bottom-1 -right-1 size-7 rounded-full bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors"
          >
            <IconCamera className="size-3.5 text-muted-foreground" />
          </button>
        </div>
        <div>
          <p className="text-sm font-medium">{name || "—"}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{email}</p>
        </div>
      </div>

      {/* Fields */}
      <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
        <div className="p-4 grid grid-cols-[120px_1fr] gap-4 items-center">
          <Label htmlFor="p-name" className="text-sm font-medium">Full name</Label>
          <Input id="p-name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="p-4 grid grid-cols-[120px_1fr] gap-4 items-center">
          <Label htmlFor="p-email" className="text-sm font-medium">Email</Label>
          <Input id="p-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="p-4 grid grid-cols-[120px_1fr] gap-4 items-center">
          <Label htmlFor="p-phone" className="text-sm font-medium">Phone</Label>
          <Input id="p-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit">Save profile</Button>
      </div>

      <SaveToast visible={saved} />
    </form>
  )
}
