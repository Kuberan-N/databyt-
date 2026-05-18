"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Zap, Mail, Lock, Building2, ArrowRight,
  Eye, EyeOff, CheckCircle, AlertCircle,
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

type Mode = "login" | "signup" | "forgot";

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

  function reset() {
    setError(null);
    setSuccess(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    reset();
    setLoading(true);

    try {
      if (mode === "signup") {
        if (!companyName.trim()) {
          setError("Company name is required");
          setLoading(false);
          return;
        }
        const { error: err } = await signUp(email, password, companyName);
        if (err) setError(err);
        else router.push("/dashboard");
      } else if (mode === "login") {
        const { error: err } = await signIn(email, password);
        if (err) setError(err);
        else router.push("/dashboard");
      } else {
        const { error: err } = await requestPasswordReset(email);
        if (err) setError(err);
        else setSuccess("Password reset link sent — check your email.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  }

  const benefits = [
    "AI Collections Agent — chase payments on autopilot",
    "AR aging dashboard with real-time DSO metrics",
    "Dunning emails drafted by AI, approved by you",
    "Multi-tenant — built for finance teams",
    "SOC 2 ready data isolation per organization",
  ];

  const title = mode === "signup" ? "Start your free trial" : mode === "login" ? "Welcome back" : "Reset your password";
  const subtitle =
    mode === "signup"
      ? "No credit card required."
      : mode === "login"
      ? "Sign in to your DataByt dashboard."
      : "We'll send a reset link to your email.";
  const submitLabel =
    mode === "signup" ? "Create Account" : mode === "login" ? "Sign In" : "Send Reset Link";

  return (
    <div className="min-h-screen bg-surface-950 bg-grid flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/40 via-surface-950 to-accent-900/30" />
        <div className="absolute top-1/3 -left-32 w-96 h-96 bg-primary-600/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-accent-600/15 rounded-full blur-[100px]" />
        <div className="relative z-10 flex flex-col justify-center px-16 max-w-xl">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold">
              data<span className="text-primary-400">byt</span>
              <span className="text-surface-500 text-sm font-normal ml-2">Collections AI</span>
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Stop chasing invoices <span className="gradient-text">manually.</span>
          </h1>
          <p className="text-surface-400 text-lg mb-10">
            AI-powered AR automation that gets you paid faster without the awkward calls.
          </p>
          <div className="space-y-4">
            {benefits.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                className="flex items-center gap-3"
              >
                <CheckCircle className="w-5 h-5 text-success-400 shrink-0" />
                <span className="text-surface-200">{b}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold">data<span className="text-primary-400">byt</span></span>
          </div>

          <div className="glass rounded-3xl p-8">
            <h2 className="text-2xl font-bold mb-1">{title}</h2>
            <p className="text-surface-400 text-sm mb-8">{subtitle}</p>

            {error && (
              <div className="flex items-center gap-2 bg-danger-500/10 border border-danger-500/20 rounded-xl px-4 py-3 mb-6 text-danger-400 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2 bg-success-500/10 border border-success-500/20 rounded-xl px-4 py-3 mb-6 text-success-400 text-sm">
                <CheckCircle className="w-4 h-4 shrink-0" />
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {mode === "signup" && (
                <div>
                  <label className="text-surface-200 text-sm font-medium mb-2 block">Company Name</label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Acme Corp"
                      className="w-full bg-surface-800/50 border border-surface-700 rounded-xl pl-11 pr-4 py-3 text-white placeholder-surface-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all outline-none"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-surface-200 text-sm font-medium mb-2 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full bg-surface-800/50 border border-surface-700 rounded-xl pl-11 pr-4 py-3 text-white placeholder-surface-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all outline-none"
                    required
                  />
                </div>
              </div>

              {mode !== "forgot" && (
                <div>
                  <label className="text-surface-200 text-sm font-medium mb-2 block">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 8 characters"
                      className="w-full bg-surface-800/50 border border-surface-700 rounded-xl pl-11 pr-11 py-3 text-white placeholder-surface-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all outline-none"
                      minLength={8}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-500 hover:text-surface-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {mode === "login" && (
                    <button
                      type="button"
                      onClick={() => { setMode("forgot"); reset(); }}
                      className="text-xs text-surface-500 hover:text-primary-400 transition-colors mt-2 block text-right w-full"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-semibold hover:from-primary-500 hover:to-accent-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>{submitLabel}<ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>

            <p className="text-center text-surface-400 text-sm mt-6">
              {mode === "signup" ? (
                <>Already have an account?{" "}
                  <button onClick={() => { setMode("login"); reset(); }} className="text-primary-400 hover:text-primary-300 font-medium">Sign in</button>
                </>
              ) : mode === "login" ? (
                <>Don&apos;t have an account?{" "}
                  <button onClick={() => { setMode("signup"); reset(); }} className="text-primary-400 hover:text-primary-300 font-medium">Get started</button>
                </>
              ) : (
                <button onClick={() => { setMode("login"); reset(); }} className="text-primary-400 hover:text-primary-300 font-medium">Back to sign in</button>
              )}
            </p>
          </div>

          <p className="text-center text-surface-600 text-xs mt-6">
            Your data is encrypted and never shared.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
