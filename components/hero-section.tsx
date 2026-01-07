import { Button } from "@/components/ui/button"
import { Zap, Shield, Clock } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />

      <div className="container relative py-24 md:py-32 lg:py-40">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-primary blur-3xl opacity-30 animate-pulse" />
              <div className="relative rounded-full bg-card/50 border border-primary/50 px-6 py-2 backdrop-blur">
                <p className="text-sm font-medium text-primary">🎮 أسرع منصة لشحن الألعاب في الوطن العربي</p>
              </div>
            </div>
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl text-balance">
            اشحن ألعابك <span className="text-primary neon-text">بسرعة البرق</span>
          </h1>

          <p className="mb-10 text-lg text-muted-foreground sm:text-xl md:text-2xl text-balance leading-relaxed max-w-3xl mx-auto">
            منصة رقمية لشحن الألعاب والاشتراكات الرقمية عبر الوطن العربي
            <br />
            دفع آمن، توصيل فوري، أسعار تنافسية
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 neon-glow" asChild>
              <Link href="/services">ابدأ الشحن الآن</Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-6 bg-transparent" asChild>
              <Link href="/support">تواصل معنا</Link>
            </Button>
          </div>

          {/* Quick stats */}
          <div className="mt-16 grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto">
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 border border-primary/20">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground">فوري</p>
              <p className="text-sm text-muted-foreground">توصيل سريع</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary/10 border border-secondary/20">
                <Shield className="h-6 w-6 text-secondary" />
              </div>
              <p className="text-2xl font-bold text-foreground">آمن</p>
              <p className="text-sm text-muted-foreground">دفع محمي</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 border border-accent/20">
                <Clock className="h-6 w-6 text-accent" />
              </div>
              <p className="text-2xl font-bold text-foreground">24/7</p>
              <p className="text-sm text-muted-foreground">دعم متواصل</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
