"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, Mail, CheckCircle, ArrowRight, ArrowLeft,
  AlertCircle, Upload, Send,
} from "lucide-react";

type Step = "org" | "contact" | "confirm" | "done";

interface FormState {
  orgName: string;
  planTier: "starter" | "growth" | "scale";
  mrr: string;
  contractStart: string;
  contractEnd: string;
  clientEmail: string;
}

const PLAN_OPTIONS = [
  { value: "starter", label: "Starter", desc: "Up to 50 customers" },
  { value: "growth",  label: "Growth",  desc: "Up to 200 customers" },
  { value: "scale",   label: "Scale",   desc: "Unlimited" },
] as const;

const adminSecret = process.env.ADMIN_SECRET ?? "databyt-admin-2024";

export default function AdminOnboarding() {
  const [step, setStep] = useState<Step>("org");
  const [form, setForm] = useState<FormState>({
    orgName: "", planTier: "starter", mrr: "",
    contractStart: "", contractEnd: "", clientEmail: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ orgId: string; orgName: string; inviteSent: boolean; inviteError?: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  function set(field: keyof FormState, value: string) {
    setForm(f => ({ ...f, [field]: value }));
  }

  async function submit() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-secret": adminSecret },
        body: JSON.stringify({
          orgName: form.orgName.trim(),
          planTier: form.planTier,
          mrr: form.mrr ? parseFloat(form.mrr) : undefined,
          contractStart: form.contractStart || undefined,
          contractEnd: form.contractEnd || undefined,
          clientEmail: form.clientEmail.trim().toLowerCase(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Onboarding failed");
      setResult(data);
      setStep("done");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setStep("org");
    setForm({ orgName: "", planTier: "starter", mrr: "", contractStart: "", contractEnd: "", clientEmail: "" });
    setResult(null);
    setError(null);
  }

  const stepIndex = (["org", "contact", "confirm", "done"] as Step[]).indexOf(step);

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-white">Onboard New Client</h2>
        <p className="text-surface-400 text-sm mt-1">Create a client organization and send their invite.</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {[
          { key: "org",     label: "Organization" },
          { key: "contact", label: "Contact" },
          { key: "confirm", label: "Confirm" },
          { key: "done",    label: "Done" },
        ].map((s, i) => (
          <div key={s.key} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              i < stepIndex ? "bg-success-500 text-white" :
              i === stepIndex ? "bg-primary-500 text-white" :
              "bg-surface-800 text-surface-500"
            }`}>
              {i < stepIndex ? <CheckCircle className="w-3.5 h-3.5" /> : i + 1}
            </div>
            <span className={`text-xs font-medium ${i === stepIndex ? "text-white" : "text-surface-500"}`}>{s.label}</span>
            {i < 3 && <div className="w-8 h-px bg-surface-800" />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* Step 1: Organization details */}
        {step === "org" && (
          <motion.div key="org" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="glass rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-4 h-4 text-primary-400" />
              <h3 className="text-sm font-semibold text-white">Organization Details</h3>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-surface-400 uppercase tracking-wider mb-1.5">Company Name *</label>
              <input value={form.orgName} onChange={e => set("orgName", e.target.value)}
                placeholder="Acme Corp"
                className="w-full bg-surface-800 border border-surface-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-surface-500 focus:border-primary-500 focus:outline-none" />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-surface-400 uppercase tracking-wider mb-2">Plan Tier</label>
              <div className="grid grid-cols-3 gap-2">
                {PLAN_OPTIONS.map(p => (
                  <button key={p.value} onClick={() => set("planTier", p.value)}
                    className={`px-3 py-3 rounded-xl border text-left transition-all ${
                      form.planTier === p.value
                        ? "border-primary-500/50 bg-primary-500/10"
                        : "border-surface-700 hover:border-surface-600"
                    }`}>
                    <p className={`text-sm font-semibold ${form.planTier === p.value ? "text-primary-400" : "text-white"}`}>{p.label}</p>
                    <p className="text-[10px] text-surface-500 mt-0.5">{p.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-surface-400 uppercase tracking-wider mb-1.5">Monthly Retainer (MRR) — optional</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-500 text-sm">$</span>
                <input type="number" value={form.mrr} onChange={e => set("mrr", e.target.value)}
                  placeholder="3000"
                  className="w-full bg-surface-800 border border-surface-700 rounded-xl pl-7 pr-4 py-2.5 text-sm text-white placeholder-surface-500 focus:border-primary-500 focus:outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-semibold text-surface-400 uppercase tracking-wider mb-1.5">Contract Start — optional</label>
                <input type="date" value={form.contractStart} onChange={e => set("contractStart", e.target.value)}
                  className="w-full bg-surface-800 border border-surface-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-primary-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-surface-400 uppercase tracking-wider mb-1.5">Contract End — optional</label>
                <input type="date" value={form.contractEnd} onChange={e => set("contractEnd", e.target.value)}
                  className="w-full bg-surface-800 border border-surface-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-primary-500 focus:outline-none" />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button onClick={() => setStep("contact")} disabled={!form.orgName.trim()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-all disabled:opacity-40">
                Next <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Client contact */}
        {step === "contact" && (
          <motion.div key="contact" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="glass rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="w-4 h-4 text-primary-400" />
              <h3 className="text-sm font-semibold text-white">Client Contact</h3>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-surface-400 uppercase tracking-wider mb-1.5">Client Email Address *</label>
              <input type="email" value={form.clientEmail} onChange={e => set("clientEmail", e.target.value)}
                placeholder="cfo@acmecorp.com"
                className="w-full bg-surface-800 border border-surface-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-surface-500 focus:border-primary-500 focus:outline-none" />
              <p className="text-[10px] text-surface-500 mt-1.5">Supabase will send an invite link to this address. The client sets their own password.</p>
            </div>

            <div className="flex justify-between pt-1">
              <button onClick={() => setStep("org")}
                className="flex items-center gap-1.5 text-sm text-surface-400 hover:text-white transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              <button onClick={() => setStep("confirm")} disabled={!form.clientEmail.trim() || !form.clientEmail.includes("@")}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-all disabled:opacity-40">
                Review <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Confirm */}
        {step === "confirm" && (
          <motion.div key="confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="space-y-4">
            <div className="glass rounded-2xl p-6 space-y-3">
              <h3 className="text-sm font-semibold text-white mb-4">Review & Confirm</h3>
              {[
                ["Company",        form.orgName],
                ["Plan",           form.planTier],
                ["MRR",            form.mrr ? `$${parseFloat(form.mrr).toLocaleString()}/mo` : "—"],
                ["Contract Start", form.contractStart || "—"],
                ["Contract End",   form.contractEnd || "—"],
                ["Client Email",   form.clientEmail],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-surface-800 last:border-0">
                  <span className="text-xs text-surface-500">{label}</span>
                  <span className="text-sm text-white font-medium">{value}</span>
                </div>
              ))}
            </div>

            <div className="glass rounded-xl px-4 py-3 flex items-center gap-3">
              <Send className="w-4 h-4 text-primary-400 shrink-0" />
              <p className="text-xs text-surface-300">
                This will create the org and email <span className="text-white font-medium">{form.clientEmail}</span> an invite link.
                They&apos;ll land on <span className="text-primary-400">/dashboard</span> after signing in.
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-danger-500/10 border border-danger-500/20 text-danger-400 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <div className="flex justify-between">
              <button onClick={() => setStep("contact")}
                className="flex items-center gap-1.5 text-sm text-surface-400 hover:text-white transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              <button onClick={submit} disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-all disabled:opacity-50">
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating...</>
                ) : (
                  <><CheckCircle className="w-4 h-4" /> Create & Send Invite</>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 4: Done */}
        {step === "done" && result && (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-2xl p-8 text-center space-y-5">
            <CheckCircle className="w-14 h-14 text-success-400 mx-auto" />
            <div>
              <h3 className="text-lg font-bold text-white">{result.orgName} is onboarded</h3>
              <p className="text-surface-400 text-sm mt-1">
                {result.inviteSent
                  ? `Invite sent to ${form.clientEmail}`
                  : `Org created. Invite failed: ${result.inviteError} — re-invite from Supabase dashboard.`}
              </p>
            </div>

            {!result.inviteSent && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-warning-400/10 border border-warning-400/20 text-warning-400 text-xs text-left">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Org ID: <code className="font-mono">{result.orgId}</code> — go to Supabase Auth → Users to manually send the invite.</span>
              </div>
            )}

            <div className="flex items-center justify-center gap-3 flex-wrap">
              <a href={`/admin/import`}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-all">
                <Upload className="w-3.5 h-3.5" /> Import Their AR Data
              </a>
              <button onClick={reset}
                className="px-4 py-2 rounded-xl border border-surface-700 text-surface-400 text-sm hover:text-white hover:border-surface-600 transition-all">
                Onboard Another Client
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
