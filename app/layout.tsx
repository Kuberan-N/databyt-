import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "DataByt — Stop the Night-Before Investor Call Panic",
  description:
    "Your Razorpay says ₹10L. Your spreadsheet says ₹9.2L. We find the gap, fix it, and automate your investor reporting forever.",
  openGraph: {
    title: "DataByt — Investor-Ready Metrics for Indian Founders",
    description:
      "We audit your data, fix discrepancies, and deliver a branded investor report by the 3rd of every month.",
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
        className={`${inter.variable} font-sans bg-[#0A0A0A] text-white antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
