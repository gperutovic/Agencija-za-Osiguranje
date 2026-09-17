import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Car,
  Home,
  Heart,
  Plane,
  ChevronRight,
  ChevronLeft,
  Shield,
  Sparkles,
  Zap,
  CheckCircle2,
  HelpCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { useInsurtechStore } from '../../store/useInsurtechStore';
import { InsuranceProductType, OcrPrometnaResult } from '../../types/insurance';
import { DocumentOcrDropzone } from './DocumentOcrDropzone';
import { CoverageConfigurator } from './CoverageConfigurator';
import { QuoteSummaryCard } from './QuoteSummaryCard';

interface MayaQuoteEngineProps {
  initialProduct?: InsuranceProductType;
  onCompleted?: () => void;
  className?: string;
}

const PRODUCTS: Array<{
  id: InsuranceProductType;
  title: string;
  tagline: string;
  icon: React.ElementType;
  badge?: string;
}> = [
  {
    id: 'auto',
    title: 'Auto Osiguranje & Kasko',
    tagline: 'Obvezno AO uz do 50% bonusa i Toyota VIP Kasko pokriće',
    icon: Car,
    badge: 'Popularno',
  },
  {
    id: 'property',
    title: 'Imovina, Stan & Kuća',
    tagline: 'Zaštita doma, potres na novu građevinsku vrijednost i izljev vode',
    icon: Home,
    badge: 'Potres 2026',
  },
  {
    id: 'health',
    title: 'Dopunsko Zdravstveno',
    tagline: 'HZZO poskupljenje na 15 € od 01.02.2026. vs. Privatno od 9,50 €',
    icon: Heart,
    badge: 'Ušteda',
  },
  {
    id: 'travel',
    title: 'Putno Zdravstveno',
    tagline: 'Globalna medicinska asistencija, Covid pokriće i gubitak prtljage',
    icon: Plane,
  },
];

export const MayaQuoteEngine: React.FC<MayaQuoteEngineProps> = ({
  initialProduct = 'auto',
  onCompleted,
  className = '',
}) => {
  const {
    activeProduct,
    funnelStep,
    autoParams,
    propertyParams,
    ocrPrometna,
    quoteEstimate,
    advisor,
    setActiveProduct,
    setFunnelStep,
    nextFunnelStep,
    prevFunnelStep,
    updateAutoParams,
    updatePropertyParams,
    applyOcrResult,
    resetQuoteFunnel,
  } = useInsurtechStore();

  const [ocrCompletedPrompt, setOcrCompletedPrompt] = useState(false);

  const handleSelectProduct = (p: InsuranceProductType) => {
    setActiveProduct(p);
    setFunnelStep(2);
  };

  const handleOcrDataExtracted = (ocr: OcrPrometnaResult) => {
    applyOcrResult(ocr);
    setOcrCompletedPrompt(true);
    // Smooth transition to review step
    setTimeout(() => {
      setFunnelStep(3);
    }, 900);
  };

  // Step transitions variant
  const stepVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
  };

  const currentAssetLabel =
    autoParams.vehicleMakeModel ||
    (ocrPrometna
      ? `${ocrPrometna.vehicleMake} ${ocrPrometna.vehicleModel} (${ocrPrometna.registrationPlate})`
      : 'Toyota RAV4 2.5 Hybrid (ZG-4821-HP)');

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      {/* Top Header / Progress Indicator */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Maya Engine &bull; Interaktivni Lijevak</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Brzi personalizirani izračun police
            </h2>
            <p className="text-xs text-slate-500">
              Transparentne cijene vodećih hrvatskih osiguratelja (Generali, Croatia, Allianz, Wiener)
            </p>
          </div>

          {/* Step Pill Navigator */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl text-xs font-mono">
            {[1, 2, 3, 4].map((stepNum) => (
              <button
                key={stepNum}
                type="button"
                onClick={() => setFunnelStep(stepNum)}
                className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold transition-all ${
                  funnelStep === stepNum
                    ? 'bg-blue-600 text-white shadow-sm'
                    : funnelStep > stepNum
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {funnelStep > stepNum ? '✓' : stepNum}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Live Step Content via AnimatePresence */}
        <div className="pt-6">
          <AnimatePresence mode="wait" custom={1}>
            {/* STEP 1: PRODUCT SELECTION */}
            {funnelStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="text-center max-w-lg mx-auto space-y-2">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    Koju vrstu osiguranja želite ugovoriti ili provjeriti?
                  </h3>
                  <p className="text-xs text-slate-500">
                    Odaberite liniju proizvoda za prijenos stečenih bonusa i izračun najpovoljnije premije.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {PRODUCTS.map((prod) => {
                    const Icon = prod.icon;
                    const isSelected = activeProduct === prod.id;
                    return (
                      <button
                        key={prod.id}
                        type="button"
                        onClick={() => handleSelectProduct(prod.id)}
                        className={`p-5 rounded-3xl text-left border transition-all relative group flex flex-col justify-between ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/20 shadow-md ring-2 ring-blue-600/20'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 hover:shadow-sm'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <div className="w-12 h-12 rounded-2xl bg-blue-600/10 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <Icon className="w-6 h-6" />
                            </div>
                            {prod.badge && (
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300">
                                {prod.badge}
                              </span>
                            )}
                          </div>
                          <h4 className="font-bold text-slate-900 dark:text-white text-base">
                            {prod.title}
                          </h4>
                          <p className="text-xs text-slate-500 mt-1">{prod.tagline}</p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                          <span>Započni izračun</span>
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 2: DOCUMENT OCR INTAKE & BASIC ASSET DATA */}
            {funnelStep === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                    Korak 2 od 4 &bull; Unos podataka
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                    Učitajte prometnu dozvolu ili unesite osnovne podatke vozila
                  </h3>
                  <p className="text-xs text-slate-500">
                    Naš pametni OCR sustav automatski očitava snagu (kW), broj šasije i godinu prve registracije.
                  </p>
                </div>

                {/* Document Dropzone */}
                <DocumentOcrDropzone onOcrExtracted={handleOcrDataExtracted} />

                {/* Manual Override inputs */}
                <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Ručna provjera i prilagodba parametara
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                        Snaga motora (kW)
                      </label>
                      <input
                        type="number"
                        value={autoParams.kwPower}
                        onChange={(e) => updateAutoParams({ kwPower: Number(e.target.value) || 0 })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                        Postotak bonusa (0–50%)
                      </label>
                      <select
                        value={autoParams.bonusPercentage}
                        onChange={(e) => updateAutoParams({ bonusPercentage: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-sm"
                      >
                        <option value={50}>50% (Maksimalni bonus - Zakon)</option>
                        <option value={40}>40% bonusa</option>
                        <option value={30}>30% bonusa</option>
                        <option value={20}>20% bonusa</option>
                        <option value={0}>0% (Novi vozač / Bez povijesti)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                        Namjena vozila
                      </label>
                      <select
                        value={autoParams.usageType}
                        onChange={(e) => updateAutoParams({ usageType: e.target.value as any })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
                      >
                        <option value="private">Privatna upotreba</option>
                        <option value="commercial">Službeno / Gospodarsko vozilo</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={prevFunnelStep}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" /> Natrag na odabir
                  </button>
                  <button
                    type="button"
                    onClick={nextFunnelStep}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-all"
                  >
                    <span>Dalje na konfigurator pokrića</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: COVERAGE CONFIGURATOR */}
            {funnelStep === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                    Korak 3 od 4 &bull; Franšiza & Dodatna Pokrića
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                    Podesite željenu razinu zaštite i učešća
                  </h3>
                  <p className="text-xs text-slate-500">
                    Svaka promjena odmah preračunava konačnu premiju bez skrivenih troškova.
                  </p>
                </div>

                <CoverageConfigurator
                  productType={activeProduct === 'property' ? 'property' : 'auto'}
                  autoParams={autoParams}
                  propertyParams={propertyParams}
                  onAutoChange={updateAutoParams}
                  onPropertyChange={updatePropertyParams}
                />

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={prevFunnelStep}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" /> Natrag
                  </button>
                  <button
                    type="button"
                    onClick={nextFunnelStep}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all"
                  >
                    <span>Pregledaj konačnu ponudu</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: FINAL QUOTE SUMMARY & HANDOFF */}
            {funnelStep === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                    Korak 4 od 4 &bull; Vaša Službena Ponuda
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                    Izračun je završen i spreman za aktivaciju
                  </h3>
                  <p className="text-xs text-slate-500">
                    Odaberite instant online ugovaranje ili zatražite savjet vašeg osobnog brokera na WhatsAppu.
                  </p>
                </div>

                <QuoteSummaryCard
                  productType={activeProduct}
                  estimate={quoteEstimate}
                  assetLabel={currentAssetLabel}
                  advisor={advisor}
                  onBindOnline={() => {
                    onCompleted?.();
                  }}
                />

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={prevFunnelStep}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" /> Prilagodi pokrića
                  </button>
                  <button
                    type="button"
                    onClick={resetQuoteFunnel}
                    className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 underline"
                  >
                    Novi izračun za drugo vozilo / imovinu
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
