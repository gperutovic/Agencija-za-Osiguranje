import React from 'react';
import { Link } from 'react-router-dom';

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
    <div className={`flex items-center gap-3.5 select-none ${className}`}>
      {/* Modern Iconic Mark: Abstract Shield + Stylized 'A' + Subtle Security Key */}
      <div className="relative shrink-0 w-10 h-10 sm:w-11 sm:h-11">
        <svg
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm transition-transform hover:scale-105 duration-200"
        >
          <defs>
            <linearGradient id="brandTealGrad" x1="15" y1="10" x2="105" y2="110" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0D9488" />
              <stop offset="60%" stopColor="#0F766E" />
              <stop offset="100%" stopColor="#115E59" />
            </linearGradient>

            <linearGradient id="brandAzureGrad" x1="30" y1="15" x2="90" y2="85" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0EA5E9" />
            </linearGradient>

            <linearGradient id="brandGoldGrad" x1="45" y1="35" x2="75" y2="85" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>

          {/* Outer Protective Shield */}
          <path
            d="M60 8 C88 8 108 24 108 52 C108 82 82 104 60 114 C38 104 12 82 12 52 C12 24 32 8 60 8 Z"
            fill="url(#brandTealGrad)"
          />

          {/* Inner Safety Boundary Line */}
          <path
            d="M60 16 C82 16 98 29 98 52 C98 76 76 95 60 103 C44 95 22 76 22 52 C22 29 38 16 60 16 Z"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeOpacity="0.25"
          />

          {/* Stylized Initial 'A' for Agencija */}
          <path
            d="M60 22 L36 78 H48 L56 58 H64 L72 78 H84 L60 22 Z"
            fill="url(#brandAzureGrad)"
            opacity="0.95"
          />

          {/* Keyhole Opening (Upper triangle in 'A') */}
          <path d="M60 36 L54 52 H66 L60 36 Z" fill="#0F766E" />

          {/* Subtle Key (Unlocking Protection) */}
          <circle cx="60" cy="56" r="6.5" fill="url(#brandGoldGrad)" />
          <circle cx="60" cy="56" r="3" fill="#0F766E" />
          <rect x="58.5" y="62" width="3" height="22" rx="1.5" fill="url(#brandGoldGrad)" />
          <rect x="61.5" y="74" width="5.5" height="3" rx="1" fill="url(#brandGoldGrad)" />
          <rect x="61.5" y="80" width="4" height="2.5" rx="0.8" fill="url(#brandGoldGrad)" />
        </svg>
      </div>

      {/* Typography Hierarchy with Wordmark */}
      {variant !== 'mark-only' && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-2">
            <span
              className={`text-lg sm:text-xl font-black tracking-tight leading-none font-heading ${
                isDark ? 'text-white' : 'text-slate-950'
              }`}
            >
              AGENCIJA <span className="text-teal-600 dark:text-teal-400 font-semibold text-sm sm:text-base">ZA</span> OSIGURANJE
            </span>
            {showBadge && (
              <span className="hidden sm:inline-flex px-1.5 py-0.5 rounded-md text-[9px] font-mono font-bold bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20 uppercase tracking-wide">
                OVLAŠTENI ZASTUPNIK
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mt-1">
            <span
              className={`text-[10px] uppercase font-bold tracking-[0.16em] font-sans leading-none ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              Digitalni brokerski portal
            </span>
            {variant === 'full' && (
              <>
                <span className="text-slate-300 dark:text-slate-700 text-[10px]">•</span>
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 tracking-wide font-sans">
                  Generali Partner
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
