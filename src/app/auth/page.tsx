"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Mail, Lock, Building2, ArrowRight, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

type Mode = "login" | "signup" | "forgot";

const benefits = [
  "AI Collections Agent — chase payments on autopilot",
  "AR aging dashboard with real-time DSO metrics",
  "AI dunning emails — L1 / L2 / L3 escalation",
  "Payment links embedded in every email",
  "Live CEI dashboard + one-click board PDF",
];

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { signUp, signIn, requestPasswordReset } = useAuth();
  const router = useRouter();

  function reset() { setError(null); setSuccess(null); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    reset();
    setLoading(true);
    try {
      if (mode === "signup") {
        if (!companyName.trim()) { setError("Company name is required"); setLoading(false); return; }
        const { error: err } = await signUp(email, password, companyName);
        if (err) setError(err); else router.push("/dashboard");
      } else if (mode === "login") {
        const { error: err } = await signIn(email, password);
        if (err) setError(err); else router.push("/dashboard");
      } else {
        const { error: err } = await requestPasswordReset(email);
        if (err) setError(err); else setSuccess("Reset link sent — check your email.");
      }
    } catch { setError("Something went wrong. Please try again."); }
    setLoading(false);
  }

  const title = mode === "signup" ? "Create your account" : mode === "login" ? "Welcome back" : "Reset password";
  const subtitle = mode === "signup" ? "30-day free trial. No credit card required." : mode === "login" ? "Sign in to your DataByt dashboard." : "We'll send a reset link to your email.";
  const submitLabel = mode === "signup" ? "Create Account" : mode === "login" ? "Sign In" : "Send Reset Link";

  return (
    <div className="min-h-screen flex">

      {/* Left panel - dark */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0F172A] flex-col justify-center px-16 relative overflow-hidden">
        <div className="absolute top-1/4 -left-24 w-80 h-80 bg-[#059669]/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-[#059669]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="flex items-center gap-2.5 mb-12 relative z-10">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="6" fill="#059669" />
            <rect x="7" y="7" width="3.5" height="14" fill="white" />
            <path d="M10.5 7H15C18.866 7 22 10.134 22 14C22 17.866 18.866 21 15 21H10.5V7Z" fill="white" />
            <path d="M13.5 10.5H15C16.933 10.5 18.5 12.067 18.5 14C18.5 15.933 16.933 17.5 15 17.5H13.5V10.5Z" fill="#059669" />
          </svg>
          <span className="font-bold text-[17px] tracking-[-0.03em] text-white leading-none">
            Data<span className="text-[#059669]">Byt</span>
          </span>
        </div>

        <div className="relative z-10 max-w-sm">
          <h1 className="text-[36px] font-bold text-white leading-[1.15] tracking-[-0.025em] mb-4">
            Stop chasing<br />
            invoices <span className="text-[#059669]">manually.</span>
          </h1>
          <p className="text-white/50 text-[15px] leading-relaxed mb-10">
            AI-powered AR automation that gets you paid faster — no awkward calls needed.
          </p>

          <div className="space-y-3.5">
            {benefits.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.07 }}
                className="flex items-center gap-3"
              >
                <CheckCircle className="w-4 h-4 text-[#059669] shrink-0" />
                <span className="text-white/75 text-[13.5px]">{b}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative z-10 mt-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-pulse" />
            <span className="text-white/50 text-[11px] font-medium">Live in 48 hours · $3,000/month · Month-to-month</span>
          </div>
        </div>
      </div>

      {/* Right panel - light */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#F8FAFC]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-2.5 mb-8 justify-center">
            <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="6" fill="#059669" />
              <rect x="7" y="7" width="3.5" height="14" fill="white" />
              <path d="M10.5 7H15C18.866 7 22 10.134 22 14C22 17.866 18.866 21 15 21H10.5V7Z" fill="white" />
              <path d="M13.5 10.5H15C16.933 10.5 18.5 12.067 18.5 14C18.5 15.933 16.933 17.5 15 17.5H13.5V10.5Z" fill="#059669" />
            </svg>
            <span className="font-bold text-[17px] tracking-[-0.03em] text-[#0F172A] leading-none">
              Data<span className="text-[#059669]">Byt</span>
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-8">
            <h2 className="text-[22px] font-bold text-[#0F172A] mb-1">{title}</h2>
            <p className="text-[#222222] text-[13.5px] mb-7">{subtitle}</p>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5 text-red-600 text-[13px]">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-5 text-green-700 text-[13px]">
                <CheckCircle className="w-4 h-4 shrink-0" />
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div>
                  <label className="text-[#0F172A] text-[13px] font-medium mb-1.5 block">Company Name</label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#333333]" />
                    <input
                      type="text"
                      value={companyName}
                      onChange={e => setCompanyName(e.target.value)}
                      placeholder="Acme Corp"
                      className="w-full bg-white border border-[#E2E8F0] rounded-xl pl-10 pr-4 py-3 text-[#0F172A] text-[14px] placeholder-[#444444] focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/10 transition-all outline-none"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-[#0F172A] text-[13px] font-medium mb-1.5 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#333333]" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full bg-white border border-[#E2E8F0] rounded-xl pl-10 pr-4 py-3 text-[#0F172A] text-[14px] placeholder-[#444444] focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/10 transition-all outline-none"
                    required
                  />
                </div>
              </div>

              {mode !== "forgot" && (
                <div>
                  <label className="text-[#0F172A] text-[13px] font-medium mb-1.5 block">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#333333]" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Min. 8 characters"
                      className="w-full bg-white border border-[#E2E8F0] rounded-xl pl-10 pr-11 py-3 text-[#0F172A] text-[14px] placeholder-[#444444] focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/10 transition-all outline-none"
                      minLength={8}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#333333] hover:text-[#222222] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {mode === "login" && (
                    <button
                      type="button"
                      onClick={() => { setMode("forgot"); reset(); }}
                      className="text-[12px] text-[#333333] hover:text-[#059669] transition-colors mt-2 block text-right w-full"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#059669] text-white rounded-xl text-[14px] font-semibold hover:bg-[#047857] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {loading
                  ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <>{submitLabel}<ArrowRight className="w-4 h-4" /></>
                }
              </button>
            </form>

            <p className="text-center text-[#333333] text-[13px] mt-5">
              {mode === "signup" ? (
                <>Already have an account?{" "}
                  <button onClick={() => { setMode("login"); reset(); }} className="text-[#059669] hover:text-[#047857] font-medium">Sign in</button>
                </>
              ) : mode === "login" ? (
                <>Don&apos;t have an account?{" "}
                  <button onClick={() => { setMode("signup"); reset(); }} className="text-[#059669] hover:text-[#047857] font-medium">Get started</button>
                </>
              ) : (
                <button onClick={() => { setMode("login"); reset(); }} className="text-[#059669] hover:text-[#047857] font-medium">Back to sign in</button>
              )}
            </p>
          </div>

          <p className="text-center text-[#444444] text-[12px] mt-5">
            Your data is encrypted and never shared.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
