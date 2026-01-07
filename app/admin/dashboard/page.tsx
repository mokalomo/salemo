import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { sql } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Package, Users, TrendingUp } from "lucide-react"
import { LogoutButton } from "@/components/logout-button"
import { AdminOrdersTable } from "@/components/admin-orders-table"
import { GamesManagement } from "@/components/admin/games-management"
import { ProductsManagement } from "@/components/admin/products-management"
import { OffersManagement } from "@/components/admin/offers-management"
import { PacksManagement } from "@/components/admin/packs-management"

export const dynamic = "force-dynamic"

async function getDashboardData() {
  const games = await sql`SELECT id, name, slug, thumbnail_url, status FROM games ORDER BY created_at DESC`
  const products = await sql`SELECT id, game_id, name, base_price FROM products ORDER BY created_at DESC`
  return { games, products }
}

export default async function AdminDashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "admin") {
    redirect("/dashboard")
  }

  // Fetch all orders
  const orders = await sql`
    SELECT o.*, u.email, u.full_name
    FROM orders o
    JOIN users u ON o.user_id = u.id
    ORDER BY o.created_at DESC
  `

  // Fetch all users
  const users = await sql`
    SELECT COUNT(*) as count FROM users
  `

  const { games, products } = await getDashboardData()

  // Calculate stats
  const totalRevenue = orders
    .filter((o) => o.status === "completed")
    .reduce((sum, o) => sum + Number.parseFloat(o.package_price), 0)

  const stats = {
    totalRevenue: totalRevenue.toFixed(2),
    totalOrders: orders.length,
    totalUsers: users[0].count,
    pendingOrders: orders.filter((o) => o.status === "pending").length,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              لوحة تحكم الأدمن
            </h1>
            <p className="text-sm text-muted-foreground">مرحباً، {user.full_name}</p>
          </div>
          <LogoutButton />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-green-500/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">إجمالي الإيرادات</CardTitle>
                <DollarSign className="w-4 h-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">${stats.totalRevenue}</div>
              <p className="text-xs text-muted-foreground mt-1">من الطلبات المكتملة</p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">إجمالي الطلبات</CardTitle>
                <Package className="w-4 h-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground mt-1">{stats.pendingOrders} قيد الانتظار</p>
            </CardContent>
          </Card>

          <Card className="border-blue-500/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">إجمالي المستخدمين</CardTitle>
                <Users className="w-4 h-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-500">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card className="border-purple-500/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">متوسط الطلب</CardTitle>
                <TrendingUp className="w-4 h-4 text-purple-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-500">
                ${stats.totalOrders > 0 ? (totalRevenue / stats.totalOrders).toFixed(2) : "0.00"}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Management */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>إدارة الطلبات</CardTitle>
            <CardDescription>جميع طلبات المستخدمين</CardDescription>
          </CardHeader>
          <CardContent>
            <AdminOrdersTable orders={orders} />
          </CardContent>
        </Card>

        {/* Games, Products, Offers, and Packs Management Sections */}
        <GamesManagement />
        <ProductsManagement games={games} />
        <OffersManagement games={games} products={products} />
        <PacksManagement games={games} products={products} />
      </div>
    </div>
  )
}
