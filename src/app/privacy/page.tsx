import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy — DataByt",
  description: "How DataByt collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="June 2026"
      intro="DataByt provides AI-powered accounts receivable automation for B2B businesses. This policy explains what data we collect, why, and the choices you have. We keep it plain and short on purpose."
      sections={[
        {
          heading: "What we collect",
          body: [
            "Account data you provide: your name, work email, company name, and login credentials.",
            "AR data you connect or import: invoices, customer names and emails, amounts, due dates, and payment status — used solely to run collections on your behalf.",
            "Usage data: basic analytics about how you use the dashboard so we can improve it.",
          ],
        },
        {
          heading: "How we use it",
          body: [
            "To operate the service: send dunning emails, track invoices, manage disputes, and show your analytics.",
            "To support you and improve the product.",
            "We do not sell your data, and we never share your customer lists with third parties for their own marketing.",
          ],
        },
        {
          heading: "Where it lives",
          body: [
            "Your data is stored in encrypted databases and isolated per organisation, so one customer can never access another's data.",
            "We use trusted infrastructure providers (such as Supabase and cloud hosting) bound by their own security and privacy commitments.",
          ],
        },
        {
          heading: "Your rights",
          body: [
            "You can access, correct, export, or delete your data at any time from your account or by emailing us.",
            "If you are in the EU/UK, you have rights under GDPR including access, rectification, erasure, and portability. We act as a data processor for the AR data you upload.",
            "Delete your account and we remove your data within 30 days, except where law requires us to retain records.",
          ],
        },
        {
          heading: "Email and compliance",
          body: [
            "Dunning emails sent through DataByt are CAN-SPAM compliant and include an unsubscribe mechanism. You control the content, tone, and timing.",
          ],
        },
        {
          heading: "Changes",
          body: [
            "We'll update this policy as the product evolves and post the date of the latest change at the top.",
          ],
        },
      ]}
    />
  );
}
