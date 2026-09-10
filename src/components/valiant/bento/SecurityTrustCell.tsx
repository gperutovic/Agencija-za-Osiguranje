import React from 'react';
import { ShieldCheck, Lock, Award, CheckCircle2, Shield } from 'lucide-react';

export const SecurityTrustCell: React.FC = () => {
  return (
    <div className="rr-surface-card p-6 flex flex-col justify-between relative overflow-hidden group h-full">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="rr-pill rr-pill--success">
              <span className="rr-pill__dot" />
              Verified Trust
            </span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 font-bold">100% ADMITTED & LLOYD'S</span>
        </div>

        <h3 className="text-base font-bold text-white tracking-tight">
          Regulatory Compliance & Institutional Paper
        </h3>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
          Every commercial binder and certificate is backed by A.M. Best 'A++' rated capital and compliant with state insurance commissioner regulations.
        </p>

        {/* Badges Grid */}
        <div className="grid grid-cols-2 gap-2 mt-4 text-[11px] font-mono">
          <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.06] space-y-1">
            <div className="flex items-center gap-1.5 text-white font-bold">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>SOC2 Type II</span>
            </div>
            <div className="text-[10px] text-slate-400">Continuous institutional audit monitoring</div>
          </div>

          <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.06] space-y-1">
            <div className="flex items-center gap-1.5 text-white font-bold">
              <Award className="w-3.5 h-3.5 text-[#fb6504]" />
              <span>Lloyd's PIN</span>
            </div>
            <div className="text-[10px] text-slate-400">Coverholder #119842X</div>
          </div>

          <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.06] space-y-1">
            <div className="flex items-center gap-1.5 text-white font-bold">
              <Shield className="w-3.5 h-3.5 text-sky-400" />
              <span>ACORD Licensed</span>
            </div>
            <div className="text-[10px] text-slate-400">Official ISO & ACORD forms</div>
          </div>

          <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.06] space-y-1">
            <div className="flex items-center gap-1.5 text-white font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
              <span>A.M. Best 'A++'</span>
            </div>
            <div className="text-[10px] text-slate-400">Financial Size Category XV</div>
          </div>
        </div>
      </div>

      <div className="pt-4 mt-2 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400 font-mono">
        <span>Surplus Lines #NY-9921448</span>
        <span className="text-emerald-400 font-bold">All 50 States</span>
      </div>
    </div>
  );
};
