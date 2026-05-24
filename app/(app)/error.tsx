"use client"

import { useRouter } from "next/navigation"
import { IconAlertTriangle } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"

type Props = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ reset }: Props) {
  const router = useRouter()

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 p-6 text-center">
      <div className="bg-destructive/10 flex size-16 items-center justify-center rounded-full">
        <IconAlertTriangle className="text-destructive size-8" />
      </div>

      <div className="max-w-sm space-y-2">
        <h1 className="text-xl font-semibold tracking-tight">Something went wrong</h1>
        <p className="text-muted-foreground text-sm">
          An unexpected error occurred. You can try again or go back to the previous page.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" onClick={() => router.back()}>
          Go back
        </Button>
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  )
}
