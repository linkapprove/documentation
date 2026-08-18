/** @type {import('tailwindcss').Config} */
const withAlpha = (variable) => `rgb(var(${variable}) / <alpha-value>)`;

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: [
          "JetBrains Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
      },
      colors: {
        canvas: withAlpha("--canvas"),
        surface: withAlpha("--surface"),
        elevated: withAlpha("--elevated"),
        line: withAlpha("--line"),
        ink: withAlpha("--ink"),
        subtle: withAlpha("--subtle"),
        accent: withAlpha("--accent"),
        brand: withAlpha("--brand"),
        code: withAlpha("--code"),
        halo: withAlpha("--halo"),
        get: withAlpha("--method-get"),
        post: withAlpha("--method-post"),
        patch: withAlpha("--method-patch"),
        del: withAlpha("--method-delete"),
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.125rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        pop: "0 24px 60px -24px rgb(8 10 26 / 0.55), 0 2px 8px -2px rgb(8 10 26 / 0.35)",
        glow: "0 0 0 1px rgb(var(--accent) / 0.18), 0 20px 60px -30px rgb(var(--accent) / 0.6)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translate3d(0,0,0) scale(1)" },
          "50%": { transform: "translate3d(30px,-40px,0) scale(1.12)" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translate3d(0,0,0) scale(1.05)" },
          "50%": { transform: "translate3d(-40px,30px,0) scale(0.92)" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        float: "float 20s ease-in-out infinite",
        "float-slow": "floatSlow 26s ease-in-out infinite",
        "fade-up": "fadeUp 0.4s ease-out both",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
