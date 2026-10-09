import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#050505",
        paper: "#f3f0e8",
        signal: "#ff2b22",
        "signal-deep": "#d91610",
        cyan: "#38f2ef",
        quiet: "#9a9992",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      fontFamily: {
        peace: ["var(--font-peace-sans)", "sans-serif"],
        superior: ["var(--font-superior-mono)", "ui-monospace", "monospace"],
        bartle: ["var(--font-bbh-bartle)", "sans-serif"],
        press: ["var(--font-press-start)", "monospace"],
      },
      backgroundImage: {
        shell:
          "radial-gradient(circle at 78% 42%, rgba(255, 43, 34, 0.09), transparent 27%), linear-gradient(112deg, #080808 0%, #030303 57%, #0c0909 100%)",
        grid:
          "linear-gradient(rgba(255, 255, 255, 0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.018) 1px, transparent 1px)",
        noise:
          "repeating-radial-gradient(circle at 15% 35%, transparent 0, rgba(255, 255, 255, 0.55) 0.6px, transparent 1.3px), repeating-radial-gradient(circle at 72% 61%, transparent 0, rgba(255, 255, 255, 0.35) 0.5px, transparent 1.1px)",
        "ascii-glow": "radial-gradient(circle, #ff2b22 0%, transparent 68%)",
        "caption-line": "linear-gradient(90deg, rgba(255, 43, 34, 0), #ff2b22)",
      },
      keyframes: {
        "noise-shift": {
          "0%": { transform: "translate3d(-1%, 1%, 0)" },
          "25%": { transform: "translate3d(1%, -2%, 0)" },
          "50%": { transform: "translate3d(2%, 1%, 0)" },
          "75%": { transform: "translate3d(-2%, -1%, 0)" },
          "100%": { transform: "translate3d(1%, 2%, 0)" },
        },
        "status-pulse": {
          "0%, 100%": { opacity: "0.45" },
          "50%": { opacity: "1" },
        },
        "title-glitch": {
          "0%, 88%, 100%": { opacity: "0", transform: "translateX(0)" },
          "89%": { opacity: "0.9", transform: "translateX(7px)" },
          "91%": { opacity: "0.4", transform: "translateX(-6px)" },
          "93%": { opacity: "0", transform: "translateX(0)" },
        },
        "dollar-glitch": {
          "0%, 87%, 100%": { transform: "translate(0)", filter: "invert(0)" },
          "89%": { transform: "translate(4px, -2px)", filter: "invert(1)" },
          "91%": { transform: "translate(-3px, 1px)", filter: "invert(0)" },
          "93%": { transform: "translate(0)" },
        },
      },
      animation: {
        noise: "noise-shift 240ms steps(2) infinite",
        status: "status-pulse 1.8s ease-in-out infinite",
        "title-glitch": "title-glitch 5.5s steps(1, end) infinite",
        "dollar-glitch": "dollar-glitch 4.8s steps(1, end) infinite",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
