"use client"

import * as React from "react"
import { motion } from "framer-motion"

export function TrustSection() {
  const [nodes, setNodes] = React.useState<{ top: string; left: string; duration: number; delay: number }[]>([])

  React.useEffect(() => {
    setNodes([...Array(15)].map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      duration: 3 + Math.random() * 2,
      delay: Math.random() * 2
    })))
  }, [])

  return (
    <section className="relative py-24 px-6 overflow-hidden">
      <div className="max-w-[1440px] mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6 mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground">
            Millions of voices. <br/>
            <span className="bg-gradient-to-r from-brand-pink to-brand-purple bg-clip-text text-transparent">One safe space.</span>
          </h2>
          <p className="text-xl text-text-secondary/80 font-medium max-w-[700px] mx-auto">
            People around the world are opening up and feeling heard.
          </p>
        </motion.div>

        {/* Visual: Dotted Map with Nodes */}
        <div className="relative h-[400px] w-full max-w-[1000px] mx-auto">
          {/* Mock Dotted Map background */}
          <div className="absolute inset-0 opacity-10" 
               style={{ 
                 backgroundImage: 'radial-gradient(circle, #db2777 1px, transparent 1px)', 
                 backgroundSize: '30px 30px' 
               }} 
          />
          
          {/* Floating Nodes */}
          {nodes.map((node, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.3, 1] }}
              viewport={{ once: true }}
              transition={{ 
                duration: node.duration, 
                repeat: Infinity, 
                delay: node.delay 
              }}
              className="absolute w-2.5 h-2.5 bg-brand-pink rounded-full blur-[1px] shadow-[0_0_12px_rgba(219,39,119,0.5)]"
              style={{ 
                top: node.top, 
                left: node.left 
              }}
            />
          ))}

          {/* Stats Pills */}
          <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-4 md:gap-8 pointer-events-none">
            {[
              { label: "2M+", text: "Conversations" },
              { label: "150K+", text: "Daily Users" },
              { label: "100+", text: "Countries" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 px-8 py-4 rounded-[24px] flex flex-col items-center backdrop-blur-xl shadow-xl shadow-brand-pink/5"
              >
                <span className="text-3xl font-black bg-gradient-to-br from-brand-pink to-brand-purple bg-clip-text text-transparent">{stat.label}</span>
                <span className="text-[10px] font-bold text-text-secondary/60 uppercase tracking-[0.2em]">{stat.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
