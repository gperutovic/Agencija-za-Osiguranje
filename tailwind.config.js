/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0F2942',
          navyHover: '#163A5F',
          navyDark: '#0B1E30',
          slate: '#334155',
          accent: '#1E40AF',
          crimson: '#B91C1C',
          emerald: '#047857',
          gold: '#B45309',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        subtle: '0 1px 2px 0 rgba(15, 23, 42, 0.05)',
        card: '0 4px 16px -4px rgba(15, 23, 42, 0.06), 0 1px 3px 0 rgba(15, 23, 42, 0.04)',
        elevated: '0 12px 32px -8px rgba(15, 23, 42, 0.12), 0 2px 6px 0 rgba(15, 23, 42, 0.04)',
      },
    },
  },
  plugins: [],
};
