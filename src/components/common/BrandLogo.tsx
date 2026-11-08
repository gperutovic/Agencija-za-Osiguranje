import React from 'react';

interface BrandLogoProps {
  className?: string;
  variant?: 'full' | 'compact' | 'mark-only';
  theme?: 'light' | 'dark';
  showBadge?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  variant = 'full',
  theme = 'light',
  showBadge = false,
}) => {
  const isDark = theme === 'dark';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Institutional Mark: Generali Heritage Crimson Shield + Toyota Precision Slate Core */}
      <div className="relative shrink-0 w-10 h-10">
        <svg
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-xs transition-transform hover:scale-105 duration-200"
        >
          <defs>
            <linearGradient id="generaliCrimsonGrad" x1="15" y1="10" x2="105" y2="110" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#DC2626" />
              <stop offset="55%" stopColor="#C21817" />
              <stop offset="100%" stopColor="#991B1B" />
            </linearGradient>

            <linearGradient id="toyotaSlateGrad" x1="30" y1="20" x2="90" y2="95" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
          </defs>

          {/* Outer Protective Shield in Generali Crimson */}
          <path
            d="M60 8 C88 8 108 24 108 52 C108 82 82 104 60 114 C38 104 12 82 12 52 C12 24 32 8 60 8 Z"
            fill="url(#generaliCrimsonGrad)"
          />

          {/* Inner Precision Slate Shield */}
          <path
            d="M60 18 C82 18 96 31 96 52 C96 75 76 93 60 101 C44 93 24 75 24 52 C24 31 38 18 60 18 Z"
            fill="url(#toyotaSlateGrad)"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeOpacity="0.3"
          />

          {/* Stylized 'Ž' / Protection Crest */}
          <path
            d="M42 40 H78 L50 76 H78"
            stroke="#FFFFFF"
            strokeWidth="7.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M52 27 L60 33 L68 27"
            stroke="#F87171"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Typography Hierarchy with Wordmark */}
      {variant !== 'mark-only' && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-2">
            <span
              className={`text-base sm:text-lg font-extrabold tracking-tight leading-none font-heading ${
                isDark ? 'text-white' : 'text-[#0F172A]'
              }`}
            >
              AGENCIJA <span className="text-[#C21817]">ŽIVOT</span>
            </span>
            {showBadge && (
              <span className="hidden sm:inline-flex px-1.5 py-0.5 rounded-md text-[9px] font-mono font-bold bg-[#FEF2F2] text-[#C21817] border border-[#FECACA] uppercase tracking-wide">
                GENERALI × TOYOTA
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 mt-1">
            <span
              className={`text-[10px] uppercase font-bold tracking-[0.08em] font-sans leading-none ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              ŽIVOT d.o.o.
            </span>
            {variant === 'full' && (
              <>
                <span className="text-slate-300 dark:text-slate-600 text-[10px]">&bull;</span>
                <span className="text-[10px] font-bold text-[#C21817] tracking-wide font-sans leading-none">
                  Generali &amp; Toyota Partner
                </span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandLogo;
