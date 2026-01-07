import { type NextRequest, NextResponse } from "next/server"
import { signUp } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName, phone } = await request.json()

    if (!email || !password || !fullName) {
      return NextResponse.json({ success: false, error: "جميع الحقول المطلوبة يجب ملؤها" }, { status: 400 })
    }

    const result = await signUp(email, password, fullName, phone)
    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Sign up route error:", error)
    return NextResponse.json({ success: false, error: "حدث خطأ في الخادم" }, { status: 500 })
  }
}
