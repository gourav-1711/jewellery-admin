"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DataTable } from "@/components/data-table"
import { Drawer } from "@/components/drawer"
import { ExportButtons } from "@/components/export-buttons"
import { AlertDialogUse } from "@/components/alert-dialog"
import { Plus } from "lucide-react"
import { fetchData, createItem, updateItem, deleteItem } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user",
    status: "active",
  })
  const { toast } = useToast()

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    setLoading(true)
    const data = await fetchData("users")
    setUsers(data)
    setLoading(false)
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    })
    setDrawerOpen(true)
  }

  const handleDelete = async (id) => {
    setUserToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!userToDelete) return

    await deleteItem("users", userToDelete)
    setUsers(users.filter((u) => u.id !== userToDelete))
    toast({ title: "User deleted successfully" })
    setDeleteDialogOpen(false)
    setUserToDelete(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (editingUser) {
      await updateItem("users", editingUser.id, formData)
      setUsers(users.map((u) => (u.id === editingUser.id ? { ...u, ...formData } : u)))
      toast({ title: "User updated successfully" })
    } else {
      const created = await createItem("users", formData)
      setUsers([...users, { ...formData, id: created.id, avatar: "/abstract-geometric-shapes.png" }])
      toast({ title: "User created successfully" })
    }

    setDrawerOpen(false)
    setEditingUser(null)
    setFormData({ name: "", email: "", role: "user", status: "active" })
  }

  const columns = [
    {
      key: "name",
      label: "User",
      render: (item) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-border">
            <AvatarImage src={item.avatar || "/placeholder.svg"} alt={item.name} />
            <AvatarFallback>{item.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{item.name}</p>
            <p className="text-sm text-muted-foreground">{item.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      label: "Role",
      render: (item) => (
        <Badge variant={item.role === "admin" ? "default" : "secondary"} className="capitalize">
          {item.role}
        </Badge>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (item) => (
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${item.status === "active" ? "bg-accent animate-pulse" : "bg-muted-foreground"}`}
          ></span>
          <span className="capitalize">{item.status}</span>
        </div>
      ),
    },
    {
      key: "createdAt",
      label: "Joined",
      render: (item) => <span className="text-sm text-muted-foreground">{item.createdAt}</span>,
    },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-muted rounded"></div>
          <div className="h-96 bg-muted rounded-lg"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-in fade-in slide-in-from-top duration-300">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">Manage user accounts and permissions</p>
        </div>
        <div className="flex items-center gap-2">
          <ExportButtons data={users} filename="users" />
          <Button
            onClick={() => {
              setEditingUser(null)
              setFormData({ name: "", email: "", role: "user", status: "active" })
              setDrawerOpen(true)
            }}
            className="transition-all duration-200 hover:scale-105"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      <DataTable
        data={users}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search users..."
      />

      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title={editingUser ? "Edit User" : "Add User"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2 animate-in slide-in-from-right duration-300">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2 animate-in slide-in-from-right duration-300 delay-75">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2 animate-in slide-in-from-right duration-300 delay-100">
            <Label htmlFor="role">Role</Label>
            <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 animate-in slide-in-from-right duration-300 delay-125">
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

          <Button type="submit" className="w-full animate-in slide-in-from-bottom duration-300 delay-150">
            {editingUser ? "Update User" : "Create User"}
          </Button>
        </form>
      </Drawer>

      <AlertDialogUse
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone."
      />
    </div>
  )
}
