"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const activities = [
  {
    id: 1,
    user: "John Doe",
    action: "placed an order",
    amount: "$299.99",
    time: "2 minutes ago",
    avatar: "/abstract-geometric-shapes.png",
  },
  {
    id: 2,
    user: "Jane Smith",
    action: "left a review",
    rating: "5 stars",
    time: "15 minutes ago",
    avatar: "/diverse-woman-portrait.png",
  },
  {
    id: 3,
    user: "Bob Johnson",
    action: "registered",
    time: "1 hour ago",
    avatar: "/abstract-geometric-shapes.png",
  },
  {
    id: 4,
    user: "Alice Williams",
    action: "placed an order",
    amount: "$159.99",
    time: "2 hours ago",
    avatar: "/diverse-woman-portrait.png",
  },
  {
    id: 5,
    user: "Charlie Brown",
    action: "updated profile",
    time: "3 hours ago",
    avatar: "/abstract-geometric-shapes.png",
  },
]

export function RecentActivity() {
  return (
    <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div
              key={activity.id}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-all duration-200 animate-in slide-in-from-left"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Avatar className="h-10 w-10 border-2 border-border">
                <AvatarImage src={activity.avatar || "/placeholder.svg"} alt={activity.user} />
                <AvatarFallback>{activity.user[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {activity.user} <span className="text-muted-foreground font-normal">{activity.action}</span>
                </p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
              {activity.amount && (
                <Badge variant="secondary" className="font-mono">
                  {activity.amount}
                </Badge>
              )}
              {activity.rating && (
                <Badge variant="default" className="bg-accent text-accent-foreground">
                  {activity.rating}
                </Badge>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
