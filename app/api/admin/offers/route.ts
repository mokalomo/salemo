import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const offers = await sql`
      SELECT o.*, g.name as game_name,
        (SELECT COUNT(*) FROM offer_products WHERE offer_id = o.id) as product_count
      FROM offers o
      JOIN games g ON o.game_id = g.id
      ORDER BY o.created_at DESC
    `

    return NextResponse.json(offers)
  } catch (error) {
    console.error("Error fetching offers:", error)
    return NextResponse.json({ error: "Failed to fetch offers" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, description, game_id, offer_type, discount_value, start_date, end_date, product_ids } =
      await request.json()

    if (!name || !game_id || !offer_type || !discount_value || !start_date || !end_date) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO offers (name, description, game_id, offer_type, discount_value, start_date, end_date)
      VALUES (${name}, ${description || null}, ${game_id}, ${offer_type}, ${discount_value}, ${start_date}, ${end_date})
      RETURNING *
    `

    const offerId = result[0].id

    if (Array.isArray(product_ids) && product_ids.length > 0) {
      for (const productId of product_ids) {
        await sql`
          INSERT INTO offer_products (offer_id, product_id)
          VALUES (${offerId}, ${productId})
          ON CONFLICT (offer_id, product_id) DO NOTHING
        `
      }
    }

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating offer:", error)
    return NextResponse.json({ error: "Failed to create offer" }, { status: 500 })
  }
}
