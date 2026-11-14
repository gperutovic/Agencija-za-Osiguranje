import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Car,
  HeartPulse,
  Home,
  FileWarning,
  ArrowRight,
  CheckCircle2,
  Clock,
  Phone,
  ChevronDown,
  FileCheck2,
  Building2,
} from 'lucide-react';
import { DopunskoCalculator } from '../components/calculators/DopunskoCalculator';
import { AutoInsuranceCalculator } from '../components/calculators/AutoInsuranceCalculator';
import { PropertyCalculator } from '../components/calculators/PropertyCalculator';
import { ConversationalWizard } from '../components/conversational/ConversationalWizard';
import {
  CARRIER_PARTNERS,
  FAQ_DOPUNSKO,
  FAQ_AUTO,
  AGENCY_DETAILS,
} from '../lib/content/insurance-data';
import { JsonLd } from '../components/seo/JsonLd';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'dopunsko' | 'auto' | 'imovina'>('dopunsko');
  const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const combinedFaqs = [...FAQ_DOPUNSKO.slice(0, 3), ...FAQ_AUTO.slice(0, 2)];

  const homeFaqSchema = {
    '@context': 'https://schema.org' as const,
    '@type': 'FAQPage' as const,
    mainEntity: combinedFaqs.map((item) => ({
      '@type': 'Question' as const,
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer' as const,
        text: item.answer,
      },
    })),
  };

  return (
    <div className="w-full bg-slate-50 text-slate-900">
      <JsonLd schema={homeFaqSchema} />

      {/* Editorial Split Hero */}
      <section className="bg-white border-b border-slate-200 pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-100 border border-slate-200 text-[#0F2942] text-xs font-semibold tracking-wide">
                <Building2 className="w-3.5 h-3.5" />
                <span>Agencija Život • Ovlašteni zastupnik u osiguranju</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-950 leading-[1.15]">
                Jasna usporedba i ugovaranje osiguranja bez suvišnih troškova
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                Usporedite uvjete i cijene vodećih osiguravajućih društava u Hrvatskoj za vaše vozilo,
                zdravlje i dom. Savjetovanje i obrada dokumentacije za klijente su u potpunosti besplatni.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#kalkulator"
                  className="px-6 py-3 rounded-lg bg-[#0F2942] hover:bg-[#163859] text-white font-semibold text-sm shadow-sm inline-flex items-center gap-2 transition-colors"
                >
                  <span>Izračunajte informativnu ponudu</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <button
                  type="button"
                  onClick={() => setIsWizardOpen(true)}
                  className="px-6 py-3 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm transition-colors cursor-pointer"
                >
                  Vođeni odabir police
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-3 text-xs text-slate-600">
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  Usporedba 6 vodećih osiguratelja
                </span>
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  Prijenos do 50% bonusa na auto polici
                </span>
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  Podrška pri prijavi i obradi štete
                </span>
              </div>
            </div>

            {/* Right Quick Product Directory Card */}
            <div className="lg:col-span-5">
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <h2 className="text-sm font-bold text-slate-900">Brzi pristup kalkulatorima</h2>
                  <span className="text-xs text-slate-500">Odaberite područje</span>
                </div>

                <Link
                  to="/auto-osiguranje"
                  className="flex items-center justify-between p-3.5 rounded-lg bg-white border border-slate-200 hover:border-[#0F2942] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 group-hover:bg-[#0F2942] text-[#0F2942] group-hover:text-white flex items-center justify-center transition-colors">
                      <Car className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">Auto i kasko osiguranje</div>
                      <div className="text-xs text-slate-500">AO, puni kasko i Toyota VIP program</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#0F2942]" />
                </Link>

                <Link
                  to="/dopunsko-zdravstveno"
                  className="flex items-center justify-between p-3.5 rounded-lg bg-white border border-slate-200 hover:border-[#0F2942] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 group-hover:bg-[#0F2942] text-[#0F2942] group-hover:text-white flex items-center justify-center transition-colors">
                      <HeartPulse className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">Dopunsko zdravstveno (2026.)</div>
                      <div className="text-xs text-slate-500">Usporedba s HZZO policom (15,00 € / mj.)</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#0F2942]" />
                </Link>

                <Link
                  to="/imovina"
                  className="flex items-center justify-between p-3.5 rounded-lg bg-white border border-slate-200 hover:border-[#0F2942] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 group-hover:bg-[#0F2942] text-[#0F2942] group-hover:text-white flex items-center justify-center transition-colors">
                      <Home className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">Osiguranje doma i od potresa</div>
                      <div className="text-xs text-slate-500">Stan, kuća, stvari i izljev vode</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#0F2942]" />
                </Link>

                <Link
                  to="/prijava-stete"
                  className="flex items-center justify-between p-3.5 rounded-lg bg-red-50/60 border border-red-200 hover:border-red-300 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white text-[#B91C1C] border border-red-200 flex items-center justify-center">
                      <FileWarning className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#991B1B]">Prijava štete i provjera statusa</div>
                      <div className="text-xs text-red-800/80">Elektronička prijava i asistencija u postupku</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#B91C1C]" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Monochrome Partner Trust Bar */}
      <section className="bg-slate-50 border-b border-slate-200 py-7">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 shrink-0">
              Strateški partneri i osiguratelji:
            </span>
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-8 gap-y-3 text-slate-700 font-semibold text-sm">
              <span className="text-slate-900">Generali osiguranje d.d.</span>
              <span className="text-slate-900">Toyota Centar Zagreb</span>
              <span className="text-slate-600">Croatia osiguranje</span>
              <span className="text-slate-600">Allianz Hrvatska</span>
              <span className="text-slate-600">Wiener osiguranje</span>
              <span className="text-slate-600">Triglav osiguranje</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tangible Service Pillars (No unverified vanity metrics) */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <Clock className="w-5 h-5 text-[#0F2942]" />
              <h3 className="text-sm font-bold text-slate-900">Obrada upita unutar 24 sata</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Svaki informativni zahtjev pregledava licencirani zastupnik i šalje usporedivu ponudu na e-mail.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <ShieldCheck className="w-5 h-5 text-[#0F2942]" />
              <h3 className="text-sm font-bold text-slate-900">0 € agencijske naknade</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Cijene polica jednake su službenim tarifama osiguravajućih društava, bez ikakvih nadoplata za klijenta.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <FileCheck2 className="w-5 h-5 text-[#0F2942]" />
              <h3 className="text-sm font-bold text-slate-900">Predugovorna jasnoća (IPID)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Prije ugovaranja dobivate sažetak uvjeta, franšiza i isključenja kako biste donijeli informiranu odluku.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <FileWarning className="w-5 h-5 text-[#0F2942]" />
              <h3 className="text-sm font-bold text-slate-900">Asistencija pri prijavi štete</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pomažemo u prikupljanju dokumentacije, dogovoru izvida i praćenju rješavanja predmeta do isplate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Calculator Section */}
      <section id="kalkulator" className="py-16 sm:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Informativni kalkulatori
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Izračunajte okvirnu premiju prema vašim parametrima
              </h2>
              <p className="text-sm text-slate-600">
                Odaberite program osiguranja, prilagodite pokrića i pošaljite upit za službenu ponudu partnerskih društava.
              </p>
            </div>

            {/* Calculator Switcher */}
            <div className="inline-flex p-1 bg-white rounded-xl border border-slate-200 shadow-sm self-start">
              <button
                type="button"
                onClick={() => setActiveTab('dopunsko')}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                  activeTab === 'dopunsko'
                    ? 'bg-[#0F2942] text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Dopunsko zdravstveno
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('auto')}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                  activeTab === 'auto'
                    ? 'bg-[#0F2942] text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Auto i kasko
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('imovina')}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                  activeTab === 'imovina'
                    ? 'bg-[#0F2942] text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Imovina i dom
              </button>
            </div>
          </div>

          {activeTab === 'dopunsko' && <DopunskoCalculator />}
          {activeTab === 'auto' && <AutoInsuranceCalculator />}
          {activeTab === 'imovina' && <PropertyCalculator />}
        </div>
      </section>

      {/* Partner Insurers Overview */}
      <section className="py-16 bg-white border-t border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Partnerska društva
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Osiguravajuća društva u našoj ponudi
              </h2>
            </div>
            <Link
              to="/o-nama"
              className="text-sm font-semibold text-[#0F2942] hover:underline inline-flex items-center gap-1"
            >
              <span>Više o našem strateškom partnerstvu</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {CARRIER_PARTNERS.map((carrier) => (
              <div
                key={carrier.id}
                className={`p-5 rounded-xl border bg-slate-50/70 space-y-2.5 ${
                  carrier.isPrimaryPartner ? 'border-[#0F2942]' : 'border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base font-bold text-slate-900">{carrier.name}</h3>
                  {carrier.isPrimaryPartner && (
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#0F2942] text-white shrink-0">
                      Strateški partner
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{carrier.highlight}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Česta pitanja
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Odgovori na najčešća pitanja osiguranika
            </h2>
          </div>

          <div className="space-y-3">
            {combinedFaqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm sm:text-base font-semibold text-slate-900">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 shrink-0 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Direct Consultation Strip */}
      <section className="py-14 bg-[#0F2942] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h2 className="text-2xl font-bold text-white">
              Želite osobnu usporedbu postojećih polica?
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Pošaljite upit za pregled postojećeg osiguranja vozila, imovine ili poslovanja ili nas nazovite u ured u Zagrebu ({AGENCY_DETAILS.address}).
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="tel:+38514800120"
              className="px-5 py-3 rounded-lg bg-white text-[#0F2942] hover:bg-slate-100 font-semibold text-sm inline-flex items-center gap-2 transition-colors tabular-nums"
            >
              <Phone className="w-4 h-4" />
              <span>{AGENCY_DETAILS.phone}</span>
            </a>
            <Link
              to="/contact"
              className="px-5 py-3 rounded-lg border border-white/25 hover:bg-white/10 text-white font-semibold text-sm transition-colors"
            >
              Pošaljite upit uredu
            </Link>
          </div>
        </div>
      </section>

      {/* Guided Intake Modal */}
      <ConversationalWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
      />
    </div>
  );
}
