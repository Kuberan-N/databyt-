import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PainSection from "@/components/PainSection";
import ResearchSection from "@/components/ResearchSection";
import HowItWorks from "@/components/HowItWorks";
import ROICalculator from "@/components/ROICalculator";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import { Footer } from "@/components/FinalCTA";

export default function Home() {
  return (
    <main className="bg-[#F8FAFC]">
      <Navbar />
      <Hero />
      <PainSection />
      <ResearchSection />
      <HowItWorks />
      <ROICalculator />
      <Pricing />
      <FAQ />
      <Footer />
    </main>
  );
}
