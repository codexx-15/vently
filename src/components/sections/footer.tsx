import Link from "next/link"
import { Logo } from "@/components/ui/logo"

export function Footer() {
  return (
    <footer className="py-24 px-6 border-t border-border bg-card">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2 space-y-6">
          <Link href="/" className="inline-block">
            <Logo />
          </Link>
          <p className="text-text-secondary max-w-[300px]">
            Your safe space to vent, reflect, and be understood. 
            Built for a calmer, more human connection.
          </p>
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
