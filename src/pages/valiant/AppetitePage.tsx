import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Search, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Filter, 
  TrendingUp, 
  Building2, 
  Layers, 
  Zap,
  HelpCircle
} from 'lucide-react';
import { APPETITE_MATRIX, searchAppetiteMatrix } from '../../services/appetiteMatrixData';
import { AppetiteSector } from '../../types/valiant';
import { ValiantNavbar } from '../../components/valiant/Navbar';
import { ValiantFooter } from '../../components/valiant/Footer';

export const AppetitePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAppetiteFilter, setSelectedAppetiteFilter] = useState<string>('all');

  const filteredMatrix = searchAppetiteMatrix(searchQuery).filter((item) => {
    if (selectedAppetiteFilter === 'aggressive') {
      return (
        item.chubbAppetite === 'Aggressive' ||
        item.aigAppetite === 'Aggressive' ||
        item.lloydsAppetite === 'Aggressive'
      );
    }
    if (selectedAppetiteFilter === 'instant') {
      return (
        item.chubbAppetite === 'Aggressive' &&
        item.lloydsAppetite === 'Aggressive'
      );
    }
    return true;
  });

  const getAppetiteBadge = (level: string) => {
    switch (level) {
      case 'Aggressive':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Aggressive</span>
          </span>
        );
      case 'Selective':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <span>Selective</span>
          </span>
        );
      case 'Restricted':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider bg-slate-800 text-slate-400 border border-white/[0.06]">
            <span>Referral Only</span>
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#06080c] text-slate-100 flex flex-col selection:bg-[#fb6504] selection:text-white font-sans">
      <ValiantNavbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10">

        {/* Hero Banner & Positioning */}
        <div className="relative rounded-3xl bg-[#0a0d16] border border-white/[0.08] p-8 sm:p-12 overflow-hidden shadow-2xl">
          <div className="absolute -right-20 -top-20 w-96 h-96 bg-[#fb6504]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-[#fb6504]/08 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.1] text-xs font-mono text-[#fb6504]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Institutional Underwriting Appetite Index</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Carrier Appetite & Programmatic Capacity
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Explore real-time underwriting appetites, Lloyd's of London syndication parameters, and maximum line capacities across key commercial sectors. Instant digital bind available for all <span className="text-emerald-400 font-semibold font-mono">Aggressive</span> appetite classifications.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/[0.08]">
            <div>
              <div className="text-[11px] font-mono text-slate-400 uppercase">Single-Risk Capacity</div>
              <div className="text-2xl font-black font-mono text-white mt-1">$75M+</div>
              <div className="text-[10px] text-emerald-400">Primary + Excess Layering</div>
            </div>
            <div>
              <div className="text-[11px] font-mono text-slate-400 uppercase">Auto-Bind Rate</div>
              <div className="text-2xl font-black font-mono text-white mt-1">84.2%</div>
              <div className="text-[10px] text-slate-400">Under 120s execution</div>
            </div>
            <div>
              <div className="text-[11px] font-mono text-slate-400 uppercase">Syndicate Rating</div>
              <div className="text-2xl font-black font-mono text-white mt-1">A.M. Best 'A++'</div>
              <div className="text-[10px] text-[#fb6504]">100% Admitted / Lloyd's</div>
            </div>
            <div>
              <div className="text-[11px] font-mono text-slate-400 uppercase">Global NAICS Indexed</div>
              <div className="text-2xl font-black font-mono text-white mt-1">1,100+</div>
              <div className="text-[10px] text-slate-400">Commercial Classifications</div>
            </div>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl rr-surface-card">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by industry sector, NAICS prefix, or target risk (e.g. Cold Storage, Logistics, Tech E&O, Fleet)..."
              className="w-full bg-[#06080c] border border-white/[0.1] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-[#fb6504] focus:outline-none font-sans"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedAppetiteFilter}
              onChange={(e) => setSelectedAppetiteFilter(e.target.value)}
              className="bg-[#06080c] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#fb6504] focus:outline-none font-mono"
            >
              <option value="all">All Risk Appetites</option>
              <option value="aggressive">Aggressive Appetite (Any Carrier)</option>
              <option value="instant">Instant Multi-Carrier Bind (Chubb + Lloyd's)</option>
            </select>
          </div>
        </div>

        {/* Matrix Table */}
        <div className="rounded-3xl rr-surface-card overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.03] text-slate-400 font-mono uppercase tracking-wider border-b border-white/[0.06]">
                <tr>
                  <th className="p-5">Industry Classification</th>
                  <th className="p-5">NAICS Prefix</th>
                  <th className="p-5">Chubb Syndicate</th>
                  <th className="p-5">Lloyd's Specialty</th>
                  <th className="p-5">AIG Commercial</th>
                  <th className="p-5">Max Line Capacity</th>
                  <th className="p-5 text-right">Digital Bind Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {filteredMatrix.map((item, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-5">
                      <div className="font-bold text-white text-sm">{item.sector}</div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {item.targetRisks.map((risk, rIdx) => (
                          <span
                            key={rIdx}
                            className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] text-[10px] text-slate-300 font-sans"
                          >
                            {risk}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-5 font-mono text-slate-300 font-bold">
                      <span className="px-2.5 py-1 rounded bg-white/[0.05] border border-white/[0.08]">
                        {item.naicsPrefix}XX
                      </span>
                    </td>
                    <td className="p-5">
                      {getAppetiteBadge(item.chubbAppetite)}
                    </td>
                    <td className="p-5">
                      {getAppetiteBadge(item.lloydsAppetite)}
                    </td>
                    <td className="p-5">
                      {getAppetiteBadge(item.aigAppetite)}
                    </td>
                    <td className="p-5 font-mono text-white font-bold text-sm">
                      {item.maxCapacity}
                    </td>
                    <td className="p-5 text-right">
                      <Link
                        to={`/quote?naics=${item.naicsPrefix}00`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#fb6504] hover:bg-[#ff7b1a] text-white font-bold text-xs shadow-md shadow-orange-900/30 hover:scale-[1.03] transition-all whitespace-nowrap cursor-pointer"
                      >
                        <span>Start Quote</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredMatrix.length === 0 && (
            <div className="p-12 text-center text-slate-400 space-y-3">
              <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
              <div className="text-sm font-bold text-white">No industry sectors matched your search query.</div>
              <p className="text-xs">
                Try searching for general terms such as "Logistics", "Manufacturing", "Medical", or clear the active filter.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedAppetiteFilter('all');
                }}
                className="px-4 py-2 rounded-xl bg-white/[0.05] text-white text-xs font-semibold hover:bg-white/[0.1] cursor-pointer"
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>

        {/* Institutional Trust & Lloyd's Disclosure */}
        <div className="p-6 rounded-3xl rr-surface-card flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#fb6504] shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-white font-bold text-sm">Need Custom Layering or E&S Syndication?</div>
              <div className="mt-0.5">
                Our specialty brokerage underwriting desk can structure excess layers exceeding $150M through Lloyd's syndicate slip agreements.
              </div>
            </div>
          </div>
          <Link
            to="/quote"
            className="px-5 py-2.5 rounded-xl bg-[#fb6504] hover:bg-[#ff7b1a] text-white font-semibold text-xs whitespace-nowrap transition-all shadow-md shadow-orange-950/20 cursor-pointer"
          >
            Engage Specialty Broker
          </Link>
        </div>

        </div>
      </main>

      <ValiantFooter />
    </div>
  );
};
