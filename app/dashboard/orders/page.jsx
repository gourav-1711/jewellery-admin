"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { ExportButtons } from "@/components/export-buttons"
import { AlertDialog } from "@/components/alert-dialog"
import { OrderReceipt } from "@/components/order-receipt"
import { Package, Clock, Truck, CheckCircle, Printer } from "lucide-react"
import { fetchData, deleteItem } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [alertOpen, setAlertOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [receiptOpen, setReceiptOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const { toast } = useToast()

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    setLoading(true)
    const data = await fetchData("orders")
    setOrders(data)
    setLoading(false)
  }

  const handleEdit = (order) => {
    toast({ title: "Order details", description: `Order #${order.id} - ${order.customer}` })
  }

  const handleDelete = async (id) => {
    setDeleteId(id)
    setAlertOpen(true)
  }

  const confirmDelete = async () => {
    await deleteItem("orders", deleteId)
    setOrders(orders.filter((o) => o.id !== deleteId))
    toast({ title: "Order deleted successfully" })
    setDeleteId(null)
  }

  const handlePrint = (order) => {
    setSelectedOrder(order)
    setReceiptOpen(true)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "processing":
        return <Package className="h-4 w-4" />
      case "shipped":
        return <Truck className="h-4 w-4" />
      case "delivered":
        return <CheckCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "secondary"
      case "processing":
        return "default"
      case "shipped":
        return "default"
      case "delivered":
        return "default"
      default:
        return "secondary"
    }
  }

  const columns = [
    {
      key: "id",
      label: "Order ID",
      render: (item) => <span className="font-mono font-semibold">#{item.id}</span>,
    },
    {
      key: "customer",
      label: "Customer",
      render: (item) => <span className="font-medium">{item.customer}</span>,
    },
    {
      key: "items",
      label: "Items",
      render: (item) => (
        <Badge variant="secondary" className="font-mono">
          {item.items}
        </Badge>
      ),
    },
    {
      key: "total",
      label: "Total",
      render: (item) => <span className="font-semibold">${item.total.toFixed(2)}</span>,
    },
    {
      key: "status",
      label: "Status",
      render: (item) => (
        <Badge variant={getStatusColor(item.status)} className="capitalize gap-1">
          {getStatusIcon(item.status)}
          {item.status}
        </Badge>
      ),
    },
    {
      key: "paymentMethod",
      label: "Payment",
      render: (item) => <span className="text-sm text-muted-foreground">{item.paymentMethod}</span>,
    },
    {
      key: "date",
      label: "Date",
      render: (item) => <span className="text-sm text-muted-foreground">{item.date}</span>,
    },
    {
      key: "actions",
      label: "Actions",
      render: (item) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePrint(item)}
          className="transition-all duration-200 hover:scale-105"
        >
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>
      ),
    },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-muted rounded"></div>
          <div className="h-96 bg-muted rounded-lg"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-in fade-in slide-in-from-top duration-300">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">Track and manage customer orders</p>
        </div>
        <ExportButtons data={orders} filename="orders" />
      </div>

      <DataTable
        data={orders}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search orders..."
      />

      <AlertDialog
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Order"
        description="Are you sure you want to delete this order? This action cannot be undone."
      />

      <OrderReceipt isOpen={receiptOpen} onClose={() => setReceiptOpen(false)} order={selectedOrder} />
    </div>
  )
}
