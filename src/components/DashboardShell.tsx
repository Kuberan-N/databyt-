"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, BarChart2, Send, Users, Settings,
  LogOut, ChevronLeft, Menu, FileText, AlertTriangle,
  TrendingUp, Plug,
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { Logo } from "@/components/Navbar";

const sidebarLinks = [
  { label: "Dashboard",    href: "/dashboard",               icon: LayoutDashboard },
  { label: "AR Aging",     href: "/dashboard/ar-aging",      icon: BarChart2 },
  { label: "Collections",  href: "/dashboard/collections",   icon: Send },
  { label: "Disputes",     href: "/dashboard/disputes",      icon: AlertTriangle },
  { label: "Analytics",    href: "/dashboard/analytics",     icon: TrendingUp },
  { label: "Customers",    href: "/dashboard/customers",     icon: Users },
  { label: "Reports",      href: "/dashboard/reports",       icon: FileText },
  { label: "Integrations", href: "/dashboard/integrations",  icon: Plug },
  { label: "Settings",     href: "/dashboard/settings",      icon: Settings },
];

export default function DashboardShell({ children }: { children: ReactNode }) {
  const { user, organization, orgUser, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/auth");
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#2563EB]/20 border-t-[#2563EB] rounded-full animate-spin" />
          <p className="text-[#64748B] text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const currentPage = sidebarLinks.find(
    (l) => pathname.startsWith(l.href) && (l.href !== "/dashboard" || pathname === "/dashboard")
  )?.label ?? "Dashboard";
  const initials = (organization?.name ?? user.email ?? "?").charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex">
      {/* Sidebar — Desktop */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 240 : 68 }}
        className="hidden lg:flex flex-col bg-white border-r border-[#E2E8F0] overflow-hidden shrink-0"
      >
        {/* Logo */}
        <div className="p-4 flex items-center justify-between border-b border-[#E2E8F0] h-16">
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Logo className="text-lg" />
              </motion.div>
            )}
          </AnimatePresence>
          {!sidebarOpen && (
            <div className="mx-auto">
              <span className="font-black text-[#2563EB] text-lg">D</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-[#94A3B8] hover:text-[#2563EB] transition-colors p-1 shrink-0"
          >
            <ChevronLeft className={`w-4 h-4 transition-transform ${!sidebarOpen ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-0.5 px-2">
          {sidebarLinks.map((link) => {
            const isActive = link.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(link.href);
            return (
              <a
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#EFF6FF] text-[#2563EB]"
                    : "text-[#64748B] hover:text-[#2563EB] hover:bg-[#FFF1F2]"
                } ${!sidebarOpen ? "justify-center" : ""}`}
                title={!sidebarOpen ? link.label : undefined}
              >
                <link.icon className="w-4 h-4 shrink-0" />
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="whitespace-nowrap"
                    >
                      {link.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </a>
            );
          })}
        </nav>

        {/* User */}
        <div className="border-t border-[#E2E8F0] p-3">
          <div className={`flex items-center gap-3 ${!sidebarOpen ? "justify-center" : ""}`}>
            <div className="w-8 h-8 rounded-full bg-[#111111] flex items-center justify-center text-white text-xs font-bold shrink-0">
              {initials}
            </div>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 min-w-0"
                >
                  <p className="text-sm text-[#0F172A] font-medium truncate">{organization?.name ?? "My Company"}</p>
                  <p className="text-xs text-[#94A3B8] truncate capitalize">{orgUser?.role ?? "admin"}</p>
                </motion.div>
              )}
            </AnimatePresence>
            {sidebarOpen && (
              <button
                onClick={signOut}
                className="text-[#94A3B8] hover:text-[#2563EB] transition-colors p-1 shrink-0"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/30 z-40"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: "spring", damping: 25 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-[240px] bg-white border-r border-[#E2E8F0] z-50 flex flex-col"
            >
              <div className="p-4 flex items-center border-b border-[#E2E8F0] h-16">
                <Logo className="text-lg" />
              </div>
              <nav className="flex-1 py-4 space-y-0.5 px-2">
                {sidebarLinks.map((link) => {
                  const isActive = link.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(link.href);
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        isActive ? "bg-[#EFF6FF] text-[#2563EB]" : "text-[#64748B] hover:text-[#2563EB] hover:bg-[#FFF1F2]"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <link.icon className="w-4 h-4" />
                      {link.label}
                    </a>
                  );
                })}
              </nav>
              <div className="border-t border-[#E2E8F0] p-4">
                <button
                  onClick={() => { signOut(); setMobileMenuOpen(false); }}
                  className="flex items-center gap-2 text-[#64748B] hover:text-[#2563EB] text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-4 sm:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-[#64748B] hover:text-[#2563EB]" onClick={() => setMobileMenuOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-base font-semibold text-[#0F172A]">{currentPage}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EFF6FF] border border-[#2563EB]/20">
              <span className="text-xs font-medium text-[#2563EB] capitalize">
                {organization?.plan_tier ?? "starter"}
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#111111] flex items-center justify-center text-white text-xs font-bold">
              {initials}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
