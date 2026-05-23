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

  const [changePwOpen, setChangePwOpen]   = useState(false)
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
      <SectionHeader
        title={t("sectionTitle")}
        description={t("sectionDescription")}
      />

      {/* Password */}
      <div>
        <p className="text-sm font-semibold mb-3">{t("changePasswordHeading")}</p>
        <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium">{t("passwordLabel")}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t("passwordDescription")}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setChangePwOpen(true)}>
            {t("changePasswordButton")}
          </Button>
        </div>
      </div>

      {/* 2FA */}
      <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium">{t("twoFactorLabel")}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {totpEnabled
              ? t("twoFactorEnabledDescription")
              : t("twoFactorDisabledDescription")}
          </p>
        </div>
        <Switch checked={totpEnabled} onCheckedChange={handleTOTPToggle} />
      </div>

      {/* Active sessions */}
      <div>
        <p className="text-sm font-semibold mb-3">{t("activeSessionsHeading")}</p>
        <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
          {isLoading && sessions.length === 0 ? (
            <div className="px-4 py-6 flex justify-center">
              <IconLoader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          ) : sessions.length === 0 ? (
            <div className="px-4 py-4 text-sm text-muted-foreground">{t("noActiveSessions")}</div>
          ) : (
            sessions.map((s) => (
              <div key={s.id} className="px-4 py-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">{s.device}</p>
                  <p className="text-xs text-muted-foreground">
                    {s.is_current ? t("currentSession") : t("lastActive", { time: dateUtil.fromNow(s.last_active_at) })}
                  </p>
                </div>
                {s.is_current ? (
                  <span className="text-xs text-emerald-600 font-medium">{t("thisDevice")}</span>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={revoking === s.id}
                    onClick={() => handleRevoke(s.id)}
                    className="text-xs text-destructive hover:text-destructive h-7 px-2"
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
          <div className="flex items-center gap-1.5 mt-2 text-sm text-destructive">
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
