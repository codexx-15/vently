"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { useGlobalState } from "@/lib/store"
import { useRouter } from "next/navigation"
import { GlassBackground } from "@/components/ui/glass-background"

export function Hero() {
  const { settings } = useGlobalState()
  const router = useRouter()
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0)
  const [currentVideoIndex, setCurrentVideoIndex] = React.useState(0)

  React.useEffect(() => {
    if (settings.heroImages.length <= 1 && settings.heroVideos.length <= 1) return
    const interval = setInterval(() => {
      if (settings.heroVideos.length > 0) {
        setCurrentVideoIndex((prev) => (prev + 1) % settings.heroVideos.length)
      } else {
        setCurrentImageIndex((prev) => (prev + 1) % settings.heroImages.length)
      }
    }, 10000)
    return () => clearInterval(interval)
  }, [settings.heroImages.length, settings.heroVideos.length])

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center pt-20 text-center px-6 overflow-hidden">
      <GlassBackground />
      
      {/* Dynamic Background Images/Videos from Cloudinary/Settings */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          {settings.heroVideos.length > 0 && settings.heroVideos[currentVideoIndex] ? (
            <motion.div
              key={`video-${currentVideoIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.15 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2 }}
              className="absolute inset-0"
            >
              <video 
                src={settings.heroVideos[currentVideoIndex]} 
                autoPlay 
                muted 
                loop 
                playsInline
                className="w-full h-full object-cover grayscale" 
              />
            </motion.div>
          ) : settings.heroImages.length > 0 && settings.heroImages[currentImageIndex] ? (
            <motion.div
              key={`image-${currentImageIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.15 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2 }}
              className="absolute inset-0"
            >
              <img 
                src={settings.heroImages[currentImageIndex]} 
                className="w-full h-full object-cover grayscale" 
                alt="Background" 
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-brand-pink/10 via-transparent to-brand-purple/10 opacity-60" />
      </div>
      
      {/* Background Decorative Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1400px] aspect-square opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-radial from-brand-purple/30 to-transparent blur-[150px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-[900px] space-y-8 z-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 dark:bg-white/5 backdrop-blur-md border border-white/40 dark:border-white/10 text-brand-purple text-sm font-semibold mb-2 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-pink opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-pink"></span>
          </span>
          Vently: Your Safe Space
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-foreground leading-[0.9]">
          Your Feelings. <br />
          <span className="bg-gradient-to-r from-brand-purple via-brand-pink to-brand-blue bg-clip-text text-transparent">Finally Heard.</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-text-secondary/80 font-medium max-w-[650px] mx-auto leading-relaxed">
          Vently is your safe space to vent, reflect, and be understood — anytime, anywhere. Experience emotional relief with AI that truly cares.
        </p>
        
        <div className="pt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            size="lg" 
            className="rounded-[24px] h-16 px-10 text-xl font-bold bg-gradient-to-r from-brand-pink to-brand-purple hover:scale-105 transition-all shadow-xl shadow-brand-pink/20 text-white"
            onClick={() => router.push('/vent')}
          >
            Start Venting Now
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="rounded-[24px] h-16 px-10 text-xl font-bold border-white/40 dark:border-white/10 bg-white/20 dark:bg-white/5 backdrop-blur-md hover:bg-white/40 transition-all"
            onClick={() => {
              const chatSection = document.getElementById('chat');
              chatSection?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Try Demo Chat
          </Button>
        </div>
      </motion.div>
      
      {/* Floating UI Elements (Glass Cards) */}
      <motion.div
        animate={{
          y: [0, -20, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-20 left-10 hidden lg:block"
      >
        <div className="bg-white/30 dark:bg-black/20 backdrop-blur-xl p-6 rounded-[32px] border border-white/40 dark:border-white/10 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-purple/20" />
            <div className="space-y-1">
              <div className="h-2 w-24 bg-brand-purple/20 rounded-full" />
              <div className="h-2 w-16 bg-brand-purple/10 rounded-full" />
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        animate={{
          y: [0, 20, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute top-40 right-10 hidden lg:block"
      >
        <div className="bg-white/30 dark:bg-black/20 backdrop-blur-xl p-6 rounded-[32px] border border-white/40 dark:border-white/10 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-pink/20" />
            <div className="space-y-1">
              <div className="h-2 w-20 bg-brand-pink/20 rounded-full" />
              <div className="h-2 w-28 bg-brand-pink/10 rounded-full" />
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
