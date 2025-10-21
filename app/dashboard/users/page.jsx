"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/data-table";
import { Drawer } from "@/components/drawer";
import { ExportButtons } from "@/components/export-buttons";
import { AlertDialogUse } from "@/components/alert-dialog";
import { Plus } from "lucide-react";
import { fetchData, createItem, updateItem, deleteItem } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user",
  });
  const { toast } = useToast();
  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    loadUsers();
  }, []);

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${Cookies.get("adminToken")}`,
  });

  const loadUsers = async () => {
    setLoading(true);
    const data = await fetch(`${API_BASE}api/admin/user/findAllUser`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({}),
    });
    const response = await data.json();
    console.log(response);
    setUsers(response._data || []);
    setLoading(false);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
    });
    setDrawerOpen(true);
  };

  const handleDelete = async (id) => {
    setUserToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    await deleteItem(`${API_BASE}api/admin/user/delete`, userToDelete);
    loadUsers();
    toast({ title: "User deleted successfully" });
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingUser) {
      await updateItem(
        `${API_BASE}api/admin/user/update`,
        editingUser.id,
        formData
      );
      loadUsers();
      toast({ title: "User updated successfully" });
    } else {
      // await createItem(`${API_BASE}api/admin/user/create`, formData);
      // loadUsers();
      // toast({ title: "User created successfully" });
    }

    setDrawerOpen(false);
    setEditingUser(null);
    setFormData({ name: "", email: "", role: "user" });
  };
  const router = useRouter();
  const columns = [
    {
      key: "name",
      label: "User",
      render: (item) => (
        <div onClick={()=> router.push(`/dashboard/users/${item._id}`)} className="flex items-center gap-3 cursor-pointer">
          <Avatar className="h-10 w-10 border-2 border-border">
            <AvatarImage src={item.avatar || ""} alt={item.name} />
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
        <Badge
          variant={item.role === "admin" ? "default" : "secondary"}
          className="capitalize"
        >
          {item.role}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      label: "Joined",
      render: (item) => (
        <span className="text-sm text-muted-foreground">
          {new Date(item.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key : "lastUpdated",
      label : "Last Updated",
      render : (item) => (
        <span className="text-sm text-muted-foreground">
          {new Date(item.updatedAt).toLocaleDateString()}
        </span>
      )
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-muted rounded"></div>
          <div className="h-96 bg-muted rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-in fade-in slide-in-from-top duration-300">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage user accounts and permissions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ExportButtons data={users} filename="users" />
          <Button
            onClick={() => {
              setEditingUser(null);
              setFormData({ name: "", email: "", role: "user" });
              setDrawerOpen(true);
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

      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editingUser ? "Edit User" : "Add User"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2 animate-in slide-in-from-right duration-300">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2 animate-in slide-in-from-right duration-300 delay-75">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2 animate-in slide-in-from-right duration-300 delay-100">
            <Label htmlFor="role">Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value) =>
                setFormData({ ...formData, role: value })
              }
            >
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

          <Button
            type="submit"
            className="w-full animate-in slide-in-from-bottom duration-300 delay-150"
          >
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
  );
}
