"use client"

import * as React from "react"
import { useGlobalState } from "@/lib/store"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/sections/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { Image as ImageIcon, MessageSquare, Eye, EyeOff, Trash2, Plus, LayoutDashboard, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

export default function AdminPage() {
  const { settings, setSettings, feedbacks, setFeedbacks, isAdmin, refreshData } = useGlobalState()
  const [activeTab, setActiveTab] = React.useState<'images' | 'feedback' | 'overview'>('overview')

  if (!isAdmin) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md text-center p-8">
          <CardTitle className="text-red-500">Access Denied</CardTitle>
          <CardDescription className="mt-4">You do not have permission to access the admin panel.</CardDescription>
          <Button className="mt-6" onClick={() => window.location.href = '/'}>Go Home</Button>
        </Card>
      </main>
    )
  }

  const handleToggleVisibility = async (id: string) => {
    const feedback = feedbacks.find(f => f._id === id);
    if (!feedback) return;
    
    try {
      const res = await fetch('/api/admin/feedback', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isVisible: !feedback.isVisible }),
      });
      if (res.ok) refreshData();
    } catch (error) {
      console.error('Error toggling visibility:', error);
    }
  }

  const handleDeleteFeedback = async (id: string) => {
    try {
      const res = await fetch('/api/admin/feedback', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) refreshData();
    } catch (error) {
      console.error('Error deleting feedback:', error);
    }
  }

  const handleUpdateImage = async (type: 'hero' | 'emotional', index: number, value: string) => {
    let newSettings = { ...settings };
    if (type === 'hero') {
      newSettings.heroImages[index] = value;
    } else {
      newSettings.emotionalImages[index] = value;
    }
    
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });
      if (res.ok) refreshData();
    } catch (error) {
      console.error('Error updating images:', error);
    }
  }

  const handleAddImage = async (type: 'hero' | 'emotional') => {
    const placeholder = "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop"
    let newSettings = { ...settings };
    if (type === 'hero') {
      newSettings.heroImages.push(placeholder);
    } else {
      newSettings.emotionalImages.push(placeholder);
    }
    
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });
      if (res.ok) refreshData();
    } catch (error) {
      console.error('Error adding image:', error);
    }
  }

  const handleDeleteImage = async (type: 'hero' | 'emotional', index: number) => {
    let newSettings = { ...settings };
    if (type === 'hero') {
      newSettings.heroImages = newSettings.heroImages.filter((_, i) => i !== index);
    } else {
      newSettings.emotionalImages = newSettings.emotionalImages.filter((_, i) => i !== index);
    }
    
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });
      if (res.ok) refreshData();
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  }

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-1 pt-32 pb-24 px-6 max-w-[1200px] mx-auto w-full">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 space-y-2">
            <h2 className="text-xs font-bold text-text-secondary uppercase tracking-widest px-4 mb-4">Admin Console</h2>
            <button 
              onClick={() => setActiveTab('overview')}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                activeTab === 'overview' ? "bg-foreground text-background" : "hover:bg-secondary text-text-primary"
              )}
            >
              <LayoutDashboard className="w-4 h-4" /> Overview
            </button>
            <button 
              onClick={() => setActiveTab('images')}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                activeTab === 'images' ? "bg-foreground text-background" : "hover:bg-secondary text-text-primary"
              )}
            >
              <ImageIcon className="w-4 h-4" /> Site Images
            </button>
            <button 
              onClick={() => setActiveTab('feedback')}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                activeTab === 'feedback' ? "bg-foreground text-background" : "hover:bg-secondary text-text-primary"
              )}
            >
              <MessageSquare className="w-4 h-4" /> User Feedback
            </button>
          </aside>

          {/* Content Area */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div 
                  key="overview"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                  <Card className="bg-card/50 border-border">
                    <CardHeader>
                      <CardDescription>Total Feedback</CardDescription>
                      <CardTitle className="text-4xl">{feedbacks.length}</CardTitle>
                    </CardHeader>
                  </Card>
                  <Card className="bg-card/50 border-border">
                    <CardHeader>
                      <CardDescription>Visible Testimonials</CardDescription>
                      <CardTitle className="text-4xl">{feedbacks.filter(f => f.isVisible).length}</CardTitle>
                    </CardHeader>
                  </Card>
                  <Card className="bg-card/50 border-border">
                    <CardHeader>
                      <CardDescription>System Status</CardDescription>
                      <CardTitle className="text-4xl text-green-500">Healthy</CardTitle>
                    </CardHeader>
                  </Card>
                </motion.div>
              )}

              {activeTab === 'images' && (
                <motion.div 
                  key="images"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-8"
                >
                  <Card className="bg-card/50 border-border">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                      <div>
                        <CardTitle>Hero Section Images</CardTitle>
                        <CardDescription>Manage the background images on the landing page.</CardDescription>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleAddImage('hero')}>
                        <Plus className="w-4 h-4 mr-1" /> Add
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {settings.heroImages.map((img, i) => (
                        <div key={i} className="flex gap-4 items-center">
                          <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-secondary">
                            <img src={img} className="w-full h-full object-cover grayscale" alt="Hero Preview" />
                          </div>
                          <Input 
                            value={img} 
                            onChange={(e) => handleUpdateImage('hero', i, e.target.value)}
                            placeholder="Image URL"
                          />
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-500 hover:bg-red-500/10"
                            onClick={() => handleDeleteImage('hero', i)}
                            disabled={settings.heroImages.length <= 1}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="bg-card/50 border-border">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                      <div>
                        <CardTitle>Emotional Slider Images</CardTitle>
                        <CardDescription>Manage the images that rotate in the emotional AI section.</CardDescription>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleAddImage('emotional')}>
                        <Plus className="w-4 h-4 mr-1" /> Add
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {settings.emotionalImages.map((img, i) => (
                        <div key={i} className="flex gap-4 items-center">
                          <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-secondary">
                            <img src={img} className="w-full h-full object-cover grayscale" alt="Slider Preview" />
                          </div>
                          <Input 
                            value={img} 
                            onChange={(e) => handleUpdateImage('emotional', i, e.target.value)}
                            placeholder="Image URL"
                          />
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-500 hover:bg-red-500/10"
                            onClick={() => handleDeleteImage('emotional', i)}
                            disabled={settings.emotionalImages.length <= 1}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {activeTab === 'feedback' && (
                <motion.div 
                  key="feedback"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-4"
                >
                  {feedbacks.map((f) => (
                    <Card key={f._id} className={cn("bg-card/50 border-border transition-all", !f.isVisible && "opacity-60 grayscale")}>
                      <CardContent className="pt-6 flex items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-secondary">
                            <img src={f.userAvatar} className="w-full h-full object-cover" alt={f.userName} />
                          </div>
                          <div>
                            <p className="font-bold text-text-primary">{f.userName}</p>
                            <p className="text-sm text-text-secondary line-clamp-1">{f.content}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleToggleVisibility(f._id)}
                            title={f.isVisible ? "Hide from website" : "Show on website"}
                          >
                            {f.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-red-500" />}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-500 hover:bg-red-500/10"
                            onClick={() => handleDeleteFeedback(f._id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Button variant="outline" className="w-full border-dashed py-8 rounded-2xl flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Add Manual Testimonial
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
