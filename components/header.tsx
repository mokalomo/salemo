"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, Gamepad2 } from "lucide-react"
import { useEffect, useState } from "react"

interface HeaderUser {
  id: number
  email: string
  full_name: string
  role: "user" | "admin"
}

export function Header() {
  const [user, setUser] = useState<HeaderUser | null>(null)
  const [loading, setLoading] = useState(true)

  const copy = {
    services: "الخدمات",
    support: "الدعم",
    login: "تسجيل الدخول",
    signup: "إنشاء حساب",
    dashboard: "لوحة التحكم",
  } as const

  useEffect(() => {
    async function fetchUser() {
      try {
        const controller = new AbortController()
        const signal = controller.signal
        const timeoutId = setTimeout(() => controller.abort(), 5000)

        const response = await fetch("/api/auth/me", {
          signal: signal,
        })
        clearTimeout(timeoutId)

        if (response.ok) {
          const data = await response.json()
          if (data.user) {
            setUser(data.user)
          }
        }
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Failed to fetch user:", error)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative">
            <Gamepad2 className="h-8 w-8 text-primary" />
            <div className="absolute inset-0 h-8 w-8 text-primary blur-lg opacity-50" />
          </div>
          <span className="text-xl font-bold text-foreground">Pay Games</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/services"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {copy.services}
          </Link>
          <Link
            href="/support"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {copy.support}
          </Link>
          {!loading && (
            <>
              {user ? (
                <Button variant="outline" size="sm" asChild className="gap-2 bg-transparent">
                  <Link href={user.role === "admin" ? "/admin/dashboard" : "/dashboard"}>
                    {copy.dashboard}
                  </Link>
                </Button>
              ) : (
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/login">{copy.login}</Link>
                  </Button>
                  <Button size="sm" asChild className="bg-gradient-to-r from-primary to-secondary">
                    <Link href="/signup">{copy.signup}</Link>
                  </Button>
                </div>
              )}
            </>
          )}
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}

