/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'dark-gradient-1': '#0f2027',
        'dark-gradient-2': '#203a43',
        'dark-gradient-3': '#2c5364',
        'light-gradient-1': '#e0f7fa',
        'light-gradient-2': '#b2ebf2',
        'light-gradient-3': '#80deea',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
