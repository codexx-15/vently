"use client"

import * as React from "react"
import { ChatBubble } from "@/components/ui/chat-bubble"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useGlobalState } from "@/lib/store"
import { useRouter } from "next/navigation"

type Message = {
  role: 'ai' | 'user'
  content: string
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
    <section id="chat" className="py-24 px-6 bg-background">
      <div className="max-w-[700px] mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-text-primary">Vently 🌙</h2>
          <p className="text-text-secondary">Listening without judgment</p>
        </div>

        <div className="border border-border rounded-[32px] bg-card shadow-sm overflow-hidden flex flex-col h-[600px]">
          {/* Chat Messages */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
          >
            {messages.map((msg, i) => (
              <ChatBubble key={i} role={msg.role} message={msg.content} />
            ))}
            
            <AnimatePresence>
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-secondary text-text-secondary rounded-2xl rounded-tl-none px-5 py-3 flex items-center gap-2 text-sm italic">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Vently is listening...
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Input Area */}
          <div className="p-6 border-t border-border bg-card">
            <div className="relative flex items-center">
              <Input
                placeholder="Say anything… I’m here to listen"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="pr-14 h-14 rounded-2xl"
              />
              <Button
                size="sm"
                className="absolute right-2 h-10 w-10 p-0 rounded-xl"
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
