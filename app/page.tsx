import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import HowItWorks from "@/components/HowItWorks";
import Deliverables from "@/components/Deliverables";
import Pricing from "@/components/Pricing";
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
        <HowItWorks />
        <Deliverables />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <DemoForm />
    </DemoFormProvider>
  );
}
