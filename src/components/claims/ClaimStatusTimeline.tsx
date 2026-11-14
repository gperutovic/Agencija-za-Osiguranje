import React from 'react';
import { Claim } from '../../types/database';
import { Check } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export interface ClaimStatusTimelineProps {
  claim?: Claim;
  currentStatus?: Claim['status'];
}

export const ClaimStatusTimeline: React.FC<ClaimStatusTimelineProps> = ({
  claim,
  currentStatus,
}) => {
  const status = claim?.status || currentStatus || 'submitted';

  const stages = [
    {
      key: 'submitted',
      label: 'Zaprimljeno',
      desc: 'Prijava evidentirana pod brojem spisa',
    },
    {
      key: 'assessing',
      label: 'U procjeni',
      desc: 'Izvid štete i prikupljanje dokumentacije',
    },
    {
      key: 'review',
      label: 'Rješavanje',
      desc: 'Obrada i utvrđivanje odštetnog zahtjeva',
    },
    {
      key: 'closed',
      label: 'Zatvoreno',
      desc: status === 'rejected' ? 'Zahtjev odbijen' : 'Odšteta isplaćena / riješeno',
    },
  ];

  let activeIndex = 0;
  if (status === 'submitted') activeIndex = 0;
  else if (status === 'under_review' || status === 'in_review' || status === 'assessing') activeIndex = 1;
  else if (status === 'approved') activeIndex = 2;
  else if (status === 'paid' || status === 'resolved' || status === 'rejected') activeIndex = 3;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 text-slate-900">
      {/* Header Info */}
      {claim && (
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-slate-100 text-xs font-semibold text-[#0F2942] uppercase tracking-wider">
              Odštetni zahtjev
            </span>
            <h4 className="text-lg font-bold text-slate-900 mt-1.5 tabular-nums">
              {claim.claimNumber || claim.id}
            </h4>
          </div>
          <div className="text-left sm:text-right text-xs text-slate-500 tabular-nums">
            <div>Prijavljeno: {formatDate(claim.createdAt)}</div>
            <div className="text-slate-400 mt-0.5">
              Zadnja izmjena: {formatDate(claim.updatedAt)}
            </div>
          </div>
        </div>
      )}

      {/* Timeline Steps Bar */}
      <div className="relative pt-2">
        <div className="hidden sm:block absolute top-7 left-10 right-10 h-0.5 bg-slate-200" />
        <div
          className="hidden sm:block absolute top-7 left-10 h-0.5 bg-[#0F2942] transition-all duration-300"
          style={{ width: `${(activeIndex / (stages.length - 1)) * 82}%` }}
        />

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative z-10">
          {stages.map((st, idx) => {
            const isDone = idx < activeIndex;
            const isCurrent = idx === activeIndex;

            return (
              <div
                key={st.key}
                className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2 p-2 rounded-lg bg-slate-50 sm:bg-transparent"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors border tabular-nums ${
                    isDone
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : isCurrent
                      ? status === 'rejected'
                        ? 'bg-red-700 text-white border-red-700 ring-4 ring-red-100'
                        : 'bg-[#0F2942] text-white border-[#0F2942] ring-4 ring-slate-200'
                      : 'bg-white text-slate-400 border-slate-300'
                  }`}
                >
                  {isDone ? <Check className="w-4 h-4" /> : idx + 1}
                </div>

                <div className="space-y-0.5">
                  <div
                    className={`text-xs font-bold ${
                      isCurrent
                        ? 'text-[#0F2942]'
                        : isDone
                        ? 'text-slate-900'
                        : 'text-slate-400'
                    }`}
                  >
                    {st.label}
                  </div>
                  <div className="text-[11px] text-slate-500 leading-tight hidden sm:block">
                    {st.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Status Details & Assessor Note */}
      {claim && (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-semibold text-slate-800">
              Mjesto događaja: {claim.incidentLocation || 'Nije navedeno'}
            </span>
            {claim.estimatedDamage !== undefined && (
              <span className="font-bold text-[#0F2942] tabular-nums">
                Okvirna procjena: {claim.estimatedDamage.toLocaleString('hr-HR')} €
              </span>
            )}
          </div>
          <p className="text-slate-600 leading-relaxed">{claim.description}</p>

          {claim.brokerNotes && (
            <div className="pt-2.5 border-t border-slate-200 mt-2 text-slate-700 bg-white p-3 rounded-lg border border-slate-200">
              <strong className="text-[#0F2942]">Bilješka o statusu:</strong> {claim.brokerNotes}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
