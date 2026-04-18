"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

export function Accordion({ items }: { items: { question: string, answer: string }[] }) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null)

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="border-b border-border pb-4">
          <button
            className="flex w-full items-center justify-between py-4 text-left font-semibold text-lg hover:text-text-primary transition-colors"
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          >
            {item.question}
            <ChevronDown
              className={cn(
                "h-5 w-5 transition-transform duration-300",
                openIndex === index && "rotate-180"
              )}
            />
          </button>
          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <p className="pb-4 text-text-secondary leading-relaxed">
                  {item.answer}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}
