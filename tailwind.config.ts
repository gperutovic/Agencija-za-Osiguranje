import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: 'rgb(var(--color-canvas-rgb) / <alpha-value>)',
        'canvas-warm': 'rgb(var(--color-canvas-warm-rgb) / <alpha-value>)',
        hairline: 'rgb(var(--color-border-rgb) / <alpha-value>)',
        'hairline-strong': 'rgb(var(--color-border-strong-rgb) / <alpha-value>)',
        ink: {
          DEFAULT: 'rgb(var(--color-ink-rgb) / <alpha-value>)',
          secondary: 'rgb(var(--color-ink-secondary-rgb) / <alpha-value>)',
          muted: 'rgb(var(--color-ink-muted-rgb) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--color-accent-rgb) / <alpha-value>)',
          hover: 'rgb(var(--color-accent-hover-rgb) / <alpha-value>)',
          soft: 'rgb(var(--color-accent-soft-rgb) / <alpha-value>)',
        },
        status: {
          success: 'rgb(var(--color-success-rgb) / <alpha-value>)',
          warning: 'rgb(var(--color-warning-rgb) / <alpha-value>)',
          danger: 'rgb(var(--color-danger-rgb) / <alpha-value>)',
        },
      },
      fontFamily: {
        display: ['var(--font-display)'],
        sans: ['var(--font-sans)'],
      },
      borderRadius: {
        editorial: '12px',
        pill: '9999px',
      },
      boxShadow: {
        subtle: '0 1px 2px rgba(17, 24, 39, 0.04)',
        card: '0 8px 30px -12px rgba(17, 24, 39, 0.08)',
        elevated: '0 20px 50px -15px rgba(17, 24, 39, 0.14)',
      },
    },
  },
  plugins: [],
};

export default config;
