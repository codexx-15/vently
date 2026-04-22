"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/sections/footer"
import { GlassBackground } from "@/components/ui/glass-background"
import { 
  Heart as Yoga, 
  Brain, 
  Utensils, 
  Scale, 
  Moon, 
  Droplets, 
  Accessibility,
  ChevronLeft,
  Play,
  X,
  Search,
  ExternalLink
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

// Types
type Category = 'main' | 'yoga' | 'meditation' | 'nutrition' | 'bmi' | 'sleep' | 'hydration' | 'posture'

const CATEGORIES = [
  { id: 'yoga', title: 'Yoga', icon: <Yoga size={32} />, color: 'from-pink-400 to-rose-400', emoji: '🧘' },
  { id: 'meditation', title: 'Meditation', icon: <Brain size={32} />, color: 'from-purple-400 to-indigo-400', emoji: '🧠' },
  { id: 'nutrition', title: 'Nutrition', icon: <Utensils size={32} />, color: 'from-green-400 to-emerald-400', emoji: '🥗' },
  { id: 'bmi', title: 'Health Check', icon: <Scale size={32} />, color: 'from-blue-400 to-cyan-400', emoji: '⚖️' },
  { id: 'sleep', title: 'Sleep Care', icon: <Moon size={32} />, color: 'from-indigo-400 to-blue-500', emoji: '😴' },
  { id: 'hydration', title: 'Hydration', icon: <Droplets size={32} />, color: 'from-blue-300 to-blue-500', emoji: '💧' },
  { id: 'posture', title: 'Posture', icon: <Accessibility size={32} />, color: 'from-orange-400 to-amber-400', emoji: '🧍' },
]

export default function HealingSpacePage() {
  const [activeCategory, setActiveCategory] = useState<Category>('main')
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return (
    <main className="min-h-screen flex flex-col relative overflow-hidden">
      <GlassBackground />
      <Navbar />
      <div className="flex-1 pt-32 pb-24 px-6 relative z-10" />
      <Footer />
    </main>
  )

  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden">
      <GlassBackground />
      <Navbar />
      
      <div className="flex-1 pt-32 pb-24 px-6 relative z-10">
        <div className="max-w-[1200px] mx-auto">
          <AnimatePresence mode="wait">
            {activeCategory === 'main' ? (
              <motion.div
                key="main"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                <div className="text-center space-y-4">
                  <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground">
                    Healing <span className="bg-gradient-to-r from-brand-pink to-brand-purple bg-clip-text text-transparent">Space</span>
                  </h1>
                  <p className="text-xl md:text-2xl text-text-secondary/80 font-medium max-w-[600px] mx-auto">
                    Take a moment for yourself. What do you need today?
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {CATEGORIES.map((cat, idx) => (
                    <motion.div
                      key={cat.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveCategory(cat.id as Category)}
                      className="cursor-pointer"
                    >
                      <Card className="h-full bg-white/20 dark:bg-black/20 backdrop-blur-3xl border-white/40 dark:border-white/5 shadow-xl rounded-[32px] overflow-hidden group">
                        <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform`}>
                            {cat.icon}
                          </div>
                          <h3 className="text-xl font-bold text-foreground">{cat.title} {cat.emoji}</h3>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="sub"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <Button 
                  variant="ghost" 
                  onClick={() => setActiveCategory('main')}
                  className="rounded-full hover:bg-white/20"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" /> Back to Space
                </Button>
                
                {activeCategory === 'yoga' && <YogaSection />}
                {activeCategory === 'meditation' && <MeditationSection />}
                {activeCategory === 'nutrition' && <NutritionSection />}
                {activeCategory === 'bmi' && <BMISection />}
                {activeCategory === 'sleep' && <SleepSection />}
                {activeCategory === 'hydration' && <HydrationSection />}
                {activeCategory === 'posture' && <PostureSection />}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <Footer />
    </main>
  )
}

// --- Sub-components for each section ---

function YogaSection() {
  const [video, setVideo] = useState<string | null>(null)
  const [asanas, setAsanas] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("All")

  React.useEffect(() => {
    fetch('/api/yoga').then(res => res.json()).then(setAsanas)
  }, [])

  const filteredAsanas = asanas.filter(a => {
    const name = a.name || ""
    const matchesSearch = name.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === "All" || (Array.isArray(a.bodyParts) && a.bodyParts.includes(filter))
    return matchesSearch && matchesFilter
  })

  const bodyParts = ["All", ...Array.from(new Set(asanas.flatMap(a => Array.isArray(a.bodyParts) ? a.bodyParts : [])))]

  return (
    <div className="space-y-10">
      <SectionHeader title="Yoga 🧘" description="Explore 100+ asanas to strengthen your body and mind." />
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary w-5 h-5" />
          <Input 
            placeholder="Search asanas (e.g. Stress relief, Tadasana...)" 
            className="pl-12 h-14 rounded-2xl bg-white/10"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {bodyParts.map(p => (
            <Button
              key={p}
              variant={filter === p ? "primary" : "outline"}
              size="sm"
              onClick={() => setFilter(p)}
              className="rounded-full whitespace-nowrap"
            >
              {p}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredAsanas.map((a) => (
          <motion.div
            key={a._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="glass-card overflow-hidden group h-full flex flex-col rounded-[32px]">
              <div className="aspect-[4/3] relative overflow-hidden bg-secondary">
                {Array.isArray(a.images) && a.images.length > 0 && a.images[0] ? (
                  <img 
                    src={a.images[0]} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    alt={a.name} 
                  />
                ) : a.image ? (
                   <img 
                    src={a.image} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    alt={a.name} 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center opacity-20">
                    <Yoga size={48} />
                  </div>
                )}
                {Array.isArray(a.images) && a.images.length > 1 && (
                  <div className="absolute top-4 left-4 px-2 py-1 rounded-full bg-black/40 backdrop-blur-md text-[10px] text-white font-bold">
                    +{a.images.length - 1} photos
                  </div>
                )}
              </div>
              <CardContent className="p-6 space-y-4 flex-1 flex flex-col">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black text-foreground">{a.name}</h3>
                  {a.youtubeLink && (
                    <a href={a.youtubeLink} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-brand-pink/10 text-brand-pink hover:bg-brand-pink hover:text-white transition-all">
                      <ExternalLink size={18} />
                    </a>
                  )}
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-brand-purple/70">Benefits</p>
                  <ul className="text-sm text-text-secondary space-y-1">
                    {Array.isArray(a.benefits) && a.benefits.map((b: string, i: number) => (
                      <li key={i} className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-brand-pink" /> {b}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto pt-4 flex flex-wrap gap-2">
                  {Array.isArray(a.bodyParts) && a.bodyParts.map((p: string, i: number) => (
                    <span key={i} className="text-[10px] px-3 py-1 rounded-full bg-brand-purple/10 text-brand-purple font-bold uppercase tracking-wider">
                      {p}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredAsanas.length === 0 && (
        <div className="text-center py-20 bg-white/5 rounded-[40px] border border-dashed border-white/20">
          <p className="text-xl text-text-secondary font-medium">No asanas found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}

function MeditationSection() {
  const [video, setVideo] = useState<string | null>(null)
  const [meditations, setMeditations] = useState<any[]>([])
  const [activeMood, setActiveTab] = useState("Anxiety")

  React.useEffect(() => {
    fetch('/api/meditation').then(res => res.json()).then(setMeditations)
  }, [])

  const filtered = meditations.filter(m => m.mood === activeMood)
  const moods = ["Anxiety", "Sadness", "Overthinking", "Sleep", "Energy"]

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }

  return (
    <div className="space-y-10">
      <SectionHeader title="Meditation 🧠" description="Silence the noise and find your center." />
      
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {moods.map(mood => (
          <Button
            key={mood}
            variant={activeMood === mood ? "primary" : "outline"}
            size="sm"
            onClick={() => setActiveTab(mood)}
            className="rounded-full whitespace-nowrap"
          >
            {mood}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map(m => (
          <motion.div
            key={m._id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -5 }}
          >
            <Card 
              className="glass-card overflow-hidden group h-full flex flex-col rounded-[32px] cursor-pointer" 
              onClick={() => setVideo(getYoutubeId(m.youtubeLink))}
            >
              <div className="aspect-video relative overflow-hidden bg-secondary">
                {Array.isArray(m.images) && m.images.length > 0 && m.images[0] ? (
                  <img 
                    src={m.images[0]} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    alt={m.title} 
                  />
                ) : m.image ? (
                   <img 
                    src={m.image} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    alt={m.title} 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center opacity-20">
                    <Brain size={48} />
                  </div>
                )}
                {Array.isArray(m.images) && m.images.length > 1 && (
                  <div className="absolute top-4 left-4 px-2 py-1 rounded-full bg-black/40 backdrop-blur-md text-[10px] text-white font-bold">
                    +{m.images.length - 1} photos
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/40">
                    <Play fill="currentColor" size={24} />
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest">
                  {m.duration}
                </div>
              </div>
              <CardContent className="p-6 space-y-3">
                <h3 className="text-xl font-black text-foreground group-hover:text-brand-pink transition-colors">{m.title}</h3>
                <p className="text-sm text-text-secondary line-clamp-2">{m.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 bg-white/5 rounded-[40px] border border-dashed border-white/20">
          <p className="text-xl text-text-secondary font-medium">No sessions found for {activeMood}.</p>
          <p className="text-sm text-text-secondary/60 mt-2">Try another mood or check back later!</p>
        </div>
      )}

      <Card className="glass-card p-8 rounded-[32px]">
        <h3 className="text-2xl font-bold mb-4">Quick Breathing</h3>
        <div className="flex justify-center py-10">
          <motion.div 
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-32 h-32 rounded-full bg-gradient-to-r from-brand-blue to-brand-purple blur-xl"
          />
        </div>
        <p className="text-center font-bold italic">Breathe in... Breathe out...</p>
      </Card>

      <VideoModal id={video} onClose={() => setVideo(null)} />
    </div>
  )
}

function NutritionSection() {
  return (
    <div className="space-y-10">
      <SectionHeader title="Nutrition 🥗" description="Fuel your body and mind with the right food." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="glass-card p-8 rounded-[32px]">
          <h3 className="text-2xl font-bold mb-6">Mood-Based Food</h3>
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-orange-400/10 border border-orange-400/20">
              <p className="font-bold text-orange-600 dark:text-orange-400">⚡ Energy</p>
              <p className="text-sm">Oats, Bananas, Nuts, Green Tea</p>
            </div>
            <div className="p-4 rounded-2xl bg-blue-400/10 border border-blue-400/20">
              <p className="font-bold text-blue-600 dark:text-blue-400">😌 Stress Relief</p>
              <p className="text-sm">Dark Chocolate, Berries, Fatty Fish, Spinach</p>
            </div>
          </div>
        </Card>
        <Card className="glass-card p-8 rounded-[32px]">
          <h3 className="text-2xl font-bold mb-6">Quick Healthy Snacks</h3>
          <ul className="space-y-3 list-disc list-inside text-text-secondary">
            <li>Greek yogurt with honey</li>
            <li>Apple slices with peanut butter</li>
            <li>Hummus and carrot sticks</li>
            <li>A handful of almonds</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}

function BMISection() {
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [bmi, setBmi] = useState<number | null>(null)

  const calculate = () => {
    const h = parseFloat(height) / 100
    const w = parseFloat(weight)
    if (h > 0 && w > 0) {
      setBmi(parseFloat((w / (h * h)).toFixed(1)))
    }
  }

  const getCategory = (v: number) => {
    if (v < 18.5) return { label: 'Underweight', color: 'text-blue-400' }
    if (v < 25) return { label: 'Normal', color: 'text-green-400' }
    if (v < 30) return { label: 'Overweight', color: 'text-orange-400' }
    return { label: 'Obese', color: 'text-red-400' }
  }

  return (
    <div className="space-y-10">
      <SectionHeader title="BMI & Health Check ⚖️" description="Track your health metrics simply." />
      <Card className="glass-card p-10 rounded-[32px] max-w-[500px] mx-auto">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-widest text-brand-pink/70">Height (cm)</label>
            <Input type="number" value={height} onChange={e => setHeight(e.target.value)} className="h-14 rounded-2xl bg-white/10" placeholder="e.g. 170" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-widest text-brand-pink/70">Weight (kg)</label>
            <Input type="number" value={weight} onChange={e => setWeight(e.target.value)} className="h-14 rounded-2xl bg-white/10" placeholder="e.g. 70" />
          </div>
          <Button onClick={calculate} className="w-full h-14 rounded-2xl bg-gradient-to-r from-brand-pink to-brand-purple font-bold">Calculate BMI</Button>
          
          {bmi && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center pt-6">
              <p className="text-sm font-bold uppercase tracking-widest text-text-secondary">Your BMI</p>
              <p className="text-6xl font-black my-2">{bmi}</p>
              <p className={`text-xl font-bold ${getCategory(bmi).color}`}>{getCategory(bmi).label}</p>
            </motion.div>
          )}
        </div>
      </Card>
    </div>
  )
}

function SleepSection() {
  return (
    <div className="space-y-10">
      <SectionHeader title="Sleep Care 😴" description="Rest better for a clearer tomorrow." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="glass-card p-8 rounded-[32px]">
          <h3 className="text-2xl font-bold mb-4">Night Routine</h3>
          <ul className="space-y-4">
            <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-brand-pink" /> No screens 30 min before bed</li>
            <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-brand-pink" /> Read a physical book</li>
            <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-brand-pink" /> Dim the lights</li>
          </ul>
        </Card>
        <Card className="glass-card p-8 rounded-[32px] bg-indigo-900/20">
          <h3 className="text-2xl font-bold mb-4">Calm Sounds</h3>
          <div className="grid grid-cols-2 gap-4">
            {['Rainfall', 'Ocean', 'Forest', 'White Noise'].map(s => (
              <Button key={s} variant="outline" className="rounded-2xl border-white/20 hover:bg-white/10">{s}</Button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

function HydrationSection() {
  const [glasses, setGlasses] = useState(0)
  return (
    <div className="space-y-10">
      <SectionHeader title="Hydration 💧" description="Keep your body flowing and energized." />
      <Card className="glass-card p-10 rounded-[32px] text-center max-w-[500px] mx-auto">
        <h3 className="text-2xl font-bold mb-6">Daily Progress</h3>
        <div className="relative inline-block mb-8">
          <div className="w-40 h-40 rounded-full border-8 border-blue-400/20 flex items-center justify-center">
             <div className="text-4xl font-black text-blue-500">{glasses} / 8</div>
          </div>
          <motion.div 
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 border-8 border-blue-400 rounded-full border-t-transparent"
            style={{ rotate: `${(glasses / 8) * 360}deg` }}
          />
        </div>
        <div className="flex justify-center gap-4">
          <Button onClick={() => setGlasses(Math.max(0, glasses - 1))} variant="outline" className="w-14 h-14 rounded-full">-</Button>
          <Button onClick={() => setGlasses(Math.min(12, glasses + 1))} className="w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600">+</Button>
        </div>
        <p className="mt-6 text-sm text-text-secondary font-medium">Drinking water improves focus, skin health, and energy levels.</p>
      </Card>
    </div>
  )
}

function PostureSection() {
  return (
    <div className="space-y-10">
      <SectionHeader title="Posture & Stretch 🧍" description="Stand tall, feel strong." />
      <Card className="glass-card p-8 rounded-[32px]">
        <h3 className="text-2xl font-bold mb-6">Quick Desk Stretches</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { t: 'Neck Roll', d: 'Gently roll neck side to side' },
            { t: 'Shoulder Shrug', d: 'Lift shoulders to ears and drop' },
            { t: 'Seated Twist', d: 'Twist torso while sitting' },
            { t: 'Wrist Stretch', d: 'Extend arm, pull fingers back' }
          ].map(s => (
            <div key={s.t} className="p-6 rounded-2xl bg-white/10 border border-white/20">
              <p className="font-bold mb-1">{s.t}</p>
              <p className="text-sm text-text-secondary">{s.d}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// --- Helpers ---

function SectionHeader({ title, description }: { title: string, description: string }) {
  return (
    <div className="space-y-2">
      <h2 className="text-4xl font-black text-foreground tracking-tight">{title}</h2>
      <p className="text-lg text-text-secondary font-medium">{description}</p>
    </div>
  )
}

function VideoModal({ id, onClose }: { id: string | null, onClose: () => void }) {
  if (!id) return null
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-[900px] aspect-video bg-black rounded-[32px] overflow-hidden shadow-2xl z-10"
      >
        <button onClick={onClose} className="absolute top-4 right-4 z-20 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white transition-colors">
          <X size={24} />
        </button>
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${id}?autoplay=1`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </motion.div>
    </div>
  )
}
