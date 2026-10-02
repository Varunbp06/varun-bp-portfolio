/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0C0C0C',
          soft: '#111111',
          card: '#0F0F0F',
        },
        mist: {
          DEFAULT: '#BBCCD7',
          dim: '#646973',
        },
      },
      fontFamily: {
        sans: ['Kanit', 'system-ui', 'sans-serif'],
        display: ['Kanit', 'system-ui', 'sans-serif'],
      },
      screens: {
        '3xl': '1920px',
      },
      transitionTimingFunction: {
        editorial: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      },
    },
  },
  plugins: [],
};
