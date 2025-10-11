"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Drawer } from "@/components/drawer"
import { ExportButtons } from "@/components/export-buttons"
import { AlertDialogUse } from "@/components/alert-dialog"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { fetchData, createItem, updateItem, deleteItem } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function BannersPage() {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [bannerToDelete, setBannerToDelete] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    image: "",
    link: "",
    status: "active",
    position: 1,
  })
  const { toast } = useToast()

  useEffect(() => {
    loadBanners()
  }, [])

  const loadBanners = async () => {
    setLoading(true)
    const data = await fetchData("banners")
    setBanners(data)
    setLoading(false)
  }

  const handleEdit = (banner) => {
    setEditingBanner(banner)
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle,
      image: banner.image,
      link: banner.link,
      status: banner.status,
      position: banner.position,
    })
    setDrawerOpen(true)
  }

  const handleDelete = async (id) => {
    setBannerToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!bannerToDelete) return

    await deleteItem("banners", bannerToDelete)
    setBanners(banners.filter((b) => b.id !== bannerToDelete))
    toast({ title: "Banner deleted successfully" })
    setDeleteDialogOpen(false)
    setBannerToDelete(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (editingBanner) {
      await updateItem("banners", editingBanner.id, formData)
      setBanners(banners.map((b) => (b.id === editingBanner.id ? { ...b, ...formData } : b)))
      toast({ title: "Banner updated successfully" })
    } else {
      const created = await createItem("banners", formData)
      setBanners([...banners, { ...formData, id: created.id }])
      toast({ title: "Banner created successfully" })
    }

    setDrawerOpen(false)
    setEditingBanner(null)
    setFormData({ title: "", subtitle: "", image: "", link: "", status: "active", position: 1 })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-muted rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-in fade-in slide-in-from-top duration-300">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Banners</h1>
          <p className="text-muted-foreground">Manage your promotional banners</p>
        </div>
        <div className="flex items-center gap-2">
          <ExportButtons data={banners} filename="banners" />
          <Button
            onClick={() => {
              setEditingBanner(null)
              setFormData({ title: "", subtitle: "", image: "", link: "", status: "active", position: 1 })
              setDrawerOpen(true)
            }}
            className="transition-all duration-200 hover:scale-105"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Banner
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.map((banner, index) => (
          <Card
            key={banner.id}
            className="overflow-hidden group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] animate-in fade-in slide-in-from-bottom"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="relative h-48 bg-muted overflow-hidden">
              <img
                src={banner.image || "/placeholder.svg?height=200&width=400&query=banner"}
                alt={banner.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Badge
                variant={banner.status === "active" ? "default" : "secondary"}
                className="absolute top-2 right-2 animate-in zoom-in duration-300"
              >
                {banner.status}
              </Badge>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-semibold text-lg">{banner.title}</h3>
                <p className="text-sm text-muted-foreground">{banner.subtitle}</p>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Position: {banner.position}</span>
                <span className="font-mono">{banner.link}</span>
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(banner)}
                  className="flex-1 transition-all duration-200 hover:scale-105"
                >
                  <Pencil className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(banner.id)}
                  className="flex-1 transition-all duration-200 hover:scale-105"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editingBanner ? "Edit Banner" : "Add Banner"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2 animate-in slide-in-from-right duration-300">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2 animate-in slide-in-from-right duration-300 delay-75">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input
              id="subtitle"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2 animate-in slide-in-from-right duration-300 delay-100">
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="/placeholder.svg?height=200&width=400"
            />
          </div>

          <div className="space-y-2 animate-in slide-in-from-right duration-300 delay-125">
            <Label htmlFor="link">Link</Label>
            <Input
              id="link"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2 animate-in slide-in-from-right duration-300 delay-150">
            <Label htmlFor="position">Position</Label>
            <Input
              id="position"
              type="number"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: Number.parseInt(e.target.value) })}
              required
              min="1"
            />
          </div>

          <div className="space-y-2 animate-in slide-in-from-right duration-300 delay-175">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full animate-in slide-in-from-bottom duration-300 delay-200">
            {editingBanner ? "Update Banner" : "Create Banner"}
          </Button>
        </form>
      </Drawer>

      <AlertDialogUse
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Banner"
        description="Are you sure you want to delete this banner? This action cannot be undone."
      />
    </div>
  )
}
