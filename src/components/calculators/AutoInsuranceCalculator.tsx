import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Car,
  Shield,
  Zap,
  MapPin,
  Check,
  Sparkles,
  ArrowRight,
  Sliders,
  Award,
  Clock,
  FileCheck2,
} from 'lucide-react';
import {
  calculateAutoInsurance,
  RegistrationZone,
  BonusClass,
  ZONE_NAMES,
} from '../../lib/calculations/auto-insurance';
import { formatEuro } from '../../lib/calculations';

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

  const [submitted, setSubmitted] = useState<boolean>(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (onQuoteRequested) {
      onQuoteRequested({
        kw,
        zone,
        bonusClass,
        includeKasko,
        calculation,
      });
    }
  };

  return (
    <div
      className={`w-full bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/40 p-6 sm:p-8 lg:p-10 ${className}`}
    >
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 mb-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Aktuarski izračun auto osiguranja i kaska</h3>
            <p className="text-xs text-slate-500">
              Službene tarife s prijenosom 50% bonusa • Bez provizije • Zelena karta u PDF-u
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-blue-50 text-blue-700 border border-blue-200 self-start sm:self-auto">
          <Clock className="w-3.5 h-3.5" />
          Gotovo u 60 sekundi
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Form Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Snaga motora (kW) */}
          <div>
            <div className="flex justify-between items-baseline mb-2">
              <label htmlFor="auto-kw-slider" className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                Snaga motora:
              </label>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-900">{kw}</span>
                <span className="text-xs font-semibold text-slate-500">kW</span>
                <span className="text-xs font-mono text-slate-400">
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
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none"
              aria-label="Odaberite snagu motora u kilovatima"
            />
            <div className="flex justify-between text-[11px] font-mono text-slate-600 mt-1">
              <span>Gradski (45 kW)</span>
              <span>Kompakt (85 kW)</span>
              <span>SUV / Limuzina (110+ kW)</span>
            </div>
          </div>

          {/* 2. Registracijska zona */}
          <div>
            <label htmlFor="auto-zone-select" className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-rose-500" />
              Registracijsko područje (Rizična zona):
            </label>
            <select
              id="auto-zone-select"
              value={zone}
              onChange={(e) => setZone(e.target.value as RegistrationZone)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
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
                <Award className="w-4 h-4 text-emerald-500" />
                Bonus razred:
              </label>
              <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Popust: {calculation.bonusPercent}%
              </span>
            </div>
            <select
              id="auto-bonus-select"
              value={bonusClass}
              onChange={(e) => setBonusClass(e.target.value as BonusClass)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            >
              <option value="B10">Klasa B10 (Maksimalni bonus 50% popusta) - NAJČEŠĆE</option>
              <option value="B9">Klasa B9 (45% bonusa)</option>
              <option value="B8">Klasa B8 (40% bonusa)</option>
              <option value="B7">Klasa B7 (35% bonusa)</option>
              <option value="B6">Klasa B6 (30% bonusa)</option>
              <option value="B5">Klasa B5 (25% bonusa)</option>
              <option value="B4">Klasa B4 (20% bonusa)</option>
              <option value="B3">Klasa B3 (15% bonusa)</option>
              <option value="B2">Klasa B2 (10% bonusa)</option>
              <option value="B1">Klasa B1 (5% bonusa)</option>
              <option value="B0">Klasa B0 (0% - Početnik / Prvo vozilo)</option>
            </select>
          </div>

          {/* 4. Dodatna AO Pokrića */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider font-bold text-slate-700 block">
              Preporučena dopunska pokrića za auto
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer p-2 rounded-lg bg-white border border-slate-200 hover:border-blue-400">
                <input
                  type="checkbox"
                  checked={glassBreakage}
                  onChange={(e) => setGlassBreakage(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span>Lom stakla (+35 €)</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer p-2 rounded-lg bg-white border border-slate-200 hover:border-blue-400">
                <input
                  type="checkbox"
                  checked={bonusProtection}
                  onChange={(e) => setBonusProtection(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span>Zaštita bonusa (+20 €)</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer p-2 rounded-lg bg-white border border-slate-200 hover:border-blue-400">
                <input
                  type="checkbox"
                  checked={roadAssistance}
                  onChange={(e) => setRoadAssistance(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span>Pomoć na cesti RH & EU (+25 €)</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer p-2 rounded-lg bg-white border border-slate-200 hover:border-blue-400">
                <input
                  type="checkbox"
                  checked={passengerInsurance}
                  onChange={(e) => setPassengerInsurance(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span>Nezgoda vozača i putnika (+15 €)</span>
              </label>
            </div>
          </div>

          {/* 5. Kasko Opcija i Toyota VIP program */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/70 to-indigo-50/70 border border-blue-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeKasko}
                  onChange={(e) => setIncludeKasko(e.target.checked)}
                  className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-bold text-slate-900">
                  Dodaj puno Kasko osiguranje (sudar, krađa, tuča, vandalizam)
                </span>
              </label>
            </div>

            {includeKasko && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-4 pt-2 border-t border-blue-200/60"
              >
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>Orijentacijska vrijednost novog vozila:</span>
                    <span className="font-bold text-blue-700">{formatEuro(vehicleValueEuro)}</span>
                  </div>
                  <input
                    type="range"
                    min={10000}
                    max={60000}
                    step={2000}
                    value={vehicleValueEuro}
                    onChange={(e) => setVehicleValueEuro(parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                <div>
                  <span className="text-xs font-semibold text-slate-700 block mb-2">
                    Franšiza (vlastito učešće u šteti):
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { val: 0, label: '0 € (Bez franšize)' },
                      { val: 150, label: '150 € (-12% popusta)' },
                      { val: 300, label: '300 € (-26% popusta)' },
                    ].map((f) => (
                      <button
                        key={f.val}
                        type="button"
                        onClick={() => setKaskoDeductible(f.val as 0 | 150 | 300)}
                        className={`py-2 px-2 text-xs font-bold rounded-lg border transition-all ${
                          kaskoDeductible === f.val
                            ? 'bg-blue-600 text-white border-blue-600 shadow'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Toyota Centar Zagreb VIP Kasko */}
                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-blue-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isToyotaVehicle}
                    onChange={(e) => setIsToyotaVehicle(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Vozilo je kupljeno / servisirano u Toyota Centar Zagreb
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Dodatnih 15% VIP popusta, originalni dijelovi i zamjenski hibrid.
                    </span>
                  </div>
                </label>
              </motion.div>
            )}
          </div>
        </div>

        {/* Right Calculation Summary Card */}
        <div className="lg:col-span-5 bg-slate-50 rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-between space-y-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider font-bold text-slate-600">
              Izračun premije (Godišnje & Mjesečno)
            </span>

            {/* Price Box */}
            <div className="mt-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm text-left">
              <span className="text-xs font-mono text-slate-500 block">Ukupna godišnja premija</span>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-4xl font-black text-slate-950 tracking-tight">
                  {formatEuro(calculation.totalAnnual)}
                </span>
                <span className="text-xs font-medium text-slate-500">/ god.</span>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>Ili do 12 rata bez kamata:</span>
                <strong className="text-sm font-extrabold text-blue-600">
                  {formatEuro(calculation.monthlyInstallment)} / mj.
                </strong>
              </div>
            </div>

            {/* Detailed Actuarial Breakdown */}
            <div className="mt-5 space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-200/70">
                <span className="text-slate-600">Osnovno obvezno osiguranje (AO):</span>
                <span className="font-bold text-slate-900">{formatEuro(calculation.aoNetto)}</span>
              </div>

              {calculation.addonsTotal > 0 && (
                <div className="flex justify-between py-1.5 border-b border-slate-200/70">
                  <span className="text-slate-600">Dopunska pokrića (staklo, asistencija, bonus):</span>
                  <span className="font-bold text-slate-900">{formatEuro(calculation.addonsTotal)}</span>
                </div>
              )}

              {includeKasko && (
                <div className="flex justify-between py-1.5 border-b border-slate-200/70 text-blue-900 font-semibold">
                  <span>Puno kasko pokriće (Franšiza {kaskoDeductible} €):</span>
                  <span>{formatEuro(calculation.kaskoAnnual)}</span>
                </div>
              )}

              {calculation.discountsApplied.map((d, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium pt-1">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>{d}</span>
                </div>
              ))}
            </div>

            {/* Payment Methods Badges */}
            <div className="mt-6 pt-4 border-t border-slate-200">
              <span className="text-[11px] font-mono text-slate-500 block mb-2">
                Dostupno plaćanje: CorvusPay (do 12 rata), KEKS Pay, AirCash &amp; 2D barkod
              </span>
            </div>
          </div>

          {/* Form Submit / Call to action */}
          <div className="pt-2">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  required
                  placeholder="Vaše ime i prezime"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-600"
                />
                <input
                  type="tel"
                  required
                  placeholder="Broj mobitela (npr. 091 234 5678)"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-600"
                />
                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold text-base shadow-md shadow-slate-900/10 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span>Zatraži službenu ponudu s 50% bonusa</span>
                </button>
              </form>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <FileCheck2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="text-sm font-bold text-emerald-950">Izračun uspješno zabilježen!</p>
                <p className="text-xs text-emerald-800">
                  Naš broker šalje Vam službenu ponudu s Generali / Croatia / Allianz policom na pregled u roku od 15 minuta.
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
