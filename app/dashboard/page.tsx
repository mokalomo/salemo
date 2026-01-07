import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { sql } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, Clock, CheckCircle2, XCircle, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { LogoutButton } from "@/components/logout-button"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  // If admin, redirect to admin dashboard
  if (user.role === "admin") {
    redirect("/admin/dashboard")
  }

  // Fetch user's orders
  const orders = await sql`
    SELECT * FROM orders
    WHERE user_id = ${user.id}
    ORDER BY created_at DESC
  `

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    completed: orders.filter((o) => o.status === "completed").length,
    failed: orders.filter((o) => o.status === "failed").length,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              لوحة التحكم
            </h1>
            <p className="text-sm text-muted-foreground">مرحباً، {user.full_name}</p>
          </div>
          <LogoutButton />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">إجمالي الطلبات</CardTitle>
                <Package className="w-4 h-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card className="border-yellow-500/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">قيد المعالجة</CardTitle>
                <Clock className="w-4 h-4 text-yellow-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-500">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card className="border-green-500/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">مكتملة</CardTitle>
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">{stats.completed}</div>
            </CardContent>
          </Card>

          <Card className="border-red-500/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">فاشلة</CardTitle>
                <XCircle className="w-4 h-4 text-red-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-500">{stats.failed}</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>إجراءات سريعة</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Button asChild className="bg-gradient-to-r from-primary to-secondary">
              <Link href="/services">
                <ShoppingBag className="w-4 h-4 ml-2" />
                تصفح الألعاب
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/support">تواصل مع الدعم</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Orders List */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>طلباتي الأخيرة</CardTitle>
            <CardDescription>جميع طلبات الشحن الخاصة بك</CardDescription>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>لا توجد طلبات بعد</p>
                <Button asChild className="mt-4">
                  <Link href="/services">ابدأ الشحن الآن</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-border/50 rounded-lg hover:border-primary/50 transition-colors"
                  >
                    <div className="space-y-2 mb-4 md:mb-0">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">{order.game_name}</h3>
                        <Badge
                          variant={
                            order.status === "completed"
                              ? "default"
                              : order.status === "pending"
                                ? "secondary"
                                : order.status === "processing"
                                  ? "secondary"
                                  : "destructive"
                          }
                        >
                          {order.status === "completed"
                            ? "مكتمل"
                            : order.status === "pending"
                              ? "قيد الانتظار"
                              : order.status === "processing"
                                ? "قيد المعالجة"
                                : order.status === "failed"
                                  ? "فشل"
                                  : "ملغي"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{order.package_name}</p>
                      <p className="text-xs text-muted-foreground">رقم الطلب: {order.order_number}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString("ar-SA")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">${order.package_price}</p>
                      <p className="text-xs text-muted-foreground">{order.payment_method}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
