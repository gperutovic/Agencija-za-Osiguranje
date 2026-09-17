import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  CheckCircle2,
  TrendingDown,
  Sparkles,
  Info,
  PhoneCall,
  ArrowRight,
  Pill,
  Smartphone,
  Hospital,
  AlertCircle,
} from 'lucide-react';
import {
  calculateDopunskoHealth,
  HZZO_STATUTORY_MONTHLY_2026,
  HZZO_STATUTORY_ANNUAL_2026,
} from '../../lib/calculations/dopunsko-health';
import { formatEuro } from '../../lib/calculations';

interface DopunskoCalculatorProps {
  onSelectPlan?: (carrierName: string, monthlyPrice: number) => void;
  className?: string;
}

export const DopunskoCalculator: React.FC<DopunskoCalculatorProps> = ({
  onSelectPlan,
  className = '',
}) => {
  const [age, setAge] = useState<number>(28);
  const [includeBList, setIncludeBList] = useState<boolean>(true);
  const [selectedCarrier, setSelectedCarrier] = useState<string>('Generali Osiguranje');
  const [showBindModal, setShowBindModal] = useState<boolean>(false);

  const result = useMemo(() => {
    return calculateDopunskoHealth({ age, includeBList });
  }, [age, includeBList]);

  const handleOpenBind = (carrier: string) => {
    setSelectedCarrier(carrier);
    if (onSelectPlan) {
      const opt = result.carrierOptions.find((c) => c.carrierName === carrier);
      onSelectPlan(carrier, opt ? opt.monthlyPrice : result.privateMonthly);
    } else {
      setShowBindModal(true);
    }
  };

  return (
    <div
      className={`w-full bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/40 p-6 sm:p-8 lg:p-10 ${className}`}
    >
      {/* Top Banner: Statutory 2026 HZZO Transition Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/70 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-amber-700 bg-amber-100/60 px-2 py-0.5 rounded">
              Zakon o obveznom zdravstvenom osiguranju 2026
            </span>
            <p className="text-sm font-semibold text-slate-800 mt-0.5">
              HZZO polica od 1.2.2026. iznosi fiksnih <strong className="text-slate-950">15,00 € / mj.</strong> (180,00 € god.)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Privatne police od 6,50 € / mj.
          </span>
        </div>
      </div>

      {/* Main Interactive Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Sliders & Options */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex justify-between items-baseline mb-2">
              <label htmlFor="dopunsko-age-slider" className="text-sm font-bold text-slate-900 flex items-center gap-2">
                Vaša trenutna dob:
                <span className="text-xs font-normal text-slate-500">(18 – 80 god.)</span>
              </label>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-rose-600 tracking-tight">{age}</span>
                <span className="text-sm font-semibold text-slate-600">godina</span>
              </div>
            </div>

            <input
              id="dopunsko-age-slider"
              type="range"
              min={18}
              max={80}
              value={age}
              onChange={(e) => setAge(parseInt(e.target.value, 10))}
              className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-600/30"
              aria-label="Odaberite vašu dob"
            />

            <div className="flex justify-between text-xs font-mono text-slate-600 mt-2">
              <span>18 god (od 6,50 €)</span>
              <span>40 god (od 7,50 €)</span>
              <span>60 god (od 13,50 €)</span>
              <span>80 god</span>
            </div>
          </div>

          {/* Value-add Toggles */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
              Dodatna pokrića privatnih polica
            </p>

            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={includeBList}
                onChange={(e) => setIncludeBList(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-rose-600 focus:ring-rose-600 border-slate-300"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Pill className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-semibold text-slate-900 group-hover:text-rose-600 transition-colors">
                    Pokriće dopunske B-liste lijekova (do 200 € / god.)
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pokriva nadoplate za originalne i inovativne lijekove koje HZZO ne financira.
                </p>
              </div>
            </label>

            <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-xs text-slate-600">
              <span className="flex items-center gap-1.5 font-medium">
                <Smartphone className="w-4 h-4 text-blue-500" />
                m-Doktor telemedicina (24/7 video poziv)
              </span>
              <span className="font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded">
                Uključeno besplatno
              </span>
            </div>
          </div>

          {/* Advisory Notice */}
          <div
            className={`p-4 rounded-2xl text-xs leading-relaxed border transition-colors ${
              result.isHzzoOptimal
                ? 'bg-amber-50/80 border-amber-200 text-amber-900'
                : 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {result.isHzzoOptimal ? (
                <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              ) : (
                <Sparkles className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              )}
              <p>
                <strong>Aktuarski savjetnik:</strong> {result.recommendationText}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Live Comparison & Savings Card */}
        <div className="lg:col-span-6 bg-slate-50 rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-between space-y-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider font-bold text-slate-600">
              Usporedba mjesečnih troškova (EUR)
            </span>

            {/* Direct Side-by-Side Comparison */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              {/* HZZO Card */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 text-left relative overflow-hidden">
                <span className="text-[11px] font-mono font-bold text-slate-600 block">HZZO Zakonska Polica</span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl sm:text-3xl font-black text-slate-600 line-through decoration-rose-500 decoration-2">
                    {formatEuro(result.hzzoMonthly)}
                  </span>
                  <span className="text-xs text-slate-600 font-medium">/ mj.</span>
                </div>
                <span className="text-[11px] text-slate-600 block mt-1">
                  180,00 € godišnje fiksno
                </span>
                <span className="mt-3 inline-block text-[10px] uppercase font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200/50">
                  +33% skuplje od 1.2.
                </span>
              </div>

              {/* Private Carrier Card */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-white to-emerald-50/40 border-2 border-emerald-500 text-left shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-bl-lg font-mono">
                  PREPORUKA
                </div>
                <span className="text-[11px] font-mono font-bold text-emerald-800 block">Privatni Osiguratelj</span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl sm:text-3xl font-black text-emerald-700">
                    {formatEuro(result.privateMonthly)}
                  </span>
                  <span className="text-xs text-slate-600 font-medium">/ mj.</span>
                </div>
                <span className="text-[11px] text-emerald-700 font-semibold block mt-1">
                  {formatEuro(result.privateAnnual)} godišnje
                </span>
                <span className="mt-3 inline-block text-[10px] uppercase font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  Uključena B-lista
                </span>
              </div>
            </div>

            {/* Annual Savings Counter Banner */}
            {!result.isHzzoOptimal && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 p-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-between shadow-lg shadow-emerald-500/20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                    <TrendingDown className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-xs text-emerald-100 font-mono font-medium block">
                      Vaša izravna godišnja ušteda
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-white">
                      {formatEuro(result.annualSavings)}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold bg-white/20 px-2.5 py-1 rounded-full text-white">
                  -{Math.round((result.annualSavings / HZZO_STATUTORY_ANNUAL_2026) * 100)}%
                </span>
              </motion.div>
            )}

            {/* Carrier Choices List */}
            <div className="mt-6 space-y-2">
              <span className="text-xs font-mono text-slate-600 uppercase font-bold block">
                Izravna ponuda licenciranih osiguratelja (HANFA nadzor)
              </span>
              <div className="space-y-2">
                {result.carrierOptions.map((opt) => (
                  <div
                    key={opt.carrierName}
                    className="p-3 rounded-xl bg-white border border-slate-200/80 hover:border-rose-600 transition-all flex items-center justify-between text-sm"
                  >
                    <div>
                      <span className="font-bold text-slate-900 block">{opt.carrierName}</span>
                      <span className="text-xs text-slate-500">
                        B-lista do {opt.bListCoverageEuro} € • Karenca: {opt.waitingPeriodDays} dana
                      </span>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <div>
                        <span className="text-base font-extrabold text-slate-900">
                          {formatEuro(opt.monthlyPrice)}
                        </span>
                        <span className="text-xs text-slate-500 block">/ mj.</span>
                      </div>
                      <button
                        onClick={() => handleOpenBind(opt.carrierName)}
                        className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm"
                      >
                        Odaberi
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Instant Call To Action */}
          <div className="pt-4 border-t border-slate-200">
            <button
              onClick={() => handleOpenBind(selectedCarrier)}
              className="w-full py-4 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold text-base shadow-md shadow-slate-900/10 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <span>Ugovori policu online u 60 sekundi</span>
              <ArrowRight className="w-5 h-5 text-slate-400" />
            </button>
            <p className="text-center text-[11px] text-slate-500 mt-2">
              Službena digitalna polica u vašem e-mail pretincu • 0 € agencijske provizije
            </p>
          </div>
        </div>
      </div>

      {/* Bind / Callback Modal Simulation */}
      <AnimatePresence>
        {showBindModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-emerald-600" />
                  <h3 className="text-lg font-bold text-slate-900">Potvrda ugovaranja police</h3>
                </div>
                <button
                  onClick={() => setShowBindModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl mb-4 text-xs space-y-1">
                <p>
                  <strong>Odabrani osiguratelj:</strong> {selectedCarrier}
                </p>
                <p>
                  <strong>Mjesečna premija:</strong> {formatEuro(result.privateMonthly)} / mj.
                </p>
                <p>
                  <strong>Godišnja ušteda vs HZZO:</strong> {formatEuro(result.annualSavings)}
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Vaš kontakt telefon / WhatsApp
                  </label>
                  <input
                    type="tel"
                    placeholder="091 234 5678"
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-rose-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    E-mail za dostavu police
                  </label>
                  <input
                    type="email"
                    placeholder="ivan.horvat@email.hr"
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-rose-600"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  alert(
                    `Hvala Vam! Zahtjev za ugovaranje police (${selectedCarrier}) je zaprimljen. Naš licencirani broker kontaktirat će Vas u roku od 15 minuta.`
                  );
                  setShowBindModal(false);
                }}
                className="w-full mt-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md"
              >
                Dovrši ugovaranje police
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DopunskoCalculator;
