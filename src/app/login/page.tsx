"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Logo } from "@/components/ui/logo"
import { useGlobalState } from "@/lib/store"
import { GlassBackground } from "@/components/ui/glass-background"

export default function LoginPage() {
  const router = useRouter()
  const { refreshData } = useGlobalState()
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState("")
  
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [otp, setOtp] = React.useState("")
  const [isOtpSent, setIsOtpSent] = React.useState(false)
  const [isOtpMode, setIsOtpMode] = React.useState(false)
  const [isAdminLogin, setIsAdminLogin] = React.useState(false)

  const handleSendOtp = async () => {
    if (!email) {
      setError("Please enter your email first")
      return
    }
    setIsLoading(true)
    setError("")
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send OTP')
      setIsOtpSent(true)
      setIsOtpMode(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          password: isOtpMode ? undefined : password,
          otp: isOtpMode ? otp : undefined,
          role: isAdminLogin ? 'admin' : 'user' 
        }),
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Login failed')
      }
      
      // Store session info
      localStorage.setItem('vently_token', data.token)
      localStorage.setItem('vently_user_email', data.user.email)
      
      // Sync global state
      await refreshData()
      
      router.push("/")
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
              Sign In
            </CardTitle>
            <CardDescription className="text-center text-text-secondary/70">
              {isOtpMode ? "Enter the OTP sent to your email" : "Welcome back to your safe space"}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-5">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-3 text-sm text-brand-pink bg-brand-pink/10 border border-brand-pink/20 rounded-2xl text-center backdrop-blur-md"
                >
                  {error}
                </motion.div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium text-brand-pink/60 px-1 uppercase tracking-wider">
                  Email
                </label>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading || isOtpSent}
                    className="flex-1 bg-white/20 dark:bg-black/20 border-white/30 dark:border-white/5 focus:border-brand-purple/50 focus:ring-2 focus:ring-brand-purple/10 transition-all rounded-2xl h-12 text-foreground"
                  />
                  {!isOtpMode && !isOtpSent && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={handleSendOtp}
                      disabled={isLoading || !email}
                      className="rounded-2xl border-white/30 dark:border-white/10 bg-white/10 dark:bg-white/5 hover:bg-brand-pink/20 hover:text-brand-pink transition-all h-12"
                    >
                      Send OTP
                    </Button>
                  )}
                </div>
              </div>

              {isOtpMode ? (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-brand-pink/60 px-1 uppercase tracking-wider">
                    Verification Code
                  </label>
                  <Input
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    maxLength={6}
                    disabled={isLoading}
                    className="text-center text-2xl tracking-[12px] font-bold bg-white/20 dark:bg-black/20 border-white/30 dark:border-white/5 focus:border-brand-purple/50 rounded-2xl h-14"
                  />
                  <button 
                    type="button"
                    onClick={() => {
                      setIsOtpMode(false)
                      setIsOtpSent(false)
                      setOtp("")
                    }}
                    className="text-xs text-brand-purple hover:text-brand-pink transition-colors underline px-1"
                  >
                    Back to Password Login
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-sm font-medium text-brand-pink/60 uppercase tracking-wider">
                      Password
                    </label>
                    <Link href="#" className="text-xs text-text-secondary/60 hover:text-brand-purple transition-colors">
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="bg-white/20 dark:bg-black/20 border-white/30 dark:border-white/5 focus:border-brand-purple/50 focus:ring-2 focus:ring-brand-purple/10 transition-all rounded-2xl h-12 text-foreground"
                  />
                </div>
              )}

              <div className="flex items-center space-x-2 pt-1 px-1">
                <input 
                  type="checkbox" 
                  id="adminLogin" 
                  checked={isAdminLogin}
                  onChange={(e) => setIsAdminLogin(e.target.checked)}
                  className="w-4 h-4 rounded-lg border-white/40 bg-white/20 text-brand-purple focus:ring-brand-purple/50"
                />
                <label 
                  htmlFor="adminLogin" 
                  className="text-sm font-medium cursor-pointer text-text-secondary/70 hover:text-brand-purple transition-colors"
                >
                  Login as Admin
                </label>
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
                    {isOtpMode ? "Verifying..." : "Signing in..."}
                  </>
                ) : (
                  isOtpMode ? "Verify & Login" : "Login"
                )}
              </Button>
              
              <p className="text-center text-sm text-text-secondary/70">
                Don't have an account?{" "}
                <Link href="/register" className="text-brand-purple font-semibold hover:text-brand-pink transition-colors underline-offset-4 hover:underline">
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </main>
  )
}
