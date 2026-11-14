import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  ShieldCheck,
  TrendingDown,
  Info,
  ArrowRight,
  Smartphone,
  Pill,
} from 'lucide-react';
import {
  calculateDopunskoHealth,
  HZZO_STATUTORY_MONTHLY_2026,
  HZZO_STATUTORY_ANNUAL_2026,
} from '../../lib/calculations/dopunsko-health';
import { formatEuro } from '../../lib/calculations';
import { firestoreService } from '../../api/firestoreService';
import { leadService } from '../../services/firebase';

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
  const [selectedCarrier, setSelectedCarrier] = useState<string>('Generali osiguranje');
  const [showBindModal, setShowBindModal] = useState<boolean>(false);

  // Modal lead/quote persistence state
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const result = useMemo(() => {
    return calculateDopunskoHealth({ age, includeBList });
  }, [age, includeBList]);

  const handleOpenBind = (carrier: string) => {
    setSelectedCarrier(carrier);
    setSubmittedRef(null);
    setFormError(null);
    if (onSelectPlan) {
      const opt = result.carrierOptions.find((c) => c.carrierName === carrier);
      onSelectPlan(carrier, opt ? opt.monthlyPrice : result.privateMonthly);
    } else {
      setShowBindModal(true);
    }
  };

  const handleBindSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!fullName.trim() || !phone.trim() || !email.trim()) {
      setFormError('Molimo ispunite ime i prezime, broj telefona i e-mail adresu.');
      return;
    }

    setIsSubmitting(true);
    try {
      const quote = await firestoreService.createQuote({
        customer: {
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
        },
        type: 'health',
        inputs: {
          age,
          includeBList,
          selectedCarrier,
        },
        calculatedEstimate: {
          annualPremium: result.privateAnnual,
          monthlyPremium: result.privateMonthly,
          currency: 'EUR',
          coverageLimit: 200,
        },
        status: 'new',
      });

      await leadService.saveLead({
        oib: '',
        name: fullName.trim(),
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        productType: 'health',
        data: { age, includeBList, annualSavings: result.annualSavings },
        selectedInsurer: selectedCarrier,
        annualPremium: result.privateAnnual,
        status: 'new',
        notes: `Dopunsko zdravstveno izračun (${selectedCarrier})`,
      });

      setSubmittedRef(quote.id);
    } catch (err) {
      console.error(err);
      setFormError('Došlo je do pogreške pri spremanju zahtjeva. Pokušajte ponovo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`w-full bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8 lg:p-10 ${className}`}
    >
      {/* Top Statutory Context Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 mb-8">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#0F2942]/10 text-[#0F2942] flex items-center justify-center shrink-0">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#0F2942]">
              Usporedba s HZZO policom (od 1. 2. 2026.)
            </span>
            <p className="text-sm text-slate-700 mt-0.5">
              Zakonska cijena HZZO police iznosi fiksnih{' '}
              <strong className="text-slate-900 tabular-nums">
                {formatEuro(HZZO_STATUTORY_MONTHLY_2026)} / mj.
              </strong>{' '}
              <span className="text-slate-500 tabular-nums">
                ({formatEuro(HZZO_STATUTORY_ANNUAL_2026)} god.)
              </span>
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-md self-start sm:self-auto shrink-0">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Usporedba ovlaštenih osiguratelja
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        {/* Left Column: Actuarial Controls */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex justify-between items-baseline mb-3">
              <label htmlFor="dopunsko-age-slider" className="text-base font-bold text-slate-900">
                Vaša dob (navršene godine):
              </label>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-bold text-[#0F2942] tabular-nums">{age}</span>
                <span className="text-sm font-medium text-slate-500">god.</span>
              </div>
            </div>

            <input
              id="dopunsko-age-slider"
              type="range"
              min={18}
              max={80}
              step={1}
              value={age}
              onChange={(e) => setAge(parseInt(e.target.value, 10))}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0F2942] focus:outline-none focus:ring-2 focus:ring-[#0F2942]/20"
              aria-label="Odaberite vašu dob"
            />

            <div className="flex justify-between text-xs text-slate-500 mt-2 tabular-nums">
              <span>18 god. (od 6,50 €)</span>
              <span>40 god. (od 7,50 €)</span>
              <span>60 god. (od 13,50 €)</span>
              <span>80 god.</span>
            </div>
          </div>

          {/* Value-add Options */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Pokriće dopunske liste i dodatne usluge
            </p>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={includeBList}
                onChange={(e) => setIncludeBList(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded accent-[#0F2942] border-slate-300"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Pill className="w-4 h-4 text-[#0F2942]" />
                  <span className="text-sm font-semibold text-slate-900">
                    Pokriće dopunske B-liste lijekova (do 200 € godišnje)
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Pokriva nadoplate za lijekove s dopunske liste HZZO-a koje ne financira osnovno zdravstveno osiguranje.
                </p>
              </div>
            </label>

            <div className="pt-2.5 border-t border-slate-200 flex items-center justify-between text-xs text-slate-700">
              <span className="flex items-center gap-1.5 font-medium">
                <Smartphone className="w-4 h-4 text-[#0F2942]" />
                Telemedicinske konzultacije (uključeno kod odabranih paketa)
              </span>
              <span className="font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                Bez nadoplate
              </span>
            </div>
          </div>

          {/* Advisory Notice */}
          <div
            className={`p-4 rounded-xl text-xs leading-relaxed border ${
              result.isHzzoOptimal
                ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            <div className="flex items-start gap-2.5">
              <Info className="w-4 h-4 text-[#0F2942] mt-0.5 shrink-0" />
              <p>
                <strong className="font-semibold text-slate-900">Napomena o izračunu:</strong>{' '}
                {result.recommendationText}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Side-by-Side Comparison */}
        <div className="lg:col-span-6 bg-slate-50 rounded-xl border border-slate-200 p-6 flex flex-col justify-between space-y-6">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">
              Usporedba mjesečnih troškova (EUR)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
              {/* HZZO Card */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 text-left">
                <span className="text-xs font-semibold text-slate-500 block">HZZO polica</span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl sm:text-3xl font-bold text-slate-500 line-through decoration-rose-500 decoration-2 tabular-nums">
                    {formatEuro(result.hzzoMonthly)}
                  </span>
                  <span className="text-xs text-slate-500">/ mj.</span>
                </div>
                <span className="text-xs text-slate-500 block mt-1 tabular-nums">
                  {formatEuro(HZZO_STATUTORY_ANNUAL_2026)} godišnje
                </span>
                <span className="mt-3 inline-block text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                  Bez B-liste lijekova
                </span>
              </div>

              {/* Private Carrier Card */}
              <div className="p-4 rounded-xl bg-white border-2 border-[#0F2942] text-left shadow-sm relative">
                <span className="text-xs font-semibold text-[#0F2942] block">Privatni osiguratelji</span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl sm:text-3xl font-bold text-[#0F2942] tabular-nums">
                    {formatEuro(result.privateMonthly)}
                  </span>
                  <span className="text-xs text-slate-600">/ mj.</span>
                </div>
                <span className="text-xs text-slate-700 font-medium block mt-1 tabular-nums">
                  {formatEuro(result.privateAnnual)} godišnje
                </span>
                <span className="mt-3 inline-block text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  {includeBList ? 'Uključena B-lista lijekova' : 'Osnovno pokriće participacija'}
                </span>
              </div>
            </div>

            {!result.isHzzoOptimal && (
              <div className="mt-4 p-4 rounded-xl bg-[#0F2942] text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                    <TrendingDown className="w-5 h-5 text-emerald-300" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-300 block">
                      Potencijalna godišnja ušteda u odnosu na HZZO
                    </span>
                    <span className="text-xl font-bold text-white tabular-nums">
                      {formatEuro(result.annualSavings)}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-semibold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 px-2.5 py-1 rounded-md tabular-nums">
                  -{Math.round((result.annualSavings / HZZO_STATUTORY_ANNUAL_2026) * 100)}%
                </span>
              </div>
            )}

            {/* Carrier Options List */}
            <div className="mt-5 space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
                Pregled ponuda partnerskih osiguratelja
              </span>
              <div className="space-y-2">
                {result.carrierOptions.map((opt) => (
                  <div
                    key={opt.carrierName}
                    className="p-3 rounded-lg bg-white border border-slate-200 hover:border-[#0F2942] transition-colors flex items-center justify-between text-sm"
                  >
                    <div>
                      <span className="font-semibold text-slate-900 block">{opt.carrierName}</span>
                      <span className="text-xs text-slate-500">
                        B-lista do {opt.bListCoverageEuro} € • Karenca: {opt.waitingPeriodDays} dana
                      </span>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <div className="tabular-nums">
                        <span className="text-base font-bold text-slate-900">
                          {formatEuro(opt.monthlyPrice)}
                        </span>
                        <span className="text-xs text-slate-500 block">/ mj.</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleOpenBind(opt.carrierName)}
                        className="px-3.5 py-1.5 rounded-lg bg-[#0F2942] hover:bg-[#163859] text-white text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Odaberi
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => handleOpenBind(selectedCarrier)}
              className="w-full py-3.5 rounded-lg bg-[#0F2942] hover:bg-[#163859] text-white font-semibold text-sm shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Zatražite policu uz savjetovanje zastupnika</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-center text-xs text-slate-500 mt-2">
              Isporuka police na e-mail • Bez naknade za posredovanje
            </p>
          </div>
        </div>
      </div>

      {/* Quote / Bind Confirmation Modal */}
      <AnimatePresence>
        {showBindModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#0F2942]" />
                  <h3 className="text-lg font-bold text-slate-900">Zahtjev za policu dopunskog</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowBindModal(false)}
                  className="text-slate-400 hover:text-slate-700 text-sm font-bold px-2 py-1 rounded cursor-pointer"
                  aria-label="Zatvori"
                >
                  ✕
                </button>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg mb-4 text-xs space-y-1 text-slate-700 tabular-nums">
                <p>
                  <strong className="text-slate-900">Odabrani osiguratelj:</strong> {selectedCarrier}
                </p>
                <p>
                  <strong className="text-slate-900">Informativna premija:</strong>{' '}
                  {formatEuro(result.privateMonthly)} / mj.
                </p>
                <p>
                  <strong className="text-slate-900">Godišnja ušteda vs HZZO:</strong>{' '}
                  {formatEuro(result.annualSavings)}
                </p>
              </div>

              {submittedRef ? (
                <div className="p-5 rounded-lg bg-emerald-50 border border-emerald-200 text-center space-y-2.5">
                  <CheckCircle2 className="w-9 h-9 text-emerald-700 mx-auto" />
                  <h4 className="text-sm font-bold text-emerald-950">Zahtjev je uspješno zaprimljen</h4>
                  <p className="text-xs text-emerald-800">
                    Referenca upita: <strong className="tabular-nums">{submittedRef}</strong>. Ovlašteni zastupnik kontaktirat će vas s dokumentacijom police i IPID obrascem.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowBindModal(false)}
                    className="mt-2 px-5 py-2 rounded-lg bg-[#0F2942] text-white text-xs font-semibold cursor-pointer"
                  >
                    Zatvori prozor
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBindSubmit} className="space-y-3">
                  {formError && (
                    <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800">
                      {formError}
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Ime i prezime
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ivan Horvat"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-[#0F2942]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Kontakt telefon / mobitel
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="091 234 5678"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-[#0F2942] tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      E-mail adresa za dostavu dokumentacije
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ivan.horvat@email.hr"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-[#0F2942]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-3 py-2.5 rounded-lg bg-[#0F2942] hover:bg-[#163859] text-white font-semibold text-sm transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? 'Slanje zahtjeva...' : 'Pošalji zahtjev za ponudu'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DopunskoCalculator;
