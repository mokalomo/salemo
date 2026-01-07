import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const offer = await sql`
      SELECT o.*, 
        JSON_AGG(op.product_id) as product_ids
      FROM offers o
      LEFT JOIN offer_products op ON o.id = op.offer_id
      WHERE o.id = ${Number.parseInt(id)}
      GROUP BY o.id
    `

    if (!offer.length) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 })
    }

    return NextResponse.json(offer[0])
  } catch (error) {
    console.error("Error fetching offer:", error)
    return NextResponse.json({ error: "Failed to fetch offer" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const { name, description, offer_type, discount_value, start_date, end_date, status, product_ids } =
      await request.json()

    const result = await sql`
      UPDATE offers 
      SET name = COALESCE(${name || null}, name),
          description = COALESCE(${description || null}, description),
          offer_type = COALESCE(${offer_type || null}, offer_type),
          discount_value = COALESCE(${discount_value || null}, discount_value),
          start_date = COALESCE(${start_date || null}, start_date),
          end_date = COALESCE(${end_date || null}, end_date),
          status = COALESCE(${status || null}, status),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${Number.parseInt(id)}
      RETURNING *
    `

    if (!result.length) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 })
    }

    if (Array.isArray(product_ids)) {
      await sql`DELETE FROM offer_products WHERE offer_id = ${Number.parseInt(id)}`

      for (const productId of product_ids) {
        await sql`
          INSERT INTO offer_products (offer_id, product_id)
          VALUES (${Number.parseInt(id)}, ${productId})
        `
      }
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating offer:", error)
    return NextResponse.json({ error: "Failed to update offer" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const result = await sql`
      DELETE FROM offers WHERE id = ${Number.parseInt(id)}
      RETURNING id
    `

    if (!result.length) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Offer deleted successfully" })
  } catch (error) {
    console.error("Error deleting offer:", error)
    return NextResponse.json({ error: "Failed to delete offer" }, { status: 500 })
  }
}
