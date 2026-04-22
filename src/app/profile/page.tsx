"use client"

import * as React from "react"
import { useGlobalState } from "@/lib/store"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/sections/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Camera, User, Mail, Phone, MapPin, CheckCircle2, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

import { GlassBackground } from "@/components/ui/glass-background"

export default function ProfilePage() {
  const { user, setUser } = useGlobalState()
  const [formData, setFormData] = React.useState({
    ...user,
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    avatar: user?.avatar || ""
  })
  const [isSaved, setIsSaved] = React.useState(false)
  const [isUploading, setIsUploading] = React.useState(false)

  // Update formData if user state changes
  React.useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        ...user,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        address: user.address || prev.address,
        avatar: user.avatar || prev.avatar
      }))
    }
  }, [user])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
        localStorage.setItem('vently_user_email', updatedUser.email);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
      }
    } catch (error) {
      console.error('Error saving profile to MongoDB:', error);
    }
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const formDataUpload = new FormData()
    formDataUpload.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      })
      const data = await res.json()
      if (res.ok) {
        setFormData({ ...formData, avatar: data.secure_url })
      }
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden">
      <GlassBackground />
      <Navbar />
      
      <div className="flex-1 pt-32 pb-24 px-6 relative z-10">
        <div className="max-w-[900px] mx-auto space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center md:text-left"
          >
            <h1 className="text-5xl font-black tracking-tighter text-foreground mb-4">
              Your <span className="bg-gradient-to-r from-brand-pink to-brand-purple bg-clip-text text-transparent">Profile</span>
            </h1>
            <p className="text-xl text-text-secondary/80 font-medium">Manage your personal information and safety settings.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Sidebar / Avatar */}
            <div className="md:col-span-1">
              <Card className="bg-white/20 dark:bg-black/20 backdrop-blur-3xl border-white/40 dark:border-white/5 shadow-2xl rounded-[40px] overflow-hidden sticky top-32">
                <CardContent className="pt-12 pb-10 flex flex-col items-center">
                  <div className="relative group">
                    <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white/40 dark:border-white/10 bg-white/20 dark:bg-black/20 shadow-inner group-hover:border-brand-pink transition-all duration-500 flex items-center justify-center">
                      {isUploading ? (
                        <Loader2 className="w-10 h-10 animate-spin text-brand-pink" />
                      ) : (
                        <img src={formData.avatar} alt={formData.name} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <label className={cn(
                      "absolute bottom-1 right-1 bg-gradient-to-br from-brand-pink to-brand-purple text-white p-3 rounded-full cursor-pointer shadow-xl hover:scale-110 transition-transform",
                      isUploading && "opacity-50 cursor-not-allowed"
                    )}>
                      <Camera className="w-5 h-5" />
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} disabled={isUploading} />
                    </label>
                  </div>
                  <h3 className="mt-6 text-2xl font-black text-foreground">{user.name}</h3>
                  <div className="mt-2 px-4 py-1.5 rounded-full bg-brand-pink/10 border border-brand-pink/20 text-brand-pink text-xs font-bold uppercase tracking-widest">
                    Vently Member
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Details */}
            <div className="md:col-span-2">
              <Card className="bg-white/20 dark:bg-black/20 backdrop-blur-3xl border-white/40 dark:border-white/5 shadow-2xl rounded-[40px]">
                <CardHeader className="pb-8">
                  <CardTitle className="text-2xl font-bold">Personal Details</CardTitle>
                  <CardDescription className="text-text-secondary/70 font-medium">Update your information. This is kept strictly private.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSave}>
                  <CardContent className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-brand-pink/70 px-1">
                          Full Name
                        </label>
                        <Input 
                          value={formData.name} 
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="h-14 bg-white/30 dark:bg-black/30 border-white/40 dark:border-white/10 focus:border-brand-purple/50 rounded-2xl text-lg font-medium transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-brand-pink/70 px-1">
                          Email Address
                        </label>
                        <Input 
                          type="email" 
                          value={formData.email} 
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="h-14 bg-white/30 dark:bg-black/30 border-white/40 dark:border-white/10 focus:border-brand-purple/50 rounded-2xl text-lg font-medium transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-brand-pink/70 px-1">
                          Phone Number
                        </label>
                        <Input 
                          value={formData.phone} 
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="h-14 bg-white/30 dark:bg-black/30 border-white/40 dark:border-white/10 focus:border-brand-purple/50 rounded-2xl text-lg font-medium transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-brand-pink/70 px-1">
                          Address
                        </label>
                        <Input 
                          value={formData.address} 
                          onChange={(e) => setFormData({...formData, address: e.target.value})}
                          className="h-14 bg-white/30 dark:bg-black/30 border-white/40 dark:border-white/10 focus:border-brand-purple/50 rounded-2xl text-lg font-medium transition-all"
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col md:flex-row justify-between items-center gap-6 pt-10 pb-12">
                    <div className="flex items-center gap-2 text-text-secondary/50">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <p className="text-xs font-bold uppercase tracking-widest">End-to-End Encrypted</p>
                    </div>
                    <div className="flex items-center gap-6">
                      {isSaved && (
                        <motion.span 
                          initial={{ opacity: 0, x: 10 }} 
                          animate={{ opacity: 1, x: 0 }} 
                          className="text-sm font-bold text-green-500 flex items-center gap-2"
                        >
                          <CheckCircle2 className="w-5 h-5" /> Saved
                        </motion.span>
                      )}
                      <Button 
                        type="submit"
                        className="h-14 px-10 rounded-[20px] bg-gradient-to-r from-brand-pink to-brand-purple text-white font-bold text-lg hover:scale-105 transition-all shadow-xl shadow-brand-pink/20"
                      >
                        Save Changes
                      </Button>
                    </div>
                  </CardFooter>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
