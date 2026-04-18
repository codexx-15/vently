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
    <section className="bg-[#0D0D0D] text-white py-24 px-6 overflow-hidden">
      <div className="max-w-[1440px] mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6 mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
            Millions of voices. One safe space.
          </h2>
          <p className="text-xl text-[#A1A1AA] max-w-[700px] mx-auto">
            People around the world are opening up and feeling heard.
          </p>
        </motion.div>

        {/* Visual: Dotted Map with Nodes */}
        <div className="relative h-[400px] w-full max-w-[1000px] mx-auto">
          {/* Mock Dotted Map background */}
          <div className="absolute inset-0 opacity-20" 
               style={{ 
                 backgroundImage: 'radial-gradient(circle, #A1A1AA 1px, transparent 1px)', 
                 backgroundSize: '30px 30px' 
               }} 
          />
          
          {/* Floating Nodes */}
          {nodes.map((node, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.2, 1] }}
              viewport={{ once: true }}
              transition={{ 
                duration: node.duration, 
                repeat: Infinity, 
                delay: node.delay 
              }}
              className="absolute w-2 h-2 bg-white rounded-full blur-[1px] shadow-[0_0_8px_rgba(255,255,255,0.8)]"
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
                className="bg-[#1A1A1A] border border-[#27272A] px-6 py-3 rounded-full flex flex-col items-center backdrop-blur-sm"
              >
                <span className="text-2xl font-bold">{stat.label}</span>
                <span className="text-xs text-[#A1A1AA] uppercase tracking-widest">{stat.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
