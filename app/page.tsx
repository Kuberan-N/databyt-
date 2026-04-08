import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import TheRealProblem from "@/components/TheRealProblem";
import HowItWorks from "@/components/HowItWorks";
import Deliverables from "@/components/Deliverables";
import NarrativeExample from "@/components/NarrativeExample";
import TimeSaved from "@/components/TimeSaved";
import Guarantee from "@/components/Guarantee";
import WhyTrustUs from "@/components/WhyTrustUs";
import Pricing from "@/components/Pricing";
import CaseStudies from "@/components/CaseStudies";
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
        <Problem />
        <TheRealProblem />
        <HowItWorks />
        <Deliverables />
        <NarrativeExample />
        <TimeSaved />
        <Guarantee />
        <WhyTrustUs />
        <Pricing />
        <CaseStudies />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <DemoForm />
    </DemoFormProvider>
  );
}

