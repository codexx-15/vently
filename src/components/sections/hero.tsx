"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { useGlobalState } from "@/lib/store"
import { useRouter } from "next/navigation"

export function Hero() {
  const { settings } = useGlobalState()
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const router = useRouter()

  React.useEffect(() => {
    if (settings.heroImages.length <= 1) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % settings.heroImages.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [settings.heroImages])

  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center pt-20 text-center px-6 overflow-hidden">
      {/* Dynamic Background Slider */}
      <div className="absolute inset-0 -z-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="absolute inset-0 bg-cover bg-center grayscale"
            style={{ backgroundImage: `url(${settings.heroImages[currentIndex]})` }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-[800px] space-y-6"
      >
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-text-primary">
          Your Feelings. <br /> Finally Heard.
        </h1>
        <p className="text-xl md:text-2xl text-text-secondary font-normal max-w-[600px] mx-auto leading-relaxed">
          Vently is your safe space to vent, reflect, and be understood — anytime, anywhere.
        </p>
        <div className="pt-8">
          <Button 
            size="lg" 
            className="rounded-full"
            onClick={() => router.push('/vent')}
          >
            Start Venting
          </Button>
        </div>
      </motion.div>
      
      {/* Subtle background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-foreground/[0.03] rounded-full blur-3xl" />
      </div>
    </section>
  )
}
