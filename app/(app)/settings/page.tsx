"use client"

import { IconUser, IconLock, IconSettings, IconAlertTriangle } from "@tabler/icons-react"
import { useTranslations } from "next-intl"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ProfileTab } from "@/components/app/settings/profile-tab"
import { SecurityTab } from "@/components/app/settings/security-tab"
// import { NotificationsTab } from "@/components/app/settings/notifications-tab";
import { PreferencesTab } from "@/components/app/settings/preferences-tab"
import { DangerZone } from "@/components/app/settings/danger-zone"

// ─── page ─────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const t = useTranslations("settings")

  const SETTINGS_TABS = [
    { value: "profile", label: t("tabProfile"), icon: IconUser },
    { value: "security", label: t("tabSecurity"), icon: IconLock },
    { value: "preferences", label: t("tabPreferences"), icon: IconSettings },
  ]

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground mt-0.5 text-sm">{t("subtitle")}</p>
      </div>

      <Tabs defaultValue="profile" orientation="vertical" className="items-start gap-8">
        {/* Left nav */}
        <TabsList className="h-auto w-44 shrink-0 gap-0.5 rounded-none bg-transparent p-0">
          {SETTINGS_TABS.map(({ value, label, icon: Icon }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="data-active:bg-primary/10 data-active:text-primary text-muted-foreground hover:bg-muted hover:text-foreground w-full justify-start gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors data-active:shadow-none"
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </TabsTrigger>
          ))}

          <div className="border-border my-1 border-t" />

          <TabsTrigger
            value="danger"
            className="data-active:bg-destructive/10 data-active:text-destructive text-muted-foreground hover:bg-destructive/5 hover:text-destructive w-full justify-start gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors data-active:shadow-none"
          >
            <IconAlertTriangle className="size-4 shrink-0" />
            {t("tabDangerZone")}
          </TabsTrigger>
        </TabsList>

        {/* Content panels */}
        <TabsContent value="profile" className="mt-0 min-w-0">
          <ProfileTab />
        </TabsContent>
        <TabsContent value="security" className="mt-0 min-w-0">
          <SecurityTab />
        </TabsContent>
        {/* <TabsContent value="notifications" className="mt-0 min-w-0"><NotificationsTab /></TabsContent> */}
        <TabsContent value="preferences" className="mt-0 min-w-0">
          <PreferencesTab />
        </TabsContent>
        <TabsContent value="danger" className="mt-0 min-w-0">
          <DangerZone />
        </TabsContent>
      </Tabs>
    </div>
  )
}
