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
  { id: 'new', title: 'Novi upiti', icon: Inbox, headerColor: 'border-cyan-500/80 text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/40' },
  { id: 'contacted', title: 'U kontaktu', icon: PhoneCall, headerColor: 'border-amber-500/80 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40' },
  { id: 'quoted', title: 'Ponuda poslana', icon: Send, headerColor: 'border-teal-500/80 text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40' },
  { id: 'bound', title: 'Polica ugovorena', icon: CheckCircle, headerColor: 'border-emerald-500/80 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40' },
  { id: 'lost', title: 'Arhivirano', icon: Archive, headerColor: 'border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/40' },
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
              className="bg-slate-50/80 dark:bg-slate-900/90 rounded-3xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-bento flex flex-col h-[700px]"
            >
              {/* Column Header */}
              <div className={`p-3 rounded-2xl border-l-4 mb-3 ${col.headerColor}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <h4 className="font-mono text-xs font-bold uppercase tracking-wider">{col.title}</h4>
                  </div>
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-white/60 dark:bg-white/10 text-slate-800 dark:text-white border border-slate-200 dark:border-white/10">
                    {colQuotes.length}
                  </span>
                </div>
                <div className="mt-1.5 text-[11px] font-mono font-semibold text-slate-500 dark:text-slate-400">
                  Ukupno: <span className="text-slate-900 dark:text-white font-bold">{formatCurrency(totalVal)}</span>
                </div>
              </div>

              {/* Cards Container */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {colQuotes.length === 0 ? (
                  <div className="text-center py-10 text-slate-400 font-mono text-xs">
                    Nema upita u ovoj fazi
                  </div>
                ) : (
                  colQuotes.map((q) => {
                    const next = getNextStatus(q.status);
                    const prev = getPrevStatus(q.status);

                    return (
                      <div
                        key={q.id}
                        className="bg-white dark:bg-slate-800/90 hover:bg-slate-50 dark:hover:bg-slate-800 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700 hover:border-teal-500/50 dark:hover:border-teal-500/50 transition-all flex flex-col justify-between gap-3 shadow-sm group text-slate-900 dark:text-white"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h5 className="font-bold text-slate-900 dark:text-white text-sm leading-tight group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                              {q.customer.fullName}
                            </h5>
                            <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300">
                              {q.type}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">{q.customer.phone}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{q.customer.email}</p>
                        </div>

                        <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">
                              Procjena
                            </span>
                            <p className="text-sm font-mono font-bold text-teal-700 dark:text-teal-400">
                              {formatCurrency(q.calculatedEstimate.annualPremium)}
                            </p>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                            {formatDateTime(q.createdAt).split(' u ')[0]}
                          </span>
                        </div>

                        {/* Pipeline Stage Movement Controls */}
                        <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-700/60">
                          {prev ? (
                            <button
                              onClick={() => onStatusChange(q.id, prev)}
                              title="Pomakni natrag"
                              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.08] text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
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
                              className="flex items-center gap-1 text-xs font-mono font-semibold px-2.5 py-1 rounded-xl bg-teal-600 hover:bg-teal-500 text-white transition-all shadow-md shadow-teal-600/20 ml-auto"
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
