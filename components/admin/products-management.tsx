"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, Edit2, Trash2, Eye, EyeOff, Zap, Upload, ImageIcon } from "lucide-react"

interface Product {
  id: number
  game_id: number
  game_name: string
  name: string
  description: string
  base_price: number
  discount_price: number | null
  stock: number
  image_url?: string
  status: string
  created_at: string
}

interface ProductsManagementProps {
  games: Array<{ id: number; name: string }>
}

export function ProductsManagement({ games }: ProductsManagementProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGameId, setSelectedGameId] = useState<string>("")
  const [isOpen, setIsOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [bulkOpen, setBulkOpen] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [bulkData, setBulkData] = useState({
    operation: "percentage",
    value: 0,
  })
  const [formData, setFormData] = useState({
    game_id: "",
    name: "",
    description: "",
    base_price: "",
    discount_price: "",
    stock: "",
    image_url: "",
  })

  useEffect(() => {
    fetchProducts()
  }, [selectedGameId])

  const fetchProducts = async () => {
    try {
      const url = selectedGameId ? `/api/admin/products?gameId=${selectedGameId}` : "/api/admin/products"
      const response = await fetch(url)
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const method = editingProduct ? "PUT" : "POST"
      const url = editingProduct ? `/api/admin/products/${editingProduct.id}` : "/api/admin/products"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          game_id: Number.parseInt(formData.game_id),
          name: formData.name,
          description: formData.description,
          base_price: Number.parseFloat(formData.base_price),
          discount_price: formData.discount_price ? Number.parseFloat(formData.discount_price) : null,
          stock: formData.stock ? Number.parseInt(formData.stock) : -1,
          image_url: formData.image_url,
        }),
      })

      if (response.ok) {
        fetchProducts()
        setIsOpen(false)
        resetForm()
      }
    } catch (error) {
      console.error("Error saving product:", error)
    }
  }

  const handleDelete = async (productId: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(`/api/admin/products/${productId}`, { method: "DELETE" })
        if (response.ok) {
          fetchProducts()
        }
      } catch (error) {
        console.error("Error deleting product:", error)
      }
    }
  }

  const handleToggleStatus = async (product: Product) => {
    const newStatus = product.status === "active" ? "inactive" : "active"
    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      if (response.ok) {
        fetchProducts()
      }
    } catch (error) {
      console.error("Error toggling status:", error)
    }
  }

  const handleBulkUpdate = async () => {
    const selectedIds = products.filter((p) => p.status === "active").map((p) => p.id)

    if (selectedIds.length === 0) {
      alert("No products selected")
      return
    }

    try {
      const response = await fetch("/api/admin/products/bulk-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productIds: selectedIds,
          operation: bulkData.operation,
          value: Number.parseFloat(bulkData.value.toString()),
        }),
      })

      if (response.ok) {
        fetchProducts()
        setBulkOpen(false)
        alert("Prices updated successfully")
      }
    } catch (error) {
      console.error("Error updating prices:", error)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setFormData({ ...formData, image_url: base64String })
        setImagePreview(base64String)
      }
      reader.readAsDataURL(file)
    }
  }

  const openEditDialog = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      game_id: product.game_id.toString(),
      name: product.name,
      description: product.description,
      base_price: product.base_price.toString(),
      discount_price: product.discount_price?.toString() || "",
      stock: product.stock === -1 ? "" : product.stock.toString(),
      image_url: product.image_url || "",
    })
    setImagePreview(product.image_url || "")
    setIsOpen(true)
  }

  const resetForm = () => {
    setIsOpen(false)
    setEditingProduct(null)
    setFormData({
      game_id: "",
      name: "",
      description: "",
      base_price: "",
      discount_price: "",
      stock: "",
      image_url: "",
    })
    setImagePreview("")
  }

  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Products & Pricing</CardTitle>
            <CardDescription>Manage products and bulk update prices</CardDescription>
          </div>
          <div className="flex gap-2">
            <Dialog open={bulkOpen} onOpenChange={setBulkOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Zap className="w-4 h-4" />
                  Bulk Update
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Bulk Update Prices</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="operation">Operation Type</Label>
                    <select
                      id="operation"
                      value={bulkData.operation}
                      onChange={(e) => setBulkData({ ...bulkData, operation: e.target.value })}
                      className="w-full px-3 py-2 border border-input bg-background rounded-md"
                    >
                      <option value="percentage">Percentage Increase</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="value">Value</Label>
                    <Input
                      id="value"
                      type="number"
                      step="0.01"
                      value={bulkData.value}
                      onChange={(e) => setBulkData({ ...bulkData, value: Number.parseFloat(e.target.value) || 0 })}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {bulkData.operation === "percentage"
                        ? "Enter percentage (e.g., 10 for +10%)"
                        : "Enter fixed amount"}
                    </p>
                  </div>
                  <Button onClick={handleBulkUpdate} className="w-full">
                    Update All Products
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="productImage">Product Image (Square)</Label>
                    <div className="border-2 border-dashed border-primary/30 rounded-lg p-4 flex flex-col items-center gap-2">
                      {imagePreview ? (
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded"
                        />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-muted-foreground" />
                      )}
                      <input
                        id="productImage"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <label htmlFor="productImage" className="cursor-pointer">
                        <Button
                          type="button"
                          variant="outline"
                          className="gap-2 bg-transparent"
                          onClick={() => document.getElementById("productImage")?.click()}
                        >
                          <Upload className="w-4 h-4" />
                          {imagePreview ? "Change Image" : "Upload Image"}
                        </Button>
                      </label>
                      <p className="text-xs text-muted-foreground">PNG, JPG or GIF (max 5MB)</p>
                    </div>
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
                  <div>
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="basePrice">Base Price</Label>
                    <Input
                      id="basePrice"
                      type="number"
                      step="0.01"
                      value={formData.base_price}
                      onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="discountPrice">Discount Price (Optional)</Label>
                    <Input
                      id="discountPrice"
                      type="number"
                      step="0.01"
                      value={formData.discount_price}
                      onChange={(e) => setFormData({ ...formData, discount_price: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="stock">Stock (-1 for unlimited)</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    />
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
                  <Button type="submit" className="w-full">
                    {editingProduct ? "Update Product" : "Create Product"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4 mb-4">
          <select
            value={selectedGameId}
            onChange={(e) => setSelectedGameId(e.target.value)}
            className="px-3 py-2 border border-input bg-background rounded-md"
          >
            <option value="">All Games</option>
            {games.map((game) => (
              <option key={game.id} value={game.id}>
                {game.name}
              </option>
            ))}
          </select>
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No products found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Image</th>
                  <th className="text-left py-3 px-4 font-semibold">Name</th>
                  <th className="text-left py-3 px-4 font-semibold">Game</th>
                  <th className="text-right py-3 px-4 font-semibold">Base Price</th>
                  <th className="text-right py-3 px-4 font-semibold">Discount</th>
                  <th className="text-center py-3 px-4 font-semibold">Stock</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-right py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-border/50 hover:bg-muted/50">
                    <td className="py-3 px-4">
                      {product.image_url ? (
                        <img
                          src={product.image_url || "/placeholder.svg"}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 font-medium">{product.name}</td>
                    <td className="py-3 px-4 text-muted-foreground">{product.game_name}</td>
                    <td className="py-3 px-4 text-right">
                      ${Number.parseFloat(product.base_price.toString()).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {product.discount_price
                        ? `$${Number.parseFloat(product.discount_price.toString()).toFixed(2)}`
                        : "-"}
                    </td>
                    <td className="py-3 px-4 text-center">{product.stock === -1 ? "Unlimited" : product.stock}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          product.status === "active" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleToggleStatus(product)} className="gap-1">
                          {product.status === "active" ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => openEditDialog(product)} className="gap-1">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
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
