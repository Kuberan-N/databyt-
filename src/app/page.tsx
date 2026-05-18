import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PainSection from "@/components/PainSection";
import CostCalculator from "@/components/CostCalculator";
import HowItWorks from "@/components/HowItWorks";
import ValueStack from "@/components/ValueStack";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import FinalCTA, { Footer } from "@/components/FinalCTA";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <PainSection />
      <CostCalculator />
      <HowItWorks />
      <ValueStack />
      <Testimonials />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
