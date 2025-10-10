"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  FolderTree,
  ImageIcon,
  MessageSquare,
  HelpCircle,
  Star,
  Palette,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Package, label: "Products", href: "/dashboard/products" },
  { icon: Users, label: "Users", href: "/dashboard/users" },
  { icon: ShoppingCart, label: "Orders", href: "/dashboard/orders" },
  { icon: FolderTree, label: "Categories", href: "/dashboard/categories" },
  { icon: FolderTree, label: "Sub Categories", href: "/dashboard/sub-category" },
  { icon: FolderTree, label: "Sub Sub Categories", href: "/dashboard/sub-sub-category" },
  { icon: ImageIcon, label: "Banners", href: "/dashboard/banners" },
  { icon: MessageSquare, label: "Testimonials", href: "/dashboard/testimonials" },
  { icon: HelpCircle, label: "FAQs", href: "/dashboard/faqs" },
  { icon: Star, label: "Why Choose Us", href: "/dashboard/why-choose-us" },
  { icon: Palette, label: "Materials & Colors", href: "/dashboard/materials" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
]

export function Sidebar({ onCollapsedChange }) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    if (onCollapsedChange) {
      onCollapsedChange(collapsed)
    }
  }, [collapsed, onCollapsedChange])

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
          {!collapsed && (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left duration-300">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">A</span>
              </div>
              <span className="font-bold text-lg text-sidebar-foreground">Admin</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="transition-all duration-300 hover:scale-110"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto p-2 space-y-1">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                  "hover:bg-sidebar-accent hover:scale-[1.02] hover:translate-x-1",
                  "animate-in slide-in-from-left duration-300",
                  isActive && "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg scale-[1.02]",
                  !isActive && "text-sidebar-foreground",
                )}
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <Icon className={cn("h-5 w-5 flex-shrink-0", isActive && "animate-pulse")} />
                {!collapsed && <span className="font-medium truncate">{item.label}</span>}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
