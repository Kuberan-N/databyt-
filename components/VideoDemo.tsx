"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef, useState } from "react";
import { Play, Bot, Clock, CheckCircle } from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const agentLogs = [
  { time: "00:01", msg: "Agent initialized — connecting to Unity Catalog...", status: "done" },
  { time: "00:03", msg: "Reading Delta table: finance.invoices (12,847 records)", status: "done" },
  { time: "00:05", msg: "Identifying overdue invoices > 30 days...", status: "done" },
  { time: "00:07", msg: "Found 23 overdue accounts · Total: $184,230", status: "done" },
  { time: "00:09", msg: "Drafting follow-up email via Anthropic Claude...", status: "active" },
  { time: "00:12", msg: "Sending to CRM (Salesforce) via API...", status: "pending" },
  { time: "00:14", msg: "Logging action to audit trail (Unity Catalog)...", status: "pending" },
];

export default function VideoDemo() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [playing, setPlaying] = useState(false);

  return (
    <section id="video-demo" className="py-24 md:py-32 px-6 bg-[#0A1628]/30">
      <div className="max-w-5xl mx-auto" ref={ref}>
        <motion.div
          className="text-center mb-14"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400 mb-4">
            <Bot size={12} />
            Live Agent Demo
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-heading">
            Watch an Agent{" "}
            <span className="text-gradient-blue">Run in Production</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            This is our AR Chase Agent — running live on Databricks, powered by Claude, hitting a real CRM. Not a demo environment. Not clean test data.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Video placeholder */}
          <motion.div
            className="relative bg-[#0A1628]/80 border border-slate-700/50 rounded-2xl overflow-hidden aspect-video flex items-center justify-center group cursor-pointer"
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            onClick={() => setPlaying(true)}
          >
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20" />
            <div className="absolute inset-0 dot-grid opacity-50" />

            {!playing ? (
              <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_40px_rgba(59,130,246,0.4)]">
                  <Play size={30} className="text-white ml-1" fill="white" />
                </div>
                <p className="text-sm font-medium text-slate-300">AR Chase Agent — Full Walkthrough</p>
                <p className="text-xs text-slate-500">~4 min · Databricks + Claude + Salesforce</p>
              </div>
            ) : (
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <p className="text-sm text-slate-400">
                  📹 Demo video coming soon — <a href="mailto:kuberan@databyt.in" className="text-blue-400 underline">email us for a live walkthrough</a>
                </p>
              </div>
            )}

            {/* Coming soon badge */}
            <div className="absolute top-4 right-4 bg-amber-500/20 border border-amber-500/40 rounded-full px-3 py-1 text-xs font-medium text-amber-400">
              Coming Soon
            </div>
          </motion.div>

          {/* Agent log terminal */}
          <motion.div
            className="bg-[#050A14] border border-slate-800 rounded-2xl overflow-hidden"
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            {/* Terminal header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800 bg-[#0A1628]/50">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-amber-500/70" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
              </div>
              <span className="text-xs text-slate-500 ml-2">agent-execution.log — AR Chase Agent v1.2</span>
              <span className="ml-auto flex items-center gap-1.5 text-xs text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 agent-node" />
                Live
              </span>
            </div>

            {/* Log entries */}
            <div className="p-4 space-y-2.5 font-mono">
              {agentLogs.map((log, i) => (
                <motion.div
                  key={i}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.5 + i * 0.15, duration: 0.3 }}
                >
                  <span className="text-xs text-slate-600 flex-shrink-0 pt-0.5">{log.time}</span>
                  <div className="flex items-start gap-2 flex-1">
                    {log.status === "done" && (
                      <CheckCircle size={13} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                    )}
                    {log.status === "active" && (
                      <Clock size={13} className="text-blue-400 flex-shrink-0 mt-0.5 animate-spin" style={{ animationDuration: "2s" }} />
                    )}
                    {log.status === "pending" && (
                      <div className="w-3 h-3 rounded-full border border-slate-700 flex-shrink-0 mt-0.5" />
                    )}
                    <span
                      className={`text-xs leading-relaxed ${
                        log.status === "done"
                          ? "text-slate-400"
                          : log.status === "active"
                          ? "text-blue-300"
                          : "text-slate-600"
                      }`}
                    >
                      {log.msg}
                    </span>
                  </div>
                </motion.div>
              ))}

              {/* Cursor */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs text-slate-600">00:14</span>
                <span className="text-xs text-blue-400">›</span>
                <span
                  className="w-2 h-4 bg-blue-400 inline-block"
                  style={{ animation: "cursor-blink 1s ease-in-out infinite" }}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.p
          className="text-center text-slate-500 text-sm mt-10"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          Want to see this running on your data?{" "}
          <a href="mailto:kuberan@databyt.in" className="text-blue-400 hover:text-blue-300 transition-colors">
            Book a live demo →
          </a>
        </motion.p>
      </div>
    </section>
  );
}
