import React from 'react';
import {
  Inbox,
  PhoneCall,
  Send,
  CheckCircle,
  Archive,
  ArrowRight,
  ArrowLeft,
  User,
  Calendar,
} from 'lucide-react';
import { QuoteRequest } from '../../types/database';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { Badge } from '../common/Badge';

interface QuotePipelineBoardProps {
  quotes: QuoteRequest[];
  onStatusChange: (id: string, status: QuoteRequest['status']) => Promise<void>;
}

interface ColumnDef {
  id: QuoteRequest['status'];
  title: string;
  icon: React.ElementType;
  headerColor: string;
}

const COLUMNS: ColumnDef[] = [
  { id: 'new', title: 'Novi upiti', icon: Inbox, headerColor: 'border-cyan-500/80 text-cyan-400 bg-cyan-500/10' },
  { id: 'contacted', title: 'U kontaktu', icon: PhoneCall, headerColor: 'border-amber-500/80 text-amber-400 bg-amber-500/10' },
  { id: 'quoted', title: 'Ponuda poslana', icon: Send, headerColor: 'border-[#fb6504] text-[#ff7b1a] bg-[#fb6504]/10' },
  { id: 'bound', title: 'Polica ugovorena', icon: CheckCircle, headerColor: 'border-emerald-500/80 text-emerald-400 bg-emerald-500/10' },
  { id: 'lost', title: 'Arhivirano', icon: Archive, headerColor: 'border-slate-600 text-slate-400 bg-white/[0.02]' },
];

export const QuotePipelineBoard: React.FC<QuotePipelineBoardProps> = ({
  quotes,
  onStatusChange,
}) => {
  const getNextStatus = (current: QuoteRequest['status']): QuoteRequest['status'] | null => {
    switch (current) {
      case 'new':
        return 'contacted';
      case 'contacted':
        return 'quoted';
      case 'quoted':
        return 'bound';
      default:
        return null;
    }
  };

  const getPrevStatus = (current: QuoteRequest['status']): QuoteRequest['status'] | null => {
    switch (current) {
      case 'bound':
        return 'quoted';
      case 'quoted':
        return 'contacted';
      case 'contacted':
        return 'new';
      default:
        return null;
    }
  };

  return (
    <div className="overflow-x-auto pb-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 min-w-[1000px]">
        {COLUMNS.map((col) => {
          const colQuotes = quotes.filter((q) => q.status === col.id);
          const totalVal = colQuotes.reduce(
            (sum, q) => sum + (q.calculatedEstimate.annualPremium || 0),
            0
          );
          const Icon = col.icon;

          return (
            <div
              key={col.id}
              className="bg-[#0a0d16]/90 rounded-3xl p-4 border border-white/[0.08] backdrop-blur-xl flex flex-col h-[700px] shadow-2xl"
            >
              {/* Column Header */}
              <div className={`p-3 rounded-2xl border-l-4 mb-3 ${col.headerColor}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <h4 className="font-mono text-xs font-bold uppercase tracking-wider">{col.title}</h4>
                  </div>
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-white/[0.1] text-white border border-white/[0.1]">
                    {colQuotes.length}
                  </span>
                </div>
                <div className="mt-1.5 text-[11px] font-mono font-semibold text-slate-400">
                  Ukupno: <span className="text-white font-bold">{formatCurrency(totalVal)}</span>
                </div>
              </div>

              {/* Cards Container */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {colQuotes.length === 0 ? (
                  <div className="text-center py-10 text-slate-500 font-mono text-xs">
                    Nema upita u ovoj fazi
                  </div>
                ) : (
                  colQuotes.map((q) => {
                    const next = getNextStatus(q.status);
                    const prev = getPrevStatus(q.status);

                    return (
                      <div
                        key={q.id}
                        className="bg-white/[0.03] hover:bg-white/[0.06] p-4 rounded-2xl border border-white/[0.08] hover:border-white/[0.16] transition-all flex flex-col justify-between gap-3 shadow-lg group"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h5 className="font-bold text-white text-sm leading-tight group-hover:text-[#ff7b1a] transition-colors">
                              {q.customer.fullName}
                            </h5>
                            <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white/[0.06] border border-white/[0.1] text-slate-300">
                              {q.type}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1 font-mono">{q.customer.phone}</p>
                          <p className="text-xs text-slate-400 truncate">{q.customer.email}</p>
                        </div>

                        <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">
                              Procjena
                            </span>
                            <p className="text-sm font-mono font-bold text-white">
                              {formatCurrency(q.calculatedEstimate.annualPremium)}
                            </p>
                          </div>
                          <span className="text-[10px] font-mono text-slate-500">
                            {formatDateTime(q.createdAt).split(' u ')[0]}
                          </span>
                        </div>

                        {/* Pipeline Stage Movement Controls */}
                        <div className="flex items-center justify-between pt-1 border-t border-white/[0.06]">
                          {prev ? (
                            <button
                              onClick={() => onStatusChange(q.id, prev)}
                              title="Pomakni natrag"
                              className="p-1.5 rounded-lg hover:bg-white/[0.08] text-slate-400 hover:text-white border border-transparent hover:border-white/[0.1] transition-colors"
                            >
                              <ArrowLeft className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <div />
                          )}

                          {next && (
                            <button
                              onClick={() => onStatusChange(q.id, next)}
                              title="Pomakni naprijed"
                              className="flex items-center gap-1 text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#fb6504] to-[#ff7b1a] text-white hover:brightness-110 transition-all shadow-[0_0_12px_rgba(251,101,4,0.3)] ml-auto"
                            >
                              <span>Dalje</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
