"use client"

import { Accordion } from "@/components/ui/accordion"
import { motion } from "framer-motion"

const faqItems = [
  {
    question: "Is Vently private?",
    answer: "Yes, 100%. All your conversations are encrypted and we never share your data with anyone."
  },
  {
    question: "Can I stay anonymous?",
    answer: "Absolutely. You don't need to provide your real name or any identifying information to use Vently."
  },
  {
    question: "Does Vently judge me?",
    answer: "Never. Vently is built on principles of radical acceptance and non-judgmental listening."
  },
  {
    question: "Can I talk about anything?",
    answer: "Yes, you can talk about whatever is on your mind — from small daily stresses to deep emotional challenges."
  },
  {
    question: "Is this therapy?",
    answer: "Vently is an emotional support tool, not a replacement for professional therapy or medical advice. It's a space for reflection and validation."
  }
]

export function FAQ() {
  return (
    <section className="py-24 px-6 max-w-[800px] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="space-y-12"
      >
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-center text-text-primary">
          Common Questions
        </h2>
        <Accordion items={faqItems} />
      </motion.div>
    </section>
  )
}
