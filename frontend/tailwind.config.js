/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#ffffff",
        foreground: "#1a1a1a",
        primary: "#3b82f6",
        secondary: "#8b5cf6",
        muted: "#f3f4f6",
        "muted-foreground": "#6b7280",
        border: "#e5e7eb",
        input: "#d1d5db",
        ring: "#3b82f6",
      },
    },
  },
  plugins: [],
}
