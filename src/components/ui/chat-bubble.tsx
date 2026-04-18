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
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "flex w-full",
        isAi ? "justify-start" : "justify-end",
        className
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-5 py-3 text-base leading-relaxed",
          isAi 
            ? "bg-secondary text-text-primary rounded-tl-none" 
            : "bg-foreground text-background rounded-tr-none shadow-sm"
        )}
      >
        {message}
      </div>
    </motion.div>
  )
}
