import * as React from "react"
import { cn } from "@/lib/utils"

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 font-bold text-2xl tracking-tight", className)}>
      <span className="text-foreground">Vently</span>
    </div>
  )
}
