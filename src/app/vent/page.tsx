"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useGlobalState } from "@/lib/store"
import { ChatSection } from "@/components/sections/chat-section"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/sections/footer"
import { Loader2 } from "lucide-react"

export default function VentPage() {
  const { isLoggedIn, refreshData } = useGlobalState()
  const router = useRouter()
  const [isChecking, setIsChecking] = React.useState(true)

  React.useEffect(() => {
    const checkAuth = async () => {
      // First refresh data to make sure we have the latest auth state
      await refreshData()
      setIsChecking(false)
    }
    checkAuth()
  }, [])

  React.useEffect(() => {
    if (!isChecking && !isLoggedIn) {
      router.push('/register')
    }
  }, [isLoggedIn, isChecking, router])

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 text-text-secondary">
          <Loader2 className="h-10 w-10 animate-spin" />
          <p className="text-lg font-medium">Checking session...</p>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return null // Will redirect in useEffect
  }

  return (
    <main className="min-h-screen flex flex-col pt-20">
      <Navbar />
      <div className="flex-1 py-12">
        <ChatSection />
      </div>
      <Footer />
    </main>
  )
}
