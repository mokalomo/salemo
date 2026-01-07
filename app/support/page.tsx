import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { MessageCircle, Mail, Clock, HelpCircle, Zap, Shield } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

const faqs = [
  {
    question: "كم يستغرق توصيل الشحن؟",
    answer: "عادة ما يتم توصيل الشحن خلال 1-5 دقائق من إتمام عملية الدفع. في حالات نادرة قد يستغرق الأمر حتى 30 دقيقة.",
  },
  {
    question: "ما هي طرق الدفع المتاحة؟",
    answer: "نوفر عدة طرق للدفع: PayPal، Binance Pay، USDT، مدى، STC Pay. جميع المعاملات مشفرة وآمنة 100%.",
  },
  {
    question: "هل يمكنني استرجاع المبلغ؟",
    answer:
      "نعم، نوفر ضمان استرجاع الأموال في حال عدم وصول الشحن أو حدوث مشكلة تقنية. يرجى التواصل معنا خلال 24 ساعة من الطلب.",
  },
  {
    question: "كيف أحصل على معرف اللاعب الخاص بي؟",
    answer:
      "كل لعبة لها طريقة مختلفة. عادة ما تجد معرف اللاعب (Player ID) في إعدادات اللعبة أو في الملف الشخصي. يمكنك التواصل معنا للمساعدة.",
  },
  {
    question: "هل خدماتكم متاحة في جميع الدول العربية؟",
    answer: "نعم، نوفر خدماتنا في جميع دول الوطن العربي مع دعم العملات المحلية وطرق الدفع المناسبة لكل منطقة.",
  },
  {
    question: "ماذا أفعل إذا لم أستلم الشحن؟",
    answer: "في حال عدم وصول الشحن خلال 30 دقيقة، يرجى التواصل معنا فوراً عبر واتساب أو البريد الإلكتروني مع رقم الطلب.",
  },
  {
    question: "هل حسابي آمن؟",
    answer:
      "نحن لا نطلب كلمة المرور الخاصة بك أبداً. نحتاج فقط معرف اللاعب أو اسم المستخدم لإتمام الشحن. جميع بياناتك محمية بالكامل.",
  },
  {
    question: "هل تقدمون خصومات للطلبات الكبيرة؟",
    answer: "نعم، نوفر خصومات خاصة للطلبات بالجملة وللعملاء الدائمين. تواصل معنا لمعرفة التفاصيل.",
  },
]

const contactMethods = [
  {
    icon: MessageCircle,
    title: "واتساب",
    description: "تواصل معنا مباشرة عبر واتساب",
    action: "ابدأ المحادثة",
    href: "https://wa.me/966500000000",
    available: "متاح 24/7",
    color: "bg-green-500/10 border-green-500/20 text-green-500",
  },
  {
    icon: Mail,
    title: "البريد الإلكتروني",
    description: "أرسل لنا استفسارك وسنرد خلال ساعات",
    action: "support@paygames.com",
    href: "mailto:support@paygames.com",
    available: "الرد خلال 2-4 ساعات",
    color: "bg-primary/10 border-primary/20 text-primary",
  },
]

export default function SupportPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 border-b border-border/40">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
          <div className="container relative">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <HelpCircle className="h-8 w-8 text-primary" />
              </div>
              <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl text-balance">
                كيف يمكننا مساعدتك؟
              </h1>
              <p className="text-lg text-muted-foreground text-balance leading-relaxed">
                فريق الدعم الفني جاهز لمساعدتك في أي وقت
              </p>
            </div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-12 md:py-16">
          <div className="container max-w-5xl">
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {contactMethods.map((method) => {
                const Icon = method.icon
                return (
                  <Card
                    key={method.title}
                    className={`p-6 border-border/50 bg-card/50 backdrop-blur hover:border-primary/30 transition-all group`}
                  >
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${method.color}`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{method.title}</h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">{method.description}</p>
                    <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{method.available}</span>
                    </div>
                    <Button className="w-full group-hover:shadow-lg transition-shadow" asChild>
                      <Link href={method.href} target="_blank">
                        {method.action}
                      </Link>
                    </Button>
                  </Card>
                )
              })}
            </div>

            {/* Quick Info */}
            <div className="grid sm:grid-cols-3 gap-4 mb-12">
              <Card className="p-6 text-center border-border/50 bg-gradient-to-br from-primary/5 to-transparent">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 border border-primary/20 mb-3 mx-auto">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-bold text-foreground mb-1">رد سريع</h4>
                <p className="text-sm text-muted-foreground">متوسط الرد أقل من 5 دقائق</p>
              </Card>
              <Card className="p-6 text-center border-border/50 bg-gradient-to-br from-secondary/5 to-transparent">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary/10 border border-secondary/20 mb-3 mx-auto">
                  <Clock className="h-6 w-6 text-secondary" />
                </div>
                <h4 className="font-bold text-foreground mb-1">متاح دائماً</h4>
                <p className="text-sm text-muted-foreground">دعم فني 24/7 طوال الأسبوع</p>
              </Card>
              <Card className="p-6 text-center border-border/50 bg-gradient-to-br from-accent/5 to-transparent">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 border border-accent/20 mb-3 mx-auto">
                  <Shield className="h-6 w-6 text-accent" />
                </div>
                <h4 className="font-bold text-foreground mb-1">حلول مضمونة</h4>
                <p className="text-sm text-muted-foreground">نحل 99% من المشاكل فوراً</p>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">الأسئلة الشائعة</h2>
              <p className="text-lg text-muted-foreground text-balance leading-relaxed">
                إجابات سريعة لأكثر الأسئلة شيوعاً
              </p>
            </div>

            <Card className="p-6 md:p-8 border-border/50 bg-card/50 backdrop-blur">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-right hover:text-primary text-foreground">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>

            <div className="mt-8 text-center">
              <p className="text-muted-foreground mb-4">لم تجد إجابة لسؤالك؟</p>
              <Button size="lg" asChild>
                <Link href="https://wa.me/966500000000" target="_blank">
                  <MessageCircle className="ml-2 h-5 w-5" />
                  تواصل معنا مباشرة
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Additional Help */}
        <section className="py-12 md:py-16">
          <div className="container max-w-4xl">
            <Card className="p-8 md:p-12 text-center border-primary/30 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">بحاجة لمساعدة عاجلة؟</h2>
              <p className="text-muted-foreground mb-6 text-balance leading-relaxed max-w-2xl mx-auto">
                فريقنا متواجد على مدار الساعة لمساعدتك في حل أي مشكلة
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="neon-glow">
                  <Link href="https://wa.me/966500000000" target="_blank">
                    <MessageCircle className="ml-2 h-5 w-5" />
                    واتساب الآن
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="mailto:support@paygames.com">
                    <Mail className="ml-2 h-5 w-5" />
                    أرسل بريد إلكتروني
                  </Link>
                </Button>
              </div>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
