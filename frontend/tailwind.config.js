/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        stange: ["Stange", "Arial", "sans-serif"],
        aeonik: ["AeonikPro", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
}

