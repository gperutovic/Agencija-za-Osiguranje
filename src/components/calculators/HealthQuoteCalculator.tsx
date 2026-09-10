import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { HealthQuoteParams } from '../../types/insurance';
import { calculateHealthPremium } from '../../utils/ratingEngine';
import { QuoteSummaryCard } from './QuoteSummaryCard';
import { Stethoscope, CheckCircle2, ShieldPlus, Pill, Sparkles } from 'lucide-react';

export interface HealthQuoteCalculatorProps {
  initialPackage?: 'basic' | 'plus';
  onBookAppointment?: () => void;
}

export const HealthQuoteCalculator: React.FC<HealthQuoteCalculatorProps> = ({
  initialPackage = 'plus',
  onBookAppointment,
}) => {
  const { t } = useTranslation();

  const [packageType, setPackageType] = useState<HealthQuoteParams['packageType']>(initialPackage);
  const [includePreventiveCheckup, setIncludePreventiveCheckup] = useState(true);
  const [includeBListDrugs, setIncludeBListDrugs] = useState(true);

  const params: HealthQuoteParams = useMemo(
    () => ({
      packageType,
      includePreventiveCheckup,
      includeBListDrugs,
    }),
    [packageType, includePreventiveCheckup, includeBListDrugs]
  );

  const estimate = useMemo(() => calculateHealthPremium(params), [params]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* Configuration Controls (2 Cols) */}
      <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card space-y-8">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-black shadow-2xs">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              {t('calculators.health.title')}
            </h3>
            <p className="text-xs text-slate-500">
              Generali Dopunsko & Dodatno Zdravstvo: Bez participacija i bez čekanja na preglede
            </p>
          </div>
        </div>

        {/* Tier Radio Cards */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-700 block">
            {t('calculators.health.package')}
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setPackageType('basic')}
              className={`p-5 rounded-3xl border text-left transition-all relative ${
                packageType === 'basic'
                  ? 'border-teal-600 bg-teal-50/70 text-teal-950 font-bold shadow-2xs'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="text-sm font-bold text-slate-900 mb-1">
                Osnovno dopunsko zdravstvo
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">
                100% pokriće participacija u svim javnim bolnicama i domovima zdravlja.
              </p>
              <div className="text-xs font-mono font-bold text-teal-700">11,67 € / mj.</div>
            </button>

            <button
              type="button"
              onClick={() => setPackageType('plus')}
              className={`p-5 rounded-3xl border text-left transition-all relative ${
                packageType === 'plus'
                  ? 'border-teal-600 bg-teal-50/70 text-teal-950 font-bold shadow-2xs'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="absolute top-3 right-3 bg-teal-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                Preporučeno
              </div>
              <div className="text-sm font-bold text-slate-900 mb-1">
                Plus paket (Dopunsko + Dodatno)
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">
                Uključeni specijalistički pregledi, magnetska rezonanca (MR/CT) i sistematski pregled.
              </p>
              <div className="text-xs font-mono font-bold text-teal-700">23,33 € / mj.</div>
            </button>
          </div>
        </div>

        {/* Health Addons */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <label className="text-xs font-semibold text-slate-700 block">
            Dopunske pogodnosti i lijekovi
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex items-start gap-3 p-4 rounded-2xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={includeBListDrugs}
                onChange={(e) => setIncludeBListDrugs(e.target.checked)}
                className="mt-0.5 rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
              />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Pill className="w-3.5 h-3.5 text-teal-600" />
                  <span>Dopunsko pokriće B-liste lijekova</span>
                </span>
                <p className="text-[11px] text-slate-500">
                  Pokriva doplata za recepte i lijekove s dopunske liste HZZO-a
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-4 rounded-2xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={includePreventiveCheckup}
                onChange={(e) => setIncludePreventiveCheckup(e.target.checked)}
                className="mt-0.5 rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
              />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <ShieldPlus className="w-3.5 h-3.5 text-teal-600" />
                  <span>Godišnji sistematski pregled</span>
                </span>
                <p className="text-[11px] text-slate-500">
                  Uključeni laboratorij, EKG, UZV abdomena i internist
                </p>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Summary Card (1 Col) */}
      <QuoteSummaryCard
        productType="health"
        inputs={params}
        estimate={estimate}
        onBookAppointment={onBookAppointment}
      />
    </div>
  );
};
