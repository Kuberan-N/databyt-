"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Building2, Globe, Mail, Clock, CheckCircle, AlertCircle, User, Shield } from "lucide-react";
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

export default function SettingsPage() {
  const { organization, orgUser, user, refreshOrganization } = useAuth();

  const [orgName, setOrgName]               = useState("");
  const [timezone, setTimezone]             = useState("America/New_York");
  const [currency, setCurrency]             = useState("USD");
  const [emailSignature, setEmailSignature] = useState("");
  const [saving, setSaving]                 = useState(false);
  const [status, setStatus]                 = useState<"idle" | "success" | "error">("idle");
  const [statusMsg, setStatusMsg]           = useState("");

  // Load existing values
  useEffect(() => {
    if (organization) setOrgName(organization.name);
    if (!organization) return;

    db
      .from("org_settings")
      .select("*")
      .eq("org_id", organization.id)
      .single()
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

    // Update org name
    const { error: orgErr } = await db
      .from("organizations")
      .update({ name: orgName.trim() })
      .eq("id", organization.id);

    // Upsert org settings
    const { error: settingsErr } = await db
      .from("org_settings")
      .upsert({
        org_id: organization.id,
        timezone,
        currency,
        email_signature: emailSignature,
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

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-white">Settings</h2>
        <p className="text-surface-400 text-sm mt-1">Manage your company profile and preferences.</p>
      </div>

      {status !== "idle" && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm ${
            status === "success"
              ? "bg-success-500/10 border border-success-500/20 text-success-400"
              : "bg-danger-500/10 border border-danger-500/20 text-danger-400"
          }`}
        >
          {status === "success"
            ? <CheckCircle className="w-4 h-4 shrink-0" />
            : <AlertCircle className="w-4 h-4 shrink-0" />}
          {statusMsg}
        </motion.div>
      )}

      <form onSubmit={handleSave} className="space-y-5">
        {/* Company Info */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 space-y-5"
        >
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-4 h-4 text-surface-400" />
            <h3 className="text-sm font-semibold text-white">Company Info</h3>
          </div>

          <div>
            <label className="text-surface-300 text-sm font-medium mb-2 block">Company Name</label>
            <input
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder="Acme Corp"
              className="w-full bg-surface-800/50 border border-surface-700 rounded-xl px-4 py-3 text-white placeholder-surface-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 outline-none transition-all text-sm"
              required
            />
          </div>
        </motion.div>

        {/* Regional Settings */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass rounded-2xl p-6 space-y-5"
        >
          <div className="flex items-center gap-2 mb-1">
            <Globe className="w-4 h-4 text-surface-400" />
            <h3 className="text-sm font-semibold text-white">Regional</h3>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-surface-300 text-sm font-medium mb-2 block">
                <Clock className="w-3.5 h-3.5 inline mr-1.5 text-surface-500" />
                Timezone
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full bg-surface-800/50 border border-surface-700 rounded-xl px-4 py-3 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 outline-none transition-all text-sm appearance-none"
              >
                {timezones.map((tz) => (
                  <option key={tz} value={tz}>{tz.replace("_", " ")}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-surface-300 text-sm font-medium mb-2 block">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-surface-800/50 border border-surface-700 rounded-xl px-4 py-3 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 outline-none transition-all text-sm appearance-none"
              >
                {currencies.map((c) => (
                  <option key={c.code} value={c.code}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Email Signature */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6 space-y-4"
        >
          <div className="flex items-center gap-2 mb-1">
            <Mail className="w-4 h-4 text-surface-400" />
            <h3 className="text-sm font-semibold text-white">Email Signature</h3>
          </div>
          <p className="text-surface-500 text-xs -mt-2">
            Appended to all collection emails sent on your behalf.
          </p>
          <textarea
            value={emailSignature}
            onChange={(e) => setEmailSignature(e.target.value)}
            rows={4}
            placeholder={`Best regards,\nThe ${orgName || "Finance"} Team\nphone: +1 (555) 000-0000`}
            className="w-full bg-surface-800/50 border border-surface-700 rounded-xl px-4 py-3 text-white placeholder-surface-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 outline-none transition-all text-sm resize-none font-mono"
          />
        </motion.div>

        {/* Save */}
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-semibold hover:from-primary-500 hover:to-accent-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {saving
            ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : <Save className="w-4 h-4" />}
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </form>

      {/* Account Info — read only */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass rounded-2xl p-6 space-y-4"
      >
        <div className="flex items-center gap-2 mb-1">
          <User className="w-4 h-4 text-surface-400" />
          <h3 className="text-sm font-semibold text-white">Your Account</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-surface-500 text-xs mb-1">Email</p>
            <p className="text-white">{user?.email ?? "—"}</p>
          </div>
          <div>
            <p className="text-surface-500 text-xs mb-1">Role</p>
            <p className="text-white capitalize">{orgUser?.role ?? "admin"}</p>
          </div>
          <div>
            <p className="text-surface-500 text-xs mb-1">Plan</p>
            <p className="text-white capitalize">{organization?.plan_tier ?? "starter"}</p>
          </div>
          <div>
            <p className="text-surface-500 text-xs mb-1">Member since</p>
            <p className="text-white">
              {organization?.created_at
                ? new Date(organization.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
                : "—"}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Security */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-surface-400" />
          <h3 className="text-sm font-semibold text-white">Security</h3>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-surface-300">Password</p>
            <p className="text-xs text-surface-500 mt-0.5">Change your account password</p>
          </div>
          <a
            href="/auth/reset-password"
            className="text-xs text-primary-400 font-medium px-3 py-1.5 rounded-lg border border-primary-500/20 bg-primary-500/10 hover:bg-primary-500/15 transition-colors"
          >
            Change Password
          </a>
        </div>
      </motion.div>
    </div>
  );
}
