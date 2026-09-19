import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'glass' | 'interactive' | 'dark';
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
      'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-bento rounded-3xl backdrop-blur-xl text-slate-900 dark:text-slate-100',
    elevated:
      'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-elevated rounded-3xl backdrop-blur-2xl text-slate-900 dark:text-slate-100',
    glass:
      'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 shadow-bento rounded-3xl text-slate-900 dark:text-slate-100',
    interactive:
      'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-teal-500/50 hover:shadow-bento-hover transition-all duration-300 cursor-pointer rounded-3xl backdrop-blur-xl text-slate-900 dark:text-slate-100',
    dark:
      'bg-slate-900 border border-slate-800 shadow-card rounded-3xl backdrop-blur-xl text-white',
  };

  return (
    <div
      className={twMerge(
        clsx(
          variants[variant],
          hoverEffect && 'hover:scale-[1.01] hover:border-teal-500/40 dark:hover:border-slate-700 hover:shadow-bento-hover transition-all duration-200',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
