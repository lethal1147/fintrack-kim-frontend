import { IconCheck } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

export function SaveToast({ visible }: { visible: boolean }) {
  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 flex items-center gap-2 bg-foreground text-background px-4 py-2.5 rounded-xl text-sm font-medium shadow-lg transition-all duration-300",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none",
      )}
    >
      <IconCheck className="size-4" />
      Changes saved
    </div>
  )
}
