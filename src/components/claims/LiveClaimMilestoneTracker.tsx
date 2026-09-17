import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  CheckCircle2,
  FileText,
  UserCheck,
  CreditCard,
  Send,
  MessageSquare,
  AlertCircle,
  Phone,
  Calendar,
  MapPin,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useInsurtechStore } from '../../store/useInsurtechStore';
import { Claim, ClaimTimelineEvent } from '../../types/insurance';

interface LiveClaimMilestoneTrackerProps {
  claim: Claim;
  className?: string;
}

const MILESTONES: Array<{
  id: Claim['status'];
  label: string;
  sublabel: string;
  icon: React.ElementType;
}> = [
  {
    id: 'submitted',
    label: 'Prijava zaprimljena',
    sublabel: 'FNOL elektronički evidentiran',
    icon: FileText,
  },
  {
    id: 'under_review',
    label: 'U obradi likvidatora',
    sublabel: 'Verifikacija pokrića i franšize',
    icon: Clock,
  },
  {
    id: 'assessor_assigned',
    label: 'Dodijeljen procjenitelj',
    sublabel: 'Procjena štete i servisni nalog',
    icon: UserCheck,
  },
  {
    id: 'approved',
    label: 'Odobrena isplata',
    sublabel: 'Obračunat iznos odštete',
    icon: CheckCircle2,
  },
  {
    id: 'paid',
    label: 'Isplata izvršena',
    sublabel: 'Sredstva na IBAN računu',
    icon: CreditCard,
  },
];

export const LiveClaimMilestoneTracker: React.FC<LiveClaimMilestoneTrackerProps> = ({
  claim,
  className = '',
}) => {
  const { appendClaimMessage } = useInsurtechStore();
  const [clientMessage, setClientMessage] = useState('');
  const [isTimelineExpanded, setIsTimelineExpanded] = useState(true);

  // Determine active milestone index
  const statusOrder: Claim['status'][] = [
    'submitted',
    'under_review',
    'assessor_assigned',
    'approved',
    'paid',
  ];
  const currentStepIdx = statusOrder.indexOf(claim.status) >= 0 ? statusOrder.indexOf(claim.status) : 2;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientMessage.trim()) return;
    appendClaimMessage(claim.id, clientMessage.trim());
    setClientMessage('');
  };

  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden ${className}`}
    >
      {/* Top Banner with File Number & Status */}
      <div className="p-6 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Aktivni odštetni spis
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Polica: {claim.policyId}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black font-mono text-white">
            {claim.claimNumber || claim.id}
          </h3>
          <p className="text-xs text-slate-400 flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            <span>{claim.location}</span>
          </p>
        </div>

        <div className="sm:text-right space-y-1">
          <span className="text-xs text-slate-400 block">Zatraženi / Odobreni iznos:</span>
          <div className="text-2xl font-black font-mono text-emerald-400">
            {claim.claimAmountApproved
              ? `${claim.claimAmountApproved.toFixed(2)} €`
              : `${claim.claimAmountRequested?.toFixed(2) || '0.00'} €`}
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            Isplata na: {claim.iban.slice(0, 8)}•••••••
          </div>
        </div>
      </div>

      {/* MILESTONE PIPELINE TRACKER */}
      <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-6">
          Status likvidacije štete u stvarnom vremenu
        </h4>

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
          {/* Connector Line for Desktop */}
          <div className="hidden md:block absolute top-6 left-6 right-6 h-1 bg-slate-200 dark:bg-slate-800 -z-0" />
          <div
            className="hidden md:block absolute top-6 left-6 h-1 bg-emerald-500 transition-all duration-700 -z-0"
            style={{ width: `${(currentStepIdx / (MILESTONES.length - 1)) * 90}%` }}
          />

          {MILESTONES.map((milestone, idx) => {
            const Icon = milestone.icon;
            const isCompleted = idx <= currentStepIdx;
            const isCurrent = idx === currentStepIdx;

            return (
              <div
                key={milestone.id}
                className="flex md:flex-col items-center gap-3.5 md:gap-2 z-10 md:text-center w-full md:w-36"
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                    isCompleted
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 ring-4 ring-white dark:ring-slate-900'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'
                  } ${isCurrent ? 'scale-110 ring-4 ring-emerald-400/40 animate-pulse' : ''}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div
                    className={`font-bold text-xs sm:text-sm ${
                      isCompleted
                        ? 'text-slate-900 dark:text-white'
                        : 'text-slate-400'
                    }`}
                  >
                    {milestone.label}
                  </div>
                  <div className="text-[11px] text-slate-500 hidden md:block mt-0.5">
                    {milestone.sublabel}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Assessor Details Badge (if assigned) */}
      {claim.assessorName && (
        <div className="p-4 mx-6 my-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-slate-500 block">Dodijeljeni procjenitelj štete:</span>
              <strong className="text-slate-900 dark:text-white font-bold">{claim.assessorName}</strong>
            </div>
          </div>
          {claim.assessorPhone && (
            <a
              href={`tel:${claim.assessorPhone}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold self-start sm:self-auto"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{claim.assessorPhone}</span>
            </a>
          )}
        </div>
      )}

      {/* DYNAMIC TIMELINE & MESSAGING */}
      <div className="p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>Kronologija postupanja & Poruke likvidatora ({claim.timeline.length})</span>
          </h4>
          <button
            type="button"
            onClick={() => setIsTimelineExpanded(!isTimelineExpanded)}
            className="text-xs text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1"
          >
            {isTimelineExpanded ? 'Sakrij' : 'Prikaži'}
            {isTimelineExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        <AnimatePresence>
          {isTimelineExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              {claim.timeline.map((event, i) => (
                <div key={i} className="flex items-start gap-3.5 text-xs">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5 text-blue-600">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {event.title}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(event.timestamp).toLocaleString('hr-HR')}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400">{event.description}</p>
                    {event.author && (
                      <div className="text-[10px] text-slate-400 pt-1">
                        Zabilježio: <strong className="text-slate-700 dark:text-slate-300">{event.author}</strong>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Send message into claim file */}
        <form onSubmit={handleSendMessage} className="pt-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
            Pošaljite poruku ili dopunu u spis likvidatoru:
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={clientMessage}
              onChange={(e) => setClientMessage(e.target.value)}
              placeholder="npr. Vozilo je predano u ovlašteni servis, zamjensko vozilo preuzeto..."
              className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!clientMessage.trim()}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs shadow-sm transition-all shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Pošalji</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
