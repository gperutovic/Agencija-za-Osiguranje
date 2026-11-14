/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        rr: {
          orange: '#fb6504',
          orangeLight: '#ff7b1a',
          orangeDark: '#d95302',
          orangeGlow: 'rgba(251, 101, 4, 0.32)',
          dark: '#06080c',
          bg: '#080c14',
          card: '#0a0d16',
          cardHover: '#0f1422',
          surface: 'rgba(255, 255, 255, 0.03)',
          border: 'rgba(255, 255, 255, 0.06)',
          borderHover: 'rgba(251, 101, 4, 0.35)',
          success: '#10B981',
          successBg: 'rgba(16, 185, 129, 0.12)',
          violet: '#a855f7',
          violetBg: 'rgba(168, 85, 247, 0.12)',
          info: '#3b82f6',
          infoBg: 'rgba(59, 130, 246, 0.12)',
          warning: '#f59e0b',
          warningBg: 'rgba(245, 158, 11, 0.12)',
        },
        brand: {
          500: '#fb6504',
          600: '#ea580c',
        },
      },
      fontFamily: {
        sans: ['Inter', 'DM Sans', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Space Mono', 'JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(0, 0, 0, 0.4)',
        card: '0 4px 20px -2px rgba(0, 0, 0, 0.6)',
        elevated: '0 10px 30px -5px rgba(0, 0, 0, 0.8)',
        floating: '0 20px 40px -10px rgba(0, 0, 0, 0.9)',
        'glow-orange': '0 0 25px -5px rgba(251, 101, 4, 0.45)',
        'glow-orange-lg': '0 0 45px -5px rgba(251, 101, 4, 0.65)',
        'bento-hover': '0 20px 45px -10px rgba(0, 0, 0, 0.8), 0 0 25px 0 rgba(251, 101, 4, 0.25)',
      },
    },
  },
  plugins: [],
};
