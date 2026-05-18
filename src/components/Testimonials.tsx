"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "We were skeptical about AI touching our invoices. DataByt runs on our own server — our data never leaves. That was the deal-maker.",
    name: "Sarah Chen",
    role: "CFO, Precision Manufacturing",
    metric: "93% reduction in manual AP hours",
    industry: "Manufacturing · 2,000 invoices/month",
  },
  {
    quote:
      "The vendor learning feature is what sold me. After two weeks, the system knew our 40 regular suppliers better than our new clerk did.",
    name: "James Rodriguez",
    role: "AP Manager, Swift Logistics",
    metric: "71% drop in flagged queue",
    industry: "Logistics · 1,400 invoices/month",
  },
  {
    quote:
      "We tried Bill.com. Hated the lock-in. DataByt costs a third of the price and the data stays with us. Should've done this 18 months ago.",
    name: "Maria Thompson",
    role: "Managing Partner, Peak Accounting",
    metric: "Zero IT involvement required",
    industry: "Professional Services · 500 invoices/month",
  },
];

export default function Testimonials() {
  return (
    <section className="relative py-24 bg-surface-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            What happens when teams{" "}
            <span className="gradient-text">stop entering data manually.</span>
          </h2>
          <p className="text-surface-400 text-lg">
            Real results from real businesses using DataByt.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="glass rounded-2xl p-6 flex flex-col hover:scale-[1.02] transition-transform"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star
                    key={j}
                    className="w-4 h-4 text-warning-400 fill-warning-400"
                  />
                ))}
              </div>

              {/* Quote */}
              <div className="flex-1 mb-6">
                <Quote className="w-8 h-8 text-primary-500/30 mb-3" />
                <p className="text-surface-200 text-sm leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              {/* Metric highlight */}
              <div className="bg-success-500/10 border border-success-500/20 rounded-xl px-4 py-3 mb-4">
                <p className="text-success-400 text-sm font-semibold">
                  📈 {t.metric}
                </p>
                <p className="text-surface-500 text-xs">{t.industry}</p>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-sm">
                  {t.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{t.name}</p>
                  <p className="text-surface-500 text-xs">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
