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
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-6 text-center">
      <div className="flex items-center justify-center size-16 rounded-full bg-destructive/10">
        <IconAlertTriangle className="size-8 text-destructive" />
      </div>

      <div className="space-y-2 max-w-sm">
        <h1 className="text-xl font-semibold tracking-tight">Something went wrong</h1>
        <p className="text-sm text-muted-foreground">
          An unexpected error occurred. You can try again or go back to the previous page.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" onClick={() => router.back()}>
          Go back
        </Button>
        <Button onClick={reset}>
          Try again
        </Button>
      </div>
    </div>
  )
}
