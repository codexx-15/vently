"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

export function FinalCTA() {
  const router = useRouter()
  return (
    <section className="py-32 px-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-[800px] mx-auto space-y-8 p-12 md:p-24 rounded-[40px] bg-secondary/30 border border-border"
      >
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-text-primary">
          Start venting. <br /> No pressure. No judgment.
        </h2>
        <div className="pt-4">
          <Button 
            size="lg" 
            className="rounded-full px-12 text-xl py-6 h-auto"
            onClick={() => router.push('/vent')}
          >
            Talk to Vently
          </Button>
        </div>
      </motion.div>
    </section>
  )
}
