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
    <section id="features" className="py-24 px-6 max-w-[1440px] mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-text-primary mb-4">
          A space where you can say everything <br className="hidden md:block" /> you’ve been holding in.
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="flex flex-col items-center text-center space-y-4 p-8 rounded-2xl bg-card border border-border"
          >
            <div className="text-text-primary mb-4">{feature.icon}</div>
            <h3 className="text-xl font-bold text-text-primary">{feature.title}</h3>
            <p className="text-text-secondary leading-relaxed">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
