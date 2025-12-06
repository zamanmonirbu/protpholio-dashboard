"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useUser } from "@/lib/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Menu, X, LogOut, LayoutDashboard, FolderOpen, BookOpen, User } from "lucide-react"

const ADMIN_ROUTES = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Projects", href: "/admin/projects", icon: FolderOpen },
  { label: "Blogs", href: "/admin/blogs", icon: BookOpen },
  { label: "Profile", href: "/admin/profile", icon: User },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { data: user, isLoading } = useUser()

  // ❗ Prevent SSR redirect mismatch
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isLoading && mounted && !user) {
      router.push("/")
    }
  }, [isLoading, mounted, user, router])

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin"
    return pathname.startsWith(href)
  }

  return (
    <div className="flex h-screen bg-background">
      <aside className={`${sidebarOpen ? "block" : "hidden"} md:block w-full md:w-64 bg-card border-r border-border`}>
        <div className="p-6 border-b border-border">
          <h1 className="text-2xl font-bold text-foreground">Admin</h1>
        </div>

        <nav className="space-y-1 px-3 py-4">
          {ADMIN_ROUTES.map((route) => {
            const Icon = route.icon
            const active = isActive(route.href)
            return (
              <Link key={route.href} href={route.href}>
                <Button
                  variant={active ? "default" : "ghost"}
                  className={`w-full justify-start gap-3 ${active ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                    }`}
                >
                  <Icon size={20} />
                  <span>{route.label}</span>
                </Button>
              </Link>
            )
          })}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-foreground hover:text-muted-foreground transition-colors"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="flex items-center gap-4 ml-auto">
            <div className="text-sm text-right">
              <p className="font-semibold text-foreground">
                {isLoading ? "Loading..." : user?.name}
              </p>
              <p className="text-muted-foreground text-xs">
                {isLoading ? "" : user?.email}
              </p>
            </div>

            {!isLoading && (
              <Button
                onClick={() => {
                  sessionStorage.removeItem("token")
                  router.push("/")
                }}
                variant="destructive"
                size="sm"
                className="gap-2"
              >
                <LogOut size={16} />
                Logout
              </Button>
            )}
          </div>

        </header>

        <main className="flex-1 overflow-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[60vh] text-muted-foreground text-sm">
              Loading...
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  )
}
