import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import PayButton from "./PayButton";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabaseAdmin as any;

const fmt = (n: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 2 }).format(n);

export default async function PayInvoicePage({
  params,
}: {
  params: Promise<{ invoiceId: string }>;
}) {
  const { invoiceId } = await params;

  const { data: invoice } = await db
    .from("invoices")
    .select("*, customers(name, email), organizations(name)")
    .eq("id", invoiceId)
    .single();

  if (!invoice) notFound();

  const org = invoice.organizations;
  const customer = invoice.customers;
  const isPaid = invoice.status === "paid";

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-[#E8242A] flex items-center justify-center mx-auto mb-3">
            <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
              <path
                d="M6 6H14C18.4183 6 22 9.58172 22 14C22 18.4183 18.4183 22 14 22H6V6Z"
                fill="white"
              />
              <rect x="6" y="6" width="4" height="16" fill="#E8242A" />
            </svg>
          </div>
          <p className="text-xs font-semibold text-[#E8242A] uppercase tracking-widest">DataByt</p>
          <p className="text-[#94A3B8] text-sm mt-1">Secure payment portal</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
          {/* Invoice header */}
          <div className="px-6 py-5 border-b border-[#F1F5F9]">
            <p className="text-xs text-[#94A3B8] font-medium uppercase tracking-wider mb-1">Invoice from</p>
            <p className="text-[#0F172A] font-semibold text-base">{org?.name ?? "Unknown Company"}</p>
          </div>

          {/* Invoice details */}
          <div className="px-6 py-5 space-y-3">
            {[
              { label: "Invoice number", value: invoice.invoice_number },
              { label: "Bill to",        value: customer?.name ?? "—" },
              { label: "Issue date",     value: new Date(invoice.issue_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) },
              { label: "Due date",       value: new Date(invoice.due_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center">
                <span className="text-[#94A3B8] text-sm">{label}</span>
                <span className="text-[#0F172A] text-sm font-medium">{value}</span>
              </div>
            ))}
          </div>

          {/* Amount */}
          <div className="px-6 py-5 bg-[#FAFAFA] border-t border-[#F1F5F9] border-b">
            <div className="flex justify-between items-center">
              <span className="text-[#64748B] text-sm font-medium">Amount due</span>
              <span className="text-[#0F172A] text-2xl font-bold">
                {fmt(invoice.amount, invoice.currency ?? "USD")}
              </span>
            </div>
          </div>

          {/* CTA */}
          <div className="px-6 py-5">
            {isPaid ? (
              <div className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0]">
                <svg className="w-4 h-4 text-[#16A34A]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-[#16A34A] text-sm font-semibold">This invoice has been paid</span>
              </div>
            ) : (
              <PayButton invoiceId={invoiceId} orgId={invoice.org_id} amount={invoice.amount} currency={invoice.currency ?? "USD"} />
            )}

            <p className="text-center text-xs text-[#94A3B8] mt-4">
              Secured by DataByt &middot; Payments processed by Dodo Payments
            </p>
          </div>
        </div>

        {invoice.status === "disputed" && (
          <p className="text-center text-xs text-[#D97706] mt-4">
            This invoice is under dispute. Please contact the sender before paying.
          </p>
        )}
      </div>
    </div>
  );
}
