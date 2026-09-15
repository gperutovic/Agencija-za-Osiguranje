import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Car,
  Home,
  HeartPulse,
  Plane,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Phone,
  Sparkles,
  Sliders,
  Star,
  FileText,
  Camera,
  BookOpen,
  HelpCircle,
  Clock,
  Award,
  ChevronDown,
} from 'lucide-react';
import {
  CARRIER_PARTNERS,
  COVERAGE_TIERS,
  GLOSSARY_TERMS,
  SPEED_CAMERAS,
  FREQUENT_QUESTIONS,
} from '../data/mockData';
import { calculateAutoPremium, formatEuro } from '../lib/calculations';
import { InsuranceCategory } from '../lib/types';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Slider } from '../components/ui/Slider';
import { QuoteModal } from '../components/quotes/QuoteModal';

export default function HomePage() {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<InsuranceCategory>('auto');

  // Quick Home Slider State for Interactive Estimator
  const [estKw, setEstKw] = useState<number>(85);
  const [estAge, setEstAge] = useState<number>(35);
  const [estBonus, setEstBonus] = useState<number>(50);

  // FAQ open index state
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  const openQuoteWithCategory = (cat: InsuranceCategory) => {
    setSelectedCategory(cat);
    setIsQuoteModalOpen(true);
  };

  // Live calculation for the interactive estimator
  const estResult = React.useMemo(() => {
    return calculateAutoPremium({
      kw: estKw,
      driverAge: estAge,
      bonusPercent: estBonus,
      coverageType: 'ao_kasko',
      franchiseAmount: 150,
      addons: { glassBreakage: true, roadAssistance: true, bonusProtection: true },
    });
  }, [estKw, estAge, estBonus]);

  return (
    <div className="w-full bg-slate-50 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white pt-12 sm:pt-20 pb-20 sm:pb-28 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* HANFA Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-800/90 border border-slate-700 text-slate-300 text-xs font-semibold backdrop-blur-sm shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Službeni registrirani distributer osiguranja • Registar ZO-88912</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Usporedite i ugovorite osiguranje u{' '}
              <span className="bg-gradient-to-r from-blue-400 via-emerald-400 to-teal-300 bg-clip-text text-transparent">
                3 minute
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              10 vodećih osiguravajućih kuća na jednom mjestu. Provjerite točne tarife bez
              skrivenih provizija i ostvarite do{' '}
              <strong className="text-emerald-400 font-semibold">50% bonusa</strong> i besplatnu
              zelenu kartu.
            </p>

            {/* Category Quick Launch Buttons */}
            <div className="pt-4 flex flex-wrap justify-center gap-3 sm:gap-4">
              {[
                { id: 'auto' as InsuranceCategory, label: 'Auto & Kasko', icon: Car },
                { id: 'property' as InsuranceCategory, label: 'Imovina i dom', icon: Home },
                { id: 'health' as InsuranceCategory, label: 'Zdravstveno', icon: HeartPulse },
                { id: 'travel' as InsuranceCategory, label: 'Putno osiguranje', icon: Plane },
              ].map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => openQuoteWithCategory(cat.id)}
                    className="flex items-center space-x-2.5 px-4 py-3 bg-slate-800/80 hover:bg-slate-700/90 text-white rounded-xl border border-slate-700 hover:border-blue-500 transition-all shadow-md group cursor-pointer"
                  >
                    <Icon className="w-4 h-4 text-blue-400 group-hover:text-emerald-400 transition-colors" />
                    <span className="text-sm font-semibold">{cat.label}</span>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                );
              })}
            </div>

            {/* Dual CTAs */}
            <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                variant="emerald"
                size="lg"
                className="w-full sm:w-auto shadow-lg shadow-emerald-500/20 text-base"
                onClick={() => openQuoteWithCategory('auto')}
              >
                <span>Započni besplatni izračun</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Link to="/kalkulator-prijepisa" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-slate-700 text-slate-200 hover:bg-slate-800"
                >
                  <FileText className="w-4 h-4 mr-2 text-blue-400" />
                  <span>Kalkulator prijepisa vozila (NN 92/21)</span>
                </Button>
              </Link>
            </div>

            {/* Micro Trust Proofs */}
            <div className="pt-8 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs text-slate-400">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% besplatno za ugovaratelje</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span>Polica na e-mailu u 5 minuta</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Licencirani HANFA savjetnici</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PARTNER CARRIERS TRUST BAR */}
      <section className="bg-white py-12 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Službena suradnja s 10 licenciranih osiguravajućih društava u RH
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {CARRIER_PARTNERS.map((carrier) => (
              <div
                key={carrier.id}
                className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-slate-300 hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-slate-900 tracking-tight">
                      {carrier.shortName}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold">
                      {carrier.marketShare}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{carrier.name}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-600">
                  <div className="flex items-center space-x-1 text-amber-500">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-slate-700">{carrier.rating}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">{carrier.badge}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE QUICK ESTIMATOR WIDGET */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 sm:p-12 shadow-2xl border border-slate-800 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left explanation */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold">
                <Sliders className="w-3.5 h-3.5 text-blue-400" />
                <span>Interaktivni brzi simulator</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
                Pomičite klizače i provjerite trenutnu procjenu police
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Isprobajte interaktivni kalkulator i uvjerite se kako snaga vozila (kW), vaša dob i
                stečeni bonus-malus stupanj utječu na godišnju i mjesečnu premiju auto osiguranja.
              </p>

              {/* Sliders in widget */}
              <div className="space-y-5 pt-2">
                {/* kW */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">Snaga motora:</span>
                    <span className="text-blue-400 font-mono text-sm">{estKw} kW (~{Math.round(estKw * 1.36)} KS)</span>
                  </div>
                  <Slider
                    min={30}
                    max={200}
                    step={1}
                    value={estKw}
                    onChange={(val) => setEstKw(val)}
                    unit="kW"
                  />
                </div>

                {/* Age */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">Dob vozača:</span>
                    <span className="text-blue-400 font-mono text-sm">{estAge} godina</span>
                  </div>
                  <Slider
                    min={18}
                    max={75}
                    step={1}
                    value={estAge}
                    onChange={(val) => setEstAge(val)}
                    unit="god."
                  />
                </div>

                {/* Bonus */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">Stečeni bonus:</span>
                    <span className="text-emerald-400 font-mono text-sm">-{estBonus}%</span>
                  </div>
                  <Slider
                    min={0}
                    max={50}
                    step={5}
                    value={estBonus}
                    onChange={(val) => setEstBonus(val)}
                    unit="%"
                  />
                </div>
              </div>
            </div>

            {/* Right Estimator Card */}
            <div className="lg:col-span-6 bg-slate-800/90 backdrop-blur rounded-2xl p-6 sm:p-8 border border-slate-700 shadow-xl">
              <div className="flex justify-between items-start border-b border-slate-700 pb-4 mb-6">
                <div>
                  <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                    Paket: Obvezno AO + Kasko + Asistencija
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">
                    Okvirna procjena za vaše vozilo
                  </h3>
                </div>
                <div className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-lg text-xs font-bold">
                  Ušteda do 84 €
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">Obvezno auto osiguranje (AO):</span>
                  <span className="font-semibold text-white font-mono">
                    {formatEuro(estResult.aoAnnual)} / god.
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">Kasko zaštita (franšiza 150 €):</span>
                  <span className="font-semibold text-white font-mono">
                    {formatEuro(estResult.kaskoAnnual)} / god.
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">Dodaci (stakla, 24/7 vuča, bonus):</span>
                  <span className="font-semibold text-white font-mono">
                    {formatEuro(estResult.addonsAnnual)} / god.
                  </span>
                </div>

                <div className="pt-4 border-t border-slate-700">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-xs uppercase text-slate-400 font-semibold">
                      Mjesečna rata već od:
                    </span>
                    <span className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono">
                      {formatEuro(estResult.monthlyInstallment)}
                      <span className="text-xs font-normal text-slate-400">/mj.</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 text-right">
                    Ili jednokratno {formatEuro(estResult.totalAnnual)} godišnje uz 10% popusta
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <Button
                  variant="emerald"
                  size="lg"
                  className="w-full"
                  onClick={() => openQuoteWithCategory('auto')}
                >
                  <span>Prikaži ponude svih 10 osiguratelja</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MULTI-TIER COMPARISON MATRIX */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Jasna usporedba bez skrivenih uvjeta</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Odaberite razinu zaštite koja vam odgovara
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Sve police uključuju zakonski propisane limite i službenu podršku našeg tima u slučaju
            štetnog događaja.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {COVERAGE_TIERS.map((tier) => {
            const isPlus = tier.id === 'plus';
            return (
              <div
                key={tier.id}
                className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all ${
                  isPlus
                    ? 'bg-white border-2 border-blue-600 shadow-xl ring-4 ring-blue-100'
                    : 'bg-white border border-slate-200 shadow-sm hover:shadow-md'
                }`}
              >
                {tier.highlightBadge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-extrabold uppercase tracking-wider shadow-md">
                    {tier.highlightBadge}
                  </div>
                )}

                <div>
                  <div className="mb-6">
                    <h3 className="text-xl font-extrabold text-slate-900">{tier.name}</h3>
                    <p className="text-xs text-slate-500 mt-1">{tier.tagline}</p>
                  </div>

                  <div className="mb-6 pb-6 border-b border-slate-100">
                    <span className="text-xs text-slate-500 block">Već od:</span>
                    <div className="flex items-baseline space-x-1">
                      <span className="text-3xl sm:text-4xl font-black text-slate-900">
                        {formatEuro(tier.monthlyPriceStarting)}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">/mjesečno</span>
                    </div>
                    <span className="text-[11px] text-slate-500 block mt-1">
                      Godišnje od {formatEuro(tier.annualPriceStarting)}
                    </span>
                  </div>

                  {/* Included features */}
                  <div className="space-y-3 mb-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                      Uključeno u paket:
                    </span>
                    {tier.includedFeatures.map((feat, i) => (
                      <div key={i} className="flex items-start space-x-2.5 text-xs text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Excluded features */}
                  {tier.excludedFeatures.length > 0 && (
                    <div className="space-y-2 mb-6 pt-4 border-t border-slate-100">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                        Nije uključeno:
                      </span>
                      {tier.excludedFeatures.map((feat, i) => (
                        <div key={i} className="flex items-start space-x-2.5 text-xs text-slate-500">
                          <span className="w-4 text-center font-bold text-slate-400 shrink-0">✕</span>
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <p className="text-[11px] text-slate-500 mb-4 italic">
                    Preporučeno za: {tier.recommendedFor}
                  </p>
                  <Button
                    variant={isPlus ? 'primary' : 'outline'}
                    size="md"
                    className="w-full"
                    onClick={() => openQuoteWithCategory('auto')}
                  >
                    Odaberi {tier.name.split(' ')[0]}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. ORGANIC SEO & UTILITY TOOLS GRID */}
      <section className="bg-slate-100/70 py-16 sm:py-20 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Besplatni alati i registri za vozače i građane
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Korisni kalkulatori, baza prometnih kamera u RH i vodiči za rješavanje šteta.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Tool 1: Kalkulator prijepisa */}
            <Link
              to="/kalkulator-prijepisa"
              className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  Kalkulator prijepisa vozila
                </h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Izračunajte točan iznos upravne pristojbe u stanici za tehnički pregled (NN 92/21) prema kilovatima i starosti.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-blue-600">
                <span>Otvori kalkulator</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Tool 2: Prijava štete */}
            <Link
              to="/prijava-stete"
              className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                  Online prijava štete (FNOL)
                </h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Prijavite prometnu nezgodu ili štetu na imovini u 4 koraka uz priložene fotografije i praćenje statusa likvidacije.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-emerald-600">
                <span>Prijavi štetu odmah</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Tool 3: Kamere za brzinu */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4">
                  <Camera className="w-6 h-6" />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">Kamere za brzinu RH</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                    MUP RH
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Baza fiksnih lokacija kućišta kamera u Zagrebu, Splitu, Rijeci, Osijeku i na autocestama.
                </p>
                <div className="mt-4 space-y-1.5 text-[11px] text-slate-600">
                  {SPEED_CAMERAS.slice(0, 2).map((cam) => (
                    <div key={cam.id} className="truncate">
                      • <span className="font-semibold">{cam.city}</span>: {cam.street} ({cam.speedLimit} km/h)
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-amber-600">
                <span>Ažurirano za 2026.</span>
              </div>
            </div>

            {/* Tool 4: Rječnik osiguranja */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Rječnik osiguranja</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Jednostavna objašnjenja ključnih stručnih pojmova: odbitna franšiza, bonus-malus, regres, europsko izvješće.
                </p>
                <div className="mt-4 space-y-1.5 text-[11px] text-slate-600">
                  {GLOSSARY_TERMS.slice(0, 2).map((term, idx) => (
                    <div key={idx} className="truncate">
                      • <span className="font-semibold">{term.term}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-purple-600">
                <span>Edukativni vodič</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ ACCORDION SECTION */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Česta pitanja (FAQ)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Sve što trebate znati o ugovaranju osiguranja
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Odgovori na najčešća pitanja o bonusima, policama i isplati šteta.
          </p>
        </div>

        <div className="space-y-4">
          {FREQUENT_QUESTIONS.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center space-x-4 hover:bg-slate-50 transition-colors"
                >
                  <span className="font-bold text-sm sm:text-base text-slate-900">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-500 shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. FINAL HIGH-CONVERTING CTA BANNER */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-r from-blue-900 to-indigo-950 p-8 sm:p-12 border border-blue-800 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center md:text-left">
              <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider">
                Besplatna podrška licenciranih agenata
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Trebate savjet ili pomoć pri odabiru police?
              </h2>
              <p className="text-slate-300 text-sm max-w-xl">
                Nazovite nas na besplatni info telefon ili pokrenite online usporedbu. Naši agenti
                pronaći će optimalno pokriće prilagođeno vašem budžetu.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
              <a
                href="tel:015550666"
                className="flex items-center justify-center space-x-2 px-6 py-3.5 bg-white text-slate-900 hover:bg-slate-100 rounded-xl font-bold text-sm transition-all shadow-md"
              >
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>01 555 0666</span>
              </a>
              <Button
                variant="emerald"
                size="lg"
                onClick={() => openQuoteWithCategory('auto')}
              >
                <span>Usporedi odmah</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Modal */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        initialCategory={selectedCategory}
      />
    </div>
  );
}
