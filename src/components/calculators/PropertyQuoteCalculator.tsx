import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { PropertyQuoteParams } from '../../types/insurance';
import { calculatePropertyPremium } from '../../utils/ratingEngine';
import { Slider } from '../common/Slider';
import { QuoteSummaryCard } from './QuoteSummaryCard';
import { Home, Building, Waves, Activity, CheckCircle2, Shield } from 'lucide-react';

export interface PropertyQuoteCalculatorProps {
  initialArea?: number;
  initialEarthquake?: boolean;
  onBookAppointment?: () => void;
}

export const PropertyQuoteCalculator: React.FC<PropertyQuoteCalculatorProps> = ({
  initialArea = 85,
  initialEarthquake = true,
  onBookAppointment,
}) => {
  const { t } = useTranslation();

  const [areaM2, setAreaM2] = useState(initialArea);
  const [propertyType, setPropertyType] = useState<PropertyQuoteParams['propertyType']>('apartment');
  const [constructionYear, setConstructionYear] = useState(2005);
  const [includeContents, setIncludeContents] = useState(true);
  const [includeEarthquake, setIncludeEarthquake] = useState(initialEarthquake);
  const [includeFlood, setIncludeFlood] = useState(true);
  const [deductibleTier, setDeductibleTier] = useState<number>(0);

  const params: PropertyQuoteParams = useMemo(
    () => ({
      areaM2,
      propertyType,
      constructionYear,
      includeContents,
      includeEarthquake,
      includeFlood,
      deductibleTier,
    }),
    [
      areaM2,
      propertyType,
      constructionYear,
      includeContents,
      includeEarthquake,
      includeFlood,
      deductibleTier,
    ]
  );

  const estimate = useMemo(() => calculatePropertyPremium(params), [params]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* Configuration Controls (2 Cols) */}
      <div className="lg:col-span-2 bg-[#0a0d16]/90 rounded-3xl border border-white/[0.08] backdrop-blur-xl p-6 sm:p-8 shadow-2xl space-y-8 text-white">
        <div className="flex items-center gap-3 pb-4 border-b border-white/[0.08]">
          <div className="w-10 h-10 rounded-2xl bg-[#fb6504]/10 border border-[#fb6504]/20 text-[#fb6504] flex items-center justify-center font-black shadow-[0_0_15px_rgba(251,101,4,0.2)]">
            <Home className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-white">
              {t('calculators.property.title')}
            </h3>
            <p className="text-xs text-slate-400">
              Generali Dom Sigurnost: Zaštita kuće, stana i stvari od požara, oluje i potresa
            </p>
          </div>
        </div>

        {/* Property Type Radio Cards */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">
            {t('calculators.property.type')}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setPropertyType('apartment')}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                propertyType === 'apartment'
                  ? 'border-[#fb6504] bg-[#fb6504]/10 text-white font-bold shadow-[0_0_15px_rgba(251,101,4,0.2)]'
                  : 'border-white/[0.08] bg-white/[0.02] text-slate-400 hover:bg-white/[0.05] hover:text-white'
              }`}
            >
              <Building className="w-4 h-4 text-[#fb6504] mb-1.5" />
              <div className="text-xs font-bold">{t('calculators.property.apartment')}</div>
              <div className="text-[10px] text-slate-400">Etažno vlasništvo</div>
            </button>

            <button
              type="button"
              onClick={() => setPropertyType('house')}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                propertyType === 'house'
                  ? 'border-[#fb6504] bg-[#fb6504]/10 text-white font-bold shadow-[0_0_15px_rgba(251,101,4,0.2)]'
                  : 'border-white/[0.08] bg-white/[0.02] text-slate-400 hover:bg-white/[0.05] hover:text-white'
              }`}
            >
              <Home className="w-4 h-4 text-[#fb6504] mb-1.5" />
              <div className="text-xs font-bold">{t('calculators.property.house')}</div>
              <div className="text-[10px] text-slate-400">Samostojeći objekt (+20%)</div>
            </button>

            <button
              type="button"
              onClick={() => setPropertyType('holiday')}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                propertyType === 'holiday'
                  ? 'border-[#fb6504] bg-[#fb6504]/10 text-white font-bold shadow-[0_0_15px_rgba(251,101,4,0.2)]'
                  : 'border-white/[0.08] bg-white/[0.02] text-slate-400 hover:bg-white/[0.05] hover:text-white'
              }`}
            >
              <Shield className="w-4 h-4 text-[#fb6504] mb-1.5" />
              <div className="text-xs font-bold">{t('calculators.property.holiday')}</div>
              <div className="text-[10px] text-slate-400">Povremeni boravak (+35%)</div>
            </button>
          </div>
        </div>

        {/* Floor Area (m²) */}
        <div className="space-y-4">
          <Slider
            label={t('calculators.property.area')}
            min={20}
            max={350}
            step={5}
            value={areaM2}
            onChange={setAreaM2}
            formatValue={(v) => `${v} m²`}
            helperText="Ukupna neto stambena površina građevine"
          />
        </div>

        {/* Construction Year Slider */}
        <div className="space-y-4">
          <Slider
            label={t('calculators.property.constructionYear')}
            min={1930}
            max={2026}
            step={1}
            value={constructionYear}
            onChange={setConstructionYear}
            formatValue={(v) => `${v}. godina`}
            helperText={
              constructionYear < 1964
                ? 'Struktura prije 1964. (pojačani seizmički koeficijent)'
                : 'Protupotresna armirano-betonska gradnja'
            }
          />
        </div>

        {/* Riders and Deductibles */}
        <div className="space-y-3 pt-2 border-t border-white/[0.08]">
          <label className="text-xs font-semibold text-slate-300 block">
            Dopunska pokrića i zaštita od rizika
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className="flex items-start gap-2.5 p-3.5 rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={includeContents}
                onChange={(e) => setIncludeContents(e.target.checked)}
                className="mt-0.5 rounded accent-[#fb6504] w-4 h-4 cursor-pointer"
              />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white block">Stvari kućanstva</span>
                <span className="text-[10px] text-slate-400">Namještaj i tehnika</span>
              </div>
            </label>

            <label className="flex items-start gap-2.5 p-3.5 rounded-2xl border border-[#fb6504]/30 bg-[#fb6504]/10 hover:bg-[#fb6504]/15 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={includeEarthquake}
                onChange={(e) => setIncludeEarthquake(e.target.checked)}
                className="mt-0.5 rounded accent-[#fb6504] w-4 h-4 cursor-pointer"
              />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-[#ff7b1a] flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-[#fb6504]" />
                  <span>Rizik potresa</span>
                </span>
                <span className="text-[10px] text-slate-300">Seizmički rider</span>
              </div>
            </label>

            <label className="flex items-start gap-2.5 p-3.5 rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={includeFlood}
                onChange={(e) => setIncludeFlood(e.target.checked)}
                className="mt-0.5 rounded accent-[#fb6504] w-4 h-4 cursor-pointer"
              />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white flex items-center gap-1">
                  <Waves className="w-3.5 h-3.5 text-[#2dd4bf]" />
                  <span>Poplava i bujice</span>
                </span>
                <span className="text-[10px] text-slate-400">Izljev vode</span>
              </div>
            </label>
          </div>
        </div>

        {/* Deductible Tier */}
        <div className="space-y-2 pt-2 border-t border-white/[0.08]">
          <label className="text-xs font-semibold text-slate-300 block">
            Ugovorna franšiza (vlastiti udio u šteti za nižu premiju)
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[0, 250, 500].map((tier) => (
              <button
                key={tier}
                type="button"
                onClick={() => setDeductibleTier(tier)}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-colors font-mono ${
                  deductibleTier === tier
                    ? 'border-[#fb6504] bg-[#fb6504]/15 text-[#ff7b1a] shadow-[0_0_15px_rgba(251,101,4,0.2)]'
                    : 'border-white/[0.08] bg-white/[0.02] text-slate-400 hover:bg-white/[0.05] hover:text-white'
                }`}
              >
                {tier === 0 ? 'Bez franšize (0 €)' : `${tier} € franšiza`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Card (1 Col) */}
      <QuoteSummaryCard
        productType="property"
        inputs={params}
        estimate={estimate}
        onBookAppointment={onBookAppointment}
      />
    </div>
  );
};
