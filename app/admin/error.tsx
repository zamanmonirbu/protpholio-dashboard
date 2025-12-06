"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    console.error("[v0] Error:", error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <AlertCircle className="w-16 h-16 text-destructive" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Something went wrong!</h1>
          <p className="text-muted-foreground">
            {error.message || "An unexpected error occurred. Please try again."}
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <Button onClick={() => reset()}>Try Again</Button>

          {/* FIXED → No window/location during SSR */}
          <Button variant="outline" onClick={() => router.push("/admin")}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}
