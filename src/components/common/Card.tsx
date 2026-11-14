import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'glass' | 'interactive';
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'default',
  hoverEffect = false,
  ...props
}) => {
  const variants = {
    default:
      'bg-[#0a0d16]/90 border border-white/[0.08] shadow-card rounded-3xl backdrop-blur-xl text-slate-100',
    elevated:
      'bg-[#0c101c]/95 border border-white/[0.12] shadow-elevated rounded-3xl backdrop-blur-2xl text-slate-100',
    glass:
      'bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-card rounded-3xl text-slate-100',
    interactive:
      'bg-[#0a0d16]/90 border border-white/[0.08] hover:border-orange-500/40 hover:shadow-glow-orange transition-all duration-300 cursor-pointer rounded-3xl backdrop-blur-xl text-slate-100',
  };

  return (
    <div
      className={twMerge(
        clsx(
          variants[variant],
          hoverEffect && 'hover:scale-[1.01] hover:border-white/[0.18] transition-all duration-200',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
