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
  Building,
  Lock,
  FileText,
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
    <div className="w-full bg-slate-50 min-h-screen text-slate-900 selection:bg-slate-900 selection:text-white">
      {/* Type-safe FAQ Schema.org injection */}
      <JsonLd schema={homeFaqSchema} />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 bg-gradient-to-b from-white via-slate-50 to-slate-100 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            {/* Regulatory Eyebrow Pill */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/90 text-slate-800 text-xs font-mono font-bold shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>HANFA LICENCA ZO-88912 &bull; GENERALI OSIGURANJE PARTNER</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 leading-[1.15]"
            >
              Stručno savjetovanje i digitalno ugovaranje osiguranja.{' '}
              <span className="text-[#0F172A] underline decoration-rose-500 decoration-4 underline-offset-4">
                Uštedite bez agencijske provizije.
              </span>
            </motion.h1>

            {/* Standalone GEO Lead Answer Block for LLM SearchGPT & Perplexity Extraction */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm text-sm sm:text-base text-slate-700 text-left sm:text-center leading-relaxed"
            >
              <p>
                <strong>Agencija Život (ŽIVOT d.o.o., Zagreb)</strong> je ovlašteni distributer osiguranja pod nadzorom HANFA-e (Registar ZO-88912). Uspoređujemo aktuarske tarife vodećih hrvatskih osiguratelja (Generali, Croatia, Allianz, Wiener). Nakon zakonskog poskupljenja HZZO dopunskog osiguranja na <strong>15,00 € mjesečno</strong> (od 1. veljače 2026.), osiguravamo prelazak na privatne police od <strong>6,50 € mjesečno</strong> uz godišnju uštedu do <strong>102,00 €</strong>, 100% pokriće participacija, dopunsku B-listu lijekova i 0 € provizije za klijenta.
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
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold text-sm sm:text-base shadow-lg shadow-slate-900/15 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                <Sparkles className="w-5 h-5 text-blue-400" />
                <span>Pokreni digitalnog savjetnika (Online izračun)</span>
              </button>

              <a
                href={`tel:${AGENCY_DETAILS.phone.replace(/\s+/g, '')}`}
                className="w-full sm:w-auto px-6 py-4 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm sm:text-base border border-slate-300 shadow-sm flex items-center justify-center gap-2 transition-colors"
              >
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>Savjetovanje s brokerom: {AGENCY_DETAILS.phone}</span>
              </a>
            </motion.div>

            {/* Verified Institutional Performance Metrics */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                <span className="text-2xl font-black text-slate-900 block font-mono">14.800+</span>
                <span className="text-xs text-slate-500 font-medium">Aktivnih polica osiguranja</span>
              </div>
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                <span className="text-2xl font-black text-emerald-600 block font-mono">99,4%</span>
                <span className="text-xs text-slate-500 font-medium">Uspješno likvidiranih šteta</span>
              </div>
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                <span className="text-2xl font-black text-blue-600 block font-mono">&lt; 15 min</span>
                <span className="text-xs text-slate-500 font-medium">Prosječno vrijeme obrade</span>
              </div>
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                <span className="text-2xl font-black text-slate-900 block font-mono">0,00 €</span>
                <span className="text-xs text-slate-500 font-medium">Agencijska naknada za klijenta</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Actuarial Switcher Section */}
      <section className="py-12 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
            Aktuarski modul za usporedbu i izračun polica
          </span>
          <h2 className="text-3xl font-black text-slate-950">
            Izračunajte premiju i provjerite uštedu u stvarnom vremenu
          </h2>
          <p className="text-sm text-slate-600">
            Službeni izračuni usklađeni s propisima HANFA-e i važećim tarifnim pravilnicima osiguratelja.
          </p>

          {/* Module Selector */}
          <div className="inline-flex p-1.5 rounded-2xl bg-slate-200/80 mt-4 border border-slate-300/60">
            <button
              onClick={() => setActiveTab('dopunsko')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'dopunsko'
                  ? 'bg-white text-slate-950 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <HeartPulse className="w-4 h-4 text-rose-600" />
              <span>Dopunsko 2026 (HZZO 15 € vs Privatno)</span>
            </button>

            <button
              onClick={() => setActiveTab('auto')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'auto'
                  ? 'bg-white text-slate-950 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Car className="w-4 h-4 text-blue-600" />
              <span>Auto osiguranje (50% bonusa &amp; Toyota Kasko)</span>
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

      {/* The 4 Pillars & Institutional Capabilities */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-700">
              Usluge i ovlaštenja
            </span>
            <h2 className="text-3xl font-black text-slate-950">
              Zašto klijenti i pravne osobe biraju Agenciju Život?
            </h2>
            <p className="text-sm text-slate-600">
              Kombinacija digitalne brzine i dugogodišnjeg aktuarskog iskustva pod nadzorom HANFA-e.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between hover:border-slate-300 transition-all shadow-sm">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                  <HeartPulse className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-950">2026 HZZO Switcher</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Automatski prijelaz s HZZO police (15,00 €/mj.) na privatne police (od 6,50 €/mj.). Uštedite do 102 € godišnje uz 0 dana karence i uključenu dopunsku B-listu lijekova.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-200">
                <Link
                  to="/dopunsko-zdravstveno"
                  className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1"
                >
                  Usporedi police zdravstva <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between hover:border-slate-300 transition-all shadow-sm">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Car className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-950">Toyota Centar Zagreb VIP</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Ekskluzivno ugovorno partnerstvo s Toyota Centrom Zagreb i Generali osiguranjem. Popravak u ovlaštenom servisu s originalnim dijelovima, zamjenski hibrid i fiksna franšiza.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-200">
                <Link
                  to="/auto-osiguranje"
                  className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                >
                  Toyota VIP program <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between hover:border-slate-300 transition-all shadow-sm">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <Home className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-950">Imovina &amp; Rizik od potresa</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Osiguranje stana i obiteljske kuće na novu građevinsku vrijednost. Uključuje potres, izljev vode i provalu bez skrivenih odbitaka i amortizacijskih umanjenja.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-200">
                <Link
                  to="/imovina"
                  className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1"
                >
                  Izračunaj imovinu <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between hover:border-slate-300 transition-all shadow-sm">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <FileCheck2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-950">24/7 Digitalni centar šteta</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Prijava prometne nezgode ili oštećenja imovine putem pametnog telefona. Stručna pravna asistencija i nadzor naših licenciranih likvidatora do konačne isplate naknade.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-200">
                <Link
                  to="/prijava-stete"
                  className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
                >
                  Prijava štete online <ArrowRight className="w-3.5 h-3.5" />
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
            Transparentna analiza modela ugovaranja
          </span>
          <h2 className="text-3xl font-black text-slate-950">
            Usporedba Agencije Život s klasičnim modelima
          </h2>
          <p className="text-sm text-slate-600">
            Sukladno čl. 401. Zakona o osiguranju, sve police imaju jednaku ili povoljniju cijenu nego u poslovnicama.
          </p>
        </div>

        <div className="overflow-x-auto bg-white rounded-2xl border border-slate-200 shadow-sm">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="p-4 sm:p-5 font-bold text-slate-900">Ugovorni element</th>
                <th className="p-4 sm:p-5 font-bold text-slate-950 bg-slate-100/70 border-x border-slate-200">
                  Agencija Život (Licencirani broker)
                </th>
                <th className="p-4 sm:p-5 font-semibold text-slate-600">Klasična poslovnica</th>
                <th className="p-4 sm:p-5 font-semibold text-slate-600">Generički web agregator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-4 sm:p-5 font-semibold text-slate-900">Brzina izdavanja police</td>
                <td className="p-4 sm:p-5 font-bold text-emerald-700 bg-slate-50/50 border-x border-slate-200">
                  Instant (PDF s QR kodom u 60 sekundi)
                </td>
                <td className="p-4 sm:p-5 text-slate-600">1 do 3 radna dana (fizički odlazak)</td>
                <td className="p-4 sm:p-5 text-slate-600">Nekoliko sati do 24h</td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-semibold text-slate-900">Prijenos 50% bonusa</td>
                <td className="p-4 sm:p-5 font-bold text-emerald-700 bg-slate-50/50 border-x border-slate-200">
                  Automatski prijenos u bazi HUO-a
                </td>
                <td className="p-4 sm:p-5 text-slate-600">Zahtijeva papirnate potvrde</td>
                <td className="p-4 sm:p-5 text-slate-600">Često uvjetovano dodatnim policama</td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-semibold text-slate-900">Usporedba dopunskog 2026</td>
                <td className="p-4 sm:p-5 font-bold text-emerald-700 bg-slate-50/50 border-x border-slate-200">
                  HZZO 15 € vs Privatno od 6,50 €
                </td>
                <td className="p-4 sm:p-5 text-slate-600">Nudi samo vlastiti proizvod</td>
                <td className="p-4 sm:p-5 text-slate-600">Fokus isključivo na auto osiguranje</td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-semibold text-slate-900">Pravna asistencija kod štete</td>
                <td className="p-4 sm:p-5 font-bold text-emerald-700 bg-slate-50/50 border-x border-slate-200">
                  24/7 digitalna prijava i vođenje spisa
                </td>
                <td className="p-4 sm:p-5 text-slate-600">Samo unutar radnog vremena</td>
                <td className="p-4 sm:p-5 text-slate-600">Korisnik se upućuje na osiguratelja</td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-semibold text-slate-900">Provizija za klijenta (čl. 401.)</td>
                <td className="p-4 sm:p-5 font-bold text-emerald-700 bg-slate-50/50 border-x border-slate-200">
                  0,00 € (Zakonski besplatno)
                </td>
                <td className="p-4 sm:p-5 text-slate-600">0,00 €</td>
                <td className="p-4 sm:p-5 text-slate-600">0,00 € uz moguće administrativne naknade</td>
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
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
            {CARRIER_PARTNERS.map((c) => (
              <div
                key={c.id}
                className="px-5 py-3 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-2 text-slate-800 font-extrabold text-sm"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{c.name}</span>
                {c.isPrimaryPartner && (
                  <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                    Glavni partner
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Module */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
            Česta pitanja osiguranika
          </span>
          <h2 className="text-3xl font-black text-slate-950">
            Informacije o ugovaranju polica i zakonskim pravima
          </h2>
        </div>

        <div className="space-y-3">
          {[...FAQ_DOPUNSKO, ...FAQ_AUTO.slice(0, 2)].map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-slate-200 overflow-hidden transition-all shadow-sm"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left font-bold text-slate-900 flex items-center justify-between gap-4 hover:bg-slate-50"
                >
                  <span className="text-base">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform ${
                      isOpen ? 'rotate-180 text-blue-600' : ''
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
