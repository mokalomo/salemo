"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, Edit2, Trash2, Eye, EyeOff, Clock } from "lucide-react"

interface Offer {
  id: number
  name: string
  description: string
  game_id: number
  game_name: string
  offer_type: string
  discount_value: number
  start_date: string
  end_date: string
  status: string
  product_count: number
  created_at: string
}

interface OffersManagementProps {
  games: Array<{ id: number; name: string }>
  products: Array<{ id: number; name: string; game_id: number }>
}

export function OffersManagement({ games, products }: OffersManagementProps) {
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null)
  const [selectedProducts, setSelectedProducts] = useState<number[]>([])
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    game_id: "",
    offer_type: "percentage",
    discount_value: "",
    start_date: "",
    end_date: "",
  })

  useEffect(() => {
    fetchOffers()
  }, [])

  const fetchOffers = async () => {
    try {
      const response = await fetch("/api/admin/offers")
      const data = await response.json()
      setOffers(data)
    } catch (error) {
      console.error("Error fetching offers:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const method = editingOffer ? "PUT" : "POST"
      const url = editingOffer ? `/api/admin/offers/${editingOffer.id}` : "/api/admin/offers"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          game_id: Number.parseInt(formData.game_id),
          offer_type: formData.offer_type,
          discount_value: Number.parseFloat(formData.discount_value),
          start_date: formData.start_date,
          end_date: formData.end_date,
          product_ids: selectedProducts,
        }),
      })

      if (response.ok) {
        fetchOffers()
        setIsOpen(false)
        resetForm()
      }
    } catch (error) {
      console.error("Error saving offer:", error)
    }
  }

  const handleDelete = async (offerId: number) => {
    if (confirm("Are you sure you want to delete this offer?")) {
      try {
        const response = await fetch(`/api/admin/offers/${offerId}`, { method: "DELETE" })
        if (response.ok) {
          fetchOffers()
        }
      } catch (error) {
        console.error("Error deleting offer:", error)
      }
    }
  }

  const handleToggleStatus = async (offer: Offer) => {
    const newStatus = offer.status === "active" ? "inactive" : "active"
    try {
      const response = await fetch(`/api/admin/offers/${offer.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      if (response.ok) {
        fetchOffers()
      }
    } catch (error) {
      console.error("Error toggling status:", error)
    }
  }

  const openEditDialog = (offer: Offer) => {
    setEditingOffer(offer)
    setFormData({
      name: offer.name,
      description: offer.description,
      game_id: offer.game_id.toString(),
      offer_type: offer.offer_type,
      discount_value: offer.discount_value.toString(),
      start_date: new Date(offer.start_date).toISOString().split("T")[0],
      end_date: new Date(offer.end_date).toISOString().split("T")[0],
    })
    setSelectedProducts([])
    setIsOpen(true)
  }

  const resetForm = () => {
    setIsOpen(false)
    setEditingOffer(null)
    setSelectedProducts([])
    setFormData({
      name: "",
      description: "",
      game_id: "",
      offer_type: "percentage",
      discount_value: "",
      start_date: "",
      end_date: "",
    })
  }

  const getIsExpired = (endDate: string) => {
    return new Date(endDate) < new Date()
  }

  const filteredOffers = offers.filter((offer) => offer.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const gameProducts = products.filter((p) => p.game_id === Number.parseInt(formData.game_id || "0"))

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Offers Management</CardTitle>
            <CardDescription>Create and manage special offers for products</CardDescription>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="gap-2">
                <Plus className="w-4 h-4" />
                Add Offer
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingOffer ? "Edit Offer" : "Create New Offer"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Offer Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="game">Game</Label>
                    <select
                      id="game"
                      value={formData.game_id}
                      onChange={(e) => setFormData({ ...formData, game_id: e.target.value })}
                      className="w-full px-3 py-2 border border-input bg-background rounded-md"
                      required
                    >
                      <option value="">Select a game</option>
                      {games.map((game) => (
                        <option key={game.id} value={game.id}>
                          {game.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full min-h-20 px-3 py-2 border border-input bg-background rounded-md"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="offerType">Offer Type</Label>
                    <select
                      id="offerType"
                      value={formData.offer_type}
                      onChange={(e) => setFormData({ ...formData, offer_type: e.target.value })}
                      className="w-full px-3 py-2 border border-input bg-background rounded-md"
                    >
                      <option value="percentage">Percentage Discount</option>
                      <option value="fixed">Fixed Price Discount</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="discountValue">Discount Value</Label>
                    <Input
                      id="discountValue"
                      type="number"
                      step="0.01"
                      value={formData.discount_value}
                      onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                      placeholder={formData.offer_type === "percentage" ? "e.g., 20" : "e.g., 5.00"}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label>Select Products</Label>
                  <div className="border border-input rounded-md p-3 space-y-2 max-h-48 overflow-y-auto">
                    {gameProducts.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Select a game first</p>
                    ) : (
                      gameProducts.map((product) => (
                        <label key={product.id} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedProducts.includes(product.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedProducts([...selectedProducts, product.id])
                              } else {
                                setSelectedProducts(selectedProducts.filter((id) => id !== product.id))
                              }
                            }}
                            className="w-4 h-4 border border-input rounded cursor-pointer"
                          />
                          <span className="text-sm">{product.name}</span>
                        </label>
                      ))
                    )}
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  {editingOffer ? "Update Offer" : "Create Offer"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Search offers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : filteredOffers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No offers found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Name</th>
                  <th className="text-left py-3 px-4 font-semibold">Game</th>
                  <th className="text-left py-3 px-4 font-semibold">Discount</th>
                  <th className="text-left py-3 px-4 font-semibold">Valid Until</th>
                  <th className="text-center py-3 px-4 font-semibold">Products</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-right py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOffers.map((offer) => {
                  const isExpired = getIsExpired(offer.end_date)
                  return (
                    <tr key={offer.id} className="border-b border-border/50 hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{offer.name}</td>
                      <td className="py-3 px-4 text-muted-foreground">{offer.game_name}</td>
                      <td className="py-3 px-4">
                        {offer.offer_type === "percentage"
                          ? `${offer.discount_value}%`
                          : `$${Number.parseFloat(offer.discount_value.toString()).toFixed(2)}`}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          {new Date(offer.end_date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">{offer.product_count}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            isExpired
                              ? "bg-gray-500/20 text-gray-400"
                              : offer.status === "active"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {isExpired ? "Expired" : offer.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(offer)}
                            className="gap-1"
                            disabled={isExpired}
                          >
                            {offer.status === "active" ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => openEditDialog(offer)} className="gap-1">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(offer.id)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
