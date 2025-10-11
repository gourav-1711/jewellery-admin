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
import { Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import NewMultiSelect from "../../../components/NewMultiSelect";
import Cookies from "js-cookie";

const INITIAL_FORM_STATE = {
  name: "",
  description: "",
  short_description: "",
  dimensions: "",
  code: "",
  price: "",
  discount_price: "",
  stock: "",
  estimated_delivery_time: "",
  status: true,
  isFeatured: false,
  isNewArrival: false,
  isBestSeller: false,
  isTopRated: false,
  isUpsell: false,
  isOnSale: false,
  order: 0,
  mainImage: null,
  additionalImages: [null, null, null, null, null],
  mainImagePreview: "",
  additionalImagePreviews: ["", "", "", "", ""],
};

export default function ProductsPage() {
  const [colors, setColors] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [subSubCategories, setSubSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState([]);
  const [selectedSubSubCategory, setSelectedSubSubCategory] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  const { toast } = useToast();
  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${Cookies.get("adminToken")}`,
  });

  const loadColors = async () => {
    try {
      const response = await fetch(`${API_BASE}api/admin/color/view`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({}),
      });
      if (response.ok) {
        const data = await response.json();
        setColors(data._data || []);
      }
    } catch (error) {
      console.error("Error loading colors:", error);
    }
  };

  const loadMaterials = async () => {
    try {
      const response = await fetch(`${API_BASE}api/admin/material/view`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({}),
      });
      if (response.ok) {
        const data = await response.json();
        setMaterials(data._data || []);
      }
    } catch (error) {
      console.error("Error loading materials:", error);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetch(`${API_BASE}api/admin/category/view`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({}),
      });
      if (response.ok) {
        const data = await response.json();
        setCategories(data._data || []);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const loadSubCategories = async () => {
    try {
      const response = await fetch(`${API_BASE}api/admin/subCategory/view`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({}),
      });
      if (response.ok) {
        const data = await response.json();
        setSubCategories(data._data || []);
      }
    } catch (error) {
      console.error("Error loading subcategories:", error);
    }
  };

  const loadSubSubCategories = async () => {
    try {
      const response = await fetch(`${API_BASE}api/admin/subSubCategory/view`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({}),
      });
      if (response.ok) {
        const data = await response.json();
        setSubSubCategories(Array.isArray(data?._data) ? data._data : []);
      }
    } catch (error) {
      console.error("Error loading sub-subcategories:", error);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}api/admin/product/view`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({}),
      });
      const data = await response.json();
      setProducts(data._data || []);
    } catch (error) {
      console.error("Error loading products:", error);
      toast({ title: "Error loading products", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadColors();
    loadMaterials();
    loadCategories();
    loadSubCategories();
    loadSubSubCategories();
    loadProducts();
  }, []);

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      ...INITIAL_FORM_STATE,
      name: product.name,
      price: product.price,
      stock: product.stock,
      dimensions: product.dimensions,
      code: product.code,
      discount_price: product.discount_price,
      description: product.description,
      short_description: product.short_description,
      estimated_delivery_time: product.estimated_delivery_time,
      status: product.status,
      isFeatured: product.isFeatured,
      isNewArrival: product.isNewArrival,
      isBestSeller: product.isBestSeller,
      isTopRated: product.isTopRated,
      isUpsell: product.isUpsell,
      isOnSale: product.isOnSale,
      order: product.order,
      mainImagePreview: product.image || "",
      additionalImagePreviews: product.images || ["", "", "", "", ""],
    });
    setSelectedCategory(Array.isArray(product.category) ? product.category : []);
    setSelectedSubCategory(Array.isArray(product.subCategory) ? product.subCategory : []);
    setSelectedSubSubCategory(Array.isArray(product.subSubCategory) ? product.subSubCategory : []);
    setSelectedColors(product.colors || []);
    setSelectedMaterials(product.materials || []);
    setDrawerOpen(true);
  };

  const handleDelete = async (id) => {
    setDeleteId(id);
    setAlertOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(
        `${API_BASE}api/admin/product/delete/${deleteId}`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify({ id: deleteId }),
        }
      );
      if (!response.ok) throw new Error("Failed to delete");
      toast({ title: "Product deleted successfully" });
      loadProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({ title: "Error deleting product", variant: "destructive" });
    } finally {
      setAlertOpen(false);
      setDeleteId(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    // Add text fields
    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("short_description", formData.short_description);
    formDataToSend.append("dimensions", formData.dimensions);
    formDataToSend.append("code", formData.code);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("discount_price", formData.discount_price);
    formDataToSend.append("stock", formData.stock);
    formDataToSend.append("estimated_delivery_time", formData.estimated_delivery_time);
    formDataToSend.append("order", formData.order);
    formDataToSend.append("status", formData.status);
    formDataToSend.append("isFeatured", formData.isFeatured);
    formDataToSend.append("isNewArrival", formData.isNewArrival);
    formDataToSend.append("isBestSeller", formData.isBestSeller);
    formDataToSend.append("isTopRated", formData.isTopRated);
    formDataToSend.append("isUpsell", formData.isUpsell);
    formDataToSend.append("isOnSale", formData.isOnSale);

    // Add categories
    if (selectedCategory.length > 0) {
      selectedCategory.forEach((cat) => formDataToSend.append("category[]", cat));
    }
    if (selectedSubCategory.length > 0) {
      selectedSubCategory.forEach((subCat) =>
        formDataToSend.append("subCategory[]", subCat)
      );
    }
    if (selectedSubSubCategory.length > 0) {
      selectedSubSubCategory.forEach((subSubCat) =>
        formDataToSend.append("subSubCategory[]", subSubCat)
      );
    }
    if (selectedColors.length > 0) {
      selectedColors.forEach((color) =>
        formDataToSend.append("colors[]", color)
      );
    }
    if (selectedMaterials.length > 0) {
      selectedMaterials.forEach((material) =>
        formDataToSend.append("materials[]", material)
      );
    }

    // Add main image file
    if (formData.mainImage) {
      formDataToSend.append("image", formData.mainImage);
    }

    // Add additional image files
    formData.additionalImages.forEach((file, index) => {
      if (file) {
        formDataToSend.append(`images`, file);
      }
    });

    try {
      const url = editingProduct
        ? `${API_BASE}api/admin/product/update/${editingProduct._id}`
        : `${API_BASE}api/admin/product/create`;

      const response = await fetch(url, {
        method: editingProduct ? "PUT" : "POST",
        headers: getAuthHeaders(),
        body: formDataToSend,
      });

      if (!response.ok) throw new Error("Failed to save product");

      toast({
        title: `Product ${editingProduct ? "updated" : "created"} successfully`,
      });
      closeDrawer();
      loadProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        title: "Error saving product",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditingProduct(null);
    setFormData(INITIAL_FORM_STATE);
    setSelectedCategory([]);
    setSelectedSubCategory([]);
    setSelectedSubSubCategory([]);
    setSelectedColors([]);
    setSelectedMaterials([]);
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormData({
      ...formData,
      mainImage: file,
      mainImagePreview: URL.createObjectURL(file),
    });
  };

  const handleAdditionalImageChange = (e, index) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newImages = [...formData.additionalImages];
    const newPreviews = [...formData.additionalImagePreviews];

    newImages[index] = file;
    newPreviews[index] = URL.createObjectURL(file);

    setFormData({
      ...formData,
      additionalImages: newImages,
      additionalImagePreviews: newPreviews,
    });
  };

  const removeMainImage = () => {
    if (
      formData.mainImagePreview &&
      formData.mainImagePreview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(formData.mainImagePreview);
    }
    setFormData({
      ...formData,
      mainImage: null,
      mainImagePreview: "",
    });
  };

  const removeAdditionalImage = (index) => {
    const newImages = [...formData.additionalImages];
    const newPreviews = [...formData.additionalImagePreviews];

    if (newPreviews[index].startsWith("blob:")) {
      URL.revokeObjectURL(newPreviews[index]);
    }

    newImages[index] = null;
    newPreviews[index] = "";

    setFormData({
      ...formData,
      additionalImages: newImages,
      additionalImagePreviews: newPreviews,
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
      key: "price",
      label: "Price",
      render: (item) => (
        <span className="font-semibold">${item.price}</span>
      ),
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
      render: (item) => (
        <Badge variant="secondary">
          {Array.isArray(item.category)
            ? item.category.join(", ")
            : item.category}
        </Badge>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (item) => (
        <Badge variant={item.status ? "default" : "secondary"}>
          {item.status ? "Active" : "Inactive"}
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
              closeDrawer();
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
        isOpen={drawerOpen}
        onClose={closeDrawer}
        title={editingProduct ? "Edit Product" : "Add New Product"}
        className="w-[60vw] max-w-[1800px]"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter product name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Product Code *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                  placeholder="Enter product code"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <Input
                  type="number"
                  id="price"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  placeholder="Enter price"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discount_price">Discount Price *</Label>
                <Input
                  type="number"
                  id="discount_price"
                  value={formData.discount_price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      discount_price: e.target.value,
                    })
                  }
                  placeholder="Enter discount price"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>
          </div>

          {/* Descriptions */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Descriptions</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="short_description">
                  Short Description *
                </Label>
                <textarea
                  id="short_description"
                  value={formData.short_description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      short_description: e.target.value,
                    })
                  }
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Enter a short description"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Full Description *</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Enter full description"
                  required
                />
              </div>
            </div>
          </div>

          {/* Categories & Tags */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Categories & Tags</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category *</Label>
                <NewMultiSelect
                  category={categories}
                  categoryId={selectedCategory}
                  setCategoryId={setSelectedCategory}
                  placeholder="Select categories..."
                />
              </div>
              <div className="space-y-2">
                <Label>Subcategory</Label>
                <NewMultiSelect
                  category={subCategories}
                  categoryId={selectedSubCategory}
                  setCategoryId={setSelectedSubCategory}
                  placeholder="Select subcategories..."
                  disabled={selectedCategory.length === 0}
                />
              </div>
              <div className="space-y-2">
                <Label>Sub-subcategory</Label>
                <NewMultiSelect
                  category={subSubCategories}
                  categoryId={selectedSubSubCategory}
                  setCategoryId={setSelectedSubSubCategory}
                  placeholder="Select sub-subcategories..."
                  disabled={selectedSubCategory.length === 0}
                />
              </div>
              <div className="space-y-2">
                <Label>Colors</Label>
                <NewMultiSelect
                  category={colors}
                  categoryId={selectedColors}
                  setCategoryId={setSelectedColors}
                  placeholder="Select colors..."
                />
              </div>
              <div className="space-y-2">
                <Label>Materials</Label>
                <NewMultiSelect
                  category={materials}
                  categoryId={selectedMaterials}
                  setCategoryId={setSelectedMaterials}
                  placeholder="Select materials..."
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dimensions">Dimensions *</Label>
                <Input
                  id="dimensions"
                  value={formData.dimensions}
                  onChange={(e) =>
                    setFormData({ ...formData, dimensions: e.target.value })
                  }
                  placeholder="e.g., 10x10x5 cm"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock *</Label>
                <Input
                  type="number"
                  id="stock"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: e.target.value })
                  }
                  placeholder="Enter available stock"
                  min="0"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimated_delivery_time">
                  Estimated Delivery Time *
                </Label>
                <Input
                  id="estimated_delivery_time"
                  value={formData.estimated_delivery_time}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      estimated_delivery_time: e.target.value,
                    })
                  }
                  placeholder="e.g., 3-5 business days"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="order">Display Order</Label>
                <Input
                  type="number"
                  id="order"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({ ...formData, order: e.target.value })
                  }
                  placeholder="Enter display order"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Product Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Product Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { id: "isFeatured", label: "Featured" },
                { id: "isNewArrival", label: "New Arrival" },
                { id: "isBestSeller", label: "Best Seller" },
                { id: "isTopRated", label: "Top Rated" },
                { id: "isUpsell", label: "Upsell" },
                { id: "isOnSale", label: "On Sale" },
              ].map((toggle) => (
                <div key={toggle.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={toggle.id}
                    checked={formData[toggle.id]}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [toggle.id]: e.target.checked,
                      })
                    }
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                  />
                  <Label htmlFor={toggle.id} className="cursor-pointer">
                    {toggle.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Product Images</h3>

            {/* Main Image */}
            <div className="space-y-2">
              <Label>Main Image *</Label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-4 text-gray-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">
                      Click to upload
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, JPEG</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleMainImageChange}
                  />
                </label>
              </div>
              {formData.mainImagePreview && (
                <div className="relative w-20 h-20">
                  <img
                    src={formData.mainImagePreview}
                    alt="Main"
                    className="w-full h-full object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={removeMainImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Additional Images */}
            <div className="space-y-2">
              <Label>Additional Images</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {formData.additionalImages.map((_, index) => (
                  <div key={index} className="flex flex-col items-center gap-2">
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                      <div className="flex flex-col items-center justify-center">
                        <svg
                          className="w-6 h-6 text-gray-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 16"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                          />
                        </svg>
                        <p className="text-xs text-gray-500 mt-1">
                          Image {index + 1}
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleAdditionalImageChange(e, index)}
                      />
                    </label>
                    {formData.additionalImagePreviews[index] && (
                      <div className="relative w-16 h-16">
                        <img
                          src={formData.additionalImagePreviews[index]}
                          alt={`Additional ${index + 1}`}
                          className="w-full h-full object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => removeAdditionalImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <Button type="button" variant="outline" onClick={closeDrawer}>
              Cancel
            </Button>
            <Button type="submit">
              {editingProduct ? "Update Product" : "Create Product"}
            </Button>
          </div>
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