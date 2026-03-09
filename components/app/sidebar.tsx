"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  IconChartPie,
  IconLayoutDashboard,
  IconArrowsExchange,
  IconTarget,
  IconBuildingBank,
  IconChartBar,
  IconRepeat,
  IconSettings,
  IconWallet,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"

const primaryNav = [
  { label: "Dashboard",    href: "/dashboard",    icon: IconLayoutDashboard },
  { label: "Transactions", href: "/transactions", icon: IconArrowsExchange },
  { label: "Budget",       href: "/budget",       icon: IconWallet },
  { label: "Accounts",     href: "/accounts",     icon: IconBuildingBank },
  { label: "Reports",      href: "/reports",      icon: IconChartBar },
  { label: "Goals",        href: "/goals",        icon: IconTarget },
  { label: "Recurring",    href: "/recurring",    icon: IconRepeat },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex flex-col w-56 shrink-0 border-r border-sidebar-border bg-sidebar h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 h-14 border-b border-sidebar-border">
        <div className="flex items-center justify-center size-7 rounded-lg bg-primary text-primary-foreground shrink-0">
          <IconChartPie className="size-4" />
        </div>
        <span className="font-semibold text-sm tracking-tight text-sidebar-foreground">FinTrack</span>
      </div>

      {/* Primary nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {primaryNav.map(({ label, href, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors",
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
      <div className="px-2 pb-3 space-y-0.5 border-t border-sidebar-border pt-3">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors",
            pathname === "/settings"
              ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
              : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
          )}
        >
          <IconSettings className="size-4 shrink-0" />
          Settings
        </Link>

        {/* User identity */}
        <div className="flex items-center gap-2.5 px-2.5 py-2 mt-1">
          <div className="flex items-center justify-center size-7 rounded-full bg-primary text-primary-foreground text-xs font-semibold shrink-0">
            K
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-sidebar-foreground truncate">Kim Joakim</p>
            <p className="text-xs text-sidebar-foreground/50 truncate">kim@example.com</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
