import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service — DataByt",
  description: "The terms that govern your use of DataByt.",
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="June 2026"
      intro="These terms govern your use of DataByt. By creating an account or using the service, you agree to them. We've written them to be readable, not to trap you."
      sections={[
        {
          heading: "The service",
          body: [
            "DataByt is software that automates accounts receivable collections — sending reminder emails, tracking invoices, managing disputes, and reporting on your AR. You remain responsible for the accuracy of the data you upload and for the customers you choose to contact.",
          ],
        },
        {
          heading: "Your account",
          body: [
            "You must provide accurate information and keep your login secure. You're responsible for activity under your account.",
            "You must have the right to upload the customer and invoice data you bring into DataByt.",
          ],
        },
        {
          heading: "Acceptable use",
          body: [
            "Use DataByt only to collect legitimate debts owed to your business. Do not use it for harassment, spam unrelated to genuine invoices, or any unlawful purpose.",
            "Dunning emails you send must comply with applicable laws (e.g. CAN-SPAM in the US, GDPR/PECR in the EU/UK). DataByt provides compliant tooling; lawful use is your responsibility.",
          ],
        },
        {
          heading: "Plans and billing",
          body: [
            "Paid plans are billed in advance on a monthly or annual basis. Founding-customer rates, where offered, are honored for as long as your subscription remains active.",
            "You can cancel anytime; your access continues to the end of the current billing period. We don't offer prorated refunds for partial periods unless required by law.",
          ],
        },
        {
          heading: "Data and portability",
          body: [
            "Your data is yours. You can export it at any time, and we delete it on request. There is no lock-in.",
          ],
        },
        {
          heading: "Availability and liability",
          body: [
            "We work hard to keep DataByt reliable but provide the service \"as is\" without warranties of uninterrupted availability. To the maximum extent permitted by law, our liability is limited to the fees you paid in the prior 12 months.",
          ],
        },
        {
          heading: "Changes and contact",
          body: [
            "We may update these terms; material changes will be communicated. Questions? Email support@databyt.in.",
          ],
        },
      ]}
    />
  );
}
