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
    default: 'bg-white border border-slate-200 shadow-card',
    elevated: 'bg-white border border-slate-200 shadow-elevated',
    bordered: 'bg-white border-2 border-slate-200 hover:border-slate-300',
    dark: 'bg-[#0B1522] border border-slate-800 text-white shadow-elevated',
    interactive:
      'bg-white border border-slate-200 shadow-card hover:shadow-elevated hover:border-slate-300 cursor-pointer',
  };

  return (
    <div className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
};
