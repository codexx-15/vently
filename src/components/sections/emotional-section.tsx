"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useGlobalState } from "@/lib/store"

export function EmotionalSection() {
  const { settings } = useGlobalState()
  const images = settings.emotionalImages
  const [currentIndex, setCurrentIndex] = React.useState(0)

  React.useEffect(() => {
    if (images.length <= 1) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 2000)
    return () => clearInterval(timer)
  }, [images.length])

  return (
    <section className="py-24 px-6 max-w-[1440px] mx-auto overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Left: Slider */}
        <div className="relative aspect-square w-full max-w-[500px] mx-auto rounded-[20px] overflow-hidden shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={images[currentIndex]}
              alt={`Emotional scene ${currentIndex + 1}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full object-cover grayscale opacity-80"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-background/20 mix-blend-overlay pointer-events-none" />
        </div>

        {/* Right: Text */}
        <div className="space-y-6">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-text-primary leading-tight">
            The more you open up, <br /> the more Vently <br /> understands you.
          </h2>
          <p className="text-xl text-text-secondary leading-relaxed">
            Our adaptive emotional AI doesn&apos;t just process words — it feels the weight behind them. 
            Through a calm, non-judgmental dialogue, it learns your emotional landscape, 
            offering a space that feels increasingly human, safe, and uniquely yours.
          </p>
        </div>
      </div>
    </section>
  )
}
