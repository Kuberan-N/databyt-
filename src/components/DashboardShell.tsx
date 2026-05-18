"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, LayoutDashboard, BarChart2, Send, Users, Settings,
  LogOut, ChevronLeft, Menu, FileText,
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

const sidebarLinks = [
  { label: "Dashboard",   href: "/dashboard",             icon: LayoutDashboard },
  { label: "AR Aging",    href: "/dashboard/ar-aging",    icon: BarChart2 },
  { label: "Collections", href: "/dashboard/collections", icon: Send },
  { label: "Customers",   href: "/dashboard/customers",   icon: Users },
  { label: "Reports",     href: "/dashboard/reports",     icon: FileText },
  { label: "Settings",    href: "/dashboard/settings",    icon: Settings },
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
      <div className="min-h-screen bg-surface-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
          <p className="text-surface-400 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const currentPage = sidebarLinks.find((l) => pathname.startsWith(l.href) && (l.href !== "/dashboard" || pathname === "/dashboard"))?.label ?? "Dashboard";
  const initials = (organization?.name ?? user.email ?? "?").charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-surface-950 flex">
      {/* Sidebar — Desktop */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 240 : 68 }}
        className="hidden lg:flex flex-col bg-surface-900 border-r border-surface-800 overflow-hidden shrink-0"
      >
        {/* Logo */}
        <div className="p-4 flex items-center justify-between border-b border-surface-800 h-16">
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shrink-0">
                  <Zap className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-base font-bold whitespace-nowrap">
                  data<span className="text-primary-400">byt</span>
                </span>
              </motion.div>
            )}
          </AnimatePresence>
          {!sidebarOpen && (
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-surface-400 hover:text-white transition-colors p-1 shrink-0"
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
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary-500/10 text-primary-400 border border-primary-500/20"
                    : "text-surface-400 hover:text-white hover:bg-surface-800"
                } ${!sidebarOpen ? "justify-center" : ""}`}
                title={!sidebarOpen ? link.label : undefined}
              >
                <link.icon className="w-4.5 h-4.5 shrink-0" />
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
        <div className="border-t border-surface-800 p-3">
          <div className={`flex items-center gap-3 ${!sidebarOpen ? "justify-center" : ""}`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
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
                  <p className="text-sm text-white truncate">{organization?.name ?? "My Company"}</p>
                  <p className="text-xs text-surface-500 truncate capitalize">{orgUser?.role ?? "admin"}</p>
                </motion.div>
              )}
            </AnimatePresence>
            {sidebarOpen && (
              <button
                onClick={signOut}
                className="text-surface-500 hover:text-danger-400 transition-colors p-1 shrink-0"
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
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: "spring", damping: 25 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-[240px] bg-surface-900 border-r border-surface-800 z-50 flex flex-col"
            >
              <div className="p-4 flex items-center gap-2 border-b border-surface-800 h-16">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-base font-bold">data<span className="text-primary-400">byt</span></span>
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
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isActive ? "bg-primary-500/10 text-primary-400" : "text-surface-400 hover:text-white hover:bg-surface-800"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <link.icon className="w-4.5 h-4.5" />
                      {link.label}
                    </a>
                  );
                })}
              </nav>
              <div className="border-t border-surface-800 p-4">
                <button
                  onClick={() => { signOut(); setMobileMenuOpen(false); }}
                  className="flex items-center gap-2 text-surface-400 hover:text-danger-400 text-sm"
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
        <header className="h-16 bg-surface-900/50 border-b border-surface-800 flex items-center justify-between px-4 sm:px-6 backdrop-blur-lg shrink-0">
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-surface-400 hover:text-white" onClick={() => setMobileMenuOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-base font-semibold text-white">{currentPage}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20">
              <span className="text-xs font-medium text-primary-400 capitalize">
                {organization?.plan_tier ?? "starter"}
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold">
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
