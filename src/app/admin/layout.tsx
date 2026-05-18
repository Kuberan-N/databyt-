"use client";

import dynamic from "next/dynamic";
import { ReactNode } from "react";

const AdminShell = dynamic(() => import("@/components/AdminShell"), { ssr: false });

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
