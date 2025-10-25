import { Suspense } from "react";
import CategoriesClient from "./CategoryClient";
import { cookies } from "next/headers";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

async function getCategories() {
  try {
    const token = (await cookies()).get("adminToken")?.value;
    const response = await fetch(`${API_BASE}api/admin/category/view`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({}),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    const data = await response.json();
    return data._data || data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

function LoadingSkeleton() {
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

export default async function CategoriesPage() {
  const initialCategories = await getCategories();

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <CategoriesClient initialCategories={initialCategories} />
    </Suspense>
  );
}