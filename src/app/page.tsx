"use client"

import { Navbar } from "@/components/navbar";
import dynamic from "next/dynamic";
import { ValueSection } from "@/components/sections/value-section";
import { TrustSection } from "@/components/sections/trust-section";
import { Testimonials } from "@/components/sections/testimonials";
import { FAQ } from "@/components/sections/faq";
import { FinalCTA } from "@/components/sections/final-cta";
import { Footer } from "@/components/sections/footer";

const Hero = dynamic(() => import("@/components/sections/hero").then(mod => mod.Hero), { ssr: false });
const ChatSection = dynamic(() => import("@/components/sections/chat-section").then(mod => mod.ChatSection), { ssr: false });
const EmotionalSection = dynamic(() => import("@/components/sections/emotional-section").then(mod => mod.EmotionalSection), { ssr: false });

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      <ChatSection />
      <ValueSection />
      <EmotionalSection />
      <TrustSection />
      <Testimonials />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
