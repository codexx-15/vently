import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/sections/hero";
import { ValueSection } from "@/components/sections/value-section";
import { EmotionalSection } from "@/components/sections/emotional-section";
import { TrustSection } from "@/components/sections/trust-section";
import { Testimonials } from "@/components/sections/testimonials";
import { FAQ } from "@/components/sections/faq";
import { FinalCTA } from "@/components/sections/final-cta";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
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
