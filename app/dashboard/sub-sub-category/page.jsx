"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Drawer } from "@/components/drawer";
import { ExportButtons } from "@/components/export-buttons";
import { AlertDialog } from "@/components/alert-dialog";
import { Plus, Edit, Trash2, FolderTree } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Cookies from "js-cookie";
import NewMultiSelect from "../../../components/NewMultiSelect";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${Cookies.get("adminToken")}`,
});

const getAuthHeadersFormData = () => ({
  Authorization: `Bearer ${Cookies.get("adminToken")}`,
});

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [categoryId, setCategoryId] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    image: null,
  });
  const { toast } = useToast();

  useEffect(() => {
    loadCategories();
    loadSubCategories();
  }, []);

  const loadSubCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}api/admin/subCategory/view`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error(response._message);
      }

      const data = await response.json();
      setSubCategories(data._data);
    } catch (error) {
      console.error("Error loading sub categories:", error);
      toast({ title: "Error loading sub categories", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}api/admin/subSubCategory/view`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error(response._message);
      }

      const data = await response.json();
      setCategories(
        Array.isArray(data?._data)
          ? data._data
          : Array.isArray(data)
          ? data
          : []
      );
    } catch (error) {
      console.error("Error loading categories:", error);
      toast({ title: "Error loading categories", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      image: null,
    });
    setImagePreview(category.image || null);
    setDrawerOpen(true);
  };

  const handleDelete = async (id) => {
    setCategoryToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      const response = await fetch(
        `${API_BASE}api/admin/subSubCategory/delete/${categoryToDelete}`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify({ id: categoryToDelete }),
        }
      );

      if (!response.ok) {
        throw new Error(response._message);
      }

      toast({ title: "Category deleted successfully" });
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({ title: "Error deleting category", variant: "destructive" });
    } finally {
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      if (formData.image instanceof File) {
        submitData.append("image", formData.image);
      }
      categoryId.forEach((id) => submitData.append("subCategory[]", id));

      if (editingCategory) {
        const response = await fetch(
          `${API_BASE}api/admin/subSubCategory/update/${editingCategory._id}`,
          {
            method: "PUT",
            headers: getAuthHeadersFormData(),
            body: submitData,
          }
        );

        if (!response.ok) {
          throw new Error(response._message);
        }

        toast({ title: "Category updated successfully" });
      } else {
        const response = await fetch(
          `${API_BASE}api/admin/subSubCategory/create`,
          {
            method: "POST",
            headers: getAuthHeadersFormData(),
            body: submitData,
          }
        );

        if (!response.ok) {
          throw new Error(response._message);
        }

        const data = await response.json();

        toast({ title: "Category created successfully" });
      }

      setDrawerOpen(false);
      setEditingCategory(null);
      setFormData({ name: "", image: null });
      setImagePreview(null);
    } catch (error) {
      console.error("Error saving category:", error);
      toast({
        title: editingCategory
          ? "Error updating category"
          : "Error creating category",
        variant: "destructive",
      });
    }
  };

  const handleChangeStatus = async (category) => {
    try {
      const response = await fetch(
        `${API_BASE}api/admin/subSubCategory/change-status/${category._id}`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify({ id: category._id }),
        }
      );

      if (!response.ok) {
        throw new Error(response._message);
      }

      toast({ title: `Category status changed ` });
    } catch (error) {
      console.error("Error changing status:", error);
      toast({ title: "Error changing status", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-muted rounded"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-in fade-in slide-in-from-top duration-300">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Sub Sub Categories
          </h1>
          <p className="text-muted-foreground">
            Organize your products into sub sub categories
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ExportButtons data={categories} filename="categories" />
          <Button
            onClick={() => {
              setEditingCategory(null);
              setFormData({ name: "", image: null });
              setImagePreview(null);
              setDrawerOpen(true);
            }}
            className="transition-all duration-200 hover:scale-105"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category, index) => (
          <Card
            key={category._id}
            className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-4"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <CardContent className="p-0">
              <div className="relative h-32 bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden">
                <img
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  className="w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-card/80 backdrop-blur-sm flex items-center justify-center">
                      <FolderTree className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-card-foreground">
                        {category.name}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge
                    variant={category.status ? "default" : "secondary"}
                    className="capitalize"
                  >
                    {category.status ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(category)}
                      className="flex-1 transition-all duration-200 hover:scale-105"
                    >
                      <Edit className="h-3 w-3 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(category._id)}
                      className="flex-1 transition-all duration-200 hover:scale-105 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3 mr-2" />
                      Delete
                    </Button>
                  </div>
                  <Button
                    variant={category.status ? "default" : "secondary"}
                    size="sm"
                    onClick={() => handleChangeStatus(category)}
                    className="w-full transition-all duration-200"
                  >
                    {category.status ? "Deactivate" : "Activate"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editingCategory ? "Edit Category" : "Add Category"}
      >
        <div className="space-y-4">
          <div className="space-y-2 animate-in slide-in-from-right duration-300">
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2 animate-in slide-in-from-right duration-300 delay-75 ">
            <Label htmlFor="name">Sub Category</Label>
            <NewMultiSelect
              category={subCategories}
              categoryId={categoryId}
              setCategoryId={setCategoryId}
            />
          </div>

          <div className="space-y-2 animate-in slide-in-from-right duration-300 delay-150">
            <Label htmlFor="image">Sub Sub Category Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <div className="relative w-full h-40 rounded-lg overflow-hidden border border-muted mt-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setFormData({ ...formData, image: null });
                  }}
                  className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full animate-in slide-in-from-bottom duration-300 delay-150"
          >
            {editingCategory ? "Update Category" : "Create Category"}
          </Button>
        </div>
      </Drawer>

      <AlertDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Category"
        description="Are you sure you want to delete this category? This action cannot be undone."
      />
    </div>
  );
}
