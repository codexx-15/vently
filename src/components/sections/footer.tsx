"use client"

import Link from "next/link"
import { Logo } from "@/components/ui/logo"
import { useGlobalState } from "@/lib/store"
import { Globe as Instagram, MessageCircle as Twitter, Share2 as Linkedin } from "lucide-react"

export function Footer() {
  const { settings } = useGlobalState()

  return (
    <footer className="py-24 px-6 border-t border-border bg-card">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2 space-y-6">
          <Link href="/" className="flex items-center gap-2 group transition-all">
            {settings?.logo && settings.logo.trim() !== "" ? (
              <img src={settings.logo} alt={settings.siteName} className="h-8 w-auto" />
            ) : (
              <Logo />
            )}
            <span className="text-2xl font-black tracking-tighter text-foreground group-hover:text-brand-pink transition-colors">
              {settings?.siteName || "Vently"}
            </span>
          </Link>
          <p className="text-text-secondary max-w-[400px]">
            {settings?.footerText || "Your safe space to vent, reflect, and be understood."}
          </p>
          <div className="flex gap-4">
            <a href={settings?.socialLinks?.instagram || "#"} target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-brand-pink transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href={settings?.socialLinks?.twitter || "#"} target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-brand-pink transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href={settings?.socialLinks?.linkedin || "#"} target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-brand-pink transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
        
        <div className="space-y-6">
          <h4 className="font-bold text-text-primary uppercase tracking-widest text-xs">Product</h4>
          <ul className="space-y-4 text-text-secondary">
            <li><Link href="#features" className="hover:text-text-primary transition-colors">Features</Link></li>
            <li><Link href="#how-it-works" className="hover:text-text-primary transition-colors">How it Works</Link></li>
            <li><Link href="/login" className="hover:text-text-primary transition-colors">Login</Link></li>
          </ul>
        </div>
        
        <div className="space-y-6">
          <h4 className="font-bold text-text-primary uppercase tracking-widest text-xs">Privacy</h4>
          <ul className="space-y-4 text-text-secondary">
            <li><Link href="/privacy" className="hover:text-text-primary transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-text-primary transition-colors">Terms of Service</Link></li>
            <li><Link href="/safety" className="hover:text-text-primary transition-colors">Safety Guide</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-[1440px] mx-auto mt-24 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-text-secondary">
        <p>© 2026 Vently AI. All rights reserved.</p>
        <p>Made with 🤍 for mental wellness.</p>
      </div>
    </footer>
  )
}
