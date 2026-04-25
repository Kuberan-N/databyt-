import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SocialProofBar from "@/components/TechStack";
import ProblemAgitation from "@/components/Problem";
import CostOfInaction from "@/components/TwoPaths";
import ComparisonTable from "@/components/ComparisonTable";
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
      <AnnouncementBar />
      <Navbar />
      <main>
        <Hero />
        <SocialProofBar />
        <ProblemAgitation />
        <CostOfInaction />
        <ComparisonTable />
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
