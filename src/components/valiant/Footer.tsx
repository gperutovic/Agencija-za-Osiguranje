import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Award, FileText, Globe, ArrowUpRight } from 'lucide-react';

export const ValiantFooter: React.FC = () => {
  return (
    <footer className="border-t border-white/[0.08] bg-[#07090E] relative overflow-hidden">
      {/* Top Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-[#0284C7]/10 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1 & 2: Branding & Regulatory Disclosures */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#0284C7] to-[#0369a1] text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight text-white">VALIANT</span>
                <span className="font-mono text-xs ml-2 text-[#38bdf8] font-bold">GLOBAL RISK</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              Valiant Global Risk Advisory LLC is an autonomous, algorithmic specialty insurance brokerage and Lloyd’s of London Coverholder (PIN: 119842X). Providing programmatic quote, bind, certificate generation, and FNOL claims triage across North America and international markets.
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
            </div>
          </div>

          {/* Col 3: Transactional Engines */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200 font-bold">
              Transactional Engines
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/quote" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>Comparative Quoting Engine</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-500" />
                </Link>
              </li>
              <li>
                <Link to="/portal/coi" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>Instant ACORD 25 Generator</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-500" />
                </Link>
              </li>
              <li>
                <Link to="/claims/file" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>Autonomous FNOL Claims</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-500" />
                </Link>
              </li>
              <li>
                <Link to="/appetite" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>Underwriting Appetite Matrix</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-500" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Commercial Lines */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200 font-bold">
              Underwritten Lines
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Commercial General Liability</li>
              <li>Cyber Extortion & Tech E&O</li>
              <li>Commercial Property & Interruption</li>
              <li>Executive Directors & Officers (D&O)</li>
              <li>Hired & Non-Owned Auto Fleet</li>
              <li>Excess Casualty Layering</li>
            </ul>
          </div>

          {/* Col 5: Security & Headquarters */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200 font-bold">
              Global Operations
            </h4>
            <div className="text-xs text-slate-400 space-y-1.5 leading-relaxed">
              <div className="text-white font-medium">Headquarters</div>
              <div>One World Trade Center, Suite 7800</div>
              <div>New York, NY 10007, USA</div>
              <div className="pt-2 font-mono text-[11px] text-slate-300">T: +1 (800) 492-8812</div>
              <div className="font-mono text-[11px] text-slate-400">bind@valiantglobalrisk.com</div>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="mt-12 pt-8 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
          <div>
            © {new Date().getFullYear()} VALIANT GLOBAL RISK ADVISORY LLC. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">PRIVACY POLICY (GDPR & CCPA)</span>
            <span className="hover:text-slate-400 cursor-pointer">TERMS OF UNDERWRITING</span>
            <span className="hover:text-slate-400 cursor-pointer">SURPLUS LINES DISCLOSURES</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

