import { headers } from "next/headers";
import { getLocaleConfig } from "@/lib/geo";
import type { Locale } from "@/lib/geo";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PainSection from "@/components/PainSection";
import ResearchSection from "@/components/ResearchSection";
import HowItWorks from "@/components/HowItWorks";
import ROICalculator from "@/components/ROICalculator";
import ValueStack from "@/components/ValueStack";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import FinalCTA, { Footer } from "@/components/FinalCTA";

export default async function Home() {
  const hdrs = await headers();
  const country = hdrs.get("x-vercel-ip-country") ?? "US";
  const locale: Locale = country === "IN" ? "IN" : "INTL";
  const cfg = getLocaleConfig(country);

  return (
    <main className="bg-[#F8FAFC]">
      <Navbar />
      <Hero locale={locale} cfg={cfg} />
      <PainSection locale={locale} cfg={cfg} />
      <ResearchSection locale={locale} />
      <HowItWorks />
      <ROICalculator locale={locale} cfg={cfg} />
      <ValueStack locale={locale} cfg={cfg} />
      <Testimonials locale={locale} />
      <Pricing locale={locale} cfg={cfg} />
      <FAQ locale={locale} />
      <FinalCTA locale={locale} cfg={cfg} />
      <Footer />
    </main>
  );
}
