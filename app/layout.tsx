import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { CurrencyProvider } from "@/components/CurrencyContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "DataByt — Production AI Agents on Databricks | 5 Disciplines Engineering",
  description:
    "We build production AI agents on Databricks using 5 engineering disciplines most agencies skip. Evaluation suites, failure mode handling, human-in-the-loop design, monitoring. Founding client pricing: $12,000-$25,000. 8-10 weeks to production.",
  keywords:
    "databricks AI agents, AI agent development, fractional AI team, databricks agent builder, AI readiness audit",
  openGraph: {
    title: "Your AI Project Is Stuck. We Ship It to Production.",
    description:
      "DataByt builds production AI agents on Databricks using 5 disciplines. Not demos. Systems.",
    url: "https://databyt.in",
    siteName: "DataByt",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${outfit.variable} font-sans bg-[#050A14] text-white antialiased`}
      >
        <CurrencyProvider>
          {children}
        </CurrencyProvider>
      </body>
    </html>
  );
}
