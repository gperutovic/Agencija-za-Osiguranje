import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Car,
  Zap,
  Award,
  MapPin,
  Check,
  FileCheck2,
  ArrowRight,
} from 'lucide-react';
import {
  calculateAutoInsurance,
  RegistrationZone,
  BonusClass,
  ZONE_NAMES,
} from '../../lib/calculations/auto-insurance';
import { formatEuro } from '../../lib/calculations';
import { firestoreService } from '../../api/firestoreService';
import { leadService } from '../../services/firebase';

interface AutoInsuranceCalculatorProps {
  onQuoteRequested?: (data: any) => void;
  className?: string;
}

export const AutoInsuranceCalculator: React.FC<AutoInsuranceCalculatorProps> = ({
  onQuoteRequested,
  className = '',
}) => {
  const [kw, setKw] = useState<number>(85);
  const [zone, setZone] = useState<RegistrationZone>('zona_1');
  const [bonusClass, setBonusClass] = useState<BonusClass>('B10');
  const [includeKasko, setIncludeKasko] = useState<boolean>(false);
  const [vehicleValueEuro, setVehicleValueEuro] = useState<number>(24000);
  const [kaskoDeductible, setKaskoDeductible] = useState<0 | 150 | 300>(150);
  const [isToyotaVehicle, setIsToyotaVehicle] = useState<boolean>(false);

  // Addons
  const [glassBreakage, setGlassBreakage] = useState<boolean>(true);
  const [bonusProtection, setBonusProtection] = useState<boolean>(true);
  const [roadAssistance, setRoadAssistance] = useState<boolean>(true);
  const [passengerInsurance, setPassengerInsurance] = useState<boolean>(false);

  // Contact form persistence state
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const calculation = useMemo(() => {
    return calculateAutoInsurance({
      kw,
      zone,
      bonusClass,
      includeKasko,
      vehicleValueEuro,
      kaskoDeductible,
      isToyotaVehicle,
      addons: {
        glassBreakage,
        bonusProtection,
        roadAssistance,
        passengerInsurance,
      },
    });
  }, [
    kw,
    zone,
    bonusClass,
    includeKasko,
    vehicleValueEuro,
    kaskoDeductible,
    isToyotaVehicle,
    glassBreakage,
    bonusProtection,
    roadAssistance,
    passengerInsurance,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!fullName.trim() || !phone.trim()) {
      setErrorMsg('Unesite ime i prezime te broj telefona.');
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await firestoreService.createQuote({
        customer: {
          fullName: fullName.trim(),
          email: '',
          phone: phone.trim(),
        },
        type: 'auto',
        inputs: {
          kw,
          zone,
          bonusClass,
          includeKasko,
          vehicleValueEuro: includeKasko ? vehicleValueEuro : undefined,
          kaskoDeductible: includeKasko ? kaskoDeductible : undefined,
          isToyotaVehicle,
          glassBreakage,
          bonusProtection,
          roadAssistance,
          passengerInsurance,
        },
        calculatedEstimate: {
          annualPremium: calculation.totalAnnual,
          monthlyPremium: calculation.monthlyInstallment,
          currency: 'EUR',
          deductible: includeKasko ? kaskoDeductible : 0,
        },
        status: 'new',
      });

      await leadService.saveLead({
        oib: '',
        name: fullName.trim(),
        fullName: fullName.trim(),
        email: '',
        phone: phone.trim(),
        productType: 'auto',
        data: { kw, zone, bonusClass, includeKasko, isToyotaVehicle },
        selectedInsurer: isToyotaVehicle ? 'Generali osiguranje (Toyota program)' : 'Generali / Usporedna ponuda',
        annualPremium: calculation.totalAnnual,
        status: 'new',
        notes: `Auto kalkulator (${kw} kW, ${zone}, ${bonusClass})`,
      });

      setSubmittedRef(created.id);
      if (onQuoteRequested) {
        onQuoteRequested({
          kw,
          zone,
          bonusClass,
          includeKasko,
          calculation,
        });
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Pogreška pri spremanju upita. Pokušajte ponovo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`w-full bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8 lg:p-10 ${className}`}
    >
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#0F2942]/10 text-[#0F2942] flex items-center justify-center shrink-0">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Informativni izračun auto i kasko osiguranja</h3>
            <p className="text-xs text-slate-500">
              Prijenos stečenog bonusa do 50% • Bez naknade agencije • Zelena karta u PDF-u
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 self-start sm:self-auto shrink-0">
          Orijentacijska kalkulacija premije
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        {/* Left Form Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Snaga motora (kW) */}
          <div>
            <div className="flex justify-between items-baseline mb-2">
              <label htmlFor="auto-kw-slider" className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#0F2942]" />
                Snaga motora (polje P.2 u prometnoj):
              </label>
              <div className="flex items-baseline gap-1.5 tabular-nums">
                <span className="text-2xl font-bold text-[#0F2942]">{kw}</span>
                <span className="text-xs font-semibold text-slate-500">kW</span>
                <span className="text-xs text-slate-400">
                  (~{Math.round(kw * 1.35962)} KS)
                </span>
              </div>
            </div>
            <input
              id="auto-kw-slider"
              type="range"
              min={25}
              max={250}
              step={1}
              value={kw}
              onChange={(e) => setKw(parseInt(e.target.value, 10))}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0F2942] focus:outline-none"
              aria-label="Odaberite snagu motora u kilovatima"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1.5 tabular-nums">
              <span>Gradski (45 kW)</span>
              <span>Kompakt (85 kW)</span>
              <span>Limuzina / SUV (110+ kW)</span>
            </div>
          </div>

          {/* 2. Registracijska zona */}
          <div>
            <label htmlFor="auto-zone-select" className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-[#0F2942]" />
              Registracijsko područje (rizična zona):
            </label>
            <select
              id="auto-zone-select"
              value={zone}
              onChange={(e) => setZone(e.target.value as RegistrationZone)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white font-medium text-sm text-slate-800 focus:outline-none focus:border-[#0F2942] focus:ring-2 focus:ring-[#0F2942]/10"
            >
              {(Object.keys(ZONE_NAMES) as RegistrationZone[]).map((z) => (
                <option key={z} value={z}>
                  {ZONE_NAMES[z]}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Bonus-Malus Razred */}
          <div>
            <div className="flex justify-between items-baseline mb-2">
              <label htmlFor="auto-bonus-select" className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-[#0F2942]" />
                Premijski razred (bonus/malus):
              </label>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 tabular-nums">
                Popust: {calculation.bonusPercent}%
              </span>
            </div>
            <select
              id="auto-bonus-select"
              value={bonusClass}
              onChange={(e) => setBonusClass(e.target.value as BonusClass)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white font-medium text-sm text-slate-800 focus:outline-none focus:border-[#0F2942] focus:ring-2 focus:ring-[#0F2942]/10"
            >
              <option value="B10">Klasa B10 (50% bonusa – najčešći prijenos)</option>
              <option value="B9">Klasa B9 (45% bonusa)</option>
              <option value="B8">Klasa B8 (40% bonusa)</option>
              <option value="B7">Klasa B7 (35% bonusa)</option>
              <option value="B6">Klasa B6 (30% bonusa)</option>
              <option value="B5">Klasa B5 (25% bonusa)</option>
              <option value="B4">Klasa B4 (20% bonusa)</option>
              <option value="B3">Klasa B3 (15% bonusa)</option>
              <option value="B2">Klasa B2 (10% bonusa)</option>
              <option value="B1">Klasa B1 (5% bonusa)</option>
              <option value="B0">Klasa B0 (0% – prvo vozilo)</option>
            </select>
          </div>

          {/* 4. Dodatna AO Pokrića */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 block">
              Dopunska pokrića uz autoodgovornost
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <label className="flex items-center gap-2.5 text-xs font-medium text-slate-800 cursor-pointer p-2.5 rounded-lg bg-white border border-slate-200 hover:border-[#0F2942]">
                <input
                  type="checkbox"
                  checked={glassBreakage}
                  onChange={(e) => setGlassBreakage(e.target.checked)}
                  className="rounded accent-[#0F2942]"
                />
                <span>Lom stakla (+35 €)</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs font-medium text-slate-800 cursor-pointer p-2.5 rounded-lg bg-white border border-slate-200 hover:border-[#0F2942]">
                <input
                  type="checkbox"
                  checked={bonusProtection}
                  onChange={(e) => setBonusProtection(e.target.checked)}
                  className="rounded accent-[#0F2942]"
                />
                <span>Zaštita stečenog bonusa (+20 €)</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs font-medium text-slate-800 cursor-pointer p-2.5 rounded-lg bg-white border border-slate-200 hover:border-[#0F2942]">
                <input
                  type="checkbox"
                  checked={roadAssistance}
                  onChange={(e) => setRoadAssistance(e.target.checked)}
                  className="rounded accent-[#0F2942]"
                />
                <span>Asistencija na cesti RH i EU (+25 €)</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs font-medium text-slate-800 cursor-pointer p-2.5 rounded-lg bg-white border border-slate-200 hover:border-[#0F2942]">
                <input
                  type="checkbox"
                  checked={passengerInsurance}
                  onChange={(e) => setPassengerInsurance(e.target.checked)}
                  className="rounded accent-[#0F2942]"
                />
                <span>Osiguranje vozača i putnika (+15 €)</span>
              </label>
            </div>
          </div>

          {/* 5. Kasko Opcija & Toyota Centar Zagreb Program */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={includeKasko}
                onChange={(e) => setIncludeKasko(e.target.checked)}
                className="w-4 h-4 rounded accent-[#0F2942]"
              />
              <span className="text-sm font-bold text-slate-900">
                Uključi puno Kasko osiguranje (sudar, krađa, tuča, vandalizam)
              </span>
            </label>

            {includeKasko && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-4 pt-3 border-t border-slate-200"
              >
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                    <span>Orijentacijska novonabavna vrijednost vozila:</span>
                    <span className="font-bold text-[#0F2942] tabular-nums">{formatEuro(vehicleValueEuro)}</span>
                  </div>
                  <input
                    type="range"
                    min={10000}
                    max={60000}
                    step={2000}
                    value={vehicleValueEuro}
                    onChange={(e) => setVehicleValueEuro(parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0F2942]"
                  />
                </div>

                <div>
                  <span className="text-xs font-semibold text-slate-700 block mb-2">
                    Odabir franšize (vlastito učešće u šteti):
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { val: 0, label: '0 € (Bez franšize)' },
                      { val: 150, label: '150 € (-12%)' },
                      { val: 300, label: '300 € (-26%)' },
                    ].map((f) => (
                      <button
                        key={f.val}
                        type="button"
                        onClick={() => setKaskoDeductible(f.val as 0 | 150 | 300)}
                        className={`py-2 px-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                          kaskoDeductible === f.val
                            ? 'bg-[#0F2942] text-white border-[#0F2942]'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="flex items-start gap-2.5 p-3 rounded-lg bg-white border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isToyotaVehicle}
                    onChange={(e) => setIsToyotaVehicle(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded accent-[#0F2942]"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Program Toyota Centar Zagreb & Generali VIP Kasko
                    </span>
                    <span className="text-xs text-slate-500">
                      Uvjeti za vozila kupljena ili održavana u ovlaštenom servisu (originalni dijelovi i pogodnosti pri šteti).
                    </span>
                  </div>
                </label>
              </motion.div>
            )}
          </div>
        </div>

        {/* Right Calculation Summary Card */}
        <div className="lg:col-span-5 bg-slate-50 rounded-xl border border-slate-200 p-6 flex flex-col justify-between space-y-6">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">
              Specifikacija informativne premije
            </span>

            <div className="mt-3 p-5 rounded-xl bg-white border border-slate-200 shadow-sm text-left">
              <span className="text-xs text-slate-500 block">Ukupna godišnja premija</span>
              <div className="mt-1.5 flex items-baseline gap-1.5 tabular-nums">
                <span className="text-3xl sm:text-4xl font-bold text-[#0F2942] tracking-tight">
                  {formatEuro(calculation.totalAnnual)}
                </span>
                <span className="text-xs font-medium text-slate-500">/ god.</span>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 tabular-nums">
                <span>Obročno (12 rata bez kamata):</span>
                <strong className="text-sm font-bold text-slate-900">
                  {formatEuro(calculation.monthlyInstallment)} / mj.
                </strong>
              </div>
            </div>

            <div className="mt-5 space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-200">
                <span className="text-slate-600">Obvezno osiguranje (AO):</span>
                <span className="font-semibold text-slate-900 tabular-nums">{formatEuro(calculation.aoNetto)}</span>
              </div>

              {calculation.addonsTotal > 0 && (
                <div className="flex justify-between py-1.5 border-b border-slate-200">
                  <span className="text-slate-600">Odabrana dopunska pokrića:</span>
                  <span className="font-semibold text-slate-900 tabular-nums">{formatEuro(calculation.addonsTotal)}</span>
                </div>
              )}

              {includeKasko && (
                <div className="flex justify-between py-1.5 border-b border-slate-200 text-[#0F2942] font-semibold">
                  <span>Puno kasko pokriće (franšiza {kaskoDeductible} €):</span>
                  <span className="tabular-nums">{formatEuro(calculation.kaskoAnnual)}</span>
                </div>
              )}

              {calculation.discountsApplied.map((d, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium pt-1">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>{d}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-200">
              <span className="text-xs text-slate-500 block">
                Podržani načini plaćanja: HUB 3A / SEPA nalog, kartice do 12 rata, KEKS Pay.
              </span>
            </div>
          </div>

          <div className="pt-2">
            {!submittedRef ? (
              <form onSubmit={handleSubmit} className="space-y-3">
                {errorMsg && (
                  <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800">
                    {errorMsg}
                  </div>
                )}
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ime i prezime"
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-[#0F2942] focus:ring-2 focus:ring-[#0F2942]/10"
                />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Broj mobitela (npr. 091 234 5678)"
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-[#0F2942] focus:ring-2 focus:ring-[#0F2942]/10 tabular-nums"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-lg bg-[#0F2942] hover:bg-[#163859] text-white font-semibold text-sm shadow-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <span>{isSubmitting ? 'Slanje zahtjeva...' : 'Zatražite službenu ponudu'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <FileCheck2 className="w-8 h-8 text-emerald-700 mx-auto" />
                <p className="text-sm font-bold text-emerald-950">Zahtjev za ponudu je zabilježen</p>
                <p className="text-xs text-emerald-800">
                  Referenca: <strong className="tabular-nums">{submittedRef}</strong>. Ovlašteni zastupnik dostavit će vam usporednu ponudu s IPID obrascem.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoInsuranceCalculator;
