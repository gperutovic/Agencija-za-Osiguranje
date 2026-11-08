import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Zap,
  Car,
  HeartPulse,
  Home,
  CheckCircle2,
  Clock,
  Sparkles,
  Phone,
  ArrowRight,
  Calculator,
  Award,
  ChevronDown,
  Bot,
  AlertTriangle,
  FilePlus2,
  Sliders,
} from 'lucide-react';
import { BentoServiceShowcase } from '../components/home/BentoServiceShowcase';
import { DopunskoCalculator } from '../components/calculators/DopunskoCalculator';
import { AutoInsuranceCalculator } from '../components/calculators/AutoInsuranceCalculator';
import { MayaQuoteEngine } from '../components/quote-funnel/MayaQuoteEngine';
import { MultiCarrierComparisonMatrix } from '../components/advisor/MultiCarrierComparisonMatrix';
import { AssignedAdvisorBadge } from '../components/advisor/AssignedAdvisorBadge';
import { ConversationalWizard } from '../components/conversational/ConversationalWizard';
import { useInsurtechStore } from '../store/useInsurtechStore';
import { CARRIER_PARTNERS, FAQ_DOPUNSKO, FAQ_AUTO } from '../lib/content/insurance-data';
import { JsonLd } from '../components/seo/JsonLd';
import { formatEUR } from '../utils/validators';
import { InsuranceProductType } from '../types/insurance';

export default function HomePage() {
  const navigate = useNavigate();
  const { advisor, setPrefilledQuoteTransfer } = useInsurtechStore();

  // Interactive Multi-Tier Premium Calculator state (Vehicle / Property / Life)
  const [comparatorCategory, setComparatorCategory] = useState<'vozila' | 'imovina' | 'zivot'>('vozila');
  const [vehicleKw, setVehicleKw] = useState<number>(105);
  const [vehicleValueEur, setVehicleValueEur] = useState<number>(28000);
  const [bonusPercent, setBonusPercent] = useState<number>(50);
  const [propertyM2, setPropertyM2] = useState<number>(80);
  const [lifeSumEur, setLifeSumEur] = useState<number>(40000);

  // Preserved legacy calculator switcher state
  const [activeTab, setActiveTab] = useState<'maya' | 'dopunsko' | 'auto'>('maya');
  const [isSavjetnikOpen, setIsSavjetnikOpen] = useState<boolean>(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Actuarial 3-Tier Calculation (Osnovni, Komfort, Ekskluziv / Full Kasko)
  const computeTiers = () => {
    if (comparatorCategory === 'vozila') {
      const baseAo = (115 + vehicleKw * 1.45) * (1 - bonusPercent / 100);
      const osnovniAnnual = Math.round((baseAo + 19) * 100) / 100;
      const komfortAnnual = Math.round((baseAo + 68 + vehicleValueEur * 0.0085) * 100) / 100;
      const ekskluzivAnnual = Math.round((baseAo + 115 + vehicleValueEur * 0.0185) * 100) / 100;

      return [
        {
          id: 'osnovni',
          name: 'Osnovni (AO + Pomoć HR)',
          badge: 'ZAKONSKI MINIMUM',
          annualEur: osnovniAnnual,
          deductibleEur: 300,
          limitEur: 6450000,
          productType: 'auto' as InsuranceProductType,
          features: [
            'Obvezno automobilsko osiguranje (AO)',
            `Obračunat bonus ${bonusPercent}% (B10)`,
            'Međunarodna Zelena karta (EU + regija)',
            'Osnovna pomoć na cesti u RH (do 150 km)',
            'Osiguranje vozača i putnika (10.000 €)',
          ],
        },
        {
          id: 'komfort',
          name: 'Komfort (AO + Mini Kasko & Stakla)',
          badge: 'NAJČEŠĆI ODABIR',
          recommended: true,
          annualEur: komfortAnnual,
          deductibleEur: 150,
          limitEur: vehicleValueEur,
          productType: 'kasko' as InsuranceProductType,
          features: [
            'Sve iz paketa Osnovni + Zaštita bonusa 50%',
            'Lom svih stakala bez gubitka bonusa',
            'Tuča, oluja, požar i nalet na divljač',
            'Asistencija na cesti 24/7 (Hrvatska + EU)',
            'Zamjensko vozilo do 5 dana',
          ],
        },
        {
          id: 'ekskluziv',
          name: 'Ekskluziv / Full Kasko (Generali × Toyota)',
          badge: 'PUNA OEM ZAŠTITA',
          annualEur: ekskluzivAnnual,
          deductibleEur: 0,
          limitEur: vehicleValueEur,
          productType: 'kasko' as InsuranceProductType,
          features: [
            'Obvezno AO + Puni Kasko bez franšize (0 €)',
            'Popravak s originalnim OEM dijelovima (Toyota Centar Zagreb)',
            'Krađa vozila, vandalizam i oštećenje na parkingu',
            'Zaštita visokonaponske Hybrid/EV baterije',
            'Zamjensko vozilo tijekom cijelog popravka',
          ],
        },
      ];
    }

    if (comparatorCategory === 'imovina') {
      const baseProp = propertyM2 * 1.55;
      const osnovniAnnual = Math.round(baseProp * 100) / 100;
      const komfortAnnual = Math.round((baseProp + propertyM2 * 0.75 + 38) * 100) / 100;
      const ekskluzivAnnual = Math.round((baseProp + propertyM2 * 1.45 + 79) * 100) / 100;

      return [
        {
          id: 'osnovni',
          name: 'Osnovni (Građevinski dio)',
          badge: 'OSNOVNA ZAŠTITA',
          annualEur: osnovniAnnual,
          deductibleEur: 150,
          limitEur: propertyM2 * 1500,
          productType: 'property' as InsuranceProductType,
          features: [
            `Građevinska vrijednost (${propertyM2} m²)`,
            'Požar, udar groma, eksplozija i oluja',
            'Izljev vode iz vodovodnih instalacija',
            'Hitne kućne intervencije (vodoinstalater/bravar)',
          ],
        },
        {
          id: 'komfort',
          name: 'Komfort (Dom + Stvari kućanstva)',
          badge: 'PREPORUČENO',
          recommended: true,
          annualEur: komfortAnnual,
          deductibleEur: 100,
          limitEur: propertyM2 * 1850,
          productType: 'property' as InsuranceProductType,
          features: [
            'Sve iz paketa Osnovni + Stvari kućanstva na novu vrijednost',
            'Provalna krađa, razbojništvo i vandalizam',
            'Lom svih stakala i sanitarija u objektu',
            'Odgovornost vlasnika nekretnine prema trećima (30.000 €)',
          ],
        },
        {
          id: 'ekskluziv',
          name: 'Ekskluziv (All-Risk + Potres & Poplava)',
          badge: 'MAKSIMALNI ŠTIT',
          annualEur: ekskluzivAnnual,
          deductibleEur: 0,
          limitEur: propertyM2 * 2200,
          productType: 'property' as InsuranceProductType,
          features: [
            'Potres na novu građevinsku vrijednost (građevina + stvari)',
            'Poplava, bujica, visoke vode i klizanje tla',
            'Indirektni udar groma i kvar kućanskih uređaja',
            'Smještaj obitelji u slučaju neuporabljivosti objekta',
            '0 € franšiza na osnovne i dopunske rizike',
          ],
        },
      ];
    }

    // Životno osiguranje & Životni kasko
    const baseLife = (lifeSumEur / 1000) * 6.2;
    const osnovniAnnual = Math.round(baseLife * 100) / 100;
    const komfortAnnual = Math.round((baseLife * 1.38 + 42) * 100) / 100;
    const ekskluzivAnnual = Math.round((baseLife * 1.85 + 88) * 100) / 100;

    return [
      {
        id: 'osnovni',
        name: 'Osnovni (Riziko zaštita)',
        badge: 'FINANCIJSKA SIGURNOST',
        annualEur: osnovniAnnual,
        deductibleEur: 0,
        limitEur: lifeSumEur,
        productType: 'life' as InsuranceProductType,
        features: [
          `Osigurana svota za slučaj smrti (${formatEUR(lifeSumEur)})`,
          'Pokriće za kreditne obveze i zaštitu obitelji',
          'Fiksna premija tijekom cijelog trajanja ugovora',
          'Brza isplata korisnicima bez ostavinskog postupka',
        ],
      },
      {
        id: 'komfort',
        name: 'Komfort (Životni Kasko + Nezgoda)',
        badge: 'NAJTRAŽENIJE',
        recommended: true,
        annualEur: komfortAnnual,
        deductibleEur: 0,
        limitEur: lifeSumEur,
        productType: 'life' as InsuranceProductType,
        features: [
          `Sve iz paketa Osnovni (${formatEUR(lifeSumEur)})`,
          `Dvostruka isplata za smrt uslijed nezgode (${formatEUR(lifeSumEur * 2)})`,
          'Trajni invaliditet uslijed nezgode od 1% nadalje',
          'Dnevna naknada za boravak u bolnici i lom kostiju',
        ],
      },
      {
        id: 'ekskluziv',
        name: 'Ekskluziv (Generali ProLife + Teške bolesti)',
        badge: 'VIP ZAŠTITA',
        annualEur: ekskluzivAnnual,
        deductibleEur: 0,
        limitEur: lifeSumEur,
        productType: 'life' as InsuranceProductType,
        features: [
          'Sve iz paketa Komfort + Pokriće za 25 teških bolesti',
          'Drugo liječničko mišljenje vodećih svjetskih klinika',
          'Oslobođenje od plaćanja premije u slučaju invaliditeta',
          'Uključen godišnji preventivni sistematski pregled',
        ],
      },
    ];
  };

  const tiers = computeTiers();

  const handleTransferToQuote = (tier: (typeof tiers)[0]) => {
    setPrefilledQuoteTransfer({
      productType: tier.productType,
      tierName: tier.name,
      estimatedAnnualEur: tier.annualEur,
      deductibleEur: tier.deductibleEur,
      coverageLimitEur: tier.limitEur,
      riders: tier.features,
      kwPower: comparatorCategory === 'vozila' ? vehicleKw : undefined,
      areaM2: comparatorCategory === 'imovina' ? propertyM2 : undefined,
    });
    navigate('/zatrazi-ponudu');
  };

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
    <div className="w-full bg-[#F8FAFC] min-h-screen text-[#0F172A]">
      <JsonLd schema={homeFaqSchema} />

      {/* 1. INSTITUTIONAL HERO SECTION: Generali Heritage Crimson × Toyota Precision Slate */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#F8FAFC] to-[#F8FAFC] border-b border-[#E2E8F0] pt-10 pb-16 lg:pt-14 lg:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Dual Trust Badges, Headline & Instant Action Triggers */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Dual Official Partner Trust Badges */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FEF2F2] text-[#C21817] border border-[#FECACA] text-xs font-mono font-bold shadow-xs">
                  <ShieldCheck className="w-4 h-4 text-[#C21817]" />
                  <span>Generali Osiguranje Official Partner</span>
                </span>
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F172A] text-white border border-slate-700 text-xs font-mono font-bold shadow-xs">
                  <Car className="w-4 h-4 text-[#F87171]" />
                  <span>Toyota Centar Zagreb Partner</span>
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-extrabold text-[#0F172A] tracking-tight leading-[1.12]">
                Digitalna Agencija za Osiguranje —{' '}
                <span className="text-[#C21817]">Sigurnost bez kompromisa.</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
                <strong>AGENCIJA ŽIVOT (ŽIVOT d.o.o. za zastupanje u osiguranju)</strong> povezuje stoljetnu tradiciju{' '}
                <strong>Generali osiguranja d.d.</strong> i vrhunsku mobilnost <strong>Toyota Centra Zagreb</strong>.
                Usporedite pakete u stvarnom vremenu, ugovorite policu s 0 € provizije i upravljajte štetama u 5 transparentnih faza.
              </p>

              {/* Instant Action Triggers */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  to="/zatrazi-ponudu"
                  className="px-6 py-3.5 rounded-xl bg-[#C21817] hover:bg-[#991B1B] text-white font-bold text-sm shadow-crimson-glow flex items-center gap-2 transition-all"
                >
                  <FilePlus2 className="w-4 h-4" />
                  <span>Zatraži ponudu (IDD Izračun)</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/toyota-partnerstvo"
                  className="px-5 py-3.5 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold text-sm flex items-center gap-2 transition-all"
                >
                  <Car className="w-4 h-4 text-[#F87171]" />
                  <span>Toyota Osiguranje Hub</span>
                </Link>

                <Link
                  to="/prijava-stete"
                  className="px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-[#0F172A] border border-[#E2E8F0] font-bold text-sm flex items-center gap-2 transition-all shadow-xs"
                >
                  <AlertTriangle className="w-4 h-4 text-[#C21817]" />
                  <span>Prijava štete (FNOL)</span>
                </Link>
              </div>

              {/* Live Agency SLA Metrics Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
                <div className="p-3.5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs">
                  <div className="text-[10px] font-mono uppercase text-slate-500 font-bold">SLA Odgovor na upit</div>
                  <div className="text-lg font-extrabold font-mono text-[#C21817] tabular-nums">&lt; 15 min</div>
                  <div className="text-[11px] text-slate-500">Diana, Hrvoje &amp; Laura</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs">
                  <div className="text-[10px] font-mono uppercase text-slate-500 font-bold">Obrada FNOL štete</div>
                  <div className="text-lg font-extrabold font-mono text-[#0F172A] tabular-nums">24h izvid</div>
                  <div className="text-[11px] text-slate-500">5 faza praćenja uživo</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs">
                  <div className="text-[10px] font-mono uppercase text-slate-500 font-bold">Toyota OEM dijelovi</div>
                  <div className="text-lg font-extrabold font-mono text-[#0F172A] tabular-nums">100% Jamstvo</div>
                  <div className="text-[11px] text-slate-500">Toyota Centar Zagreb</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs">
                  <div className="text-[10px] font-mono uppercase text-slate-500 font-bold">Provizija za klijenta</div>
                  <div className="text-lg font-extrabold font-mono text-emerald-600 tabular-nums">0,00 €</div>
                  <div className="text-[11px] text-slate-500">Čl. 417. Zakona o osiguranju</div>
                </div>
              </div>
            </div>

            {/* Right Column: Quick Portal & AI Command Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-elevated p-6 sm:p-7 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#C21817]">
                      Dvosmjerni ekosustav Agencije Život
                    </span>
                    <h2 className="text-lg font-extrabold text-[#0F172A]">Brzi pristup modulima</h2>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-[10px] font-bold">
                    LIVE SYNC
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Link
                    to="/korisnicki-portal"
                    className="p-4 rounded-2xl bg-[#FEF2F2] hover:bg-red-100/70 border border-[#FECACA] transition-all group"
                  >
                    <div className="text-xs font-extrabold text-[#C21817] flex items-center justify-between">
                      <span>Korisnički portal</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1">
                      Aktivne police, 5-fazno praćenje šteta, prihvat ponuda i AI pomoć.
                    </p>
                  </Link>

                  <Link
                    to="/zastupnicki-portal"
                    className="p-4 rounded-2xl bg-[#0F172A] hover:bg-[#1E293B] text-white transition-all group"
                  >
                    <div className="text-xs font-extrabold text-white flex items-center justify-between">
                      <span>Zastupnički portal</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#F87171] group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <p className="text-[11px] text-slate-300 mt-1">
                      Skadencar polica, trijaža šteta, faze ugovora i AI Cross-Sell CRM.
                    </p>
                  </Link>

                  <Link
                    to="/ai-centar"
                    className="p-4 rounded-2xl bg-[#F8FAFC] hover:bg-slate-100 border border-[#E2E8F0] transition-all group"
                  >
                    <div className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                      <Bot className="w-4 h-4 text-[#C21817]" />
                      <span>AI Centar &amp; Štit pokrića</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Vizualni radar pokrića u 6 dimenzija i AI asistent za franšize.
                    </p>
                  </Link>

                  <Link
                    to="/program-vjernosti"
                    className="p-4 rounded-2xl bg-[#F8FAFC] hover:bg-slate-100 border border-[#E2E8F0] transition-all group"
                  >
                    <div className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-600" />
                      <span>Program vjernosti</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Silver, Gold i Platinum paketni popusti do 25% na AO + Kasko + Dom.
                    </p>
                  </Link>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-[#0F172A]">Direktna linija zastupnika:</div>
                    <div className="font-mono text-[11px] text-slate-500">Palmotićeva ulica 76, 10000 Zagreb</div>
                  </div>
                  <a
                    href="tel:+385914501458"
                    className="px-3.5 py-2 rounded-xl bg-[#C21817] text-white font-mono font-bold text-xs flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>+385 91 450 1458</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE MULTI-TIER PREMIUM CALCULATOR & COMPARISON TABLE (Osnovni / Komfort / Ekskluziv) */}
      <section className="py-14 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF2F2] text-[#C21817] border border-[#FECACA] text-xs font-mono font-bold">
              <Sliders className="w-3.5 h-3.5" />
              <span>INTERAKTIVNI USPOREDNI KALKULATOR PAKETA</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
              Usporedite Osnovni, Komfort i Ekskluziv paket
            </h2>
            <p className="text-sm text-slate-600 max-w-2xl">
              Prilagodite parametre vozila, nekretnine ili životnog osiguranja i u stvarnom vremenu usporedite razine pokrića uz 1-klik prijenos u <strong>Zatraži ponudu</strong>.
            </p>
          </div>

          {/* Category Switcher */}
          <div className="inline-flex p-1.5 rounded-2xl bg-slate-200/80 border border-[#E2E8F0] gap-1 self-start">
            {[
              { id: 'vozila', label: 'Vozila (AO + Kasko)', icon: Car },
              { id: 'imovina', label: 'Imovina & Potres', icon: Home },
              { id: 'zivot', label: 'Životno & Životni kasko', icon: HeartPulse },
            ].map((cat) => {
              const Icon = cat.icon;
              const active = comparatorCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setComparatorCategory(cat.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    active ? 'bg-[#C21817] text-white shadow-xs' : 'text-slate-700 hover:text-[#0F172A]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Parameter Sliders Card */}
        <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-card p-6 sm:p-8">
          {comparatorCategory === 'vozila' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-600">Snaga motora vozila (kW):</span>
                  <span className="font-mono text-[#C21817] text-sm tabular-nums">{vehicleKw} kW</span>
                </div>
                <input
                  type="range"
                  min={40}
                  max={250}
                  step={5}
                  value={vehicleKw}
                  onChange={(e) => setVehicleKw(Number(e.target.value))}
                  className="w-full accent-[#C21817] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>40 kW (Gradsko)</span>
                  <span>110 kW (Hybrid SUV)</span>
                  <span>250 kW</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-600">Novonabavna vrijednost vozila:</span>
                  <span className="font-mono text-[#0F172A] text-sm tabular-nums">{formatEUR(vehicleValueEur)}</span>
                </div>
                <input
                  type="range"
                  min={8000}
                  max={85000}
                  step={1000}
                  value={vehicleValueEur}
                  onChange={(e) => setVehicleValueEur(Number(e.target.value))}
                  className="w-full accent-[#C21817] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>8.000 €</span>
                  <span>35.000 €</span>
                  <span>85.000 €</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-600">Bonus skupina (AO popust):</span>
                  <span className="font-mono text-emerald-700 text-sm tabular-nums">{bonusPercent}% bonus</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={50}
                  step={10}
                  value={bonusPercent}
                  onChange={(e) => setBonusPercent(Number(e.target.value))}
                  className="w-full accent-[#C21817] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>0% (B0)</span>
                  <span>30%</span>
                  <span>50% (Maksimalni B10)</span>
                </div>
              </div>
            </div>
          )}

          {comparatorCategory === 'imovina' && (
            <div className="max-w-xl mx-auto space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-600">Površina stana ili kuće (m²):</span>
                <span className="font-mono text-[#C21817] text-base tabular-nums">{propertyM2} m²</span>
              </div>
              <input
                type="range"
                min={25}
                max={300}
                step={5}
                value={propertyM2}
                onChange={(e) => setPropertyM2(Number(e.target.value))}
                className="w-full accent-[#C21817] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>25 m² (Garsonijera)</span>
                <span>85 m² (Obiteljski stan)</span>
                <span>300 m² (Kuća / Vila)</span>
              </div>
            </div>
          )}

          {comparatorCategory === 'zivot' && (
            <div className="max-w-xl mx-auto space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-600">Osigurana svota životnog osiguranja:</span>
                <span className="font-mono text-[#C21817] text-base tabular-nums">{formatEUR(lifeSumEur)}</span>
              </div>
              <input
                type="range"
                min={10000}
                max={150000}
                step={5000}
                value={lifeSumEur}
                onChange={(e) => setLifeSumEur(Number(e.target.value))}
                className="w-full accent-[#C21817] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>10.000 €</span>
                <span>50.000 € (Standard)</span>
                <span>150.000 € (VIP)</span>
              </div>
            </div>
          )}
        </div>

        {/* 3-Tier Side-by-Side Comparison Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all ${
                tier.recommended
                  ? 'bg-white border-2 border-[#C21817] shadow-elevated relative'
                  : 'bg-white border border-[#E2E8F0] shadow-card'
              }`}
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase ${
                      tier.recommended
                        ? 'bg-[#C21817] text-white'
                        : 'bg-slate-100 text-slate-700 border border-[#E2E8F0]'
                    }`}
                  >
                    {tier.badge}
                  </span>
                  <span className="text-xs font-mono text-slate-500 tabular-nums">
                    Franšiza: {formatEUR(tier.deductibleEur)}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-extrabold text-[#0F172A]">{tier.name}</h3>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-black font-mono text-[#0F172A] tabular-nums">
                      {formatEUR(tier.annualEur)}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">/ godišnje</span>
                  </div>
                  <div className="text-xs font-mono text-[#C21817] font-semibold mt-1 tabular-nums">
                    ili {formatEUR(Math.round((tier.annualEur / 12) * 100) / 100)} / mjesečno (12 rata)
                  </div>
                </div>

                <ul className="space-y-2.5 pt-3 border-t border-slate-100 text-xs text-slate-700">
                  {tier.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#C21817] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleTransferToQuote(tier)}
                  className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    tier.recommended
                      ? 'bg-[#C21817] hover:bg-[#991B1B] text-white shadow-crimson-glow'
                      : 'bg-[#0F172A] hover:bg-[#1E293B] text-white'
                  }`}
                >
                  <span>Prebaci u Zatraži ponudu</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. PRESERVED BENTO SERVICE SHOWCASE */}
      <BentoServiceShowcase />

      {/* 4. PRESERVED SPECIALIZED CALCULATORS (Maya Engine, Dopunsko 2026, Auto 50% Bonus) */}
      <section id="kalkulator-sekcija" className="py-14 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-[#FEF2F2] text-[#C21817] border border-[#FECACA]">
            <Zap className="w-3.5 h-3.5" />
            <span>SPECIJALIZIRANI AKTUARSKI KALKULATORI</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            Detaljni izračuni po tarifnim pravilnicima
          </h2>

          <div className="inline-flex flex-wrap p-1.5 rounded-2xl bg-slate-200/80 mt-4 border border-[#E2E8F0] gap-1.5 justify-center">
            <button
              onClick={() => setActiveTab('maya')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === 'maya' ? 'bg-[#C21817] text-white shadow-sm' : 'text-slate-700 hover:text-[#0F172A]'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Maya Engine (OCR Prometna &amp; Lijevak)</span>
            </button>

            <button
              onClick={() => setActiveTab('dopunsko')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === 'dopunsko' ? 'bg-[#0F172A] text-white shadow-sm' : 'text-slate-700 hover:text-[#0F172A]'
              }`}
            >
              <HeartPulse className="w-4 h-4 text-[#F87171]" />
              <span>Dopunsko 2026 (HZZO 15 €)</span>
            </button>

            <button
              onClick={() => setActiveTab('auto')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === 'auto' ? 'bg-[#0F172A] text-white shadow-sm' : 'text-slate-700 hover:text-[#0F172A]'
              }`}
            >
              <Car className="w-4 h-4 text-[#F87171]" />
              <span>Auto kalkulator (50% bonusa)</span>
            </button>
          </div>
        </div>

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

      {/* 5. MULTI-CARRIER COMPARISON MATRIX */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MultiCarrierComparisonMatrix />
      </section>

      {/* 6. ASSIGNED ADVISOR BADGE */}
      <section className="py-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <AssignedAdvisorBadge advisor={advisor} />
      </section>

      {/* 7. PARTNER CARRIERS TRUST BAR */}
      <section className="py-12 bg-white border-y border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
            Strateško partnerstvo Generali osiguranje d.d. &amp; Toyota Centar Zagreb uz vodeće osiguratelje
          </span>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {CARRIER_PARTNERS.map((c) => (
              <div
                key={c.id}
                className="px-4 py-2.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center gap-2 text-[#0F172A] font-bold text-xs"
              >
                <ShieldCheck className="w-4 h-4 text-[#C21817]" />
                <span>{c.name}</span>
                {c.isPrimaryPartner && (
                  <span className="text-[10px] font-mono bg-[#FEF2F2] text-[#C21817] px-2 py-0.5 rounded-full font-bold border border-[#FECACA]">
                    Službeni partner
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FAQ MODULE */}
      <section className="py-14 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C21817]">
            Česta pitanja osiguranika
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
            Informacije o ugovaranju polica i zakonskim pravima
          </h2>
        </div>

        <div className="space-y-3">
          {[...FAQ_AUTO, ...FAQ_DOPUNSKO.slice(0, 2)].map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-[#E2E8F0] overflow-hidden transition-all shadow-xs"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left font-bold text-[#0F172A] flex items-center justify-between gap-4 hover:bg-slate-50 cursor-pointer"
                >
                  <span className="text-sm sm:text-base">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform ${
                      isOpen ? 'rotate-180 text-[#C21817]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <ConversationalWizard
        isOpen={isSavjetnikOpen}
        onClose={() => setIsSavjetnikOpen(false)}
        initialTopic={activeTab === 'dopunsko' ? 'dopunsko' : 'auto'}
      />
    </div>
  );
}
