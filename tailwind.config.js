/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        trust: {
          teal: {
            50: '#f0fdfa',
            100: '#ccfbf1',
            200: '#99f6e4',
            300: '#5eead4',
            400: '#2dd4bf',
            500: '#14b8a6',
            600: '#0d9488',
            700: '#0f766e',
            800: '#115e59',
            900: '#134e4a',
            950: '#042f2e',
          },
          gold: {
            400: '#fbbf24',
            500: '#f59e0b',
            600: '#d97706',
          },
          azure: {
            400: '#38bdf8',
            500: '#0ea5e9',
            600: '#0284c7',
          },
        },
        brand: {
          500: '#0d9488',
          600: '#0f766e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Montserrat', 'Inter', 'sans-serif'],
        display: ['Poppins', 'Montserrat', 'sans-serif'],
        mono: ['JetBrains Mono', 'Space Mono', 'monospace'],
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        card: '0 4px 20px -2px rgba(15, 23, 42, 0.06)',
        elevated: '0 10px 30px -5px rgba(15, 23, 42, 0.1)',
        floating: '0 20px 40px -10px rgba(15, 23, 42, 0.15)',
        'teal-glow': '0 0 25px -5px rgba(13, 148, 136, 0.35)',
        'teal-glow-lg': '0 0 45px -5px rgba(13, 148, 136, 0.5)',
        'bento': '0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 0 0 1px rgba(15, 23, 42, 0.05)',
        'bento-hover': '0 20px 35px -10px rgba(15, 118, 110, 0.12), 0 0 0 1px rgba(13, 148, 136, 0.2)',
      },
    },
  },
  plugins: [],
};
