import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { CurrencyProvider } from "@/components/CurrencyContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "databyt — Fix your invoice follow-ups, collect payments faster",
  description:
    "We automate AR reminders, responses, and escalation inside your existing systems. Databricks, Snowflake, QuickBooks, SAP. 8–10 weeks to production.",
  keywords:
    "AR collections automation, accounts receivable AI, invoice follow-up automation, DSO reduction, Databricks, Snowflake",
  openGraph: {
    title: "databyt — Production AI Agents on Your Infrastructure",
    description:
      "Fix your invoice follow-ups and collect payments faster. We build inside your existing stack.",
    url: "https://databyt.in",
    siteName: "databyt",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable} scroll-smooth`}>
      <body className="antialiased font-body bg-white text-[#333]">
        <CurrencyProvider>{children}</CurrencyProvider>
      </body>
    </html>
  );
}
