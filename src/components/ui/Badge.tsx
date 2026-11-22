import React from 'react';

type BadgeVariant = 'neutral' | 'accent' | 'success' | 'warning' | 'danger';

const STYLES: Record<BadgeVariant, string> = {
  neutral: 'bg-canvas-warm text-ink-secondary border-hairline',
  accent: 'bg-accent-soft text-accent border-accent/20',
  success: 'bg-emerald-50 text-status-success border-emerald-200',
  warning: 'bg-amber-50 text-status-warning border-amber-200',
  danger: 'bg-red-50 text-status-danger border-red-200',
};

export const Badge: React.FC<{
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
}> = ({ variant = 'neutral', className = '', children }) => (
  <span
    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-pill border text-[11px] font-semibold tracking-wide ${STYLES[variant]} ${className}`}
  >
    {children}
  </span>
);
