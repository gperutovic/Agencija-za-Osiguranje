import React, { HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'bordered' | 'dark' | 'interactive';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  ...props
}) => {
  const base = 'rounded-2xl transition-all duration-200 text-left';

  const variants = {
    default: 'bg-white border border-slate-200/80 shadow-sm',
    elevated: 'bg-white border border-slate-200/80 shadow-md hover:shadow-lg',
    bordered: 'bg-white border-2 border-slate-200 hover:border-slate-300',
    dark: 'bg-slate-900 border border-slate-800 text-white shadow-xl',
    interactive:
      'bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-blue-400 cursor-pointer active:scale-[0.99]',
  };

  return (
    <div className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
};
