import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowRight, CheckCircle2, Copy, Check } from 'lucide-react';

export const CoiPreviewerCell: React.FC = () => {
  const [holderName, setHolderName] = useState('Prologis Logistics Hub Midwest LLC');
  const [copied, setCopied] = useState(false);

  const mockHash = '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08';

  const copyHash = () => {
    navigator.clipboard.writeText(mockHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rr-surface-card p-6 flex flex-col justify-between relative overflow-hidden group h-full">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#fb6504]/10 text-[#fb6504] flex items-center justify-center border border-[#fb6504]/20">
              <FileText className="w-4 h-4" />
            </div>
            <span className="rr-pill rr-pill--orange">
              <span className="rr-pill__dot" />
              Engine 02
            </span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 font-semibold">
            <CheckCircle2 className="w-3 h-3" />
            <span>INSTANT DISPATCH</span>
          </span>
        </div>

        <h3 className="text-base font-bold text-white tracking-tight">
          Self-Service ACORD 25 COI Engine
        </h3>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
          Eliminate 48-hour broker delays. Issue legally binding Certificates of Insurance with automated Additional Insured endorsement in 60 seconds.
        </p>

        {/* Mini Certificate Input */}
        <div className="mt-4 space-y-1.5">
          <label className="block text-[10px] font-mono uppercase text-slate-400">
            Certificate Holder / Landlord
          </label>
          <input
            type="text"
            value={holderName}
            onChange={(e) => setHolderName(e.target.value)}
            placeholder="Type certificate holder name..."
            className="w-full px-3 py-2 rounded-lg bg-[#06080c] border border-white/[0.1] text-xs text-white placeholder-slate-500 font-sans focus:outline-none focus:border-[#fb6504]"
          />
        </div>

        {/* Live Mini Certificate Preview Card */}
        <div className="mt-3 p-3 rounded-xl bg-black/50 border border-white/[0.06] text-[10px] font-mono space-y-1.5 shadow-inner">
          <div className="flex justify-between items-center text-slate-400 border-b border-white/[0.06] pb-1">
            <span className="font-bold text-white text-[11px]">ACORD 25 (2026/03)</span>
            <span className="text-emerald-400">VGR-CGL-2026-8801</span>
          </div>
          <div className="text-slate-300 truncate">
            <span className="text-slate-500">Holder:</span> <strong className="text-white">{holderName || 'Enter entity...'}</strong>
          </div>
          <div className="text-slate-400 flex justify-between">
            <span>CGL Aggregate: $2,000,000</span>
            <span className="text-emerald-400">Addl Insured: YES</span>
          </div>
          <div className="text-slate-400 flex justify-between">
            <span>Insurer A: Chubb Federal</span>
            <span>NAIC #22667</span>
          </div>

          {/* SHA-256 Stamp */}
          <div className="pt-1.5 border-t border-white/[0.06] flex items-center justify-between">
            <span className="text-slate-500 text-[9px] font-mono">
              SHA: {mockHash.slice(0, 14)}...
            </span>
            <button
              onClick={copyHash}
              className="text-[#fb6504] hover:text-[#ff7b1a] flex items-center gap-1 text-[10px] font-bold"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy Hash'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="pt-4 mt-2 border-t border-white/[0.06] flex items-center justify-between">
        <span className="text-[11px] text-slate-400 font-mono">Real-Time Validation</span>
        <Link
          to="/portal/coi"
          className="text-xs font-semibold text-[#fb6504] hover:text-[#ff7b1a] flex items-center gap-1 group-hover:translate-x-0.5 transition-all"
        >
          <span>Open Full Engine</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
