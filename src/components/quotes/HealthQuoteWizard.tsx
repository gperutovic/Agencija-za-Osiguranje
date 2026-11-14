import React, { useState, useMemo } from 'react';
import { Heart, ArrowRight, ArrowLeft } from 'lucide-react';
import { calculateHealthPremium, formatEuro } from '../../lib/calculations';
import { Slider } from '../ui/Slider';
import { Button } from '../ui/Button';
import { ReactiveQuoteResult } from './ReactiveQuoteResult';

export const HealthQuoteWizard: React.FC = () => {
  const [step, setStep] = useState<1 | 2>(1);

  // Inputs
  const [planType, setPlanType] = useState<'dopunsko' | 'dodatno' | 'kombinirano'>('kombinirano');
  const [age, setAge] = useState(36);
  const [includeBListDrugs, setIncludeBListDrugs] = useState(true);
  const [diagnosticTier, setDiagnosticTier] = useState<'basic' | 'optimal' | 'premium'>('optimal');

  const estimate = useMemo(() => {
    return calculateHealthPremium({
      planType,
      age,
      includeBListDrugs,
      diagnosticTier,
    });
  }, [planType, age, includeBListDrugs, diagnosticTier]);

  return (
    <div className="space-y-6 text-left">
      {step === 1 ? (
        <div className="space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-xl font-bold text-slate-900">Dopunsko i dodatno zdravstveno osiguranje</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Pokriće participacija i pregledi u ugovornim privatnim poliklinikama bez listi čekanja.
            </p>
          </div>

          {/* Plan Type Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Vrsta zdravstvenog pokrića</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { id: 'dopunsko' as const, label: 'Samo Dopunsko', desc: 'Participacije HZZO-a' },
                { id: 'kombinirano' as const, label: 'Kombinirani Paket', desc: 'Dopunsko + Poliklinike' },
                { id: 'dodatno' as const, label: 'Dodatno (Pregledi)', desc: 'Sistematski + Specijalisti' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setPlanType(t.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    planType === t.id
                      ? 'border-[#0F2942] bg-[#0F2942]/5 text-[#0F2942] font-semibold ring-1 ring-[#0F2942]'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                  }`}
                >
                  <p className="text-xs font-semibold">{t.label}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-5">
            <Slider
              label="Dob osiguranika (godine)"
              value={age}
              min={18}
              max={80}
              step={1}
              unit="god."
              onChange={setAge}
            />

            {/* If includes dodatno: show diagnostic tiers */}
            {(planType === 'dodatno' || planType === 'kombinirano') && (
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <label className="block text-xs font-semibold text-slate-700">
                  Paket dijagnostike i pregleda u privatnim poliklinikama
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  {[
                    { id: 'basic' as const, name: 'Osnovni', desc: 'Sistematski + 250 € pregleda' },
                    { id: 'optimal' as const, name: 'Optimal (Preporučeno)', desc: 'MR, CT, ultrazvuk, laboratorij' },
                    { id: 'premium' as const, name: 'Prošireni Plus', desc: 'Šire specijalističke obrade + fizikalna' },
                  ].map((tier) => (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setDiagnosticTier(tier.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        diagnosticTier === tier.id
                          ? 'border-[#0F2942] bg-white text-[#0F2942] font-semibold ring-1 ring-[#0F2942]'
                          : 'border-slate-200 bg-white/80 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <p className="font-bold text-slate-900">{tier.name}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{tier.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* B-List Drugs Toggle */}
            {(planType === 'dopunsko' || planType === 'kombinirano') && (
              <label className="flex items-start gap-2.5 p-3 rounded-xl border bg-white border-slate-200 cursor-pointer hover:border-slate-300">
                <input
                  type="checkbox"
                  checked={includeBListDrugs}
                  onChange={(e) => setIncludeBListDrugs(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded accent-[#0F2942]"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Uključi dopunsku listu lijekova (B-lista)
                  </span>
                  <span className="text-[11px] text-slate-500 tabular-nums">
                    Pokriva doplatu za lijekove s dopunske liste koje propisuje liječnik opće prakse (+2,50 €/mj.)
                  </span>
                </div>
              </label>
            )}
          </div>

          {/* Real-time Summary Card */}
          <div className="p-4 bg-[#0F2942]/5 border border-[#0F2942]/20 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0F2942] text-white flex items-center justify-center shrink-0">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">{estimate.planName}</p>
                <p className="text-xs text-slate-600 tabular-nums">
                  Mjesečno: <strong className="text-slate-900">{formatEuro(estimate.monthlyPremium)}</strong> ({formatEuro(estimate.annualPremium)} god.)
                </p>
              </div>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setStep(2)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="font-semibold text-xs shrink-0"
            >
              Usporedi osiguratelje
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Usporedba zdravstvenih paketa</h3>
              <p className="text-xs text-slate-500 tabular-nums">
                {estimate.planName} &bull; Dob: {age} god.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setStep(1)}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Izmijeni parametre
            </Button>
          </div>

          <ReactiveQuoteResult
            baseAnnualPrice={estimate.annualPremium}
            productName={estimate.planName}
            category="health"
            inputsSummary={{ planType, age, includeBListDrugs, diagnosticTier }}
          />
        </div>
      )}
    </div>
  );
};
