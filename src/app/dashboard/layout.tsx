import type { Metadata } from "next";
import { AuthProvider } from "@/components/AuthProvider";
import DashboardShell from "@/components/DashboardShell";

export const metadata: Metadata = {
  title: "Dashboard — DataByt CashFlow AI",
  description: "Manage your invoices, collections, and cash flow from one dashboard.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <DashboardShell>{children}</DashboardShell>
    </AuthProvider>
  );
}
