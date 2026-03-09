import {
  IconChartPie,
  IconTargetArrow,
  IconTrendingUp,
  IconReportMoney,
} from "@tabler/icons-react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left — brand panel */}
      <div className="hidden lg:flex flex-col justify-between bg-primary p-12 text-primary-foreground">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center size-8 rounded-lg bg-primary-foreground/15">
            <IconChartPie className="size-4.5" />
          </div>
          <span className="text-lg font-semibold tracking-tight">FinTrack</span>
        </div>

        {/* Headline + features */}
        <div className="space-y-10">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold leading-tight tracking-tight">
              Your personal<br />finance command<br />center.
            </h1>
            <p className="text-primary-foreground/70 text-base leading-relaxed max-w-xs">
              Track every dollar, set goals, and understand your spending — all in one place.
            </p>
          </div>

          <ul className="space-y-4">
            {[
              { icon: IconReportMoney, label: "Track income & expenses effortlessly" },
              { icon: IconTargetArrow, label: "Set and reach your savings goals" },
              { icon: IconTrendingUp, label: "Visualize your financial health over time" },
            ].map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3">
                <div className="flex items-center justify-center size-8 rounded-lg bg-primary-foreground/10 shrink-0">
                  <Icon className="size-4" />
                </div>
                <span className="text-sm text-primary-foreground/85">{label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Decorative stats card */}
        <div className="rounded-xl bg-primary-foreground/10 border border-primary-foreground/15 p-5 space-y-3">
          <p className="text-xs text-primary-foreground/60 uppercase tracking-widest font-medium">This month</p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Income", value: "$4,280" },
              { label: "Spent", value: "$2,105" },
              { label: "Saved", value: "$2,175" },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xl font-bold">{value}</p>
                <p className="text-xs text-primary-foreground/60 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
          <div className="h-1.5 rounded-full bg-primary-foreground/15 overflow-hidden">
            <div className="h-full w-[49%] rounded-full bg-primary-foreground/60" />
          </div>
          <p className="text-xs text-primary-foreground/60">49% of income saved this month</p>
        </div>
      </div>

      {/* Right — form panel */}
      <div className="flex flex-col min-h-screen bg-background">
        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-2 p-6 border-b border-border">
          <div className="flex items-center justify-center size-7 rounded-lg bg-primary text-primary-foreground">
            <IconChartPie className="size-4" />
          </div>
          <span className="font-semibold text-sm tracking-tight">FinTrack</span>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
