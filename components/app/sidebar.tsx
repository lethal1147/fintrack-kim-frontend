"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  IconLayoutDashboard,
  IconArrowsExchange,
  IconChartBar,
  IconRepeat,
  IconSettings,
  IconLogout,
  IconWallet,
} from "@tabler/icons-react"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { stringUtil } from "@/lib/string-util"
import { useAuthStore } from "@/store/auth-store"

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const t = useTranslations("nav")

  const PRIMARY_NAV = [
    { label: t("dashboard"), href: "/dashboard", icon: IconLayoutDashboard },
    { label: t("transactions"), href: "/transactions", icon: IconArrowsExchange },
    { label: t("budget"), href: "/budget", icon: IconWallet },
    { label: t("reports"), href: "/reports", icon: IconChartBar },
    { label: t("recurring"), href: "/recurring", icon: IconRepeat },
  ]

  async function handleLogout() {
    await logout()
    router.replace("/login")
  }

  const initials = user?.name ? stringUtil.initials(user.name) : "?"

  return (
    <aside className="border-sidebar-border bg-sidebar sticky top-0 hidden h-screen w-56 shrink-0 flex-col border-r lg:flex">
      {/* Logo */}
      <div className="border-sidebar-border flex h-14 items-center border-b px-4">
        <Image
          src="/fintrack-brand-logo.png"
          alt="FinTrack"
          width={120}
          height={32}
          className="h-6 w-auto"
          priority
          unoptimized
        />
      </div>

      {/* Primary nav */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-3">
        {PRIMARY_NAV.map(({ label, href, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="border-sidebar-border space-y-0.5 border-t px-2 pt-3 pb-3">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors",
            pathname === "/settings"
              ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
              : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
          )}
        >
          <IconSettings className="size-4 shrink-0" />
          {t("settings")}
        </Link>

        {/* User identity */}
        <div className="mt-1 flex items-center gap-2.5 px-2.5 py-2">
          <div className="size-7 shrink-0 overflow-hidden rounded-full">
            {user?.avatar_url ? (
              <Image
                src={user.avatar_url}
                alt={user.name ?? ""}
                width={28}
                height={28}
                className="size-7 object-cover"
                unoptimized
              />
            ) : (
              <div className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-full text-xs font-semibold">
                {initials}
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sidebar-foreground truncate text-xs font-medium">
              {user?.name ?? "—"}
            </p>
            <p className="text-sidebar-foreground/50 truncate text-xs">{user?.email ?? "—"}</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors"
        >
          <IconLogout className="size-4 shrink-0" />
          {t("signOut")}
        </button>
      </div>
    </aside>
  )
}
