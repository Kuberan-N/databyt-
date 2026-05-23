"use client";

export default function StickyBanner() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-[#1B2B6B] text-white text-center py-2.5 px-4">
      <p className="text-xs sm:text-sm font-semibold">
        <span className="inline-block w-2 h-2 rounded-full bg-[#2563EB] mr-2 animate-pulse" />
        Limited offer: First 3 clients get free setup ($5,000 value) — 2 spots remaining.{" "}
        <a href="#pricing" className="underline underline-offset-2 hover:text-white/80 transition-colors ml-1">
          Claim yours
        </a>
      </p>
    </div>
  );
}
