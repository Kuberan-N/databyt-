import type { Metadata } from "next";

export const metadata: Metadata = { title: "Billing â€” DataByt" };

export default function BillingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-16 h-16 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mb-6">
        <span className="text-2xl">ðŸ’³</span>
      </div>
      <h2 className="text-xl font-semibold text-white mb-2">Billing</h2>
      <p className="text-[#333333] text-sm max-w-sm">
        Subscription management and usage details will appear here.
      </p>
    </div>
  );
}
