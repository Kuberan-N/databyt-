"use client";

import type { Metadata } from "next";
import { useAuth } from "@/components/AuthProvider";
import { Clock, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";

export default function BillingPage() {
  const { organization } = useAuth();

  const createdAt = (organization as { created_at?: string } | null)?.created_at;
  const trialDaysLeft = createdAt
    ? 30 - Math.floor((Date.now() - new Date(createdAt).getTime()) / 86_400_000)
    : null;

  const trialEndDate = createdAt
    ? new Date(new Date(createdAt).getTime() + 30 * 86_400_000).toLocaleDateString("en-US", {
        month: "long", day: "numeric", year: "numeric",
      })
    : null;

  const isActive = trialDaysLeft !== null && trialDaysLeft > 0;
  const isExpired = trialDaysLeft !== null && trialDaysLeft <= 0;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#111111]">Billing & Subscription</h2>
        <p className="text-[#555555] text-sm mt-1">Your current plan and trial status.</p>
      </div>

      {/* Trial status card */}
      <div className={`rounded-xl border p-6 ${
        isExpired
          ? "bg-red-50 border-red-200"
          : isActive && trialDaysLeft! <= 7
          ? "bg-amber-50 border-amber-200"
          : "bg-[#F8FAFC] border-[#E2E8F0]"
      }`}>
        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
            isExpired ? "bg-red-100" : isActive ? "bg-[#F3F3F3]" : "bg-gray-100"
          }`}>
            {isExpired
              ? <AlertCircle className="w-5 h-5 text-red-500" />
              : isActive
              ? <Clock className="w-5 h-5 text-[#000000]" />
              : <CheckCircle className="w-5 h-5 text-gray-400" />}
          </div>
          <div className="flex-1">
            <p className={`font-semibold text-[15px] ${isExpired ? "text-red-700" : "text-[#111111]"}`}>
              {isExpired
                ? "Free trial ended"
                : isActive
                ? `${trialDaysLeft} day${trialDaysLeft !== 1 ? "s" : ""} remaining in your free trial`
                : "Trial status unknown"}
            </p>
            {trialEndDate && (
              <p className="text-[#555555] text-sm mt-1">
                {isExpired ? `Trial ended on ${trialEndDate}.` : `Trial ends on ${trialEndDate}.`}
              </p>
            )}
            <p className="text-[#555555] text-sm mt-1">
              {isExpired
                ? "Contact us to reactivate your account and continue collecting AR automatically."
                : "No credit card required during the trial. You will be contacted before your trial ends."}
            </p>
          </div>
        </div>
      </div>

      {/* Current plan */}
      <div className="rounded-xl border border-[#E2E8F0] bg-white p-6">
        <p className="text-[12px] text-[#888888] font-semibold uppercase tracking-widest mb-4">Current Plan</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[#111111] font-bold text-lg">DataByt Pro</p>
            <p className="text-[#555555] text-sm mt-0.5">
              Full AR Collections Automation — everything included
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#F3F3F3] text-[#000000] text-xs font-semibold">
            {isActive ? "Trial Active" : isExpired ? "Trial Ended" : "Active"}
          </span>
        </div>
      </div>

      {/* Upgrade CTA */}
      <div className="rounded-xl border border-[#E2E8F0] bg-white p-6">
        <p className="text-[12px] text-[#888888] font-semibold uppercase tracking-widest mb-3">Ready to upgrade?</p>
        <p className="text-[#333333] text-sm mb-4">
          After your trial, DataByt Pro is $2,000/month (billed monthly) or $20,000/year — 2 months free. Founding customer rate locked in for life.
        </p>
        <a
          href="mailto:kuberan811@gmail.com?subject=DataByt%20Plan%20Upgrade%20Request"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#000000] text-white text-[13.5px] font-semibold hover:bg-[#111111] transition-colors"
        >
          Talk to us about upgrading
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
