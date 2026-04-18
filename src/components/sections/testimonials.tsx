"use client"

import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { useGlobalState } from "@/lib/store"

export function Testimonials() {
  const { feedbacks } = useGlobalState()
  const visibleFeedbacks = feedbacks.filter(f => f.isVisible)

  return (
    <section className="py-24 px-6 max-w-[1440px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {visibleFeedbacks.map((t, i) => (
          <motion.div
            key={t._id || i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="h-full border-none bg-secondary/50 backdrop-blur-sm">
              <CardContent className="pt-8 flex flex-col items-center text-center space-y-6">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-border shadow-sm">
                  <img src={t.userAvatar} alt={t.userName} className="w-full h-full object-cover" />
                </div>
                <p className="text-lg italic text-text-primary leading-relaxed">
                  &quot;{t.content}&quot;
                </p>
                <div className="space-y-1">
                  <p className="font-bold text-text-primary">
                    {t.userName}
                  </p>
                  <p className="text-xs text-text-secondary uppercase tracking-widest">
                    Verified User
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
