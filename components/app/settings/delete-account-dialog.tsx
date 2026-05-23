"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { IconAlertTriangle, IconEye, IconEyeOff, IconLoader2 } from "@tabler/icons-react"
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

// ─── component ────────────────────────────────────────────────────────────────

type Props = {
  open:    boolean
  onClose: () => void
}

export function DeleteAccountDialog({ open, onClose }: Props) {
  const router = useRouter()
  const { isLoading, deleteAccount } = useAuthStore()

  const [password, setPassword]       = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError]             = useState<string | null>(null)

  function handleClose() {
    setPassword("")
    setShowPassword(false)
    setError(null)
    onClose()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      await deleteAccount(password)
      router.replace("/login")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Incorrect password")
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Confirm account deletion</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <p className="text-sm text-muted-foreground">
            Enter your password to permanently delete your account and all data.
            This cannot be undone.
          </p>

          <div className="space-y-1.5">
            <Label htmlFor="delete-password">Password</Label>
            <div className="relative">
              <Input
                id="delete-password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                disabled={isLoading}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <IconEyeOff className="size-4" /> : <IconEye className="size-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-1.5 text-sm text-destructive">
              <IconAlertTriangle className="size-3.5 shrink-0" />
              {error}
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" variant="destructive" disabled={isLoading || !password}>
              {isLoading ? (
                <><IconLoader2 className="size-4 animate-spin" /> Deleting…</>
              ) : (
                "Delete my account"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
