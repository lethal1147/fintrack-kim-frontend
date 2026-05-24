"use client"

import { useState } from "react"
import { IconAlertTriangle } from "@tabler/icons-react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { useAuthStore } from "@/store/auth-store"
import { useSecurityStore } from "@/store/security-store"

// ─── constants ────────────────────────────────────────────────────────────────

type Step = "request" | "change"

// ─── component ────────────────────────────────────────────────────────────────

type Props = {
  open: boolean
  onClose: () => void
}

export function ChangePasswordDialog({ open, onClose }: Props) {
  const t = useTranslations("settings.changePasswordDialog")
  const { user } = useAuthStore()
  const { isLoading, requestPasswordChange, changePassword } = useSecurityStore()

  const [step, setStep] = useState<Step>("request")
  const [otp, setOtp] = useState("")
  const [newPw, setNewPw] = useState("")
  const [confirmPw, setConfirmPw] = useState("")
  const [error, setError] = useState<string | null>(null)

  function handleClose() {
    setStep("request")
    setOtp("")
    setNewPw("")
    setConfirmPw("")
    setError(null)
    onClose()
  }

  async function handleSendCode() {
    setError(null)
    try {
      await requestPasswordChange()
      setStep("change")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t("errorSendFailed"))
    }
  }

  async function handleChange(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (newPw !== confirmPw) {
      setError(t("errorPasswordMismatch"))
      return
    }
    if (newPw.length < 8) {
      setError(t("errorMinLength"))
      return
    }
    try {
      await changePassword(otp, newPw)
      handleClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t("errorChangeFailed"))
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>

        {step === "request" ? (
          <div className="space-y-4 py-2">
            <p className="text-muted-foreground text-sm">
              {t("requestStepDescription", { email: user?.email ?? "" })}
            </p>
            {error && (
              <div className="text-destructive flex items-center gap-1.5 text-sm">
                <IconAlertTriangle className="size-3.5 shrink-0" />
                {error}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                {t("cancelButton")}
              </Button>
              <Button onClick={handleSendCode} disabled={isLoading}>
                {isLoading ? t("sendingButton") : t("sendCodeButton")}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <form onSubmit={handleChange} className="space-y-4 py-2">
            <p className="text-muted-foreground text-sm">
              {t("changeStepDescription", { email: user?.email ?? "" })}
            </p>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="cp-otp">{t("verificationCodeLabel")}</Label>
                <Input
                  id="cp-otp"
                  placeholder={t("verificationCodePlaceholder")}
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  autoFocus
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cp-new">{t("newPasswordLabel")}</Label>
                <Input
                  id="cp-new"
                  type="password"
                  placeholder="••••••••"
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cp-confirm">{t("confirmPasswordLabel")}</Label>
                <Input
                  id="cp-confirm"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                />
              </div>
            </div>
            {error && (
              <div className="text-destructive flex items-center gap-1.5 text-sm">
                <IconAlertTriangle className="size-3.5 shrink-0" />
                {error}
              </div>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setStep("request")}>
                {t("resendCodeButton")}
              </Button>
              <Button type="submit" disabled={isLoading || !otp || !newPw || !confirmPw}>
                {isLoading ? t("changingButton") : t("changeButton")}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
