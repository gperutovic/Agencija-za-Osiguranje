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
      <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card space-y-8">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-black shadow-2xs">
            <Home className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              {t('calculators.property.title')}
            </h3>
            <p className="text-xs text-slate-500">
              Generali Dom Sigurnost: Zaštita kuće, stana i stvari od požara, oluje i potresa
            </p>
          </div>
        </div>

        {/* Property Type Radio Cards */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700">
            {t('calculators.property.type')}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setPropertyType('apartment')}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                propertyType === 'apartment'
                  ? 'border-teal-600 bg-teal-50/70 text-teal-950 font-bold shadow-2xs'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Building className="w-4 h-4 text-teal-600 mb-1.5" />
              <div className="text-xs font-bold">{t('calculators.property.apartment')}</div>
              <div className="text-[10px] text-slate-400">Etažno vlasništvo</div>
            </button>

            <button
              type="button"
              onClick={() => setPropertyType('house')}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                propertyType === 'house'
                  ? 'border-teal-600 bg-teal-50/70 text-teal-950 font-bold shadow-2xs'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Home className="w-4 h-4 text-teal-600 mb-1.5" />
              <div className="text-xs font-bold">{t('calculators.property.house')}</div>
              <div className="text-[10px] text-slate-400">Samostojeći objekt (+20%)</div>
            </button>

            <button
              type="button"
              onClick={() => setPropertyType('holiday')}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                propertyType === 'holiday'
                  ? 'border-teal-600 bg-teal-50/70 text-teal-950 font-bold shadow-2xs'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Shield className="w-4 h-4 text-teal-600 mb-1.5" />
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
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <label className="text-xs font-semibold text-slate-700 block">
            Dopunska pokrića i zaštita od rizika
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className="flex items-start gap-2.5 p-3.5 rounded-2xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={includeContents}
                onChange={(e) => setIncludeContents(e.target.checked)}
                className="mt-0.5 rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
              />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-900 block">Stvari kućanstva</span>
                <span className="text-[10px] text-slate-500">Namještaj i tehnika</span>
              </div>
            </label>

            <label className="flex items-start gap-2.5 p-3.5 rounded-2xl border border-teal-200 bg-teal-50/40 hover:bg-teal-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={includeEarthquake}
                onChange={(e) => setIncludeEarthquake(e.target.checked)}
                className="mt-0.5 rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
              />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-teal-950 flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-teal-600" />
                  <span>Rizik potresa</span>
                </span>
                <span className="text-[10px] text-teal-800">Seizmički rider</span>
              </div>
            </label>

            <label className="flex items-start gap-2.5 p-3.5 rounded-2xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={includeFlood}
                onChange={(e) => setIncludeFlood(e.target.checked)}
                className="mt-0.5 rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
              />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                  <Waves className="w-3.5 h-3.5 text-teal-600" />
                  <span>Poplava i bujice</span>
                </span>
                <span className="text-[10px] text-slate-500">Izljev vode</span>
              </div>
            </label>
          </div>
        </div>

        {/* Deductible Tier */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <label className="text-xs font-semibold text-slate-700 block">
            Ugovorna franšiza (vlastiti udio u šteti za nižu premiju)
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[0, 250, 500].map((tier) => (
              <button
                key={tier}
                type="button"
                onClick={() => setDeductibleTier(tier)}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-colors ${
                  deductibleTier === tier
                    ? 'border-teal-600 bg-teal-50 text-teal-900 shadow-2xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
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
