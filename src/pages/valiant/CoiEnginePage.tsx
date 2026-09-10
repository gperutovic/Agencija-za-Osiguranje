import React, { useState } from 'react';
import { 
  FileText, 
  ShieldCheck, 
  Download, 
  Lock, 
  CheckCircle2, 
  Plus, 
  Search, 
  Copy, 
  Check, 
  ExternalLink 
} from 'lucide-react';
import { ValiantNavbar } from '../../components/valiant/Navbar';
import { ValiantFooter } from '../../components/valiant/Footer';
import { useValiantStore } from '../../services/valiantStore';
import { Acord25Preview } from '../../components/valiant/Acord25Preview';
import { generateAcord25Pdf } from '../../services/pdfGenerator';
import { CoiCertificate } from '../../types/valiant';

export const CoiEnginePage: React.FC = () => {
  const { policies, cois, issueCoi } = useValiantStore();

  const [selectedPolicyId, setSelectedPolicyId] = useState(policies[0]?.id || 'pol-cgl-01');
  const [holderName, setHolderName] = useState('Prologis Americas Logistics Hub LLC');
  const [holderAddress, setHolderAddress] = useState('2800 S. Desplaines Ave, Suite 300\nChicago, IL 60616');
  const [attentionLine, setAttentionLine] = useState('Attn: Risk Management & Contract Compliance');
  const [additionalInsured, setAdditionalInsured] = useState(true);
  const [waiverSubrogation, setWaiverSubrogation] = useState(true);
  const [cancellationNotice, setCancellationNotice] = useState(true);
  const [specialConditions, setSpecialConditions] = useState(
    'Certificate Holder is named as Additional Insured on a primary and non-contributory basis as required by written contract. 30-Day Notice of Cancellation applies.'
  );

  const [activeTab, setActiveTab] = useState<'create' | 'ledger'>('create');
  const [searchLedger, setSearchLedger] = useState('');
  const [recentlyIssued, setRecentlyIssued] = useState<CoiCertificate | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const selectedPolicy = policies.find((p) => p.id === selectedPolicyId) || policies[0];

  const handleIssueCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!holderName || !holderAddress) {
      alert('Please fill in Certificate Holder legal name and address.');
      return;
    }

    const newCoi = issueCoi(
      holderName,
      `${holderAddress}\n${attentionLine}`,
      additionalInsured,
      waiverSubrogation,
      specialConditions,
      selectedPolicyId
    );

    setRecentlyIssued(newCoi);
    // Auto trigger PDF download
    generateAcord25Pdf(newCoi, selectedPolicy);
  };

  const filteredCois = cois.filter(
    (c) =>
      c.holder_name.toLowerCase().includes(searchLedger.toLowerCase()) ||
      c.verification_hash.includes(searchLedger.toLowerCase())
  );

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#06080c] text-slate-100 flex flex-col selection:bg-[#fb6504] selection:text-white font-sans">
      <ValiantNavbar />

      <main className="flex-1 py-12 relative overflow-hidden">
        <div className="ambient-glow-orange -top-20" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2">
                <span className="rr-pill rr-pill--orange inline-flex">
                  <span className="rr-pill__dot bg-[#fb6504]" />
                  Self-Service Servicing Rail
                </span>
                <span className="text-xs font-mono text-slate-400">ACORD 25 (2026/03) Specification</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
                Instant Certificate of Insurance Engine
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl font-normal">
                Generate, cryptographically timestamp, and issue legally binding ACORD 25 Certificates of Liability Insurance directly to vendors and landlords.
              </p>
            </div>

            {/* Tab Controls */}
            <div className="inline-flex p-1 rounded-xl bg-white/[0.04] border border-white/[0.08]">
              <button
                type="button"
                onClick={() => setActiveTab('create')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'create'
                    ? 'bg-[#fb6504] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Issue New COI</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('ledger')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'ledger'
                    ? 'bg-[#fb6504] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Issued Certificates Ledger ({cois.length})</span>
              </button>
            </div>
          </div>

          {activeTab === 'create' ? (
            /* Create View: Split 2-Column Interface */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Form Controls (Span 5) */}
              <div className="lg:col-span-5 rr-surface-card p-6 sm:p-7 shadow-2xl space-y-6">
                <div className="border-b border-white/[0.08] pb-3">
                  <h2 className="text-base font-bold text-white tracking-tight">
                    Certificate Holder Parameters
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Values populate the live ACORD 25 rendering pane in real-time.
                  </p>
                </div>

                <form onSubmit={handleIssueCertificate} className="space-y-4 text-xs">
                  {/* Policy Selection */}
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-slate-300 mb-1.5">
                      Target Underlying Policy <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={selectedPolicyId}
                      onChange={(e) => setSelectedPolicyId(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#06080c] border border-white/[0.1] text-white focus:outline-none focus:border-[#fb6504] font-mono text-xs"
                    >
                      {policies.map((p) => (
                        <option key={p.id} value={p.id} className="bg-[#0a0d16]">
                          {p.policy_number} • {p.line_of_business} (${p.aggregate_limit / 1000000}M)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Holder Legal Name */}
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-slate-300 mb-1.5">
                      Certificate Holder Legal Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={holderName}
                      onChange={(e) => setHolderName(e.target.value)}
                      placeholder="e.g. Prologis Americas Logistics Hub LLC"
                      className="w-full px-3 py-2 rounded-xl bg-[#06080c] border border-white/[0.1] text-white placeholder-slate-500 focus:outline-none focus:border-[#fb6504]"
                    />
                  </div>

                  {/* Attention Line */}
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-slate-300 mb-1.5">
                      Attention Line / Contact
                    </label>
                    <input
                      type="text"
                      value={attentionLine}
                      onChange={(e) => setAttentionLine(e.target.value)}
                      placeholder="e.g. Attn: Contract Administration"
                      className="w-full px-3 py-2 rounded-xl bg-[#06080c] border border-white/[0.1] text-white placeholder-slate-500 focus:outline-none focus:border-[#fb6504]"
                    />
                  </div>

                  {/* Mailing Address */}
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-slate-300 mb-1.5">
                      Holder Mailing Address <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={holderAddress}
                      onChange={(e) => setHolderAddress(e.target.value)}
                      placeholder="Street address, Suite, City, State, ZIP..."
                      className="w-full px-3 py-2 rounded-xl bg-[#06080c] border border-white/[0.1] text-white placeholder-slate-500 focus:outline-none focus:border-[#fb6504] resize-none"
                    />
                  </div>

                  {/* Endorsement Checkboxes */}
                  <div className="pt-2 border-t border-white/[0.08] space-y-2.5">
                    <div className="text-[11px] font-mono uppercase text-slate-400 font-bold">
                      Contractual Endorsements
                    </div>

                    <label className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        checked={additionalInsured}
                        onChange={(e) => setAdditionalInsured(e.target.checked)}
                        className="w-4 h-4 rounded text-[#fb6504] accent-[#fb6504]"
                      />
                      <div>
                        <div className="font-semibold text-white">Include as Additional Insured</div>
                        <div className="text-[10px] text-slate-400">Primary and Non-Contributory wording</div>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        checked={waiverSubrogation}
                        onChange={(e) => setWaiverSubrogation(e.target.checked)}
                        className="w-4 h-4 rounded text-[#fb6504] accent-[#fb6504]"
                      />
                      <div>
                        <div className="font-semibold text-white">Waiver of Transfer of Rights (Subrogation)</div>
                        <div className="text-[10px] text-slate-400">Waives carrier recovery against Certificate Holder</div>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        checked={cancellationNotice}
                        onChange={(e) => setCancellationNotice(e.target.checked)}
                        className="w-4 h-4 rounded text-[#fb6504] accent-[#fb6504]"
                      />
                      <div>
                        <div className="font-semibold text-white">30-Day Notice of Cancellation</div>
                        <div className="text-[10px] text-slate-400">10-day notice for non-payment of premium</div>
                      </div>
                    </label>
                  </div>

                  {/* Special Conditions Description */}
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-slate-300 mb-1.5">
                      Description of Operations / Special Conditions
                    </label>
                    <textarea
                      rows={3}
                      value={specialConditions}
                      onChange={(e) => setSpecialConditions(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#06080c] border border-white/[0.1] text-white placeholder-slate-500 focus:outline-none focus:border-[#fb6504] text-xs font-mono resize-none"
                    />
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#fb6504] hover:bg-[#ff7b1a] text-white font-bold text-xs shadow-[0_0_25px_-5px_rgba(251,101,4,0.5)] transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Issue & Download Official ACORD 25 (PDF)</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Right Column: Live ACORD 25 Preview Pane (Span 7) */}
              <div className="lg:col-span-7 sticky top-24 space-y-4">
                <Acord25Preview
                  holderName={holderName}
                  holderAddress={`${holderAddress}\n${attentionLine}`}
                  additionalInsured={additionalInsured}
                  waiverSubrogation={waiverSubrogation}
                  specialConditions={specialConditions}
                  policy={selectedPolicy}
                />

                {recentlyIssued && (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Certificate issued with verification hash: {recentlyIssued.verification_hash.substring(0, 16)}...</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyHash(recentlyIssued.verification_hash)}
                      className="p-1 rounded bg-white/[0.05] text-slate-300 hover:text-white"
                    >
                      {copiedHash === recentlyIssued.verification_hash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Ledger View: Searchable History */
            <div className="rr-surface-card p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight">
                    Issued Certificates Cryptographic Ledger
                  </h2>
                  <p className="text-xs text-slate-400">
                    Immutable history of all issued ACORD 25 certificates with SHA-256 verification stamps.
                  </p>
                </div>

                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchLedger}
                    onChange={(e) => setSearchLedger(e.target.value)}
                    placeholder="Search holder or SHA-256 hash..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#06080c] border border-white/[0.1] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#fb6504] font-mono"
                  />
                </div>
              </div>

              <div className="border border-white/[0.08] rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#0a0d16] font-mono text-[10px] uppercase text-slate-400 border-b border-white/[0.08]">
                    <tr>
                      <th className="py-3 px-4">Certificate ID</th>
                      <th className="py-3 px-4">Certificate Holder</th>
                      <th className="py-3 px-4">Policy Number</th>
                      <th className="py-3 px-4">Date Issued</th>
                      <th className="py-3 px-4">Cryptographic Hash</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06] font-mono">
                    {filteredCois.map((c) => {
                      const pol = policies.find((p) => p.id === c.policy_id) || policies[0];

                      return (
                        <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3.5 px-4 font-bold text-white">
                            {c.id.toUpperCase()}
                          </td>
                          <td className="py-3.5 px-4 font-sans font-medium text-slate-200">
                            {c.holder_name}
                          </td>
                          <td className="py-3.5 px-4 text-[#fb6504]">
                            {c.policy_number || pol.policy_number}
                          </td>
                          <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                            {new Date(c.issued_at).toLocaleDateString('en-US')}
                          </td>
                          <td className="py-3.5 px-4 text-slate-400 text-[10px] max-w-xs truncate">
                            <div className="flex items-center gap-1.5">
                              <span className="truncate">{c.verification_hash.substring(0, 16)}...</span>
                              <button
                                type="button"
                                onClick={() => handleCopyHash(c.verification_hash)}
                                className="text-slate-500 hover:text-white"
                              >
                                {copiedHash === c.verification_hash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => generateAcord25Pdf(c, pol)}
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#fb6504]/10 text-[#fb6504] hover:bg-[#fb6504]/20 border border-[#fb6504]/25 text-xs font-sans font-semibold transition-colors cursor-pointer"
                            >
                              <Download className="w-3 h-3" />
                              <span>PDF</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      <ValiantFooter />
    </div>
  );
};

