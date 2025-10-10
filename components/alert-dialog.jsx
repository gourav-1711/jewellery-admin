"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { AlertTriangle } from "lucide-react"

export function AlertDialog({ isOpen, onClose, onConfirm, title, description }) {
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

  if (!isOpen) return null

  return (
    <>
      <div
        className={cn(
          "fixed top-[50%] left-[50%] translate-x-1/2 translate-y-1/2 inset-0 bg-background/80 backdrop-blur-sm z-50 transition-opacity duration-300 animate-in fade-in",
        )}
        onClick={onClose}
      />

      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md animate-in zoom-in-95 fade-in duration-200">
        <div className="bg-card border border-border rounded-lg shadow-2xl p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="transition-all duration-200 hover:scale-105 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onConfirm()
                onClose()
              }}
              className="transition-all duration-200 hover:scale-105"
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
