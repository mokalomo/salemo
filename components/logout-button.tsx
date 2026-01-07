"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useState } from "react"

export function LogoutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleLogout() {
    setLoading(true)
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/login")
      router.refresh()
    } catch (error) {
      console.error("[v0] Logout error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant="outline" onClick={handleLogout} disabled={loading} className="gap-2 bg-transparent">
      <LogOut className="w-4 h-4" />
      {loading ? "جاري..." : "تسجيل الخروج"}
    </Button>
  )
}
