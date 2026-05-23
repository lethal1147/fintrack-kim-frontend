"use client";

import {
  IconUser,
  IconLock,
  IconSettings,
  IconAlertTriangle,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ProfileTab } from "@/components/app/settings/profile-tab";
import { SecurityTab } from "@/components/app/settings/security-tab";
// import { NotificationsTab } from "@/components/app/settings/notifications-tab";
import { PreferencesTab } from "@/components/app/settings/preferences-tab";
import { DangerZone } from "@/components/app/settings/danger-zone";

// ─── page ─────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const t = useTranslations("settings")

  const SETTINGS_TABS = [
    { value: "profile",     label: t("tabProfile"),     icon: IconUser     },
    { value: "security",    label: t("tabSecurity"),    icon: IconLock     },
    { value: "preferences", label: t("tabPreferences"), icon: IconSettings },
  ];

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {t("subtitle")}
        </p>
      </div>

      <Tabs
        defaultValue="profile"
        orientation="vertical"
        className="gap-8 items-start"
      >
        {/* Left nav */}
        <TabsList className="w-44 shrink-0 bg-transparent p-0 gap-0.5 rounded-none h-auto">
          {SETTINGS_TABS.map(({ value, label, icon: Icon }) => (
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
        <TabsContent value="preferences" className="mt-0 min-w-0"><PreferencesTab /></TabsContent>
        <TabsContent value="danger" className="mt-0 min-w-0">
          <DangerZone />
        </TabsContent>
      </Tabs>
    </div>
  );
}
