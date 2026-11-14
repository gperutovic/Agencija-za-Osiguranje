import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';

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
    'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

  const variants = {
    primary:
      'bg-[#0F2942] hover:bg-[#163A5F] text-white shadow-sm border border-[#0F2942] focus:ring-[#0F2942]',
    secondary:
      'bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200 focus:ring-slate-400',
    teal:
      'bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm border border-emerald-700 focus:ring-emerald-600',
    outline:
      'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-950 border border-slate-300 shadow-subtle focus:ring-slate-400',
    destructive:
      'bg-red-700 hover:bg-red-800 text-white shadow-sm border border-red-700 focus:ring-red-600',
    danger:
      'bg-red-700 hover:bg-red-800 text-white shadow-sm border border-red-700 focus:ring-red-600',
    ghost:
      'bg-transparent hover:bg-slate-100 text-slate-700 hover:text-slate-950 focus:ring-slate-300',
  };

  const sizes = {
    sm: 'text-xs px-3.5 py-2 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3 gap-2.5',
  };

  return (
    <button
      className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="animate-spin -ml-0.5 mr-1.5 h-4 w-4 text-current" />
          <span>Obrada u tijeku...</span>
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
