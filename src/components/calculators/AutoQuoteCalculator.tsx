import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { AutoQuoteParams } from '../../types/insurance';
import { calculateAutoPremium } from '../../utils/ratingEngine';
import { Slider } from '../common/Slider';
import { QuoteSummaryCard } from './QuoteSummaryCard';
import { Car, Shield, Wrench, ShieldCheck, Zap, Sparkles } from 'lucide-react';

export interface AutoQuoteCalculatorProps {
  initialKw?: number;
  initialBonus?: number;
  onBookAppointment?: () => void;
}

export const AutoQuoteCalculator: React.FC<AutoQuoteCalculatorProps> = ({
  initialKw = 75,
  initialBonus = 50,
  onBookAppointment,
}) => {
  const { t } = useTranslation();

  const [kwPower, setKwPower] = useState(initialKw);
  const [vehicleAge, setVehicleAge] = useState(4);
  const [bonusPercentage, setBonusPercentage] = useState(initialBonus);
  const [usageType, setUsageType] = useState<'private' | 'commercial'>('private');
  const [includeKasko, setIncludeKasko] = useState(true);
  const [includeAssistance, setIncludeAssistance] = useState(true);
  const [includeGlass, setIncludeGlass] = useState(true);
  const [includeBonusProtection, setIncludeBonusProtection] = useState(true);

  const params: AutoQuoteParams = useMemo(
    () => ({
      kwPower,
      vehicleAge,
      bonusPercentage,
      usageType,
      includeKasko,
      includeAssistance,
      includeGlass,
      includeBonusProtection,
    }),
    [
      kwPower,
      vehicleAge,
      bonusPercentage,
      usageType,
      includeKasko,
      includeAssistance,
      includeGlass,
      includeBonusProtection,
    ]
  );

  const estimate = useMemo(() => calculateAutoPremium(params), [params]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* Configuration Controls (2 Cols) */}
      <div className="lg:col-span-2 bg-[#0a0d16]/90 rounded-3xl border border-white/[0.08] backdrop-blur-xl p-6 sm:p-8 shadow-2xl space-y-8 text-white">
        <div className="flex items-center gap-3 pb-4 border-b border-white/[0.08]">
          <div className="w-10 h-10 rounded-2xl bg-[#fb6504]/10 border border-[#fb6504]/20 text-[#fb6504] flex items-center justify-center font-black shadow-[0_0_15px_rgba(251,101,4,0.2)]">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-white">
              {t('calculators.auto.title')}
            </h3>
            <p className="text-xs text-slate-400">
              Obvezno auto osiguranje (AO) i kasko pokrića s Generali asistencijom
            </p>
          </div>
        </div>

        {/* Engine Power (kW) */}
        <div className="space-y-4">
          <Slider
            label={t('calculators.auto.power')}
            min={25}
            max={250}
            step={5}
            value={kwPower}
            onChange={setKwPower}
            formatValue={(v) => `${v} kW (~${Math.round(v * 1.36)} KS)`}
            helperText="Kategorija tarife prema snazi u prometnoj dozvoli"
          />
        </div>

        {/* Vehicle Age & Bonus Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <Slider
            label={t('calculators.auto.vehicleAge')}
            min={0}
            max={20}
            step={1}
            value={vehicleAge}
            onChange={setVehicleAge}
            formatValue={(v) => (v === 0 ? 'Novo vozilo' : `${v} god.`)}
          />

          <Slider
            label={t('calculators.auto.bonus')}
            min={0}
            max={50}
            step={5}
            value={bonusPercentage}
            onChange={setBonusPercentage}
            formatValue={(v) => `-${v}% popusta`}
            helperText="Maksimalni bonus u RH iznosi 50%"
          />
        </div>

        {/* Vehicle Usage */}
        <div className="space-y-2 pt-2 border-t border-white/[0.08]">
          <label className="text-xs font-semibold text-slate-300">
            {t('calculators.auto.usage')}
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setUsageType('private')}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                usageType === 'private'
                  ? 'border-[#fb6504] bg-[#fb6504]/10 text-white font-bold shadow-[0_0_15px_rgba(251,101,4,0.2)]'
                  : 'border-white/[0.08] bg-white/[0.02] text-slate-400 hover:bg-white/[0.05] hover:text-white'
              }`}
            >
              <div className="text-xs font-bold">{t('calculators.auto.private')}</div>
              <div className="text-[10px] text-slate-400">Osobne i obiteljske potrebe</div>
            </button>

            <button
              type="button"
              onClick={() => setUsageType('commercial')}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                usageType === 'commercial'
                  ? 'border-[#fb6504] bg-[#fb6504]/10 text-white font-bold shadow-[0_0_15px_rgba(251,101,4,0.2)]'
                  : 'border-white/[0.08] bg-white/[0.02] text-slate-400 hover:bg-white/[0.05] hover:text-white'
              }`}
            >
              <div className="text-xs font-bold">{t('calculators.auto.commercial')}</div>
              <div className="text-[10px] text-slate-400">Tvrtke, obrti, rent-a-car (+25%)</div>
            </button>
          </div>
        </div>

        {/* Addons Selection Toggles */}
        <div className="space-y-3 pt-2 border-t border-white/[0.08]">
          <label className="text-xs font-semibold text-slate-300 block">
            {t('calculators.auto.addons')}
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={includeKasko}
                onChange={(e) => setIncludeKasko(e.target.checked)}
                className="mt-0.5 rounded accent-[#fb6504] w-4 h-4 cursor-pointer"
              />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-[#fb6504]" />
                  <span>Puni Kasko</span>
                </span>
                <p className="text-[11px] text-slate-400">Štete, krađa, tuča i sudar</p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={includeAssistance}
                onChange={(e) => setIncludeAssistance(e.target.checked)}
                className="mt-0.5 rounded accent-[#fb6504] w-4 h-4 cursor-pointer"
              />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-[#2dd4bf]" />
                  <span>24/7 Asistencija na cesti</span>
                </span>
                <p className="text-[11px] text-slate-400">Besplatan popravak i vuča u EU</p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={includeGlass}
                onChange={(e) => setIncludeGlass(e.target.checked)}
                className="mt-0.5 rounded accent-[#fb6504] w-4 h-4 cursor-pointer"
              />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#fb6504]" />
                  <span>Zaštita stakala</span>
                </span>
                <p className="text-[11px] text-slate-400">Zamjena vjetrobranskog stakla</p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={includeBonusProtection}
                onChange={(e) => setIncludeBonusProtection(e.target.checked)}
                className="mt-0.5 rounded accent-[#fb6504] w-4 h-4 cursor-pointer"
              />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#2dd4bf]" />
                  <span>Zaštita bonusa</span>
                </span>
                <p className="text-[11px] text-slate-400">Prva štetna nezgoda bez pada razreda</p>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Summary Card (1 Col) */}
      <QuoteSummaryCard
        productType="auto"
        inputs={params}
        estimate={estimate}
        onBookAppointment={onBookAppointment}
      />
    </div>
  );
};
