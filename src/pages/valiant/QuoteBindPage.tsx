import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Layers, 
  Sliders, 
  ShieldCheck, 
  FileCheck2, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Sparkles, 
  Lock, 
  CreditCard, 
  Building, 
  Download, 
  AlertCircle, 
  ChevronRight,
  Shield,
  Award,
  CheckCircle2
} from 'lucide-react';
import { ValiantNavbar } from '../../components/valiant/Navbar';
import { ValiantFooter } from '../../components/valiant/Footer';
import { useValiantStore } from '../../services/valiantStore';
import { NAICS_DATABASE } from '../../services/naicsData';
import { SignatureCanvas } from '../../components/valiant/SignatureCanvas';
import { generateBinderPdf } from '../../services/pdfGenerator';
import { CarrierQuote } from '../../types/valiant';

export const QuoteBindPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentQuoteStage,
    setQuoteStage,
    quoteFormData,
    updateQuoteFormData,
    carrierQuotes,
    isCalculatingQuotes,
    generateCarrierQuotes,
    selectCarrier,
    bindPolicyAndExecute,
  } = useValiantStore();

  const [signatureName, setSignatureName] = useState(quoteFormData.contactName || '');
  const [signatureData, setSignatureData] = useState('');
  const [paymentType, setPaymentType] = useState<'ach' | 'credit_card'>('ach');
  const [boundPolicyId, setBoundPolicyId] = useState<string | null>(null);
  const [boundPolicyNumber, setBoundPolicyNumber] = useState<string | null>(null);
  const [binderRef, setBinderRef] = useState<string | null>(null);
  const [isBinding, setIsBinding] = useState(false);

  const stages = [
    { num: 1, title: 'Entity Profile', icon: Building2 },
    { num: 2, title: 'Operational Exposures', icon: Layers },
    { num: 3, title: 'Coverage Customizer', icon: Sliders },
    { num: 4, title: 'Carrier Matrix', icon: ShieldCheck },
    { num: 5, title: 'Digital Bind & Execution', icon: FileCheck2 },
  ];

  // Stage 1 Handler
  const handleStage1Next = (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteStage(2);
  };

  // Stage 2 Handler
  const handleStage2Next = (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteStage(3);
  };

  // Stage 3 Handler: Triggers actuarial comparative calculation
  const handleStage3Next = () => {
    generateCarrierQuotes();
  };

  // Stage 5 Handler: Bind Execution
  const handleExecuteBind = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signatureName) {
      alert('Please enter your authorized signatory legal full name.');
      return;
    }

    setIsBinding(true);
    setTimeout(() => {
      const bound = bindPolicyAndExecute(signatureName, signatureData);
      const generatedRef = `BND-VGR-${Math.floor(100000 + Math.random() * 900000)}`;
      setBoundPolicyId(bound.id);
      setBoundPolicyNumber(bound.policy_number);
      setBinderRef(generatedRef);
      setIsBinding(false);
    }, 900);
  };

  const selectedQuote: CarrierQuote | undefined = carrierQuotes.find(
    (q) => q.carrierId === quoteFormData.selectedCarrierId
  ) || carrierQuotes[0];

  return (
    <div className="min-h-screen bg-[#06080c] text-slate-100 flex flex-col selection:bg-[#fb6504] selection:text-white font-sans">
      <ValiantNavbar />

      <main className="flex-1 py-12 relative overflow-hidden">
        {/* Subtle Ambient Background */}
        <div className="ambient-glow-orange -top-20" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header Title */}
          <div className="text-center space-y-2 mb-8">
            <span className="rr-pill rr-pill--orange inline-flex">
              <span className="rr-pill__dot bg-[#fb6504]" />
              Multi-Carrier Commercial Underwriting Funnel
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Transactional Quote & Instant Bind Rail
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto font-mono">
              Institutional capacity • Direct carrier syndicate pricing • Legally binding digital execution
            </p>
          </div>

          {/* 5-Stage Stepper Header */}
          <div className="mb-10 p-3 rounded-2xl bg-[#0a0d16]/95 border border-white/[0.08] backdrop-blur-xl shadow-xl overflow-x-auto">
            <div className="flex items-center justify-between min-w-[620px]">
              {stages.map((st, idx) => {
                const Icon = st.icon;
                const isCompleted = currentQuoteStage > st.num;
                const isCurrent = currentQuoteStage === st.num;

                return (
                  <React.Fragment key={st.num}>
                    <button
                      type="button"
                      onClick={() => {
                        if (isCompleted) setQuoteStage(st.num);
                      }}
                      disabled={!isCompleted && !isCurrent}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-[#fb6504] text-white shadow-[0_0_15px_-3px_rgba(251,101,4,0.5)] font-semibold'
                          : isCompleted
                          ? 'text-emerald-400 hover:bg-white/[0.04]'
                          : 'text-slate-500 cursor-not-allowed opacity-60'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-mono font-bold ${
                        isCurrent
                          ? 'bg-white/20 text-white'
                          : isCompleted
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-white/[0.05] text-slate-500'
                      }`}>
                        {isCompleted ? <Check className="w-3.5 h-3.5" /> : st.num}
                      </div>
                      <span className="text-xs font-sans whitespace-nowrap">{st.title}</span>
                    </button>

                    {idx < stages.length - 1 && (
                      <div className={`flex-1 h-[1px] mx-2 ${
                        currentQuoteStage > st.num ? 'bg-emerald-500/40' : 'bg-white/[0.08]'
                      }`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Form Container */}
          <div className="rr-surface-card p-6 sm:p-10 shadow-2xl">
            {/* ======================================================== */}
            {/* STAGE 1: ENTITY PROFILE */}
            {/* ======================================================== */}
            {currentQuoteStage === 1 && (
              <form onSubmit={handleStage1Next} className="space-y-6">
                <div className="border-b border-white/[0.08] pb-4">
                  <span className="text-xs font-mono text-[#fb6504] uppercase tracking-wider font-bold">
                    Stage 1 of 5 • Corporate Identity
                  </span>
                  <h2 className="text-xl font-bold text-white tracking-tight mt-1">
                    Commercial Entity & Industry Classification
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Ingest legal entity identification to match NAICS underwriting appetite classes.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                      Company Legal Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={quoteFormData.companyName}
                      onChange={(e) => updateQuoteFormData({ companyName: e.target.value })}
                      placeholder="e.g. Vanguard Logistics & Cold-Chain Solutions LLC"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#06080c] border border-white/[0.1] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#fb6504]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                      Incorporation Jurisdiction <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={quoteFormData.jurisdiction}
                      onChange={(e) => updateQuoteFormData({ jurisdiction: e.target.value })}
                      placeholder="e.g. Illinois, USA or Delaware, USA"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#06080c] border border-white/[0.1] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#fb6504]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                      Federal Tax ID (EIN) <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={quoteFormData.taxIdEin}
                      onChange={(e) => updateQuoteFormData({ taxIdEin: e.target.value })}
                      placeholder="36-9812450"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#06080c] border border-white/[0.1] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#fb6504] font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                      NAICS Industry Category <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={quoteFormData.naicsCode}
                      onChange={(e) => {
                        const selected = NAICS_DATABASE.find((n) => n.code === e.target.value);
                        updateQuoteFormData({
                          naicsCode: e.target.value,
                          industryTitle: selected ? selected.title : quoteFormData.industryTitle,
                        });
                      }}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#06080c] border border-white/[0.1] text-sm text-white focus:outline-none focus:border-[#fb6504] font-mono"
                    >
                      {NAICS_DATABASE.map((item) => (
                        <option key={item.code} value={item.code} className="bg-[#0a0d16]">
                          {item.code} - {item.title} ({item.hazardClass} Hazard)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/[0.08]">
                  <div className="text-xs font-mono text-slate-400 mb-3 uppercase">Primary Corporate Officer / Risk Manager</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <input
                        type="text"
                        required
                        value={quoteFormData.contactName}
                        onChange={(e) => updateQuoteFormData({ contactName: e.target.value })}
                        placeholder="Full Name (e.g. Marcus Vance)"
                        className="w-full px-3 py-2 rounded-xl bg-[#06080c] border border-white/[0.1] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#fb6504]"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        required
                        value={quoteFormData.contactEmail}
                        onChange={(e) => updateQuoteFormData({ contactEmail: e.target.value })}
                        placeholder="Corporate Email"
                        className="w-full px-3 py-2 rounded-xl bg-[#06080c] border border-white/[0.1] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#fb6504]"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        required
                        value={quoteFormData.contactPhone}
                        onChange={(e) => updateQuoteFormData({ contactPhone: e.target.value })}
                        placeholder="Direct Phone"
                        className="w-full px-3 py-2 rounded-xl bg-[#06080c] border border-white/[0.1] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#fb6504]"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#fb6504] hover:bg-[#ff7b1a] text-white font-semibold text-xs shadow-[0_0_20px_-3px_rgba(251,101,4,0.5)] transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <span>Proceed to Operational Exposures</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* ======================================================== */}
            {/* STAGE 2: OPERATIONAL EXPOSURES */}
            {/* ======================================================== */}
            {currentQuoteStage === 2 && (
              <form onSubmit={handleStage2Next} className="space-y-6">
                <div className="border-b border-white/[0.08] pb-4">
                  <span className="text-xs font-mono text-[#fb6504] uppercase tracking-wider font-bold">
                    Stage 2 of 5 • Exposure Baselines
                  </span>
                  <h2 className="text-xl font-bold text-white tracking-tight mt-1">
                    Operational Scale & Exposure Telemetry
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Actuarial rating engines scale commercial premiums dynamically against gross revenue, payroll, and physical facilities.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-mono">
                  <div>
                    <label className="block text-xs uppercase text-slate-300 mb-1.5 font-sans">
                      Annual Gross Revenue (USD) <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm">$</span>
                      <input
                        type="number"
                        required
                        min={100000}
                        value={quoteFormData.annualRevenue}
                        onChange={(e) => updateQuoteFormData({ annualRevenue: Number(e.target.value) })}
                        className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-[#06080c] border border-white/[0.1] text-sm text-white focus:outline-none focus:border-[#fb6504] tabular-nums"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase text-slate-300 mb-1.5 font-sans">
                      Annual Gross Payroll (USD) <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm">$</span>
                      <input
                        type="number"
                        required
                        min={50000}
                        value={quoteFormData.grossPayroll}
                        onChange={(e) => updateQuoteFormData({ grossPayroll: Number(e.target.value) })}
                        className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-[#06080c] border border-white/[0.1] text-sm text-white focus:outline-none focus:border-[#fb6504] tabular-nums"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase text-slate-300 mb-1.5 font-sans">
                      Full-Time Equivalent Employees (FTE) <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={quoteFormData.fullTimeEmployees}
                      onChange={(e) => updateQuoteFormData({ fullTimeEmployees: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#06080c] border border-white/[0.1] text-sm text-white focus:outline-none focus:border-[#fb6504] tabular-nums"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase text-slate-300 mb-1.5 font-sans">
                      Premises Square Footage (Sq. Ft.) <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min={500}
                      value={quoteFormData.premisesSquareFootage}
                      onChange={(e) => updateQuoteFormData({ premisesSquareFootage: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#06080c] border border-white/[0.1] text-sm text-white focus:outline-none focus:border-[#fb6504] tabular-nums"
                    />
                  </div>
                </div>

                {/* International Exposure Toggle */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-white">International Operations & Foreign Exposure</div>
                      <div className="text-[11px] text-slate-400">Do you conduct business, ship products, or employ staff outside North America?</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={quoteFormData.hasInternationalExposure}
                        onChange={(e) => updateQuoteFormData({ hasInternationalExposure: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#fb6504]" />
                    </label>
                  </div>

                  {quoteFormData.hasInternationalExposure && (
                    <div>
                      <input
                        type="text"
                        value={quoteFormData.internationalCountries || ''}
                        onChange={(e) => updateQuoteFormData({ internationalCountries: e.target.value })}
                        placeholder="List countries (e.g. UK, Germany, Rotterdam Port Hub, Singapore)"
                        className="w-full px-3 py-2 rounded-lg bg-[#06080c] border border-white/[0.1] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#fb6504]"
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setQuoteStage(1)}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/[0.05] text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#fb6504] hover:bg-[#ff7b1a] text-white font-semibold text-xs shadow-[0_0_20px_-3px_rgba(251,101,4,0.5)] transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <span>Proceed to Coverage Customizer</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* ======================================================== */}
            {/* STAGE 3: COVERAGE CUSTOMIZER */}
            {/* ======================================================== */}
            {currentQuoteStage === 3 && (
              <div className="space-y-6">
                <div className="border-b border-white/[0.08] pb-4">
                  <span className="text-xs font-mono text-[#fb6504] uppercase tracking-wider font-bold">
                    Stage 3 of 5 • Liability Limits & Retentions
                  </span>
                  <h2 className="text-xl font-bold text-white tracking-tight mt-1">
                    Coverage Customizer & Commercial Endorsements
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Tailor your occurrence/aggregate limits, retention tranches, and add specialized commercial underwriting riders.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Aggregate Limit Grid */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
                        Aggregate Coverage Limit
                      </label>
                      <span className="font-mono text-sm font-bold text-[#fb6504]">
                        ${quoteFormData.aggregateLimit.toLocaleString('en-US')} USD
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                      {[1000000, 2000000, 5000000, 10000000].map((lim) => (
                        <button
                          key={lim}
                          type="button"
                          onClick={() => updateQuoteFormData({ 
                            aggregateLimit: lim,
                            occurrenceLimit: lim === 1000000 ? 1000000 : Math.round(lim / 2)
                          })}
                          className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                            quoteFormData.aggregateLimit === lim
                              ? 'bg-[#fb6504] text-white border-[#ff7b1a] shadow-[0_0_20px_-3px_rgba(251,101,4,0.5)]'
                              : 'bg-white/[0.03] text-slate-300 border-white/[0.08] hover:border-white/20'
                          }`}
                        >
                          <div className="text-base font-extrabold">${lim / 1000000}M</div>
                          <div className="text-[10px] text-white/80 font-sans mt-0.5">
                            Occur: ${lim === 1000000 ? '1M' : `${lim / 2000000}M`}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Deductible Selector */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
                        Self-Insured Retention (SIR) / Deductible
                      </label>
                      <span className="font-mono text-sm font-bold text-white">
                        ${quoteFormData.deductible.toLocaleString('en-US')}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 font-mono">
                      {[1000, 5000, 10000, 25000].map((ded) => (
                        <button
                          key={ded}
                          type="button"
                          onClick={() => updateQuoteFormData({ deductible: ded })}
                          className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            quoteFormData.deductible === ded
                              ? 'bg-[#fb6504] text-white border-[#ff7b1a] shadow-[0_0_15px_-3px_rgba(251,101,4,0.5)]'
                              : 'bg-white/[0.03] text-slate-300 border-white/[0.08] hover:border-white/20'
                          }`}
                        >
                          ${ded >= 1000 ? `${ded / 1000}k` : ded}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Endorsements Toggles */}
                  <div className="space-y-3 pt-2">
                    <div className="text-xs font-mono uppercase text-slate-400">Commercial Underwriting Endorsement Riders</div>

                    <label className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.08] hover:border-white/20 transition-all cursor-pointer">
                      <div className="pr-4">
                        <div className="text-xs font-bold text-white">Cyber Risk & Extortion Endorsement</div>
                        <div className="text-[11px] text-slate-400">Covers digital forensics, ransom defense, cold-chain IoT disruptions, and business interruption.</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={quoteFormData.includeCyberEndorsement}
                        onChange={(e) => updateQuoteFormData({ includeCyberEndorsement: e.target.checked })}
                        className="w-4 h-4 rounded text-[#fb6504] focus:ring-[#fb6504] accent-[#fb6504]"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.08] hover:border-white/20 transition-all cursor-pointer">
                      <div className="pr-4">
                        <div className="text-xs font-bold text-white">Hired & Non-Owned Auto Liability</div>
                        <div className="text-[11px] text-slate-400">Protects against third-party bodily injury from employee-driven rental or sub-contracted fleet vehicles.</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={quoteFormData.includeHiredAuto}
                        onChange={(e) => updateQuoteFormData({ includeHiredAuto: e.target.checked })}
                        className="w-4 h-4 rounded text-[#fb6504] focus:ring-[#fb6504] accent-[#fb6504]"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.08] hover:border-white/20 transition-all cursor-pointer">
                      <div className="pr-4">
                        <div className="text-xs font-bold text-white">Employment Practices Liability (EPLI) Rider</div>
                        <div className="text-[11px] text-slate-400">Defends against wrongful termination, harassment, and workplace discrimination lawsuits.</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={quoteFormData.includeEpliRider}
                        onChange={(e) => updateQuoteFormData({ includeEpliRider: e.target.checked })}
                        className="w-4 h-4 rounded text-[#fb6504] focus:ring-[#fb6504] accent-[#fb6504]"
                      />
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-white/[0.08]">
                  <button
                    type="button"
                    onClick={() => setQuoteStage(2)}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/[0.05] text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleStage3Next}
                    disabled={isCalculatingQuotes}
                    className="flex items-center gap-2 px-7 py-3 rounded-xl bg-[#fb6504] hover:bg-[#ff7b1a] text-white font-semibold text-xs shadow-[0_0_25px_-3px_rgba(251,101,4,0.6)] transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    {isCalculatingQuotes ? (
                      <>
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        <span>Running Actuarial Engine...</span>
                      </>
                    ) : (
                      <>
                        <span>Generate Comparative Carrier Matrix</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* STAGE 4: COMPARATIVE CARRIER MATRIX */}
            {/* ======================================================== */}
            {currentQuoteStage === 4 && (
              <div className="space-y-6">
                <div className="border-b border-white/[0.08] pb-4">
                  <span className="text-xs font-mono text-[#fb6504] uppercase tracking-wider font-bold">
                    Stage 4 of 5 • Multi-Carrier Syndicate Comparison
                  </span>
                  <h2 className="text-xl font-bold text-white tracking-tight mt-1">
                    Comparative Carrier Matrix (3 Distinct Institutional Offers)
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Compare A.M. Best ratings, terms, and key policy exclusions before digital execution.
                  </p>
                </div>

                {/* 3 Carrier Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {carrierQuotes.map((q) => {
                    const isSelected = quoteFormData.selectedCarrierId === q.carrierId;

                    return (
                      <div
                        key={q.carrierId}
                        onClick={() => selectCarrier(q.carrierId)}
                        className={`rounded-2xl p-5 border transition-all cursor-pointer flex flex-col justify-between relative ${
                          isSelected
                            ? 'bg-[#0a0d16] border-[#fb6504] shadow-[0_0_30px_-5px_rgba(251,101,4,0.3)] ring-1 ring-[#fb6504]'
                            : 'bg-white/[0.02] border-white/[0.08] hover:border-white/20 hover:bg-white/[0.04]'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-[#fb6504] text-white text-[10px] font-mono font-bold flex items-center gap-1 shadow-md">
                            <Check className="w-3 h-3" />
                            <span>SELECTED OFFER</span>
                          </div>
                        )}

                        <div>
                          {/* Carrier Name & Ratings */}
                          <div className="space-y-1">
                            <div className="text-xs font-mono text-[#fb6504] uppercase font-bold">
                              {q.carrierName}
                            </div>
                            <div className="text-[11px] text-slate-400 truncate">{q.syndicateName}</div>
                            <div className="flex items-center gap-2 pt-1 font-mono text-[10px]">
                              <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                AM Best: {q.amBestRating}
                              </span>
                              <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                S&P: {q.spRating}
                              </span>
                            </div>
                          </div>

                          {/* Price Tag */}
                          <div className="mt-4 pt-4 border-t border-white/[0.06]">
                            <div className="text-2xl font-black text-white font-mono tabular-nums">
                              ${q.annualPremium.toLocaleString('en-US')}
                              <span className="text-xs font-normal text-slate-400"> / yr</span>
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              or ${q.monthlyPremium.toLocaleString('en-US')}/mo
                            </div>
                          </div>

                          {/* Key Features */}
                          <div className="mt-4 space-y-2">
                            <div className="text-[10px] font-mono text-slate-300 uppercase font-bold">
                              Key Inclusions:
                            </div>
                            {q.keyFeatures.map((f, i) => (
                              <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-300">
                                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                <span>{f}</span>
                              </div>
                            ))}
                          </div>

                          {/* Key Exclusions */}
                          <div className="mt-4 pt-3 border-t border-white/[0.06] space-y-1.5">
                            <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                              Policy Exclusions:
                            </div>
                            {q.keyExclusions.map((ex, i) => (
                              <div key={i} className="flex items-start gap-1.5 text-[10.5px] text-slate-400">
                                <span className="text-red-400">•</span>
                                <span>{ex}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-5 mt-4 border-t border-white/[0.06]">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              selectCarrier(q.carrierId);
                            }}
                            className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#fb6504] text-white shadow-md'
                                : 'bg-white/[0.05] text-slate-200 hover:bg-white/[0.1]'
                            }`}
                          >
                            {isSelected ? 'Proceed with Selected Carrier' : 'Select This Syndicate'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-white/[0.08]">
                  <button
                    type="button"
                    onClick={() => setQuoteStage(3)}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/[0.05] text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Adjust Coverage</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setQuoteStage(5)}
                    className="flex items-center gap-2 px-7 py-3 rounded-xl bg-[#fb6504] hover:bg-[#ff7b1a] text-white font-semibold text-xs shadow-[0_0_25px_-3px_rgba(251,101,4,0.6)] transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <span>Proceed to Electronic Signature & Bind</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* STAGE 5: DIGITAL BIND & EXECUTION */}
            {/* ======================================================== */}
            {currentQuoteStage === 5 && (
              <div className="space-y-6">
                <div className="border-b border-white/[0.08] pb-4">
                  <span className="text-xs font-mono text-[#fb6504] uppercase tracking-wider font-bold">
                    Stage 5 of 5 • Digital Execution
                  </span>
                  <h2 className="text-xl font-bold text-white tracking-tight mt-1">
                    Electronic Binder Execution & Settlement
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Sign the commercial binding agreement, configure settlement rails, and immediately download the executed binder.
                  </p>
                </div>

                {boundPolicyNumber ? (
                  /* Success Bound State */
                  <div className="text-center py-8 space-y-6">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto animate-bounce">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>

                    <div className="space-y-2">
                      <span className="rr-pill rr-pill--orange inline-flex">
                        <span className="rr-pill__dot bg-emerald-400" />
                        POLICY BOUND & IN-FORCE
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                        Policy #{boundPolicyNumber} Successfully Executed
                      </h3>
                      <p className="text-xs font-mono text-slate-400">
                        Binder Reference: <span className="text-[#fb6504] font-bold">{binderRef}</span> • Underwritten by {selectedQuote?.carrierName}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                      {selectedQuote && binderRef && (
                        <button
                          type="button"
                          onClick={() => generateBinderPdf(quoteFormData, selectedQuote, binderRef)}
                          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#fb6504] hover:bg-[#ff7b1a] text-white text-xs font-bold shadow-[0_0_25px_-5px_rgba(251,101,4,0.5)] transition-all cursor-pointer"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download Executed Policy Binder (PDF)</span>
                        </button>
                      )}

                      <Link
                        to="/portal/coi"
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 text-xs font-bold border border-white/[0.1] transition-all"
                      >
                        <span>Issue Instant ACORD 25 for this Policy</span>
                        <ArrowRight className="w-4 h-4 text-[#fb6504]" />
                      </Link>

                      <Link
                        to="/portal"
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 text-xs font-bold border border-white/[0.1] transition-all"
                      >
                        <span>Go to Commercial Client Portal</span>
                      </Link>
                    </div>
                  </div>
                ) : (
                  /* Unbound Execution Form */
                  <form onSubmit={handleExecuteBind} className="space-y-6">
                    {/* Selected Summary Card */}
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="text-xs font-mono text-slate-400 uppercase">Binding Syndicate</div>
                        <div className="text-sm font-bold text-white">{selectedQuote?.carrierName}</div>
                        <div className="text-[11px] font-mono text-[#fb6504]">
                          Limit: ${quoteFormData.aggregateLimit.toLocaleString('en-US')} • Retention: ${quoteFormData.deductible.toLocaleString('en-US')}
                        </div>
                      </div>
                      <div className="text-left sm:text-right font-mono">
                        <div className="text-xs text-slate-400">Total Bound Annual Premium</div>
                        <div className="text-xl font-extrabold text-white">
                          ${selectedQuote?.annualPremium.toLocaleString('en-US')} USD
                        </div>
                      </div>
                    </div>

                    {/* Electronic Signature Canvas */}
                    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-3">
                      <SignatureCanvas
                        defaultName={signatureName}
                        onSignatureChange={(url, name) => {
                          setSignatureData(url);
                          setSignatureName(name);
                        }}
                      />
                    </div>

                    {/* Settlement / Billing Rail Selector */}
                    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-4">
                      <div className="text-xs font-mono uppercase text-slate-300 font-bold">
                        Institutional Settlement Rail
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setPaymentType('ach')}
                          className={`p-3 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
                            paymentType === 'ach'
                              ? 'bg-[#fb6504]/10 border-[#fb6504] text-white shadow-sm'
                              : 'bg-white/[0.02] border-white/[0.08] text-slate-400 hover:text-white'
                          }`}
                        >
                          <Building className="w-5 h-5 text-[#fb6504]" />
                          <div className="text-left">
                            <div className="text-xs font-bold">Corporate ACH Debit</div>
                            <div className="text-[10px] text-slate-400">Direct federal reserve clearing</div>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPaymentType('credit_card')}
                          className={`p-3 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
                            paymentType === 'credit_card'
                              ? 'bg-[#fb6504]/10 border-[#fb6504] text-white shadow-sm'
                              : 'bg-white/[0.02] border-white/[0.08] text-slate-400 hover:text-white'
                          }`}
                        >
                          <CreditCard className="w-5 h-5 text-[#a855f7]" />
                          <div className="text-left">
                            <div className="text-xs font-bold">Corporate Card</div>
                            <div className="text-[10px] text-slate-400">Visa / Mastercard / Amex</div>
                          </div>
                        </button>
                      </div>

                      {paymentType === 'ach' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                          <input
                            type="text"
                            required
                            placeholder="Bank Routing Transit Number (9 Digits)"
                            defaultValue="021000021"
                            className="w-full px-3 py-2.5 rounded-xl bg-[#06080c] border border-white/[0.1] text-white placeholder-slate-500 focus:outline-none focus:border-[#fb6504]"
                          />
                          <input
                            type="text"
                            required
                            placeholder="Corporate Depository Account Number"
                            defaultValue="982341209144"
                            className="w-full px-3 py-2.5 rounded-xl bg-[#06080c] border border-white/[0.1] text-white placeholder-slate-500 focus:outline-none focus:border-[#fb6504]"
                          />
                        </div>
                      ) : (
                        <div className="space-y-3 font-mono text-xs">
                          <input
                            type="text"
                            required
                            placeholder="Card Number (4000 1234 5678 9010)"
                            defaultValue="4111 2222 3333 4444"
                            className="w-full px-3 py-2.5 rounded-xl bg-[#06080c] border border-white/[0.1] text-white placeholder-slate-500 focus:outline-none focus:border-[#fb6504]"
                          />
                          <div className="grid grid-cols-2 gap-3">
                            <input
                              type="text"
                              required
                              placeholder="MM/YY"
                              defaultValue="12/28"
                              className="w-full px-3 py-2.5 rounded-xl bg-[#06080c] border border-white/[0.1] text-white placeholder-slate-500 focus:outline-none focus:border-[#fb6504]"
                            />
                            <input
                              type="text"
                              required
                              placeholder="CVC (3 digits)"
                              defaultValue="882"
                              className="w-full px-3 py-2.5 rounded-xl bg-[#06080c] border border-white/[0.1] text-white placeholder-slate-500 focus:outline-none focus:border-[#fb6504]"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-white/[0.08]">
                      <button
                        type="button"
                        onClick={() => setQuoteStage(4)}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/[0.05] text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Carrier Matrix</span>
                      </button>

                      <button
                        type="submit"
                        disabled={isBinding}
                        className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#fb6504] hover:bg-[#ff7b1a] text-white font-bold text-xs shadow-[0_0_30px_-5px_rgba(251,101,4,0.5)] transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
                      >
                        {isBinding ? (
                          <>
                            <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                            <span>Binding Policy & Generating Certificate...</span>
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-4 h-4" />
                            <span>Confirm Electronic Bind & Issue Binder</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <ValiantFooter />
    </div>
  );
};

