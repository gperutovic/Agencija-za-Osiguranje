import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'destructive' | 'danger' | 'ghost' | 'teal';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  leftIcon,
  rightIcon,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#06080c] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

  const variants = {
    primary:
      'bg-gradient-to-r from-[#fb6504] to-[#ff7b1a] text-white shadow-glow-orange hover:shadow-glow-orange-lg hover:scale-[1.02] border border-orange-400/30 focus:ring-[#fb6504]',
    secondary:
      'bg-[#0f1422] hover:bg-[#151c30] text-white border border-white/10 hover:border-white/20 shadow-md focus:ring-slate-500',
    teal:
      'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-glow-teal hover:scale-[1.02] border border-teal-400/30 focus:ring-teal-400',
    outline:
      'bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 hover:text-white border border-white/[0.12] hover:border-white/[0.25] backdrop-blur-md focus:ring-white/20',
    destructive:
      'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-md hover:scale-[1.02] border border-rose-500/30 focus:ring-rose-500',
    danger:
      'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-md hover:scale-[1.02] border border-rose-500/30 focus:ring-rose-500',
    ghost:
      'bg-transparent hover:bg-white/[0.06] text-slate-300 hover:text-white focus:ring-white/20',
  };

  const sizes = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5 rounded-lg',
    md: 'text-sm px-4.5 py-2.5 gap-2 rounded-xl',
    lg: 'text-base px-6 py-3.5 gap-2.5 font-extrabold rounded-2xl',
  };

  return (
    <button
      className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Učitavanje...
        </>
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};
