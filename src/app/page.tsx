import StickyBanner from "@/components/StickyBanner";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PainSection from "@/components/PainSection";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import FinalCTA, { Footer } from "@/components/FinalCTA";

export default function Home() {
  return (
    <main>
      <StickyBanner />
      <Navbar />
      <Hero />
      <PainSection />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
