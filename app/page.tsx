import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TwoPaths from "@/components/TwoPaths";
import Problem from "@/components/Problem";
import TheRealProblem from "@/components/TheRealProblem";
import HowItWorks from "@/components/HowItWorks";
import Deliverables from "@/components/Deliverables";
import NarrativeExample from "@/components/NarrativeExample";
import TimeSaved from "@/components/TimeSaved";
import ProofSection from "@/components/ProofSection";
import Pricing from "@/components/Pricing";
import FiveDisciplines from "@/components/FiveDisciplines";
import WhatHappensAfter from "@/components/WhatHappensAfter";
import Guarantee from "@/components/Guarantee";
import WhyTrustUs from "@/components/WhyTrustUs";
import FounderStory from "@/components/FounderStory";
import CaseStudies from "@/components/CaseStudies";
import LeadMagnet from "@/components/LeadMagnet";
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
        <Hero />
        <TwoPaths />
        <Problem />
        <TheRealProblem />
        <HowItWorks />
        <Deliverables />
        <NarrativeExample />
        <TimeSaved />
        <ProofSection />
        <Pricing />
        <FiveDisciplines />
        <WhatHappensAfter />
        <Guarantee />
        <WhyTrustUs />
        <FounderStory />
        <CaseStudies />
        <LeadMagnet />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <DemoForm />
    </DemoFormProvider>
  );
}
