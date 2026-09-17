import React, { useState } from 'react';
import {
  Phone,
  MessageSquare,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Award,
} from 'lucide-react';
import { Advisor } from '../../types/insurance';
import { ConsultationSchedulerModal } from './ConsultationSchedulerModal';

interface AssignedAdvisorBadgeProps {
  advisor: Advisor;
  className?: string;
  compact?: boolean;
}

export const AssignedAdvisorBadge: React.FC<AssignedAdvisorBadgeProps> = ({
  advisor,
  className = '',
  compact = false,
}) => {
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);

  const whatsappUrl = `https://wa.me/${advisor.whatsappNumber}?text=${encodeURIComponent(
    'Pozdrav Gorane, trebam stručni savjet u vezi svoje police osiguranja.'
  )}`;

  if (compact) {
    return (
      <>
        <div
          className={`flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm ${className}`}
        >
          <div className="flex items-center gap-3">
            <img
              src={advisor.avatarUrl}
              alt={advisor.name}
              className="w-10 h-10 rounded-xl object-cover border border-emerald-500"
            />
            <div>
              <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1">
                <span>{advisor.name}</span>
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <div className="text-[10px] text-slate-500">{advisor.licenseNumber}</div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <a
              href={`tel:${advisor.phone}`}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
              title="Pozovi brokera"
            >
              <Phone className="w-3.5 h-3.5" />
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 hover:bg-emerald-100"
              title="Pošalji WhatsApp poruku"
            >
              <MessageSquare className="w-3.5 h-3.5" />
            </a>
            <button
              type="button"
              onClick={() => setIsSchedulerOpen(true)}
              className="px-2.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold"
            >
              Termin
            </button>
          </div>
        </div>

        <ConsultationSchedulerModal
          advisor={advisor}
          isOpen={isSchedulerOpen}
          onClose={() => setIsSchedulerOpen(false)}
        />
      </>
    );
  }

  return (
    <>
      <div
        className={`bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 ${className}`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="relative">
              <img
                src={advisor.avatarUrl}
                alt={advisor.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500 shadow-sm"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] ring-2 ring-white dark:ring-slate-900">
                ✓
              </span>
            </div>
            <div className="space-y-0.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300">
                <Award className="w-3 h-3 text-blue-600" />
                <span>Osobni ovlašteni broker</span>
              </div>
              <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {advisor.name}
              </h4>
              <p className="text-xs text-slate-500 font-mono">
                {advisor.title} &bull; {advisor.licenseNumber}
              </p>
            </div>
          </div>

          {/* Direct CTA Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={`tel:${advisor.phone}`}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all"
            >
              <Phone className="w-3.5 h-3.5 text-blue-600" />
              <span>{advisor.phone}</span>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Chat</span>
            </a>

            <button
              type="button"
              onClick={() => setIsSchedulerOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-sm transition-all"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Rezerviraj 15 min</span>
            </button>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
          <span>Dostupan radnim danom 08:00 – 18:00 &bull; Hitne štete 24/7</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
            0 € provizije za klijenta (čl. 401. Zakona o osiguranju)
          </span>
        </div>
      </div>

      <ConsultationSchedulerModal
        advisor={advisor}
        isOpen={isSchedulerOpen}
        onClose={() => setIsSchedulerOpen(false)}
      />
    </>
  );
};
