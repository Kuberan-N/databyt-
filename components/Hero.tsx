"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowRight, Bot, Clock, Database, Shield, TrendingDown } from "lucide-react";
import { useDemoForm } from "./DemoFormContext";

const trustBadges = [
  { label: "SOC 2 practices" },
  { label: "GDPR ready" },
  { label: "Read-only API access" },
  { label: "You own all code + models" },
  { label: "4-week delivery guarantee" },
];

const stats = [
  {
    icon: TrendingDown,
    value: "60%",
    label: "of AI projects fail due to data readiness",
    source: "Gartner, 2024",
  },
  {
    icon: Clock,
    value: "4 weeks",
    label: "from kickoff to production agent",
    source: "Databyt guarantee",
  },
];

// Simple agent flow diagram nodes
const agentNodes = [
  { label: "Raw Data", color: "#3B82F6", delay: 0 },
  { label: "Data Pipeline", color: "#06B6D4", delay: 0.3 },
  { label: "AI Agent", color: "#8B5CF6", delay: 0.6 },
  { label: "Business Output", color: "#10B981", delay: 0.9 },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1 },
  }),
};

export default function Hero() {
  const { open: openDemo } = useDemoForm();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient orb background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="gradient-orb" />
      </div>
      <div className="absolute top-1/4 -right-32 w-72 h-72 rounded-full bg-purple-500/8 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-32 w-64 h-64 rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none" />

      {/* Dot grid */}
      <div className="absolute inset-0 dot-grid pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-16 text-center">
        {/* Positioning badge */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <span className="inline-flex items-center gap-2 text-sm font-medium text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-8 shimmer">
            <Bot size={14} />
            Production-Grade AI Agents for Startups on Databricks
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-6 font-heading"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
        >
          Your AI Project Is Failing Because{" "}
          <span className="text-gradient-blue">
            Your Data Isn&apos;t Ready.
          </span>{" "}
          We Fix Both.
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
        >
          We build production AI agents on your Databricks stack — with enterprise-grade data engineering under the hood.{" "}
          <span className="text-slate-300 font-medium">
            Agent-ready data + one working agent in 4 weeks, or 100% refund.
          </span>
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
        >
          <button
            onClick={openDemo}
            className="group bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold rounded-full px-8 py-4 transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] flex items-center gap-2"
          >
            Book a Free 20-Min AI Readiness Check
            <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
          <a
            href="#video-demo"
            className="border border-slate-700 hover:border-blue-500/50 text-slate-300 hover:text-white font-semibold rounded-full px-8 py-4 transition-all flex items-center gap-2"
          >
            <Bot size={16} />
            See a Live Agent Demo
          </a>
        </motion.div>

        {/* Trust line */}
        <motion.p
          className="text-sm text-slate-500 mb-10"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3.5}
        >
          4-week delivery guarantee · Cancel retainer anytime · You own every line of code
        </motion.p>

        {/* Trust badges row */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-3 mb-14"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={4}
        >
          {trustBadges.map((b) => (
            <span
              key={b.label}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-400 bg-slate-800/50 border border-slate-700/50 rounded-full px-3 py-1.5"
            >
              <Shield size={10} className="text-blue-400" />
              {b.label}
            </span>
          ))}
        </motion.div>

        {/* Stats row */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-12"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={4.5}
        >
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-[#0A1628]/80 border border-slate-800 rounded-2xl p-5 flex items-start gap-4 text-left hover:border-blue-500/30 transition-all"
            >
              <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 flex-shrink-0">
                <s.icon size={18} className="text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white mb-0.5">{s.value}</p>
                <p className="text-xs text-slate-400 leading-snug">{s.label}</p>
                <p className="text-xs text-slate-600 mt-1">Source: {s.source}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Agent flow diagram */}
        <motion.div
          className="relative max-w-3xl mx-auto"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={5}
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-500/20 rounded-3xl blur-xl" />
          <div className="relative bg-[#0A1628]/80 border border-slate-700/50 rounded-2xl backdrop-blur-sm p-6 md:p-8">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-slate-500">Agent Architecture — Live System</p>
              <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 agent-node inline-block" />
                Running
              </span>
            </div>

            {/* Flow diagram */}
            <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
              {agentNodes.map((node, i) => (
                <div key={node.label} className="flex items-center gap-2 flex-shrink-0">
                  <motion.div
                    className="flex flex-col items-center gap-2"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + node.delay, duration: 0.4 }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl border flex items-center justify-center"
                      style={{
                        backgroundColor: `${node.color}15`,
                        borderColor: `${node.color}40`,
                      }}
                    >
                      {i === 0 && <Database size={18} style={{ color: node.color }} />}
                      {i === 1 && <TrendingDown size={18} style={{ color: node.color }} />}
                      {i === 2 && <Bot size={18} style={{ color: node.color }} />}
                      {i === 3 && <ArrowRight size={18} style={{ color: node.color }} />}
                    </div>
                    <p className="text-xs font-medium text-slate-400 text-center whitespace-nowrap">{node.label}</p>
                  </motion.div>
                  {i < agentNodes.length - 1 && (
                    <motion.div
                      className="flex-shrink-0 h-px w-8 md:w-12"
                      style={{ backgroundColor: node.color, opacity: 0.4 }}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 1 + node.delay, duration: 0.3 }}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Live metrics beneath */}
            <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-slate-800">
              {[
                { label: "Agent Uptime", value: "99.1%", color: "text-emerald-400" },
                { label: "Tasks Automated", value: "1,847", color: "text-blue-400" },
                { label: "DB Cost Saved", value: "$47K/yr", color: "text-cyan-400" },
              ].map((m) => (
                <div key={m.label} className="text-center">
                  <p className={`text-lg font-bold ${m.color}`}>{m.value}</p>
                  <p className="text-xs text-slate-500">{m.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050A14] to-transparent pointer-events-none" />
    </section>
  );
}
