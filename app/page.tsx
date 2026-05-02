import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import SolutionFlow from "@/components/SolutionFlow";
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
      <main className="bg-white">
        <Hero />
        <Problem />
        <SolutionFlow />
        <PlatformSupport />
        <ROICalculator />
        <FiveDisciplines />
        <HowItWorks />
        <ProofSection />
        <Pricing />
        <Guarantee />
        <FounderStory />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <DemoForm />
    </DemoFormProvider>
  );
}
