"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/data-table";
import { Drawer } from "@/components/drawer";
import { ExportButtons } from "@/components/export-buttons";
import { AlertDialog } from "@/components/alert-dialog";

import { Plus } from "lucide-react";
import { fetchData, createItem, updateItem, deleteItem } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import NewMultiSelect from "../../../components/NewMultiSelect";
import Cookies from "js-cookie";
export default function ProductsPage() {
  const [subCategories, setSubCategories] = useState([]);
  const [subSubCategories, setSubSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState([]);
  const [selectedSubSubCategory, setSelectedSubSubCategory] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  //////////////////////////
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    subCategory: "",
    subSubCategory: "",
    sku: "",
    status: "active",
    colors: [],
    materials: [],
  });
  const { toast } = useToast();
  /////////////////////////////////////

  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${Cookies.get("adminToken")}`,
  });

  const loadSubCategories = async (categoryIds) => {
    try {
      if (!categoryIds || categoryIds.length === 0) {
        setSubCategories([]);
        setSubSubCategories([]);
        return;
      }

      const response = await fetch(`${API_BASE}api/admin/subCategory/view`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ categoryId: categoryIds }),
      });

      if (response.ok) {
        const data = await response.json();
        setSubCategories(data._data || []);
      }
    } catch (error) {
      console.error("Error loading subcategories:", error);
    }
  };

  const loadSubSubCategories = async (subCategoryIds) => {
    try {
      if (!subCategoryIds || subCategoryIds.length === 0) {
        setSubSubCategories([]);
        return;
      }

      const response = await fetch(`${API_BASE}api/admin/subSubCategory/view`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ subCategoryId: subCategoryIds }),
      });

      if (response.ok) {
        const data = await response.json();
        setSubSubCategories(Array.isArray(data?._data) ? data._data : []);
      }
    } catch (error) {
      console.error("Error loading sub-subcategories:", error);
    }
  };

  // Add these useEffect hooks
  useEffect(() => {
    loadSubCategories(selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    loadSubSubCategories(selectedSubCategory);
  }, [selectedSubCategory]);

  //////////////////////////////////////////

  useEffect(() => {
    loadProducts();
    loadOptions();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const data = await fetchData("products");
    setProducts(data);
    setLoading(false);
  };

  const loadOptions = async () => {
    const [categoriesData, colorsData, materialsData] = await Promise.all([
      fetchData("categories"),
      fetchData("colors"),
      fetchData("materials"),
    ]);

    setCategories(
      categoriesData.map((c) => ({ value: c.id.toString(), label: c.name }))
    );
    setColors(
      colorsData.map((c) => ({ value: c.id.toString(), label: c.name }))
    );
    setMaterials(
      materialsData.map((m) => ({ value: m.id.toString(), label: m.name }))
    );
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      stock: product.stock,
      category: product.category,
      subCategory: product.subCategory || "",
      subSubCategory: product.subSubCategory || "",
      sku: product.sku,
      status: product.status,
      colors: product.colors || [],
      materials: product.materials || [],
    });
    setDrawerOpen(true);
  };

  const handleDelete = async (id) => {
    setDeleteId(id);
    setAlertOpen(true);
  };

  const confirmDelete = async () => {
    await deleteItem("products", deleteId);
    setProducts(products.filter((p) => p.id !== deleteId));
    toast({ title: "Product deleted successfully" });
    setDeleteId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingProduct) {
      const updated = await updateItem("products", editingProduct.id, formData);
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id ? { ...p, ...formData } : p
        )
      );
      toast({ title: "Product updated successfully" });
    } else {
      const created = await createItem("products", formData);
      setProducts([...products, { ...formData, id: created.id }]);
      toast({ title: "Product created successfully" });
    }

    setDrawerOpen(false);
    setEditingProduct(null);
    setFormData({
      name: "",
      price: "",
      stock: "",
      category: "",
      subCategory: "",
      subSubCategory: "",
      sku: "",
      status: "active",
      colors: [],
      materials: [],
    });
  };

  const columns = [
    {
      key: "name",
      label: "Name",
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
            <img
              src={item.image || "/placeholder.svg"}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-medium">{item.name}</span>
        </div>
      ),
    },
    {
      key: "sku",
      label: "SKU",
      render: (item) => <span className="font-mono text-sm">{item.sku}</span>,
    },
    {
      key: "price",
      label: "Price",
      render: (item) => <span className="font-semibold">${item.price}</span>,
    },
    {
      key: "stock",
      label: "Stock",
      render: (item) => (
        <Badge
          variant={item.stock > 0 ? "default" : "destructive"}
          className="font-mono"
        >
          {item.stock}
        </Badge>
      ),
    },
    {
      key: "category",
      label: "Category",
      render: (item) => <Badge variant="secondary">{item.category}</Badge>,
    },
    {
      key: "status",
      label: "Status",
      render: (item) => (
        <Badge
          variant={item.status === "active" ? "default" : "secondary"}
          className="capitalize"
        >
          {item.status.replace("_", " ")}
        </Badge>
      ),
    },
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
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>
        <div className="flex items-center gap-2">
          <ExportButtons data={products} filename="products" />
          <Button
            onClick={() => {
              setEditingProduct(null);
              setFormData({
                name: "",
                price: "",
                stock: "",
                category: "",
                subCategory: "",
                subSubCategory: "",
                sku: "",
                status: "active",
                colors: [],
                materials: [],
              });
              setDrawerOpen(true);
            }}
            className="transition-all duration-200 hover:scale-105"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      <DataTable
        data={products}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search products..."
      />

      <Drawer
        open={drawerOpen}
        onOpenChange={(open) => {
          if (!open) resetForm();
          setDrawerOpen(open);
        }}
        title={editingProduct ? "Edit Product" : "Add New Product"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Existing form fields */}

          <div>
            <Label>Category</Label>
            <NewMultiSelect
              category={categories}
              categoryId={selectedCategory}
              setCategoryId={setSelectedCategory}
              placeholder="Select categories..."
            />
          </div>

          <div>
            <Label>Subcategory</Label>
            <NewMultiSelect
              category={subCategories}
              categoryId={selectedSubCategory}
              setCategoryId={setSelectedSubCategory}
              placeholder="Select subcategories..."
              disabled={selectedCategory.length === 0}
            />
          </div>

          <div>
            <Label>Sub-subcategory</Label>
            <NewMultiSelect
              category={subSubCategories}
              categoryId={selectedSubSubCategory}
              setCategoryId={setSelectedSubSubCategory}
              placeholder="Select sub-subcategories..."
              disabled={selectedSubCategory.length === 0}
            />
          </div>

          <div>
            <Label>Colors</Label>
            <NewMultiSelect
              category={colors}
              categoryId={selectedColors}
              setCategoryId={setSelectedColors}
              placeholder="Select colors..."
            />
          </div>

          <div>
            <Label>Materials</Label>
            <NewMultiSelect
              category={materials}
              categoryId={selectedMaterials}
              setCategoryId={setSelectedMaterials}
              placeholder="Select materials..."
            />
          </div>

          {/* Rest of the form */}
        </form>
      </Drawer>

      <AlertDialog
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
      />
    </div>
  );
}
