import React from 'react';
import { ShieldCheck, Award, Lock, PhoneCall, Building2 } from 'lucide-react';

export const TrustBadgeBanner: React.FC = () => {
  return (
    <div className="bg-navy-950 text-slate-300 border-b border-navy-800/80 py-2 px-4 text-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-[11px]">
        {/* HANFA & Partner credential */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          <span className="font-bold text-white tracking-tight">AGENCIJA ŽIVOT d.o.o.</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-300 hidden sm:inline">
            Ovlašteni partner za zastupanje u osiguranju Generali osiguranja d.d.
          </span>
          <span className="text-slate-500 hidden md:inline">•</span>
          <span className="text-amber-400/90 font-medium hidden md:inline">
            HANFA Klasa: UP/I-983-02/24-01/12
          </span>
        </div>

        {/* Security and Phone hotline */}
        <div className="flex items-center gap-4 text-slate-400">
          <div className="hidden lg:flex items-center gap-1.5 text-teal-300">
            <Lock className="w-3 h-3" />
            <span>256-bitna SSL enkripcija podataka</span>
          </div>

          <a
            href="tel:+38514800120"
            className="flex items-center gap-1 text-white hover:text-teal-300 transition-colors font-semibold"
          >
            <PhoneCall className="w-3 h-3 text-teal-400" />
            <span>+385 1 4800 120</span>
          </a>
        </div>
      </div>
    </div>
  );
};
