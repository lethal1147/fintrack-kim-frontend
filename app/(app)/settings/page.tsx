"use client";

import {
  IconUser,
  IconLock,
  // IconBell,
  IconAlertTriangle,
} from "@tabler/icons-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ProfileTab } from "@/components/app/settings/profile-tab";
import { SecurityTab } from "@/components/app/settings/security-tab";
// import { NotificationsTab } from "@/components/app/settings/notifications-tab";
import { DangerZone } from "@/components/app/settings/danger-zone";

// ─── constants ────────────────────────────────────────────────────────────────

const SETTINGS_TABS = [
  { value: "profile", label: "Profile", icon: IconUser },
  { value: "security", label: "Security", icon: IconLock },
  // { value: "notifications", label: "Notifications", icon: IconBell },
  // { value: "preferences", label: "Preferences", icon: IconSettings },
];

// ─── page ─────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage your account and preferences
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
            Danger zone
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
        {/* <TabsContent value="preferences"   className="mt-0 min-w-0"><PreferencesTab /></TabsContent> */}
        <TabsContent value="danger" className="mt-0 min-w-0">
          <DangerZone />
        </TabsContent>
      </Tabs>
    </div>
  );
}
