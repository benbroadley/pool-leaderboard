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
        felt: {
          DEFAULT: "#1a3a2a",
          dark: "#0f2418",
          light: "#2d6a4f",
        },
        brass: {
          DEFAULT: "#c9a84c",
          light: "#e8c96b",
          dark: "#8a6f2e",
          muted: "#a08040",
        },
        chalk: {
          DEFAULT: "#e8dcc8",
          dim: "#b8a898",
          faint: "#6b5f52",
        },
        baize: {
          900: "#070a08",
          800: "#0d1410",
          700: "#121c17",
          600: "#1a2820",
          500: "#243628",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out forwards",
        "slide-up": "slideUp 0.4s ease-out forwards",
        "score-pop": "scorePop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
        "shimmer": "shimmer 2s linear infinite",
        "pulse-gold": "pulseGold 2s ease-in-out infinite",
        "ball-spin": "ballSpin 8s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scorePop: {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "60%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        pulseGold: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        ballSpin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      backgroundImage: {
        "felt-texture": "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='4' height='4' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E\")",
        "gold-shimmer": "linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.3) 50%, transparent 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
