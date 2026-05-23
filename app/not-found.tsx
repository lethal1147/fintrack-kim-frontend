"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function NotFoundPage() {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-6 text-center bg-background">
      <p className="text-8xl font-bold text-muted-foreground/30 select-none leading-none">
        404
      </p>

      <div className="space-y-2 max-w-sm">
        <h1 className="text-xl font-semibold tracking-tight">Page not found</h1>
        <p className="text-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </div>

      <Button variant="outline" onClick={() => router.back()}>
        Go back
      </Button>
    </div>
  )
}
