import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { HealthQuoteParams } from '../../types/insurance';
import { calculateHealthPremium } from '../../utils/ratingEngine';
import { QuoteSummaryCard } from './QuoteSummaryCard';
import { Stethoscope, ShieldPlus, Pill } from 'lucide-react';

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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      {/* Configuration Controls (2 Cols) */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-7 text-slate-900">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-[#0F2942]/5 border border-[#0F2942]/15 text-[#0F2942] flex items-center justify-center shrink-0">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              {t('calculators.health.title')}
            </h3>
            <p className="text-xs text-slate-500">
              Generali Dopunsko &amp; Dodatno Zdravstvo: bez participacija i bez čekanja na preglede
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
              className={`p-5 rounded-xl border text-left transition-all relative ${
                packageType === 'basic'
                  ? 'border-[#0F2942] bg-[#0F2942]/5 text-slate-900 ring-1 ring-[#0F2942]'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="text-sm font-bold text-slate-900 mb-1">
                Osnovno dopunsko zdravstvo
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                100% pokriće participacija u svim javnim bolnicama i domovima zdravlja.
              </p>
              <div className="text-xs font-semibold tabular-nums text-[#0F2942]">11,67 € / mj.</div>
            </button>

            <button
              type="button"
              onClick={() => setPackageType('plus')}
              className={`p-5 rounded-xl border text-left transition-all relative ${
                packageType === 'plus'
                  ? 'border-[#0F2942] bg-[#0F2942]/5 text-slate-900 ring-1 ring-[#0F2942]'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="inline-block mb-2 bg-[#0F2942] text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
                Preporučeno
              </div>
              <div className="text-sm font-bold text-slate-900 mb-1">
                Plus paket (Dopunsko + Dodatno)
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Uključeni specijalistički pregledi, magnetska rezonanca (MR/CT) i sistematski pregled.
              </p>
              <div className="text-xs font-semibold tabular-nums text-[#0F2942]">23,33 € / mj.</div>
            </button>
          </div>
        </div>

        {/* Health Addons */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <label className="text-xs font-semibold text-slate-700 block">
            Dopunske pogodnosti i lijekovi
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={includeBListDrugs}
                onChange={(e) => setIncludeBListDrugs(e.target.checked)}
                className="mt-0.5 rounded accent-[#0F2942] w-4 h-4 cursor-pointer"
              />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Pill className="w-3.5 h-3.5 text-[#0F2942]" />
                  <span>Dopunsko pokriće B-liste lijekova</span>
                </span>
                <p className="text-[11px] text-slate-500">
                  Pokriva doplatu za recepte i lijekove s dopunske liste HZZO-a
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={includePreventiveCheckup}
                onChange={(e) => setIncludePreventiveCheckup(e.target.checked)}
                className="mt-0.5 rounded accent-[#0F2942] w-4 h-4 cursor-pointer"
              />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <ShieldPlus className="w-3.5 h-3.5 text-[#0F2942]" />
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
