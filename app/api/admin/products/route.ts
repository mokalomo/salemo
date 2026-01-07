import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const gameId = searchParams.get("gameId")

    let query = "SELECT p.*, g.name as game_name FROM products p JOIN games g ON p.game_id = g.id"
    const params: (string | number)[] = []

    if (gameId) {
      query += " WHERE p.game_id = $1"
      params.push(Number.parseInt(gameId))
    }

    query += " ORDER BY p.created_at DESC"

    const products = gameId
      ? await sql(query, params)
      : await sql`
      SELECT p.*, g.name as game_name FROM products p 
      JOIN games g ON p.game_id = g.id 
      ORDER BY p.created_at DESC
    `

    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { game_id, name, description, base_price, discount_price, stock } = await request.json()

    if (!game_id || !name || !base_price) {
      return NextResponse.json({ error: "Game ID, name, and base price are required" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO products (game_id, name, description, base_price, discount_price, stock)
      VALUES (${game_id}, ${name}, ${description || null}, ${base_price}, ${discount_price || null}, ${stock !== undefined ? stock : -1})
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
