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
    default: 'bg-white border border-slate-200/80 shadow-subtle rounded-2xl p-6',
    elevated: 'bg-white border border-slate-100 shadow-elevated rounded-3xl p-6 sm:p-8',
    glass: 'bg-white/80 backdrop-blur-md border border-white/60 shadow-card rounded-2xl p-6',
    interactive:
      'bg-white border border-slate-200 hover:border-brand-500/50 hover:shadow-elevated transition-all duration-200 cursor-pointer rounded-2xl p-6',
  };

  return (
    <div
      className={twMerge(
        clsx(
          variants[variant],
          hoverEffect && 'hover:scale-[1.01] transition-transform duration-200',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
