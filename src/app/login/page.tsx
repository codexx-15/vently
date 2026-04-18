"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Logo } from "@/components/ui/logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Loader2, ArrowLeft } from "lucide-react"
import { useGlobalState } from "@/lib/store"

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
    <main className="min-h-screen flex items-center justify-center p-6 bg-background relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-foreground/[0.03] rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[450px]"
      >
        <div className="mb-8 flex flex-col items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors text-sm mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
          <Logo className="text-4xl" />
        </div>

        <Card className="border-border shadow-xl bg-card/50 backdrop-blur-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
            <CardDescription className="text-center">
              {isOtpMode ? "Enter the OTP sent to your email" : "Enter your credentials to access your safe space"}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg text-center">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
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
                    className="flex-1"
                  />
                  {!isOtpMode && !isOtpSent && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={handleSendOtp}
                      disabled={isLoading || !email}
                    >
                      Send OTP
                    </Button>
                  )}
                </div>
              </div>

              {isOtpMode ? (
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">
                    Enter OTP
                  </label>
                  <Input
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    maxLength={6}
                    disabled={isLoading}
                    className="text-center text-2xl tracking-[10px] font-bold"
                  />
                  <button 
                    type="button"
                    onClick={() => {
                      setIsOtpMode(false)
                      setIsOtpSent(false)
                      setOtp("")
                    }}
                    className="text-xs text-text-secondary hover:text-text-primary underline"
                  >
                    Back to Password Login
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Password
                    </label>
                    <Link href="#" className="text-xs text-text-secondary hover:underline">
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
                  />
                </div>
              )}

              <div className="flex items-center space-x-2 pt-2">
                <input 
                  type="checkbox" 
                  id="adminLogin" 
                  checked={isAdminLogin}
                  onChange={(e) => setIsAdminLogin(e.target.checked)}
                  className="w-4 h-4 rounded border-border bg-card text-foreground focus:ring-0 focus:ring-offset-0"
                />
                <label 
                  htmlFor="adminLogin" 
                  className="text-sm font-medium leading-none cursor-pointer text-text-secondary hover:text-text-primary transition-colors"
                >
                  Login as Admin
                </label>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full h-12 text-lg rounded-xl" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isOtpMode ? "Verifying OTP..." : "Signing in..."}
                  </>
                ) : (
                  isOtpMode ? "Verify & Login" : "Sign In"
                )}
              </Button>
              <div className="text-sm text-center text-text-secondary">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-text-primary font-medium hover:underline">
                  Create one
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </main>
  )
}
