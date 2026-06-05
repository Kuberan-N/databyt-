"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { CheckCircle, AlertCircle, RefreshCw, Plug, Clock, Sparkles, Database } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import type { IntegrationStatus } from "@/types/database";

interface IntegrationInfo {
  status: IntegrationStatus | null;
  last_sync_at: string | null;
  last_sync_count: number | null;
  error_message: string | null;
}

interface ProviderConfig {
  key: string;
  label: string;
  description: string;
  logo: React.ReactNode;
  apiRoute: string;
  syncRoute: string;
}

const providers: ProviderConfig[] = [
  {
    key: "quickbooks",
    label: "QuickBooks Online",
    description: "Sync open invoices and customers via the QuickBooks Accounting API. AR aging updates daily.",
    apiRoute: "/api/integrations/quickbooks",
    syncRoute: "/api/integrations/quickbooks/sync",
    logo: (
      <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
        <rect width="40" height="40" rx="8" fill="#2CA01C" />
        <circle cx="20" cy="20" r="10" fill="white" />
        <circle cx="20" cy="20" r="7" fill="#2CA01C" />
        <rect x="18" y="13" width="4" height="14" rx="2" fill="white" />
        <rect x="13" y="18" width="14" height="4" rx="2" fill="white" />
      </svg>
    ),
  },
  {
    key: "xero",
    label: "Xero",
    description: "Pull outstanding sales invoices from Xero Accounting. Automatically matched to your AR aging.",
    apiRoute: "/api/integrations/xero",
    syncRoute: "/api/integrations/xero/sync",
    logo: (
      <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
        <rect width="40" height="40" rx="8" fill="#13B5EA" />
        <path d="M10 14L20 20L10 26" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M30 14L20 20L30 26" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

function StatusBadge({ status }: { status: IntegrationStatus | null }) {
  if (!status || status === "disconnected") {
    return <span className="text-xs text-[#64748B] font-medium">Not connected</span>;
  }
  const styles: Record<string, { bg: string; text: string; label: string }> = {
    connected: { bg: "bg-[#F0FDF4]", text: "text-[#16A34A]", label: "Connected" },
    syncing:   { bg: "bg-[#F1F5F9]", text: "text-[#000000]", label: "Syncing..." },
    error:     { bg: "bg-[#FEF2F2]", text: "text-[#DC2626]", label: "Error" },
  };
  const s = styles[status] ?? styles.connected;
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.bg} ${s.text}`}>
      {s.label}
    </span>
  );
}

function IntegrationCard({
  provider,
  orgId,
  onFlash,
}: {
  provider: ProviderConfig;
  orgId: string;
  onFlash: (msg: string, ok: boolean) => void;
}) {
  const [info, setInfo] = useState<IntegrationInfo | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch(`${provider.apiRoute}?orgId=${orgId}`);
    const json = await res.json();
    setInfo(json.integration);
  }, [orgId, provider.apiRoute]);

  useEffect(() => { load(); }, [load]);

  const isConnected = info?.status === "connected" || info?.status === "syncing" || info?.status === "error";

  async function handleConnect() {
    setConnecting(true);
    try {
      const res = await fetch(provider.apiRoute, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orgId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed");
      window.location.href = json.url;
    } catch (err) {
      onFlash((err as Error).message, false);
      setConnecting(false);
    }
  }

  async function handleDisconnect() {
    await fetch(`${provider.apiRoute}?orgId=${orgId}`, { method: "DELETE" });
    setInfo(null);
    await load();
    onFlash(`${provider.label} disconnected`, true);
  }

  async function handleSync() {
    setSyncing(true);
    try {
      const res = await fetch(provider.syncRoute, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orgId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Sync failed");
      onFlash(`Synced ${json.imported ?? 0} records from ${provider.label}`, true);
      await load();
    } catch (err) {
      onFlash((err as Error).message, false);
    } finally {
      setSyncing(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-[#E2E8F0] p-6"
    >
      <div className="flex items-start gap-4">
        <div className="shrink-0">{provider.logo}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-[#0F172A]">{provider.label}</h3>
            <StatusBadge status={info?.status ?? null} />
          </div>
          <p className="text-xs text-[#475569] mt-1 leading-relaxed">{provider.description}</p>

          {isConnected && info?.last_sync_at && (
            <div className="flex items-center gap-1.5 mt-2 text-xs text-[#64748B]">
              <Clock className="w-3 h-3" />
              Last sync: {new Date(info.last_sync_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
              {info.last_sync_count != null && ` · ${info.last_sync_count} records`}
            </div>
          )}

          {info?.error_message && (
            <p className="text-xs text-[#DC2626] mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3 h-3 shrink-0" />
              {info.error_message}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isConnected ? (
            <>
              <button
                onClick={handleSync}
                disabled={syncing || info?.status === "syncing"}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#222222] border border-[#E2E8F0] rounded-lg hover:text-[#000000] hover:border-[#000000]/30 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`} />
                {syncing ? "Syncing..." : "Sync now"}
              </button>
              <button
                onClick={handleDisconnect}
                className="px-3 py-1.5 text-xs font-medium text-[#222222] border border-[#E2E8F0] rounded-lg hover:text-[#DC2626] hover:border-[#DC2626]/30 transition-all"
              >
                Disconnect
              </button>
            </>
          ) : (
            <button
              onClick={handleConnect}
              disabled={connecting}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[#000000] text-white rounded-lg hover:bg-[#111111] transition-colors disabled:opacity-50"
            >
              <Plug className="w-3.5 h-3.5" />
              {connecting ? "Redirecting..." : "Connect"}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function DemoDataCard({ orgId, onFlash }: { orgId: string; onFlash: (msg: string, ok: boolean) => void }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSeed() {
    setLoading(true);
    try {
      const res = await fetch("/api/demo/seed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orgId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to load sample data");
      setDone(true);
      onFlash(`Sample data loaded — ${json.invoices} invoices, ${json.customers} customers. Refresh your dashboard.`, true);
    } catch (err) {
      onFlash((err as Error).message, false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-[#F8F9FC] to-[#EEF2FF] rounded-2xl border border-[#E2E8F0] p-6"
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-[#4F46E5] flex items-center justify-center shrink-0">
          <Database className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-[#0F172A]">Load Sample Data</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EEF2FF] text-[#4F46E5] font-semibold">DEMO</span>
          </div>
          <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
            No accounting software? Load 15 realistic B2B customers and 70+ invoices across all aging buckets — so you can explore the full DataByt experience instantly.
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-[#666]">
            {["15 companies", "70+ invoices", "INR + USD", "Disputes", "Comms history"].map(t => (
              <span key={t} className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-[#4F46E5]" />{t}
              </span>
            ))}
          </div>
        </div>
        <div className="shrink-0">
          {done ? (
            <span className="flex items-center gap-1.5 text-xs font-medium text-[#16A34A]">
              <CheckCircle className="w-4 h-4" /> Loaded
            </span>
          ) : (
            <button onClick={handleSeed} disabled={loading}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[#4F46E5] text-white rounded-lg hover:bg-[#4338CA] transition-colors disabled:opacity-50">
              <Sparkles className="w-3.5 h-3.5" />
              {loading ? "Loading…" : "Load data"}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function IntegrationsContent() {
  const { organization } = useAuth();
  const params = useSearchParams();
  const [flash, setFlash] = useState<{ msg: string; ok: boolean } | null>(null);

  useEffect(() => {
    const connected = params.get("connected");
    const errorKey  = params.get("error");
    if (connected) setFlash({ msg: `${connected} connected successfully`, ok: true });
    if (errorKey)  setFlash({ msg: `Connection failed: ${errorKey.replace(/_/g, " ")}`, ok: false });
    if (connected || errorKey) {
      const url = new URL(window.location.href);
      url.searchParams.delete("connected");
      url.searchParams.delete("error");
      window.history.replaceState({}, "", url.toString());
    }
  }, [params]);

  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(null), 5000);
    return () => clearTimeout(t);
  }, [flash]);

  if (!organization) return null;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-[#0F172A]">Integrations</h2>
        <p className="text-[#475569] text-sm mt-1">
          Connect your accounting system to sync invoices and customers automatically.
        </p>
      </div>

      {flash && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm ${
            flash.ok
              ? "bg-[#F0FDF4] border border-[#BBF7D0] text-[#16A34A]"
              : "bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626]"
          }`}
        >
          {flash.ok
            ? <CheckCircle className="w-4 h-4 shrink-0" />
            : <AlertCircle className="w-4 h-4 shrink-0" />}
          {flash.msg}
        </motion.div>
      )}

      <div className="space-y-4">
        {providers.map((p, i) => (
          <motion.div
            key={p.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <IntegrationCard
              provider={p}
              orgId={organization.id}
              onFlash={(msg, ok) => setFlash({ msg, ok })}
            />
          </motion.div>
        ))}
      </div>

      <DemoDataCard orgId={organization.id} onFlash={(msg, ok) => setFlash({ msg, ok })} />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28 }}
        className="bg-white rounded-2xl border border-[#E2E8F0] p-6"
      >
        <h3 className="text-sm font-semibold text-[#0F172A] mb-1">Coming soon</h3>
        <p className="text-xs text-[#64748B] mb-4">Enterprise ERP integrations on the roadmap.</p>
        <div className="flex flex-wrap gap-3">
          {["SAP S/4HANA", "Oracle Financials", "Microsoft Dynamics", "FreshBooks", "Zoho Books"].map((name) => (
            <span key={name} className="px-3 py-1.5 text-xs text-[#64748B] border border-[#E2E8F0] rounded-lg bg-[#FAFAFA]">
              {name}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default function IntegrationsPage() {
  return (
    <Suspense>
      <IntegrationsContent />
    </Suspense>
  );
}
