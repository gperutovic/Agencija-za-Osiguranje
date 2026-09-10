import React from 'react';
import { ShieldCheck, Lock, Award, CheckCircle2, Shield, Check } from 'lucide-react';

export const SecurityTrustCell: React.FC = () => {
  return (
    <div className="lg:col-span-4 vgr-bento-card p-6 flex flex-col justify-between relative overflow-hidden group">
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="vgr-pill bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
              Verified Compliance
            </span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 font-bold">100% AUDITED</span>
        </div>

        <h3 className="text-base font-bold text-white tracking-tight">
          Regulatory & Security Trust Badges
        </h3>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
          Institutional cryptographic security, zero-knowledge evidence encryption, and global carrier licensing.
        </p>

        {/* Badges Grid */}
        <div className="grid grid-cols-2 gap-2 mt-4 text-[11px] font-mono">
          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
            <div className="flex items-center gap-1.5 text-white font-bold">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>SOC2 Type II</span>
            </div>
            <div className="text-[10px] text-slate-400">Continuous 24/7 audit monitoring</div>
          </div>

          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
            <div className="flex items-center gap-1.5 text-white font-bold">
              <Shield className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span>HIPAA Ready</span>
            </div>
            <div className="text-[10px] text-slate-400">BAA executed data vaults</div>
          </div>

          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
            <div className="flex items-center gap-1.5 text-white font-bold">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Lloyd's PIN</span>
            </div>
            <div className="text-[10px] text-slate-400">Coverholder #119842X</div>
          </div>

          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
            <div className="flex items-center gap-1.5 text-white font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>A.M. Best 'A'</span>
            </div>
            <div className="text-[10px] text-slate-400">Only superior rated paper</div>
          </div>
        </div>
      </div>

      <div className="pt-5 mt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <span className="flex items-center gap-1 text-slate-300">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>AES-256 GCM Rest Encryption</span>
        </span>
        <span className="text-[#38bdf8]">TLS 1.3</span>
      </div>
    </div>
  );
};

