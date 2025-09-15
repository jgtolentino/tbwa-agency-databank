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
          primary: '#000000',     // TBWA Black
          secondary: '#FFD700',   // TBWA Yellow
          accent: '#1E40AF',      // TBWA Blue  
          dark: '#000000',        // TBWA Black
          light: '#F5F5F5',       // TBWA Light Gray
          text: '#000000',        // TBWA Black text
          card: '#FFFFFF',        // TBWA White
          border: '#F5F5F5',      // TBWA Light Gray border
        },
        tbwa: {
          yellow: '#FFD700',      // TBWA Yellow
          black: '#000000',       // TBWA Black
          white: '#FFFFFF',       // TBWA White
          gray: '#4A4A4A',        // TBWA Gray
          lightGray: '#F5F5F5',   // TBWA Light Gray
          darkYellow: '#E6C200',  // TBWA Dark Yellow
          blue: '#1E40AF',        // TBWA Blue
          purple: '#6B46C1',      // Accent Purple
          emerald: '#059669',     // Accent Emerald
          red: '#DC2626',         // Accent Red
          orange: '#D97706',      // Accent Orange
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}