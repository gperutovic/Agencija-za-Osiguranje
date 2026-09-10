import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Layers, ArrowRight, Search } from 'lucide-react';
import { searchAppetiteMatrix } from '../../../services/appetiteMatrixData';

export const AppetiteMatrixCell: React.FC = () => {
  const [query, setQuery] = useState('');
  const items = useMemo(() => searchAppetiteMatrix(query).slice(0, 3), [query]);

  return (
    <div className="rr-surface-card p-6 flex flex-col justify-between relative overflow-hidden group h-full">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#fb6504]/10 text-[#fb6504] flex items-center justify-center border border-[#fb6504]/20">
              <Layers className="w-4 h-4" />
            </div>
            <span className="rr-pill rr-pill--orange">
              <span className="rr-pill__dot" />
              Syndicate Index
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-400 font-bold">$75M CAPACITY</span>
        </div>

        <h3 className="text-base font-bold text-white tracking-tight">
          Underwriting Appetite Matrix
        </h3>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
          Search instant binding eligibility across Chubb, Travelers, AIG, and Lloyd's of London syndicates.
        </p>

        {/* Quick Filter */}
        <div className="mt-3.5 relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search sector or NAICS code..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#06080c] border border-white/[0.1] text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-[#fb6504]"
          />
        </div>

        {/* Micro List */}
        <div className="mt-3 space-y-1.5">
          {items.map((item) => (
            <div
              key={item.sector}
              className="p-2 rounded-xl bg-black/40 border border-white/[0.06] flex items-center justify-between text-xs"
            >
              <div>
                <div className="font-semibold text-slate-200 text-xs truncate max-w-[150px]">
                  {item.sector}
                </div>
                <div className="text-[10px] font-mono text-slate-400">Line Cap: {item.maxCapacity}</div>
              </div>

              <div className="flex items-center gap-1 font-mono text-[9px]">
                <span className={`px-1.5 py-0.5 rounded font-bold ${
                  item.chubbAppetite === 'Aggressive'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {item.chubbAppetite}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 mt-2 border-t border-white/[0.06] flex items-center justify-between">
        <span className="text-[11px] text-slate-400 font-mono">1,100+ NAICS Codes</span>
        <Link
          to="/appetite"
          className="text-xs font-semibold text-[#fb6504] hover:text-[#ff7b1a] flex items-center gap-1 group-hover:translate-x-0.5 transition-all"
        >
          <span>View Full Appetite</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
