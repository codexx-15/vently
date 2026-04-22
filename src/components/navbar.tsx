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
  const { user, isLoggedIn, isAdmin, refreshData, settings } = useGlobalState()
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
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
  }

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 flex h-24 items-center justify-center transition-all duration-500",
        scrolled ? "h-20" : "bg-transparent"
      )}
    >
      <div className={cn(
        "container flex items-center justify-between px-6 max-w-[1200px] transition-all duration-500 rounded-full mx-6",
        scrolled ? "bg-white/40 dark:bg-black/40 backdrop-blur-2xl border border-white/40 dark:border-white/10 shadow-lg py-3 px-8" : "py-4"
      )}>
        <Link href="/" onClick={handleLogoClick} className="flex items-center gap-2 group transition-all">
          {settings?.logo && settings.logo.trim() !== "" ? (
            <img 
              src={settings.logo} 
              alt={settings.siteName} 
              className={cn("h-8 w-auto transition-all duration-300", scrolled ? "scale-90" : "scale-100")} 
            />
          ) : (
            <Logo className={cn("transition-all duration-300", scrolled ? "scale-90" : "scale-100")} />
          )}
          <span className="text-2xl font-black tracking-tighter text-foreground group-hover:text-brand-purple transition-colors">
            {settings?.siteName || "Vently"}
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-text-secondary/80">
          <Link href="/healing" className="hover:text-brand-purple transition-all">
            Healing Space
          </Link>
          <a 
            href="#features" 
            onClick={(e) => scrollToSection(e, "features")}
            className="hover:text-brand-purple transition-all cursor-pointer"
          >
            Features
          </a>
          <Link href="/login" className="hover:text-brand-purple transition-all">
            How it Works
          </Link>
          
          {isLoggedIn ? (
            <div className="flex items-center gap-6 border-l border-white/20 pl-6">
              {isAdmin && (
                <Link href="/admin" className="flex items-center gap-2 hover:text-brand-purple transition-all">
                  <ShieldCheck className="w-4 h-4" /> Admin
                </Link>
              )}
              <Link href="/profile" className="flex items-center gap-2 hover:text-brand-purple transition-all group">
                <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white/40 dark:border-white/10 group-hover:border-brand-purple transition-all">
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                </div>
                <span>Profile</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="text-[10px] font-black text-red-500/80 hover:text-red-500 transition-all uppercase tracking-widest border border-red-500/20 px-3 py-1.5 rounded-full"
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
