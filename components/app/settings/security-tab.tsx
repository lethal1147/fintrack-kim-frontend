"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { IconAlertTriangle, IconLoader2 } from "@tabler/icons-react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useAuthStore } from "@/store/auth-store"
import { useSecurityStore } from "@/store/security-store"
import { dateUtil } from "@/lib/date-util"
import { SectionHeader } from "./section-header"
import { ChangePasswordDialog } from "./change-password-dialog"
import { TOTPSetupDialog } from "./totp-setup-dialog"
import { TOTPDisableDialog } from "./totp-disable-dialog"

// ─── component ────────────────────────────────────────────────────────────────

export function SecurityTab() {
  const t = useTranslations("settings.security")
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const { sessions, isLoading, error, fetchSessions, revokeSession } = useSecurityStore()

  const [changePwOpen, setChangePwOpen] = useState(false)
  const [totpSetupOpen, setTotpSetupOpen] = useState(false)
  const [totpDisableOpen, setTotpDisableOpen] = useState(false)
  const [revoking, setRevoking] = useState<string | null>(null)

  const totpEnabled = user?.totp_enabled ?? false

  useEffect(() => {
    fetchSessions()
  }, [fetchSessions])

  async function handleRevoke(id: string) {
    setRevoking(id)
    try {
      await revokeSession(id)
    } finally {
      setRevoking(null)
    }
  }

  async function handleLogoutAll() {
    await logout()
    router.push("/login")
  }

  function handleTOTPToggle() {
    if (totpEnabled) {
      setTotpDisableOpen(true)
    } else {
      setTotpSetupOpen(true)
    }
  }

  return (
    <div className="space-y-6">
      <SectionHeader title={t("sectionTitle")} description={t("sectionDescription")} />

      {/* Password */}
      <div>
        <p className="mb-3 text-sm font-semibold">{t("changePasswordHeading")}</p>
        <div className="border-border bg-card flex items-center justify-between gap-4 rounded-xl border p-4">
          <div>
            <p className="text-sm font-medium">{t("passwordLabel")}</p>
            <p className="text-muted-foreground mt-0.5 text-xs">{t("passwordDescription")}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setChangePwOpen(true)}>
            {t("changePasswordButton")}
          </Button>
        </div>
      </div>

      {/* 2FA */}
      <div className="border-border bg-card flex items-center justify-between gap-4 rounded-xl border p-4">
        <div>
          <p className="text-sm font-medium">{t("twoFactorLabel")}</p>
          <p className="text-muted-foreground mt-0.5 text-xs">
            {totpEnabled ? t("twoFactorEnabledDescription") : t("twoFactorDisabledDescription")}
          </p>
        </div>
        <Switch checked={totpEnabled} onCheckedChange={handleTOTPToggle} />
      </div>

      {/* Active sessions */}
      <div>
        <p className="mb-3 text-sm font-semibold">{t("activeSessionsHeading")}</p>
        <div className="border-border bg-card divide-border divide-y overflow-hidden rounded-xl border">
          {isLoading && sessions.length === 0 ? (
            <div className="flex justify-center px-4 py-6">
              <IconLoader2 className="text-muted-foreground size-5 animate-spin" />
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-muted-foreground px-4 py-4 text-sm">{t("noActiveSessions")}</div>
          ) : (
            sessions.map((s) => (
              <div key={s.id} className="flex items-center justify-between gap-3 px-4 py-3">
                <div>
                  <p className="text-sm font-medium">{s.device}</p>
                  <p className="text-muted-foreground text-xs">
                    {s.is_current
                      ? t("currentSession")
                      : t("lastActive", { time: dateUtil.fromNow(s.last_active_at) })}
                  </p>
                </div>
                {s.is_current ? (
                  <span className="text-xs font-medium text-emerald-600">{t("thisDevice")}</span>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={revoking === s.id}
                    onClick={() => handleRevoke(s.id)}
                    className="text-destructive hover:text-destructive h-7 px-2 text-xs"
                  >
                    {revoking === s.id ? (
                      <IconLoader2 className="size-3.5 animate-spin" />
                    ) : (
                      t("sessionSignOut")
                    )}
                  </Button>
                )}
              </div>
            ))
          )}
        </div>

        {error && (
          <div className="text-destructive mt-2 flex items-center gap-1.5 text-sm">
            <IconAlertTriangle className="size-3.5" />
            {error}
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Button variant="destructive" size="sm" onClick={handleLogoutAll}>
          {t("signOutAllButton")}
        </Button>
      </div>

      <ChangePasswordDialog open={changePwOpen} onClose={() => setChangePwOpen(false)} />
      <TOTPSetupDialog open={totpSetupOpen} onClose={() => setTotpSetupOpen(false)} />
      <TOTPDisableDialog open={totpDisableOpen} onClose={() => setTotpDisableOpen(false)} />
    </div>
  )
}
