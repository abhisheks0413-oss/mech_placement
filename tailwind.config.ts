import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        navy: "#061A40",
        steel: "#A8B2C1",
        cyan: "#17D4FF",
        ink: "#07111F"
      },
      boxShadow: {
        glow: "0 0 35px rgba(23, 212, 255, 0.24)",
        panel: "0 18px 60px rgba(6, 26, 64, 0.18)"
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(23,212,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(23,212,255,.08) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};

export default config;
