"use client";

import dynamic from "next/dynamic";

const AdminCollections = dynamic(() => import("./AdminCollections"), { ssr: false });

export default function AdminCollectionsPage() {
  return <AdminCollections />;
}
