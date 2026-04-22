"use client"

import * as React from "react"
import { ChatBubble } from "@/components/ui/chat-bubble"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, Loader2, Sparkles, Heart, Cat } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useGlobalState } from "@/lib/store"
import { useRouter } from "next/navigation"
import { GlassBackground } from "@/components/ui/glass-background"

type Message = {
  role: 'ai' | 'user'
  content: string
}

function ChatAnimationOverlay() {
  const [mounted, setMounted] = React.useState(false)
  const [elements, setElements] = React.useState<{ circles: any[], hearts: any[], cats: any[], characters: any[] }>({
    circles: [],
    hearts: [],
    cats: [],
    characters: []
  })

  React.useEffect(() => {
    setMounted(true)
    setElements({
      circles: [...Array(8)].map((_, i) => ({
        id: i,
        x: Math.random() * 100 - 50,
        duration: 8 + Math.random() * 8,
        delay: i * 1.5,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: 40 + Math.random() * 60
      })),
      hearts: [...Array(12)].map((_, i) => ({
        id: i,
        rotate: Math.random() * 360,
        duration: 6 + Math.random() * 6,
        delay: i * 0.8,
        left: `${Math.random() * 95}%`,
        top: `${Math.random() * 90}%`,
        size: 20 + Math.random() * 20
      })),
      cats: [...Array(8)].map((_, i) => ({
        id: i,
        duration: 10 + Math.random() * 10,
        delay: i * 2,
        left: `${Math.random() * 90}%`,
        top: `${Math.random() * 85}%`,
        size: 24 + Math.random() * 16
      })),
      characters: [...Array(10)].map((_, i) => ({
        id: i,
        emoji: i % 2 === 0 ? "👦" : "👧",
        duration: 12 + Math.random() * 15,
        delay: i * 2.5,
        left: `${Math.random() * 90}%`,
        top: `${Math.random() * 85}%`,
        size: 40 + Math.random() * 30
      }))
    })
  }, [])

  if (!mounted) return null

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Floating Circles */}
      {elements.circles.map((circle) => (
        <motion.div
          key={`circle-${circle.id}`}
          animate={{
            y: [0, -150, 0],
            x: [0, circle.x, 0],
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: circle.duration,
            repeat: Infinity,
            delay: circle.delay,
          }}
          className="absolute rounded-full bg-brand-pink/30 blur-lg"
          style={{
            left: circle.left,
            top: circle.top,
            width: circle.size,
            height: circle.size
          }}
        />
      ))}

      {/* Floating Hearts */}
      {elements.hearts.map((heart) => (
        <motion.div
          key={`heart-${heart.id}`}
          animate={{
            y: [0, -60, 0],
            rotate: [0, heart.rotate, heart.rotate + 180, heart.rotate],
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            duration: heart.duration,
            repeat: Infinity,
            delay: heart.delay,
          }}
          className="absolute text-brand-pink/50 drop-shadow-md"
          style={{
            left: heart.left,
            top: heart.top,
          }}
        >
          <Heart fill="currentColor" size={heart.size} />
        </motion.div>
      ))}

      {/* Floating Cats */}
      {elements.cats.map((cat) => (
        <motion.div
          key={`cat-${cat.id}`}
          animate={{
            x: [0, 80, 0],
            y: [0, 40, 0],
            rotate: [0, 20, -20, 0],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{
            duration: cat.duration,
            repeat: Infinity,
            delay: cat.delay,
          }}
          className="absolute text-brand-purple/40 drop-shadow-sm"
          style={{
            left: cat.left,
            top: cat.top,
          }}
        >
          <Cat size={cat.size} />
        </motion.div>
      ))}

      {/* Animated Characters (Boys and Girls) */}
      {elements.characters.map((char) => (
        <motion.div
          key={`char-${char.id}`}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 100 - 50, 0],
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1],
            opacity: [0.6, 0.9, 0.6]
          }}
          transition={{
            duration: char.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: char.delay,
          }}
          className="absolute select-none drop-shadow-lg"
          style={{
            left: char.left,
            top: char.top,
            fontSize: `${char.size}px`
          }}
        >
          {char.emoji}
        </motion.div>
      ))}
    </div>
  )
}

export function ChatSection() {
  const { isLoggedIn } = useGlobalState()
  const router = useRouter()
  const [messages, setMessages] = React.useState<Message[]>([
    {
      role: 'ai',
      content: "Hey… I’m really glad you’re here 🤍 How are you feeling today? Take your time."
    }
  ])
  const [input, setInput] = React.useState("")
  const [isTyping, setIsTyping] = React.useState(false)
  const scrollRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const handleSend = async () => {
    if (!input.trim() || isTyping) return

    if (!isLoggedIn) {
      router.push('/register')
      return
    }

    const userMessage = input.trim()
    const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }]
    setMessages(newMessages)
    setInput("")
    setIsTyping(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessages.map(m => ({
            role: m.role,
            content: m.content
          }))
        }),
      })

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await response.json()
      setMessages(prev => [...prev, { role: 'ai', content: data.content }])
    } catch (error: any) {
      console.error('Chat error:', error.message)
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: `I'm so sorry, I'm having a little trouble connecting right now. (${error.message})` 
      }])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <section id="chat" className="min-h-screen py-24 px-4 md:px-6 relative overflow-hidden bg-background">
      <GlassBackground />
      
      {/* Background Decorative Element (World Map / Glow) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1200px] aspect-square opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-radial from-brand-purple/40 to-transparent blur-[120px]" />
        <div className="absolute inset-0 bg-[url('/globe.svg')] bg-center bg-no-repeat bg-contain opacity-30 dark:opacity-50" />
      </div>
      
      <div className="max-w-[900px] mx-auto space-y-8 z-10 relative">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 dark:bg-white/5 backdrop-blur-md border border-white/40 dark:border-white/10 text-brand-purple text-sm font-semibold mb-2 shadow-sm">
            <Sparkles className="h-4 w-4 text-brand-pink" />
            Vently AI Assistant
          </div>
          <h2 className="text-5xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-brand-purple via-brand-pink to-brand-blue bg-clip-text text-transparent pb-2">
            Vently Chat 🌙
          </h2>
          <p className="text-text-secondary/80 text-xl font-medium">Your safe space for expression, without judgment.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 dark:bg-black/10 backdrop-blur-3xl rounded-[48px] shadow-[0_32px_64px_-16px_rgba(255,182,193,0.1)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col h-[700px] border border-white/30 dark:border-white/5 relative"
        >
          {/* Animated Background Overlay */}
          <ChatAnimationOverlay />

          {/* Chat Messages */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 md:p-12 space-y-4 scroll-smooth custom-scrollbar"
          >
            {messages.map((msg, i) => (
              <ChatBubble key={i} role={msg.role} message={msg.content} />
            ))}
            
            <AnimatePresence>
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-start mt-4"
                >
                  <div className="bg-white/40 dark:bg-white/5 backdrop-blur-xl text-brand-purple rounded-[20px] rounded-tl-none px-6 py-4 flex items-center gap-3 text-sm font-semibold border border-white/40 dark:border-white/10 shadow-sm">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Vently is typing...
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Input Area */}
          <div className="p-8 md:p-10 bg-white/20 dark:bg-black/20 border-t border-white/40 dark:border-white/10 backdrop-blur-xl">
            <div className="relative flex items-center gap-4">
              <div className="relative flex-1 group">
                <Input
                  placeholder="Type your heart out..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="pr-16 h-16 rounded-[28px] bg-white/40 dark:bg-white/5 border-white/50 dark:border-white/10 focus:border-brand-purple/50 focus:ring-4 focus:ring-brand-purple/10 transition-all text-lg placeholder:text-text-secondary/40 shadow-inner"
                />
                <Button
                  size="sm"
                  className="absolute right-2 top-2 h-12 w-12 p-0 rounded-[22px] bg-gradient-to-br from-brand-pink to-brand-purple hover:scale-105 shadow-xl shadow-brand-pink/30 transition-all active:scale-95 disabled:opacity-50"
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                >
                  <Send className="h-5 w-5 text-white" />
                </Button>
              </div>
            </div>
            <p className="text-center text-[10px] uppercase tracking-widest font-bold text-text-secondary/40 mt-6">
              Safe • Anonymous • Secure
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
