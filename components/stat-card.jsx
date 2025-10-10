"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react"
import { useEffect, useState } from "react"

export function StatCard({ title, value, change, icon: Icon, delay = 0 }) {
  const [displayValue, setDisplayValue] = useState(0)
  const isPositive = change >= 0

  useEffect(() => {
    let start = 0
    const end = value
    const duration = 1000
    const increment = end / (duration / 16)

    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setDisplayValue(end)
        clearInterval(timer)
      } else {
        setDisplayValue(Math.floor(start))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [value])

  return (
    <Card
      className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-4"
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-3xl font-bold tracking-tight">
            {title.includes("Revenue") ? `$${displayValue.toLocaleString()}` : displayValue.toLocaleString()}
          </p>
          <div className="flex items-center gap-1 text-sm">
            {isPositive ? (
              <ArrowUpIcon className="h-4 w-4 text-accent" />
            ) : (
              <ArrowDownIcon className="h-4 w-4 text-destructive" />
            )}
            <span className={isPositive ? "text-accent" : "text-destructive"}>{Math.abs(change)}%</span>
            <span className="text-muted-foreground">from last month</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
