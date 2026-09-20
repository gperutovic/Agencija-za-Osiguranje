import React, { useState, useMemo } from 'react';
import { Plane, Compass, ShieldCheck, ArrowRight, ArrowLeft, Users, Calendar, Activity } from 'lucide-react';
import { calculateTravelPremium, formatEuro } from '../../lib/calculations';
import { Slider } from '../common/Slider';
import { Button } from '../common/Button';
import { ReactiveQuoteResult } from './ReactiveQuoteResult';

export const TravelQuoteWizard: React.FC = () => {
  const [step, setStep] = useState<1 | 2>(1);

  // Inputs
  const [destination, setDestination] = useState<'europe' | 'world' | 'usa_canada'>('europe');
  const [days, setDays] = useState(7);
  const [numberOfPersons, setNumberOfPersons] = useState(2);
  const [includeSports, setIncludeSports] = useState(false);
  const [includeBaggage, setIncludeBaggage] = useState(true);
  const [includeCancellation, setIncludeCancellation] = useState(false);

  const estimate = useMemo(() => {
    return calculateTravelPremium({
      destination,
      days,
      numberOfPersons,
      includeSports,
      includeBaggage,
      includeCancellation,
    });
  }, [destination, days, numberOfPersons, includeSports, includeBaggage, includeCancellation]);

  return (
    <div className="space-y-6 text-left">
      {step === 1 ? (
        <div className="space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-xl font-black text-slate-900">Putno Zdravstveno Osiguranje za Inozemstvo</h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Pokriće hitnih medicinskih troškova, bolničkog liječenja i repatrijacije do 100.000 €.
            </p>
          </div>

          {/* Destination Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Područje putovanja</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'europe' as const, label: 'Europa i Mediteran', desc: 'Pokriće do 30.000 €' },
                { id: 'world' as const, label: 'Cijeli Svijet', desc: 'Pokriće do 50.000 €' },
                { id: 'usa_canada' as const, label: 'SAD, Kanada, Japan', desc: 'Pokriće do 100.000 €' },
              ].map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDestination(d.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    destination === d.id
                      ? 'border-amber-600 bg-amber-50/70 text-amber-950 font-bold shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                  }`}
                >
                  <p className="text-xs">{d.label}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">{d.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-5">
            <Slider
              label="Trajanje putovanja (dani)"
              value={days}
              min={3}
              max={60}
              step={1}
              unit="dana"
              onChange={setDays}
            />

            <Slider
              label="Broj putnika"
              value={numberOfPersons}
              min={1}
              max={6}
              step={1}
              unit="osoba"
              onChange={setNumberOfPersons}
            />

            {/* Riders Checkbox Toggles */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <span className="text-xs font-semibold text-slate-700 block">Dodatna pokrića za putnike:</span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className="flex items-start gap-2.5 p-3 rounded-xl border bg-white border-slate-200 cursor-pointer hover:border-slate-300">
                  <input
                    type="checkbox"
                    checked={includeSports}
                    onChange={(e) => setIncludeSports(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-amber-600 focus:ring-0"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Skijanje i sport</span>
                    <span className="text-[10px] text-slate-500 font-mono">Rekreativni zimski sportovi</span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 p-3 rounded-xl border bg-white border-slate-200 cursor-pointer hover:border-slate-300">
                  <input
                    type="checkbox"
                    checked={includeBaggage}
                    onChange={(e) => setIncludeBaggage(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-amber-600 focus:ring-0"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Gubitak prtljage</span>
                    <span className="text-[10px] text-slate-500 font-mono">Krađa i kašnjenje torbe</span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 p-3 rounded-xl border bg-white border-slate-200 cursor-pointer hover:border-slate-300">
                  <input
                    type="checkbox"
                    checked={includeCancellation}
                    onChange={(e) => setIncludeCancellation(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-amber-600 focus:ring-0"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Otkaz putovanja</span>
                    <span className="text-[10px] text-slate-500 font-mono">Povrat troškova u slučaju bolesti</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Real-time Summary Card */}
          <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center">
                <Plane className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">
                  {days} dana &bull; {numberOfPersons} {numberOfPersons === 1 ? 'osoba' : 'osobe'} &bull; Limit: {formatEuro(estimate.medicalLimit)}
                </p>
                <p className="text-[11px] text-slate-600 font-mono">
                  Ukupno za sve putnike: <strong>{formatEuro(estimate.totalPremium)}</strong> ({formatEuro(estimate.perPersonCost)} po osobi)
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
              Ugovori policu
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-xl font-black text-slate-900">Usporedba putnog osiguranja</h3>
              <p className="text-xs text-slate-500 font-mono">
                {days} dana &bull; {destination.toUpperCase()}
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
            baseAnnualPrice={estimate.totalPremium}
            productName={`Putno Zdravstveno Osiguranje (${days} dana - ${numberOfPersons} putnika)`}
            category="travel"
            inputsSummary={{ destination, days, numberOfPersons, includeSports, includeBaggage }}
          />
        </div>
      )}
    </div>
  );
};
