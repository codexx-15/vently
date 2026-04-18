"use client"

import * as React from "react"
import { useGlobalState } from "@/lib/store"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/sections/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Camera, User, Mail, Phone, MapPin, CheckCircle2 } from "lucide-react"

export default function ProfilePage() {
  const { user, setUser } = useGlobalState()
  const [formData, setFormData] = React.useState(user)
  const [isSaved, setIsSaved] = React.useState(false)

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-1 pt-32 pb-24 px-6">
        <div className="max-w-[800px] mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold text-text-primary mb-2">Your Profile</h1>
            <p className="text-text-secondary">Manage your personal information and safety settings.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Sidebar / Avatar */}
            <div className="md:col-span-1 space-y-6">
              <Card className="border-border bg-card/50 backdrop-blur-sm overflow-hidden">
                <CardContent className="pt-8 flex flex-col items-center">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-secondary group-hover:border-foreground transition-all">
                      <img src={formData.avatar} alt={formData.name} className="w-full h-full object-cover" />
                    </div>
                    <label className="absolute bottom-0 right-0 bg-foreground text-background p-2 rounded-full cursor-pointer shadow-lg hover:scale-110 transition-transform">
                      <Camera className="w-4 h-4" />
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                    </label>
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-text-primary">{user.name}</h3>
                  <p className="text-sm text-text-secondary">Member since 2024</p>
                </CardContent>
              </Card>
            </div>

            {/* Main Details */}
            <div className="md:col-span-2">
              <Card className="border-border bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Personal Details</CardTitle>
                  <CardDescription>Update your information. This is kept strictly private.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSave}>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                          <User className="w-3 h-3" /> Full Name
                        </label>
                        <Input 
                          value={formData.name} 
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                          <Mail className="w-3 h-3" /> Email Address
                        </label>
                        <Input 
                          type="email" 
                          value={formData.email} 
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                          <Phone className="w-3 h-3" /> Phone Number
                        </label>
                        <Input 
                          value={formData.phone} 
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                          <MapPin className="w-3 h-3" /> Address
                        </label>
                        <Input 
                          value={formData.address} 
                          onChange={(e) => setFormData({...formData, address: e.target.value})}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <p className="text-xs text-text-secondary italic">Your data is encrypted end-to-end.</p>
                    <div className="flex items-center gap-4">
                      {isSaved && (
                        <motion.span 
                          initial={{ opacity: 0, x: 10 }} 
                          animate={{ opacity: 1, x: 0 }} 
                          className="text-sm text-green-500 flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-4 h-4" /> Changes saved
                        </motion.span>
                      )}
                      <Button type="submit">Save Changes</Button>
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
