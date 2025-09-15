/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        scout: {
          primary: '#3a4552',     // Amazon's primary dark gray
          secondary: '#f79500',   // Amazon's orange accent  
          accent: '#60A5FA',      // Keep Scout blue accent
          dark: '#0F172A',        // Keep Scout dark
          light: '#f5f5f5',       // Amazon's background
          text: '#3a4552',        // Amazon's text color
          card: '#ffffff',        // Card background
          border: '#ececec',      // Amazon's border color
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}