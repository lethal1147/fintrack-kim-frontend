"use client"

import { useState, useEffect } from "react"
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
import { useSecurityStore } from "@/store/security-store"
import type { TOTPSetupResult } from "@/lib/api-client"

// ─── constants ────────────────────────────────────────────────────────────────

type Step = "loading" | "scan" | "backup"

// ─── component ────────────────────────────────────────────────────────────────

type Props = {
  open:    boolean
  onClose: () => void
}

export function TOTPSetupDialog({ open, onClose }: Props) {
  const { isLoading, setupTOTP, confirmTOTP } = useSecurityStore()

  const [step, setStep]             = useState<Step>("loading")
  const [setup, setSetup]           = useState<TOTPSetupResult | null>(null)
  const [code, setCode]             = useState("")
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [error, setError]           = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setStep("loading")
    setCode("")
    setError(null)
    setupTOTP().then((result) => {
      if (result) {
        setSetup(result)
        setStep("scan")
      }
    })
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleClose() {
    setStep("loading")
    setSetup(null)
    setCode("")
    setError(null)
    onClose()
  }

  async function handleConfirm(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      const codes = await confirmTOTP(code)
      setBackupCodes(codes)
      setStep("backup")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid code")
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enable two-factor authentication</DialogTitle>
        </DialogHeader>

        {step === "loading" && (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Generating QR code…
          </div>
        )}

        {step === "scan" && setup && (
          <form onSubmit={handleConfirm} className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              Scan the QR code with your authenticator app (Google Authenticator, Authy, etc.),
              then enter the 6-digit code to confirm.
            </p>

            {/* QR code rendered via img tag — browser-safe */}
            <div className="flex justify-center py-2">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(setup.qr_code_uri)}&size=180x180`}
                alt="TOTP QR Code"
                className="rounded-lg border border-border"
                width={180}
                height={180}
              />
            </div>

            <details className="text-xs text-muted-foreground">
              <summary className="cursor-pointer hover:text-foreground">
                Can&apos;t scan? Enter code manually
              </summary>
              <p className="mt-1 font-mono break-all select-all bg-muted rounded p-2">
                {setup.secret}
              </p>
            </details>

            <div className="space-y-1.5">
              <Label htmlFor="totp-code">Verification code</Label>
              <Input
                id="totp-code"
                placeholder="123456"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                autoFocus
              />
            </div>

            {error && (
              <div className="flex items-center gap-1.5 text-sm text-destructive">
                <IconAlertTriangle className="size-3.5 shrink-0" />
                {error}
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
              <Button type="submit" disabled={isLoading || code.length !== 6}>
                {isLoading ? "Verifying…" : "Enable 2FA"}
              </Button>
            </DialogFooter>
          </form>
        )}

        {step === "backup" && (
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              Save these backup codes somewhere safe. Each code can be used once
              to log in if you lose access to your authenticator app.
            </p>
            <div className="grid grid-cols-2 gap-2 bg-muted rounded-lg p-3">
              {backupCodes.map((c) => (
                <code key={c} className="text-xs font-mono text-center py-0.5">
                  {c}
                </code>
              ))}
            </div>
            <DialogFooter>
              <Button onClick={handleClose}>I&apos;ve saved my backup codes</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
