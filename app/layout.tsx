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
  title: "DataByt — Finance AI Agents on Your Databricks & Snowflake",
  description:
    "We build production finance AI agents on your Databricks or Snowflake. AR Collections Agent in 3 weeks. Your data never leaves your infrastructure. DSO reduced 15-25 days.",
  keywords:
    "AR collections automation, finance AI agent, accounts receivable AI, Databricks AI agent, Snowflake AI agent, order to cash automation, DSO reduction",
  openGraph: {
    title: "Finance AI Agents — Built on Your Infrastructure | DataByt",
    description:
      "Production finance AI agents on your Databricks or Snowflake. Data never leaves. AR Collections from $4,900.",
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
