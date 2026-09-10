import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sliders, 
  Search, 
  ArrowRight, 
  Briefcase, 
  User, 
  Zap, 
  Check, 
  Sparkles 
} from 'lucide-react';
import { NAICS_DATABASE, searchNaicsCodes } from '../../../services/naicsData';
import { useValiantStore } from '../../../services/valiantStore';

export const UnderwritingConsoleCell: React.FC = () => {
  const navigate = useNavigate();
  const { updateQuoteFormData, setQuoteStage } = useValiantStore();

  const [lineType, setLineType] = useState<'commercial' | 'personal'>('commercial');
  const [naicsQuery, setNaicsQuery] = useState('541512');
  const [selectedNaics, setSelectedNaics] = useState(NAICS_DATABASE[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [limit, setLimit] = useState(2000000);
  const [deductible, setDeductible] = useState(5000);
  const [revenue, setRevenue] = useState(15000000);

  const searchResults = useMemo(() => searchNaicsCodes(naicsQuery), [naicsQuery]);

  // Live preliminary calculation
  const preliminaryEstimate = useMemo(() => {
    const hazardMult = selectedNaics ? selectedNaics.baseRateMultiplier : 1.1;
    const revFactor = Math.log10(Math.max(revenue, 500000)) * 0.42;
    let limitMult = 1.0;
    if (limit === 2000000) limitMult = 1.22;
    else if (limit === 5000000) limitMult = 1.78;
    else if (limit === 10000000) limitMult = 2.55;

    let dedFactor = 1.0;
    if (deductible === 1000) dedFactor = 1.12;
    else if (deductible === 5000) dedFactor = 0.93;
    else if (deductible === 10000) dedFactor = 0.82;
    else if (deductible === 25000) dedFactor = 0.70;

    const base = lineType === 'commercial' ? 7800 : 3200;
    const est = Math.round(base * hazardMult * revFactor * limitMult * dedFactor);
    return {
      annual: est,
      monthly: Math.round(est / 12),
    };
  }, [lineType, selectedNaics, revenue, limit, deductible]);

  const handleLaunchBind = () => {
    updateQuoteFormData({
      naicsCode: selectedNaics.code,
      industryTitle: selectedNaics.title,
      aggregateLimit: limit,
      occurrenceLimit: limit === 1000000 ? 1000000 : Math.round(limit / 2),
      deductible,
      annualRevenue: revenue,
    });
    setQuoteStage(1);
    navigate('/quote');
  };

  return (
    <div className="lg:col-span-8 vgr-bento-card p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#0284C7]/10 rounded-full blur-3xl pointer-events-none group-hover:bg-[#0284C7]/15 transition-all duration-500" />

      <div>
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0284C7]/20 border border-[#0284C7]/40 flex items-center justify-center text-[#38bdf8]">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <span className="vgr-pill bg-[#0284C7]/10 text-[#38bdf8] border-[#0284C7]/30">
                <span className="vgr-pill__dot bg-[#0284C7]" />
                Interactive Underwriting Console
              </span>
              <h3 className="text-lg font-bold text-white tracking-tight mt-1">
                Dynamic Risk Classifier & Rate Simulator
              </h3>
            </div>
          </div>

          {/* Line Switcher */}
          <div className="inline-flex p-1 rounded-xl bg-white/[0.04] border border-white/[0.08]">
            <button
              type="button"
              onClick={() => setLineType('commercial')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                lineType === 'commercial'
                  ? 'bg-[#0284C7] text-white shadow-[0_0_15px_-3px_rgba(2,132,199,0.5)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Commercial Lines</span>
            </button>
            <button
              type="button"
              onClick={() => setLineType('personal')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                lineType === 'personal'
                  ? 'bg-[#0284C7] text-white shadow-[0_0_15px_-3px_rgba(2,132,199,0.5)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Executive / Specialty</span>
            </button>
          </div>
        </div>

        {/* Console Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Left Column: NAICS Autocomplete */}
          <div className="space-y-4">
            <div className="relative">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                Industry NAICS Code / Risk Description
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={naicsQuery}
                  onFocus={() => setDropdownOpen(true)}
                  onChange={(e) => {
                    setNaicsQuery(e.target.value);
                    setDropdownOpen(true);
                  }}
                  placeholder="Search code or industry (e.g. 541512, SaaS, Logistics)..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#07090E] border border-white/[0.1] text-white placeholder-slate-500 focus:outline-none focus:border-[#0284C7] text-xs font-mono"
                />
              </div>

              {/* Dropdown Results */}
              {dropdownOpen && (
                <div className="absolute left-0 right-0 mt-1 max-h-56 overflow-y-auto rounded-xl bg-[#0E131F] border border-white/[0.15] shadow-2xl z-40 p-1 space-y-1">
                  {searchResults.map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => {
                        setSelectedNaics(item);
                        setNaicsQuery(`${item.code} - ${item.title}`);
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left p-2 rounded-lg hover:bg-white/[0.06] transition-colors flex items-center justify-between group/item"
                    >
                      <div>
                        <div className="text-xs font-semibold text-white group-hover/item:text-[#38bdf8]">
                          {item.code} • {item.title}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate max-w-xs">{item.description}</div>
                      </div>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                        item.hazardClass === 'Low'
                          ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
                          : item.hazardClass === 'Moderate'
                          ? 'text-amber-400 border-amber-500/30 bg-amber-500/10'
                          : 'text-red-400 border-red-500/30 bg-red-500/10'
                      }`}>
                        {item.hazardClass} Hazard
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Classification Card */}
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-slate-400">Class Hazard:</span>
                <span className="ml-2 font-bold text-[#38bdf8]">{selectedNaics?.hazardClass || 'Low'}</span>
              </div>
              <div>
                <span className="text-slate-400">Rating Base Multiplier:</span>
                <span className="ml-2 font-bold text-white">{selectedNaics?.baseRateMultiplier.toFixed(2) || '1.05'}x</span>
              </div>
            </div>

            {/* Revenue Slider */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-slate-300">ANNUAL REVENUE EXPOSURE</span>
                <span className="text-[#38bdf8] font-bold tabular-nums">
                  ${(revenue / 1000000).toFixed(1)}M USD
                </span>
              </div>
              <input
                type="range"
                min={1000000}
                max={50000000}
                step={1000000}
                value={revenue}
                onChange={(e) => setRevenue(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#0284C7]"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>$1M</span>
                <span>$25M</span>
                <span>$50M+</span>
              </div>
            </div>
          </div>

          {/* Right Column: Limit & Deductible Sliders */}
          <div className="space-y-4">
            {/* Aggregate Limit Selector */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                Aggregate Liability Limit
              </label>
              <div className="grid grid-cols-4 gap-2 font-mono">
                {[1000000, 2000000, 5000000, 10000000].map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLimit(l)}
                    className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all ${
                      limit === l
                        ? 'bg-[#0284C7] text-white border-[#38bdf8] shadow-[0_0_15px_-3px_rgba(2,132,199,0.5)]'
                        : 'bg-white/[0.03] text-slate-300 border-white/[0.08] hover:border-white/20'
                    }`}
                  >
                    ${l / 1000000}M
                  </button>
                ))}
              </div>
            </div>

            {/* Deductible Selector */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                Policy Retention / Deductible
              </label>
              <div className="grid grid-cols-4 gap-2 font-mono">
                {[1000, 5000, 10000, 25000].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDeductible(d)}
                    className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all ${
                      deductible === d
                        ? 'bg-[#0284C7] text-white border-[#38bdf8] shadow-[0_0_15px_-3px_rgba(2,132,199,0.5)]'
                        : 'bg-white/[0.03] text-slate-300 border-white/[0.08] hover:border-white/20'
                    }`}
                  >
                    ${d >= 1000 ? `${d / 1000}k` : d}
                  </button>
                ))}
              </div>
            </div>

            {/* Estimated Rate Output Tile */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#07090E] to-[#0E131F] border border-[#0284C7]/30 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#38bdf8]" />
                    <span>Algorithmic Rate Indication</span>
                  </div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
                      ${preliminaryEstimate.annual.toLocaleString('en-US')}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">/ yr</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    or ${preliminaryEstimate.monthly.toLocaleString('en-US')}/mo (12 payments)
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLaunchBind}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0284C7] to-[#0369a1] hover:from-[#0369a1] hover:to-[#0284C7] text-white font-semibold text-xs shadow-[0_0_20px_-3px_rgba(2,132,199,0.5)] border border-white/20 transition-all hover:scale-105 active:scale-95"
                >
                  <span>Instant Bind</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

