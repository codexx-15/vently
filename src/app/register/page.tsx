"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Logo } from "@/components/ui/logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Loader2, ArrowLeft, Camera } from "lucide-react"
import { GlassBackground } from "@/components/ui/glass-background"

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState("")
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
    avatar: ""
  })

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed')
      }
      
      router.push("/login")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <GlassBackground />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[450px] z-10"
      >
        <div className="mb-8 flex flex-col items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-text-secondary hover:text-brand-purple transition-colors text-sm mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
          <Logo className="text-4xl" />
        </div>

        <Card className="bg-white/20 dark:bg-black/20 backdrop-blur-3xl border-white/40 dark:border-white/5 shadow-[0_8px_32px_0_rgba(255,182,193,0.15)] rounded-[32px]">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-3xl text-center font-bold tracking-tight text-foreground/90">
              Create Account
            </CardTitle>
            <CardDescription className="text-center text-text-secondary/70">
              Join Vently for your safe emotional space
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-3 text-sm text-brand-pink bg-brand-pink/10 border border-brand-pink/20 rounded-2xl text-center backdrop-blur-md"
                >
                  {error}
                </motion.div>
              )}
              
              <div className="flex flex-col items-center gap-3 mb-4">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/40 dark:border-white/5 bg-white/20 dark:bg-black/20 flex items-center justify-center transition-all group-hover:border-brand-purple/50 shadow-inner">
                    {formData.avatar ? (
                      <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="w-8 h-8 text-text-secondary group-hover:text-brand-purple transition-colors" />
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-gradient-to-br from-brand-pink to-brand-purple text-white p-2.5 rounded-full cursor-pointer shadow-lg hover:scale-110 transition-transform">
                    <Camera className="w-4 h-4" />
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                  </label>
                </div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-text-secondary/40">Profile Picture</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-brand-pink/60 px-1 uppercase tracking-wider">Full Name</label>
                <Input
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  disabled={isLoading}
                  className="bg-white/20 dark:bg-black/20 border-white/30 dark:border-white/5 focus:border-brand-purple/50 focus:ring-2 focus:ring-brand-purple/10 transition-all rounded-2xl h-12 text-foreground"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-brand-pink/60 px-1 uppercase tracking-wider">Email</label>
                <Input
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={isLoading}
                  className="bg-white/20 dark:bg-black/20 border-white/30 dark:border-white/5 focus:border-brand-purple/50 focus:ring-2 focus:ring-brand-purple/10 transition-all rounded-2xl h-12 text-foreground"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-brand-pink/60 px-1 uppercase tracking-wider">Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  disabled={isLoading}
                  className="bg-white/20 dark:bg-black/20 border-white/30 dark:border-white/5 focus:border-brand-purple/50 focus:ring-2 focus:ring-brand-purple/10 transition-all rounded-2xl h-12 text-foreground"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-6 pt-2">
              <Button 
                type="submit" 
                className="w-full h-12 text-lg font-semibold rounded-2xl bg-gradient-to-r from-brand-pink/80 to-brand-pink hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-brand-pink/20 text-white" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
              <p className="text-center text-sm text-text-secondary/70">
                Already have an account?{" "}
                <Link href="/login" className="text-brand-purple font-semibold hover:text-brand-pink transition-colors underline-offset-4 hover:underline">
                  Sign In
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </main>
  )
}
