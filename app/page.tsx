import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import PlatformSupport from "@/components/PlatformSupport";
import ROICalculator from "@/components/ROICalculator";
import FiveDisciplines from "@/components/FiveDisciplines";
import HowItWorks from "@/components/HowItWorks";
import ProofSection from "@/components/ProofSection";
import Pricing from "@/components/Pricing";
import Guarantee from "@/components/Guarantee";
import FounderStory from "@/components/FounderStory";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import DemoForm from "@/components/DemoForm";
import { DemoFormProvider } from "@/components/DemoFormContext";

export default function Home() {
  return (
    <DemoFormProvider>
      <Navbar />
      <main>
        {/* S2: Hero — black bg */}
        <Hero />
        {/* S3: Problem — white bg */}
        <Problem />
        {/* S4: Platform Support — off-white */}
        <PlatformSupport />
        {/* S5: ROI Calculator — black bg */}
        <ROICalculator />
        {/* S6: 5 Disciplines — gray bg */}
        <FiveDisciplines />
        {/* S7: Process / How We Work — gray bg */}
        <HowItWorks />
        {/* S8: Proof — white bg */}
        <ProofSection />
        {/* S9: Pricing — gray bg */}
        <Pricing />
        {/* S10: Guarantees — white bg */}
        <Guarantee />
        {/* S11: Founder Story — gray bg */}
        <FounderStory />
        {/* S12: FAQ — gray bg */}
        <FAQ />
        {/* S13: Final CTA — red bg */}
        <FinalCTA />
      </main>
      <Footer />
      <DemoForm />
    </DemoFormProvider>
  );
}
