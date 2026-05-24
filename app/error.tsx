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
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <Image
        src="/fintrack-login-background.png"
        alt=""
        fill
        className="object-cover object-center"
        priority
      />

      <div className="relative z-10 flex flex-col items-center gap-4">
        <p className="text-muted-foreground/30 text-8xl leading-none font-bold select-none">500</p>

        <div className="max-w-sm space-y-2">
          <h1 className="text-xl font-semibold tracking-tight">Something went wrong</h1>
          <p className="text-muted-foreground text-sm">
            An unexpected error occurred. Try again or go back.
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => router.back()}>
            Go back
          </Button>
          <Button onClick={reset}>Try again</Button>
        </div>
      </div>
    </div>
  )
}
