"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Drawer } from "@/components/drawer";
import { ExportButtons } from "@/components/export-buttons";
import { AlertDialogUse } from "@/components/alert-dialog";
import { Plus, Pencil, Trash2, ImageIcon, Eye, EyeOff, Loader2 } from "lucide-react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

import Cookies from "js-cookie";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

const getAuthHeaders = () => ({
  Authorization: `Bearer ${Cookies.get("adminToken")}`,
});

const getAuthHeadersFormData = () => ({
  Authorization: `Bearer ${Cookies.get("adminToken")}`,
});

export default function WhyChooseUsPage() {
  const [btnLoading, setBtnLoading] = useState(false);
  const [whyChooseUsArray, setWhyChooseUsArray] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingWhyChooseUs, setEditingWhyChooseUs] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [whyChooseUsToDelete, setWhyChooseUsToDelete] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
  });
  const { toast } = useToast();

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setFormData({ ...formData, image: file });
    }
  };

  useEffect(() => {
    loadWhyChooseUs();
  }, []);

  const loadWhyChooseUs = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE}api/admin/whyChooseUs/view`,
        {},
        { headers: getAuthHeaders() }
      );
      console.log(response);

      setWhyChooseUsArray(response.data._data || []);
    } catch (error) {
      toast({
        title: "Error loading Why Choose Us",
        description:
          error.response?.data?._message || "Failed to load Why Choose Us",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (whyChooseUs) => {
    setEditingWhyChooseUs(whyChooseUs);
    setFormData({
      title: whyChooseUs.title,
      description: whyChooseUs.description,
      image: whyChooseUs.image,
    });
    setDrawerOpen(true);
  };

  const handleDelete = async (id) => {
    setWhyChooseUsToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!whyChooseUsToDelete) return;

    try {
      await axios.put(
        `${API_BASE}api/admin/whyChooseUs/delete/${whyChooseUsToDelete}`,
        { id: whyChooseUsToDelete },
        { headers: getAuthHeaders() }
      );
      loadWhyChooseUs();
      toast({ title: "Why Choose Us deleted successfully" });
    } catch (error) {
      toast({
        title: "Error deleting Why Choose Us",
        description:
          error.response?.data?._message || "Failed to delete Why Choose Us",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setWhyChooseUsToDelete(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("description", formData.description);
    submitData.append("image", formData.image);

    if (editingWhyChooseUs) {
      setBtnLoading(true);
      try {
        await axios.put(
          `${API_BASE}api/admin/whyChooseUs/update/${editingWhyChooseUs._id}`,
          submitData,
          { headers: getAuthHeaders() }
        );
        loadWhyChooseUs();
        toast({ title: "Why Choose Us updated successfully" });
      } catch (error) {
        toast({
          title: "Error updating Why Choose Us",
          description:
            error.response?.data?._message || "Failed to update Why Choose Us",
          variant: "destructive",
        });
      } finally {
        setBtnLoading(false);
      }
    } else {
      setBtnLoading(true);
      try {
        await axios.post(
          `${API_BASE}api/admin/whyChooseUs/create`,
          submitData,
          {
            headers: getAuthHeaders(),
          }
        );
        toast({ title: "Why Choose Us created successfully" });
        loadWhyChooseUs();
      } catch (error) {
        toast({
          title: "Error creating Why Choose Us",
          description:
            error.response?.data?._message || "Failed to create Why Choose Us",
          variant: "destructive",
        });
      } finally {
        setBtnLoading(false);
      }
    }

    setDrawerOpen(false);
    setEditingWhyChooseUs(null);
    setFormData({
      title: "",
      description: "",
      image: "",
    });
  };

  const changeStatus = async (whyChooseUs) => {
    try {
      await axios.put(
        `${API_BASE}api/admin/whyChooseUs/change-status/${whyChooseUs._id}`,
        { id: whyChooseUs._id },
        { headers: getAuthHeaders() }
      );
      loadWhyChooseUs();
      toast({
        title: `why Choose Us ${
          whyChooseUs.status ? "deactivated" : "activated"
        } successfully`,
      });
    } catch (error) {
      toast({
        title: "Error updating Why Choose Us status",
        description:
          error.response?.data?._message || "Failed to update status",
        variant: "destructive",
      });
    }
  };

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
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-in fade-in slide-in-from-top duration-300">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Why Choose Us</h1>
          <p className="text-muted-foreground">Manage Why Choose Us</p>
        </div>
        <div className="flex items-center gap-2">
          <ExportButtons data={whyChooseUsArray} filename="whyChooseUs" />
          <Button
            onClick={() => {
              setEditingWhyChooseUs(null);
              setFormData({
                title: "",
                description: "",
                image: "",
              });
              setDrawerOpen(true);
            }}
            className="transition-all duration-200 hover:scale-105"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Why Choose Us
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {whyChooseUsArray.map((whyChooseUs, index) => (
          <Card
            key={whyChooseUs._id}
            className="p-6 group hover:shadow-xl transition-all duration-300 hover:scale-[1.05] animate-in fade-in zoom-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex flex-col items-center gap-3">
                  <Avatar className="size-24 ring-2 ring-primary/20 transition-all duration-300 group-hover:ring-primary/50">
                    <AvatarImage
                      src={whyChooseUs.image || "/placeholder.svg"}
                      alt={whyChooseUs.title}
                    />
                    <AvatarFallback>
                      {whyChooseUs.title.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{whyChooseUs.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {whyChooseUs.description}
                    </p>
                  </div>
                </div>
                <Badge variant={whyChooseUs.status ? "default" : "secondary"}>
                  {whyChooseUs.status ? "Active" : "Inactive"}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-3">
                {whyChooseUs.description}
              </p>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(whyChooseUs)}
                  className="flex-1 transition-all duration-200 hover:scale-105"
                >
                  <Pencil className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(whyChooseUs._id)}
                  className="flex-1 transition-all duration-200 hover:scale-105"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </div>
              <div className="">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => changeStatus(whyChooseUs)}
                  className="flex-1 transition-all duration-200 hover:scale-105"
                >
                  {whyChooseUs.status ? (
                    <Eye className="h-3 w-3 mr-1" />
                  ) : (
                    <EyeOff className="h-3 w-3 mr-1" />
                  )}
                  Mark as {whyChooseUs.status ? "Inactive" : "Active"}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editingWhyChooseUs ? "Edit Why Choose Us" : "Add Why Choose Us"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2 animate-in slide-in-from-right duration-300">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2 animate-in slide-in-from-right duration-300 delay-100">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              rows={4}
            />
          </div>

          <div className="space-y-2 animate-in slide-in-from-right duration-300 delay-150">
            <Label>Image *</Label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-full w-full object-contain p-2"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <ImageIcon className="w-8 h-8 mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground text-center px-4">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      SVG, PNG, or JPG (MAX. 2MB)
                    </p>
                  </div>
                )}
                <input
                  id="logo-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>

          <Button
            disabled={btnLoading}
            type="submit"
            className="w-full animate-in slide-in-from-bottom duration-300 delay-200"
          >
            {btnLoading
              ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...</>)
              : editingWhyChooseUs
              ? "Update Why Choose Us"
              : "Create Why Choose Us"}
          </Button>
        </form>
      </Drawer>

      <AlertDialogUse
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Why Choose Us"
        description="Are you sure you want to delete this Why Choose Us? This action cannot be undone."
      />
    </div>
  );
}
