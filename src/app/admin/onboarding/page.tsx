"use client";

import dynamic from "next/dynamic";

const AdminOnboarding = dynamic(() => import("./AdminOnboarding"), { ssr: false });

export default function AdminOnboardingPage() {
  return <AdminOnboarding />;
}
