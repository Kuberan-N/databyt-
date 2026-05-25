"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function UnsubscribeContent() {
  const params  = useSearchParams();
  const success = params.get("success") === "1";
  const email   = params.get("email");
  const error   = params.get("error");

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm px-8 py-12">
          {success ? (
            <>
              <div className="w-14 h-14 rounded-full bg-[#F0FDF4] flex items-center justify-center mx-auto mb-5">
                <svg className="w-7 h-7 text-[#16A34A]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-[#0F172A] mb-2">You've been unsubscribed</h1>
              <p className="text-[#222222] text-sm leading-relaxed">
                {email ? (
                  <><span className="font-medium text-[#0F172A]">{email}</span> will no longer receive collection reminders.</>
                ) : (
                  "You will no longer receive collection reminders."
                )}
              </p>
              <p className="text-[#333333] text-xs mt-4 leading-relaxed">
                If you have outstanding invoices, please contact the sender directly to arrange payment.
              </p>
            </>
          ) : error ? (
            <>
              <div className="w-14 h-14 rounded-full bg-[#ECFDF5] flex items-center justify-center mx-auto mb-5">
                <svg className="w-7 h-7 text-[#DC2626]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-[#0F172A] mb-2">Invalid unsubscribe link</h1>
              <p className="text-[#222222] text-sm">
                This link may have expired or is invalid. Please contact the sender directly to opt out.
              </p>
            </>
          ) : (
            <>
              <div className="w-5 h-5 border-2 border-[#059669]/20 border-t-[#059669] rounded-full animate-spin mx-auto mb-4" />
              <p className="text-[#222222] text-sm">Processing…</p>
            </>
          )}

          <div className="mt-8 pt-6 border-t border-[#F1F5F9]">
            <p className="text-xs text-[#333333]">
              Powered by <span className="font-semibold text-[#059669]">DataByt</span>
            </p>
          </div>
        </div>

        <Link href="/" className="mt-5 inline-block text-sm text-[#333333] hover:text-[#222222] transition-colors">
          Return to homepage
        </Link>
      </div>
    </div>
  );
}
