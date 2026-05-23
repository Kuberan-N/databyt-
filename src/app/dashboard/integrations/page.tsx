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
  docsUrl: string;
}

const providers: ProviderConfig[] = [
  {
    key: "netsuite",
    label: "NetSuite",
    description: "Import open invoices and customers via SuiteQL. Syncs AR aging automatically.",
    apiRoute: "/api/integrations/netsuite",
    syncRoute: "/api/integrations/netsuite/sync",
    docsUrl: "#",
    logo: (
      <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
        <rect width="40" height="40" rx="8" fill="#1F7ACA" />
        <text x="20" y="27" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white" fontFamily="sans-serif">NS</text>
      </svg>
    ),
  },
  {
    key: "sage",
    label: "Sage Business Cloud",
    description: "Pull outstanding sales invoices from Sage Accounting via REST API.",
    apiRoute: "/api/integrations/sage",
    syncRoute: "/api/integrations/sage/sync",
    docsUrl: "#",
    logo: (
      <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
        <rect width="40" height="40" rx="8" fill="#00B259" />
        <text x="20" y="27" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white" fontFamily="sans-serif">SG</text>
      </svg>
    ),
  },
];

function StatusBadge({ status }: { status: IntegrationStatus | null }) {
  if (!status || status === "disconnected") {
    return <span className="text-xs text-[#94A3B8] font-medium">Not connected</span>;
  }
  const styles: Record<string, { bg: string; text: string; label: string }> = {
    connected: { bg: "bg-[#F0FDF4]", text: "text-[#16A34A]", label: "Connected" },
    syncing:   { bg: "bg-[#EEF2FF]", text: "text-[#4F46E5]", label: "Syncing…" },
    error:     { bg: "bg-[#EEF2FF]", text: "text-[#DC2626]", label: "Error" },
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
      className="glass rounded-2xl p-6"
    >
      <div className="flex items-start gap-4">
        <div className="shrink-0">{provider.logo}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-[#0F172A]">{provider.label}</h3>
            <StatusBadge status={info?.status ?? null} />
          </div>
          <p className="text-xs text-[#64748B] mt-1 leading-relaxed">{provider.description}</p>

          {isConnected && info?.last_sync_at && (
            <div className="flex items-center gap-1.5 mt-2 text-xs text-[#94A3B8]">
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
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#64748B] border border-[#E2E8F0] rounded-lg hover:text-[#4F46E5] hover:border-[#4F46E5]/30 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`} />
                {syncing ? "Syncing…" : "Sync now"}
              </button>
              <button
                onClick={handleDisconnect}
                className="px-3 py-1.5 text-xs font-medium text-[#64748B] border border-[#E2E8F0] rounded-lg hover:text-[#DC2626] hover:border-[#DC2626]/30 transition-all"
              >
                Disconnect
              </button>
            </>
          ) : (
            <button
              onClick={handleConnect}
              disabled={connecting}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[#4F46E5] text-white rounded-lg hover:bg-[#4338CA] transition-colors disabled:opacity-50"
            >
              <Plug className="w-3.5 h-3.5" />
              {connecting ? "Redirecting…" : "Connect"}
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
        <p className="text-[#64748B] text-sm mt-1">
          Connect your accounting systems to sync invoices and customers automatically.
        </p>
      </div>

      {flash && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm ${
            flash.ok
              ? "bg-[#F0FDF4] border border-[#BBF7D0] text-[#16A34A]"
              : "bg-[#EEF2FF] border border-[#FECACA] text-[#DC2626]"
          }`}
        >
          {flash.ok
            ? <CheckCircle className="w-4 h-4 shrink-0" />
            : <AlertCircle className="w-4 h-4 shrink-0" />}
          {flash.msg}
        </motion.div>
      )}

      <div className="space-y-4">
        {providers.map((p) => (
          <IntegrationCard
            key={p.key}
            provider={p}
            orgId={organization.id}
            onFlash={(msg, ok) => setFlash({ msg, ok })}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-6"
      >
        <h3 className="text-sm font-semibold text-[#0F172A] mb-1">Coming soon</h3>
        <p className="text-xs text-[#94A3B8] mb-4">These integrations are in development.</p>
        <div className="flex flex-wrap gap-3">
          {["QuickBooks Online", "Xero", "FreshBooks", "Zoho Books"].map((name) => (
            <span key={name} className="px-3 py-1.5 text-xs text-[#94A3B8] border border-[#E2E8F0] rounded-lg bg-[#FAFAFA]">
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
