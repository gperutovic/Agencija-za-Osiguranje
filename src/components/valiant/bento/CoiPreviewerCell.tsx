import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowRight, Lock, CheckCircle2, Copy, Check } from 'lucide-react';

export const CoiPreviewerCell: React.FC = () => {
  const [vendorName, setVendorName] = useState('Acme Global Infrastructure LLC');
  const [copied, setCopied] = useState(false);

  const mockHash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';

  const copyHash = () => {
    navigator.clipboard.writeText(mockHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="lg:col-span-4 vgr-bento-card p-6 flex flex-col justify-between relative overflow-hidden group">
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#38bdf8]/10 text-[#38bdf8] flex items-center justify-center border border-[#38bdf8]/20">
              <FileText className="w-4 h-4" />
            </div>
            <span className="vgr-pill bg-white/[0.04] text-slate-300 border-white/[0.08]">
              Self-Service Preview
            </span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Instant Issue</span>
          </span>
        </div>

        <h3 className="text-base font-bold text-white tracking-tight">
          Instant ACORD 25 COI Generator
        </h3>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
          Eliminate 48-hour broker delays. Issue legally binding certificates with automated Additional Insured endorsement.
        </p>

        {/* Mini Input */}
        <div className="mt-4 space-y-2">
          <label className="block text-[11px] font-mono uppercase text-slate-400">
            Certificate Holder / Vendor
          </label>
          <input
            type="text"
            value={vendorName}
            onChange={(e) => setVendorName(e.target.value)}
            placeholder="Type certificate holder name..."
            className="w-full px-3 py-2 rounded-lg bg-[#07090E] border border-white/[0.1] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#0284C7]"
          />
        </div>

        {/* Live Mini Certificate Preview Card */}
        <div className="mt-3.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[10px] font-mono space-y-1.5 shadow-inner">
          <div className="flex justify-between items-center text-slate-400 border-b border-slate-800/80 pb-1">
            <span className="font-bold text-white text-[11px]">ACORD 25</span>
            <span className="text-emerald-400">VGR-GL-2026-8801</span>
          </div>
          <div className="text-slate-300 truncate">
            <strong>HOLDER:</strong> {vendorName || 'Certificate Holder LLC'}
          </div>
          <div className="flex items-center justify-between text-slate-400 text-[9px]">
            <span>[✓] Addl Insured</span>
            <span>[✓] Subrogation Waived</span>
            <span className="text-white font-bold">$2M Agg</span>
          </div>
          <div className="pt-1 flex items-center justify-between text-[9px] border-t border-slate-800/80 text-slate-400">
            <span className="flex items-center gap-1 text-[#38bdf8]">
              <Lock className="w-2.5 h-2.5" />
              <span>SHA-256: {mockHash.substring(0, 10)}...</span>
            </span>
            <button 
              type="button" 
              onClick={copyHash}
              className="text-slate-400 hover:text-white transition-colors"
            >
              {copied ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5" />}
            </button>
          </div>
        </div>
      </div>

      <div className="pt-5 mt-2 border-t border-white/[0.06]">
        <Link
          to="/portal/coi"
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white text-xs font-semibold border border-white/[0.1] transition-all hover:border-[#0284C7]/50"
        >
          <span>Open Full COI Engine</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#38bdf8]" />
        </Link>
      </div>
    </div>
  );
};

