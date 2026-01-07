"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"

type Game = {
  id: number
  name: string
  slug: string
  description?: string | null
  thumbnail_url?: string | null
}

export function GamesSection() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadGames() {
      try {
        const response = await fetch("/api/games")
        if (!response.ok) {
          throw new Error("Failed to load games")
        }
        const data = await response.json()
        if (isMounted) {
          setGames(Array.isArray(data) ? data : [])
        }
      } catch (error) {
        if (isMounted) {
          setGames([])
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadGames()

    return () => {
      isMounted = false
    }
  }, [])

  const visibleGames = games.slice(0, 6)

  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Popular Games
          </h2>
          <p className="text-lg text-muted-foreground text-balance mx-auto max-w-2xl leading-relaxed">
            Browse the most popular games and subscriptions.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : visibleGames.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No games available.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleGames.map((game) => (
              <Link key={game.id} href={`/order/${game.slug}`}>
                <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 cursor-pointer h-full">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={game.thumbnail_url || "/placeholder.svg"}
                      alt={game.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                  </div>
                  <div className="p-6">
                    <h3 className="mb-2 text-xl font-bold text-foreground">{game.name}</h3>
                    {game.description && (
                      <p className="text-sm text-muted-foreground mb-4">{game.description}</p>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors bg-transparent"
                    >
                      View offers
                    </Button>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Button size="lg" variant="outline" asChild>
            <Link href="/services">View all services</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
