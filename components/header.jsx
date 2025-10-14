"use client";

import { ArrowRight, Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "./theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { AlertDialogUse } from "./alert-dialog";
import { useState } from "react";
import Cookies from "js-cookie";
import Link from "next/link";

export function Header() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [bar, setBar] = useState(false);
  const [result, setResult] = useState([]);
  const [query, setQuery] = useState("");

  const menuItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Products", href: "/dashboard/products" },
    { label: "Users", href: "/dashboard/users" },
    { label: "Logos", href: "/dashboard/logos" },
    { label: "Orders", href: "/dashboard/orders" },
    { label: "Categories", href: "/dashboard/categories" },
    { label: "Sub Categories", href: "/dashboard/sub-category" },
    { label: "Sub Sub Categories", href: "/dashboard/sub-sub-category" },
    { label: "Banners", href: "/dashboard/banners" },
    { label: "Testimonials", href: "/dashboard/testimonials" },
    { label: "FAQs", href: "/dashboard/faqs" },
    { label: "Why Choose Us", href: "/dashboard/why-choose-us" },
    { label: "Materials & Colors", href: "/dashboard/materials" },
    { label: "Settings", href: "/dashboard/settings" },
  ];

  const getSearchResult = (e) => {
    const query = e.target.value;
    setQuery(query);
    setBar(true);

    if (query.trim() === "") {
      setResult([]);
      setBar(false);
      return;
    }

    const filtered = menuItems
      .filter((item) => item.label.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5);

    setResult(filtered);
  };

  const handleLogout = async () => {
    Cookies.remove("adminToken");
    router.push("/");
  };
  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 px-6">
        <div className="flex-1 flex items-center gap-4">
          <div className="relative w-full max-w-md animate-in fade-in slide-in-from-top duration-300">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              onChange={getSearchResult}
              placeholder="Search..."
              className="pl-10 transition-all duration-200 focus:scale-[1.02]"
            />
            {bar && result.length > 0 && (
              <ul className="absolute z-10 bg-white border rounded-md mt-1 w-full shadow-md">
                {result.map((item, i) => (
                  <li key={i} className="border-b-1">
                    <Link
                      onClick={() => setBar(false) }
                      href={item.href}
                      className=" px-4 py-2 hover:bg-gray-100 flex justify-between items-center"
                    >
                      {item.label} <ArrowRight/>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top duration-300 delay-100">
          <ThemeToggle />

          <Button
            variant="ghost"
            size="icon"
            className="relative transition-all duration-300 hover:scale-110"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full animate-pulse"></span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="transition-all duration-300 hover:scale-110"
              >
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 animate-in fade-in slide-in-from-top-2 duration-200"
            >
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setOpen(true)}
                className="text-destructive"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <AlertDialogUse
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleLogout}
        title="Logout"
        description="Are you sure you want to logout?"
      />
    </>
  );
}
