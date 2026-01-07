import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MessageCircle, ArrowLeft } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 border border-primary/30">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <div className="relative px-8 py-16 md:px-16 md:py-24 text-center">
            <h2 className="mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl text-balance">
              جاهز لبدء الشحن؟
            </h2>
            <p className="mb-8 text-lg text-muted-foreground text-balance mx-auto max-w-2xl leading-relaxed">
              انضم إلى آلاف اللاعبين الذين يثقون بنا لشحن ألعابهم
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 neon-glow" asChild>
                <Link href="/services">
                  ابدأ الآن
                  <ArrowLeft className="mr-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-6 bg-transparent" asChild>
                <Link href="https://wa.me/966500000000" target="_blank">
                  <MessageCircle className="ml-2 h-5 w-5" />
                  تواصل عبر واتساب
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
