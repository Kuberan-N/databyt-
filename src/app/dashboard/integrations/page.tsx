"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { CheckCircle, AlertCircle, RefreshCw, Plug, Clock } from "lucide-react";
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
    return <span className="text-xs text-[#555555] font-medium">Not connected</span>;
  }
  const styles: Record<string, { bg: string; text: string; label: string }> = {
    connected: { bg: "bg-[#F0FDF4]", text: "text-[#16A34A]", label: "Connected" },
    syncing:   { bg: "bg-[#F3F3F3]", text: "text-[#000000]", label: "Syncing..." },
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
          <p className="text-xs text-[#333333] mt-1 leading-relaxed">{provider.description}</p>

          {isConnected && info?.last_sync_at && (
            <div className="flex items-center gap-1.5 mt-2 text-xs text-[#555555]">
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
        <p className="text-[#333333] text-sm mt-1">
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

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28 }}
        className="bg-white rounded-2xl border border-[#E2E8F0] p-6"
      >
        <h3 className="text-sm font-semibold text-[#0F172A] mb-1">Coming soon</h3>
        <p className="text-xs text-[#555555] mb-4">Enterprise ERP integrations on the roadmap.</p>
        <div className="flex flex-wrap gap-3">
          {["SAP S/4HANA", "Oracle Financials", "Microsoft Dynamics", "FreshBooks", "Zoho Books"].map((name) => (
            <span key={name} className="px-3 py-1.5 text-xs text-[#555555] border border-[#E2E8F0] rounded-lg bg-[#FAFAFA]">
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
