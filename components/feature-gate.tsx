import { IconLock } from "@tabler/icons-react"
import { FEATURES, type FeatureKey } from "@/lib/features"

type Props = {
  feature: FeatureKey
  children: React.ReactNode
}

/**
 * Wraps a UI section that is not yet available.
 * When the feature flag is `false` the children are shown dimmed with a
 * "Coming soon" overlay so the UI communicates intent without being interactive.
 * Flip the flag in `lib/features.ts` to enable the feature.
 */
export function FeatureGate({ feature, children }: Props) {
  if (FEATURES[feature]) return <>{children}</>

  return (
    <div className="relative">
      {/* Render children but make them inert */}
      <div className="pointer-events-none opacity-40 blur-[1.5px] select-none">{children}</div>

      {/* Overlay */}
      <div className="absolute inset-0 flex items-center justify-center rounded-xl">
        <div className="border-border bg-card text-muted-foreground flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium shadow-sm">
          <IconLock className="size-3" />
          Coming soon
        </div>
      </div>
    </div>
  )
}
