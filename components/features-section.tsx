import { Card } from "@/components/ui/card"
import { Wallet, Zap, MessageCircle, Shield, Clock, DollarSign } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "توصيل فوري",
    description: "احصل على شحنتك خلال ثوانٍ من إتمام الدفع",
  },
  {
    icon: Shield,
    title: "دفع آمن",
    description: "معاملات مشفرة ومحمية بأعلى معايير الأمان",
  },
  {
    icon: Wallet,
    title: "طرق دفع متعددة",
    description: "PayPal، Binance Pay، USDT، والمحافظ المحلية",
  },
  {
    icon: DollarSign,
    title: "أسعار تنافسية",
    description: "أفضل الأسعار في السوق مع عروض وخصومات دائمة",
  },
  {
    icon: MessageCircle,
    title: "دعم فني 24/7",
    description: "فريق دعم متواجد على مدار الساعة عبر واتساب",
  },
  {
    icon: Clock,
    title: "عملية بسيطة",
    description: "اختر الخدمة → أدخل البيانات → ادفع → استلم فوراً",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 md:py-28 bg-muted/30">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            لماذا Pay Games؟
          </h2>
          <p className="text-lg text-muted-foreground text-balance mx-auto max-w-2xl leading-relaxed">
            نوفر لك تجربة شحن سلسة وآمنة مع أفضل الخدمات
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card
                key={feature.title}
                className="p-6 border-border/50 bg-card/50 backdrop-blur hover:border-primary/30 transition-all group"
              >
                <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
