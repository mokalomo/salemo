import { type NextRequest, NextResponse } from "next/server"
import { signIn } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "البريد الإلكتروني وكلمة المرور مطلوبان" }, { status: 400 })
    }

    const result = await signIn(email, password)
    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Sign in route error:", error)
    return NextResponse.json({ success: false, error: "حدث خطأ في الخادم" }, { status: 500 })
  }
}
