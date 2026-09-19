import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { LifeQuoteParams } from '../../types/insurance';
import { calculateLifePremium } from '../../utils/ratingEngine';
import { Slider } from '../common/Slider';
import { QuoteSummaryCard } from './QuoteSummaryCard';
import { Heart, HeartPulse, Shield, AlertCircle, Sparkles } from 'lucide-react';

export interface LifeQuoteCalculatorProps {
  initialAge?: number;
  initialSum?: number;
  onBookAppointment?: () => void;
}

export const LifeQuoteCalculator: React.FC<LifeQuoteCalculatorProps> = ({
  initialAge = 35,
  initialSum = 50000,
  onBookAppointment,
}) => {
  const { t } = useTranslation();

  const [age, setAge] = useState(initialAge);
  const [durationYears, setDurationYears] = useState(20);
  const [sumInsured, setSumInsured] = useState(initialSum);
  const [isSmoker, setIsSmoker] = useState(false);
  const [includeCriticalIllness, setIncludeCriticalIllness] = useState(true);

  const params: LifeQuoteParams = useMemo(
    () => ({
      age,
      durationYears,
      sumInsured,
      isSmoker,
      includeCriticalIllness,
    }),
    [age, durationYears, sumInsured, isSmoker, includeCriticalIllness]
  );

  const estimate = useMemo(() => calculateLifePremium(params), [params]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* Configuration Controls (2 Cols) */}
      <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-bento p-6 sm:p-8 space-y-8 text-slate-900 dark:text-white">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-teal-600 dark:text-teal-400 flex items-center justify-center font-black shadow-sm">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              {t('calculators.life.title')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Životno osiguranje ŽIVOT+: Financijska zaštita obitelji i kapitalizirana štednja
            </p>
          </div>
        </div>

        {/* Sum Insured (€) */}
        <div className="space-y-4">
          <Slider
            label={t('calculators.life.sum')}
            min={10000}
            max={200000}
            step={5000}
            value={sumInsured}
            onChange={setSumInsured}
            formatValue={(v) => `${v.toLocaleString('hr-HR')} €`}
            helperText="Zajamčena isplata u slučaju doživljenja ili obiteljske zaštite"
          />
        </div>

        {/* Age and Duration Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Slider
            label={t('calculators.life.age')}
            min={18}
            max={65}
            step={1}
            value={age}
            onChange={setAge}
            formatValue={(v) => `${v} god.`}
          />

          <Slider
            label={t('calculators.life.duration')}
            min={5}
            max={30}
            step={1}
            value={durationYears}
            onChange={setDurationYears}
            formatValue={(v) => `${v} god.`}
            helperText="Trajanje od 20+ godina ostvaruje 8% bonusa na premiju"
          />
        </div>

        {/* Smoker and Critical Illness Grid */}
        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
            Zdravstveni status i dopunska pokrića
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setIsSmoker(!isSmoker)}
              className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                isSmoker
                  ? 'border-amber-500 bg-amber-50/80 dark:bg-amber-950/30 text-slate-900 dark:text-white font-bold shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                isSmoker 
                  ? 'border-amber-500 bg-amber-500 text-white' 
                  : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800'
              }`}>
                {isSmoker && <span className="text-xs font-bold text-white">✓</span>}
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-900 dark:text-white">Pušač (cigarete / duhan)</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">+40% doplata za povišeni rizik</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setIncludeCriticalIllness(!includeCriticalIllness)}
              className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                includeCriticalIllness
                  ? 'border-teal-600 bg-teal-50/80 dark:bg-teal-950/30 text-slate-900 dark:text-white font-bold shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                includeCriticalIllness 
                  ? 'border-teal-600 bg-teal-600 text-white' 
                  : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800'
              }`}>
                {includeCriticalIllness && (
                  <span className="text-xs font-bold text-white">✓</span>
                )}
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-900 dark:text-white">Pokriće 25 teških bolesti</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Maligne bolesti, infarkt, moždani udar</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Card (1 Col) */}
      <QuoteSummaryCard
        productType="life"
        inputs={params}
        estimate={estimate}
        onBookAppointment={onBookAppointment}
      />
    </div>
  );
};
