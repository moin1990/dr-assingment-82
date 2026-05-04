import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      colors: {
        stone: {
          950: "#0c0a09",
        },
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease forwards",
        shimmer: "shimmer 2s infinite linear",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      gridTemplateColumns: {
        "gallery-sm": "repeat(auto-fill, minmax(240px, 1fr))",
        "gallery-md": "repeat(auto-fill, minmax(320px, 1fr))",
        "gallery-lg": "repeat(auto-fill, minmax(400px, 1fr))",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        gallery: {
          "primary": "#c8a97e",         // warm gold
          "primary-content": "#1a1208",
          "secondary": "#6b7280",
          "secondary-content": "#f9fafb",
          "accent": "#d97706",
          "accent-content": "#fff7ed",
          "neutral": "#1c1917",
          "neutral-content": "#e7e5e4",
          "base-100": "#fafaf9",        // warm off-white
          "base-200": "#f5f5f4",
          "base-300": "#e7e5e4",
          "base-content": "#1c1917",
          "info": "#0ea5e9",
          "success": "#22c55e",
          "warning": "#f59e0b",
          "error": "#ef4444",
        },
      },
      {
        "gallery-dark": {
          "primary": "#c8a97e",
          "primary-content": "#1a1208",
          "secondary": "#9ca3af",
          "secondary-content": "#111827",
          "accent": "#f59e0b",
          "accent-content": "#1c1917",
          "neutral": "#e7e5e4",
          "neutral-content": "#1c1917",
          "base-100": "#0c0a09",        // deep charcoal
          "base-200": "#1c1917",
          "base-300": "#292524",
          "base-content": "#f5f5f4",
          "info": "#38bdf8",
          "success": "#4ade80",
          "warning": "#fbbf24",
          "error": "#f87171",
        },
      },
    ],
    darkTheme: "gallery-dark",
    base: true,
    styled: true,
    utils: true,
    logs: false,
  },
};

export default config;
