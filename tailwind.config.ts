import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: 'var(--color-canvas)',
        'canvas-warm': 'var(--color-canvas-warm)',
        hairline: 'var(--color-border)',
        'hairline-strong': 'var(--color-border-strong)',
        ink: {
          DEFAULT: 'var(--color-ink)',
          secondary: 'var(--color-ink-secondary)',
          muted: 'var(--color-ink-muted)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          hover: 'var(--color-accent-hover)',
          soft: 'var(--color-accent-soft)',
        },
        status: {
          success: 'var(--color-success)',
          warning: 'var(--color-warning)',
          danger: 'var(--color-danger)',
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
