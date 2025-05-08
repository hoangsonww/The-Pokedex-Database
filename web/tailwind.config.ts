import type { Config } from 'tailwindcss';

export default {
  // Here I added the darkMode key to support dark mode
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    fontFamily: {
      // Here I use Google Fonts Poppins as the default font throughout the app
      sans: ['Poppins', 'sans-serif']
    },
    extend: {
      // Pallette from https://coolors.co
      // This will be my consistent color scheme throughout the app
      colors: {
        primary: '#ec4899', // pink-500-ish
        secondary: '#fda4af', // pink-300-ish
        lightBg: '#fdf2f8', // a very light pink
        darkBg: '#1f2937' // gray-800
      }
    }
  },
  plugins: []
} satisfies Config;
