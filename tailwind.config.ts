import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-primary": "#050A14",
        "bg-secondary": "#0A1628",
        "bg-tertiary": "#111D35",
        "text-primary": "#F8FAFC",
        "text-secondary": "#94A3B8",
        "text-muted": "#64748B",
        border: "#1E293B",
        success: "#10B981",
        danger: "#EF4444",
        blue: {
          ...colors.blue,
          400: "#3388ff",
          500: "#0055ff",
          600: "#0044cc",
        },
        cyan: {
          ...colors.cyan,
          400: "#33eeff",
          500: "#00e5ff",
          600: "#00b8cc",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-outfit)", "var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
