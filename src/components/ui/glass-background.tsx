"use client"

import React from "react"
import { motion } from "framer-motion"
import { Heart, Brain, MessageCircle } from "lucide-react"

export function GlassBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Soft Pink/Lavender Base Gradient */}
      <div className="absolute inset-0 bg-[#fffafa] dark:bg-[#1a1021]" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#ffe4e6]/40 via-transparent to-[#f3e8ff]/40 opacity-80" />
      
      {/* Large Soft Blobs (Background) */}
      <motion.div
        animate={{
          x: [0, 150, 0],
          y: [0, 100, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-[10%] -left-[10%] w-[70%] h-[70%] bg-brand-pink/20 rounded-full blur-[130px]"
      />
      
      <motion.div
        animate={{
          x: [0, -120, 0],
          y: [0, 150, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[20%] -right-[10%] w-[60%] h-[60%] bg-brand-purple/20 rounded-full blur-[110px]"
      />

      {/* Floating Symbols: Heart, Mind (Brain), Chats */}
      <FloatingSymbol icon={<Heart className="w-12 h-12" fill="currentColor" />} delay={0} x="15%" y="15%" duration={12} />
      <FloatingSymbol icon={<Brain className="w-14 h-14" fill="currentColor" />} delay={2} x="80%" y="20%" duration={15} />
      <FloatingSymbol icon={<MessageCircle className="w-12 h-12" fill="currentColor" />} delay={4} x="70%" y="75%" duration={18} />
      <FloatingSymbol icon={<Heart className="w-10 h-10" fill="currentColor" />} delay={6} x="25%" y="85%" duration={14} />
      <FloatingSymbol icon={<MessageCircle className="w-16 h-16" fill="currentColor" />} delay={8} x="8%" y="55%" duration={20} />
      <FloatingSymbol icon={<Brain className="w-10 h-10" fill="currentColor" />} delay={1} x="45%" y="10%" duration={16} />

      {/* Floating Gradient Spheres (Glassy Ores) */}
      <motion.div
        animate={{
          y: [0, -60, 0],
          x: [0, 40, 0],
          rotate: [0, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-[10%] left-[20%] w-40 h-40 rounded-full overflow-hidden opacity-40 blur-[3px]"
      >
        <div className="w-full h-full bg-gradient-to-br from-brand-pink/60 via-brand-purple/60 to-brand-blue/60" />
        <div className="absolute inset-0 bg-white/30 backdrop-blur-md" />
      </motion.div>

      <motion.div
        animate={{
          y: [0, 80, 0],
          x: [0, -50, 0],
          rotate: [0, -360],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute bottom-[15%] right-[15%] w-56 h-56 rounded-full overflow-hidden opacity-30 blur-[4px]"
      >
        <div className="w-full h-full bg-gradient-to-tr from-brand-pink/50 via-brand-blue/50 to-brand-purple/50" />
        <div className="absolute inset-0 bg-white/30 backdrop-blur-lg" />
      </motion.div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03] dark:opacity-[0.05] [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
    </div>
  )
}

function FloatingSymbol({ icon, delay, x, y, duration }: { icon: React.ReactNode, delay: number, x: string, y: string, duration: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: [0.15, 0.4, 0.15],
        y: [0, -40, 0],
        x: [0, 20, 0],
        rotate: [0, 15, -15, 0],
        scale: [0.9, 1.1, 0.9]
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="absolute text-brand-pink/30 dark:text-brand-purple/20 blur-[1.5px] drop-shadow-[0_0_8px_rgba(255,182,193,0.3)]"
      style={{ left: x, top: y }}
    >
      {icon}
    </motion.div>
  )
}
