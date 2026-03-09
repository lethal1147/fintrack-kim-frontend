"use client"

import { useState } from "react"
import Link from "next/link"
import { IconEye, IconEyeOff, IconBrandGoogle } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1.5">
        <h2 className="text-2xl font-bold tracking-tight">Create an account</h2>
        <p className="text-sm text-muted-foreground">
          Start your financial journey today — it&apos;s free
        </p>
      </div>

      {/* Social signup */}
      <Button variant="outline" className="w-full gap-2" size="lg">
        <IconBrandGoogle className="size-4" />
        Sign up with Google
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
      <form className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Your name"
            autoComplete="name"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Min. 8 characters"
              autoComplete="new-password"
              className="pr-10"
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

        <div className="space-y-1.5">
          <Label htmlFor="confirm-password">Confirm password</Label>
          <div className="relative">
            <Input
              id="confirm-password"
              type={showConfirm ? "text" : "password"}
              placeholder="Repeat your password"
              autoComplete="new-password"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
            >
              {showConfirm ? (
                <IconEyeOff className="size-4" />
              ) : (
                <IconEye className="size-4" />
              )}
            </button>
          </div>
        </div>

        <Button type="submit" className="w-full" size="lg">
          Create account
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          By creating an account you agree to our{" "}
          <Link href="/terms" className="underline underline-offset-4 hover:text-foreground transition-colors">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline underline-offset-4 hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
        </p>
      </form>

      {/* Footer */}
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-foreground hover:text-primary transition-colors underline underline-offset-4"
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}
