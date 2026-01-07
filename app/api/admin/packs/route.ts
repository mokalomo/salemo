import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const packs = await sql`
      SELECT sp.*, g.name as game_name,
        (SELECT COUNT(*) FROM pack_products WHERE pack_id = sp.id) as product_count
      FROM special_packs sp
      JOIN games g ON sp.game_id = g.id
      ORDER BY sp.created_at DESC
    `

    return NextResponse.json(packs)
  } catch (error) {
    console.error("Error fetching packs:", error)
    return NextResponse.json({ error: "Failed to fetch packs" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, description, game_id, image_url, original_price, pack_price, product_ids } = await request.json()

    if (!name || !game_id || !original_price || !pack_price) {
      return NextResponse.json({ error: "Required fields missing" }, { status: 400 })
    }

    const discountPercentage = ((original_price - pack_price) / original_price) * 100

    const result = await sql`
      INSERT INTO special_packs (name, description, game_id, image_url, original_price, pack_price, discount_percentage)
      VALUES (${name}, ${description || null}, ${game_id}, ${image_url || null}, ${original_price}, ${pack_price}, ${discountPercentage})
      RETURNING *
    `

    const packId = result[0].id

    if (Array.isArray(product_ids) && product_ids.length > 0) {
      for (const productId of product_ids) {
        await sql`
          INSERT INTO pack_products (pack_id, product_id)
          VALUES (${packId}, ${productId})
        `
      }
    }

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating pack:", error)
    return NextResponse.json({ error: "Failed to create pack" }, { status: 500 })
  }
}
