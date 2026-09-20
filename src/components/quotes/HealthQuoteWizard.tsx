import React, { useState, useMemo } from 'react';
import { Heart, Activity, ShieldCheck, ArrowRight, ArrowLeft, CheckCircle2, Sparkles, User } from 'lucide-react';
import { calculateHealthPremium, formatEuro } from '../../lib/calculations';
import { Slider } from '../common/Slider';
import { Button } from '../common/Button';
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
            <h3 className="text-xl font-black text-slate-900">Dopunsko i Dodatno Zdravstveno Osiguranje</h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Zaobiđite liste čekanja i osigurajte preglede u najboljim privatnim poliklinikama u roku 48h.
            </p>
          </div>

          {/* Plan Type Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Vrsta zdravstvenog pokrića</label>
            <div className="grid grid-cols-3 gap-2">
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
                      ? 'border-rose-600 bg-rose-50/70 text-rose-900 font-bold shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                  }`}
                >
                  <p className="text-xs">{t.label}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">{t.desc}</p>
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
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {[
                    { id: 'basic' as const, name: 'Osnovni', desc: 'Sistematski + 250 € pregleda' },
                    { id: 'optimal' as const, name: 'Optimal (Preporučeno)', desc: 'MR, CT, ultrazvuk, laboratorij' },
                    { id: 'premium' as const, name: 'VIP Premium', desc: 'Neograničeno + fizikalna terapija' },
                  ].map((tier) => (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setDiagnosticTier(tier.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        diagnosticTier === tier.id
                          ? 'border-rose-600 bg-white text-rose-900 font-bold shadow-sm ring-1 ring-rose-500'
                          : 'border-slate-200 bg-white/60 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <p className="font-bold">{tier.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">{tier.desc}</p>
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
                  className="mt-0.5 w-4 h-4 rounded text-rose-600 focus:ring-0"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Uključi dopunsku listu lijekova (B-lista)
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Pokriva doplati dio cijene lijekova koje propisuje liječnik opće prakse (+2,50 €/mj.)
                  </span>
                </div>
              </label>
            )}
          </div>

          {/* Real-time Summary Card */}
          <div className="p-4 bg-rose-50/80 border border-rose-200 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">{estimate.planName}</p>
                <p className="text-[11px] text-slate-600 font-mono">
                  Mjesečno: <strong>{formatEuro(estimate.monthlyPremium)}</strong> ({formatEuro(estimate.annualPremium)} god.)
                </p>
              </div>
            </div>

            <Button
              variant="danger"
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
              <h3 className="text-xl font-black text-slate-900">Usporedba zdravstvenih paketa</h3>
              <p className="text-xs text-slate-500 font-mono">
                {estimate.planName} &bull; Dob: {age} god.
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
            productName={estimate.planName}
            category="health"
            inputsSummary={{ planType, age, includeBListDrugs, diagnosticTier }}
          />
        </div>
      )}
    </div>
  );
};
