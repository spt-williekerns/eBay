/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Senior-friendly design tokens
      fontSize: {
        'base': '18px',     // Minimum readable size
        'lg': '20px',       // Preferred body text
        'xl': '22px',       // Important info
        '2xl': '24px',      // Very important
        '3xl': '28px',      // Headings
        '4xl': '32px',      // Large headings
      },
      lineHeight: {
        'relaxed': '1.6',   // Minimum for readability
        'loose': '1.8',     // Extra comfortable
      },
      spacing: {
        '15': '60px',       // Minimum button height
      }
    },
  },
  plugins: [],
}
