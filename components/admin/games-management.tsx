"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, Edit2, Trash2, Eye, EyeOff, Upload, ImageIcon } from "lucide-react"

interface Game {
  id: number
  name: string
  slug: string
  description: string
  thumbnail_url: string
  category: string
  status: string
  created_at: string
}

export function GamesManagement() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [editingGame, setEditingGame] = useState<Game | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState("")
  const [imagePreview, setImagePreview] = useState<string>("")
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    thumbnail_url: "",
    category: "",
  })

  // Fetch games
  useEffect(() => {
    fetchGames()
  }, [])

  const fetchGames = async () => {
    try {
      const response = await fetch("/api/admin/games")
      const data = await response.json()
      setGames(data)
    } catch (error) {
      console.error("Error fetching games:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaveError("")
    setSaving(true)

    try {
      const method = editingGame ? "PUT" : "POST"
      const url = editingGame ? `/api/admin/games/${editingGame.id}` : "/api/admin/games"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        setSaveError(data.error || "Failed to save game. Check the slug and try again.")
        return
      }

      fetchGames()
      setIsOpen(false)
      setFormData({ name: "", slug: "", description: "", thumbnail_url: "", category: "" })
      setEditingGame(null)
      setImagePreview("")
    } catch (error) {
      console.error("Error saving game:", error)
      setSaveError("Failed to save game. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (gameId: number) => {
    if (confirm("Are you sure you want to delete this game?")) {
      try {
        const response = await fetch(`/api/admin/games/${gameId}`, { method: "DELETE" })
        if (response.ok) {
          fetchGames()
        }
      } catch (error) {
        console.error("Error deleting game:", error)
      }
    }
  }

  const handleToggleStatus = async (game: Game) => {
    const newStatus = game.status === "active" ? "inactive" : "active"
    try {
      const response = await fetch(`/api/admin/games/${game.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      if (response.ok) {
        fetchGames()
      }
    } catch (error) {
      console.error("Error toggling status:", error)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setFormData({ ...formData, thumbnail_url: base64String })
        setImagePreview(base64String)
      }
      reader.readAsDataURL(file)
    }
  }

  const openEditDialog = (game: Game) => {
    setEditingGame(game)
    setFormData({
      name: game.name,
      slug: game.slug,
      description: game.description,
      thumbnail_url: game.thumbnail_url,
      category: game.category,
    })
    setImagePreview(game.thumbnail_url)
    setIsOpen(true)
  }

  const closeDialog = () => {
    setIsOpen(false)
    setEditingGame(null)
    setFormData({ name: "", slug: "", description: "", thumbnail_url: "", category: "" })
    setImagePreview("")
  }

  const filteredGames = games.filter(
    (game) =>
      game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.slug.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Games Management</CardTitle>
            <CardDescription>Add, edit, and manage games in your catalog</CardDescription>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => closeDialog()} className="gap-2">
                <Plus className="w-4 h-4" />
                Add Game
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingGame ? "Edit Game" : "Add New Game"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="image">Game Image (Square)</Label>
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
                    <input id="image" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    <label htmlFor="image" className="cursor-pointer">
                      <Button
                        type="button"
                        variant="outline"
                        className="gap-2 bg-transparent"
                        onClick={() => document.getElementById("image")?.click()}
                      >
                        <Upload className="w-4 h-4" />
                        {imagePreview ? "Change Image" : "Upload Image"}
                      </Button>
                    </label>
                    <p className="text-xs text-muted-foreground">PNG, JPG or GIF (max 5MB)</p>
                  </div>
                </div>
                <div>
                  <Label htmlFor="name">Game Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full min-h-24 px-3 py-2 border border-input bg-background rounded-md"
                  />
                </div>
                {saveError && (
                  <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {saveError}
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={saving}>
                  {saving ? "Saving..." : editingGame ? "Update Game" : "Create Game"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Search games by name or slug..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : filteredGames.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No games found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Image</th>
                  <th className="text-left py-3 px-4 font-semibold">Name</th>
                  <th className="text-left py-3 px-4 font-semibold">Category</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Created</th>
                  <th className="text-right py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredGames.map((game) => (
                  <tr key={game.id} className="border-b border-border/50 hover:bg-muted/50">
                    <td className="py-3 px-4">
                      {game.thumbnail_url ? (
                        <img
                          src={game.thumbnail_url || "/placeholder.svg"}
                          alt={game.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">{game.name}</td>
                    <td className="py-3 px-4 text-muted-foreground">{game.category || "-"}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          game.status === "active" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {game.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {new Date(game.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleToggleStatus(game)} className="gap-1">
                          {game.status === "active" ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => openEditDialog(game)} className="gap-1">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(game.id)}
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
