/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'tech-purple-dark': '#5b21b6', // violet-800
        'tech-purple-light': '#9333ea', // purple-600
        'tech-pink': '#db2777', // pink-600
      },
      backgroundImage: {
        'tech-gradient': "linear-gradient(to right, #5b21b6, #9333ea, #5b21b6)",
        'pink-gradient': "linear-gradient(to right, #db2777, #f472b6, #db2777)",
      }
    },
  },
  plugins: [require("daisyui")],
}