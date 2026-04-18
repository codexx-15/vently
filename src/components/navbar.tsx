"use client"

import * as React from "react"
import Link from "next/link"
import { Logo } from "@/components/ui/logo"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/toggle"
import { cn } from "@/lib/utils"
import { useGlobalState } from "@/lib/store"
import { User, ShieldCheck } from "lucide-react"
import { useRouter } from "next/navigation"

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false)
  const { user, isLoggedIn, isAdmin, refreshData } = useGlobalState()
  const router = useRouter()

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('vently_token')
    localStorage.removeItem('vently_user_email')
    window.location.href = '/'
  }

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      const offset = 80 // Navbar height
      const bodyRect = document.body.getBoundingClientRect().top
      const elementRect = element.getBoundingClientRect().top
      const elementPosition = elementRect - bodyRect
      const offsetPosition = elementPosition - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      })
    }
  }

  const handleLogoClick = (e: React.MouseEvent) => {
    if (window.location.pathname === '/') {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 flex h-20 items-center justify-center transition-all duration-300",
        scrolled ? "bg-background/80 backdrop-blur-md border-b border-border h-16" : "bg-transparent"
      )}
    >
      <div className="container flex items-center justify-between px-6 max-w-[1440px]">
        <Link href="/" onClick={handleLogoClick}>
          <Logo />
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-text-secondary">
          <a 
            href="#features" 
            onClick={(e) => scrollToSection(e, "features")}
            className="hover:text-text-primary transition-colors cursor-pointer"
          >
            Features
          </a>
          <Link href="/login" className="hover:text-text-primary transition-colors">
            How it Works
          </Link>
          
          {isLoggedIn ? (
            <div className="flex items-center gap-6 border-l border-border pl-6">
              {isAdmin && (
                <Link href="/admin" className="flex items-center gap-2 hover:text-text-primary transition-colors">
                  <ShieldCheck className="w-4 h-4" /> Admin
                </Link>
              )}
              <Link href="/profile" className="flex items-center gap-2 hover:text-text-primary transition-colors">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-border">
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                </div>
                Profile
              </Link>
              <button 
                onClick={handleLogout}
                className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors uppercase tracking-widest"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link href="/login" className="hover:text-text-primary transition-colors">
              Login
            </Link>
          )}

          <ThemeToggle />
          <Button size="sm" onClick={() => router.push('/vent')}>
            Start Venting
          </Button>
        </div>
      </div>
    </nav>
  )
}
