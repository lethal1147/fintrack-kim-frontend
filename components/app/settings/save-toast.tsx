"use client"

import { IconCheck } from "@tabler/icons-react"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"

export function SaveToast({ visible }: { visible: boolean }) {
  const t = useTranslations("settings.saveToast")

  return (
    <div
      className={cn(
        "bg-foreground text-background fixed right-6 bottom-6 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium shadow-lg transition-all duration-300",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      )}
    >
      <IconCheck className="size-4" />
      {t("message")}
    </div>
  )
}
