"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/lib/hooks/use-auth"
import LoginPage from "@/app/admin/login/page"

export default function HomePage() {
  const router = useRouter()
  const { data: user, isLoading } = useUser()

  useEffect(() => {
    // If user is authenticated, redirect to dashboard
    if (user && !isLoading) {
      router.push("/");
    // Refresh page
    window.location.reload();
    }
  }, [user, isLoading, router])

  // If loading or authenticated, don't show login page
  if (isLoading || user) {
    return null
  }

  // Show login page if not authenticated
  return <LoginPage />
}
