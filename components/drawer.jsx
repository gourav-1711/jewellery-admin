"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Drawer({ isOpen, onClose, title, children, className }) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      
      <SheetDescription className="sr-only">{title}</SheetDescription>
      <SheetContent
        side="right"
        className={cn(
          "w-full max-w-md bg-card border-l border-border shadow-2xl overflow-y-auto p-0 [&>button]:hidden",
          className
        )}
      >
        <div className="flex flex-col h-full">
          <SheetHeader className="flex flex-row items-center justify-between p-6 border-b border-border">
            <SheetTitle className="text-xl font-semibold">{title}</SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="transition-all duration-200 hover:scale-110 hover:rotate-90"
            >
              <X className="h-5 w-5" />
            </Button>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-6 pb-20">{children}</div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
