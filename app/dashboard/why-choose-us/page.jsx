"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Drawer } from "@/components/drawer"
import { ExportButtons } from "@/components/export-buttons"
import { AlertDialogUse } from "@/components/alert-dialog"
import { Plus, Pencil, Trash2, Truck, Star, Headset, Shield } from "lucide-react"
import { fetchData, createItem, updateItem, deleteItem } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

const iconMap = {
  truck: Truck,
  star: Star,
  headset: Headset,
  shield: Shield,
}

export default function WhyChooseUsPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "star",
    status: "active",
    order: 1,
  })
  const { toast } = useToast()

  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = async () => {
    setLoading(true)
    const data = await fetchData("whyChooseUs")
    setItems(data)
    setLoading(false)
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setFormData({
      title: item.title,
      description: item.description,
      icon: item.icon,
      status: item.status,
      order: item.order,
    })
    setDrawerOpen(true)
  }

  const handleDelete = async (id) => {
    setItemToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!itemToDelete) return

    await deleteItem("whyChooseUs", itemToDelete)
    setItems(items.filter((i) => i.id !== itemToDelete))
    toast({ title: "Item deleted successfully" })
    setDeleteDialogOpen(false)
    setItemToDelete(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (editingItem) {
      await updateItem("whyChooseUs", editingItem.id, formData)
      setItems(items.map((i) => (i.id === editingItem.id ? { ...i, ...formData } : i)))
      toast({ title: "Item updated successfully" })
    } else {
      const created = await createItem("whyChooseUs", formData)
      setItems([...items, { ...formData, id: created.id }])
      toast({ title: "Item created successfully" })
    }

    setDrawerOpen(false)
    setEditingItem(null)
    setFormData({ title: "", description: "", icon: "star", status: "active", order: 1 })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-muted rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 bg-muted rounded-lg"></div>
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
          <h1 className="text-3xl font-bold tracking-tight">Why Choose Us</h1>
          <p className="text-muted-foreground">Manage your unique selling points</p>
        </div>
        <div className="flex items-center gap-2">
          <ExportButtons data={items} filename="why-choose-us" />
          <Button
            onClick={() => {
              setEditingItem(null)
              setFormData({ title: "", description: "", icon: "star", status: "active", order: 1 })
              setDrawerOpen(true)
            }}
            className="transition-all duration-200 hover:scale-105"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {items
          .sort((a, b) => a.order - b.order)
          .map((item, index) => {
            const Icon = iconMap[item.icon] || Star

            return (
              <Card
                key={item.id}
                className="p-6 group hover:shadow-xl transition-all duration-300 hover:scale-[1.05] animate-in fade-in zoom-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <Badge variant={item.status === "active" ? "default" : "secondary"}>{item.status}</Badge>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(item)}
                      className="flex-1 transition-all duration-200 hover:scale-105"
                    >
                      <Pencil className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                      className="flex-1 transition-all duration-200 hover:scale-105"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
      </div>

      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title={editingItem ? "Edit Item" : "Add Item"}>
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
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={3}
            />
          </div>

          <div className="space-y-2 animate-in slide-in-from-right duration-300 delay-100">
            <Label htmlFor="icon">Icon</Label>
            <Select value={formData.icon} onValueChange={(value) => setFormData({ ...formData, icon: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select icon" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="truck">Truck (Shipping)</SelectItem>
                <SelectItem value="star">Star (Quality)</SelectItem>
                <SelectItem value="headset">Headset (Support)</SelectItem>
                <SelectItem value="shield">Shield (Security)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 animate-in slide-in-from-right duration-300 delay-125">
            <Label htmlFor="order">Order</Label>
            <Input
              id="order"
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: Number.parseInt(e.target.value) })}
              required
              min="1"
            />
          </div>

          <div className="space-y-2 animate-in slide-in-from-right duration-300 delay-150">
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

          <Button type="submit" className="w-full animate-in slide-in-from-bottom duration-300 delay-175">
            {editingItem ? "Update Item" : "Create Item"}
          </Button>
        </form>
      </Drawer>

      <AlertDialogUse
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Item"
        description="Are you sure you want to delete this item? This action cannot be undone."
      />
    </div>
  )
}
