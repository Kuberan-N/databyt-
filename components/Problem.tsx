"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { Clock, ClipboardList, MessageSquare, Eye } from "lucide-react";

const painPoints = [
  {
    Icon: Clock,
    title: "Missed follow-ups delay payments",
    description: "Invoices sit unpaid because reminders fall through the cracks. Cash flow suffers while your team is buried in spreadsheets.",
  },
  {
    Icon: ClipboardList,
    title: "Manual tracking wastes time",
    description: "Your team spends hours updating spreadsheets and chasing the same customers. Work that should run itself takes the whole week.",
  },
  {
    Icon: MessageSquare,
    title: "No response handling loses revenue",
    description: "Customer replies pile up unanswered. Disputes go cold. Promises-to-pay get forgotten. Money walks out the door.",
  },
  {
    Icon: Eye,
    title: "Zero visibility into collections",
    description: "You can't see what's overdue, what's at risk, or what's working. Decisions get made on gut feel instead of live data.",
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function Problem() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="problem" className="py-24 md:py-28 px-6 md:px-10 bg-white">
      <div className="max-w-[1200px] mx-auto" ref={ref}>
        <motion.div
          className="text-center mb-14"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <span className="section-label mb-5 block">The Problem</span>
          <h2
            className="font-heading font-extrabold text-[#0A0A0A] mb-5 leading-[1.08]"
            style={{ fontSize: "clamp(2rem, 4.2vw, 3rem)", letterSpacing: "-0.02em" }}
          >
            Where AR teams lose <span style={{ color: "#0066FF" }}>time and money</span>
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {painPoints.map(({ Icon, title, description }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              className="ios-card p-7 flex flex-col"
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5" style={{ background: "rgba(0,102,255,0.08)" }}>
                <Icon size={20} style={{ color: "#0066FF" }} />
              </div>
              <h3 className="font-heading font-bold text-[#0A0A0A] text-[16px] mb-3 leading-snug" style={{ letterSpacing: "-0.01em" }}>
                {title}
              </h3>
              <p className="text-[13px] text-[#666] leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
