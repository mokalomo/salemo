import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const games = await sql`
      SELECT id, name, slug, description, thumbnail_url, category
      FROM games
      WHERE status = 'active'
      ORDER BY created_at DESC
    `

    return NextResponse.json(games)
  } catch (error) {
    console.error("Error fetching games:", error)
    return NextResponse.json({ error: "Failed to fetch games" }, { status: 500 })
  }
}
