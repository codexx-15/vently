"use client"

import * as React from "react"
import { useGlobalState } from "@/lib/store"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/sections/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { Image as ImageIcon, MessageSquare, Eye, EyeOff, Trash2, Plus, LayoutDashboard, Settings, Heart as YogaIcon, ExternalLink, Brain as MeditationIcon, Upload, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export default function AdminPage() {
  const { settings, setSettings, feedbacks, setFeedbacks, isAdmin, refreshData } = useGlobalState()
  const [activeTab, setActiveTab] = React.useState<'images' | 'feedback' | 'overview' | 'yoga' | 'meditation' | 'general'>('overview')
  const [asanas, setAsanas] = React.useState<any[]>([])
  const [meditations, setMeditations] = React.useState<any[]>([])
  const [isUploading, setIsUploading] = React.useState(false)
  const [editingItem, setEditingItem] = React.useState<any | null>(null)
  
  const [newAsana, setNewAsana] = React.useState({
    name: "",
    images: [] as string[],
    benefits: "",
    bodyParts: "",
    youtubeLink: ""
  })

  const [newMeditation, setNewMeditation] = React.useState({
    title: "",
    images: [] as string[],
    mood: "Anxiety",
    duration: "",
    youtubeLink: "",
    description: ""
  })

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'yoga' | 'meditation' | 'hero' | 'emotional' | 'yoga-video' | 'meditation-video' | 'logo' | 'hero-video', index?: number) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (res.ok) {
        if (type === 'yoga') {
          if (editingItem) {
            const currentImages = Array.isArray(editingItem.images) ? editingItem.images : [];
            setEditingItem({ ...editingItem, images: [...currentImages, data.secure_url] });
          } else {
            setNewAsana({ ...newAsana, images: [...newAsana.images, data.secure_url] });
          }
        }
        else if (type === 'yoga-video') {
          if (editingItem) setEditingItem({ ...editingItem, youtubeLink: data.secure_url })
          else setNewAsana({ ...newAsana, youtubeLink: data.secure_url })
        }
        else if (type === 'meditation') {
          if (editingItem) {
            const currentImages = Array.isArray(editingItem.images) ? editingItem.images : [];
            setEditingItem({ ...editingItem, images: [...currentImages, data.secure_url] });
          } else {
            setNewMeditation({ ...newMeditation, images: [...newMeditation.images, data.secure_url] });
          }
        }
        else if (type === 'meditation-video') {
          if (editingItem) setEditingItem({ ...editingItem, youtubeLink: data.secure_url })
          else setNewMeditation({ ...newMeditation, youtubeLink: data.secure_url })
        }
        else if (type === 'hero' && typeof index === 'number') handleUpdateImage('hero', index, data.secure_url)
        else if (type === 'hero-video' && typeof index === 'number') handleUpdateVideo('hero', index, data.secure_url)
        else if (type === 'emotional' && typeof index === 'number') handleUpdateImage('emotional', index, data.secure_url)
        else if (type === 'logo') handleGeneralSettingUpdate('logo', data.secure_url)
      }
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleGeneralSettingUpdate = async (field: string, value: any) => {
    const newSettings = { ...settings, [field]: value };
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });
      if (res.ok) refreshData();
    } catch (error) {
      console.error('Error updating general settings:', error);
    }
  }

  const handleSocialLinkUpdate = async (platform: string, value: string) => {
     const newSettings = { 
       ...settings, 
       socialLinks: { ...(settings?.socialLinks || {}), [platform]: value } 
     };
     try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });
      if (res.ok) refreshData();
    } catch (error) {
      console.error('Error updating social links:', error);
    }
  }

  const handleUpdateVideo = async (type: 'hero', index: number, value: string) => {
    let newSettings = { ...settings };
    if (type === 'hero') {
      newSettings.heroVideos[index] = value;
    }
    
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });
      if (res.ok) refreshData();
    } catch (error) {
      console.error('Error updating videos:', error);
    }
  }

  const handleAddVideo = async (type: 'hero') => {
    const placeholder = ""
    let newSettings = { ...settings };
    if (type === 'hero') {
      newSettings.heroVideos.push(placeholder);
    }
    
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });
      if (res.ok) refreshData();
    } catch (error) {
      console.error('Error adding video:', error);
    }
  }

  const handleDeleteVideo = async (type: 'hero', index: number) => {
    let newSettings = { ...settings };
    if (type === 'hero') {
      newSettings.heroVideos = newSettings.heroVideos.filter((_, i) => i !== index);
    }
    
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });
      if (res.ok) refreshData();
    } catch (error) {
      console.error('Error deleting video:', error);
    }
  }

  React.useEffect(() => {
    if (activeTab === 'yoga') {
      fetchAsanas()
    } else if (activeTab === 'meditation') {
      fetchMeditations()
    }
  }, [activeTab])

  const fetchAsanas = async () => {
    const res = await fetch('/api/yoga')
    if (res.ok) {
      const data = await res.json()
      setAsanas(data)
    }
  }

  const fetchMeditations = async () => {
    const res = await fetch('/api/meditation')
    if (res.ok) {
      const data = await res.json()
      setMeditations(data)
    }
  }

  const handleAddAsana = async (e: React.FormEvent) => {
    e.preventDefault()
    const target = editingItem || newAsana
    const payload = {
      ...target,
      benefits: typeof target.benefits === 'string' ? target.benefits.split(',').map((b: string) => b.trim()).filter((b: string) => b) : target.benefits,
      bodyParts: typeof target.bodyParts === 'string' ? target.bodyParts.split(',').map((b: string) => b.trim()).filter((b: string) => b) : target.bodyParts,
      images: Array.isArray(target.images) ? target.images : [target.images].filter(Boolean)
    }
    
    try {
      const res = await fetch('/api/admin/yoga', {
        method: editingItem ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem ? { id: editingItem._id, ...payload } : payload),
      })
      if (res.ok) {
        setNewAsana({ name: "", images: [], benefits: "", bodyParts: "", youtubeLink: "" })
        setEditingItem(null)
        fetchAsanas()
      }
    } catch (error) {
      console.error('Error adding/updating asana:', error)
    }
  }

  const handleDeleteAsana = async (id: string) => {
    try {
      const res = await fetch('/api/admin/yoga', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (res.ok) fetchAsanas()
    } catch (error) {
      console.error('Error deleting asana:', error)
    }
  }

  const handleAddMeditation = async (e: React.FormEvent) => {
    e.preventDefault()
    const target = editingItem || newMeditation
    const payload = {
      ...target,
      images: Array.isArray(target.images) ? target.images : [target.images].filter(Boolean)
    }
    try {
      const res = await fetch('/api/admin/meditation', {
        method: editingItem ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem ? { id: editingItem._id, ...payload } : payload),
      })
      if (res.ok) {
        setNewMeditation({ title: "", images: [], mood: "Anxiety", duration: "", youtubeLink: "", description: "" })
        setEditingItem(null)
        fetchMeditations()
      }
    } catch (error) {
      console.error('Error adding/updating meditation:', error)
    }
  }

  const handleDeleteMeditation = async (id: string) => {
    try {
      const res = await fetch('/api/admin/meditation', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (res.ok) fetchMeditations()
    } catch (error) {
      console.error('Error deleting meditation:', error)
    }
  }

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
              onClick={() => setActiveTab('general')}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                activeTab === 'general' ? "bg-foreground text-background" : "hover:bg-secondary text-text-primary"
              )}
            >
              <Settings className="w-4 h-4" /> Header & Footer
            </button>
            <button 
              onClick={() => setActiveTab('images')}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                activeTab === 'images' ? "bg-foreground text-background" : "hover:bg-secondary text-text-primary"
              )}
            >
              <ImageIcon className="w-4 h-4" /> Hero & Sections
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
            <button 
              onClick={() => setActiveTab('yoga')}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                activeTab === 'yoga' ? "bg-foreground text-background" : "hover:bg-secondary text-text-primary"
              )}
            >
              <YogaIcon className="w-4 h-4" /> Yoga Asanas
            </button>
            <button 
              onClick={() => setActiveTab('meditation')}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                activeTab === 'meditation' ? "bg-foreground text-background" : "hover:bg-secondary text-text-primary"
              )}
            >
              <MeditationIcon className="w-4 h-4" /> Meditation
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

              {activeTab === 'general' && (
                <motion.div 
                  key="general"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-8"
                >
                  <Card className="bg-card/50 border-border">
                    <CardHeader>
                      <CardTitle>Header & Brand Settings</CardTitle>
                      <CardDescription>Manage your website's header elements and main brand identity.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-text-secondary">Site Name</label>
                        <Input 
                          value={settings.siteName} 
                          onChange={(e) => handleGeneralSettingUpdate('siteName', e.target.value)}
                          placeholder="e.g. Vently"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-text-secondary">Logo (Header/Footer)</label>
                        <div className="flex gap-4 items-center">
                          <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center overflow-hidden">
                            {settings.logo ? <img src={settings.logo} className="w-full h-full object-contain" alt="Logo" /> : <Plus className="w-6 h-6 opacity-20" />}
                          </div>
                          <div className="flex-1 flex gap-2">
                            <div className="flex-1 px-3 py-2 rounded-md border border-input bg-background text-sm text-text-secondary italic">
                              {settings.logo ? settings.logo.split('/').pop() : "No file uploaded"}
                            </div>
                            <label className="cursor-pointer bg-secondary hover:bg-secondary/80 p-2 rounded-lg transition-colors flex items-center justify-center min-w-[40px]">
                              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                              <input type="file" className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'logo')} disabled={isUploading} />
                            </label>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/50 border-border">
                    <CardHeader>
                      <CardTitle>Footer Settings</CardTitle>
                      <CardDescription>Manage information displayed at the bottom of every page.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-text-secondary">Footer Description</label>
                        <Input 
                          value={settings.footerText} 
                          onChange={(e) => handleGeneralSettingUpdate('footerText', e.target.value)}
                          placeholder="Footer text..."
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-widest text-text-secondary">Instagram</label>
                          <Input 
                            value={settings?.socialLinks?.instagram || ""} 
                            onChange={(e) => handleSocialLinkUpdate('instagram', e.target.value)}
                            placeholder="URL"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-widest text-text-secondary">Twitter</label>
                          <Input 
                            value={settings?.socialLinks?.twitter || ""} 
                            onChange={(e) => handleSocialLinkUpdate('twitter', e.target.value)}
                            placeholder="URL"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-widest text-text-secondary">LinkedIn</label>
                          <Input 
                            value={settings?.socialLinks?.linkedin || ""} 
                            onChange={(e) => handleSocialLinkUpdate('linkedin', e.target.value)}
                            placeholder="URL"
                          />
                        </div>
                      </div>
                    </CardContent>
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
                        <CardTitle>Hero Section Videos</CardTitle>
                        <CardDescription>Manage background videos on the landing page.</CardDescription>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleAddVideo('hero')}>
                        <Plus className="w-4 h-4 mr-1" /> Add
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {settings.heroVideos.map((video, i) => (
                        <div key={i} className="flex gap-4 items-center">
                          <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-secondary flex items-center justify-center">
                            {video ? <video src={video} className="w-full h-full object-cover" /> : <Loader2 className="w-4 h-4 opacity-20" />}
                          </div>
                          <div className="flex-1 flex gap-2">
                            <div className="flex-1 px-3 py-2 rounded-md border border-input bg-background text-sm text-text-secondary italic overflow-hidden text-ellipsis whitespace-nowrap">
                              {video ? video.split('/').pop() : "No video uploaded"}
                            </div>
                            <label className="cursor-pointer bg-secondary hover:bg-secondary/80 p-2 rounded-lg transition-colors flex items-center justify-center min-w-[40px]">
                              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                              <input type="file" className="hidden" accept="video/*" onChange={e => handleFileUpload(e, 'hero-video', i)} disabled={isUploading} />
                            </label>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-500 hover:bg-red-500/10"
                            onClick={() => handleDeleteVideo('hero', i)}
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
                                {img ? (
                                  <img src={img} className="w-full h-full object-cover grayscale" alt="Hero Preview" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center opacity-20">
                                    <ImageIcon className="w-6 h-6" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 flex gap-2">
                                <div className="flex-1 px-3 py-2 rounded-md border border-input bg-background text-sm text-text-secondary italic overflow-hidden text-ellipsis whitespace-nowrap">
                                  {img ? img.split('/').pop() : "No image uploaded"}
                                </div>
                            <label className="cursor-pointer bg-secondary hover:bg-secondary/80 p-2 rounded-lg transition-colors flex items-center justify-center min-w-[40px]">
                              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                              <input type="file" className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'hero', i)} disabled={isUploading} />
                            </label>
                          </div>
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
                            {img ? (
                              <img src={img} className="w-full h-full object-cover grayscale" alt="Slider Preview" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center opacity-20">
                                <ImageIcon className="w-6 h-6" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 flex gap-2">
                            <div className="flex-1 px-3 py-2 rounded-md border border-input bg-background text-sm text-text-secondary italic overflow-hidden text-ellipsis whitespace-nowrap">
                              {img ? img.split('/').pop() : "No image uploaded"}
                            </div>
                            <label className="cursor-pointer bg-secondary hover:bg-secondary/80 p-2 rounded-lg transition-colors flex items-center justify-center min-w-[40px]">
                              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                              <input type="file" className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'emotional', i)} disabled={isUploading} />
                            </label>
                          </div>
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

              {activeTab === 'yoga' && (
                <motion.div 
                  key="yoga"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-8"
                >
                  <Card className="bg-card/50 border-border">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>{editingItem ? 'Edit Asana' : 'Add New Asana'}</CardTitle>
                        <CardDescription>{editingItem ? 'Update existing yoga posture' : 'Add a new yoga posture to the Healing Space.'}</CardDescription>
                      </div>
                      {editingItem && (
                        <Button variant="ghost" size="sm" onClick={() => {
                          setEditingItem(null)
                          setNewAsana({ name: "", images: [], benefits: "", howItHelps: "", bodyParts: "", youtubeLink: "" })
                        }}>
                          Cancel Edit
                        </Button>
                      )}
                    </CardHeader>
                    <form onSubmit={handleAddAsana}>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input 
                            placeholder="Asana Name (e.g. Tadasana)" 
                            value={editingItem ? editingItem.name : newAsana.name}
                            onChange={e => editingItem ? setEditingItem({...editingItem, name: e.target.value}) : setNewAsana({...newAsana, name: e.target.value})}
                            required
                          />
                          <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-text-secondary">Images</label>
                            <div className="space-y-2">
                              {(editingItem ? (editingItem.images || []) : newAsana.images).map((img: string, idx: number) => (
                                <div key={idx} className="flex gap-2 items-center">
                                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-secondary">
                                    {img ? (
                                      <img src={img} className="w-full h-full object-cover" alt={`Yoga ${idx}`} />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center opacity-20">
                                        <ImageIcon className="w-4 h-4" />
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-1 px-3 py-2 rounded-md border border-input bg-background text-sm text-text-secondary italic overflow-hidden text-ellipsis whitespace-nowrap">
                                    {img ? img.split('/').pop() : "No image uploaded"}
                                  </div>
                                  <Button 
                                    type="button"
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-red-500 hover:bg-red-500/10"
                                    onClick={() => {
                                      const newImages = (editingItem ? editingItem.images : newAsana.images).filter((_: any, i: number) => i !== idx)
                                      editingItem ? setEditingItem({...editingItem, images: newImages}) : setNewAsana({...newAsana, images: newImages})
                                    }}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              ))}
                              <div className="flex gap-2">
                                <div className="flex-1 px-3 py-2 rounded-md border border-dashed border-input bg-background/50 text-xs text-text-secondary flex items-center justify-center italic">
                                  Click upload to add new image
                                </div>
                                <label className="cursor-pointer bg-secondary hover:bg-secondary/80 p-2 rounded-lg transition-colors flex items-center justify-center min-w-[40px]">
                                  {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                  <input type="file" className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'yoga')} disabled={isUploading} />
                                </label>
                              </div>
                            </div>
                          </div>
                          <Input 
                            placeholder="Benefits (comma separated)" 
                            value={editingItem ? (Array.isArray(editingItem.benefits) ? editingItem.benefits.join(', ') : editingItem.benefits) : newAsana.benefits}
                            onChange={e => editingItem ? setEditingItem({...editingItem, benefits: e.target.value}) : setNewAsana({...newAsana, benefits: e.target.value})}
                          />
                          <Input 
                            placeholder="Body Parts (comma separated)" 
                            value={editingItem ? (Array.isArray(editingItem.bodyParts) ? editingItem.bodyParts.join(', ') : editingItem.bodyParts) : newAsana.bodyParts}
                            onChange={e => editingItem ? setEditingItem({...editingItem, bodyParts: e.target.value}) : setNewAsana({...newAsana, bodyParts: e.target.value})}
                          />
                          <div className="flex gap-2">
                            <Input 
                              placeholder="YouTube Link or Video URL" 
                              value={editingItem ? editingItem.youtubeLink : newAsana.youtubeLink}
                              onChange={e => editingItem ? setEditingItem({...editingItem, youtubeLink: e.target.value}) : setNewAsana({...newAsana, youtubeLink: e.target.value})}
                              className="flex-1"
                            />
                            <label className="cursor-pointer bg-secondary hover:bg-secondary/80 p-2 rounded-lg transition-colors flex items-center justify-center min-w-[40px]">
                              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                              <input type="file" className="hidden" accept="video/*" onChange={e => handleFileUpload(e, 'yoga-video')} disabled={isUploading} />
                            </label>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button type="submit" className="w-full rounded-xl">
                          {editingItem ? 'Update Asana' : <><Plus className="w-4 h-4 mr-2" /> Add Asana</>}
                        </Button>
                      </CardFooter>
                    </form>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {asanas.map((a) => (
                      <Card key={a._id} className="bg-card/50 border-border overflow-hidden group">
                        <div className="aspect-video w-full bg-secondary relative">
                          {Array.isArray(a.images) && a.images.length > 0 ? (
                            <img src={a.images[0]} className="w-full h-full object-cover" alt={a.name} />
                          ) : a.image ? (
                            <img src={a.image} className="w-full h-full object-cover" alt={a.name} />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center opacity-20">
                              <YogaIcon className="w-12 h-12" />
                            </div>
                          )}
                          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="rounded-full w-8 h-8 bg-brand-purple text-white hover:bg-brand-purple/80 p-0"
                              onClick={() => {
                                setEditingItem(a)
                                window.scrollTo({ top: 0, behavior: 'smooth' })
                              }}
                            >
                              <Settings className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="rounded-full w-8 h-8 bg-red-500 text-white hover:bg-red-600 p-0"
                              onClick={() => handleDeleteAsana(a._id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <CardContent className="pt-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold">{a.name}</h3>
                            {a.youtubeLink && (
                              <a href={a.youtubeLink} target="_blank" rel="noopener noreferrer" className="text-brand-purple hover:text-brand-pink transition-colors">
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {a.bodyParts.map((p: string, i: number) => (
                              <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-brand-purple/10 text-brand-purple font-bold">
                                {p}
                              </span>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'meditation' && (
                <motion.div 
                  key="meditation"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-8"
                >
                  <Card className="bg-card/50 border-border">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>{editingItem ? 'Edit Meditation' : 'Add New Meditation'}</CardTitle>
                        <CardDescription>{editingItem ? 'Update existing meditation session' : 'Add a new guided meditation session.'}</CardDescription>
                      </div>
                      {editingItem && (
                        <Button variant="ghost" size="sm" onClick={() => {
                          setEditingItem(null)
                          setNewMeditation({ title: "", images: [], mood: "Anxiety", duration: "", youtubeLink: "", description: "" })
                        }}>
                          Cancel Edit
                        </Button>
                      )}
                    </CardHeader>
                    <form onSubmit={handleAddMeditation}>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input 
                            placeholder="Meditation Title" 
                            value={editingItem ? editingItem.title : newMeditation.title}
                            onChange={e => editingItem ? setEditingItem({...editingItem, title: e.target.value}) : setNewMeditation({...newMeditation, title: e.target.value})}
                            required
                          />
                          <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-text-secondary">Thumbnail Images</label>
                            <div className="space-y-2">
                              {(editingItem ? (editingItem.images || []) : newMeditation.images).map((img: string, idx: number) => (
                                <div key={idx} className="flex gap-2 items-center">
                                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-secondary">
                                    {img ? (
                                      <img src={img} className="w-full h-full object-cover" alt={`Meditation ${idx}`} />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center opacity-20">
                                        <ImageIcon className="w-4 h-4" />
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-1 px-3 py-2 rounded-md border border-input bg-background text-sm text-text-secondary italic overflow-hidden text-ellipsis whitespace-nowrap">
                                    {img ? img.split('/').pop() : "No image uploaded"}
                                  </div>
                                  <Button 
                                    type="button"
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-red-500 hover:bg-red-500/10"
                                    onClick={() => {
                                      const newImages = (editingItem ? editingItem.images : newMeditation.images).filter((_: any, i: number) => i !== idx)
                                      editingItem ? setEditingItem({...editingItem, images: newImages}) : setNewMeditation({...newMeditation, images: newImages})
                                    }}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              ))}
                              <div className="flex gap-2">
                                <div className="flex-1 px-3 py-2 rounded-md border border-dashed border-input bg-background/50 text-xs text-text-secondary flex items-center justify-center italic">
                                  Click upload to add new image
                                </div>
                                <label className="cursor-pointer bg-secondary hover:bg-secondary/80 p-2 rounded-lg transition-colors flex items-center justify-center min-w-[40px]">
                                  {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                  <input type="file" className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'meditation')} disabled={isUploading} />
                                </label>
                              </div>
                            </div>
                          </div>
                          <select 
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={editingItem ? editingItem.mood : newMeditation.mood}
                            onChange={e => editingItem ? setEditingItem({...editingItem, mood: e.target.value}) : setNewMeditation({...newMeditation, mood: e.target.value})}
                          >
                            <option value="Anxiety">Anxiety</option>
                            <option value="Sadness">Sadness</option>
                            <option value="Overthinking">Overthinking</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Energy">Energy</option>
                          </select>
                          <Input 
                            placeholder="Duration (e.g. 5 min)" 
                            value={editingItem ? editingItem.duration : newMeditation.duration}
                            onChange={e => editingItem ? setEditingItem({...editingItem, duration: e.target.value}) : setNewMeditation({...newMeditation, duration: e.target.value})}
                          />
                          <div className="flex gap-2">
                            <Input 
                              placeholder="External Link (YouTube, Spotify, etc.)" 
                              value={editingItem ? editingItem.youtubeLink : newMeditation.youtubeLink}
                              onChange={e => editingItem ? setEditingItem({...editingItem, youtubeLink: e.target.value}) : setNewMeditation({...newMeditation, youtubeLink: e.target.value})}
                              required
                              className="flex-1"
                            />
                            <label className="cursor-pointer bg-secondary hover:bg-secondary/80 p-2 rounded-lg transition-colors flex items-center justify-center min-w-[40px]">
                              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                              <input type="file" className="hidden" accept="video/*" onChange={e => handleFileUpload(e, 'meditation-video')} disabled={isUploading} />
                            </label>
                          </div>
                          <Input 
                            placeholder="Description" 
                            value={editingItem ? editingItem.description : newMeditation.description}
                            onChange={e => editingItem ? setEditingItem({...editingItem, description: e.target.value}) : setNewMeditation({...newMeditation, description: e.target.value})}
                          />
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button type="submit" className="w-full rounded-xl">
                          {editingItem ? 'Update Meditation' : <><Plus className="w-4 h-4 mr-2" /> Add Meditation</>}
                        </Button>
                      </CardFooter>
                    </form>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {meditations.map((m) => (
                      <Card key={m._id} className="bg-card/50 border-border overflow-hidden group">
                        <div className="aspect-video w-full bg-secondary relative">
                          {Array.isArray(m.images) && m.images.length > 0 ? (
                            <img src={m.images[0]} className="w-full h-full object-cover" alt={m.title} />
                          ) : m.image ? (
                            <img src={m.image} className="w-full h-full object-cover" alt={m.title} />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center opacity-20">
                              <MeditationIcon className="w-12 h-12" />
                            </div>
                          )}
                          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="rounded-full w-8 h-8 bg-brand-purple text-white hover:bg-brand-purple/80 p-0"
                              onClick={() => {
                                setEditingItem(m)
                                window.scrollTo({ top: 0, behavior: 'smooth' })
                              }}
                            >
                              <Settings className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="rounded-full w-8 h-8 bg-red-500 text-white hover:bg-red-600 p-0"
                              onClick={() => handleDeleteMeditation(m._id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <CardContent className="pt-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold">{m.title}</h3>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-pink/10 text-brand-pink font-bold uppercase">
                              {m.mood}
                            </span>
                          </div>
                          <p className="text-sm text-text-secondary line-clamp-2">{m.description}</p>
                          <div className="flex items-center justify-between pt-2">
                            <span className="text-xs text-text-secondary/60">{m.duration}</span>
                            <a href={m.youtubeLink} target="_blank" rel="noopener noreferrer" className="text-brand-purple hover:text-brand-pink transition-all">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
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
