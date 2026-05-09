/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        accent: {
          50: "#f1f4ff",
          100: "#e2e8ff",
          500: "#5b6cff",
          600: "#4f60f0"
        },
        gain: {
          500: "#129b67",
          600: "#0f8a5b"
        },
        loss: {
          500: "#cb4b4b",
          600: "#b33f3f"
        }
      },
      boxShadow: {
        soft: "0 8px 24px -18px rgba(20, 24, 38, 0.32)",
        "soft-dark": "0 10px 28px -20px rgba(0, 0, 0, 0.9)"
      }
    }
  },
  plugins: []
};
