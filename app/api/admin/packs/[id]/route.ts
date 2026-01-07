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
    const pack = await sql`
      SELECT sp.*, 
        JSON_AGG(JSON_BUILD_OBJECT('product_id', pp.product_id, 'name', p.name, 'price', p.base_price)) as products
      FROM special_packs sp
      LEFT JOIN pack_products pp ON sp.id = pp.pack_id
      LEFT JOIN products p ON pp.product_id = p.id
      WHERE sp.id = ${Number.parseInt(id)}
      GROUP BY sp.id
    `

    if (!pack.length) {
      return NextResponse.json({ error: "Pack not found" }, { status: 404 })
    }

    return NextResponse.json(pack[0])
  } catch (error) {
    console.error("Error fetching pack:", error)
    return NextResponse.json({ error: "Failed to fetch pack" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const { name, description, image_url, original_price, pack_price, status, product_ids } = await request.json()

    let discountPercentage = null
    if (original_price && pack_price) {
      discountPercentage = ((original_price - pack_price) / original_price) * 100
    }

    const result = await sql`
      UPDATE special_packs 
      SET name = COALESCE(${name || null}, name),
          description = COALESCE(${description || null}, description),
          image_url = COALESCE(${image_url || null}, image_url),
          original_price = COALESCE(${original_price || null}, original_price),
          pack_price = COALESCE(${pack_price || null}, pack_price),
          discount_percentage = COALESCE(${discountPercentage}, discount_percentage),
          status = COALESCE(${status || null}, status),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${Number.parseInt(id)}
      RETURNING *
    `

    if (!result.length) {
      return NextResponse.json({ error: "Pack not found" }, { status: 404 })
    }

    if (Array.isArray(product_ids)) {
      await sql`DELETE FROM pack_products WHERE pack_id = ${Number.parseInt(id)}`

      for (const productId of product_ids) {
        await sql`
          INSERT INTO pack_products (pack_id, product_id)
          VALUES (${Number.parseInt(id)}, ${productId})
        `
      }
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating pack:", error)
    return NextResponse.json({ error: "Failed to update pack" }, { status: 500 })
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
      DELETE FROM special_packs WHERE id = ${Number.parseInt(id)}
      RETURNING id
    `

    if (!result.length) {
      return NextResponse.json({ error: "Pack not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Pack deleted successfully" })
  } catch (error) {
    console.error("Error deleting pack:", error)
    return NextResponse.json({ error: "Failed to delete pack" }, { status: 500 })
  }
}
