/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        // 深松石绿主色 — 沉稳、医疗但不俗
        teal: {
          50: "#EAF2F1",
          100: "#D2E4E2",
          200: "#A6C9C6",
          300: "#73A8A4",
          400: "#3E7E79",
          500: "#0F4C4A",
          600: "#0D4240",
          700: "#0A3534",
          800: "#072726",
          900: "#051B1A",
        },
        // 暖米色背景
        cream: {
          50: "#FBF9F3",
          100: "#F5F1E8",
          200: "#EBE4D2",
          300: "#DCD0B5",
          400: "#C7B68E",
        },
        ink: {
          DEFAULT: "#1A1A1A",
          soft: "#3A3A3A",
          mute: "#6B6B6B",
          faint: "#9A9A9A",
        },
        coral: {
          DEFAULT: "#E8654A",
          dark: "#C84E36",
          soft: "#F4B5A6",
        },
        amber: {
          DEFAULT: "#D4A24C",
          dark: "#B0842F",
          soft: "#ECD9A8",
        },
        line: "#E4DFD0",
        surface: "#FBF9F3",
      },
      fontFamily: {
        display: ['"Fraunces"', '"Source Han Serif SC", "Noto Serif SC", serif'],
        sans: ['"IBM Plex Sans"', '"PingFang SC", "Noto Sans SC", sans-serif'],
        mono: ['"IBM Plex Mono"', '"SF Mono", monospace'],
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem" }],
      },
      borderRadius: {
        DEFAULT: "5px",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(15,76,74,0.04), 0 1px 3px rgba(15,76,74,0.06)",
        lift: "0 6px 16px -6px rgba(15,76,74,0.14), 0 2px 6px -2px rgba(15,76,74,0.08)",
        ring: "0 0 0 1px rgba(15,76,74,0.10)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "draw-line": {
          "0%": { "stroke-dashoffset": "var(--dash, 1000)" },
          "100%": { "stroke-dashoffset": "0" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.22,1,0.36,1) both",
        "fade-in": "fade-in 0.5s ease both",
        "scale-in": "scale-in 0.4s cubic-bezier(0.22,1,0.36,1) both",
      },
    },
  },
  plugins: [],
};
