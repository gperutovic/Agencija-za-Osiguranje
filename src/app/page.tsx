import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Zap,
  TrendingDown,
  Car,
  HeartPulse,
  Home,
  CheckCircle2,
  Clock,
  Sparkles,
  Phone,
  ArrowRight,
  Calculator,
  FileCheck2,
  Star,
  Users,
  Award,
  ChevronDown,
} from 'lucide-react';
import { DopunskoCalculator } from '../components/calculators/DopunskoCalculator';
import { AutoInsuranceCalculator } from '../components/calculators/AutoInsuranceCalculator';
import { ConversationalWizard } from '../components/conversational/ConversationalWizard';
import { CARRIER_PARTNERS, FAQ_DOPUNSKO, FAQ_AUTO, AGENCY_DETAILS } from '../lib/content/insurance-data';
import { JsonLd } from '../components/seo/JsonLd';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'dopunsko' | 'auto'>('dopunsko');
  const [isSavjetnikOpen, setIsSavjetnikOpen] = useState<boolean>(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const homeFaqSchema = {
    '@context': 'https://schema.org' as const,
    '@type': 'FAQPage' as const,
    mainEntity: [...FAQ_DOPUNSKO, ...FAQ_AUTO.slice(0, 2)].map((item) => ({
      '@type': 'Question' as const,
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer' as const,
        text: item.answer,
      },
    })),
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen text-slate-900 selection:bg-[#FF0055] selection:text-white">
      {/* Type-safe FAQ Schema.org injection */}
      <JsonLd schema={homeFaqSchema} />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 bg-gradient-to-b from-white via-slate-50 to-slate-100 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Regulatory Eyebrow Pill */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-mono font-semibold"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>HANFA LICENCA ZO-88912 &bull; SLUŽBENI GENERALI PARTNER</span>
            </motion.div>

            {/* Main Punchy Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 leading-[1.1]"
            >
              Pametno osiguranje za stvaran život.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF0055] to-rose-600">
                Uštedite i ugovorite u 60 sekundi.
              </span>
            </motion.h1>

            {/* Standalone GEO Lead Answer Block for LLM SearchGPT & Perplexity Extraction */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-4 rounded-2xl bg-white/90 border border-slate-200/90 shadow-sm text-sm sm:text-base text-slate-700 text-left sm:text-center leading-relaxed"
            >
              <p>
                <strong>Agencija Život (ŽIVOT d.o.o., Zagreb)</strong> je ovlašteni distributer osiguranja pod nadzorom HANFA-e. Uspoređujemo službene tarife 10 vodećih osiguratelja (Generali, Croatia, Allianz, Wiener). Nakon zakonskog poskupljenja HZZO dopunskog osiguranja na <strong>15,00 € mjesečno</strong> (od 1. veljače 2026.), omogućujemo prelazak na privatne police od <strong>6,50 € mjesečno</strong> uz uštedu do <strong>102 € godišnje</strong> i 100% pokriće participacija te B-liste lijekova.
              </p>
            </motion.div>

            {/* Primary Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"
            >
              <button
                onClick={() => setIsSavjetnikOpen(true)}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#FF0055] hover:bg-[#d90048] text-white font-bold text-base shadow-xl shadow-[#FF0055]/25 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Sparkles className="w-5 h-5" />
                <span>Pokreni Agenta Savjetnika (Maya Engine)</span>
              </button>

              <a
                href="tel:014800120"
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-base border border-slate-200 shadow-sm flex items-center justify-center gap-2 transition-colors"
              >
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>Nazovi brokera: 01 4800 120</span>
              </a>
            </motion.div>

            {/* Key Micro Trust Metrics */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-3 rounded-xl bg-white border border-slate-100 shadow-sm">
                <span className="text-xl font-black text-slate-900 block">14.800+</span>
                <span className="text-xs text-slate-500 font-mono">Ugovorenih polica</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-100 shadow-sm">
                <span className="text-xl font-black text-emerald-600 block">99,4%</span>
                <span className="text-xs text-slate-500 font-mono">Isplaćenih šteta</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-100 shadow-sm">
                <span className="text-xl font-black text-blue-600 block">&lt; 15 min</span>
                <span className="text-xs text-slate-500 font-mono">Brzina izdavanja</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-100 shadow-sm">
                <span className="text-xl font-black text-[#FF0055] block">0 €</span>
                <span className="text-xs text-slate-500 font-mono">Provizija za klijenta</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Switcher Section: 2026 Dopunsko vs Auto Osiguranje */}
      <section className="py-12 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
            Interaktivni aktuarski izračun u stvarnom vremenu
          </span>
          <h2 className="text-3xl font-black text-slate-950">
            Odaberite vrstu osiguranja i provjerite cijenu
          </h2>
          <p className="text-sm text-slate-600">
            Izračunajte točan iznos uštede ili mjesečne rate bez unosa kartice ili obveze.
          </p>

          {/* Tab Selector */}
          <div className="inline-flex p-1.5 rounded-2xl bg-slate-200/80 mt-4">
            <button
              onClick={() => setActiveTab('dopunsko')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'dopunsko'
                  ? 'bg-white text-slate-950 shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <HeartPulse className="w-4 h-4 text-[#FF0055]" />
              <span>2026 Dopunsko zdravstveno (HZZO 15 €)</span>
            </button>

            <button
              onClick={() => setActiveTab('auto')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'auto'
                  ? 'bg-white text-slate-950 shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Car className="w-4 h-4 text-blue-600" />
              <span>Auto osiguranje &amp; Kasko (50% bonusa)</span>
            </button>
          </div>
        </div>

        {/* Render Tab Component */}
        <div className="max-w-5xl mx-auto">
          {activeTab === 'dopunsko' ? (
            <DopunskoCalculator />
          ) : (
            <AutoInsuranceCalculator />
          )}
        </div>
      </section>

      {/* The 4 Pillars & Capabilities Bento Grid */}
      <section className="py-16 bg-white border-y border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600">
              Usluge i pogodnosti
            </span>
            <h2 className="text-3xl font-black text-slate-950">
              Zašto osiguranici u Hrvatskoj biraju Agenciju Život?
            </h2>
            <p className="text-sm text-slate-600">
              Kombiniramo digitalnu brzinu Lemonade platforme sa stručnošću licenciranog brokera.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1 */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#FF0055] flex items-center justify-center font-bold">
                  <HeartPulse className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-950">2026 HZZO Switcher</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Trenutni prelazak s HZZO police (15 €/mj.) na privatnog osiguratelja (od 6,50 €/mj.). Uštedite do 102 € godišnje bez karence uz pokriće B-liste lijekova.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-200">
                <Link
                  to="/dopunsko-zdravstveno"
                  className="text-xs font-bold text-[#FF0055] hover:underline flex items-center gap-1"
                >
                  Saznajte više <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Car className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-950">Toyota VIP Kasko</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Ekskluzivno partnerstvo s Toyota Centrom Zagreb i Generali osiguranjem. Popravak s originalnim OEM dijelovima, zamjenski hibrid i 50% popusta na dom.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-200">
                <Link
                  to="/auto-osiguranje"
                  className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                >
                  Usporedi auto police <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <Home className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-950">Zaštita doma i potresa</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Potpuna pokrivenost stana ili kuće na novu građevinsku vrijednost. Uključuje rizik od potresa, izljev vode i provalu bez skrivenih franšiza.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-200">
                <Link
                  to="/imovina"
                  className="text-xs font-bold text-amber-600 hover:underline flex items-center gap-1"
                >
                  Izračunaj imovinu <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <FileCheck2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-950">24/7 Digitalna šteta</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Prijavite prometnu nezgodu ili štetu na imovini u 3 minute putem pametnog telefona. Pomoć našeg pravnog tima pri brzoj i pravičnoj isplati naknade.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-200">
                <Link
                  to="/prijava-stete"
                  className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
                >
                  Prijavi štetu online <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Semantic Comparison Table: The Honest Comparison */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
            Transparentna analiza tržišta
          </span>
          <h2 className="text-3xl font-black text-slate-950">
            Kako se Agencija Život uspoređuje s drugima?
          </h2>
          <p className="text-sm text-slate-600">
            Nema skrivenih troškova. Sve police imaju istu ili nižu cijenu nego izravno kod osiguratelja.
          </p>
        </div>

        <div className="overflow-x-auto bg-white rounded-3xl border border-slate-200 shadow-sm">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80">
                <th className="p-4 sm:p-5 font-bold text-slate-900">Značajka usluge</th>
                <th className="p-4 sm:p-5 font-bold text-[#FF0055] bg-rose-50/40">
                  Agencija Život (Insurtech)
                </th>
                <th className="p-4 sm:p-5 font-semibold text-slate-600">Klasična poslovnica</th>
                <th className="p-4 sm:p-5 font-semibold text-slate-600">Web oglasnik / Agregator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-4 sm:p-5 font-semibold text-slate-900">Vrijeme izdavanja police</td>
                <td className="p-4 sm:p-5 font-bold text-emerald-700 bg-rose-50/20">
                  Instant (ispod 60 sekundi)
                </td>
                <td className="p-4 sm:p-5 text-slate-600">1 do 3 radna dana (čekanje u redu)</td>
                <td className="p-4 sm:p-5 text-slate-600">Nekoliko sati do 24h</td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-semibold text-slate-900">Prijenos 50% bonusa</td>
                <td className="p-4 sm:p-5 font-bold text-emerald-700 bg-rose-50/20">
                  Automatski (1-klik provjera)
                </td>
                <td className="p-4 sm:p-5 text-slate-600">Potrebna papirnata dokumentacija</td>
                <td className="p-4 sm:p-5 text-slate-600">Djelomično podržano</td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-semibold text-slate-900">Dopunsko zdravstveno</td>
                <td className="p-4 sm:p-5 font-bold text-emerald-700 bg-rose-50/20">
                  Usporedba HZZO vs Privatno od 6,50 €
                </td>
                <td className="p-4 sm:p-5 text-slate-600">Samo ponuda jednog osiguratelja</td>
                <td className="p-4 sm:p-5 text-slate-600">Fokus samo na auto osiguranje</td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-semibold text-slate-900">Asistencija kod štete (FNOL)</td>
                <td className="p-4 sm:p-5 font-bold text-emerald-700 bg-rose-50/20">
                  24/7 digitalna prijava i pravno vođenje
                </td>
                <td className="p-4 sm:p-5 text-slate-600">Samo unutar radnog vremena</td>
                <td className="p-4 sm:p-5 text-slate-600">Preusmjeravaju na osiguratelja</td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-semibold text-slate-900">Agencijska provizija za klijenta</td>
                <td className="p-4 sm:p-5 font-bold text-emerald-700 bg-rose-50/20">
                  0,00 € (Zakonski besplatno)
                </td>
                <td className="p-4 sm:p-5 text-slate-600">0,00 €</td>
                <td className="p-4 sm:p-5 text-slate-600">Moguće skrivene naknade posredovanja</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Partner Carriers */}
      <section className="py-12 bg-slate-100 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
            Ovlašteni ugovorni partneri pod nadzorom HANFA-e
          </span>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {CARRIER_PARTNERS.map((c) => (
              <div
                key={c.id}
                className="px-5 py-3 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-2 text-slate-800 font-extrabold text-sm"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{c.name}</span>
                {c.isPrimaryPartner && (
                  <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                    Glavni partner
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Localized FAQ Accordion */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-500">
            Česta pitanja i odgovori
          </span>
          <h2 className="text-3xl font-black text-slate-950">
            Sve što trebate znati o policama i zakonskim pravima
          </h2>
        </div>

        <div className="space-y-3">
          {[...FAQ_DOPUNSKO, ...FAQ_AUTO.slice(0, 2)].map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-slate-200/80 overflow-hidden transition-all shadow-sm"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left font-bold text-slate-900 flex items-center justify-between gap-4 hover:bg-slate-50"
                >
                  <span className="text-base">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform ${
                      isOpen ? 'rotate-180 text-[#FF0055]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Conversational Modal */}
      <ConversationalWizard
        isOpen={isSavjetnikOpen}
        onClose={() => setIsSavjetnikOpen(false)}
        initialTopic={activeTab === 'dopunsko' ? 'dopunsko' : 'auto'}
      />
    </div>
  );
}
