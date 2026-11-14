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
    default: 'bg-white border border-slate-200 shadow-card rounded-2xl text-slate-900',
    elevated: 'bg-white border border-slate-200 shadow-elevated rounded-2xl text-slate-900',
    glass: 'bg-white/95 backdrop-blur-sm border border-slate-200/90 shadow-card rounded-2xl text-slate-900',
    interactive:
      'bg-white border border-slate-200 shadow-card hover:border-slate-300 hover:shadow-elevated transition-all duration-200 cursor-pointer rounded-2xl text-slate-900',
  };

  return (
    <div
      className={twMerge(
        clsx(
          variants[variant],
          hoverEffect && 'hover:border-slate-300 hover:shadow-elevated transition-all duration-200',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
