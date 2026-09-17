import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Car,
  Home,
  Heart,
  Shield,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  Phone,
  Search,
  Lock,
  Zap,
} from 'lucide-react';
import { useInsurtechStore } from '../../store/useInsurtechStore';
import { InsuranceProductType } from '../../types/insurance';

interface ConversationalHeroFunnelProps {
  onSelectCategory?: (category: InsuranceProductType) => void;
  onOibVerified?: (oib: string) => void;
  className?: string;
}

// ISO 7064 Module 11, 10 Croatian OIB validation algorithm
export function validateCroatianOib(oib: string): boolean {
  const clean = oib.trim().replace(/\s/g, '');
  if (!/^[0-9]{11}$/.test(clean)) return false;

  let a = 10;
  for (let i = 0; i < 10; i++) {
    a = (a + parseInt(clean.charAt(i), 10)) % 10;
    if (a === 0) a = 10;
    a = (a * 2) % 11;
  }
  let control = 11 - a;
  if (control === 10) control = 0;
  return control === parseInt(clean.charAt(10), 10);
}

const CATEGORIES = [
  {
    id: 'auto' as InsuranceProductType,
    title: 'Auto osiguranje',
    subtitle: 'Obvezno AO & Kasko',
    tagline: 'Do 50% bonusa + Toyota VIP uvjeti',
    icon: Car,
    badge: 'Popularno',
    accentColor: 'from-teal-500/15 to-teal-600/5',
    borderColor: 'hover:border-teal-500',
    iconColor: 'text-teal-600 dark:text-teal-400',
  },
  {
    id: 'property' as InsuranceProductType,
    title: 'Imovina i dom',
    subtitle: 'Kuća, stan & potres',
    tagline: 'Građevinska vrijednost bez odbitaka',
    icon: Home,
    badge: 'Potres 2026',
    accentColor: 'from-amber-500/15 to-amber-600/5',
    borderColor: 'hover:border-amber-500',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  {
    id: 'health' as InsuranceProductType,
    title: 'Zdravstveno',
    subtitle: 'Dopunsko & Pregledi',
    tagline: 'HZZO 15 € vs privatno od 9,50 €',
    icon: Heart,
    badge: 'Ušteda do 102 €',
    accentColor: 'from-rose-500/15 to-rose-600/5',
    borderColor: 'hover:border-rose-500',
    iconColor: 'text-rose-600 dark:text-rose-400',
  },
  {
    id: 'life' as InsuranceProductType,
    title: 'Životno osiguranje',
    subtitle: 'Zaštita i štednja',
    tagline: 'Sigurnost obitelji i povrat uloga',
    icon: Shield,
    badge: 'Sigurnost',
    accentColor: 'from-sky-500/15 to-sky-600/5',
    borderColor: 'hover:border-sky-500',
    iconColor: 'text-sky-600 dark:text-sky-400',
  },
];

export const ConversationalHeroFunnel: React.FC<ConversationalHeroFunnelProps> = ({
  onSelectCategory,
  onOibVerified,
  className = '',
}) => {
  const { setActiveProduct, setFunnelStep, user, setUser } = useInsurtechStore();
  const [selectedCategory, setSelectedCategory] = useState<InsuranceProductType>('auto');
  const [oibInput, setOibInput] = useState<string>('');
  const [oibValidationState, setOibValidationState] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [isVerifyingOib, setIsVerifyingOib] = useState<boolean>(false);
  const [oibSuccessMessage, setOibSuccessMessage] = useState<string | null>(null);

  const handleCategoryClick = (catId: InsuranceProductType) => {
    setSelectedCategory(catId);
    setActiveProduct(catId);
    setFunnelStep(2);
    onSelectCategory?.(catId);
  };

  const handleOibChange = (val: string) => {
    const numeric = val.replace(/\D/g, '').slice(0, 11);
    setOibInput(numeric);

    if (numeric.length === 11) {
      const valid = validateCroatianOib(numeric);
      setOibValidationState(valid ? 'valid' : 'invalid');
    } else {
      setOibValidationState('idle');
      setOibSuccessMessage(null);
    }
  };

  const handleOibSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCroatianOib(oibInput)) {
      setOibValidationState('invalid');
      return;
    }

    setIsVerifyingOib(true);
    setTimeout(() => {
      setIsVerifyingOib(false);
      setOibValidationState('valid');
      setOibSuccessMessage('OIB potvrđen: Povezan postojeći bonus od 50% i Generali popust.');
      setUser({ oib: oibInput });
      onOibVerified?.(oibInput);
      setActiveProduct(selectedCategory);
      setFunnelStep(2);
    }, 700);
  };

  const fillSampleOib = () => {
    handleOibChange('24918274019');
  };

  return (
    <section className={`relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 bg-gradient-to-b from-white via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-b border-slate-200 dark:border-slate-800 ${className}`}>
      {/* Subtle Ambient Radial Backdrops */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-teal-500/10 dark:bg-teal-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        {/* Top Eyebrow & Institutional Authority */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs font-mono font-bold shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            <span className="text-teal-700 dark:text-teal-400">MODERN AGENCY ADVANTAGE</span>
            <span className="text-slate-300 dark:text-slate-700">&bull;</span>
            <span>HANFA LICENCA ZO-88912</span>
            <span className="text-slate-300 dark:text-slate-700">&bull;</span>
            <span className="text-amber-600 dark:text-amber-400">GENERALI PARTNER</span>
          </motion.div>

          {/* Main Conversational Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 dark:text-white leading-[1.12] font-heading"
          >
            Vaša sigurnost na prvom mjestu.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-teal-500 to-sky-600">
              Kako vam možemo pomoći?
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed"
          >
            Uspoređujemo ponude 4 najveća osiguratelja u Hrvatskoj u stvarnom vremenu. Odaberite kategoriju osiguranja ili unesite OIB za trenutan personalizirani izračun.
          </motion.p>
        </div>

        {/* Card-Based Selectors: Auto, Imovina, Životno, Zdravstveno */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto"
        >
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;

            return (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`p-6 rounded-3xl border transition-all duration-200 cursor-pointer relative group flex flex-col justify-between ${
                  isSelected
                    ? 'border-teal-600 bg-white dark:bg-slate-900 shadow-xl shadow-teal-600/10 ring-2 ring-teal-600/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/70 hover:border-teal-400 hover:shadow-lg hover:-translate-y-0.5'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-100 dark:bg-slate-800 ${cat.iconColor} group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    {cat.badge && (
                      <span className="text-[10px] font-bold font-mono px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-teal-50 group-hover:text-teal-700 transition-colors">
                        {cat.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="font-heading font-black text-lg text-slate-900 dark:text-white">
                    {cat.title}
                  </h3>
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                    {cat.subtitle}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2.5 leading-relaxed">
                    {cat.tagline}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-teal-700 dark:text-teal-400">
                  <span>Izračunaj ponudu</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Quick-Intake Option (OIB Input) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-2xl mx-auto bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-900/5 space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                Brzi unos (Quick-Intake)
              </span>
              <h4 className="font-heading font-bold text-base text-slate-900 dark:text-white mt-0.5">
                Imate li OIB? Učitajte svoj profil za trenutan uvid
              </h4>
            </div>
            <button
              type="button"
              onClick={fillSampleOib}
              className="text-xs text-teal-600 hover:text-teal-700 dark:text-teal-400 font-mono font-bold underline self-start sm:self-auto"
            >
              Testni OIB (24918274019)
            </button>
          </div>

          <form onSubmit={handleOibSubmit} className="space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-mono text-xs">
                  OIB:
                </div>
                <input
                  type="text"
                  value={oibInput}
                  onChange={(e) => handleOibChange(e.target.value)}
                  placeholder="Unesite 11 znamenki OIB-a..."
                  className={`w-full pl-14 pr-10 py-3.5 rounded-2xl border text-sm font-mono tracking-widest transition-all ${
                    oibValidationState === 'valid'
                      ? 'border-emerald-500 bg-emerald-50/30 text-emerald-950 focus:ring-2 focus:ring-emerald-500'
                      : oibValidationState === 'invalid'
                      ? 'border-rose-400 bg-rose-50/30 text-rose-950 focus:ring-2 focus:ring-rose-500'
                      : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500'
                  }`}
                  maxLength={11}
                />
                {oibValidationState === 'valid' && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-emerald-600">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                )}
                {oibValidationState === 'invalid' && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-rose-600">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isVerifyingOib || oibInput.length !== 11}
                className="px-7 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-teal-600/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] shrink-0"
              >
                {isVerifyingOib ? (
                  <span>Provjera OIB-a...</span>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Provjeri uvjete</span>
                  </>
                )}
              </button>
            </div>

            {/* Validation Feedback & Security Guarantee */}
            <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-1 gap-2">
              <div className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-teal-600" />
                <span>Zaštićeno 256-bitnom enkripcijom sukladno GDPR / AZOP propisima</span>
              </div>
              {oibValidationState === 'invalid' && (
                <span className="text-rose-600 font-semibold font-mono">
                  Neispravan OIB (kontrolna znamenka ISO 7064 nije točna)
                </span>
              )}
            </div>

            {oibSuccessMessage && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{oibSuccessMessage}</span>
              </motion.div>
            )}
          </form>
        </motion.div>

        {/* 3 Pillars of Modern Trust */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto pt-4 text-center">
          <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono block">0 €</span>
            <span className="text-xs text-slate-500 font-medium">Agencijske provizije (čl. 401. Zakona o osiguranju)</span>
          </div>
          <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
            <span className="text-2xl font-black text-teal-600 dark:text-teal-400 font-mono block">&lt; 90 sek</span>
            <span className="text-xs text-slate-500 font-medium">Vrijeme digitalnog izdavanja police i Zelene karte</span>
          </div>
          <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
            <span className="text-2xl font-black text-amber-500 font-mono block">4 Osiguratelja</span>
            <span className="text-xs text-slate-500 font-medium">Generali, Croatia, Allianz i Wiener u usporedbi</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConversationalHeroFunnel;
