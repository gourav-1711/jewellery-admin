"use client"

import { useEffect, useState } from "react"
import { StatCard } from "@/components/stat-card"
import { RecentActivity } from "@/components/recent-activity"
import { RevenueChart } from "@/components/revenue-chart"
import { DollarSign, ShoppingCart, Users, Package } from "lucide-react"
import { fetchData } from "@/lib/api"

export default function DashboardPage() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    fetchData("stats").then(setStats)
  }, [])

  if (!stats) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-muted rounded"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="animate-in fade-in slide-in-from-top duration-300">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={stats.totalRevenue}
          change={stats.revenueChange}
          icon={DollarSign}
          delay={0}
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          change={stats.ordersChange}
          icon={ShoppingCart}
          delay={100}
        />
        <StatCard title="Total Users" value={stats.totalUsers} change={stats.usersChange} icon={Users} delay={200} />
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          change={stats.productsChange}
          icon={Package}
          delay={300}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <RevenueChart />
        <RecentActivity />
      </div>
    </div>
  )
}
