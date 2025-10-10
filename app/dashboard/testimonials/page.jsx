"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Drawer } from "@/components/drawer"
import { ExportButtons } from "@/components/export-buttons"
import { AlertDialog } from "@/components/alert-dialog"
import { Plus, Pencil, Trash2, Star } from "lucide-react"
import { fetchData, createItem, updateItem, deleteItem } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [testimonialToDelete, setTestimonialToDelete] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    content: "",
    rating: 5,
    avatar: "",
    status: "active",
  })
  const { toast } = useToast()

  useEffect(() => {
    loadTestimonials()
  }, [])

  const loadTestimonials = async () => {
    setLoading(true)
    const data = await fetchData("testimonials")
    setTestimonials(data)
    setLoading(false)
  }

  const handleEdit = (testimonial) => {
    setEditingTestimonial(testimonial)
    setFormData({
      name: testimonial.name,
      role: testimonial.role,
      content: testimonial.content,
      rating: testimonial.rating,
      avatar: testimonial.avatar,
      status: testimonial.status,
    })
    setDrawerOpen(true)
  }

  const handleDelete = async (id) => {
    setTestimonialToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!testimonialToDelete) return

    await deleteItem("testimonials", testimonialToDelete)
    setTestimonials(testimonials.filter((t) => t.id !== testimonialToDelete))
    toast({ title: "Testimonial deleted successfully" })
    setDeleteDialogOpen(false)
    setTestimonialToDelete(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (editingTestimonial) {
      await updateItem("testimonials", editingTestimonial.id, formData)
      setTestimonials(testimonials.map((t) => (t.id === editingTestimonial.id ? { ...t, ...formData } : t)))
      toast({ title: "Testimonial updated successfully" })
    } else {
      const created = await createItem("testimonials", formData)
      setTestimonials([...testimonials, { ...formData, id: created.id }])
      toast({ title: "Testimonial created successfully" })
    }

    setDrawerOpen(false)
    setEditingTestimonial(null)
    setFormData({ name: "", role: "", content: "", rating: 5, avatar: "", status: "active" })
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
          <h1 className="text-3xl font-bold tracking-tight">Testimonials</h1>
          <p className="text-muted-foreground">Manage customer testimonials and reviews</p>
        </div>
        <div className="flex items-center gap-2">
          <ExportButtons data={testimonials} filename="testimonials" />
          <Button
            onClick={() => {
              setEditingTestimonial(null)
              setFormData({ name: "", role: "", content: "", rating: 5, avatar: "", status: "active" })
              setDrawerOpen(true)
            }}
            className="transition-all duration-200 hover:scale-105"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Testimonial
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <Card
            key={testimonial.id}
            className="p-6 group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] animate-in fade-in slide-in-from-bottom"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 ring-2 ring-primary/20 transition-all duration-300 group-hover:ring-primary/50">
                    <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <Badge variant={testimonial.status === "active" ? "default" : "secondary"}>{testimonial.status}</Badge>
              </div>

              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-muted"
                    } transition-all duration-300`}
                  />
                ))}
              </div>

              <p className="text-sm text-muted-foreground line-clamp-3">{testimonial.content}</p>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(testimonial)}
                  className="flex-1 transition-all duration-200 hover:scale-105"
                >
                  <Pencil className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(testimonial.id)}
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
        title={editingTestimonial ? "Edit Testimonial" : "Add Testimonial"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2 animate-in slide-in-from-right duration-300">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2 animate-in slide-in-from-right duration-300 delay-75">
            <Label htmlFor="role">Role / Company</Label>
            <Input
              id="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2 animate-in slide-in-from-right duration-300 delay-100">
            <Label htmlFor="content">Testimonial Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
              rows={4}
            />
          </div>

          <div className="space-y-2 animate-in slide-in-from-right duration-300 delay-125">
            <Label htmlFor="rating">Rating</Label>
            <Select
              value={formData.rating.toString()}
              onValueChange={(value) => setFormData({ ...formData, rating: Number.parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select rating" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} Star{num > 1 ? "s" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 animate-in slide-in-from-right duration-300 delay-150">
            <Label htmlFor="avatar">Avatar URL</Label>
            <Input
              id="avatar"
              value={formData.avatar}
              onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
              placeholder="/placeholder.svg?height=100&width=100"
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
            {editingTestimonial ? "Update Testimonial" : "Create Testimonial"}
          </Button>
        </form>
      </Drawer>

      <AlertDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Testimonial"
        description="Are you sure you want to delete this testimonial? This action cannot be undone."
      />
    </div>
  )
}
