import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Security — DataByt",
  description: "How DataByt protects your data.",
};

export default function SecurityPage() {
  return (
    <LegalPage
      title="Security"
      updated="June 2026"
      intro="DataByt handles your invoices and customer data, so security isn't an afterthought — it's built into how the product works. Here's how we protect your information."
      sections={[
        {
          heading: "Encryption",
          body: [
            "Data is encrypted in transit (TLS) and at rest. Credentials and secrets are never stored in plain text.",
          ],
        },
        {
          heading: "Tenant isolation",
          body: [
            "Every organisation's data is strictly isolated using row-level security. One customer can never read, query, or access another customer's invoices, customers, or analytics — enforced at the database layer, not just the application.",
          ],
        },
        {
          heading: "Access control",
          body: [
            "Access to production data is limited to what's required to operate the service. Sensitive keys are stored in a secrets manager, never in source code.",
          ],
        },
        {
          heading: "Infrastructure",
          body: [
            "DataByt runs on trusted, audited cloud infrastructure (including Supabase and managed cloud hosting) with their own SOC 2 / ISO-grade controls. We rely on their hardened platforms rather than rolling our own.",
          ],
        },
        {
          heading: "Email integrity",
          body: [
            "Outbound emails are sent through a reputable provider with authentication (SPF/DKIM) to protect deliverability and prevent spoofing. All collection emails are CAN-SPAM compliant.",
          ],
        },
        {
          heading: "Your control",
          body: [
            "You can export or delete all your data at any time. There is no lock-in, and account deletion removes your data within 30 days.",
          ],
        },
        {
          heading: "Reporting an issue",
          body: [
            "Found a vulnerability or have a security question? Email support@databyt.in and we'll respond quickly. Responsible disclosure is always welcome.",
          ],
        },
      ]}
    />
  );
}
