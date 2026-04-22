"use client"

import { Shield, Brain, Clock } from "lucide-react"
import { motion } from "framer-motion"

const features = [
  {
    icon: <Brain className="h-8 w-8" />,
    title: "Emotion-aware AI",
    description: "Our AI understands the nuances of your feelings and responds with genuine empathy."
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: "100% Private",
    description: "Your conversations are encrypted and private. No one but you can access your thoughts."
  },
  {
    icon: <Clock className="h-8 w-8" />,
    title: "Always available",
    description: "Day or night, Vently is here whenever you need someone to talk to."
  }
]

export function ValueSection() {
  return (
    <section id="features" className="py-24 px-6 max-w-[1200px] mx-auto">
      <div className="text-center mb-20">
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground mb-4">
          A space where you can say <br className="hidden md:block" />{" "}
          <span className="bg-gradient-to-r from-brand-pink to-brand-purple bg-clip-text text-transparent">everything you’ve been holding in.</span>
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="flex flex-col items-center text-center space-y-4 p-10 rounded-[40px] bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-xl shadow-brand-pink/5 hover:scale-[1.02] transition-all"
          >
            <div className="text-brand-pink mb-4 p-4 rounded-full bg-brand-pink/10">{feature.icon}</div>
            <h3 className="text-2xl font-bold text-foreground">{feature.title}</h3>
            <p className="text-text-secondary/80 font-medium leading-relaxed">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
