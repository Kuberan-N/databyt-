"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Building2, Globe, Mail, Clock, CheckCircle, AlertCircle, User, Shield, Lightbulb, Send } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

const timezones = [
  "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles",
  "America/Toronto", "America/Vancouver", "Europe/London", "Europe/Paris",
  "Europe/Berlin", "Europe/Amsterdam", "Asia/Dubai", "Asia/Singapore",
  "Australia/Sydney", "Pacific/Auckland",
];

const currencies = [
  { code: "USD", label: "USD — US Dollar" },
  { code: "EUR", label: "EUR — Euro" },
  { code: "GBP", label: "GBP — British Pound" },
  { code: "CAD", label: "CAD — Canadian Dollar" },
  { code: "AUD", label: "AUD — Australian Dollar" },
  { code: "SGD", label: "SGD — Singapore Dollar" },
  { code: "AED", label: "AED — UAE Dirham" },
];

const inputCls = "w-full bg-white border border-[#E2E8F0] rounded-xl px-4 py-3 text-[#0F172A] placeholder-[#333333] focus:border-[#000000] focus:ring-1 focus:ring-[#000000]/20 outline-none transition-all text-sm";
const selectCls = "w-full bg-white border border-[#E2E8F0] rounded-xl px-4 py-3 text-[#0F172A] focus:border-[#000000] focus:ring-1 focus:ring-[#000000]/20 outline-none transition-all text-sm appearance-none";

export default function SettingsPage() {
  const { organization, orgUser, user, refreshOrganization } = useAuth();

  const [orgName, setOrgName]               = useState("");
  const [timezone, setTimezone]             = useState("America/New_York");
  const [currency, setCurrency]             = useState("USD");
  const [emailSignature, setEmailSignature] = useState("");
  const [saving, setSaving]                 = useState(false);
  const [status, setStatus]                 = useState<"idle" | "success" | "error">("idle");
  const [statusMsg, setStatusMsg]           = useState("");

  const [frTitle, setFrTitle]           = useState("");
  const [frCategory, setFrCategory]     = useState("Collections");
  const [frDesc, setFrDesc]             = useState("");
  const [frSending, setFrSending]       = useState(false);
  const [frStatus, setFrStatus]         = useState<"idle" | "sent" | "error">("idle");

  useEffect(() => {
    if (organization) setOrgName(organization.name);
    if (!organization) return;
    db.from("org_settings").select("*").eq("org_id", organization.id).single()
      .then(({ data }: { data: { timezone: string; currency: string; email_signature: string } | null }) => {
        if (data) {
          setTimezone(data.timezone ?? "America/New_York");
          setCurrency(data.currency ?? "USD");
          setEmailSignature(data.email_signature ?? "");
        }
      });
  }, [organization]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!organization) return;
    setSaving(true);
    setStatus("idle");

    const { error: orgErr } = await db
      .from("organizations").update({ name: orgName.trim() }).eq("id", organization.id);

    const { error: settingsErr } = await db.from("org_settings").upsert({
      org_id: organization.id, timezone, currency, email_signature: emailSignature,
      updated_at: new Date().toISOString(),
    }, { onConflict: "org_id" });

    setSaving(false);
    if (orgErr || settingsErr) {
      setStatus("error");
      setStatusMsg(orgErr?.message ?? settingsErr?.message ?? "Failed to save.");
    } else {
      setStatus("success");
      setStatusMsg("Settings saved successfully.");
      await refreshOrganization();
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  async function handleFeatureRequest(e: React.FormEvent) {
    e.preventDefault();
    setFrSending(true);
    setFrStatus("idle");
    try {
      const res = await fetch("/api/feature-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: frTitle,
          description: frDesc,
          category: frCategory,
          userEmail: user?.email,
          orgName: organization?.name,
        }),
      });
      if (!res.ok) throw new Error();
      setFrStatus("sent");
      setFrTitle(""); setFrDesc(""); setFrCategory("Collections");
    } catch {
      setFrStatus("error");
    }
    setFrSending(false);
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-[#0F172A]">Settings</h2>
        <p className="text-[#222222] text-sm mt-1">Manage your company profile and preferences.</p>
      </div>

      {status !== "idle" && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm ${
            status === "success"
              ? "bg-[#F0FDF4] border border-[#BBF7D0] text-[#16A34A]"
              : "bg-[#F3F3F3] border border-[#FECACA] text-[#DC2626]"
          }`}>
          {status === "success" ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          {statusMsg}
        </motion.div>
      )}

      <form onSubmit={handleSave} className="space-y-5">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-4 h-4 text-[#333333]" />
            <h3 className="text-sm font-semibold text-[#0F172A]">Company Info</h3>
          </div>
          <div>
            <label className="text-[#111111] text-sm font-medium mb-2 block">Company Name</label>
            <input type="text" value={orgName} onChange={(e) => setOrgName(e.target.value)}
              placeholder="Acme Corp" className={inputCls} required />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="glass rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-2 mb-1">
            <Globe className="w-4 h-4 text-[#333333]" />
            <h3 className="text-sm font-semibold text-[#0F172A]">Regional</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[#111111] text-sm font-medium mb-2 block">
                <Clock className="w-3.5 h-3.5 inline mr-1.5 text-[#333333]" />Timezone
              </label>
              <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className={selectCls}>
                {timezones.map((tz) => <option key={tz} value={tz}>{tz.replace("_", " ")}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[#111111] text-sm font-medium mb-2 block">Currency</label>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)} className={selectCls}>
                {currencies.map((c) => <option key={c.code} value={c.code}>{c.label}</option>)}
              </select>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Mail className="w-4 h-4 text-[#333333]" />
            <h3 className="text-sm font-semibold text-[#0F172A]">Email Signature</h3>
          </div>
          <p className="text-[#333333] text-xs -mt-2">Appended to all collection emails sent on your behalf.</p>
          <textarea value={emailSignature} onChange={(e) => setEmailSignature(e.target.value)}
            rows={4} placeholder={`Best regards,\nThe ${orgName || "Finance"} Team`}
            className="w-full bg-white border border-[#E2E8F0] rounded-xl px-4 py-3 text-[#0F172A] placeholder-[#333333] focus:border-[#000000] focus:ring-1 focus:ring-[#000000]/20 outline-none transition-all text-sm resize-none font-mono" />
        </motion.div>

        <button type="submit" disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-[#000000] text-white rounded-xl font-semibold hover:bg-[#111111] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm">
          {saving
            ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : <Save className="w-4 h-4" />}
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </form>

      {/* Account Info */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="glass rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <User className="w-4 h-4 text-[#333333]" />
          <h3 className="text-sm font-semibold text-[#0F172A]">Your Account</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          {[
            { label: "Email", value: user?.email ?? "—" },
            { label: "Role", value: orgUser?.role ?? "admin" },
            { label: "Plan", value: organization?.plan_tier ?? "starter" },
            { label: "Member since", value: organization?.created_at
              ? new Date(organization.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
              : "—" },
          ].map(f => (
            <div key={f.label}>
              <p className="text-[#333333] text-xs mb-1">{f.label}</p>
              <p className="text-[#0F172A] capitalize">{f.value}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Security */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-[#333333]" />
          <h3 className="text-sm font-semibold text-[#0F172A]">Security</h3>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[#0F172A]">Password</p>
            <p className="text-xs text-[#333333] mt-0.5">Change your account password</p>
          </div>
          <a href="/auth/reset-password"
            className="text-xs text-[#000000] font-medium px-3 py-1.5 rounded-lg border border-[#000000]/20 bg-[#F3F3F3] hover:bg-[#EBEBEB] transition-colors">
            Change Password
          </a>
        </div>
      </motion.div>

      {/* Feature Request */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        className="glass rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-1">
          <Lightbulb className="w-4 h-4 text-[#333333]" />
          <h3 className="text-sm font-semibold text-[#0F172A]">Request a Feature</h3>
        </div>
        <p className="text-xs text-[#555555] mb-5">
          Tell us what would make DataByt better for you. We review every request and reply within{" "}
          <strong className="text-[#0F172A]">2 working days</strong> — whether it&apos;s feasible or not.
        </p>

        {frStatus === "sent" ? (
          <div className="flex items-start gap-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl px-4 py-4">
            <CheckCircle className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-[#16A34A]">Request sent!</p>
              <p className="text-xs text-[#555555] mt-0.5">
                We&apos;ll email you at <strong>{user?.email}</strong> within 2 working days with our assessment.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleFeatureRequest} className="space-y-4">
            {frStatus === "error" && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                Failed to send. Please try again.
              </div>
            )}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[#111111] text-xs font-medium mb-1.5 block">Feature title</label>
                <input
                  type="text"
                  value={frTitle}
                  onChange={e => setFrTitle(e.target.value)}
                  placeholder="e.g. Bulk email pause"
                  className={inputCls}
                  required
                />
              </div>
              <div>
                <label className="text-[#111111] text-xs font-medium mb-1.5 block">Category</label>
                <select value={frCategory} onChange={e => setFrCategory(e.target.value)} className={selectCls}>
                  {["Collections","Disputes","Analytics","Integrations","Reports","Payments","UI / UX","Other"].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-[#111111] text-xs font-medium mb-1.5 block">Description</label>
              <textarea
                value={frDesc}
                onChange={e => setFrDesc(e.target.value)}
                rows={4}
                placeholder="Describe what you'd like to do and why it matters to your team..."
                className="w-full bg-white border border-[#E2E8F0] rounded-xl px-4 py-3 text-[#0F172A] placeholder-[#999] focus:border-[#000000] focus:ring-1 focus:ring-[#000000]/20 outline-none transition-all text-sm resize-none"
                required
              />
            </div>
            <button
              type="submit"
              disabled={frSending}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#000000] text-white rounded-xl text-sm font-semibold hover:bg-[#111111] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {frSending
                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <Send className="w-3.5 h-3.5" />
              }
              {frSending ? "Sending..." : "Submit Request"}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
