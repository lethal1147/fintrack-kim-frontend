"use client"

import { useState } from "react"
import {
  IconUser,
  IconLock,
  IconBell,
  IconSettings,
  IconCheck,
  IconAlertTriangle,
  IconCamera,
} from "@tabler/icons-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { FeatureGate } from "@/components/feature-gate"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

// ─── mock user ───────────────────────────────────────────────────────────────

const MOCK_USER = {
  name:     "Kim Johnson",
  email:    "kim@example.com",
  phone:    "+1 (555) 012-3456",
  currency: "USD",
  timezone: "America/New_York",
  language: "en",
}

// ─── helpers ─────────────────────────────────────────────────────────────────

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
}

function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-base font-semibold">{title}</h2>
      {description && <p className="text-sm text-muted-foreground mt-0.5">{description}</p>}
    </div>
  )
}

function FieldRow({
  label,
  value,
  children,
}: {
  label: string
  value?: string
  children?: React.ReactNode
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-4 border-b border-border last:border-0">
      <div className="w-32 shrink-0">
        <p className="text-sm font-medium">{label}</p>
      </div>
      <div className="flex-1">
        {children ?? <p className="text-sm text-muted-foreground">{value}</p>}
      </div>
    </div>
  )
}

function SaveToast({ visible }: { visible: boolean }) {
  return (
    <div className={cn(
      "fixed bottom-6 right-6 flex items-center gap-2 bg-foreground text-background px-4 py-2.5 rounded-xl text-sm font-medium shadow-lg transition-all duration-300",
      visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
    )}>
      <IconCheck className="size-4" />
      Changes saved
    </div>
  )
}

// ─── Profile tab ─────────────────────────────────────────────────────────────

function ProfileTab() {
  const [name, setName]     = useState(MOCK_USER.name)
  const [email, setEmail]   = useState(MOCK_USER.email)
  const [phone, setPhone]   = useState(MOCK_USER.phone)
  const [saved, setSaved]   = useState(false)

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
            {initials(name || "?")}
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

// ─── Security tab ─────────────────────────────────────────────────────────────

function SecurityTab() {
  const [current, setCurrent]   = useState("")
  const [newPw, setNewPw]       = useState("")
  const [confirm, setConfirm]   = useState("")
  const [twoFa, setTwoFa]       = useState(false)
  const [saved, setSaved]       = useState(false)
  const [error, setError]       = useState("")

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (newPw && newPw !== confirm) {
      setError("New passwords don't match.")
      return
    }
    setError("")
    setSaved(true)
    setCurrent(""); setNewPw(""); setConfirm("")
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <SectionHeader title="Security" description="Manage your password and account security." />

      {/* Password */}
      <div>
        <p className="text-sm font-semibold mb-3">Change password</p>
        <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
          <div className="p-4 grid grid-cols-[160px_1fr] gap-4 items-center">
            <Label htmlFor="s-current" className="text-sm font-medium">Current password</Label>
            <Input id="s-current" type="password" placeholder="••••••••" value={current} onChange={(e) => setCurrent(e.target.value)} />
          </div>
          <div className="p-4 grid grid-cols-[160px_1fr] gap-4 items-center">
            <Label htmlFor="s-new" className="text-sm font-medium">New password</Label>
            <Input id="s-new" type="password" placeholder="••••••••" value={newPw} onChange={(e) => setNewPw(e.target.value)} />
          </div>
          <div className="p-4 grid grid-cols-[160px_1fr] gap-4 items-center">
            <Label htmlFor="s-confirm" className="text-sm font-medium">Confirm password</Label>
            <Input id="s-confirm" type="password" placeholder="••••••••" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          </div>
        </div>
        {error && (
          <div className="flex items-center gap-1.5 mt-2 text-sm text-destructive">
            <IconAlertTriangle className="size-3.5" />
            {error}
          </div>
        )}
      </div>

      {/* 2FA */}
      <FeatureGate feature="two_factor_auth">
        <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium">Two-factor authentication</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Add an extra layer of security with a one-time code on login.
            </p>
          </div>
          <Switch checked={twoFa} onCheckedChange={setTwoFa} />
        </div>
      </FeatureGate>

      {/* Active sessions */}
      <FeatureGate feature="active_sessions">
        <div>
          <p className="text-sm font-semibold mb-3">Active sessions</p>
          <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
            {[
              { device: "MacBook Pro — Chrome", location: "New York, US", current: true },
              { device: "iPhone 16 — Safari", location: "New York, US", current: false },
            ].map((s) => (
              <div key={s.device} className="px-4 py-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">{s.device}</p>
                  <p className="text-xs text-muted-foreground">{s.location}</p>
                </div>
                {s.current
                  ? <span className="text-xs text-emerald-600 font-medium">This device</span>
                  : <Button variant="ghost" size="sm" className="text-xs text-destructive hover:text-destructive h-7 px-2">Sign out</Button>
                }
              </div>
            ))}
          </div>
        </div>
      </FeatureGate>

      <div className="flex justify-end">
        <Button type="submit">Save security settings</Button>
      </div>

      <SaveToast visible={saved} />
    </form>
  )
}

// ─── Notifications tab ────────────────────────────────────────────────────────

function NotificationsTab() {
  const [prefs, setPrefs] = useState({
    weeklySummary:      true,
    budgetAlerts:       true,
    goalMilestones:     true,
    largeTransactions:  false,
    recurringReminders: true,
    newFeatures:        false,
  })
  const [saved, setSaved] = useState(false)

  function toggle(key: keyof typeof prefs) {
    setPrefs((p) => ({ ...p, [key]: !p[key] }))
  }

  const ITEMS: { key: keyof typeof prefs; label: string; description: string }[] = [
    { key: "weeklySummary",      label: "Weekly summary",        description: "Spending digest every Monday morning." },
    { key: "budgetAlerts",       label: "Budget alerts",         description: "Notify when a category nears or exceeds budget." },
    { key: "goalMilestones",     label: "Goal milestones",       description: "Celebrate when you hit 25%, 50%, 75%, 100% of a goal." },
    { key: "largeTransactions",  label: "Large transactions",    description: "Alert for transactions over $200." },
    { key: "recurringReminders", label: "Recurring reminders",   description: "Remind me 3 days before a bill is due." },
    { key: "newFeatures",        label: "Product updates",       description: "News about new features and improvements." },
  ]

  return (
    <div className="space-y-6">
      <SectionHeader title="Notifications" description="Choose what you want to be notified about." />

      <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
        {ITEMS.map((item) => (
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

// ─── Preferences tab ─────────────────────────────────────────────────────────

function PreferencesTab() {
  const [currency,  setCurrency]  = useState("USD")
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY")
  const [language,  setLanguage]  = useState("en")
  const [saved, setSaved]         = useState(false)

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

// ─── Danger Zone ─────────────────────────────────────────────────────────────

function DangerZone() {
  const [confirmText, setConfirmText] = useState("")

  return (
    <div className="space-y-6">
      <SectionHeader title="Danger Zone" description="Irreversible actions — proceed with caution." />

      <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-5 space-y-4">
        <div>
          <p className="text-sm font-semibold text-destructive">Delete account</p>
          <p className="text-xs text-muted-foreground mt-1">
            Permanently deletes your account and all associated data. This cannot be undone.
            Type <span className="font-mono font-semibold text-foreground">delete my account</span> to confirm.
          </p>
        </div>
        <Input
          placeholder="delete my account"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          className="border-destructive/30 focus-visible:ring-destructive/30"
        />
        <Button
          variant="destructive"
          disabled={confirmText !== "delete my account"}
          className="w-full"
        >
          Delete account permanently
        </Button>
      </div>
    </div>
  )
}

// ─── page ─────────────────────────────────────────────────────────────────────

const TAB_NAV = [
  { value: "profile",       label: "Profile",       icon: IconUser },
  { value: "security",      label: "Security",      icon: IconLock },
  { value: "notifications", label: "Notifications", icon: IconBell },
  { value: "preferences",   label: "Preferences",   icon: IconSettings },
]

export default function SettingsPage() {
  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your account and preferences</p>
      </div>

      <Tabs defaultValue="profile" orientation="vertical" className="gap-8 items-start">
        {/* Left nav */}
        <TabsList className="w-44 shrink-0 bg-transparent p-0 gap-0.5 rounded-none h-auto">
          {TAB_NAV.map(({ value, label, icon: Icon }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="w-full justify-start gap-2.5 px-3 py-2 rounded-lg text-sm font-medium
                data-active:bg-primary/10 data-active:text-primary data-active:shadow-none
                text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </TabsTrigger>
          ))}

          <div className="my-1 border-t border-border" />

          <TabsTrigger
            value="danger"
            className="w-full justify-start gap-2.5 px-3 py-2 rounded-lg text-sm font-medium
              data-active:bg-destructive/10 data-active:text-destructive data-active:shadow-none
              text-muted-foreground hover:bg-destructive/5 hover:text-destructive transition-colors"
          >
            <IconAlertTriangle className="size-4 shrink-0" />
            Danger zone
          </TabsTrigger>
        </TabsList>

        {/* Content panels — direct children so flex-1 fills remaining space */}
        <TabsContent value="profile"       className="mt-0 min-w-0"><ProfileTab /></TabsContent>
        <TabsContent value="security"      className="mt-0 min-w-0"><SecurityTab /></TabsContent>
        <TabsContent value="notifications" className="mt-0 min-w-0"><NotificationsTab /></TabsContent>
        <TabsContent value="preferences"   className="mt-0 min-w-0"><PreferencesTab /></TabsContent>
        <TabsContent value="danger"        className="mt-0 min-w-0"><DangerZone /></TabsContent>
      </Tabs>
    </div>
  )
}
