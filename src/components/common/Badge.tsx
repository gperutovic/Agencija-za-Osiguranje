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
  variant = 'navy',
  size = 'sm',
  icon,
  showDot = false,
  ...props
}) => {
  const variants: Record<string, string> = {
    emerald: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    teal: 'bg-teal-50 text-teal-800 border-teal-200',
    amber: 'bg-amber-50 text-amber-800 border-amber-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    rose: 'bg-red-50 text-red-800 border-red-200',
    danger: 'bg-red-50 text-red-800 border-red-200',
    brand: 'bg-slate-100 text-[#0F2942] border-slate-200',
    primary: 'bg-slate-100 text-[#0F2942] border-slate-200',
    orange: 'bg-amber-50 text-amber-800 border-amber-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    navy: 'bg-[#0F2942] text-white border-[#0F2942]',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    outline: 'bg-white text-slate-700 border-slate-300',
  };

  const sizes = {
    sm: 'text-[11px] px-2.5 py-0.5 font-semibold tracking-wide',
    md: 'text-xs px-3 py-1 font-semibold',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center gap-1.5 rounded-md border leading-tight transition-colors',
          variants[variant] || variants.navy,
          sizes[size],
          className
        )
      )}
      {...props}
    >
      {showDot && <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />}
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
};
