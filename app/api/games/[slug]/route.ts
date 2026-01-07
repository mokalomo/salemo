import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

function getOfferPrice(basePrice: number, offerType: string, discountValue: number) {
  if (offerType === "percentage") {
    return basePrice * (1 - discountValue / 100)
  }
  if (offerType === "fixed") {
    return Math.max(0, basePrice - discountValue)
  }
  return basePrice
}

export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  try {
    const games = await sql`
      SELECT id, name, slug, description, thumbnail_url, category
      FROM games
      WHERE slug = ${params.slug} AND status = 'active'
      LIMIT 1
    `

    if (games.length === 0) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 })
    }

    const game = games[0]

    const products = await sql`
      SELECT id, name, description, base_price, discount_price
      FROM products
      WHERE game_id = ${game.id} AND status = 'active'
      ORDER BY base_price ASC
    `

    const offers = await sql`
      SELECT id, name, offer_type, discount_value
      FROM offers
      WHERE game_id = ${game.id}
        AND status = 'active'
        AND start_date <= NOW()
        AND end_date >= NOW()
    `

    const offerIds = offers.map((offer: any) => offer.id)
    let offerProducts: Array<{ offer_id: number; product_id: number }> = []

    if (offerIds.length > 0) {
      offerProducts = await sql`
        SELECT offer_id, product_id
        FROM offer_products
        WHERE offer_id = ANY(${offerIds})
      `
    }

    const offersByProduct = new Map<number, Array<{ name: string; offer_type: string; discount_value: number }>>()

    for (const link of offerProducts) {
      const offer = offers.find((item: any) => item.id === link.offer_id)
      if (!offer) continue
      const list = offersByProduct.get(link.product_id) ?? []
      list.push({ name: offer.name, offer_type: offer.offer_type, discount_value: Number(offer.discount_value) })
      offersByProduct.set(link.product_id, list)
    }

    const productsWithPricing = products.map((product: any) => {
      const basePrice = Number(product.base_price)
      let bestPrice = product.discount_price ? Number(product.discount_price) : basePrice
      let offerName: string | null = product.discount_price ? "Discount" : null

      const productOffers = offersByProduct.get(product.id) ?? []
      for (const offer of productOffers) {
        const offerPrice = getOfferPrice(basePrice, offer.offer_type, offer.discount_value)
        if (offerPrice < bestPrice) {
          bestPrice = offerPrice
          offerName = offer.name
        }
      }

      return {
        id: product.id,
        name: product.name,
        description: product.description,
        base_price: basePrice,
        price: Number(bestPrice.toFixed(2)),
        offer_name: offerName,
      }
    })

    return NextResponse.json({ game, products: productsWithPricing })
  } catch (error) {
    console.error("Error fetching game details:", error)
    return NextResponse.json({ error: "Failed to fetch game" }, { status: 500 })
  }
}
