/** @type {import('tailwindcss').Config} */ 
module.exports = {
darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
        fontFamily:{
          tajawal: ['Tajawal, sans-serif'],
          blakaink: ['Blaka Ink, cursive'],
          reemkufiink: ['Reem Kufi Ink, sans-serif'],
        },
    },
  },
  plugins: [
    require('tailwind-scrollbar')
  ],
}
