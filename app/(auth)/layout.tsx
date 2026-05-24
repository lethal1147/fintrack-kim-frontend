import Image from "next/image"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <Image
        src="/fintrack-login-background.png"
        alt=""
        fill
        className="object-cover object-center"
        priority
      />
      <div className="relative z-10 flex w-full max-w-100 flex-col items-center gap-6">
        <Image
          src="/fintrack-brand-logo.png"
          alt="FinTrack"
          width={160}
          height={40}
          className="h-8 w-auto"
          priority
          unoptimized
        />
        <div className="bg-background/95 border-border w-full rounded-2xl border p-8 shadow-sm backdrop-blur-sm">
          {children}
        </div>
      </div>
    </div>
  )
}
