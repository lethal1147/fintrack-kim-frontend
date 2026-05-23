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
import { useSecurityStore } from "@/store/security-store"

// ─── component ────────────────────────────────────────────────────────────────

type Props = {
  open:    boolean
  onClose: () => void
}

export function TOTPDisableDialog({ open, onClose }: Props) {
  const t = useTranslations("settings.totpDisableDialog")
  const { isLoading, disableTOTP } = useSecurityStore()

  const [code, setCode]   = useState("")
  const [error, setError] = useState<string | null>(null)

  function handleClose() {
    setCode("")
    setError(null)
    onClose()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      await disableTOTP(code)
      handleClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t("errorFallback"))
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <p className="text-sm text-muted-foreground">
            {t("description")}
          </p>

          <div className="space-y-1.5">
            <Label htmlFor="disable-code">{t("codeLabel")}</Label>
            <Input
              id="disable-code"
              placeholder={t("codePlaceholder")}
              value={code}
              onChange={(e) => setCode(e.target.value.trim())}
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
            <Button type="button" variant="outline" onClick={handleClose}>{t("cancelButton")}</Button>
            <Button type="submit" variant="destructive" disabled={isLoading || !code}>
              {isLoading ? t("disablingButton") : t("disableButton")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
