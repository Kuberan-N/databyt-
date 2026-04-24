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
  title: "Databyt — AI Agent Studio for Startups on Databricks",
  description:
    "Production-grade AI agents built on your Databricks stack. First agent live in 4 weeks or full refund. For Seed-Series B startups.",
  keywords:
    "databricks AI agents, AI agent development, fractional AI team, databricks agent builder, AI readiness audit",
  openGraph: {
    title: "Databyt — AI Agent Studio for Startups on Databricks",
    description:
      "We build production AI agents on your Databricks stack — with enterprise-grade data engineering under the hood. Agent-ready data + one working agent in 4 weeks, or 100% refund.",
    url: "https://databyt.in",
    siteName: "Databyt",
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
