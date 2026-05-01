import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PainTicker from "@/components/PainTicker";
import ProblemAgitation from "@/components/Problem";
import CostOfInaction from "@/components/TwoPaths";
import Services from "@/components/Services";
import HowItWorks from "@/components/HowItWorks";
import RealNumbers from "@/components/RealNumbers";
import ComparisonTable from "@/components/ComparisonTable";
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
        <Hero />
        <PainTicker />
        <ProblemAgitation />
        <CostOfInaction />
        <Services />
        <HowItWorks />
        <RealNumbers />
        <ComparisonTable />
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
