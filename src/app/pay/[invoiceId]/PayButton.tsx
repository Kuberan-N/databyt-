"use client";

import { useState } from "react";

const fmt = (n: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 2 }).format(n);

export default function PayButton({
  invoiceId,
  orgId,
  amount,
  currency,
}: {
  invoiceId: string;
  orgId: string;
  amount: number;
  currency: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePay() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId, orgId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to create checkout");
      window.location.href = json.url;
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  }

  return (
    <>
      {error && (
        <div className="mb-3 px-4 py-2.5 rounded-xl bg-[#F1F5F9] border border-[#FECACA] text-[#DC2626] text-sm">
          {error}
        </div>
      )}
      <button
        onClick={handlePay}
        disabled={loading}
        className="w-full py-3.5 rounded-xl bg-[#000000] text-white font-bold text-sm hover:bg-[#111111] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Preparing checkout...
          </>
        ) : (
          `Pay ${fmt(amount, currency)}`
        )}
      </button>
    </>
  );
}
