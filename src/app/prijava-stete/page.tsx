import React, { useState } from 'react';
import { PhoneCall, AlertTriangle, ShieldCheck, CheckCircle2, FileWarning } from 'lucide-react';
import { ClaimsIntakeForm } from '../../components/claims/ClaimsIntakeForm';
import { AGENCY_DETAILS } from '../../lib/content/insurance-data';

export default function PrijavaStetePage() {
  const [activeTab, setActiveTab] = useState<'submit' | 'status'>('submit');

  return (
    <div className="w-full py-12 sm:py-16 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-red-50 border border-red-200 text-[#B91C1C] text-xs font-semibold uppercase tracking-wider">
            <FileWarning className="w-3.5 h-3.5" />
            <span>Podrška pri štetnim događajima</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Prijava štete i praćenje statusa
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Zastupamo vaše interese tijekom cijelog postupka prijave i likvidacije štete kod partnerskih osiguravajućih društava.
          </p>
        </div>

        {/* Emergency Triage Banner */}
        <div className="bg-[#0F2942] text-white rounded-xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-lg bg-white/10 flex items-center justify-center shrink-0 text-amber-300">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-base sm:text-lg font-bold text-white">
                Hitna nezgoda ili potreba za vučnom službom?
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                U slučaju nepokretnog vozila ili potrebe za hitnom asistencijom na cesti u Hrvatskoj i inozemstvu nazovite naš dežurni kontakt ili asistenciju vaše police.
              </p>
            </div>
          </div>

          <a
            href="tel:+38515550666"
            className="px-5 py-3 rounded-lg bg-white text-[#0F2942] hover:bg-slate-100 font-bold text-sm flex items-center gap-2 transition-colors shrink-0 tabular-nums"
          >
            <PhoneCall className="w-4 h-4 text-[#B91C1C]" />
            <span>{AGENCY_DETAILS.secondaryPhone}</span>
          </a>
        </div>

        {/* Single Top-Level Tab Switcher */}
        <div className="flex justify-center">
          <div className="inline-flex p-1 bg-white rounded-xl border border-slate-200 shadow-sm">
            <button
              type="button"
              onClick={() => setActiveTab('submit')}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                activeTab === 'submit'
                  ? 'bg-[#0F2942] text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Nova prijava štete
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('status')}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                activeTab === 'status'
                  ? 'bg-[#0F2942] text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Provjera statusa spisa
            </button>
          </div>
        </div>

        {/* Form or Lookup */}
        <ClaimsIntakeForm mode={activeTab} onModeChange={setActiveTab} />

        {/* Process Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-4">
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-[#0F2942] flex items-center justify-center font-bold text-sm tabular-nums">
              1
            </div>
            <h3 className="text-sm font-bold text-slate-900">Dostava prijave i dokaza</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Prijavu možete podnijeti elektroničkim putem uz prilaganje fotografija i osnovnih podataka o štetnom događaju.
            </p>
          </div>
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-[#0F2942] flex items-center justify-center font-bold text-sm tabular-nums">
              2
            </div>
            <h3 className="text-sm font-bold text-slate-900">Koordinacija s procjeniteljem</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pomažemo u usklađivanju termina izvida štete i provjeri dokumentacije prema uvjetima ugovorenog društva.
            </p>
          </div>
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Isplata ili popravak u servisu</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Naknada štete isplaćuje se na IBAN korisnika ili izravno ovlaštenom servisu prema važećim uvjetima police.
            </p>
          </div>
        </div>

        {/* Partner Notice */}
        <div className="max-w-4xl mx-auto p-5 rounded-xl bg-white border border-slate-200 flex items-start gap-3 text-xs text-slate-600">
          <ShieldCheck className="w-5 h-5 text-[#0F2942] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Usluga podrške pri prijavi štete besplatna je za sve klijente čije su police ugovorene putem Agencije Život. Za vozila kupljena ili servisirana u Toyota Centru Zagreb koordiniramo popravak prema standardu proizvođača.
          </p>
        </div>
      </div>
    </div>
  );
}
