import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'emerald' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = '',
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      leftIcon,
      rightIcon,
      ...props
    },
    ref
  ) => {
    // Base styles: responsive touch targets (minimum 44px on mobile)
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none min-h-[44px] active:scale-[0.98]';

    const variantStyles = {
      primary:
        'bg-slate-900 hover:bg-slate-800 text-white shadow-sm hover:shadow-md focus:ring-slate-900 border border-slate-800',
      emerald:
        'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-emerald-600/25 hover:shadow-md focus:ring-emerald-500 border border-emerald-600 font-semibold',
      secondary:
        'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-blue-600/25 hover:shadow-md focus:ring-blue-500 border border-blue-600',
      outline:
        'border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 focus:ring-slate-400 shadow-sm',
      ghost:
        'text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:ring-slate-400 border border-transparent',
      danger:
        'bg-rose-600 hover:bg-rose-700 text-white shadow-sm hover:shadow-rose-600/25 focus:ring-rose-500 border border-rose-600',
    };

    const sizeStyles = {
      sm: 'text-xs px-3.5 py-2 gap-1.5 min-h-[38px]',
      md: 'text-sm px-4 py-2.5 gap-2 min-h-[44px]',
      lg: 'text-base px-6 py-3.5 gap-2.5 min-h-[48px] font-semibold',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-current shrink-0" />
            <span>Molimo pričekajte...</span>
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
  }
);

Button.displayName = 'Button';
