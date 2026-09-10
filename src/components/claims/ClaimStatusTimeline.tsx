import React from 'react';
import { Claim } from '../../types/database';
import { CheckCircle2, Clock, AlertCircle, FileCheck, DollarSign } from 'lucide-react';
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
      desc: 'Prijava zabilježena pod referentnim brojem',
    },
    {
      key: 'assessing',
      label: 'U procjeni',
      desc: 'Izvid štete i prikupljanje dokumentacije',
    },
    {
      key: 'review',
      label: 'Rješavanje',
      desc: 'Likvidacija i utvrđivanje visine odštete',
    },
    {
      key: 'closed',
      label: 'Zatvoreno',
      desc: status === 'rejected' ? 'Zahtjev odbijen' : 'Odšteta isplaćena',
    },
  ];

  // Map database status to stage index
  let activeIndex = 0;
  if (status === 'submitted') activeIndex = 0;
  else if (status === 'under_review' || status === 'assessing') activeIndex = 1;
  else if (status === 'approved') activeIndex = 2;
  else if (status === 'paid' || status === 'rejected') activeIndex = 3;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card space-y-6">
      {/* Header Info */}
      {claim && (
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
              Odštetni zahtjev
            </span>
            <h4 className="text-lg font-black text-slate-900 mt-1 font-mono">
              {claim.claimNumber}
            </h4>
          </div>
          <div className="text-right text-xs text-slate-500">
            <div>Prijavljeno: {formatDate(claim.createdAt)}</div>
            <div className="text-[11px] text-slate-400">
              Zadnja izmjena: {formatDate(claim.updatedAt)}
            </div>
          </div>
        </div>
      )}

      {/* Timeline Steps Bar */}
      <div className="relative pt-2">
        <div className="hidden sm:block absolute top-1/2 left-6 right-6 -translate-y-1/2 h-1 bg-slate-200 -z-0" />
        <div
          className="hidden sm:block absolute top-1/2 left-6 -translate-y-1/2 h-1 bg-gradient-to-r from-brand-600 to-teal-500 -z-0 transition-all duration-500"
          style={{ width: `${(activeIndex / (stages.length - 1)) * 90}%` }}
        />

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative z-10">
          {stages.map((st, idx) => {
            const isDone = idx < activeIndex;
            const isCurrent = idx === activeIndex;

            return (
              <div
                key={st.key}
                className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2 p-2 rounded-2xl bg-white sm:bg-transparent"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all shadow-md ${
                    isDone
                      ? 'bg-teal-600 text-white'
                      : isCurrent
                      ? status === 'rejected'
                        ? 'bg-rose-600 text-white ring-4 ring-rose-100'
                        : 'bg-brand-600 text-white ring-4 ring-brand-100 animate-pulse'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}
                >
                  {isDone ? '✓' : idx + 1}
                </div>

                <div className="space-y-0.5">
                  <div
                    className={`text-xs font-bold ${
                      isCurrent
                        ? 'text-brand-900 font-black'
                        : isDone
                        ? 'text-slate-800'
                        : 'text-slate-400'
                    }`}
                  >
                    {st.label}
                  </div>
                  <div className="text-[10px] text-slate-500 leading-tight hidden sm:block">
                    {st.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Status Details & Investigator Note if full claim object present */}
      {claim && (
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-700">Okolnosti: {claim.incidentLocation}</span>
            {claim.estimatedDamage && (
              <span className="font-mono font-bold text-slate-900">
                Procjena: {claim.estimatedDamage.toLocaleString('hr-HR')} €
              </span>
            )}
          </div>
          <p className="text-slate-600 leading-relaxed">{claim.description}</p>

          {claim.brokerNotes && (
            <div className="pt-2 border-t border-slate-200/80 mt-2 text-teal-900 bg-teal-50/50 p-2.5 rounded-xl">
              <strong>Službena bilješka likvidatora šteta:</strong> {claim.brokerNotes}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
