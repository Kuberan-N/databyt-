"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "We were chasing 60+ overdue invoices manually every week. DataByt took that off our plate entirely. DSO dropped 28% in the first month.",
    name: "Sarah Chen",
    role: "CFO, Precision Manufacturing",
    metric: "28% DSO reduction in 30 days",
    company: "Manufacturing · $40M ARR",
  },
  {
    quote: "HighRadius quoted us $85,000/year. DataByt does the same job for a fraction of that. The AI emails are indistinguishable from what our team would write.",
    name: "James Rodriguez",
    role: "VP Finance, Swift Logistics",
    metric: "83% reduction in manual follow-ups",
    company: "Logistics · 500+ active customers",
  },
  {
    quote: "Setup took two hours. Our AR manager now reviews a queue instead of writing emails. She calls it the best thing we've ever bought.",
    name: "Maria Thompson",
    role: "Controller, Crestline Partners",
    metric: "$220K recovered in first quarter",
    company: "Professional Services · 200 invoices/mo",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-white py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-[#D97706] mb-4">Results</p>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] leading-tight">
            Finance teams that stopped chasing invoices manually
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="bg-white border border-[#E2E8F0] rounded-2xl p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" />
                ))}
              </div>

              <p className="text-[#111111] text-sm leading-relaxed italic flex-1 mb-5">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Metric badge */}
              <div className="bg-[#16A34A] rounded-xl px-4 py-2.5 mb-4">
                <p className="text-white text-sm font-bold">{t.metric}</p>
                <p className="text-white/70 text-xs">{t.company}</p>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#3730A3] flex items-center justify-center text-white text-xs font-black">
                  {t.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <p className="text-[#0F172A] text-sm font-semibold">{t.name}</p>
                  <p className="text-[#333333] text-xs">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
