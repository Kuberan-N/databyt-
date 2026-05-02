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
        red: {
          DEFAULT: "#E8321A",
          hover: "#D02B15",
          muted: "rgba(232,50,26,0.08)",
        },
        ink: "#000000",
        body: "#1A1A1A",
        muted: "#666666",
        line: "#E8E8E8",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-syne)", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        tight: "-0.04em",
        tighter: "-0.06em",
      },
    },
  },
  plugins: [],
};
export default config;
