import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export type BadgeVariant =
  | 'emerald'
  | 'amber'
  | 'rose'
  | 'brand'
  | 'navy'
  | 'slate'
  | 'teal'
  | 'orange'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'primary'
  | 'neutral'
  | 'outline';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  showDot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'brand',
  size = 'sm',
  icon,
  showDot = true,
  ...props
}) => {
  const variants: Record<string, string> = {
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    danger: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    brand: 'bg-orange-500/10 text-[#fb6504] border-orange-500/30',
    orange: 'bg-orange-500/10 text-[#fb6504] border-orange-500/30',
    primary: 'bg-orange-500/10 text-[#fb6504] border-orange-500/30',
    info: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    teal: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
    navy: 'bg-slate-800 text-slate-200 border-slate-700',
    slate: 'bg-white/[0.04] text-slate-300 border-white/[0.1]',
    neutral: 'bg-white/[0.04] text-slate-300 border-white/[0.1]',
    outline: 'bg-transparent text-slate-300 border-white/[0.15]',
  };

  const sizes = {
    sm: 'text-[10px] px-2.5 py-0.5 font-mono tracking-wider font-bold uppercase',
    md: 'text-xs px-3 py-1 font-mono tracking-wider font-bold uppercase',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center gap-1.5 rounded-full border leading-none transition-colors backdrop-blur-sm',
          variants[variant] || variants.brand,
          sizes[size],
          className
        )
      )}
      {...props}
    >
      {showDot && <span className="w-1.5 h-1.5 rounded-full bg-currentColor shrink-0 animate-pulse" />}
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
};
