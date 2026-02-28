import type { Config } from 'tailwindcss';

export default {
  // Here I added the darkMode key to support dark mode
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './utils/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    fontFamily: {
      sans: ['var(--font-body)', 'sans-serif'],
      display: ['var(--font-display)', 'sans-serif']
    },
    extend: {
      colors: {
        primary: '#ec4899',
        primaryDark: '#be185d',
        secondary: '#f9a8d4',
        lightBg: '#fff7fb',
        darkBg: '#111827',
        ink: '#172033',
        surface: '#fff8fd'
      },
      boxShadow: {
        soft: '0 24px 70px rgba(236, 72, 153, 0.12)'
      }
    }
  },
  plugins: []
} satisfies Config;
