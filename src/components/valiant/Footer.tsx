import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Award, FileText, ArrowUpRight } from 'lucide-react';

export const ValiantFooter: React.FC = () => {
  return (
    <footer className="border-t border-white/[0.07] bg-[#06080c] relative overflow-hidden">
      {/* Top Ambient Orange Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-[#fb6504]/10 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1 & 2: Branding & Regulatory Disclosures */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#fb6504] to-[#ea580c] text-white shadow-[0_0_15px_-3px_rgba(251,101,4,0.4)]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight text-white">VALIANT</span>
                <span className="font-mono text-xs ml-2 text-[#fb6504] font-bold">GLOBAL RISK</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              Valiant Global Risk Advisory LLC is a licensed specialty commercial insurance brokerage and Lloyd’s of London Coverholder (PIN: 119842X). Providing programmatic multi-carrier quoting, instant ACORD 25 certificate generation, and autonomous FNOL claims triage across admitted and non-admitted surplus lines markets.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-slate-300">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>A.M. Best 'A++' Capacity</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-slate-300">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>SOC2 Type II Certified</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-slate-300">
                <FileText className="w-3.5 h-3.5 text-[#fb6504]" />
                <span>ACORD 25 Compliant</span>
              </span>
            </div>
          </div>

          {/* Col 3: Transactional Engines */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200 font-bold">
              Transactional Engines
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/quote" className="hover:text-[#fb6504] transition-colors flex items-center gap-1">
                  <span>Comparative Quoting Engine</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-500" />
                </Link>
              </li>
              <li>
                <Link to="/portal/coi" className="hover:text-[#fb6504] transition-colors flex items-center gap-1">
                  <span>Instant ACORD 25 Generator</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-500" />
                </Link>
              </li>
              <li>
                <Link to="/claims/file" className="hover:text-[#fb6504] transition-colors flex items-center gap-1">
                  <span>Autonomous FNOL Claims</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-500" />
                </Link>
              </li>
              <li>
                <Link to="/appetite" className="hover:text-[#fb6504] transition-colors flex items-center gap-1">
                  <span>Underwriting Appetite Matrix</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-500" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Commercial Lines */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200 font-bold">
              Commercial Lines
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Commercial General Liability (CGL)</li>
              <li>Commercial Property & Interruption</li>
              <li>Technology Errors & Omissions (E&O)</li>
              <li>Cyber Extortion & Data Breach</li>
              <li>Commercial Auto & Fleet Schedule</li>
              <li>Workers' Compensation Statutory</li>
              <li>Commercial Excess & Umbrella</li>
            </ul>
          </div>

          {/* Col 5: Security & Headquarters */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200 font-bold">
              Brokerage Operations
            </h4>
            <div className="text-xs text-slate-400 space-y-1.5 leading-relaxed">
              <div className="text-white font-medium">Headquarters</div>
              <div>One World Trade Center, Suite 7800</div>
              <div>New York, NY 10007, United States</div>
              <div className="pt-2 font-mono text-[11px] text-slate-300">T: +1 (800) 492-8812</div>
              <div className="font-mono text-[11px] text-slate-400">underwriting@valiantglobalrisk.com</div>
              <div className="text-[10px] text-slate-500 pt-1">Surplus Lines License: #NY-9921448</div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright and Legal Notice */}
        <div className="mt-12 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Valiant Global Risk Advisory LLC. All rights reserved. Lloyd's Coverholder PIN: 119842X.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="hover:text-slate-400 cursor-pointer">Terms of Underwriting</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Surplus Lines Disclosures</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">ACORD Licensing</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
