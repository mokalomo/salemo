"use client"

import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, ShoppingCart, Users, TrendingUp, Search, Check, X, Eye } from "lucide-react"
import { useState } from "react"

// Mock data for demonstration
const stats = [
  {
    title: "إجمالي المبيعات",
    value: "45,280 ريال",
    change: "+12.5%",
    icon: DollarSign,
    trend: "up",
  },
  {
    title: "الطلبات اليوم",
    value: "127",
    change: "+8.2%",
    icon: ShoppingCart,
    trend: "up",
  },
  {
    title: "العملاء الجدد",
    value: "38",
    change: "+15.3%",
    icon: Users,
    trend: "up",
  },
  {
    title: "معدل الإنجاز",
    value: "98.5%",
    change: "+2.1%",
    icon: TrendingUp,
    trend: "up",
  },
]

const orders = [
  {
    id: "#ORD-1234",
    game: "PUBG Mobile",
    gameAr: "ببجي موبايل",
    package: "660 UC",
    customer: "أحمد محمد",
    email: "ahmad@example.com",
    playerId: "5123456789",
    amount: "50 ريال",
    status: "completed",
    payment: "PayPal",
    date: "2025-01-15 14:30",
  },
  {
    id: "#ORD-1235",
    game: "Free Fire",
    gameAr: "فري فاير",
    package: "520 ألماسة",
    customer: "فاطمة علي",
    email: "fatima@example.com",
    playerId: "9876543210",
    amount: "25 ريال",
    status: "pending",
    payment: "مدى",
    date: "2025-01-15 14:25",
  },
  {
    id: "#ORD-1236",
    game: "Roblox",
    gameAr: "روبلوكس",
    package: "800 Robux",
    customer: "خالد سعيد",
    email: "khalid@example.com",
    playerId: "robux_user123",
    amount: "40 ريال",
    status: "processing",
    payment: "Binance Pay",
    date: "2025-01-15 14:20",
  },
  {
    id: "#ORD-1237",
    game: "Call of Duty",
    gameAr: "كول اوف ديوتي",
    package: "400 CP",
    customer: "سارة أحمد",
    email: "sara@example.com",
    playerId: "cod_player456",
    amount: "25 ريال",
    status: "completed",
    payment: "STC Pay",
    date: "2025-01-15 14:15",
  },
  {
    id: "#ORD-1238",
    game: "Netflix",
    gameAr: "نتفليكس",
    package: "شهر واحد",
    customer: "محمود حسن",
    email: "mahmoud@example.com",
    playerId: "netflix@mail.com",
    amount: "30 ريال",
    status: "failed",
    payment: "PayPal",
    date: "2025-01-15 14:10",
  },
]

const statusConfig: Record<string, { label: string; color: string }> = {
  completed: { label: "مكتمل", color: "bg-green-500/10 text-green-500 border-green-500/20" },
  pending: { label: "قيد الانتظار", color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
  processing: { label: "قيد المعالجة", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  failed: { label: "فشل", color: "bg-red-500/10 text-red-500 border-red-500/20" },
}

export default function AdminPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<any>(null)

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-8">
        <div className="container max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">لوحة التحكم</h1>
            <p className="text-muted-foreground">إدارة الطلبات والمبيعات</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <Card key={stat.title} className="p-6 border-border/50 bg-card/50 backdrop-blur">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                      <p className="text-2xl font-bold text-foreground mb-2">{stat.value}</p>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-green-500" />
                        <span className="text-xs text-green-500 font-medium">{stat.change}</span>
                        <span className="text-xs text-muted-foreground">من الشهر الماضي</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 border border-primary/20">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>

          {/* Orders Management */}
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <div className="p-6 border-b border-border/50">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-1">الطلبات</h2>
                  <p className="text-sm text-muted-foreground">إدارة جميع الطلبات والمعاملات</p>
                </div>
                <div className="relative w-full md:w-80">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="ابحث عن طلب..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10 bg-background"
                  />
                </div>
              </div>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <div className="px-6 pt-4 border-b border-border/50">
                <TabsList className="bg-muted/30">
                  <TabsTrigger value="all">الكل ({orders.length})</TabsTrigger>
                  <TabsTrigger value="pending">قيد الانتظار (1)</TabsTrigger>
                  <TabsTrigger value="processing">قيد المعالجة (1)</TabsTrigger>
                  <TabsTrigger value="completed">مكتمل (2)</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="all" className="m-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/20 border-b border-border/50">
                      <tr>
                        <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">رقم الطلب</th>
                        <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">العميل</th>
                        <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">اللعبة</th>
                        <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">الباقة</th>
                        <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">المبلغ</th>
                        <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">الحالة</th>
                        <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">إجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="border-b border-border/30 hover:bg-muted/10 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-medium text-foreground">{order.id}</p>
                            <p className="text-xs text-muted-foreground">{order.date}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-medium text-foreground">{order.customer}</p>
                            <p className="text-xs text-muted-foreground">{order.email}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-foreground">{order.gameAr}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-foreground">{order.package}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-medium text-primary">{order.amount}</p>
                            <p className="text-xs text-muted-foreground">{order.payment}</p>
                          </td>
                          <td className="px-6 py-4">
                            <Badge className={`${statusConfig[order.status].color} border`}>
                              {statusConfig[order.status].label}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedOrder(order)}
                                className="h-8 w-8 p-0"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {order.status === "pending" && (
                                <>
                                  <Button size="sm" className="h-8 w-8 p-0 bg-green-500 hover:bg-green-600">
                                    <Check className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="destructive" className="h-8 w-8 p-0">
                                    <X className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </Card>

          {/* Order Detail Modal */}
          {selectedOrder && (
            <div
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedOrder(null)}
            >
              <Card
                className="max-w-2xl w-full p-6 border-border/50 bg-card backdrop-blur"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-1">تفاصيل الطلب</h3>
                    <p className="text-sm text-muted-foreground">{selectedOrder.id}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(null)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">العميل</p>
                      <p className="font-medium text-foreground">{selectedOrder.customer}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">البريد الإلكتروني</p>
                      <p className="font-medium text-foreground">{selectedOrder.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">اللعبة</p>
                      <p className="font-medium text-foreground">{selectedOrder.gameAr}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">الباقة</p>
                      <p className="font-medium text-foreground">{selectedOrder.package}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">معرف اللاعب</p>
                      <p className="font-medium text-foreground">{selectedOrder.playerId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">طريقة الدفع</p>
                      <p className="font-medium text-foreground">{selectedOrder.payment}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">المبلغ</p>
                      <p className="font-medium text-primary text-lg">{selectedOrder.amount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">الحالة</p>
                      <Badge className={`${statusConfig[selectedOrder.status].color} border`}>
                        {statusConfig[selectedOrder.status].label}
                      </Badge>
                    </div>
                  </div>

                  {selectedOrder.status === "pending" && (
                    <div className="flex gap-3 pt-4 border-t border-border/50">
                      <Button className="flex-1 bg-green-500 hover:bg-green-600">
                        <Check className="ml-2 h-4 w-4" />
                        تأكيد الطلب
                      </Button>
                      <Button variant="destructive" className="flex-1">
                        <X className="ml-2 h-4 w-4" />
                        رفض الطلب
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
