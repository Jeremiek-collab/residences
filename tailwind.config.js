/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./admin.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        azure: {
          50: '#f0f9fa',
          100: '#dcf1f4',
          200: '#bee3e9',
          300: '#91ced7',
          400: '#5cb0c1',
          500: '#008b99', // Main azure accent
          600: '#007799', // Darker azure
          700: '#035d68',
          800: '#0b4b54',
          900: '#0d3f47',
        },
        sand: {
          50: '#faf8f6',
          100: '#f5ebe6', // Main sand beige
          200: '#ecdcd3',
          300: '#dec4b5',
          400: '#cba590',
          500: '#b8866e',
          600: '#aa7159',
          700: '#8e5b47',
          800: '#754c3c',
          900: '#614033',
        },
        navy: {
          50: '#f4f6f8',
          100: '#e7ebf0',
          200: '#cbd4e0',
          300: '#a1b3cb',
          400: '#718eb2',
          500: '#4e6d97',
          600: '#3d5578',
          700: '#324562',
          800: '#2b3a51',
          900: '#0f2027', // Deep navy
          950: '#09151c', // Extra deep navy
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
