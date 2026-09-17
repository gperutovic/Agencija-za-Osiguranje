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
  Shield,
  Layers,
} from 'lucide-react';
import { ConversationalHeroFunnel } from '../components/home/ConversationalHeroFunnel';
import { BentoServiceShowcase } from '../components/home/BentoServiceShowcase';
import { DopunskoCalculator } from '../components/calculators/DopunskoCalculator';
import { AutoInsuranceCalculator } from '../components/calculators/AutoInsuranceCalculator';
import { MayaQuoteEngine } from '../components/quote-funnel/MayaQuoteEngine';
import { MultiCarrierComparisonMatrix } from '../components/advisor/MultiCarrierComparisonMatrix';
import { AssignedAdvisorBadge } from '../components/advisor/AssignedAdvisorBadge';
import { ConversationalWizard } from '../components/conversational/ConversationalWizard';
import { useInsurtechStore } from '../store/useInsurtechStore';
import { CARRIER_PARTNERS, FAQ_DOPUNSKO, FAQ_AUTO, AGENCY_DETAILS } from '../lib/content/insurance-data';
import { JsonLd } from '../components/seo/JsonLd';

export default function HomePage() {
  const { advisor, setActiveProduct, setFunnelStep } = useInsurtechStore();
  const [activeTab, setActiveTab] = useState<'maya' | 'dopunsko' | 'auto'>('maya');
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

  const handleHeroCategorySelect = (category: string) => {
    setActiveTab('maya');
    // Scroll smoothly to calculator section
    const calcSection = document.getElementById('kalkulator-sekcija');
    if (calcSection) {
      calcSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-100 selection:bg-teal-600 selection:text-white">
      {/* Type-safe FAQ Schema.org injection */}
      <JsonLd schema={homeFaqSchema} />

      {/* 1. MODULE 2: Progressive Full-Screen Conversational Hero Funnel & OIB Quick-Intake */}
      <ConversationalHeroFunnel onSelectCategory={handleHeroCategorySelect} />

      {/* 2. MODULE 3: Bento Grid Service Showcase */}
      <BentoServiceShowcase />

      {/* 3. Interactive Actuarial Switcher & Maya Engine Section */}
      <section id="kalkulator-sekcija" className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>AKTUARSKI KALKULATOR &bull; UŠTEDA U REALNOM VREMENU</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black font-heading text-slate-950 dark:text-white tracking-tight">
            Izračunajte premiju i usporedite ponude
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Izravni izračuni usklađeni s propisima HANFA-e i važećim tarifnim pravilnicima vodećih osiguratelja.
          </p>

          {/* Module Selector Pills */}
          <div className="inline-flex flex-wrap p-1.5 rounded-2xl bg-slate-200/80 dark:bg-slate-800/80 mt-4 border border-slate-300/60 dark:border-slate-700/60 gap-1.5 justify-center">
            <button
              onClick={() => setActiveTab('maya')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                activeTab === 'maya'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-950'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Maya Engine (OCR Prometna &amp; Lijevak)</span>
            </button>

            <button
              onClick={() => setActiveTab('dopunsko')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                activeTab === 'dopunsko'
                  ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-950'
              }`}
            >
              <HeartPulse className="w-4 h-4 text-rose-600" />
              <span>Dopunsko 2026 (HZZO 15 €)</span>
            </button>

            <button
              onClick={() => setActiveTab('auto')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                activeTab === 'auto'
                  ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-950'
              }`}
            >
              <Car className="w-4 h-4 text-teal-600" />
              <span>Auto kalkulator (50% bonusa)</span>
            </button>
          </div>
        </div>

        {/* Active Engine Viewport */}
        <div className="max-w-5xl mx-auto">
          {activeTab === 'maya' ? (
            <MayaQuoteEngine />
          ) : activeTab === 'dopunsko' ? (
            <DopunskoCalculator />
          ) : (
            <AutoInsuranceCalculator />
          )}
        </div>
      </section>

      {/* 4. MODULE 5: Multi-Carrier Market Comparison Matrix */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MultiCarrierComparisonMatrix />
      </section>

      {/* 5. MODULE 5: Hybrid Advisor Hub ("The Agency Advantage") */}
      <section className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="text-center space-y-2 mb-6">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
            Osobna podrška ovlaštenog brokera
          </span>
          <h3 className="text-2xl sm:text-3xl font-black font-heading text-slate-950 dark:text-white">
            Modern Agency Advantage &bull; Hibridno savjetovanje
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Kombiniramo brzinu digitalnog portala s individualnim pristupom. Vaš dodijeljeni broker stoji vam na raspolaganju bez provizije.
          </p>
        </div>
        <AssignedAdvisorBadge advisor={advisor} />
      </section>

      {/* 6. Honest Comparison: Agency vs Direct vs Generic Aggregators */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
            Transparentna analiza modela ugovaranja
          </span>
          <h2 className="text-3xl font-black font-heading text-slate-950 dark:text-white">
            Zašto ugovoriti putem Agencije za osiguranje?
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Sukladno čl. 401. Zakona o osiguranju, sve police imaju jednaku ili povoljniju cijenu nego u poslovnicama osiguratelja.
          </p>
        </div>

        <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <th className="p-4 sm:p-5 font-bold text-slate-900 dark:text-white">Ugovorni element</th>
                <th className="p-4 sm:p-5 font-bold text-teal-900 dark:text-teal-200 bg-teal-50/70 dark:bg-teal-950/40 border-x border-slate-200 dark:border-slate-800">
                  Agencija za osiguranje (Licencirani broker)
                </th>
                <th className="p-4 sm:p-5 font-semibold text-slate-600 dark:text-slate-400">Klasična poslovnica</th>
                <th className="p-4 sm:p-5 font-semibold text-slate-600 dark:text-slate-400">Generički web agregator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm">
              <tr>
                <td className="p-4 sm:p-5 font-semibold text-slate-900 dark:text-white">Brzina izdavanja police</td>
                <td className="p-4 sm:p-5 font-bold text-teal-700 dark:text-teal-300 bg-teal-50/40 dark:bg-teal-950/20 border-x border-slate-200 dark:border-slate-800">
                  Instant (PDF s QR kodom u 60 sekundi)
                </td>
                <td className="p-4 sm:p-5 text-slate-600 dark:text-slate-400">1 do 3 radna dana (fizički odlazak)</td>
                <td className="p-4 sm:p-5 text-slate-600 dark:text-slate-400">Nekoliko sati do 24h</td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-semibold text-slate-900 dark:text-white">Prijenos 50% bonusa</td>
                <td className="p-4 sm:p-5 font-bold text-teal-700 dark:text-teal-300 bg-teal-50/40 dark:bg-teal-950/20 border-x border-slate-200 dark:border-slate-800">
                  Automatski prijenos u bazi HUO-a
                </td>
                <td className="p-4 sm:p-5 text-slate-600 dark:text-slate-400">Zahtijeva papirnate potvrde</td>
                <td className="p-4 sm:p-5 text-slate-600 dark:text-slate-400">Često uvjetovano dodatnim policama</td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-semibold text-slate-900 dark:text-white">Usporedba dopunskog 2026</td>
                <td className="p-4 sm:p-5 font-bold text-teal-700 dark:text-teal-300 bg-teal-50/40 dark:bg-teal-950/20 border-x border-slate-200 dark:border-slate-800">
                  HZZO 15 € vs Privatno od 9,50 €
                </td>
                <td className="p-4 sm:p-5 text-slate-600 dark:text-slate-400">Nudi samo vlastiti proizvod</td>
                <td className="p-4 sm:p-5 text-slate-600 dark:text-slate-400">Fokus isključivo na auto osiguranje</td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-semibold text-slate-900 dark:text-white">Pomoć kod prijave štete</td>
                <td className="p-4 sm:p-5 font-bold text-teal-700 dark:text-teal-300 bg-teal-50/40 dark:bg-teal-950/20 border-x border-slate-200 dark:border-slate-800">
                  24/7 digitalni FNOL &amp; vođenje spisa do isplate
                </td>
                <td className="p-4 sm:p-5 text-slate-600 dark:text-slate-400">Samo unutar radnog vremena</td>
                <td className="p-4 sm:p-5 text-slate-600 dark:text-slate-400">Korisnik se upućuje na osiguratelja</td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-semibold text-slate-900 dark:text-white">Agencijska provizija (čl. 401.)</td>
                <td className="p-4 sm:p-5 font-bold text-teal-700 dark:text-teal-300 bg-teal-50/40 dark:bg-teal-950/20 border-x border-slate-200 dark:border-slate-800">
                  0,00 € (Zakonski besplatno za osiguranika)
                </td>
                <td className="p-4 sm:p-5 text-slate-600 dark:text-slate-400">0,00 €</td>
                <td className="p-4 sm:p-5 text-slate-600 dark:text-slate-400">0,00 € uz moguće administrativne naknade</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 7. Partner Carriers Banner */}
      <section className="py-12 bg-slate-100 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
            Ovlašteni ugovorni partneri pod nadzorom HANFA-e
          </span>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
            {CARRIER_PARTNERS.map((c) => (
              <div
                key={c.id}
                className="px-5 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-2 text-slate-800 dark:text-slate-200 font-black text-sm"
              >
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>{c.name}</span>
                {c.isPrimaryPartner && (
                  <span className="text-[10px] font-mono bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 px-2 py-0.5 rounded-full font-bold">
                    Glavni partner
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FAQ Module */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
            Česta pitanja osiguranika
          </span>
          <h2 className="text-3xl font-black font-heading text-slate-950 dark:text-white">
            Informacije o ugovaranju polica i zakonskim pravima
          </h2>
        </div>

        <div className="space-y-3">
          {[...FAQ_DOPUNSKO, ...FAQ_AUTO.slice(0, 2)].map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden transition-all shadow-sm"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left font-bold text-slate-900 dark:text-white flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <span className="text-base">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform ${
                      isOpen ? 'rotate-180 text-teal-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
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
