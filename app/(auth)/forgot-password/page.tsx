"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  IconLockOpen,
  IconMailCheck,
  IconLoader2,
  IconEye,
  IconEyeOff,
  IconArrowLeft,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authApi } from "@/lib/api-client"
import { useTranslations } from "next-intl"

// ─── types ────────────────────────────────────────────────────────────────────

type Step = "email" | "code"

// ─── helpers ──────────────────────────────────────────────────────────────────

function maskEmail(email: string): string {
  const atIdx = email.indexOf("@")
  if (atIdx <= 0) return email
  return `${email[0]}***${email.slice(atIdx)}`
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function ForgotPasswordPage() {
  const t = useTranslations("auth.forgotPassword")
  const tCheck = useTranslations("auth.forgotPassword.checkEmail")
  const router = useRouter()

  const [step,           setStep]           = useState<Step>("email")
  const [email,          setEmail]          = useState("")
  const [otp,            setOtp]            = useState("")
  const [newPassword,    setNewPassword]    = useState("")
  const [confirmPw,      setConfirmPw]      = useState("")
  const [showPw,         setShowPw]         = useState(false)
  const [showConfirmPw,  setShowConfirmPw]  = useState(false)
  const [isLoading,      setIsLoading]      = useState(false)
  const [error,          setError]          = useState<string | null>(null)
  const [resendCooldown, setResendCooldown] = useState(0)

  const passwordsMatch = newPassword === confirmPw
  const canSubmitReset = otp.length > 0 && newPassword.length >= 8 && confirmPw.length > 0 && passwordsMatch

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    try {
      await authApi.forgotPasswordRequest(email)
      setStep("code")
      startResendCooldown()
    } catch {
      setError(t("errorSendFailed"))
    } finally {
      setIsLoading(false)
    }
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    if (!passwordsMatch) return
    setError(null)
    setIsLoading(true)
    try {
      await authApi.forgotPasswordReset(email, otp, newPassword)
      router.push("/login?reset=true")
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : tCheck("errorInvalidCode")
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleResend() {
    setError(null)
    try {
      await authApi.forgotPasswordRequest(email)
      startResendCooldown()
    } catch {
      setError(t("errorResendFailed"))
    }
  }

  function startResendCooldown() {
    const COOLDOWN_SECONDS = 30
    setResendCooldown(COOLDOWN_SECONDS)
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) { clearInterval(interval); return 0 }
        return prev - 1
      })
    }, 1000)
  }

  if (step === "code") {
    return (
      <div className="space-y-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <IconMailCheck className="size-6 text-primary" />
            <h2 className="text-2xl font-bold tracking-tight">{tCheck("title")}</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            {tCheck("subtitle")}{" "}
            <span className="font-medium text-foreground">{maskEmail(email)}</span>
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleReset}>
          <div className="space-y-1.5">
            <Label htmlFor="otp">{tCheck("verificationCodeLabel")}</Label>
            <Input
              id="otp"
              inputMode="numeric"
              maxLength={6}
              placeholder="123456"
              autoFocus
              autoComplete="one-time-code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="new-password">{tCheck("newPasswordLabel")}</Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showPw ? "text" : "password"}
                placeholder="••••••••"
                className="pr-10"
                autoComplete="new-password"
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isLoading}
                required
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPw ? <IconEyeOff className="size-4" /> : <IconEye className="size-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirm-password">{tCheck("confirmNewPasswordLabel")}</Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showConfirmPw ? "text" : "password"}
                placeholder="••••••••"
                className="pr-10"
                autoComplete="new-password"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                disabled={isLoading}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPw((v) => !v)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showConfirmPw ? <IconEyeOff className="size-4" /> : <IconEye className="size-4" />}
              </button>
            </div>
            {confirmPw.length > 0 && !passwordsMatch && (
              <p className="text-xs text-destructive">{tCheck("passwordsMismatch")}</p>
            )}
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading || !canSubmitReset}
          >
            {isLoading ? (
              <><IconLoader2 className="size-4 animate-spin" /> {tCheck("resettingButton")}</>
            ) : (
              tCheck("resetButton")
            )}
          </Button>
        </form>

        <div className="flex items-center justify-between text-sm">
          <button
            type="button"
            onClick={() => { setStep("email"); setOtp(""); setNewPassword(""); setConfirmPw(""); setError(null) }}
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <IconArrowLeft className="size-3.5" />
            {tCheck("changeEmail")}
          </button>

          <span className="text-muted-foreground">
            {tCheck("didntReceive")}{" "}
            <button
              type="button"
              onClick={handleResend}
              disabled={resendCooldown > 0}
              className="font-medium text-foreground hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resendCooldown > 0
                ? tCheck("resendCooldown", { seconds: resendCooldown })
                : tCheck("resend")}
            </button>
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <IconLockOpen className="size-6 text-primary" />
          <h2 className="text-2xl font-bold tracking-tight">{t("title")}</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          {t("subtitle")}
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSendCode}>
        <div className="space-y-1.5">
          <Label htmlFor="email">{t("emailLabel")}</Label>
          <Input
            id="email"
            type="email"
            placeholder={t("emailPlaceholder")}
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" className="w-full" size="lg" disabled={isLoading || !email}>
          {isLoading ? (
            <><IconLoader2 className="size-4 animate-spin" /> {t("sendingButton")}</>
          ) : (
            t("sendCodeButton")
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        <Link
          href="/login"
          className="flex items-center justify-center gap-1 hover:text-foreground transition-colors"
        >
          <IconArrowLeft className="size-3.5" />
          {t("backToSignIn")}
        </Link>
      </p>
    </div>
  )
}
