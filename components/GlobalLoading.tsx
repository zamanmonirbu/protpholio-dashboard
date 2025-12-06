// components/GlobalLoading.tsx (Pro Version)
import { Loader2 } from "lucide-react"

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-linear-to-br from-background via-background to-primary/5">
      <div className="relative">
        {/* Outer Ring */}
        <div className="absolute inset-0 w-32 h-32 rounded-full border-8 border-primary/10 animate-ping" />
        
        {/* Spinning Loader */}
        <div className="relative w-32 h-32 rounded-full bg-card shadow-2xl flex items-center justify-center border border-border">
          <Loader2 className="w-16 h-16 animate-spin text-primary" />
        </div>

        {/* Floating Orbs */}
        <div className="absolute -top-2 -left-2 w-4 h-4 bg-primary rounded-full animate-bounce" />
        <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-primary rounded-full animate-bounce delay-150" />
      </div>

      <div className="absolute bottom-32 text-center">
        <p className="text-2xl font-light text-foreground">Loading</p>
        <p className="text-sm text-muted-foreground mt-2">Preparing your experience...</p>
      </div>
    </div>
  )
}