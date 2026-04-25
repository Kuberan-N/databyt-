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
  title: "Databyt — Databricks Cost Audits + Production AI Agents",
  description:
    "Databricks cost audits ($749) and production AI agents ($12K-$25K) built with 5 disciplines: evaluation, failure modes, human-in-the-loop, memory loops, monitoring. Senior data engineer, no junior consultants. Founding 5 clients pricing.",
  keywords:
    "databricks AI agents, AI agent development, fractional AI team, databricks agent builder, AI readiness audit",
  openGraph: {
    title: "Databyt — Databricks Cost Audits + Production AI Agents",
    description:
      "Databricks cost audits ($749) and production AI agents ($12K-$25K) built with 5 disciplines: evaluation, failure modes, human-in-the-loop, memory loops, monitoring. Senior data engineer, no junior consultants. Founding 5 clients pricing.",
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
