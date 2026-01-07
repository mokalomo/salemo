import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 403 })
    }

    const { orderId, status } = await request.json()

    await sql`
      UPDATE orders
      SET status = ${status}, updated_at = NOW()
      WHERE id = ${orderId}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Update order error:", error)
    return NextResponse.json({ success: false, error: "حدث خطأ في الخادم" }, { status: 500 })
  }
}
