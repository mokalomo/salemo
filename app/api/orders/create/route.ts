import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { sql } from "@/lib/db"

// Generate unique order number
function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `PG-${timestamp}-${random}`
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ success: false, error: "يجب تسجيل الدخول لإنشاء طلب" }, { status: 401 })
    }

    const { gameId, gameName, packageId, packageName, packagePrice, playerId, accountName, paymentMethod, email } =
      await request.json()

    // Validate required fields
    if (!gameId || !gameName || !packageName || !packagePrice || !playerId || !accountName || !paymentMethod) {
      return NextResponse.json({ success: false, error: "جميع الحقول مطلوبة" }, { status: 400 })
    }

    const orderNumber = generateOrderNumber()

    // Insert order into database
    const result = await sql`
      INSERT INTO orders (
        user_id, 
        order_number, 
        game_id, 
        game_name, 
        package_name, 
        package_price, 
        player_id, 
        account_name,
        payment_method,
        status
      )
      VALUES (
        ${user.id},
        ${orderNumber},
        ${gameId},
        ${gameName},
        ${packageName},
        ${packagePrice},
        ${playerId},
        ${accountName},
        ${paymentMethod},
        'pending'
      )
      RETURNING id, order_number
    `

    if (result.length === 0) {
      throw new Error("Failed to create order")
    }

    return NextResponse.json({
      success: true,
      orderNumber: result[0].order_number,
      orderId: result[0].id,
    })
  } catch (error) {
    console.error("[v0] Create order error:", error)
    return NextResponse.json({ success: false, error: "حدث خطأ أثناء إنشاء الطلب" }, { status: 500 })
  }
}
