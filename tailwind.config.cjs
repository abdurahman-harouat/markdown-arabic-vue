/** @type {import('tailwindcss').Config} */ 
module.exports = {
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
    require('@tailwindcss/typography'),
    require('tailwind-scrollbar')
  ],
}
