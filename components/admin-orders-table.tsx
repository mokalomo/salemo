"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"

interface Order {
  id: number
  order_number: string
  game_name: string
  package_name: string
  package_price: string
  player_id: string
  account_name?: string
  payment_method: string
  status: string
  created_at: string
  email: string
  full_name: string
}

export function AdminOrdersTable({ orders }: { orders: Order[] }) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [updating, setUpdating] = useState<number | null>(null)
  const router = useRouter()

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.order_number.toLowerCase().includes(search.toLowerCase()) ||
      order.game_name.toLowerCase().includes(search.toLowerCase()) ||
      order.email.toLowerCase().includes(search.toLowerCase()) ||
      order.full_name.toLowerCase().includes(search.toLowerCase()) ||
      order.player_id.toLowerCase().includes(search.toLowerCase()) ||
      (order.account_name || "").toLowerCase().includes(search.toLowerCase())

    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  async function updateOrderStatus(orderId: number, newStatus: string) {
    setUpdating(orderId)
    try {
      const response = await fetch("/api/admin/orders/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      })

      if (response.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error("[v0] Error updating order:", error)
    } finally {
      setUpdating(null)
    }
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="البحث برقم الطلب، اللعبة، أو المستخدم..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="تصفية حسب الحالة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الحالات</SelectItem>
            <SelectItem value="pending">قيد الانتظار</SelectItem>
            <SelectItem value="processing">قيد المعالجة</SelectItem>
            <SelectItem value="completed">مكتمل</SelectItem>
            <SelectItem value="failed">فاشل</SelectItem>
            <SelectItem value="refunded">مسترد</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      <div className="border border-border/50 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-right p-3 text-sm font-medium">رقم الطلب</th>
                <th className="text-right p-3 text-sm font-medium">المستخدم</th>
                <th className="text-right p-3 text-sm font-medium">اللعبة</th>
                <th className="text-right p-3 text-sm font-medium">المعرف / الحساب</th>
                <th className="text-right p-3 text-sm font-medium">الباقة</th>
                <th className="text-right p-3 text-sm font-medium">السعر</th>
                <th className="text-right p-3 text-sm font-medium">الحالة</th>
                <th className="text-right p-3 text-sm font-medium">التاريخ</th>
                <th className="text-right p-3 text-sm font-medium">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center p-8 text-muted-foreground">
                    لا توجد طلبات
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="border-t border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="p-3 text-sm font-mono">{order.order_number}</td>
                    <td className="p-3 text-sm">
                      <div>{order.full_name}</div>
                      <div className="text-xs text-muted-foreground">{order.email}</div>
                    </td>
                    <td className="p-3 text-sm">{order.game_name}</td>
                    <td className="p-3 text-sm">
                      <div>{order.player_id}</div>
                      <div className="text-xs text-muted-foreground">{order.account_name}</div>
                    </td>
                    <td className="p-3 text-sm">{order.package_name}</td>
                    <td className="p-3 text-sm font-semibold">${order.package_price}</td>
                    <td className="p-3">
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
                                : "مسترد"}
                      </Badge>
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString("ar-SA")}
                    </td>
                    <td className="p-3">
                      <Select
                        value={order.status}
                        onValueChange={(value) => updateOrderStatus(order.id, value)}
                        disabled={updating === order.id}
                      >
                        <SelectTrigger className="w-[140px] h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">قيد الانتظار</SelectItem>
                          <SelectItem value="processing">قيد المعالجة</SelectItem>
                          <SelectItem value="completed">مكتمل</SelectItem>
                          <SelectItem value="failed">فاشل</SelectItem>
                          <SelectItem value="refunded">مسترد</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
