/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['Space Grotesk', 'Poppins', 'sans-serif'],
        body: ['Inter', 'Poppins', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Cascadia Code', 'monospace'],
      },
      animation: {
        gradient: 'gradient 8s linear infinite',
        'spin-slow': 'spin 12s linear infinite',
        blink: 'blink 1s step-end infinite',
      },
      keyframes: {
        gradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 },
        },
      },
    },
  },
  plugins: [],
}