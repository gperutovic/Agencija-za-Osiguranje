import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sliders, 
  Search, 
  ArrowRight, 
  Briefcase, 
  Building, 
  Cpu, 
  Check, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { NAICS_DATABASE, searchNaicsCodes } from '../../../services/naicsData';
import { useValiantStore } from '../../../services/valiantStore';

export const UnderwritingConsoleCell: React.FC = () => {
  const navigate = useNavigate();
  const { updateQuoteFormData, setQuoteStage } = useValiantStore();

  const [selectedLob, setSelectedLob] = useState<'Commercial General Liability' | 'Commercial Property' | 'Technology E&O / Cyber'>('Commercial General Liability');
  const [naicsQuery, setNaicsQuery] = useState('493120');
  const [selectedNaics, setSelectedNaics] = useState(
    NAICS_DATABASE.find(n => n.code === '493120') || NAICS_DATABASE[0]
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [limit, setLimit] = useState(2000000);
  const [deductible, setDeductible] = useState(5000);
  const [revenue, setRevenue] = useState(28500000);

  const searchResults = useMemo(() => searchNaicsCodes(naicsQuery), [naicsQuery]);

  // Actuarial Rate Computation
  const preliminaryEstimate = useMemo(() => {
    const hazardMult = selectedNaics ? selectedNaics.baseRateMultiplier : 1.25;
    const revMillions = Math.max(revenue / 1000000, 1);
    
    let limitFactor = 1.0;
    if (limit === 2000000) limitFactor = 1.18;
    else if (limit === 5000000) limitFactor = 1.65;
    else if (limit === 10000000) limitFactor = 2.40;

    let dedFactor = 1.0;
    if (deductible === 2500) dedFactor = 1.08;
    else if (deductible === 5000) dedFactor = 0.95;
    else if (deductible === 10000) dedFactor = 0.85;
    else if (deductible === 25000) dedFactor = 0.72;

    const baseRate = selectedLob.includes('Cyber') ? 950 : selectedLob.includes('Property') ? 1200 : 750;
    const est = Math.round(revMillions * baseRate * hazardMult * limitFactor * dedFactor);
    return {
      annual: est,
      monthly: Math.round(est / 12),
    };
  }, [selectedLob, selectedNaics, revenue, limit, deductible]);

  const handleLaunchBind = () => {
    updateQuoteFormData({
      lineOfBusiness: selectedLob,
      naicsCode: selectedNaics.code,
      industryTitle: selectedNaics.title,
      aggregateLimit: limit,
      occurrenceLimit: limit === 1000000 ? 1000000 : Math.round(limit / 2),
      deductible,
      annualRevenue: revenue,
    });
    setQuoteStage(3);
    navigate('/quote');
  };

  return (
    <div className="rr-surface-card p-6 sm:p-8 flex flex-col justify-between h-full space-y-6">
      
      {/* Cell Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2">
            <span className="eyebrow mb-0">
              <Sliders className="w-3.5 h-3.5" />
              <span>Engine 01</span>
            </span>
            <span className="rr-pill rr-pill--orange">ACTUARIAL CONSOLE</span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight mt-1">
            Commercial Underwriting & Rating Engine
          </h3>
        </div>

        {/* Line of Business Toggle */}
        <div className="inline-flex p-1 rounded-lg bg-black/40 border border-white/[0.08] text-xs font-mono">
          <button
            onClick={() => setSelectedLob('Commercial General Liability')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
              selectedLob === 'Commercial General Liability'
                ? 'bg-[#fb6504] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            General Liability
          </button>
          <button
            onClick={() => setSelectedLob('Commercial Property')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
              selectedLob === 'Commercial Property'
                ? 'bg-[#fb6504] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Property & BI
          </button>
          <button
            onClick={() => setSelectedLob('Technology E&O / Cyber')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
              selectedLob === 'Technology E&O / Cyber'
                ? 'bg-[#fb6504] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Tech E&O / Cyber
          </button>
        </div>
      </div>

      {/* Interactive Sliders & Autocomplete Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Col: NAICS Search & Revenue */}
        <div className="space-y-4">
          
          {/* NAICS Autocomplete */}
          <div className="relative">
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
              Industry Classification (NAICS Code Search)
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={naicsQuery}
                onFocus={() => setDropdownOpen(true)}
                onChange={(e) => {
                  setNaicsQuery(e.target.value);
                  setDropdownOpen(true);
                }}
                placeholder="Search NAICS e.g. 493120, 541512, 334410..."
                className="w-full bg-[#06080c] border border-white/[0.1] rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 font-mono focus:border-[#fb6504] focus:outline-none"
              />
            </div>

            {/* Dropdown search results */}
            {dropdownOpen && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 max-h-52 overflow-y-auto rounded-xl bg-[#0a0d16] border border-white/[0.1] shadow-2xl z-30 p-1 divide-y divide-white/[0.04]">
                {searchResults.map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => {
                      setSelectedNaics(item);
                      setNaicsQuery(`${item.code} - ${item.title}`);
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left p-2 hover:bg-white/[0.05] rounded-lg transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-[#fb6504]">
                        {item.code} - {item.title}
                      </div>
                      <div className="text-[10px] text-slate-400">{item.description}</div>
                    </div>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
                      item.hazardClass === 'Low' ? 'bg-emerald-500/20 text-emerald-400' :
                      item.hazardClass === 'Moderate' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-rose-500/20 text-rose-400'
                    }`}>
                      {item.hazardClass} Hazard
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected Industry Card */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] flex items-center justify-between text-xs">
            <div>
              <div className="text-slate-400 font-mono text-[10px] uppercase">Selected Commercial Class</div>
              <div className="text-white font-bold truncate max-w-xs">{selectedNaics?.title}</div>
            </div>
            <div className="text-right font-mono">
              <span className="text-[10px] text-slate-400 uppercase">Actuarial Mult</span>
              <div className="text-[#fb6504] font-bold">{selectedNaics?.baseRateMultiplier}x</div>
            </div>
          </div>

          {/* Annual Commercial Revenue Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400 uppercase">Annual Revenue In-Scope</span>
              <span className="text-white font-bold">${(revenue / 1000000).toFixed(1)}M USD</span>
            </div>
            <input
              type="range"
              min={1000000}
              max={100000000}
              step={1000000}
              value={revenue}
              onChange={(e) => setRevenue(Number(e.target.value))}
              className="w-full accent-[#fb6504] cursor-pointer h-1.5 bg-white/[0.1] rounded-lg"
            />
          </div>

        </div>

        {/* Right Col: Limits, Deductibles, and Instant Quote Preview */}
        <div className="space-y-4">
          
          {/* Aggregate Limits Selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400">
              Aggregate Liability Limit
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[1000000, 2000000, 5000000].map((lim) => (
                <button
                  key={lim}
                  type="button"
                  onClick={() => setLimit(lim)}
                  className={`py-2 px-2.5 rounded-xl border text-xs font-mono font-bold transition-all ${
                    limit === lim
                      ? 'border-[#fb6504] bg-[#fb6504]/15 text-[#fb6504] shadow-sm'
                      : 'border-white/[0.08] bg-black/30 text-slate-300 hover:text-white hover:border-white/[0.16]'
                  }`}
                >
                  ${lim / 1000000}M / ${Math.round(lim / 2000000) || 1}M
                </button>
              ))}
            </div>
          </div>

          {/* Deductible / SIR */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400">
              Self-Insured Retention / Deductible
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[2500, 5000, 10000, 25000].map((ded) => (
                <button
                  key={ded}
                  type="button"
                  onClick={() => setDeductible(ded)}
                  className={`py-2 px-2 rounded-xl border text-xs font-mono font-bold transition-all ${
                    deductible === ded
                      ? 'border-[#fb6504] bg-[#fb6504]/15 text-[#fb6504]'
                      : 'border-white/[0.08] bg-black/30 text-slate-300 hover:text-white'
                  }`}
                >
                  ${ded >= 1000 ? `${ded / 1000}k` : ded}
                </button>
              ))}
            </div>
          </div>

          {/* Indicative Rate Card */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-white/[0.04] to-[#fb6504]/10 border border-[#fb6504]/30 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                Indicative Syndicate Premium
              </div>
              <div className="text-2xl font-black font-mono text-white mt-0.5">
                ${preliminaryEstimate.annual.toLocaleString('en-US')}{' '}
                <span className="text-xs font-normal text-slate-400">/ yr</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                ~${preliminaryEstimate.monthly.toLocaleString('en-US')} / mo (Chubb & Travelers benchmark)
              </div>
            </div>

            <button
              onClick={handleLaunchBind}
              className="rr-btn rr-btn--primary text-xs py-2.5 px-4 shadow-lg shadow-orange-950/40 hover:scale-[1.03]"
            >
              <span>Bind Line</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
