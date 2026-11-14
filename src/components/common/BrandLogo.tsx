import React from 'react';

interface BrandLogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'light',
  size = 'md',
  showSubtitle = true,
  className = '',
}) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const titleSizes = {
    sm: 'text-base',
    md: 'text-[17px]',
    lg: 'text-xl',
  };

  const isDarkSurface = variant === 'dark';

  return (
    <div className={`inline-flex items-center gap-3 text-left select-none ${className}`}>
      {/* Bespoke Keystone Shield Architectural Monogram Crest */}
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${iconSizes[size]} shrink-0`}
        aria-hidden="true"
      >
        <path
          d="M24 3L42 9.5V23.5C42 34.4 34.2 41.9 24 45C13.8 41.9 6 34.4 6 23.5V9.5L24 3Z"
          fill={isDarkSurface ? '#163A5F' : '#0F2942'}
        />
        <path
          d="M24 5.5L39.5 11.1V23.4C39.5 32.8 32.8 39.4 24 42.3C15.2 39.4 8.5 32.8 8.5 23.4V11.1L24 5.5Z"
          stroke="#FFFFFF"
          strokeOpacity={isDarkSurface ? '0.24' : '0.14'}
          strokeWidth="1"
        />
        {/* Crimson architectural caron accent */}
        <path
          d="M19.5 12.2L24 15.8L28.5 12.2L26.9 10.6L24 12.9L21.1 10.6L19.5 12.2Z"
          fill="#DC2626"
        />
        {/* Geometric Z Monogram */}
        <path
          d="M15.5 18H32.5V21.2L20.3 32.3H32.5V35.5H15.5V32.3L27.7 21.2H15.5V18Z"
          fill="#FFFFFF"
        />
      </svg>

      <div className="flex flex-col">
        <span
          className={`font-display font-extrabold tracking-tight leading-none ${titleSizes[size]} ${
            isDarkSurface ? 'text-white' : 'text-[#0F2942]'
          }`}
        >
          AGENCIJA ŽIVOT
        </span>
        {showSubtitle && (
          <span
            className={`text-[10px] font-semibold uppercase tracking-[0.14em] leading-none mt-1.5 ${
              isDarkSurface ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            Zastupanje u osiguranju
          </span>
        )}
      </div>
    </div>
  );
};

export default BrandLogo;
