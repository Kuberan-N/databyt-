import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { CurrencyProvider } from "@/components/CurrencyContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DataByt — Stop Shipping AI Demos. Start Shipping Systems.",
  description:
    "DataByt builds production AI agents for AR Collections automation on your Databricks, Snowflake, QuickBooks, or SAP. 8–10 weeks to production. DSO reduced 18 days. Your data never leaves your infrastructure.",
  keywords:
    "AR collections automation, production AI agent, accounts receivable AI, Databricks AI agent, Snowflake AI agent, finance AI, DSO reduction, MLflow, LangGraph",
  openGraph: {
    title: "DataByt — Production AI Agent Engineering",
    description:
      "We build production AI agents for AR Collections. On your infrastructure. 8–10 weeks. Full code ownership.",
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
    <html lang="en" className={`${inter.variable} ${outfit.variable} scroll-smooth`}>
      <body className="antialiased font-body bg-white">
        <CurrencyProvider>{children}</CurrencyProvider>
      </body>
    </html>
  );
}
