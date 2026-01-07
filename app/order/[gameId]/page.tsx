"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Shield, Zap, Check } from "lucide-react"
import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type Game = {
  id: number
  name: string
  slug: string
  description?: string | null
  thumbnail_url?: string | null
  category?: string | null
}

type Product = {
  id: number
  name: string
  description?: string | null
  base_price: number
  price: number
  offer_name?: string | null
}

const paymentMethods = [
  { id: "paypal", name: "PayPal", icon: "💳" },
  { id: "binance", name: "Binance Pay", icon: "🟡" },
  { id: "usdt", name: "USDT", icon: "₮" },
  { id: "mada", name: "مدى", icon: "💳" },
  { id: "stc", name: "STC Pay", icon: "📱" },
]

export default function OrderPageWrapper({ params }: { params: Promise<{ gameId: string }> }) {
  const { gameId } = use(params)
  return <OrderPage gameId={gameId} />
}

function OrderPage({ gameId }: { gameId: string }) {
  const router = useRouter()
  const [game, setGame] = useState<Game | null>(null)
  const [packages, setPackages] = useState<Product[]>([])
  const [loadingGame, setLoadingGame] = useState(true)
  const [loadError, setLoadError] = useState("")

  useEffect(() => {
    let isMounted = true

    async function loadGame() {
      setLoadingGame(true)
      setLoadError("")
      try {
        const response = await fetch(`/api/games/${gameId}`)
        if (!response.ok) {
          throw new Error("Failed to load game")
        }
        const data = await response.json()
        if (isMounted) {
          setGame(data.game ?? null)
          setPackages(Array.isArray(data.products) ? data.products : [])
        }
      } catch (error) {
        if (isMounted) {
          setLoadError("Game not found.")
        }
      } finally {
        if (isMounted) {
          setLoadingGame(false)
        }
      }
    }

    loadGame()

    return () => {
      isMounted = false
    }
  }, [gameId])

  const [step, setStep] = useState(1)

  const [selectedPackage, setSelectedPackage] = useState("")
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [email, setEmail] = useState("")
  const [selectedPayment, setSelectedPayment] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  if (loadingGame) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container py-20 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </main>
        <Footer />
      </div>
    )
  }

  if (!game) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Game not found</h1>
          {loadError && <p className="text-muted-foreground mb-6">{loadError}</p>}
          <Button asChild>
            <a href="/services">Back to services</a>
          </Button>
        </main>
        <Footer />
      </div>
    )
  }


  const selectedPackageData = packages.find((p) => p.id.toString() === selectedPackage)

  const fields = [
    { name: "playerId", label: "Player ID", required: true },
    { name: "accountName", label: "Account Name", required: true },
  ]

  const handleNext = async () => {
    if (step === 1 && selectedPackage) setStep(2)
    else if (step === 2) {
      // validate required fields
      const missing = fields.filter((field) => field.required && !formData[field.name]).map((field) => field.label)
      if (missing.length) {
        setError(`Please fill in: ${missing.join(", ")}`)
        return
      }
      setError("")
      setStep(3)
    }
    else if (step === 3 && selectedPayment && selectedPackageData) {
      setLoading(true)
      setError("")

      try {
        const response = await fetch("/api/orders/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            gameId: game.slug,
            gameName: game.name,
            packageId: selectedPackageData.id,
            packageName: selectedPackageData.name,
            packagePrice: selectedPackageData.price,
            playerId: formData.playerId || "",
            accountName: formData.accountName || "",
            paymentMethod: selectedPayment,
            email: email,
          }),
        })

        const data = await response.json()

        if (data.success) {
          alert(`تم إنشاء الطلب بنجاح! رقم الطلب: ${data.orderNumber}\nسيتم توصيل الشحن خلال دقائق.`)
          router.push("/dashboard")
        } else {
          setError(data.error || "فشل إنشاء الطلب")
        }
      } catch (err) {
        console.error("[v0] Order creation error:", err)
        setError("حدث خطأ أثناء إنشاء الطلب")
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-12 md:py-16">
        <div className="container max-w-5xl">
          <div className="mb-8 md:mb-12">
            <div className="flex items-center justify-between max-w-2xl mx-auto">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                        step >= s
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-card text-muted-foreground"
                      }`}
                    >
                      {step > s ? <Check className="h-5 w-5" /> : s}
                    </div>
                    <p className="mt-2 text-xs md:text-sm font-medium text-muted-foreground">
                      {s === 1 ? "اختر الباقة" : s === 2 ? "البيانات" : "الدفع"}
                    </p>
                  </div>
                  {s < 3 && (
                    <div className={`h-0.5 flex-1 mx-2 transition-all ${step > s ? "bg-primary" : "bg-border"}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="p-6 md:p-8 border-border/50 bg-card/50 backdrop-blur">
                {step === 1 && (
                  <div>
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border/50">
                      <img
                        src={game.thumbnail_url || "/placeholder.svg"}
                        alt={game.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div>
                        <h2 className="text-2xl font-bold text-foreground">{game.name}</h2>
                        <p className="text-sm text-muted-foreground">اختر الباقة المناسبة</p>
                      </div>
                    </div>

                    <RadioGroup value={selectedPackage} onValueChange={setSelectedPackage}>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {packages.map((pkg) => (
                          <label
                            key={pkg.id}
                            className={`relative flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                              selectedPackage === pkg.id.toString()
                                ? "border-primary bg-primary/5"
                                : "border-border bg-card hover:border-primary/50"
                            }`}
                          >
                            <RadioGroupItem value={pkg.id.toString()} id={pkg.id.toString()} className="shrink-0" />
                            <div className="flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <p className="font-bold text-foreground">{pkg.name}</p>
                                {pkg.offer_name && <Badge className="bg-primary/90 text-xs">{pkg.offer_name}</Badge>}
                              </div>
                              <p className="text-sm text-primary font-bold mt-1">{pkg.price} ريال</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </RadioGroup>

                    <div className="mt-6 flex justify-end">
                      <Button onClick={handleNext} disabled={!selectedPackage}>
                        التالي
                      </Button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">أدخل بياناتك</h2>
                    <p className="text-sm text-muted-foreground mb-6">املأ البيانات المطلوبة بدقة</p>

                    <div className="space-y-4">
                      {fields.map((field) => (
                        <div key={field.name}>
                          <Label htmlFor={field.name} className="text-foreground">
                            {field.label}
                            {field.required && <span className="text-destructive mr-1">*</span>}
                          </Label>
                          <Input
                            id={field.name}
                            value={formData[field.name] || ""}
                            onChange={(e) => setFormData((prev) => ({ ...prev, [field.name]: e.target.value }))}
                            placeholder={`أدخل ${field.label}`}
                            className="mt-1.5 bg-background"
                            required={field.required}
                          />
                        </div>
                      ))}

                      <div>
                        <Label htmlFor="email" className="text-foreground">
                          البريد الإلكتروني
                          <span className="text-destructive mr-1">*</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="example@email.com"
                          className="mt-1.5 bg-background"
                          required
                        />
                        <p className="text-xs text-muted-foreground mt-1.5">سنرسل لك تفاصيل الطلب على هذا البريد</p>
                      </div>
                    </div>

                    <div className="mt-6 flex gap-3">
                      <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                        السابق
                      </Button>
                      <Button onClick={handleNext} className="flex-1" disabled={!email}>
                        التالي
                      </Button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">اختر طريقة الدفع</h2>
                    <p className="text-sm text-muted-foreground mb-6">اختر الطريقة المناسبة لك</p>

                    {error && (
                      <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
                        {error}
                      </div>
                    )}

                    <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment}>
                      <div className="space-y-3">
                        {paymentMethods.map((method) => (
                          <label
                            key={method.id}
                            className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                              selectedPayment === method.id
                                ? "border-primary bg-primary/5"
                                : "border-border bg-card hover:border-primary/50"
                            }`}
                          >
                            <RadioGroupItem value={method.id} id={method.id} />
                            <span className="text-2xl">{method.icon}</span>
                            <span className="font-medium text-foreground">{method.name}</span>
                          </label>
                        ))}
                      </div>
                    </RadioGroup>

                    <div className="mt-6 flex gap-3">
                      <Button variant="outline" onClick={() => setStep(2)} className="flex-1" disabled={loading}>
                        السابق
                      </Button>
                      <Button onClick={handleNext} className="flex-1 neon-glow" disabled={!selectedPayment || loading}>
                        {loading ? "جاري إنشاء الطلب..." : "إتمام الطلب"}
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="p-6 border-border/50 bg-card/50 backdrop-blur sticky top-20">
                <h3 className="text-lg font-bold text-foreground mb-4">ملخص الطلب</h3>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-4 border-b border-border/50">
                    <img
                      src={game.thumbnail_url || "/placeholder.svg"}
                      alt={game.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{game.name}</p>
                      {selectedPackageData && (
                        <p className="text-sm text-muted-foreground">{selectedPackageData.name}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">السعر</span>
                      <span className="text-foreground font-medium">
                        {selectedPackageData ? `${selectedPackageData.price} ريال` : "-"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">رسوم الخدمة</span>
                      <span className="text-foreground font-medium">0 ريال</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/50">
                    <div className="flex justify-between">
                      <span className="font-bold text-foreground">الإجمالي</span>
                      <span className="font-bold text-primary text-lg">
                        {selectedPackageData ? `${selectedPackageData.price} ريال` : "-"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Zap className="h-4 w-4 text-primary" />
                    <span>توصيل فوري بعد الدفع</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4 text-primary" />
                    <span>معاملات آمنة ومشفرة</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-primary" />
                    <span>ضمان استرجاع الأموال</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}