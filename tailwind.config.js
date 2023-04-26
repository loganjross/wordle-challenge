/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        black: "var(--background)",
        white: "var(--foreground)",
        gray: {
          400: "var(--accent)",
          600: "var(--accent-2)",
        },
        yellow: "var(--warning)",
        green: "var(--success)",
        modal: "var(--modal)",
      },
    },
  },
  plugins: [],
};
