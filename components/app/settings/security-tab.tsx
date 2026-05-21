"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { IconAlertTriangle, IconLoader2 } from "@tabler/icons-react"
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
        title="Security"
        description="Manage your password and account security."
      />

      {/* Password */}
      <div>
        <p className="text-sm font-semibold mb-3">Change password</p>
        <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium">Password</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Use a verification code sent to your email to set a new password.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setChangePwOpen(true)}>
            Change password
          </Button>
        </div>
      </div>

      {/* 2FA */}
      <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium">Two-factor authentication</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {totpEnabled
              ? "2FA is enabled — your account requires an authenticator code on login."
              : "Add an extra layer of security with a one-time code on login."}
          </p>
        </div>
        <Switch checked={totpEnabled} onCheckedChange={handleTOTPToggle} />
      </div>

      {/* Active sessions */}
      <div>
        <p className="text-sm font-semibold mb-3">Active sessions</p>
        <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
          {isLoading && sessions.length === 0 ? (
            <div className="px-4 py-6 flex justify-center">
              <IconLoader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          ) : sessions.length === 0 ? (
            <div className="px-4 py-4 text-sm text-muted-foreground">No active sessions.</div>
          ) : (
            sessions.map((s) => (
              <div key={s.id} className="px-4 py-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">{s.device}</p>
                  <p className="text-xs text-muted-foreground">
                    {s.is_current ? "Current session" : `Last active ${dateUtil.fromNow(s.last_active_at)}`}
                  </p>
                </div>
                {s.is_current ? (
                  <span className="text-xs text-emerald-600 font-medium">This device</span>
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
                      "Sign out"
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
          Sign out all devices
        </Button>
      </div>

      <ChangePasswordDialog open={changePwOpen} onClose={() => setChangePwOpen(false)} />
      <TOTPSetupDialog open={totpSetupOpen} onClose={() => setTotpSetupOpen(false)} />
      <TOTPDisableDialog open={totpDisableOpen} onClose={() => setTotpDisableOpen(false)} />
    </div>
  )
}
