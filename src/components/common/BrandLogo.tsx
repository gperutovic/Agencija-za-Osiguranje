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
  showBadge = true,
}) => {
  const isDark = theme === 'dark';

  return (
    <div className={`flex items-center gap-3.5 select-none ${className}`}>
      {/* Precision Geometric Architectural Shield Mark */}
      <div className="relative shrink-0 w-11 h-11 sm:w-12 sm:h-12">
        <svg viewBox="0 0 100 108" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
          <defs>
            <linearGradient id="shieldFill" x1="10" y1="5" x2="90" y2="105" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={isDark ? '#1E293B' : '#0F172A'} />
              <stop offset="100%" stopColor={isDark ? '#0F172A' : '#1E293B'} />
            </linearGradient>
            <linearGradient id="goldAccent" x1="20" y1="20" x2="80" y2="90" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="50%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>
            <linearGradient id="emeraldAccent" x1="30" y1="20" x2="70" y2="80" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>

          {/* Outer Protective Heraldic Shield */}
          <path
            d="M50 4 L90 20 C90 60 70 88 50 100 C30 88 10 60 10 20 Z"
            fill="url(#shieldFill)"
            stroke="url(#goldAccent)"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Inset Precision Boundary */}
          <path
            d="M50 12 L82 25 C82 58 66 81 50 91 C34 81 18 58 18 25 Z"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="1"
            strokeOpacity="0.2"
          />

          {/* Stylized Monogram "Ž" (Život) */}
          <path d="M32 34 H68 L61 42 H32 Z" fill="url(#goldAccent)" />
          <path d="M61 42 L38 70 H49 L68 46 L61 42 Z" fill="#FFFFFF" />
          <path d="M32 70 H66 L59 78 H32 Z" fill="url(#goldAccent)" />

          {/* Crown / Life Sprout Diacritic Caron */}
          <path d="M50 19 L57 26 L50 29 L43 26 Z" fill="url(#emeraldAccent)" />

          {/* Trust Center Core Node */}
          <circle cx="50" cy="56" r="3.5" fill="url(#emeraldAccent)" />
        </svg>
      </div>

      {/* Typography Hierarchy */}
      {variant !== 'mark-only' && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-2">
            <span
              className={`text-xl sm:text-2xl font-black tracking-tight leading-none ${
                isDark ? 'text-white' : 'text-slate-950'
              }`}
            >
              AGENCIJA ŽIVOT
            </span>
            {showBadge && (
              <span className="hidden sm:inline-flex px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 uppercase tracking-wide">
                HANFA ZO-88912
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mt-1">
            <span
              className={`text-[10px] uppercase font-bold tracking-[0.2em] font-sans leading-none ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              Zastupanje u osiguranju
            </span>
            {variant === 'full' && (
              <>
                <span className="text-slate-300 text-[10px]">•</span>
                <span className="text-[10px] font-bold text-rose-600 tracking-wide font-sans">
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
