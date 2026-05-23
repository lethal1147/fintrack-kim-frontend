"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  IconEye,
  IconEyeOff,
  IconLoader2,
  IconShieldLock,
  IconCircleCheck,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth-store";
import { useTranslations } from "next-intl";

function ResetSuccessBanner() {
  const t = useTranslations("auth.login");
  const searchParams = useSearchParams();
  if (searchParams.get("reset") !== "true") return null;
  return (
    <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
      <IconCircleCheck className="size-4 shrink-0" />
      {t("resetSuccessBanner")}
    </div>
  );
}

export default function LoginPage() {
  const t = useTranslations("auth.login");
  const tTotp = useTranslations("auth.login.totp");
  const router = useRouter();
  const { login, verifyTOTP, isLoading, totpChallengeToken } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [totpCode, setTotpCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      if (!useAuthStore.getState().totpChallengeToken) {
        router.push("/dashboard");
      }
    } catch {
      setError(useAuthStore.getState().error ?? t("errorFallback"));
    }
  }

  async function handleTOTPSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await verifyTOTP(totpCode);
      router.push("/dashboard");
    } catch {
      setError(useAuthStore.getState().error ?? tTotp("errorFallback"));
    }
  }

  if (totpChallengeToken) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center justify-center size-14 rounded-2xl bg-primary/10">
            <IconShieldLock className="size-7 text-primary" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-2xl font-bold tracking-tight">
              {tTotp("title")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {tTotp("subtitle")}
            </p>
          </div>
        </div>

        <form className="space-y-5" onSubmit={handleTOTPSubmit}>
          <div className="space-y-1.5">
            <Label htmlFor="totp-code">{tTotp("codeLabel")}</Label>
            <Input
              id="totp-code"
              placeholder={tTotp("codePlaceholder")}
              value={totpCode}
              onChange={(e) => setTotpCode(e.target.value.trim())}
              autoFocus
              disabled={isLoading}
              required
              className="text-center font-mono tracking-widest"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading || !totpCode}
          >
            {isLoading ? (
              <>
                <IconLoader2 className="size-4 animate-spin" /> {tTotp("submittingButton")}
              </>
            ) : (
              tTotp("submitButton")
            )}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Suspense>
        <ResetSuccessBanner />
      </Suspense>

      <div className="space-y-1.5">
        <h2 className="text-2xl font-bold tracking-tight">{t("title")}</h2>
        <p className="text-sm text-muted-foreground">
          {t("subtitle")}
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
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
          <div className="flex items-center justify-between">
            <Label htmlFor="password">{t("passwordLabel")}</Label>
            <Link
              href="/forgot-password"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("forgotPassword")}
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

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
          {isLoading ? (
            <>
              <IconLoader2 className="size-4 animate-spin" /> {t("submittingButton")}
            </>
          ) : (
            t("submitButton")
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        {t("noAccount")}{" "}
        <Link
          href="/register"
          className="font-medium text-foreground hover:text-primary transition-colors underline underline-offset-4"
        >
          {t("createOne")}
        </Link>
      </p>
    </div>
  );
}
