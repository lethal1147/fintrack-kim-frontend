"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { IconEye, IconEyeOff, IconBrandGoogle, IconLoader2, IconShieldLock } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuthStore } from "@/store/auth-store"

export default function LoginPage() {
  const router = useRouter()
  const { login, verifyTOTP, isLoading, totpChallengeToken } = useAuthStore()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [totpCode, setTotpCode] = useState("")
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      await login(email, password)
      // If TOTP is required, totpChallengeToken is now set — stay on page to show 2FA step.
      // If not, we're logged in.
      if (!useAuthStore.getState().totpChallengeToken) {
        router.push("/dashboard")
      }
    } catch {
      setError(useAuthStore.getState().error ?? "Invalid email or password")
    }
  }

  async function handleTOTPSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      await verifyTOTP(totpCode)
      router.push("/dashboard")
    } catch {
      setError(useAuthStore.getState().error ?? "Invalid code")
    }
  }

  if (totpChallengeToken) {
    return (
      <div className="space-y-8">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <IconShieldLock className="size-6 text-primary" />
            <h2 className="text-2xl font-bold tracking-tight">Two-factor authentication</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Enter the 6-digit code from your authenticator app, or a backup code.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleTOTPSubmit}>
          <div className="space-y-1.5">
            <Label htmlFor="totp-code">Verification code</Label>
            <Input
              id="totp-code"
              placeholder="123456 or XXXXX-XXXXX"
              value={totpCode}
              onChange={(e) => setTotpCode(e.target.value.trim())}
              autoFocus
              disabled={isLoading}
              required
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full" size="lg" disabled={isLoading || !totpCode}>
            {isLoading ? (
              <><IconLoader2 className="size-4 animate-spin" /> Verifying…</>
            ) : (
              "Verify"
            )}
          </Button>
        </form>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1.5">
        <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
        <p className="text-sm text-muted-foreground">
          Sign in to your account to continue
        </p>
      </div>

      {/* Social login */}
      <Button variant="outline" className="w-full gap-2" size="lg" disabled>
        <IconBrandGoogle className="size-4" />
        Continue with Google
      </Button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-background px-3 text-muted-foreground">or continue with email</span>
        </div>
      </div>

      {/* Form */}
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="current-password"
              className="pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <IconEyeOff className="size-4" />
              ) : (
                <IconEye className="size-4" />
              )}
            </button>
          </div>
        </div>

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
          {isLoading ? (
            <><IconLoader2 className="size-4 animate-spin" /> Signing in…</>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>

      {/* Footer */}
      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-foreground hover:text-primary transition-colors underline underline-offset-4"
        >
          Create one
        </Link>
      </p>
    </div>
  )
}
