"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen gap-4 p-6 text-center">
      <Image
        src="/fintrack-login-background.png"
        alt=""
        fill
        className="object-cover object-center"
        priority
      />

      <div className="relative z-10 flex flex-col items-center gap-4">
        <p className="text-8xl font-bold text-muted-foreground/30 select-none leading-none">
          500
        </p>

        <div className="space-y-2 max-w-sm">
          <h1 className="text-xl font-semibold tracking-tight">Something went wrong</h1>
          <p className="text-sm text-muted-foreground">
            An unexpected error occurred. Try again or go back.
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => router.back()}>
            Go back
          </Button>
          <Button onClick={reset}>
            Try again
          </Button>
        </div>
      </div>
    </div>
  )
}
