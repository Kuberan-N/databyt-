"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, CheckCircle, Shield, Clock } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-grid bg-noise pt-20">
      {/* Background gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary-600/20 rounded-full blur-[128px]" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent-600/20 rounded-full blur-[128px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light text-sm text-primary-300 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-success-400 animate-pulse" />
            Now with AI Collections Agent — Chase overdue invoices automatically
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-6"
          >
            Your AP Team Is{" "}
            <span className="gradient-text">Bleeding $7,500/mo.</span>
            <br />
            Your AR Team Is{" "}
            <span className="gradient-text">Sitting on $50K</span> in Overdue Invoices.
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg sm:text-xl text-surface-200 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            DataByt fixes both. AI processes your invoices with 95%+ accuracy.
            AI Collections Agent chases overdue payments while you sleep.{" "}
            <span className="text-white font-semibold">
              From $49/month. Deployed in 1 hour.
            </span>
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <a
              href="#pricing"
              id="hero-cta-primary"
              className="group px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-full text-lg font-bold hover:from-primary-500 hover:to-accent-500 transition-all flex items-center gap-3 pulse-glow"
            >
              Start Free Trial — No Card Required
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#how-it-works"
              id="hero-cta-secondary"
              className="px-8 py-4 glass-light text-white rounded-full text-lg font-medium hover:bg-white/10 transition-all flex items-center gap-3"
            >
              <Play className="w-5 h-5" />
              Watch 2-min Demo
            </a>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-6 text-surface-400 text-sm"
          >
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-success-400" />
              10 invoices processed free before you pay
            </span>
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary-400" />
              60-day money-back guarantee
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-accent-400" />
              Setup in under 60 minutes
            </span>
          </motion.div>
        </div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { value: "93%", label: "Reduction in manual AP hours", color: "from-primary-400 to-primary-600" },
            { value: "71%", label: "Drop in flagged queue", color: "from-accent-400 to-accent-600" },
            { value: "30-50%", label: "DSO reduction with AI dunning", color: "from-success-400 to-success-500" },
            { value: "$0", label: "IT involvement required", color: "from-warning-400 to-warning-500" },
          ].map((stat, i) => (
            <div
              key={i}
              className="glass rounded-2xl p-6 text-center hover:scale-105 transition-transform"
            >
              <div
                className={`text-3xl sm:text-4xl font-black bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}
              >
                {stat.value}
              </div>
              <div className="text-surface-400 text-sm mt-2">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
