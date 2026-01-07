import Link from "next/link"
import { Gamepad2, MessageCircle, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="relative">
                <Gamepad2 className="h-8 w-8 text-primary" />
                <div className="absolute inset-0 h-8 w-8 text-primary blur-lg opacity-50" />
              </div>
              <span className="text-xl font-bold text-foreground">Pay Games</span>
            </Link>
            <p className="text-muted-foreground leading-relaxed max-w-md mb-4">
              منصة رقمية لشحن الألعاب والاشتراكات الرقمية عبر الوطن العربي. دفع آمن، توصيل فوري، أسعار تنافسية.
            </p>
            <div className="flex gap-4">
              <Link
                href="https://wa.me/966500000000"
                target="_blank"
                className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
              </Link>
              <Link
                href="mailto:support@paygames.com"
                className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-colors"
              >
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-foreground mb-4">روابط سريعة</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/services" className="text-muted-foreground hover:text-foreground transition-colors">
                  الخدمات
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-muted-foreground hover:text-foreground transition-colors">
                  الدعم الفني
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
                  لوحة التحكم
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-foreground mb-4">الشروط والسياسات</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  الشروط والأحكام
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  سياسة الخصوصية
                </Link>
              </li>
              <li>
                <Link href="/refund" className="text-muted-foreground hover:text-foreground transition-colors">
                  سياسة الاسترجاع
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/40 text-center text-muted-foreground">
          <p>© 2025 Pay Games. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  )
}
