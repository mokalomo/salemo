import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { productIds, operation, value } = await request.json()

    if (!productIds || !Array.isArray(productIds) || !operation || value === undefined) {
      return NextResponse.json({ error: "productIds, operation, and value are required" }, { status: 400 })
    }

    if (!["percentage", "fixed"].includes(operation)) {
      return NextResponse.json({ error: "Operation must be 'percentage' or 'fixed'" }, { status: 400 })
    }

    const updates: Record<number, string | number>[] = []

    for (const productId of productIds) {
      const product = await sql`SELECT * FROM products WHERE id = ${productId}`

      if (product.length > 0) {
        const currentPrice = Number.parseFloat(product[0].base_price)
        let newPrice: number

        if (operation === "percentage") {
          newPrice = currentPrice + (currentPrice * value) / 100
        } else {
          newPrice = currentPrice + value
        }

        await sql`
          UPDATE products 
          SET base_price = ${Math.max(0, newPrice)},
              updated_at = CURRENT_TIMESTAMP
          WHERE id = ${productId}
        `

        updates.push({ productId, newPrice: Math.max(0, newPrice) })
      }
    }

    return NextResponse.json({ updated: updates.length, updates })
  } catch (error) {
    console.error("Error bulk updating prices:", error)
    return NextResponse.json({ error: "Failed to bulk update prices" }, { status: 500 })
  }
}
