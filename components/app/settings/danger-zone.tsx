"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SectionHeader } from "./section-header"
import { DeleteAccountDialog } from "./delete-account-dialog"

// ─── component ────────────────────────────────────────────────────────────────

export function DangerZone() {
  const t = useTranslations("settings.dangerZone")
  const DELETE_CONFIRMATION_TEXT = t("deleteConfirmationText")

  const [confirmText, setConfirmText] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <div className="space-y-6">
      <SectionHeader title={t("sectionTitle")} description={t("sectionDescription")} />

      <div className="border-destructive/40 bg-destructive/5 space-y-4 rounded-xl border p-5">
        <div>
          <p className="text-destructive text-sm font-semibold">{t("deleteAccountHeading")}</p>
          <p className="text-muted-foreground mt-1 text-xs">
            {t("deleteAccountDescription")}{" "}
            <span className="text-foreground font-mono font-semibold">
              {DELETE_CONFIRMATION_TEXT}
            </span>{" "}
            {t("deleteConfirmationInstruction")}
          </p>
        </div>
        <Input
          placeholder={DELETE_CONFIRMATION_TEXT}
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          className="border-destructive/30 focus-visible:ring-destructive/30"
        />
        <Button
          variant="destructive"
          disabled={confirmText !== DELETE_CONFIRMATION_TEXT}
          className="w-full"
          onClick={() => setDialogOpen(true)}
        >
          {t("deleteButton")}
        </Button>
      </div>

      <DeleteAccountDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </div>
  )
}
