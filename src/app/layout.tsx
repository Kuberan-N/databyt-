import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://databyt.in"),
  title: "DataByt — AI-Powered AR Collections for Mid-Market B2B",
  description:
    "Reduce DSO by 30% in 48 hours. AI dunning emails, dispute management, and live CEI analytics. Works with Stripe, Razorpay, or any payment provider. Connects to QuickBooks Online and Xero. One flat plan, everything included.",
  keywords: [
    "accounts receivable automation",
    "AR collections software",
    "dunning automation",
    "reduce DSO",
    "QuickBooks AR automation",
    "Xero collections",
    "invoice collections AI",
    "CEI dashboard",
    "B2B collections",
    "mid-market AR",
  ],
  openGraph: {
    title: "DataByt — AI AR Collections That Actually Close the Loop",
    description:
      "Import → Score → Email → Pay → Match → Dispute → Analyse. Live in 48 hours. 10× cheaper than HighRadius.",
    url: "https://databyt.in",
    siteName: "DataByt",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DataByt — AI-Powered AR Collections",
    description:
      "Reduce DSO by 30%. Live in 48 hours. One flat plan, everything included.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-white text-[#111111] antialiased" style={{ fontFamily: "'Bricolage Grotesque', Inter, sans-serif" }}>{children}</body>
    </html>
  );
}
