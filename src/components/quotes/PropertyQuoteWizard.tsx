import React, { useState, useMemo } from 'react';
import { Home, ShieldCheck, ArrowRight, ArrowLeft, Building2, Flame, Droplets, Activity } from 'lucide-react';
import { calculatePropertyPremium, formatEuro } from '../../lib/calculations';
import { Slider } from '../common/Slider';
import { Button } from '../common/Button';
import { ReactiveQuoteResult } from './ReactiveQuoteResult';

export const PropertyQuoteWizard: React.FC = () => {
  const [step, setStep] = useState<1 | 2>(1);

  // Inputs
  const [propertyType, setPropertyType] = useState<'stan' | 'kuca' | 'vikendica'>('stan');
  const [squareMeters, setSquareMeters] = useState(75);
  const [includeEarthquake, setIncludeEarthquake] = useState(true);
  const [includeWaterLeak, setIncludeWaterLeak] = useState(true);
  const [includeContents, setIncludeContents] = useState(true);
  const [cityLocation, setCityLocation] = useState('Zagreb');

  const estimate = useMemo(() => {
    return calculatePropertyPremium({
      propertyType,
      squareMeters,
      includeEarthquake,
      includeWaterLeak,
      includeContents,
    });
  }, [propertyType, squareMeters, includeEarthquake, includeWaterLeak, includeContents]);

  const m2Ticks = [
    { value: 35, label: '35 m²' },
    { value: 65, label: '65 m²' },
    { value: 100, label: '100 m²' },
    { value: 150, label: '150 m²' },
    { value: 250, label: '250 m²' },
  ];

  return (
    <div className="space-y-6 text-left">
      {step === 1 ? (
        <div className="space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-xl font-black text-slate-900">Osiguranje Doma, Zgrade i Kućanstva</h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Izračunajte potpunu zaštitu od potresa, požara, izljeva vode i provalne krađe.
            </p>
          </div>

          {/* Property Type Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Vrsta nekretnine</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'stan' as const, label: 'Stan u zgradi', desc: '0,42 €/m² osnovno' },
                { id: 'kuca' as const, label: 'Obiteljska kuća', desc: '0,56 €/m² osnovno' },
                { id: 'vikendica' as const, label: 'Vikendica / Apartman', desc: 'Sezonsko korištenje' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setPropertyType(t.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    propertyType === t.id
                      ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-bold shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                  }`}
                >
                  <p className="text-xs">{t.label}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Sliders and Location */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-5">
            <Slider
              label="Kvadratura stambenog prostora (m²)"
              value={squareMeters}
              min={20}
              max={300}
              step={5}
              unit="m²"
              onChange={setSquareMeters}
              ticks={m2Ticks}
            />

            {/* Coverage Riders Checkbox Toggles */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <span className="text-xs font-semibold text-slate-700 block">
                Uključeni paketi rizika (preporučeno):
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className="flex items-start gap-2.5 p-3 rounded-xl border bg-white border-slate-200 cursor-pointer hover:border-slate-300">
                  <input
                    type="checkbox"
                    checked={includeEarthquake}
                    onChange={(e) => setIncludeEarthquake(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-0"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Rizik od potresa</span>
                    <span className="text-[10px] text-slate-500 font-mono">Građevina + stvari (+25%)</span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 p-3 rounded-xl border bg-white border-slate-200 cursor-pointer hover:border-slate-300">
                  <input
                    type="checkbox"
                    checked={includeWaterLeak}
                    onChange={(e) => setIncludeWaterLeak(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-0"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Izljev vode iz cijevi</span>
                    <span className="text-[10px] text-slate-500 font-mono">Puknuće instalacija (+24 €)</span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 p-3 rounded-xl border bg-white border-slate-200 cursor-pointer hover:border-slate-300">
                  <input
                    type="checkbox"
                    checked={includeContents}
                    onChange={(e) => setIncludeContents(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-0"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Stvari kućanstva</span>
                    <span className="text-[10px] text-slate-500 font-mono">Namještaj, tehnika, odjeća</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Quick Summary Card */}
          <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                <Home className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">
                  {squareMeters} m² &bull; {propertyType === 'stan' ? 'Stan' : propertyType === 'kuca' ? 'Kuća' : 'Vikendica'}
                </p>
                <p className="text-[11px] text-slate-600">
                  Premija: <strong>{formatEuro(estimate.annualPremium)}</strong> godišnje (ili {formatEuro(estimate.monthlyPremium)}/mj.)
                </p>
              </div>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => setStep(2)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="font-bold text-xs"
            >
              Usporedi osiguratelje
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-xl font-black text-slate-900">Usporedba ponuda za dom i potres</h3>
              <p className="text-xs text-slate-500 font-mono">
                {squareMeters} m² &bull; {propertyType.toUpperCase()}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStep(1)}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Izmijeni parametre
            </Button>
          </div>

          <ReactiveQuoteResult
            baseAnnualPrice={estimate.annualPremium}
            productName={`Osiguranje Doma (${squareMeters} m² - ${propertyType})`}
            category="property"
            inputsSummary={{ squareMeters, propertyType, includeEarthquake, includeWaterLeak, includeContents }}
          />
        </div>
      )}
    </div>
  );
};
