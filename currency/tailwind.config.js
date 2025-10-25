/** @type {import('tailwindcss').Config} */
export default {
  
  darkMode: 'class', 
  
  content: [
    "./index.html",
    "./App.jsx",
    "./componants/**/*.{js,jsx,ts,tsx}",
    "./lib/**/*.{js,jsx,ts,tsx}" 
  ],
  
  theme: {
    //  👇👇👇   هنا الإضافة   👇👇👇
    extend: {
      keyframes: {
        popIn: {
          '0%': { opacity: '0', transform: 'scale(0.95) translateY(10px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
      },
      animation: {
        popIn: 'popIn 0.5s ease-out forwards',
      },
    },
    //  👆👆👆   نهاية الإضافة   👆👆👆
  },
  
  plugins: [],
}