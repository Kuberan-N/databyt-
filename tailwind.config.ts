import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          DEFAULT: "#0066FF",
          hover: "#0052CC",
          soft: "rgba(0,102,255,0.08)",
          glow: "rgba(0,102,255,0.25)",
        },
        ink: "#0A0A0A",
        body: "#333333",
        muted: "#666666",
        line: "#E8E8E8",
      },
      fontFamily: {
        sans: ["Satoshi", "var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["General Sans", "system-ui", "sans-serif"],
        body: ["Satoshi", "var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "JetBrains Mono", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        tight: "-0.02em",
        tighter: "-0.04em",
      },
      transitionTimingFunction: {
        ios: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};
export default config;
