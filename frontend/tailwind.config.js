/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      colors: {
        neon: {
          fitness: '#00F5A0',
          health: '#FF6B6B',
          wealth: '#FFD93D',
          love: '#FF6BDE',
          happy: 'rgba(107,170,255,1)',
        }
      }
    }
  },
  plugins: [],
}
