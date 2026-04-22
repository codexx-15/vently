"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export interface ChatBubbleProps {
  message: string
  role: 'ai' | 'user'
  className?: string
}

export function ChatBubble({ message, role, className }: ChatBubbleProps) {
  const isAi = role === 'ai'
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "flex w-full mb-4",
        isAi ? "justify-start" : "justify-end",
        className
      )}
    >
      <div
        className={cn(
          "max-w-[85%] px-6 py-4 text-base leading-relaxed shadow-xl transition-all duration-300 relative",
          isAi 
            ? "bg-white/50 dark:bg-white/10 backdrop-blur-2xl text-foreground rounded-[28px] rounded-tl-[4px] border border-white/50 dark:border-white/20" 
            : "bg-gradient-to-br from-brand-pink to-brand-purple text-white rounded-[28px] rounded-tr-[4px] shadow-brand-pink/20 hover:shadow-brand-pink/30 border border-white/20"
        )}
      >
        <div className="absolute inset-0 bg-white/5 rounded-[inherit] pointer-events-none" />
        <p className="whitespace-pre-wrap relative z-10">{message}</p>
      </div>
    </motion.div>
  )
}
