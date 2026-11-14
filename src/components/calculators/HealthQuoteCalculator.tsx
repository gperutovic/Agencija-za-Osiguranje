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
      <div className="lg:col-span-2 bg-[#0a0d16]/90 rounded-3xl border border-white/[0.08] backdrop-blur-xl p-6 sm:p-8 shadow-2xl space-y-8 text-white">
        <div className="flex items-center gap-3 pb-4 border-b border-white/[0.08]">
          <div className="w-10 h-10 rounded-2xl bg-[#fb6504]/10 border border-[#fb6504]/20 text-[#fb6504] flex items-center justify-center font-black shadow-[0_0_15px_rgba(251,101,4,0.2)]">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-white">
              {t('calculators.health.title')}
            </h3>
            <p className="text-xs text-slate-400">
              Generali Dopunsko & Dodatno Zdravstvo: Bez participacija i bez čekanja na preglede
            </p>
          </div>
        </div>

        {/* Tier Radio Cards */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-300 block">
            {t('calculators.health.package')}
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setPackageType('basic')}
              className={`p-5 rounded-3xl border text-left transition-all relative ${
                packageType === 'basic'
                  ? 'border-[#fb6504] bg-[#fb6504]/10 text-white font-bold shadow-[0_0_15px_rgba(251,101,4,0.2)]'
                  : 'border-white/[0.08] bg-white/[0.02] text-slate-400 hover:bg-white/[0.05] hover:text-white'
              }`}
            >
              <div className="text-sm font-bold text-white mb-1">
                Osnovno dopunsko zdravstvo
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                100% pokriće participacija u svim javnim bolnicama i domovima zdravlja.
              </p>
              <div className="text-xs font-mono font-bold text-[#fb6504]">11,67 € / mj.</div>
            </button>

            <button
              type="button"
              onClick={() => setPackageType('plus')}
              className={`p-5 rounded-3xl border text-left transition-all relative ${
                packageType === 'plus'
                  ? 'border-[#fb6504] bg-[#fb6504]/10 text-white font-bold shadow-[0_0_15px_rgba(251,101,4,0.2)]'
                  : 'border-white/[0.08] bg-white/[0.02] text-slate-400 hover:bg-white/[0.05] hover:text-white'
              }`}
            >
              <div className="absolute top-3 right-3 bg-gradient-to-r from-[#fb6504] to-[#ff7b1a] text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-full shadow-sm">
                Preporučeno
              </div>
              <div className="text-sm font-bold text-white mb-1">
                Plus paket (Dopunsko + Dodatno)
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                Uključeni specijalistički pregledi, magnetska rezonanca (MR/CT) i sistematski pregled.
              </p>
              <div className="text-xs font-mono font-bold text-[#ff7b1a]">23,33 € / mj.</div>
            </button>
          </div>
        </div>

        {/* Health Addons */}
        <div className="space-y-3 pt-2 border-t border-white/[0.08]">
          <label className="text-xs font-semibold text-slate-300 block">
            Dopunske pogodnosti i lijekovi
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex items-start gap-3 p-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={includeBListDrugs}
                onChange={(e) => setIncludeBListDrugs(e.target.checked)}
                className="mt-0.5 rounded accent-[#fb6504] w-4 h-4 cursor-pointer"
              />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Pill className="w-3.5 h-3.5 text-[#fb6504]" />
                  <span>Dopunsko pokriće B-liste lijekova</span>
                </span>
                <p className="text-[11px] text-slate-400">
                  Pokriva doplata za recepte i lijekove s dopunske liste HZZO-a
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={includePreventiveCheckup}
                onChange={(e) => setIncludePreventiveCheckup(e.target.checked)}
                className="mt-0.5 rounded accent-[#fb6504] w-4 h-4 cursor-pointer"
              />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <ShieldPlus className="w-3.5 h-3.5 text-[#2dd4bf]" />
                  <span>Godišnji sistematski pregled</span>
                </span>
                <p className="text-[11px] text-slate-400">
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
