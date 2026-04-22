"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 font-black text-2xl tracking-tighter", className)}>
      <span className="bg-gradient-to-br from-brand-pink to-brand-purple bg-clip-text text-transparent">Vently</span>
    </div>
  )
}
