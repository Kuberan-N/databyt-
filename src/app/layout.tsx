import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DataByt CashFlow AI — Stop Losing $7,500/Month on Manual Invoicing",
  description:
    "AI-powered invoice processing + automated collections for small businesses. Process invoices in seconds, chase overdue payments automatically. From $49/month. Deployed in 1 hour.",
  keywords: [
    "invoice automation",
    "accounts receivable automation",
    "collections management",
    "AP automation",
    "AI invoicing",
    "dunning automation",
    "QuickBooks integration",
    "reduce DSO",
    "cash flow management",
    "small business finance",
  ],
  openGraph: {
    title: "DataByt CashFlow AI — AI Invoice Processing + Auto Collections",
    description:
      "Process invoices with 95%+ accuracy. Chase overdue payments automatically. From $49/month.",
    url: "https://databyt.in",
    siteName: "DataByt",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DataByt CashFlow AI",
    description:
      "AI invoice processing + automated collections. From $49/month.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface-950 text-white antialiased">{children}</body>
    </html>
  );
}
