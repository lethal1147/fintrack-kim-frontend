"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { IconEye, IconEyeOff, IconLoader2 } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuthStore } from "@/store/auth-store"
import { useTranslations } from "next-intl"

export default function RegisterPage() {
  const t = useTranslations("auth.register")
  const router = useRouter()
  const { register, isLoading } = useAuthStore()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError(t("errorPasswordMismatch"))
      return
    }

    try {
      await register(name, email, password)
      router.push("/dashboard")
    } catch {
      setError(useAuthStore.getState().error ?? t("errorFallback"))
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h2 className="text-2xl font-bold tracking-tight">{t("title")}</h2>
        <p className="text-muted-foreground text-sm">{t("subtitle")}</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1.5">
          <Label htmlFor="name">{t("fullNameLabel")}</Label>
          <Input
            id="name"
            type="text"
            placeholder={t("fullNamePlaceholder")}
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">{t("emailLabel")}</Label>
          <Input
            id="email"
            type="email"
            placeholder={t("emailPlaceholder")}
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">{t("passwordLabel")}</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder={t("passwordPlaceholder")}
              autoComplete="new-password"
              className="pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="text-muted-foreground hover:text-foreground absolute inset-y-0 right-0 flex items-center px-3 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <IconEyeOff className="size-4" /> : <IconEye className="size-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirm-password">{t("confirmPasswordLabel")}</Label>
          <div className="relative">
            <Input
              id="confirm-password"
              type={showConfirm ? "text" : "password"}
              placeholder={t("confirmPasswordPlaceholder")}
              autoComplete="new-password"
              className="pr-10"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="text-muted-foreground hover:text-foreground absolute inset-y-0 right-0 flex items-center px-3 transition-colors"
              tabIndex={-1}
            >
              {showConfirm ? <IconEyeOff className="size-4" /> : <IconEye className="size-4" />}
            </button>
          </div>
        </div>

        {error && <p className="text-destructive text-sm">{error}</p>}

        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
          {isLoading ? (
            <>
              <IconLoader2 className="size-4 animate-spin" /> {t("submittingButton")}
            </>
          ) : (
            t("submitButton")
          )}
        </Button>

        <p className="text-muted-foreground text-center text-xs">
          {t("termsText")}{" "}
          <Link
            href="/terms"
            className="hover:text-foreground underline underline-offset-4 transition-colors"
          >
            {t("termsLink")}
          </Link>{" "}
          {t("andText")}{" "}
          <Link
            href="/privacy"
            className="hover:text-foreground underline underline-offset-4 transition-colors"
          >
            {t("privacyLink")}
          </Link>
        </p>
      </form>

      {/* Footer */}
      <p className="text-muted-foreground text-center text-sm">
        {t("alreadyHaveAccount")}{" "}
        <Link
          href="/login"
          className="text-foreground hover:text-primary font-medium underline underline-offset-4 transition-colors"
        >
          {t("signInLink")}
        </Link>
      </p>
    </div>
  )
}
