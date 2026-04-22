"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

export type UserProfile = {
  name: string
  email: string
  phone: string
  address: string
  avatar: string
  role?: 'user' | 'admin'
}

export type Feedback = {
  _id: string
  userName: string
  userAvatar: string
  content: string
  isVisible: boolean
  date: string
}

export type SiteSettings = {
  siteName: string
  logo?: string
  footerText: string
  socialLinks: {
    instagram: string
    twitter: string
    linkedin: string
  }
  heroImages: string[]
  heroVideos: string[]
  emotionalImages: string[]
}

type GlobalStateContextType = {
  user: UserProfile
  setUser: (u: UserProfile) => void
  feedbacks: Feedback[]
  setFeedbacks: (f: Feedback[]) => void
  settings: SiteSettings
  setSettings: (s: SiteSettings) => void
  isLoggedIn: boolean
  setIsLoggedIn: (b: boolean) => void
  isAdmin: boolean
  setIsAdmin: (b: boolean) => void
  refreshData: () => Promise<void>
}

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(undefined)

const DEFAULT_USER: UserProfile = {
  name: "Alex Johnson",
  email: "alex@example.com",
  phone: "+1 (555) 000-1111",
  address: "123 Calm Street, Serenity City",
  avatar: "https://i.pravatar.cc/150?u=alex"
}

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "Vently",
  logo: "",
  footerText: "Your safe space to vent, reflect, and be understood. Built for a calmer, more human connection.",
  socialLinks: {
    instagram: "#",
    twitter: "#",
    linkedin: "#"
  },
  heroImages: ["https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop"],
  heroVideos: [],
  emotionalImages: [
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=1200&auto=format&fit=crop"
  ]
}

export function GlobalStateProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER)
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  const refreshData = async () => {
    try {
      const storedEmail = localStorage.getItem('vently_user_email');
      const token = localStorage.getItem('vently_token');

      const [settingsRes, feedbackRes, userRes] = await Promise.all([
        fetch('/api/admin/settings'),
        fetch('/api/admin/feedback'),
        storedEmail && token ? fetch(`/api/user?email=${storedEmail}`) : Promise.resolve(null)
      ]);

      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        setSettings({
          ...DEFAULT_SETTINGS,
          ...settingsData,
          socialLinks: {
            ...DEFAULT_SETTINGS.socialLinks,
            ...(settingsData.socialLinks || {})
          }
        });
      }

      if (feedbackRes.ok) {
        const feedbackData = await feedbackRes.json();
        setFeedbacks(feedbackData);
      }

      if (userRes && userRes.ok) {
        const userData = await userRes.json();
        setUser(userData);
        setIsLoggedIn(true);
        setIsAdmin(userData.role === 'admin' || userData.email === 'alex@example.com');
      } else if (storedEmail && token) {
        // Token might be invalid or user deleted
        localStorage.removeItem('vently_token');
        localStorage.removeItem('vently_user_email');
        setIsLoggedIn(false);
        setIsAdmin(false);
      } else {
        setIsLoggedIn(false);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Error refreshing data from MongoDB:', error);
    }
  }

  useEffect(() => {
    refreshData();
  }, [])

  return (
    <GlobalStateContext.Provider value={{
      user, setUser, feedbacks, setFeedbacks, settings, setSettings,
      isLoggedIn, setIsLoggedIn, isAdmin, setIsAdmin, refreshData
    }}>
      {children}
    </GlobalStateContext.Provider>
  )
}

export function useGlobalState() {
  const context = useContext(GlobalStateContext)
  if (context === undefined) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider')
  }
  return context
}
