/** @friends/ui shared Tailwind theme preset */
import type { Config } from "tailwindcss";

const preset: Config = {
  content: [],
  theme: {
    extend: {
      /* ── Colors ────────────────────────────────────── */
      colors: {
        brand: {
          50: "#f0f4ff",
          100: "#dbe4ff",
          200: "#bac8ff",
          300: "#91a7ff",
          400: "#748ffc",
          500: "#5c7cfa",
          600: "#4c6ef5",
          700: "#4263eb",
          800: "#3b5bdb",
          900: "#364fc7",
          950: "#2b3ea0",
        },
        surface: {
          DEFAULT: "var(--surface)",
          secondary: "var(--surface-secondary)",
          tertiary: "var(--surface-tertiary)",
        },
        foreground: {
          DEFAULT: "var(--foreground)",
          secondary: "var(--foreground-secondary)",
          muted: "var(--foreground-muted)",
        },
        border: {
          DEFAULT: "var(--border)",
          strong: "var(--border-strong)",
        },
      },

      /* ── Typography ────────────────────────────────── */
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Oxygen",
          "Ubuntu",
          "Cantarell",
          "sans-serif",
        ],
        mono: ["JetBrains Mono", "Fira Code", "Consolas", "monospace"],
      },
      fontSize: {
        h1: ["2.25rem", { lineHeight: "2.75rem", letterSpacing: "-0.025em", fontWeight: "700" }],
        h2: ["1.75rem", { lineHeight: "2.25rem", letterSpacing: "-0.02em", fontWeight: "600" }],
        h3: ["1.375rem", { lineHeight: "1.875rem", letterSpacing: "-0.015em", fontWeight: "600" }],
        body: ["1rem", { lineHeight: "1.625rem", fontWeight: "400" }],
        "body-sm": ["0.875rem", { lineHeight: "1.375rem", fontWeight: "400" }],
        caption: ["0.75rem", { lineHeight: "1rem", fontWeight: "400" }],
      },

      /* ── Spacing ───────────────────────────────────── */
      spacing: {
        "4.5": "1.125rem",
        "13": "3.25rem",
        "15": "3.75rem",
        "18": "4.5rem",
        "22": "5.5rem",
        "26": "6.5rem",
        "30": "7.5rem",
      },

      /* ── Border radius ─────────────────────────────── */
      borderRadius: {
        "4xl": "2rem",
      },

      /* ── Shadows ───────────────────────────────────── */
      boxShadow: {
        soft: "0 1px 3px 0 rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.06)",
        card: "0 2px 8px -2px rgba(0, 0, 0, 0.08), 0 4px 12px -4px rgba(0, 0, 0, 0.06)",
        modal: "0 8px 30px -4px rgba(0, 0, 0, 0.15), 0 4px 10px -4px rgba(0, 0, 0, 0.08)",
      },

      /* ── Transitions ───────────────────────────────── */
      transitionDuration: {
        DEFAULT: "150ms",
        fast: "100ms",
        slow: "300ms",
      },

      /* ── Animations ────────────────────────────────── */
      keyframes: {
        "toast-bounce": {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "40%": { transform: "translateY(6px)", opacity: "1" },
          "65%": { transform: "translateY(-3px)" },
          "82%": { transform: "translateY(1px)" },
          "100%": { transform: "translateY(0)" },
        },
      },
      animation: {
        "toast-bounce": "toast-bounce 0.45s ease-out",
      },

      /* ── Z-index ───────────────────────────────────── */
      zIndex: {
        dropdown: "50",
        sticky: "100",
        overlay: "200",
        modal: "300",
        popover: "400",
        toast: "500",
      },
    },
  },
};

export default preset;
