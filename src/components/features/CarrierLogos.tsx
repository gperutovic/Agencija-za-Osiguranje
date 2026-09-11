import React from 'react';

interface CarrierLogoProps {
  name: string;
  className?: string;
  monochrome?: boolean;
}

export const CarrierLogo: React.FC<CarrierLogoProps> = ({ 
  name, 
  className = "h-8 w-auto", 
  monochrome = false 
}) => {
  const normalized = name.toLowerCase();

  // 1. Croatia Osiguranje d.d. (Est. 1884 - Premier Croatian National Insurer)
  if (normalized.includes('croatia') || normalized.includes('co')) {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <svg viewBox="0 0 160 40" fill="none" className="h-full w-auto">
          <circle cx="20" cy="20" r="16" fill={monochrome ? "#ffffff" : "#004B87"} />
          <path d="M12 20C12 15.58 15.58 12 20 12C24.42 12 28 15.58 28 20C28 24.42 24.42 28 20 28" stroke="white" strokeWidth="3" strokeLinecap="round" />
          <circle cx="20" cy="20" r="4" fill="#fb6504" />
          <text x="44" y="22" fill={monochrome ? "#94a3b8" : "#ffffff"} fontSize="13" fontWeight="800" fontFamily="Inter, sans-serif" letterSpacing="0.5">CROATIA</text>
          <text x="44" y="32" fill={monochrome ? "#64748b" : "#94a3b8"} fontSize="8" fontWeight="600" fontFamily="Inter, sans-serif" letterSpacing="1.5">OSIGURANJE 1884</text>
        </svg>
      </div>
    );
  }

  // 2. Allianz Hrvatska d.d.
  if (normalized.includes('allianz')) {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <svg viewBox="0 0 140 40" fill="none" className="h-full w-auto">
          <circle cx="20" cy="20" r="16" fill={monochrome ? "#ffffff" : "#003780"} />
          <path d="M15 25V15" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M20 25V12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M25 25V15" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          <text x="44" y="24" fill={monochrome ? "#94a3b8" : "#ffffff"} fontSize="15" fontWeight="800" fontFamily="Inter, sans-serif" letterSpacing="0.2">Allianz</text>
          <text x="44" y="33" fill={monochrome ? "#64748b" : "#38bdf8"} fontSize="7.5" fontWeight="700" fontFamily="Space Mono, monospace">HRVATSKA</text>
        </svg>
      </div>
    );
  }

  // 3. Generali Osiguranje d.d.
  if (normalized.includes('generali')) {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <svg viewBox="0 0 150 40" fill="none" className="h-full w-auto">
          <rect x="4" y="4" width="32" height="32" rx="6" fill={monochrome ? "#ffffff" : "#C8102E"} />
          {/* St. Mark's Lion silhouette */}
          <path d="M12 25C13 21 16 18 20 18C23 18 25 20 27 20C28 20 29 19 28 17C29 17 31 19 30 21C29 23 27 24 24 24C22 24 20 25 18 26L12 25Z" fill="white" />
          <circle cx="27" cy="16" r="1.5" fill="white" />
          <rect x="14" y="25" width="12" height="3" rx="1" fill="#FFD700" />
          <text x="42" y="23" fill={monochrome ? "#94a3b8" : "#ffffff"} fontSize="13.5" fontWeight="800" fontFamily="Inter, sans-serif" letterSpacing="0.5">GENERALI</text>
          <text x="42" y="32" fill={monochrome ? "#64748b" : "#94a3b8"} fontSize="8" fontWeight="600" fontFamily="Inter, sans-serif">OSIGURANJE</text>
        </svg>
      </div>
    );
  }

  // 4. Wiener Städtische VIG (Vienna Insurance Group)
  if (normalized.includes('wiener') || normalized.includes('vig')) {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <svg viewBox="0 0 155 40" fill="none" className="h-full w-auto">
          <circle cx="20" cy="20" r="16" fill={monochrome ? "#ffffff" : "#E30613"} />
          <path d="M12 16L16 26L20 18L24 26L28 16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <text x="44" y="22" fill={monochrome ? "#94a3b8" : "#ffffff"} fontSize="13.5" fontWeight="800" fontFamily="Inter, sans-serif" letterSpacing="0.5">WIENER</text>
          <text x="44" y="32" fill={monochrome ? "#64748b" : "#fb6504"} fontSize="7.5" fontWeight="700" fontFamily="Space Mono, monospace">VIENNA INS. GROUP</text>
        </svg>
      </div>
    );
  }

  // 5. Grawe Hrvatska d.d. (Grazer Wechselseitige)
  if (normalized.includes('grawe')) {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <svg viewBox="0 0 145 40" fill="none" className="h-full w-auto">
          <rect x="4" y="4" width="32" height="32" rx="6" fill={monochrome ? "#ffffff" : "#008752"} />
          <path d="M25 14H15V26H25V21H20" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
          <text x="44" y="24" fill={monochrome ? "#94a3b8" : "#ffffff"} fontSize="15" fontWeight="800" fontFamily="Inter, sans-serif" letterSpacing="0.8">GRAWE</text>
          <text x="44" y="33" fill={monochrome ? "#64748b" : "#34d399"} fontSize="7.5" fontWeight="700" fontFamily="Space Mono, monospace">HRVATSKA</text>
        </svg>
      </div>
    );
  }

  // 6. Triglav Osiguranje d.d.
  if (normalized.includes('triglav')) {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <svg viewBox="0 0 145 40" fill="none" className="h-full w-auto">
          <circle cx="20" cy="20" r="16" fill={monochrome ? "#ffffff" : "#0055A5"} />
          <path d="M12 25L17 15L20 20L23 13L28 25H12Z" fill="white" />
          <text x="44" y="24" fill={monochrome ? "#94a3b8" : "#ffffff"} fontSize="14" fontWeight="800" fontFamily="Inter, sans-serif" letterSpacing="0.5">triglav</text>
          <text x="44" y="33" fill={monochrome ? "#64748b" : "#94a3b8"} fontSize="7.5" fontWeight="600" fontFamily="Inter, sans-serif">OSIGURANJE</text>
        </svg>
      </div>
    );
  }

  // Fallback Institutional Badge
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/[0.04] border border-white/10 ${className}`}>
      <span className="w-2 h-2 rounded-full bg-[#fb6504]" />
      <span className="font-mono text-xs font-bold text-white tracking-wider uppercase">{name}</span>
    </div>
  );
};

export const CarrierLogoRow: React.FC<{ className?: string }> = ({ className = "" }) => {
  const carriers = [
    'Croatia Osiguranje',
    'Allianz Hrvatska',
    'Generali Osiguranje',
    'Wiener Städtische VIG',
    'Grawe Hrvatska',
    'Triglav Osiguranje'
  ];

  return (
    <div className={`flex flex-wrap items-center justify-center gap-6 sm:gap-10 py-6 border-y border-white/[0.06] bg-white/[0.01] ${className}`}>
      {carriers.map((carrier) => (
        <div key={carrier} className="opacity-75 hover:opacity-100 transition-opacity transform hover:scale-105 duration-200">
          <CarrierLogo name={carrier} className="h-7 sm:h-8" />
        </div>
      ))}
    </div>
  );
};
