import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Home, ShieldCheck, Waves, Lock, Building, Sparkles, ArrowRight, Check } from 'lucide-react';
import { formatEuro } from '../../lib/calculations';

interface PropertyCalculatorProps {
  className?: string;
  onQuoteRequested?: (data: any) => void;
}

export const PropertyCalculator: React.FC<PropertyCalculatorProps> = ({
  className = '',
  onQuoteRequested,
}) => {
  const [propertyType, setPropertyType] = useState<'stan' | 'kuca'>('stan');
  const [squareMeters, setSquareMeters] = useState<number>(75);
  const [includeEarthquake, setIncludeEarthquake] = useState<boolean>(true);
  const [includeWaterLeak, setIncludeWaterLeak] = useState<boolean>(true);
  const [includeTheft, setIncludeTheft] = useState<boolean>(true);
  const [deductibleEuro, setDeductibleEuro] = useState<0 | 150 | 300>(0);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const calculation = useMemo(() => {
    const baseRatePerMeter = propertyType === 'stan' ? 0.42 : 0.58;
    let annual = squareMeters * baseRatePerMeter;

    if (includeEarthquake) {
      annual += squareMeters * 0.35;
    }
    if (includeWaterLeak) {
      annual += 22.0;
    }
    if (includeTheft) {
      annual += 18.0;
    }

    // Franšiza popust
    if (deductibleEuro === 150) {
      annual *= 0.88; // -12%
    } else if (deductibleEuro === 300) {
      annual *= 0.78; // -22%
    }

    const annualTotal = parseFloat(Math.max(48.0, annual).toFixed(2));
    const monthlyInstallment = parseFloat((annualTotal / 12).toFixed(2));

    return {
      annualTotal,
      monthlyInstallment,
      buildingCoverage: squareMeters * 1400, // npr. 1400 €/m2 nova građevinska vrijednost
      contentsCoverage: squareMeters * 350, // 350 €/m2 oprema kućanstva
    };
  }, [propertyType, squareMeters, includeEarthquake, includeWaterLeak, includeTheft, deductibleEuro]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (onQuoteRequested) {
      onQuoteRequested({
        propertyType,
        squareMeters,
        includeEarthquake,
        deductibleEuro,
        calculation,
      });
    }
  };

  return (
    <div
      className={`w-full bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/40 p-6 sm:p-8 lg:p-10 ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 mb-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
            <Home className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Kalkulator osiguranja doma i potresa</h3>
            <p className="text-xs text-slate-500">
              Generali & Wiener paketi • Zaštita na novu građevinsku vrijednost • Bez franšize
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-amber-50 text-amber-700 border border-amber-200 self-start sm:self-auto">
          Izračun u 45 sekundi
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Property Type */}
          <div>
            <label className="text-sm font-bold text-slate-900 block mb-2">Vrsta nekretnine:</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPropertyType('stan')}
                className={`py-3 px-4 rounded-xl border-2 text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  propertyType === 'stan'
                    ? 'border-amber-500 bg-amber-50/50 text-amber-950'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Building className="w-4 h-4" />
                <span>Stan u zgradi</span>
              </button>
              <button
                type="button"
                onClick={() => setPropertyType('kuca')}
                className={`py-3 px-4 rounded-xl border-2 text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  propertyType === 'kuca'
                    ? 'border-amber-500 bg-amber-50/50 text-amber-950'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Obiteljska kuća</span>
              </button>
            </div>
          </div>

          {/* Square Meters */}
          <div>
            <div className="flex justify-between items-baseline mb-2">
              <label htmlFor="property-sqm-slider" className="text-sm font-bold text-slate-900">
                Kvadratura stambenog prostora:
              </label>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-amber-600">{squareMeters}</span>
                <span className="text-xs font-semibold text-slate-500">m²</span>
              </div>
            </div>
            <input
              id="property-sqm-slider"
              type="range"
              min={25}
              max={300}
              step={5}
              value={squareMeters}
              onChange={(e) => setSquareMeters(parseInt(e.target.value, 10))}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
              aria-label="Odaberite kvadraturu u metrima kvadratnim"
            />
            <div className="flex justify-between text-[11px] font-mono text-slate-600 mt-1">
              <span>Manji stan (40 m²)</span>
              <span>Obiteljski (80 m²)</span>
              <span>Kuća (150+ m²)</span>
            </div>
          </div>

          {/* Coverage Options */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider font-bold text-slate-700 block">
              Ključna pokrića
            </span>

            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={includeEarthquake}
                onChange={(e) => setIncludeEarthquake(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
              />
              <div className="flex-1">
                <span className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                  Rizik od potresa (zemljotres)
                </span>
                <p className="text-xs text-slate-500">
                  Pokriće građevinskog dijela i stvari kućanstva na novu građevinsku vrijednost bez skrivenih odbitaka.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={includeWaterLeak}
                onChange={(e) => setIncludeWaterLeak(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
              />
              <div className="flex-1">
                <span className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                  Izljev vode iz vodovodnih i kanalizacijskih cijevi
                </span>
                <p className="text-xs text-slate-500">
                  Uključuje i troškove lociranja kvara, otvaranja i sanacije zidova/pločica.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={includeTheft}
                onChange={(e) => setIncludeTheft(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
              />
              <div className="flex-1">
                <span className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                  Provalna krađa i razbojništvo
                </span>
                <p className="text-xs text-slate-500">
                  Otuđene stvari, nakit i oštećenja na vratima i prozorima nastala provalom.
                </p>
              </div>
            </label>
          </div>

          {/* Deductible Sliders */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2">
              Franšiza (učešće u šteti):
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { val: 0, label: '0 € (Bez franšize)' },
                { val: 150, label: '150 € (-12%)' },
                { val: 300, label: '300 € (-22%)' },
              ].map((f) => (
                <button
                  key={f.val}
                  type="button"
                  onClick={() => setDeductibleEuro(f.val as 0 | 150 | 300)}
                  className={`py-2 px-2 text-xs font-bold rounded-lg border transition-all ${
                    deductibleEuro === f.val
                      ? 'bg-amber-600 text-white border-amber-600 shadow'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Summary */}
        <div className="lg:col-span-5 bg-slate-50 rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-between space-y-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider font-bold text-slate-600">
              Godišnja i mjesečna premija
            </span>

            <div className="mt-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm text-left">
              <span className="text-xs font-mono text-slate-500 block">Ukupna godišnja polica</span>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-4xl font-black text-slate-950 tracking-tight">
                  {formatEuro(calculation.annualTotal)}
                </span>
                <span className="text-xs font-medium text-slate-500">/ god.</span>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>Plaćanje na 12 rata:</span>
                <strong className="text-sm font-extrabold text-amber-600">
                  {formatEuro(calculation.monthlyInstallment)} / mj.
                </strong>
              </div>
            </div>

            <div className="mt-5 space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-200/70">
                <span className="text-slate-600">Građevinska vrijednost objekta:</span>
                <span className="font-bold text-slate-900">
                  {formatEuro(calculation.buildingCoverage)}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200/70">
                <span className="text-slate-600">Vrijednost stvari kućanstva:</span>
                <span className="font-bold text-slate-900">
                  {formatEuro(calculation.contentsCoverage)}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium pt-1">
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>Zaštita od požara, oluje i tuče uključena automatski</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  required
                  placeholder="Vaše ime i prezime"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-amber-500"
                />
                <input
                  type="tel"
                  required
                  placeholder="Broj mobitela (091 234 5678)"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-base shadow-lg shadow-amber-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Zatraži službenu ponudu za dom</span>
                </button>
              </form>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-1 text-emerald-900">
                <p className="text-sm font-bold">Hvala Vam na upitu!</p>
                <p className="text-xs">Naš tim priprema ponudu i kontaktirat će Vas unutar 15 minuta.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCalculator;
