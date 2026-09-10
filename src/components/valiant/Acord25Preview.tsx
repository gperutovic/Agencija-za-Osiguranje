import React from 'react';
import { ShieldCheck, Lock, CheckCircle2, Download } from 'lucide-react';
import { CoiCertificate, Policy } from '../../types/valiant';
import { generateAcord25Pdf } from '../../services/pdfGenerator';

interface Acord25PreviewProps {
  holderName: string;
  holderAddress: string;
  additionalInsured: boolean;
  waiverSubrogation: boolean;
  specialConditions?: string;
  policy: Policy;
  verificationHash?: string;
  allowDownload?: boolean;
}

export const Acord25Preview: React.FC<Acord25PreviewProps> = ({
  holderName,
  holderAddress,
  additionalInsured,
  waiverSubrogation,
  specialConditions,
  policy,
  verificationHash,
  allowDownload = true,
}) => {
  const hash = verificationHash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';

  const mockCoi: CoiCertificate = {
    id: 'coi-preview',
    policy_id: policy.id,
    holder_name: holderName || 'Certificate Holder Legal Entity LLC',
    holder_address: holderAddress || '100 Enterprise Way, Suite 400, New York, NY 10001',
    additional_insured: additionalInsured,
    waiver_subrogation: waiverSubrogation,
    special_conditions: specialConditions,
    issued_at: new Date().toISOString(),
    verification_hash: hash,
    policy_number: policy.policy_number,
    carrier_name: policy.carrier_name,
    insured_name: 'Nexus Quantum Dynamics Inc.',
  };

  return (
    <div className="rounded-2xl border border-white/[0.12] bg-[#0A0D16] p-4 sm:p-6 shadow-2xl text-slate-800 font-sans relative overflow-hidden">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-white/[0.08] text-white">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#0284C7]/20 text-[#38bdf8] border border-[#0284C7]/30">
            ACORD 25 PREVIEW PANE
          </span>
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">
            Real-Time Cryptographic Form Verification
          </span>
        </div>

        {allowDownload && (
          <button
            type="button"
            onClick={() => generateAcord25Pdf(mockCoi, policy)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0284C7] hover:bg-[#0369a1] text-white text-xs font-semibold shadow-[0_0_15px_-3px_rgba(2,132,199,0.5)] transition-all active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Official PDF</span>
          </button>
        )}
      </div>

      {/* Actual ACORD 25 Sheet Rendered in Dark Ergonomic Style */}
      <div className="bg-slate-950/90 border border-slate-700/60 rounded-xl p-5 text-slate-200 text-xs shadow-inner space-y-4">
        {/* Sheet Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black tracking-tighter text-base text-white">ACORD</span>
              <span className="font-bold text-xs uppercase text-slate-300">
                Certificate of Liability Insurance
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              FORM 25 (2026/03) • PROGRAMMATIC SPECIFICATION
            </div>
          </div>
          <div className="text-right font-mono text-[11px] text-slate-400">
            <div>DATE: {new Date().toLocaleDateString('en-US')}</div>
            <div className="text-emerald-400 font-bold flex items-center gap-1 sm:justify-end">
              <CheckCircle2 className="w-3 h-3" />
              <span>ACTIVE STATUS</span>
            </div>
          </div>
        </div>

        {/* Producer & Insured & Carriers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
          <div className="space-y-3">
            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <div className="font-bold text-slate-400 uppercase text-[9px] font-mono">PRODUCER</div>
              <div className="font-bold text-white">VALIANT GLOBAL RISK ADVISORY LLC</div>
              <div className="text-slate-400">One World Trade Center, Suite 7800, New York, NY 10007</div>
              <div className="text-slate-500 font-mono text-[10px]">Lic. Surplus Lines #NY-9921448</div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <div className="font-bold text-slate-400 uppercase text-[9px] font-mono">INSURED</div>
              <div className="font-bold text-white">Nexus Quantum Dynamics Inc.</div>
              <div className="text-slate-400">Corporation Trust Center, 1209 Orange St, Wilmington, DE 19801</div>
              <div className="text-slate-500 font-mono text-[10px]">EIN: 12-3456789 • NAICS: 541512</div>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1.5">
            <div className="font-bold text-slate-400 uppercase text-[9px] font-mono">
              INSURERS AFFORDING COVERAGE
            </div>
            <div className="text-slate-300 flex justify-between">
              <span><strong className="text-[#38bdf8]">INSURER A:</strong> {policy.carrier_name}</span>
              <span className="text-slate-500 font-mono">NAIC #1882</span>
            </div>
            <div className="text-slate-300 flex justify-between">
              <span><strong>INSURER B:</strong> Lloyd's Specialty Syndicate</span>
              <span className="text-slate-500 font-mono">NAIC #2003</span>
            </div>
            <div className="text-slate-300 flex justify-between">
              <span><strong>INSURER C:</strong> AIG Commercial Insurance</span>
              <span className="text-slate-500 font-mono">NAIC #19445</span>
            </div>
            <div className="text-slate-300 flex justify-between">
              <span><strong>INSURER D:</strong> Zurich American Insurance Co.</span>
              <span className="text-slate-500 font-mono">NAIC #16535</span>
            </div>
          </div>
        </div>

        {/* Coverage Schedule Table */}
        <div className="border border-slate-800 rounded-lg overflow-hidden">
          <table className="w-full text-[10.5px]">
            <thead className="bg-slate-900 font-mono text-[9.5px] uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-1.5 px-2 text-left">INSR</th>
                <th className="py-1.5 px-2 text-left">Type of Insurance</th>
                <th className="py-1.5 px-2 text-left">Policy Number</th>
                <th className="py-1.5 px-2 text-left">Eff / Exp</th>
                <th className="py-1.5 px-2 text-right">Limits (USD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              <tr className="bg-slate-950/40">
                <td className="py-2 px-2 font-bold text-[#38bdf8]">A</td>
                <td className="py-2 px-2">
                  <div className="font-semibold text-white">COMMERCIAL GENERAL LIABILITY</div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                    <span className={additionalInsured ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                      {additionalInsured ? '[✓] Addl Insured' : '[ ] Addl Insured'}
                    </span>
                    <span className={waiverSubrogation ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                      {waiverSubrogation ? '[✓] Subr Waived' : '[ ] Subr Waived'}
                    </span>
                  </div>
                </td>
                <td className="py-2 px-2 font-mono font-bold text-white">
                  {policy.policy_number}
                </td>
                <td className="py-2 px-2 font-mono text-slate-400 text-[10px]">
                  <div>{policy.effective_date}</div>
                  <div>{policy.expiration_date}</div>
                </td>
                <td className="py-2 px-2 text-right font-mono tabular-nums text-slate-300">
                  <div>Occur: ${policy.occurrence_limit.toLocaleString('en-US')}</div>
                  <div className="font-bold text-white">Agg: ${policy.aggregate_limit.toLocaleString('en-US')}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Description of Operations */}
        <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-[10.5px]">
          <div className="font-bold text-slate-400 uppercase text-[9px] font-mono mb-1">
            DESCRIPTION OF OPERATIONS / SPECIAL CONDITIONS
          </div>
          <div className="text-slate-300 leading-relaxed font-mono text-[10px]">
            {specialConditions || (
              <>
                Certificate Holder is named as Additional Insured on a Primary and Non-Contributory basis as required by written contract. 
                Waiver of Subrogation applies in favor of Certificate Holder. 30-Day Notice of Cancellation applies.
              </>
            )}
          </div>
        </div>

        {/* Certificate Holder & Cryptographic Verification Box */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] pt-1">
          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <div className="font-bold text-slate-400 uppercase text-[9px] font-mono">CERTIFICATE HOLDER</div>
            <div className="font-bold text-white mt-0.5">{holderName || 'Enter legal holder name...'}</div>
            <div className="text-slate-400 mt-0.5 whitespace-pre-line">{holderAddress || 'Enter holder mailing address...'}</div>
          </div>

          <div className="p-2.5 rounded-lg bg-[#0284C7]/10 border border-[#0284C7]/30 space-y-1">
            <div className="flex items-center gap-1.5 text-[#38bdf8] font-bold text-[10px] font-mono">
              <Lock className="w-3 h-3" />
              <span>CRYPTOGRAPHIC STAMP (SHA-256)</span>
            </div>
            <div className="font-mono text-[9px] text-slate-300 break-all leading-tight">
              {hash}
            </div>
            <div className="text-[9px] text-emerald-400 font-mono flex items-center gap-1 pt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>VERIFIED VIA VALIANT RISK TRUST LEDGER</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

