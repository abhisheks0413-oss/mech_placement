import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-space-grotesk)", "var(--font-inter)", "sans-serif"],
      },
      colors: {
        navy: "#061A40",
        steel: "#A8B2C1",
        gold: "#D4AF37",
        ink: "#07111F"
      },
      boxShadow: {
        glow: "0 0 35px rgba(212, 175, 55, 0.24)",
        panel: "0 18px 60px rgba(6, 26, 64, 0.18)"
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(212, 175, 55,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(212, 175, 55,.08) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};

export default config;
