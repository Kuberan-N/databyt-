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
        "bg-primary": "#0A0A0A",
        "bg-secondary": "#111111",
        "bg-tertiary": "#1A1A1A",
        "accent-primary": "#8B5CF6",
        "accent-secondary": "#A78BFA",
        "text-primary": "#FFFFFF",
        "text-secondary": "#A1A1AA",
        "text-muted": "#71717A",
        border: "#27272A",
        success: "#10B981",
        danger: "#EF4444",
      },
    },
  },
  plugins: [],
};
export default config;
