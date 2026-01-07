"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, Edit2, Trash2, Eye, EyeOff, Zap } from "lucide-react"

interface Pack {
  id: number
  name: string
  description: string
  game_id: number
  game_name: string
  image_url: string
  original_price: number
  pack_price: number
  discount_percentage: number
  status: string
  product_count: number
  created_at: string
}

interface PacksManagementProps {
  games: Array<{ id: number; name: string }>
  products: Array<{ id: number; name: string; game_id: number; base_price: number }>
}

export function PacksManagement({ games, products }: PacksManagementProps) {
  const [packs, setPacks] = useState<Pack[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [editingPack, setEditingPack] = useState<Pack | null>(null)
  const [selectedProducts, setSelectedProducts] = useState<number[]>([])
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    game_id: "",
    image_url: "",
    original_price: "",
    pack_price: "",
  })

  useEffect(() => {
    fetchPacks()
  }, [])

  const fetchPacks = async () => {
    try {
      const response = await fetch("/api/admin/packs")
      const data = await response.json()
      setPacks(data)
    } catch (error) {
      console.error("Error fetching packs:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const method = editingPack ? "PUT" : "POST"
      const url = editingPack ? `/api/admin/packs/${editingPack.id}` : "/api/admin/packs"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          game_id: Number.parseInt(formData.game_id),
          image_url: formData.image_url || null,
          original_price: Number.parseFloat(formData.original_price),
          pack_price: Number.parseFloat(formData.pack_price),
          product_ids: selectedProducts,
        }),
      })

      if (response.ok) {
        fetchPacks()
        setIsOpen(false)
        resetForm()
      }
    } catch (error) {
      console.error("Error saving pack:", error)
    }
  }

  const handleDelete = async (packId: number) => {
    if (confirm("Are you sure you want to delete this pack?")) {
      try {
        const response = await fetch(`/api/admin/packs/${packId}`, { method: "DELETE" })
        if (response.ok) {
          fetchPacks()
        }
      } catch (error) {
        console.error("Error deleting pack:", error)
      }
    }
  }

  const handleToggleStatus = async (pack: Pack) => {
    const newStatus = pack.status === "active" ? "inactive" : "active"
    try {
      const response = await fetch(`/api/admin/packs/${pack.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      if (response.ok) {
        fetchPacks()
      }
    } catch (error) {
      console.error("Error toggling status:", error)
    }
  }

  const openEditDialog = (pack: Pack) => {
    setEditingPack(pack)
    setFormData({
      name: pack.name,
      description: pack.description,
      game_id: pack.game_id.toString(),
      image_url: pack.image_url || "",
      original_price: pack.original_price.toString(),
      pack_price: pack.pack_price.toString(),
    })
    setSelectedProducts([])
    setIsOpen(true)
  }

  const resetForm = () => {
    setIsOpen(false)
    setEditingPack(null)
    setSelectedProducts([])
    setFormData({
      name: "",
      description: "",
      game_id: "",
      image_url: "",
      original_price: "",
      pack_price: "",
    })
  }

  const filteredPacks = packs.filter((pack) => pack.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const gameProducts = products.filter((p) => p.game_id === Number.parseInt(formData.game_id || "0"))

  const originalTotal = gameProducts
    .filter((p) => selectedProducts.includes(p.id))
    .reduce((sum, p) => sum + p.base_price, 0)

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Special Packs</CardTitle>
            <CardDescription>Build and manage special product packs with discounts</CardDescription>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="gap-2">
                <Plus className="w-4 h-4" />
                Create Pack
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingPack ? "Edit Pack" : "Create New Pack"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Pack Name</Label>
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

                <div>
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input
                    id="imageUrl"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="originalPrice">Original Price</Label>
                    <Input
                      id="originalPrice"
                      type="number"
                      step="0.01"
                      value={formData.original_price}
                      onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="packPrice">Pack Price</Label>
                    <Input
                      id="packPrice"
                      type="number"
                      step="0.01"
                      value={formData.pack_price}
                      onChange={(e) => setFormData({ ...formData, pack_price: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {formData.original_price && formData.pack_price && (
                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-sm">
                      <span className="font-semibold">Discount:</span>{" "}
                      {(
                        ((Number.parseFloat(formData.original_price) - Number.parseFloat(formData.pack_price)) /
                          Number.parseFloat(formData.original_price)) *
                        100
                      ).toFixed(1)}
                      %
                    </p>
                  </div>
                )}

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
                          <span className="text-sm flex-1">{product.name}</span>
                          <span className="text-xs text-muted-foreground">${product.base_price.toFixed(2)}</span>
                        </label>
                      ))
                    )}
                  </div>
                  {selectedProducts.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-2">Original total: ${originalTotal.toFixed(2)}</p>
                  )}
                </div>

                <Button type="submit" className="w-full">
                  {editingPack ? "Update Pack" : "Create Pack"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Search packs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : filteredPacks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No packs found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Name</th>
                  <th className="text-left py-3 px-4 font-semibold">Game</th>
                  <th className="text-right py-3 px-4 font-semibold">Original</th>
                  <th className="text-right py-3 px-4 font-semibold">Pack Price</th>
                  <th className="text-center py-3 px-4 font-semibold">Discount</th>
                  <th className="text-center py-3 px-4 font-semibold">Products</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-right py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPacks.map((pack) => (
                  <tr key={pack.id} className="border-b border-border/50 hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">{pack.name}</td>
                    <td className="py-3 px-4 text-muted-foreground">{pack.game_name}</td>
                    <td className="py-3 px-4 text-right">
                      ${Number.parseFloat(pack.original_price.toString()).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      ${Number.parseFloat(pack.pack_price.toString()).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-green-400">
                        <Zap className="w-3 h-3" />
                        {pack.discount_percentage.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">{pack.product_count}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          pack.status === "active" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {pack.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleToggleStatus(pack)} className="gap-1">
                          {pack.status === "active" ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => openEditDialog(pack)} className="gap-1">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(pack.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
