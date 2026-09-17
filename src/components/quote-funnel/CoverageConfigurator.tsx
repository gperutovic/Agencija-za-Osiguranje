import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  HelpCircle,
  Wrench,
  Sparkles,
  CloudLightning,
  Lock,
  Percent,
  Check,
  ChevronRight,
  Info,
} from 'lucide-react';
import { AutoQuoteParams, PropertyQuoteParams } from '../../types/insurance';

interface CoverageConfiguratorProps {
  productType: 'auto' | 'kasko' | 'property';
  autoParams: AutoQuoteParams;
  propertyParams?: PropertyQuoteParams;
  onAutoChange: (params: Partial<AutoQuoteParams>) => void;
  onPropertyChange?: (params: Partial<PropertyQuoteParams>) => void;
}

interface JargonExplainer {
  title: string;
  tagline: string;
  realLifeExample: string;
  recommendation: string;
}

const JARGON_DICTIONARY: Record<string, JargonExplainer> = {
  deductible: {
    title: 'Franšiza (Učešće u šteti)',
    tagline: 'Vaš dio troška u slučaju štete',
    realLifeExample:
      'Ako popravak oštećenja na vozilu u servisu iznosi 1.200 €, a vaša ugovorena franšiza je 150 €, osiguranje podmiruje 1.050 €, a vi samo 150 €. Što je franšiza viša, godišnja polica je povoljnija.',
    recommendation: 'Preporučujemo franšizu 150 € za optimalan omjer cijene i zaštite.',
  },
  glass: {
    title: 'Lom stakala (Vjetrobransko, bočna i stražnje)',
    tagline: 'Zaštita stakala bez diranja bonusa',
    realLifeExample:
      'Vozite iza kamiona na autocesti A1 prema moru i kamenčić napravi zvjezdasto puknuće na vjetrobranu. Zamjena modernog stakla sa senzorima košta 800–1.400 €. Uz ovu opciju, popravak je 100% pokriven i vaš popust od 50% ostaje netaknut.',
    recommendation: 'Izuzetno preporučljivo za sve novije automobile s radarima i kamerama.',
  },
  assistance: {
    title: 'Asistencija na cesti 24/7 (Hrvatska & Europa)',
    tagline: 'Pomoć na licu mjesta i zamjensko vozilo',
    realLifeExample:
      'U 2 ujutro u Gorskom kotaru probuši vam se guma ili akumulator otkaže poslušnost. Jedan poziv našem dežurnom centru i vučna služba stiže bez naknade, a ako popravak traje duže od 4 sata, dobivate besplatno zamjensko vozilo.',
    recommendation: 'Neophodno za svakoga tko prelazi više od 10.000 km godišnje ili putuje izvan grada.',
  },
  bonusProtection: {
    title: 'Zaštita stečenog bonusa (Malus zaštita)',
    tagline: 'Zadržite 50% popusta i u slučaju prve nesreće',
    realLifeExample:
      'U jutarnjoj gužvi na Slavonskoj aveniji u Zagrebu dođe do naleta na vozilo ispred vas. Bez ove zaštite gubite 3 premijska stupnja (cca 15% bonusa). Uz zaštitu bonusa, vaša polica iduće godine ostaje na punih 50% popusta.',
    recommendation: 'Vrijedi za vozače s 50% bonusa kako bi sačuvali godine stečenog statusa.',
  },
  hailStorm: {
    title: 'Zaštita od tuče, oluje i prirodnih nepogoda',
    tagline: 'Pokriće šteta od ekstremnih vremenskih prilika',
    realLifeExample:
      'Ljetna oluja s tučom veličine oraha izrešeta krov, poklopac motora i razbije svjetla dok je vozilo parkirano na otvorenom. Specijalističko ravnanje limarije bez lakiranja i popravci u potpunosti su pokriveni.',
    recommendation: 'Preporučujemo ako vozilo nema stalno garažno mjesto.',
  },
  theft: {
    title: 'Zaštita od provalne krađe i otuđenja',
    tagline: 'Sigurnost za vozilo i opremu',
    realLifeExample:
      'Vozilo bude ukradeno ili obijeno uz oštećenje brave i krađu navigacije. Osiguratelj isplaćuje procijenjenu tržišnu vrijednost vozila ili trošak popravka i opreme.',
    recommendation: 'Preporučujemo za modele s visokom stopom otuđenja (npr. SUV i premium limuzine).',
  },
};

export const CoverageConfigurator: React.FC<CoverageConfiguratorProps> = ({
  productType,
  autoParams,
  propertyParams,
  onAutoChange,
  onPropertyChange,
}) => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const deductibleTiers = [
    { value: 0, label: '0 € (Bez učešća)', note: 'Maksimalna bezbrižnost' },
    { value: 150, label: '150 €', note: 'Preporuka agencije (-12% premija)' },
    { value: 300, label: '300 €', note: 'Povoljnija premija (-24%)' },
    { value: 500, label: '500 €', note: 'Najniža cijena (-35%)' },
  ];

  const toggleRider = (key: keyof AutoQuoteParams) => {
    onAutoChange({ [key]: !autoParams[key] });
  };

  return (
    <div className="space-y-6">
      {/* SECTION 1: DEDUCTIBLE SLIDER / SELECTOR */}
      <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
              Odaberite visinu franšize (učešća u šteti)
            </span>
          </div>
          <button
            type="button"
            onClick={() =>
              setActiveTooltip(activeTooltip === 'deductible' ? null : 'deductible')
            }
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Što znači franšiza?
          </button>
        </div>

        {/* Deductible Tooltip Popover */}
        {activeTooltip === 'deductible' && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-slate-700 dark:text-slate-300 space-y-2 relative"
          >
            <div className="font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-blue-600" />
              {JARGON_DICTIONARY.deductible.title}
            </div>
            <p>{JARGON_DICTIONARY.deductible.realLifeExample}</p>
            <div className="font-semibold text-emerald-700 dark:text-emerald-400">
              💡 {JARGON_DICTIONARY.deductible.recommendation}
            </div>
          </motion.div>
        )}

        {/* Tier Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {deductibleTiers.map((tier) => {
            const isSelected = (autoParams.deductibleTier || 0) === tier.value;
            return (
              <button
                key={tier.value}
                type="button"
                onClick={() => onAutoChange({ deductibleTier: tier.value })}
                className={`p-3.5 rounded-2xl text-left border transition-all relative ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/30 text-blue-950 dark:text-blue-100 shadow-sm ring-2 ring-blue-600/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                {isSelected && (
                  <span className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                )}
                <div className="font-bold text-sm sm:text-base font-mono">{tier.label}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{tier.note}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: INTERACTIVE RIDERS & COVERAGE TOGGLES */}
      <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
              Prilagodite dodatna pokrića (Rideri)
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Kliknite na pojedino pokriće za uključivanje/isključivanje i objašnjenje na stvarnim primjerima.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {/* Rider 1: Asistencija na cesti */}
          <RiderToggleCard
            title="Asistencija na cesti 24/7 (HR & Europa)"
            priceTag="+29 € / god."
            description="Vučna služba, popravak na licu mjesta i zamjensko vozilo do 5 dana bez čekanja."
            icon={Wrench}
            isActive={!!autoParams.includeAssistance}
            onToggle={() => toggleRider('includeAssistance')}
            explainer={JARGON_DICTIONARY.assistance}
          />

          {/* Rider 2: Lom stakla */}
          <RiderToggleCard
            title="Lom stakala bez franšize"
            priceTag="+38 € / god."
            description="Zamjena originalnog vjetrobranskog stakla i radara bez učešća i bez gubitka bonusa."
            icon={Sparkles}
            isActive={!!autoParams.includeGlass}
            onToggle={() => toggleRider('includeGlass')}
            explainer={JARGON_DICTIONARY.glass}
          />

          {/* Rider 3: Zaštita bonusa */}
          <RiderToggleCard
            title="Zaštita stečenog bonusa 50%"
            priceTag="+24 € / god."
            description="Vaših 50% popusta ostaje sigurno čak i ako skrivite manju prometnu nezgodu."
            icon={Percent}
            isActive={!!autoParams.includeBonusProtection}
            onToggle={() => toggleRider('includeBonusProtection')}
            explainer={JARGON_DICTIONARY.bonusProtection}
          />

          {/* Rider 4: Tuča i oluja */}
          <RiderToggleCard
            title="Tuča, oluja i elementarne nepogode"
            priceTag="+42 € / god."
            description="PDR ravnanje udubljenja od tuče i sanacija šteta uzrokovanih olujnim vjetrom."
            icon={CloudLightning}
            isActive={!!autoParams.includeHailStorm}
            onToggle={() => toggleRider('includeHailStorm')}
            explainer={JARGON_DICTIONARY.hailStorm}
          />

          {/* Rider 5: Krađa i provala */}
          <RiderToggleCard
            title="Zaštita od krađe i provale"
            priceTag="+55 € / god."
            description="Otuđenje kompletnog vozila, krađa dijelova (katalizator, naplatci) i oštećenja brave."
            icon={Lock}
            isActive={!!autoParams.includeTheft}
            onToggle={() => toggleRider('includeTheft')}
            explainer={JARGON_DICTIONARY.theft}
          />
        </div>
      </div>
    </div>
  );
};

interface RiderToggleCardProps {
  title: string;
  priceTag: string;
  description: string;
  icon: React.ElementType;
  isActive: boolean;
  onToggle: () => void;
  explainer: JargonExplainer;
}

const RiderToggleCard: React.FC<RiderToggleCardProps> = ({
  title,
  priceTag,
  description,
  icon: Icon,
  isActive,
  onToggle,
  explainer,
}) => {
  const [showExplainer, setShowExplainer] = useState(false);

  return (
    <div
      className={`p-4 rounded-2xl border transition-all ${
        isActive
          ? 'border-emerald-500/60 bg-emerald-50/40 dark:bg-emerald-950/20'
          : 'border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 hover:border-slate-300'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 cursor-pointer" onClick={onToggle}>
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
              isActive
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
            }`}
          >
            <Icon className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-sm text-slate-900 dark:text-white">{title}</span>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 border border-slate-200 dark:border-slate-700">
                {priceTag}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">{description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowExplainer(!showExplainer)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
            title="Saznaj više s primjerom iz stvarnog života"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Toggle Switch */}
          <button
            type="button"
            onClick={onToggle}
            className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
              isActive ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <motion.div
              layout
              className={`w-5 h-5 rounded-full bg-white shadow-md transform ${
                isActive ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Relatable Real-world Explainer Box */}
      {showExplainer && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-1.5"
        >
          <div className="font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
            <Info className="w-3.5 h-3.5" /> Primjer iz stvarnog života:
          </div>
          <p className="italic bg-white/70 dark:bg-slate-900/70 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
            "{explainer.realLifeExample}"
          </p>
          <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
            Preporuka brokera: {explainer.recommendation}
          </div>
        </motion.div>
      )}
    </div>
  );
};
