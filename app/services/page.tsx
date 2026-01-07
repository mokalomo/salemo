"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

type Game = {
  id: number
  name: string
  slug: string
  description?: string | null
  thumbnail_url?: string | null
  category?: string | null
}

export default function ServicesPage() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<"all" | "games" | "subscriptions">("all")

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
          setLoadError("Failed to load games.")
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

  const filteredGames = games.filter((game) => {
    const matchesSearch =
      game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (game.description ?? "").toLowerCase().includes(searchQuery.toLowerCase())
    const gameCategory = game.category ?? "games"
    const matchesCategory = selectedCategory === "all" || gameCategory === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 border-b border-border/40">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
          <div className="container relative">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl text-balance">
                جميع الخدمات والألعاب
              </h1>
              <p className="text-lg text-muted-foreground text-balance leading-relaxed">
                اختر لعبتك المفضلة أو الخدمة التي تريدها واشحن بسرعة وأمان
              </p>
            </div>
          </div>
        </section>

        {/* Filter and Search Section */}
        <section className="py-8 border-b border-border/40 bg-muted/20">
          <div className="container">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="ابحث عن لعبة أو خدمة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10 bg-card/50"
                />
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <Button
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  onClick={() => setSelectedCategory("all")}
                  className="flex-1 md:flex-none"
                >
                  الكل
                </Button>
                <Button
                  variant={selectedCategory === "games" ? "default" : "outline"}
                  onClick={() => setSelectedCategory("games")}
                  className="flex-1 md:flex-none"
                >
                  الألعاب
                </Button>
                <Button
                  variant={selectedCategory === "subscriptions" ? "default" : "outline"}
                  onClick={() => setSelectedCategory("subscriptions")}
                  className="flex-1 md:flex-none"
                >
                  الاشتراكات
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Games Grid */}
        <section className="py-12 md:py-16">
          <div className="container">
            {loading ? (
              <div className="text-center py-16 text-muted-foreground">Loading...</div>
            ) : loadError ? (
              <div className="text-center py-16 text-muted-foreground">{loadError}</div>
            ) : filteredGames.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredGames.map((game) => (
                  <Link key={game.id} href={`/order/${game.slug}`}>
                    <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 cursor-pointer h-full">
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={game.thumbnail_url || "/placeholder.svg"}
                          alt={game.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                      </div>
                      <div className="p-5">
                        <h3 className="mb-2 text-lg font-bold text-foreground">{game.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{game.description ?? ""}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors bg-transparent"
                        >
                          اشحن الآن
                        </Button>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Filter className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-bold text-foreground mb-2">لا توجد نتائج</h3>
                <p className="text-muted-foreground">جرب البحث بكلمات أخرى أو تغيير الفلتر</p>
              </div>
            )}
          </div>
        </section>

        {/* Support Banner */}
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container">
            <Card className="p-8 md:p-12 text-center border-primary/30 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">لم تجد ما تبحث عنه؟</h2>
              <p className="text-muted-foreground mb-6 text-balance leading-relaxed max-w-2xl mx-auto">
                تواصل معنا عبر واتساب وسنساعدك في إيجاد الخدمة المناسبة
              </p>
              <Button size="lg" asChild>
                <Link href="/support">تواصل معنا</Link>
              </Button>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
