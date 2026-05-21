"use client"

import { useState, useRef, useEffect } from "react"
import { IconCamera, IconLoader2 } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { stringUtil } from "@/lib/string-util"
import { useAuthStore } from "@/store/auth-store"
import { SectionHeader } from "./section-header"
import { SaveToast } from "./save-toast"

// ─── constants ────────────────────────────────────────────────────────────────

const ACCEPTED_IMAGE_TYPES = "image/jpeg,image/png,image/webp"
const MAX_AVATAR_BYTES = 5 * 1024 * 1024

// ─── component ────────────────────────────────────────────────────────────────

export function ProfileTab() {
  const { user, updateProfile, uploadAvatar, isLoading } = useAuthStore()

  const [name, setName]         = useState(user?.name ?? "")
  const [email, setEmail]       = useState(user?.email ?? "")
  const [saved, setSaved]       = useState(false)
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [error, setError]       = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Sync fields when user loads from store (async hydration)
  useEffect(() => {
    if (user) {
      setName(user.name)
      setEmail(user.email)
    }
  }, [user])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      await updateProfile(name, email)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save profile")
    }
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > MAX_AVATAR_BYTES) {
      setError("Image must be under 5 MB")
      return
    }

    setError(null)
    setAvatarUploading(true)
    try {
      await uploadAvatar(file)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to upload avatar")
    } finally {
      setAvatarUploading(false)
      // Reset the input so the same file can be re-selected after an error
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const displayName = name || user?.name || "?"

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <SectionHeader
        title="Profile"
        description="Your personal details shown across FinTrack."
      />

      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="relative size-20 shrink-0">
          {user?.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={displayName}
              className="size-20 rounded-full object-cover"
            />
          ) : (
            <div className="size-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
              {stringUtil.initials(displayName)}
            </div>
          )}

          {/* Upload overlay during upload */}
          {avatarUploading && (
            <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
              <IconLoader2 className="size-5 text-white animate-spin" />
            </div>
          )}

          {/* Camera button */}
          <button
            type="button"
            disabled={avatarUploading}
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-1 -right-1 size-7 rounded-full bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-50"
          >
            <IconCamera className="size-3.5 text-muted-foreground" />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_IMAGE_TYPES}
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>
        <div>
          <p className="text-sm font-medium">{displayName}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{user?.email ?? email}</p>
        </div>
      </div>

      {/* Fields */}
      <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
        <div className="p-4 grid grid-cols-[120px_1fr] gap-4 items-center">
          <Label htmlFor="p-name" className="text-sm font-medium">Full name</Label>
          <Input id="p-name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="p-4 grid grid-cols-[120px_1fr] gap-4 items-center">
          <Label htmlFor="p-email" className="text-sm font-medium">Email</Label>
          <Input id="p-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving…" : "Save profile"}
        </Button>
      </div>

      <SaveToast visible={saved} />
    </form>
  )
}
