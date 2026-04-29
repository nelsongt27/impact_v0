import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#1D2F5E",
          50: "#F4F5F8",
          100: "#E6E9F0",
          200: "#C8CEDD",
          300: "#99A3BC",
          400: "#6B7796",
          500: "#475270",
          600: "#2F3A57",
          700: "#25324F",
          800: "#1D2F5E",
          900: "#0F1A38",
          950: "#070D20",
        },
        amber: {
          DEFAULT: "#F3B230",
          50: "#FEF8E9",
          100: "#FCEDC2",
          200: "#F9DC8A",
          300: "#F6C957",
          400: "#F3B230",
          500: "#D9962A",
          600: "#B07920",
          700: "#855B18",
        },
        cobalt: "#2275AA",
        cyan: "#3CB3D6",
        paper: {
          DEFAULT: "#FBFAF6",
          2: "#F5F3EC",
          3: "#ECE9DF",
        },
        brick: "#B23A3A",
      },
      fontFamily: {
        display: ["var(--ax-font-display-loaded)", "DM Serif Display", "Georgia", "serif"],
        sans: ["var(--ax-font-sans-loaded)", "Albert Sans", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--ax-font-mono-loaded)", "JetBrains Mono", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.02em",
        eyebrow: "0.14em",
      },
      borderRadius: {
        xs: "2px",
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "20px",
        "2xl": "28px",
      },
    },
  },
  plugins: [],
} satisfies Config;
