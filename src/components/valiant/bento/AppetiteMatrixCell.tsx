import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Layers, ArrowRight, Search } from 'lucide-react';
import { APPETITE_MATRIX, searchAppetiteMatrix } from '../../../services/appetiteMatrixData';

export const AppetiteMatrixCell: React.FC = () => {
  const [query, setQuery] = useState('');
  const items = useMemo(() => searchAppetiteMatrix(query).slice(0, 3), [query]);

  return (
    <div className="lg:col-span-4 vgr-bento-card p-6 flex flex-col justify-between relative overflow-hidden group">
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#6366F1]/10 text-[#6366F1] flex items-center justify-center border border-[#6366F1]/20">
              <Layers className="w-4 h-4" />
            </div>
            <span className="vgr-pill bg-[#6366F1]/10 text-indigo-300 border-[#6366F1]/20">
              Syndicate Telemetry
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">5 Carriers</span>
        </div>

        <h3 className="text-base font-bold text-white tracking-tight">
          Underwriting Appetite Matrix
        </h3>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
          Real-time carrier appetite index across technology, biopharma, fintech, and advanced logistics.
        </p>

        {/* Quick Search */}
        <div className="mt-3.5 relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter sector or NAICS..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#07090E] border border-white/[0.1] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#6366F1]"
          />
        </div>

        {/* Micro List */}
        <div className="mt-3 space-y-2">
          {items.map((item) => (
            <div
              key={item.sector}
              className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-xs"
            >
              <div>
                <div className="font-semibold text-slate-200 text-xs truncate max-w-[160px]">
                  {item.sector}
                </div>
                <div className="text-[10px] font-mono text-slate-500">Cap: {item.maxCapacity}</div>
              </div>

              <div className="flex items-center gap-1 font-mono text-[9px]">
                <span className={`px-1.5 py-0.5 rounded border ${
                  item.chubbAppetite === 'Aggressive'
                    ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
                    : 'text-amber-400 border-amber-500/30 bg-amber-500/10'
                }`}>
                  Chubb: {item.chubbAppetite}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-5 mt-2 border-t border-white/[0.06]">
        <Link
          to="/appetite"
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white text-xs font-semibold border border-white/[0.1] transition-all hover:border-[#6366F1]/50"
        >
          <span>Explore All 40+ Sectors</span>
          <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
        </Link>
      </div>
    </div>
  );
};

