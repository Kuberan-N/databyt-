"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";

export default function AnnouncementBar() {
  return (
    <div className="w-full bg-red-500/10 py-2.5 px-4 border-b border-red-500/20">
      <div className="max-w-7xl mx-auto text-center flex items-center justify-center gap-2">
        <AlertTriangle size={14} className="text-red-400 flex-shrink-0" />
        <p className="text-sm text-red-300 font-medium">
          Your competitors are automating AR collections right now.{" "}
          <span className="text-white font-bold">3 build slots left for May.</span>
        </p>
      </div>
    </div>
  );
}
