import React from 'react';
import { Lock, PhoneCall } from 'lucide-react';

export const TrustBadgeBanner: React.FC = () => {
  return (
    <div className="bg-[#06080c] text-slate-300 border-b border-white/[0.08] py-2.5 px-4 text-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-[11px]">
        {/* HANFA & Partner credential */}
        <div className="flex items-center gap-2">
          <span className="rr-pill__dot bg-[#fb6504] shadow-[0_0_8px_#fb6504]" />
          <span className="font-bold text-white tracking-tight">AGENCIJA ŽIVOT d.o.o.</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-300 hidden sm:inline">
            Ovlašteni partner za zastupanje u osiguranju Generali osiguranja d.d.
          </span>
          <span className="text-slate-600 hidden md:inline">•</span>
          <span className="text-[#ff7b1a] font-mono text-[10px] uppercase tracking-wider hidden md:inline">
            HANFA Klasa: UP/I-983-02/24-01/12
          </span>
        </div>

        {/* Security and Phone hotline */}
        <div className="flex items-center gap-4 text-slate-400">
          <div className="hidden lg:flex items-center gap-1.5 text-teal-400 font-mono text-[10px]">
            <Lock className="w-3 h-3 text-teal-400" />
            <span>256-bitna SSL enkripcija podataka</span>
          </div>

          <a
            href="tel:+38514800120"
            className="flex items-center gap-1.5 text-white hover:text-[#fb6504] transition-colors font-mono font-bold text-xs"
          >
            <PhoneCall className="w-3 h-3 text-[#fb6504]" />
            <span>+385 1 4800 120</span>
          </a>
        </div>
      </div>
    </div>
  );
};
