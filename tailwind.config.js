const { transform } = require('next/dist/build/swc');
const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'sans-serif'],
        serif: ['var(--font-lora)', 'Lora', 'serif'],
        brand: ['var(--font-alegreya)', 'Alegreya', 'serif'],
        lora: ['var(--font-lora)', 'serif'],
        lato: ['var(--font-lato)', 'sans-serif'],
        montserrat: ['var(--font-montserrat)', 'sans-serif'],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      keyframes: {
        change1: {
          '0%': { opacity: 1 },
          '100%': { opacity: 0, transform: 'translate(0px,-34px)' },
        },
        change2: {
          '0%': { opacity: 0, transform: 'translate(0px,-34px)' },
          '100%': { opacity: 1, transform: 'translate(0px,0px)' }
        },
        move1: {
          '0%': {},
          '100%': { transform: 'translate(5px,0px)' }
        },
        move2: {
          '0%': { tranform: 'translate(5px,0px)' },
          '100%': { tranform: 'translate(0px,0px)' }
        },
        // Animation for fading in dropdowns smoothly
        'fade-in-down': {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        change1: 'change1 1s ease-in-out infinite',
        change2: 'change2 1s ease-in-out infinite',
        move1: 'move1 0.5s ease-in-out forwards',
        move2: 'move2 0.5s ease-in-out forwards',
        'fade-in-down': 'fade-in-down 0.2s ease-out forwards',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};