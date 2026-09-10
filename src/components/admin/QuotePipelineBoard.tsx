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
  { id: 'new', title: 'Novi upiti', icon: Inbox, headerColor: 'border-blue-500 text-blue-800 bg-blue-50/50' },
  { id: 'contacted', title: 'U kontaktu', icon: PhoneCall, headerColor: 'border-amber-500 text-amber-800 bg-amber-50/50' },
  { id: 'quoted', title: 'Ponuda poslana', icon: Send, headerColor: 'border-indigo-500 text-indigo-800 bg-indigo-50/50' },
  { id: 'bound', title: 'Polica ugovorena', icon: CheckCircle, headerColor: 'border-emerald-500 text-emerald-800 bg-emerald-50/50' },
  { id: 'lost', title: 'Arhivirano', icon: Archive, headerColor: 'border-slate-400 text-slate-700 bg-slate-50/50' },
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
              className="bg-slate-50/80 rounded-3xl p-4 border border-slate-200 flex flex-col h-[700px]"
            >
              {/* Column Header */}
              <div className={`p-3 rounded-2xl border-l-4 mb-3 ${col.headerColor}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <h4 className="font-bold text-xs uppercase tracking-wider">{col.title}</h4>
                  </div>
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-white shadow-xs">
                    {colQuotes.length}
                  </span>
                </div>
                <div className="mt-1 text-[11px] font-semibold text-slate-600">
                  Ukupno: {formatCurrency(totalVal)}
                </div>
              </div>

              {/* Cards Container */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {colQuotes.length === 0 ? (
                  <div className="text-center py-10 text-slate-400 text-xs">
                    Nema upita u ovoj fazi
                  </div>
                ) : (
                  colQuotes.map((q) => {
                    const next = getNextStatus(q.status);
                    const prev = getPrevStatus(q.status);

                    return (
                      <div
                        key={q.id}
                        className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow transition-shadow flex flex-col justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h5 className="font-bold text-slate-900 text-sm leading-tight">
                              {q.customer.fullName}
                            </h5>
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                              {q.type}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">{q.customer.phone}</p>
                          <p className="text-xs text-slate-500">{q.customer.email}</p>
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-semibold">
                              Procjena
                            </span>
                            <p className="text-sm font-bold text-brand-900">
                              {formatCurrency(q.calculatedEstimate.annualPremium)}
                            </p>
                          </div>
                          <span className="text-[10px] text-slate-400">
                            {formatDateTime(q.createdAt).split(' u ')[0]}
                          </span>
                        </div>

                        {/* Pipeline Stage Movement Controls */}
                        <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                          {prev ? (
                            <button
                              onClick={() => onStatusChange(q.id, prev)}
                              title="Pomakni natrag"
                              className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
                            >
                              <ArrowLeft className="w-4 h-4" />
                            </button>
                          ) : (
                            <div />
                          )}

                          {next && (
                            <button
                              onClick={() => onStatusChange(q.id, next)}
                              title="Pomakni naprijed"
                              className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-brand-50 text-brand-700 hover:bg-brand-100 transition-colors ml-auto"
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
