import Link from "next/link";

export default function PaySuccessPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FC] flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm px-8 py-12">
          <div className="w-16 h-16 rounded-full bg-[#F0FDF4] flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-[#16A34A]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-[#0F172A] mb-2">Payment received</h1>
          <p className="text-[#222222] text-sm leading-relaxed">
            Thank you — your payment has been processed successfully.
            You will receive a confirmation email shortly.
          </p>

          <div className="mt-8 p-4 rounded-xl bg-[#F8F9FC] border border-[#E2E8F0] text-left space-y-1">
            <p className="text-xs text-[#333333]">What happens next</p>
            <p className="text-sm text-[#0F172A]">Your invoice will be marked as paid and collections activity will stop automatically.</p>
          </div>

          <div className="mt-6 pt-6 border-t border-[#F1F5F9]">
            <p className="text-xs text-[#333333]">
              Powered by{" "}
              <span className="font-semibold text-[#D97706]">DataByt</span>
              {" "}· Payments by Dodo Payments
            </p>
          </div>
        </div>

        <Link
          href="/"
          className="mt-6 inline-block text-sm text-[#333333] hover:text-[#222222] transition-colors"
        >
          Return to homepage
        </Link>
      </div>
    </div>
  );
}
