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
          muted: "rgba(232,50,26,0.12)",
        },
        black: "#0A0A0A",
        "off-white": "#FAFAF8",
        "gray-light": "#F5F4F0",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-outfit)", "system-ui", "sans-serif"],
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
