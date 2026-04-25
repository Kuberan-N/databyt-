"use client";

import React from "react";
import { Zap } from "lucide-react";

export default function AnnouncementBar() {
  return (
    <div className="w-full bg-slate-900 py-2 px-4 border-b border-slate-800">
      <div className="max-w-7xl mx-auto text-center flex items-center justify-center gap-2">
        <Zap size={14} className="text-cyan-400 fill-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
        <p className="text-sm text-slate-300 font-medium">
          3 of 5 founding client spots claimed — next cohort starts May 12th
        </p>
      </div>
    </div>
  );
}
