"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, Printer } from "lucide-react"
import { cn } from "@/lib/utils"

export function OrderReceipt({ isOpen, onClose, order }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const handlePrint = () => {
    window.print()
  }

  if (!isOpen || !order) return null

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 bg-background/80 backdrop-blur-sm z-50 transition-opacity duration-300 animate-in fade-in",
        )}
        onClick={onClose}
      />

      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl max-h-[90vh] overflow-auto animate-in zoom-in-95 fade-in duration-200">
        <div className="bg-card border border-border rounded-lg shadow-2xl">
          <div className="flex items-center justify-between p-6 border-b border-border print:hidden">
            <h2 className="text-xl font-semibold">Order Receipt</h2>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrint}
                className="transition-all duration-200 hover:scale-110 bg-transparent"
              >
                <Printer className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="transition-all duration-200 hover:scale-110"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="p-8 space-y-6" id="receipt-content">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold">RECEIPT</h1>
              <p className="text-muted-foreground">Order #{order.id}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 border-y border-border">
              <div>
                <p className="text-sm text-muted-foreground">Customer</p>
                <p className="font-semibold">{order.customer}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-semibold">{order.date}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Payment Method</p>
                <p className="font-semibold">{order.paymentMethod}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-semibold capitalize">{order.status}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Order Items</h3>
              <div className="space-y-2">
                {[...Array(order.items)].map((_, i) => (
                  <div key={i} className="flex justify-between py-2 border-b border-border">
                    <div>
                      <p className="font-medium">Product {i + 1}</p>
                      <p className="text-sm text-muted-foreground">Quantity: 1</p>
                    </div>
                    <p className="font-semibold">${(order.total / order.items).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t-2 border-border">
              <div className="flex justify-between text-lg">
                <span className="font-semibold">Subtotal</span>
                <span>${(order.total * 0.9).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (10%)</span>
                <span>${(order.total * 0.1).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-2xl font-bold pt-2">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground pt-6">
              <p>Thank you for your purchase!</p>
              <p>For questions, contact support@admin.com</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #receipt-content,
          #receipt-content * {
            visibility: visible;
          }
          #receipt-content {
            position: absolute;
            left: 0;
            top: 0;
          }
        }
      `}</style>
    </>
  )
}
