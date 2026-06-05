"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Send, Upload, LogOut,
  ChevronDown, Menu, X, Building2, AlertCircle, UserPlus,
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { Logo } from "@/components/Navbar";

export interface OrgHealthRow {
  id: string;
  name: string;
  plan_tier: string;
  mrr: number | null;
  contract_start: string | null;
  contract_end: string | null;
  status: "active" | "onboarding" | "paused" | "churned";
  created_at: string;
  userCount: number;
  customerCount: number;
  invoiceCount: number;
  totalOutstanding: number;
  overdueCount: number;
  overdueAmount: number;
  emailsSentThisMonth: number;
}

interface AdminContextValue {
  orgs: OrgHealthRow[];
  selectedOrg: OrgHealthRow | null;
  setSelectedOrg: (org: OrgHealthRow) => void;
  orgsLoading: boolean;
  refreshOrgs: () => void;
}

const AdminContext = createContext<AdminContextValue>({
  orgs: [],
  selectedOrg: null,
  setSelectedOrg: () => {},
  orgsLoading: true,
  refreshOrgs: () => {},
});

export function useAdminOrg() {
  return useContext(AdminContext);
}

const adminLinks = [
  { label: "Overview",    href: "/admin",              icon: LayoutDashboard, exact: true },
  { label: "Collections", href: "/admin/collections",  icon: Send },
  { label: "Import",      href: "/admin/import",       icon: Upload },
  { label: "Onboard",     href: "/admin/onboarding",   icon: UserPlus },
];

const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "";
const adminSecret = process.env.ADMIN_SECRET ?? "databyt-admin-2024";

export default function AdminShell({ children }: { children: ReactNode }) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [orgs, setOrgs] = useState<OrgHealthRow[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<OrgHealthRow | null>(null);
  const [orgsLoading, setOrgsLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [orgPickerOpen, setOrgPickerOpen] = useState(false);

  const refreshOrgs = useCallback(async () => {
    setOrgsLoading(true);
    try {
      const res = await fetch("/api/admin/orgs", {
        headers: { "x-admin-secret": adminSecret },
      });
      const json = await res.json();
      const list: OrgHealthRow[] = json.orgs ?? [];
      setOrgs(list);
      setSelectedOrg(prev => {
        if (prev) return list.find(o => o.id === prev.id) ?? list[0] ?? null;
        return list[0] ?? null;
      });
    } finally {
      setOrgsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loading && !user) { router.push("/auth"); return; }
    if (!loading && user && user.email !== adminEmail) { router.push("/dashboard"); return; }
    if (!loading && user) refreshOrgs();
  }, [user, loading, router, refreshOrgs]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#000000]/20 border-t-[#000000] rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || user.email !== adminEmail) return null;

  const currentLabel = adminLinks.find(l =>
    l.exact ? pathname === l.href : pathname.startsWith(l.href)
  )?.label ?? "Admin";

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={`flex flex-col ${mobile ? "h-full" : "h-screen sticky top-0"} w-[240px] bg-white border-r border-[#E2E8F0]`}>
      {/* Logo */}
      <div className="p-4 flex items-center justify-between border-b border-[#E2E8F0] h-16">
        <div className="flex items-center gap-2">
          <Logo className="text-lg" />
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#F1F5F9] text-[#000000] font-bold uppercase tracking-wider">Admin</span>
        </div>
        {mobile && (
          <button onClick={() => setMobileOpen(false)} className="text-[#475569] hover:text-[#000000]">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Org switcher */}
      <div className="p-3 border-b border-[#E2E8F0]">
        <p className="text-[10px] font-bold text-[#475569] uppercase tracking-wider mb-2 px-1">Client</p>
        <div className="relative">
          <button
            onClick={() => setOrgPickerOpen(o => !o)}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg bg-[#F8F9FC] border border-[#E2E8F0] hover:border-[#000000]/30 transition-colors text-left"
          >
            <div className="w-6 h-6 rounded-md bg-[#F1F5F9] border border-[#000000]/20 flex items-center justify-center shrink-0">
              <Building2 className="w-3 h-3 text-[#000000]" />
            </div>
            <span className="flex-1 text-sm text-[#0F172A] truncate min-w-0">
              {orgsLoading ? "Loading..." : (selectedOrg?.name ?? "Select client")}
            </span>
            <ChevronDown className={`w-3.5 h-3.5 text-[#475569] shrink-0 transition-transform ${orgPickerOpen ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence>
            {orgPickerOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.12 }}
                className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#E2E8F0] rounded-xl shadow-lg z-50 overflow-hidden"
              >
                {orgs.length === 0 ? (
                  <div className="px-4 py-3 text-xs text-[#475569]">No clients yet</div>
                ) : (
                  orgs.map(org => (
                    <button
                      key={org.id}
                      onClick={() => { setSelectedOrg(org); setOrgPickerOpen(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                        selectedOrg?.id === org.id
                          ? "bg-[#F1F5F9] text-[#000000]"
                          : "text-[#111111] hover:bg-[#FFF1F2] hover:text-[#000000]"
                      }`}
                    >
                      <div className="w-5 h-5 rounded-md bg-[#F1F5F9] flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold text-[#222222]">{org.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <span className="flex-1 text-left truncate">{org.name}</span>
                      {org.overdueCount > 0 && (
                        <span className="text-[10px] font-medium text-[#DC2626] bg-[#F1F5F9] border border-[#EF4444]/20 px-1.5 py-0.5 rounded-full">
                          {org.overdueCount}
                        </span>
                      )}
                    </button>
                  ))
                )}
                <div className="border-t border-[#F1F5F9] px-3 py-2">
                  <span className="text-[10px] text-[#475569]">{orgs.length} client{orgs.length !== 1 ? "s" : ""} total</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-0.5">
        {adminLinks.map(link => {
          const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href);
          return (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-[#F1F5F9] text-[#000000]"
                  : "text-[#222222] hover:text-[#000000] hover:bg-[#FFF1F2]"
              }`}
            >
              <link.icon className="w-4 h-4 shrink-0" />
              {link.label}
            </a>
          );
        })}
      </nav>

      {/* Alert badge */}
      {orgs.some(o => o.overdueCount > 0) && (
        <div className="mx-3 mb-3 flex items-center gap-2 px-3 py-2.5 rounded-lg bg-[#F1F5F9] border border-[#EF4444]/20">
          <AlertCircle className="w-3.5 h-3.5 text-[#DC2626] shrink-0" />
          <span className="text-xs text-[#DC2626]">
            {orgs.reduce((s, o) => s + o.overdueCount, 0)} overdue across all clients
          </span>
        </div>
      )}

      {/* User */}
      <div className="border-t border-[#E2E8F0] p-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#111111] flex items-center justify-center text-white text-xs font-bold shrink-0">
            {(user.email ?? "A").charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-[#0F172A] font-medium truncate">{user.email}</p>
            <p className="text-[10px] text-[#475569]">Operator</p>
          </div>
          <button onClick={signOut} className="text-[#475569] hover:text-[#000000] transition-colors p-1 shrink-0" title="Sign out">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <AdminContext.Provider value={{ orgs, selectedOrg, setSelectedOrg, orgsLoading, refreshOrgs }}>
      <div className="min-h-screen bg-[#F8F9FC] flex">
        {/* Desktop sidebar */}
        <div className="hidden lg:block shrink-0">
          <Sidebar />
        </div>

        {/* Mobile sidebar overlay */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:hidden fixed inset-0 bg-black/30 z-40"
                onClick={() => setMobileOpen(false)}
              />
              <motion.div
                initial={{ x: -260 }}
                animate={{ x: 0 }}
                exit={{ x: -260 }}
                transition={{ type: "spring", damping: 25 }}
                className="lg:hidden fixed left-0 top-0 bottom-0 z-50"
              >
                <Sidebar mobile />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main */}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-4 sm:px-6 shrink-0">
            <div className="flex items-center gap-3">
              <button className="lg:hidden text-[#222222] hover:text-[#000000]" onClick={() => setMobileOpen(true)}>
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-sm font-semibold text-[#0F172A]">{currentLabel}</h1>
              {selectedOrg && (
                <span className="hidden sm:inline text-xs text-[#475569]">
                  — {selectedOrg.name}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <a href="/dashboard" className="text-xs text-[#222222] hover:text-[#000000] transition-colors px-3 py-1.5 rounded-lg border border-[#E2E8F0] hover:border-[#000000]/30">
                Client View
              </a>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </AdminContext.Provider>
  );
}
