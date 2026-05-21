"use client"

import { useState } from "react"
import { IconAlertTriangle } from "@tabler/icons-react"
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
  open:    boolean
  onClose: () => void
}

export function ChangePasswordDialog({ open, onClose }: Props) {
  const { user } = useAuthStore()
  const { isLoading, requestPasswordChange, changePassword } = useSecurityStore()

  const [step, setStep]           = useState<Step>("request")
  const [otp, setOtp]             = useState("")
  const [newPw, setNewPw]         = useState("")
  const [confirmPw, setConfirmPw] = useState("")
  const [error, setError]         = useState<string | null>(null)

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
      setError(err instanceof Error ? err.message : "Failed to send code")
    }
  }

  async function handleChange(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (newPw !== confirmPw) {
      setError("Passwords don't match")
      return
    }
    if (newPw.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }
    try {
      await changePassword(otp, newPw)
      handleClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to change password")
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change password</DialogTitle>
        </DialogHeader>

        {step === "request" ? (
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              We&apos;ll send a 6-digit verification code to{" "}
              <span className="font-medium text-foreground">{user?.email}</span>.
            </p>
            {error && (
              <div className="flex items-center gap-1.5 text-sm text-destructive">
                <IconAlertTriangle className="size-3.5 shrink-0" />
                {error}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>Cancel</Button>
              <Button onClick={handleSendCode} disabled={isLoading}>
                {isLoading ? "Sending…" : "Send verification code"}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <form onSubmit={handleChange} className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              Enter the code sent to <span className="font-medium text-foreground">{user?.email}</span>{" "}
              and your new password.
            </p>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="cp-otp">Verification code</Label>
                <Input
                  id="cp-otp"
                  placeholder="123456"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  autoFocus
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cp-new">New password</Label>
                <Input
                  id="cp-new"
                  type="password"
                  placeholder="••••••••"
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cp-confirm">Confirm password</Label>
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
              <div className="flex items-center gap-1.5 text-sm text-destructive">
                <IconAlertTriangle className="size-3.5 shrink-0" />
                {error}
              </div>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setStep("request")}>
                Resend code
              </Button>
              <Button type="submit" disabled={isLoading || !otp || !newPw || !confirmPw}>
                {isLoading ? "Changing…" : "Change password"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
