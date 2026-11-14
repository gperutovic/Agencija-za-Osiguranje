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
    <div className="bg-[#0a0d16]/90 rounded-3xl border border-white/[0.08] backdrop-blur-xl p-6 sm:p-8 shadow-2xl space-y-6 text-white">
      {/* Header Info */}
      {claim && (
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
          <div>
            <span className="rr-pill">
              <span className="rr-pill__dot bg-[#fb6504]" />
              Odštetni zahtjev
            </span>
            <h4 className="text-lg font-black text-white mt-1.5 font-mono">
              {claim.claimNumber}
            </h4>
          </div>
          <div className="text-right text-xs text-slate-400 font-mono">
            <div>Prijavljeno: {formatDate(claim.createdAt)}</div>
            <div className="text-[11px] text-slate-500">
              Zadnja izmjena: {formatDate(claim.updatedAt)}
            </div>
          </div>
        </div>
      )}

      {/* Timeline Steps Bar */}
      <div className="relative pt-2">
        <div className="hidden sm:block absolute top-1/2 left-6 right-6 -translate-y-1/2 h-1 bg-white/[0.08] -z-0" />
        <div
          className="hidden sm:block absolute top-1/2 left-6 -translate-y-1/2 h-1 bg-gradient-to-r from-[#fb6504] to-[#ff7b1a] -z-0 transition-all duration-500 shadow-[0_0_10px_#fb6504]"
          style={{ width: `${(activeIndex / (stages.length - 1)) * 90}%` }}
        />

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative z-10">
          {stages.map((st, idx) => {
            const isDone = idx < activeIndex;
            const isCurrent = idx === activeIndex;

            return (
              <div
                key={st.key}
                className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2 p-2 rounded-2xl bg-[#0a0d16] sm:bg-transparent"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all shadow-md font-mono ${
                    isDone
                      ? 'bg-[#2dd4bf] text-[#06080c] shadow-[0_0_12px_rgba(45,212,191,0.4)]'
                      : isCurrent
                      ? status === 'rejected'
                        ? 'bg-rose-600 text-white ring-4 ring-rose-500/20'
                        : 'bg-gradient-to-br from-[#fb6504] to-[#ff7b1a] text-white ring-4 ring-[#fb6504]/20 shadow-[0_0_15px_#fb6504] animate-pulse'
                      : 'bg-white/[0.04] text-slate-500 border border-white/[0.08]'
                  }`}
                >
                  {isDone ? '✓' : idx + 1}
                </div>

                <div className="space-y-0.5">
                  <div
                    className={`text-xs font-bold ${
                      isCurrent
                        ? 'text-[#ff7b1a] font-black'
                        : isDone
                        ? 'text-white'
                        : 'text-slate-500'
                    }`}
                  >
                    {st.label}
                  </div>
                  <div className="text-[10px] text-slate-400 leading-tight hidden sm:block">
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
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-300">Okolnosti: {claim.incidentLocation}</span>
            {claim.estimatedDamage && (
              <span className="font-mono font-bold text-[#ff7b1a]">
                Procjena: {claim.estimatedDamage.toLocaleString('hr-HR')} €
              </span>
            )}
          </div>
          <p className="text-slate-400 leading-relaxed">{claim.description}</p>

          {claim.brokerNotes && (
            <div className="pt-2 border-t border-white/[0.08] mt-2 text-[#2dd4bf] bg-white/[0.02] p-2.5 rounded-xl font-mono text-[11px]">
              <strong>Službena bilješka likvidatora:</strong> {claim.brokerNotes}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
