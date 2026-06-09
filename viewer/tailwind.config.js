import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        elev: "var(--bg-elev)",
        sunk: "var(--bg-sunk)",
        ink: {
          DEFAULT: "var(--text)",
          soft: "var(--text-soft)",
          faint: "var(--text-faint)",
        },
        line: {
          DEFAULT: "var(--border)",
          strong: "var(--border-strong)",
        },
        brand: {
          DEFAULT: "var(--accent)",
          soft: "var(--accent-soft)",
          text: "var(--accent-text)",
        },
      },
      maxWidth: {
        prose: "820px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,24,40,.05), 0 10px 28px rgba(16,24,40,.08)",
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Consolas",
          "monospace",
        ],
      },
    },
  },
  plugins: [typography],
};
