import React from 'react';
import { BRAND_CONFIG } from '../../config/brand';
import { ProductLine } from '../../types/domain';

interface SvgProps {
  className?: string;
}

export const BrandWordmark: React.FC<{ inverted?: boolean; className?: string }> = ({
  inverted = false,
  className = '',
}) => (
  <span className={`inline-flex items-baseline gap-0.5 select-none ${className}`}>
    <span
      className={`font-display text-[28px] leading-none tracking-tight ${
        inverted ? 'text-white' : 'text-ink'
      }`}
    >
      {BRAND_CONFIG.brandName}
    </span>
    <span
      className="inline-block w-1.5 h-1.5 rounded-full bg-accent mb-0.5"
      aria-hidden="true"
    />
  </span>
);

/**
 * Architectural left hero scene: minimalist house + parked electric car
 */
export const HeroLeftNeighborhood: React.FC<SvgProps> = ({ className = 'w-full h-auto' }) => (
  <svg viewBox="0 0 360 220" fill="none" className={className} aria-hidden="true">
    {/* Distant skyline */}
    <path
      d="M120 198V86h46v112M166 198V62h54v136M220 198v-90h42v90"
      stroke="#E5E7EB"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect x="134" y="102" width="16" height="16" stroke="#E5E7EB" strokeWidth="1.25" />
    <rect x="180" y="80" width="24" height="18" stroke="#E5E7EB" strokeWidth="1.25" />
    <rect x="180" y="110" width="24" height="18" stroke="#E5E7EB" strokeWidth="1.25" />

    {/* Foreground Architectural House */}
    <path d="M18 198V104l62-48 62 48v94H18Z" fill="#FFFFFF" stroke="#111827" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M10 109l70-55 70 55" stroke="#111827" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    {/* Arched Attic Window */}
    <path d="M64 98a16 16 0 0 1 32 0H64Z" fill="#F7F7F5" stroke="#111827" strokeWidth="1.4" />
    <line x1="80" y1="82" x2="80" y2="98" stroke="#111827" strokeWidth="1.25" />
    {/* Door & Window */}
    <rect x="38" y="138" width="28" height="60" fill="#F7F7F5" stroke="#111827" strokeWidth="1.4" />
    <circle cx="60" cy="170" r="2.2" fill="var(--color-accent)" />
    <rect x="82" y="128" width="42" height="36" fill="#FFFFFF" stroke="#111827" strokeWidth="1.4" />
    <line x1="103" y1="128" x2="103" y2="164" stroke="#111827" strokeWidth="1.2" />
    <line x1="82" y1="146" x2="124" y2="146" stroke="#111827" strokeWidth="1.2" />

    {/* Minimalist Hatchback Car */}
    <path
      d="M158 188h146c3 0 6-3 6-7v-16c0-7-5-13-12-15l-18-5-16-23c-3-4-8-7-14-7h-42c-6 0-11 3-14 7l-16 23-14 5c-6 2-10 8-10 14v17c0 4 2 7 4 7Z"
      fill="#F7F7F5"
      stroke="#111827"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path
      d="M188 145l13-19c2-2 5-4 8-4h34c3 0 6 2 8 4l13 19H188Z"
      fill="#FFFFFF"
      stroke="#111827"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
    {/* Headlights & wheels */}
    <rect x="164" y="160" width="14" height="7" rx="3" fill="#FFFFFF" stroke="#111827" strokeWidth="1.3" />
    <rect x="284" y="160" width="14" height="7" rx="3" fill="#FFFFFF" stroke="#111827" strokeWidth="1.3" />
    <rect x="210" y="170" width="38" height="10" rx="2" fill="#FFFFFF" stroke="#111827" strokeWidth="1.2" />
    <circle cx="176" cy="189" r="9" fill="#FFFFFF" stroke="#111827" strokeWidth="1.6" />
    <circle cx="284" cy="189" r="9" fill="#FFFFFF" stroke="#111827" strokeWidth="1.6" />
    {/* Subtle accent pin */}
    <circle cx="299" cy="146" r="3" fill="var(--color-accent)" />

    {/* Ground baseline */}
    <line x1="4" y1="198" x2="356" y2="198" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/**
 * Architectural right hero scene: Zagreb townhouse balcony + person & dog
 */
export const HeroRightNeighborhood: React.FC<SvgProps> = ({ className = 'w-full h-auto' }) => (
  <svg viewBox="0 0 360 220" fill="none" className={className} aria-hidden="true">
    {/* Distant buildings */}
    <path
      d="M90 198V78h48v120M138 198V96h44v102"
      stroke="#E5E7EB"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <rect x="104" y="96" width="20" height="16" stroke="#E5E7EB" strokeWidth="1.25" />

    {/* Foreground Apartment House */}
    <path d="M214 198V98l64-48 64 48v100H214Z" fill="#FFFFFF" stroke="#111827" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M206 104l72-54 72 54" stroke="#111827" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="242" y="114" width="34" height="32" fill="#F7F7F5" stroke="#111827" strokeWidth="1.4" />
    <rect x="290" y="114" width="34" height="32" fill="#F7F7F5" stroke="#111827" strokeWidth="1.4" />
    <rect x="264" y="160" width="28" height="38" fill="#FFFFFF" stroke="#111827" strokeWidth="1.4" />

    {/* Park Bench + Calm Person checking phone */}
    <line x1="76" y1="168" x2="188" y2="168" stroke="#111827" strokeWidth="1.6" strokeLinecap="round" />
    <line x1="88" y1="168" x2="88" y2="198" stroke="#111827" strokeWidth="1.5" />
    <line x1="176" y1="168" x2="176" y2="198" stroke="#111827" strokeWidth="1.5" />
    <line x1="82" y1="150" x2="182" y2="150" stroke="#111827" strokeWidth="1.3" />
    {/* Person silhouette line art */}
    <circle cx="132" cy="116" r="11" fill="#F7F7F5" stroke="#111827" strokeWidth="1.5" />
    <path
      d="M116 154c0-14 7-23 16-23s16 9 16 23v14h-32v-14Z"
      fill="#FFFFFF"
      stroke="#111827"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    {/* Phone with subtle accent screen */}
    <rect x="103" y="130" width="11" height="17" rx="2" fill="#FFFFFF" stroke="#111827" strokeWidth="1.4" />
    <circle cx="108.5" cy="136.5" r="2.2" fill="var(--color-accent)" />
    {/* Legs */}
    <path d="M124 168v26M140 168v26" stroke="#111827" strokeWidth="1.6" strokeLinecap="round" />

    {/* Small minimalist dog sitting calmly beside bench */}
    <path
      d="M44 198v-16c0-9 5-16 12-16 4 0 7 2 9 5l8 2c3 1 5 4 5 7v18"
      fill="#F7F7F5"
      stroke="#111827"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="54" cy="158" r="8" fill="#FFFFFF" stroke="#111827" strokeWidth="1.5" />
    <path d="M48 153l-3-7 7 3" stroke="#111827" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="57" cy="157" r="1.2" fill="#111827" />

    {/* Ground baseline */}
    <line x1="4" y1="198" x2="356" y2="198" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const CarLineArt: React.FC<SvgProps> = ({ className = 'w-20 h-20' }) => (
  <svg viewBox="0 0 96 96" fill="none" className={className} aria-hidden="true">
    <path
      d="M16 58h64c2.5 0 4-2 4-4.5V46c0-4-3-7.5-7-8.5l-9-2.5-8-12c-1.8-2.5-4.5-4-7.5-4H43.5c-3 0-5.7 1.5-7.5 4l-8 12-9 2.5c-4 1-7 4.5-7 8.5v7.5c0 2.5 1.5 4.5 4 4.5Z"
      fill="#F7F7F5"
      stroke="#111827"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path d="M31 37l6.5-10.5c1-1.5 2.5-2.5 4.5-2.5h12c2 0 3.5 1 4.5 2.5L65 37H31Z" fill="#FFFFFF" stroke="#111827" strokeWidth="1.4" />
    <circle cx="28" cy="59" r="7" fill="#FFFFFF" stroke="#111827" strokeWidth="1.5" />
    <circle cx="68" cy="59" r="7" fill="#FFFFFF" stroke="#111827" strokeWidth="1.5" />
    <circle cx="74" cy="45" r="2.4" fill="var(--color-accent)" />
    <line x1="10" y1="68" x2="86" y2="68" stroke="#E5E7EB" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const HomeLineArt: React.FC<SvgProps> = ({ className = 'w-20 h-20' }) => (
  <svg viewBox="0 0 96 96" fill="none" className={className} aria-hidden="true">
    <path d="M20 70V42l28-22 28 22v28H20Z" fill="#F7F7F5" stroke="#111827" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M14 45l34-27 34 27" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="40" y="48" width="16" height="22" fill="#FFFFFF" stroke="#111827" strokeWidth="1.4" />
    <circle cx="52" cy="60" r="2" fill="var(--color-accent)" />
    <rect x="26" y="48" width="10" height="10" fill="#FFFFFF" stroke="#111827" strokeWidth="1.3" />
    <rect x="60" y="48" width="10" height="10" fill="#FFFFFF" stroke="#111827" strokeWidth="1.3" />
    <line x1="12" y1="70" x2="84" y2="70" stroke="#E5E7EB" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const HealthLineArt: React.FC<SvgProps> = ({ className = 'w-20 h-20' }) => (
  <svg viewBox="0 0 96 96" fill="none" className={className} aria-hidden="true">
    <path
      d="M48 74C48 74 20 57 20 37c0-9.5 7.5-17 17-17 5.5 0 9.5 2.7 11 6.5 1.5-3.8 5.5-6.5 11-6.5 9.5 0 17 7.5 17 17 0 20-28 37-28 37Z"
      fill="#F7F7F5"
      stroke="#111827"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path d="M48 34v18M39 43h18" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const LifeLineArt: React.FC<SvgProps> = ({ className = 'w-20 h-20' }) => (
  <svg viewBox="0 0 96 96" fill="none" className={className} aria-hidden="true">
    <path d="M48 20c-16 0-28 11-28 24h56c0-13-12-24-28-24Z" fill="#F7F7F5" stroke="#111827" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M48 20v50c0 4-3 7-7 7s-7-3-7-7" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="48" cy="17" r="2.4" fill="var(--color-accent)" />
    <path d="M34 44c0-13 6-24 14-24s14 11 14 24" stroke="#111827" strokeWidth="1.25" />
  </svg>
);

export const TravelLineArt: React.FC<SvgProps> = ({ className = 'w-20 h-20' }) => (
  <svg viewBox="0 0 96 96" fill="none" className={className} aria-hidden="true">
    <rect x="28" y="30" width="40" height="44" rx="6" fill="#F7F7F5" stroke="#111827" strokeWidth="1.5" />
    <path d="M39 30v-8c0-2 1.5-4 4-4h10c2.5 0 4 2 4 4v8" stroke="#111827" strokeWidth="1.5" />
    <line x1="28" y1="45" x2="68" y2="45" stroke="#111827" strokeWidth="1.3" />
    <line x1="28" y1="59" x2="68" y2="59" stroke="#111827" strokeWidth="1.3" />
    <circle cx="58" cy="38" r="2.4" fill="var(--color-accent)" />
    <line x1="36" y1="74" x2="36" y2="78" stroke="#111827" strokeWidth="1.6" strokeLinecap="round" />
    <line x1="60" y1="74" x2="60" y2="78" stroke="#111827" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const PetLineArt: React.FC<SvgProps> = ({ className = 'w-20 h-20' }) => (
  <svg viewBox="0 0 96 96" fill="none" className={className} aria-hidden="true">
    <circle cx="48" cy="54" r="18" fill="#F7F7F5" stroke="#111827" strokeWidth="1.5" />
    <path d="M33 43l-4-16 14 9M63 43l4-16-14 9" fill="#FFFFFF" stroke="#111827" strokeWidth="1.5" strokeLinejoin="round" />
    <circle cx="42" cy="52" r="2" fill="#111827" />
    <circle cx="54" cy="52" r="2" fill="#111827" />
    <path d="M45 58h6l-3 3.5-3-3.5Z" fill="var(--color-accent)" />
  </svg>
);

export const BusinessLineArt: React.FC<SvgProps> = ({ className = 'w-20 h-20' }) => (
  <svg viewBox="0 0 96 96" fill="none" className={className} aria-hidden="true">
    <rect x="22" y="24" width="32" height="50" fill="#F7F7F5" stroke="#111827" strokeWidth="1.5" strokeLinejoin="round" />
    <rect x="54" y="38" width="20" height="36" fill="#FFFFFF" stroke="#111827" strokeWidth="1.5" strokeLinejoin="round" />
    <rect x="29" y="32" width="7" height="7" fill="#FFFFFF" stroke="#111827" strokeWidth="1.2" />
    <rect x="41" y="32" width="7" height="7" fill="#FFFFFF" stroke="#111827" strokeWidth="1.2" />
    <rect x="29" y="45" width="7" height="7" fill="#FFFFFF" stroke="#111827" strokeWidth="1.2" />
    <rect x="41" y="45" width="7" height="7" fill="var(--color-accent)" />
    <rect x="34" y="60" width="9" height="14" fill="#FFFFFF" stroke="#111827" strokeWidth="1.3" />
    <line x1="14" y1="74" x2="82" y2="74" stroke="#E5E7EB" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const ProductIllustration: React.FC<{ productLine: ProductLine; className?: string }> = ({
  productLine,
  className = 'w-16 h-16',
}) => {
  switch (productLine) {
    case 'auto':
      return <CarLineArt className={className} />;
    case 'imovina':
      return <HomeLineArt className={className} />;
    case 'zdravstveno':
      return <HealthLineArt className={className} />;
    case 'zivotno':
      return <LifeLineArt className={className} />;
    case 'putno':
      return <TravelLineArt className={className} />;
    case 'ljubimci':
      return <PetLineArt className={className} />;
    case 'poslovno':
      return <BusinessLineArt className={className} />;
  }
};

export const InstantPhoneIllustration: React.FC<SvgProps> = ({ className = 'w-full max-w-md mx-auto' }) => (
  <svg viewBox="0 0 380 230" fill="none" className={className} aria-hidden="true">
    {/* Phone Frame 1: 90s Quote */}
    <rect x="36" y="18" width="132" height="194" rx="18" fill="#FFFFFF" stroke="#111827" strokeWidth="1.6" />
    <line x1="84" y1="32" x2="120" y2="32" stroke="#D1D5DB" strokeWidth="2.5" strokeLinecap="round" />
    <rect x="52" y="52" width="84" height="22" rx="8" fill="#F7F7F5" stroke="#E5E7EB" strokeWidth="1.2" />
    <line x1="62" y1="63" x2="118" y2="63" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
    <rect x="66" y="84" width="86" height="26" rx="10" fill="var(--color-accent)" />
    <text x="109" y="101" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif">
      Gotovo. 90s
    </text>
    <rect x="52" y="122" width="100" height="66" rx="10" fill="#F7F7F5" stroke="#E5E7EB" strokeWidth="1.2" />
    <text x="64" y="144" fill="#6B7280" fontSize="9.5" fontFamily="Plus Jakarta Sans, sans-serif">
      Generali • Optimal
    </text>
    <text x="64" y="168" fill="#111827" fontSize="16" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif">
      39,40 € / mj.
    </text>

    {/* Phone Frame 2: Claims Status */}
    <rect x="212" y="28" width="132" height="184" rx="18" fill="#FFFFFF" stroke="#111827" strokeWidth="1.6" />
    <line x1="260" y1="42" x2="296" y2="42" stroke="#D1D5DB" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="278" cy="92" r="24" fill="#ECFDF5" stroke="#059669" strokeWidth="1.5" />
    <path d="M268 92l7 7 13-14" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <text x="278" y="138" textAnchor="middle" fill="#111827" fontSize="12" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif">
      Šteta u obradi
    </text>
    <text x="278" y="156" textAnchor="middle" fill="#6B7280" fontSize="10" fontFamily="Plus Jakarta Sans, sans-serif">
      STETA-2026-1042
    </text>
    <rect x="234" y="172" width="88" height="22" rx="11" fill="#F7F7F5" stroke="#E5E7EB" strokeWidth="1.2" />
    <text x="278" y="186" textAnchor="middle" fill="#111827" fontSize="9.5" fontWeight="600" fontFamily="Plus Jakarta Sans, sans-serif">
      Zastupnik dodijeljen
    </text>

    {/* Connecting hairline */}
    <path d="M168 115h44" stroke="#D1D5DB" strokeWidth="1.5" strokeDasharray="4 4" />
  </svg>
);

export const SwitchDocumentIllustration: React.FC<SvgProps> = ({ className = 'w-44 h-44' }) => (
  <svg viewBox="0 0 180 180" fill="none" className={className} aria-hidden="true">
    <rect x="34" y="24" width="84" height="110" rx="8" fill="#FFFFFF" stroke="#111827" strokeWidth="1.5" />
    <line x1="50" y1="48" x2="100" y2="48" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="50" y1="64" x2="92" y2="64" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="50" y1="78" x2="84" y2="78" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
    <rect x="50" y="96" width="52" height="20" rx="4" fill="#F7F7F5" stroke="#E5E7EB" strokeWidth="1.2" />
    <circle cx="126" cy="118" r="28" fill="#FFFFFF" stroke="#111827" strokeWidth="1.6" />
    <path d="M116 118l7 7 14-14" stroke="var(--color-accent)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
