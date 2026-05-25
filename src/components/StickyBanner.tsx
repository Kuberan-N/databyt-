"use client";

export default function StickyBanner() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-[#111111] text-white text-center py-2.5 px-4">
      <p className="text-xs sm:text-sm font-semibold">
        <span className="inline-block w-2 h-2 rounded-full bg-[#4ADE80] mr-2 animate-pulse" />
        30-day free trial, no credit card — start automating AR today.{" "}
        <a href="/auth" className="underline underline-offset-2 hover:text-white/70 transition-colors ml-1">
          Get started free
        </a>
      </p>
    </div>
  );
}
