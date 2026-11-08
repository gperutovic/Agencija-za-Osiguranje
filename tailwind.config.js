/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        generali: {
          DEFAULT: '#C21817',
          hover: '#991B1B',
          soft: '#FEF2F2',
          border: '#FECACA',
          50: '#FEF2F2',
          100: '#FEE2E2',
          500: '#EF4444',
          600: '#C21817',
          700: '#991B1B',
          800: '#7F1D1D',
          900: '#450A0A',
        },
        toyota: {
          slate: '#0F172A',
          exec: '#1E293B',
          red: '#EB0A1E',
        },
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
          500: '#C21817',
          600: '#991B1B',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(15, 23, 42, 0.05)',
        card: '0 4px 20px -2px rgba(15, 23, 42, 0.06)',
        elevated: '0 10px 30px -5px rgba(15, 23, 42, 0.1)',
        floating: '0 20px 40px -10px rgba(15, 23, 42, 0.15)',
        'crimson-glow': '0 8px 25px -5px rgba(194, 24, 23, 0.32)',
        'teal-glow': '0 0 25px -5px rgba(13, 148, 136, 0.35)',
        'teal-glow-lg': '0 0 45px -5px rgba(13, 148, 136, 0.5)',
        bento: '0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 0 0 1px rgba(226, 232, 240, 1)',
        'bento-hover': '0 16px 32px -8px rgba(194, 24, 23, 0.10), 0 0 0 1px rgba(194, 24, 23, 0.25)',
      },
    },
  },
  plugins: [],
};
