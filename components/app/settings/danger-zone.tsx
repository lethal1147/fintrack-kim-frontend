"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SectionHeader } from "./section-header"

// ─── constants ────────────────────────────────────────────────────────────────

const DELETE_CONFIRMATION_TEXT = "delete my account"

// ─── component ────────────────────────────────────────────────────────────────

export function DangerZone() {
  const [confirmText, setConfirmText] = useState("")

  return (
    <div className="space-y-6">
      <SectionHeader title="Danger Zone" description="Irreversible actions — proceed with caution." />

      <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-5 space-y-4">
        <div>
          <p className="text-sm font-semibold text-destructive">Delete account</p>
          <p className="text-xs text-muted-foreground mt-1">
            Permanently deletes your account and all associated data. This cannot be undone.
            Type <span className="font-mono font-semibold text-foreground">{DELETE_CONFIRMATION_TEXT}</span> to confirm.
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
        >
          Delete account permanently
        </Button>
      </div>
    </div>
  )
}
