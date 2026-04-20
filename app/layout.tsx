import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

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
  title: "DataByt — Fractional Data + AI Team for Startups",
  description:
    "Replace the $150K data engineer with a $4,500/month retainer. Databricks pipelines, agentic AI, and investor-ready metrics — shipped monthly by one senior operator.",
  openGraph: {
    title: "DataByt — Your Fractional Data + AI Team",
    description:
      "Databricks pipelines and agentic automations shipped monthly, for the price of one junior hire. Week 1, or your money back.",
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
        {children}
      </body>
    </html>
  );
}
