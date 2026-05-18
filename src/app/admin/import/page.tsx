"use client";

import dynamic from "next/dynamic";

const AdminImport = dynamic(() => import("./AdminImport"), { ssr: false });

export default function AdminImportPage() {
  return <AdminImport />;
}
