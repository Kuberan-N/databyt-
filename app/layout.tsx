import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Databyt — Automated Investor Reporting for Indian Founders",
  description:
    "Stop building your investor update manually. Databyt automates MRR, churn, CAC, and LTV into a branded report delivered by the 3rd of every month.",
  openGraph: {
    title: "Databyt — Automated Investor Reporting",
    description:
      "MRR, churn, CAC, LTV — automated and delivered by the 3rd.",
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
        className={`${inter.variable} font-sans bg-[#0A0A0A] text-white antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
