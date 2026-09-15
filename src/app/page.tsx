import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Car,
  Home,
  Heart,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Phone,
  Sparkles,
  Sliders,
  Star,
  FileText,
  UserCheck,
  Lock,
  ChevronDown,
  AlertTriangle,
  Award,
  Clock,
  ExternalLink,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { calculateAutoPremium, formatEuro } from '../lib/calculations';
import { InsuranceCategory } from '../lib/types';
import { Slider } from '../components/ui/Slider';
import { QuoteModal } from '../components/quotes/QuoteModal';

export default function HomePage() {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<InsuranceCategory>('auto');

  // Interactive Live Estimator State
  const [estKw, setEstKw] = useState<number>(85);
  const [estBonus, setEstBonus] = useState<number>(50);
  const [isToyota, setIsToyota] = useState<boolean>(true);

  // FAQ open index state
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  const openQuoteWithCategory = (cat: InsuranceCategory) => {
    setSelectedCategory(cat);
    setIsQuoteModalOpen(true);
  };

  // Live calculation for the interactive estimator
  const estResult = useMemo(() => {
    return calculateAutoPremium({
      kw: estKw,
      driverAge: 35,
      bonusPercent: estBonus,
      coverageType: 'ao_kasko',
      franchiseAmount: 150,
      addons: { glassBreakage: true, roadAssistance: true, bonusProtection: true },
    });
  }, [estKw, estBonus]);

  const partners = [
    { name: 'Generali osiguranje d.d.', role: 'Strateški partner', share: 'Generali Grupa' },
    { name: 'Toyota Centar Zagreb', role: 'Ekskluzivni VIP Kasko', share: 'Službeni partner' },
    { name: 'Croatia osiguranje d.d.', role: 'Multi-quote mreža', share: 'Tradicija 1884.' },
    { name: 'Allianz Hrvatska d.d.', role: 'Multi-quote mreža', share: 'Europski standard' },
    { name: 'Wiener VIG osiguranje', role: 'Multi-quote mreža', share: 'Vienna Insurance' },
    { name: 'Grawe Hrvatska d.d.', role: 'Multi-quote mreža', share: 'Tradicija 1828.' },
  ];

  const testimonials = [
    {
      quote:
        'Kada mi je pukla cijev u kupaonici, prijavio sam štetu putem portala Moj Život u 23 sata. Ujutro u 9h procjenitelj je već potvrdio uviđaj, a isplata je sjela unutar 3 dana na IBAN. Vrhunska profesionalnost i brzina.',
      author: 'Marko Horvat',
      role: 'Ugovaratelj ŽIVOT Dom',
      location: 'Zagreb, Maksimir',
      rating: 5,
    },
    {
      quote:
        'Kao kupac novog RAV4 Hibrida u Toyota Centru Zagreb dobio sam Toyota VIP Kasko s 50% popusta na osiguranje stana. Popravci su isključivo u ovlaštenom servisu s originalnim dijelovima, a cijena je 20% povoljnija.',
      author: 'Elena Kovač',
      role: 'Toyota VIP Kasko klijent',
      location: 'Zagreb, Jankomir',
      rating: 5,
    },
    {
      quote:
        'Ugovaranje police za potrebe stambenog kredita s vinkulacijom riješeno je u 15 minuta. Agentica Marija je transparentno objasnila sve uvjete bez sitnih slova. Preuzimanje Zelene karte u PDF-u funkcionira besprijekorno.',
      author: 'Davor Jurić',
      role: 'Životno i imovinsko osiguranje',
      location: 'Rijeka',
      rating: 5,
    },
  ];

  const faqs = [
    {
      q: 'Kako funkcionira prijenos do 50% bonusa na auto osiguranje?',
      a: 'Sukladno hrvatskim propisima i pravilima osiguratelja, stečeni bonus-malus stupanj (do 50%) u cijelosti se prenosi s vaše prethodne police, bez obzira kod kojeg ste osiguratelja prethodno bili osigurani. Naš sustav automatski provjerava vaš status u bazi HUO-a po OIB-u.',
    },
    {
      q: 'Što uključuje Toyota VIP Kasko Program u partnerstvu s Toyota Centrom Zagreb?',
      a: 'Toyota VIP Kasko nudi jedinstvene pogodnosti: jamstvo popravka isključivo u ovlaštenoj Toyota mreži s originalnim rezervnim dijelovima, besplatno zamjensko hibridno vozilo za vrijeme popravka, te dodatnih 50% trajnog popusta na osiguranje doma i potresa (ŽIVOT Dom).',
    },
    {
      q: 'Naplaćuje li Agencija Život naknadu ili proviziju klijentima?',
      a: 'Ne. Sukladno Direktivi o distribuciji osiguranja (IDD) i članku 401. Zakona o osiguranju, sve naše usluge informiranja, izračuna, usporedbe i digitalne asistencije za ugovaratelje su 100% besplatne (0,00 €). Našu proviziju isplaćuje isključivo osiguravajuće društvo.',
    },
    {
      q: 'Kako funkcionira digitalna prijava štete (FNOL 24/7)?',
      a: 'Putem našeg obrasca prijavite štetu u 4 koraka: učitate fotografije oštećenja i prometne isprave, navedete IBAN za isplatu, a sustav odmah generira službeni referentni broj predmeta (ST-2026-XXXX) i prosljeđuje ga izravno procjeniteljima Generali osiguranja.',
    },
    {
      q: 'Mogu li dobiti Zelenu kartu (Međunarodnu kartu osiguranja) odmah?',
      a: 'Da. Kroz naš klijentski portal "Moj Život" Zelena karta i službena polica dostupne su za preuzimanje u PDF formatu odmah nakon potvrde ugovaranja, spremne za ispis ili spremanje na pametni telefon.',
    },
  ];

  return (
    <div className="w-full bg-[#06080c] text-slate-100 overflow-hidden font-sans">
      {/* 1. HERO SECTION (RankRush.ai Minimalist Dark Pattern) */}
      <section className="relative pt-12 sm:pt-20 pb-20 sm:pb-28 px-4 sm:px-6 lg:px-8 border-b border-white/[0.07] overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#fb6504]/15 via-transparent to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            {/* Monospace Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono tracking-wider text-[#fb6504] shadow-inner backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#fb6504] animate-pulse" />
              <span>01 &bull; DIGITALNO OSIGURANJE &bull; HANFA LICENCA ZO-88912</span>
            </div>

            {/* Main Punchy Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08]">
              Pametno osiguranje za{' '}
              <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                stvaran život.
              </span>
            </h1>

            {/* Clear, Professional Subhead (Zero Vibe Coding) */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Službena digitalna agencija u partnerstvu s{' '}
              <strong className="text-white font-semibold">Generali osiguranjem d.d.</strong> i{' '}
              <strong className="text-[#fb6504] font-semibold">Toyota Centrom Zagreb</strong>.
              Ugovorite policu s do 50% bonusa i prijavite štetu u realnom vremenu.
            </p>

            {/* RankRush Interactive 60-Sec Scanner Bar */}
            <div className="pt-4 max-w-2xl mx-auto">
              <div className="bg-[#0a0d16]/90 border border-white/[0.12] rounded-2xl p-2 sm:p-3 shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row items-center gap-2.5">
                <div className="flex-1 w-full flex items-center gap-3 px-3 py-2 text-left">
                  <div className="p-2 rounded-lg bg-white/[0.05] text-[#fb6504]">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                      Besplatno &bull; 60 sekundi izračun
                    </span>
                    <span className="text-sm font-semibold text-white truncate block">
                      Auto AO & Kasko &bull; ŽIVOT Dom &bull; Prijepis vozila
                    </span>
                  </div>
                </div>

                <div className="w-full sm:w-auto flex gap-2">
                  <button
                    onClick={() => openQuoteWithCategory('auto')}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#fb6504] hover:bg-[#ff7b1a] text-white font-bold text-sm shadow-lg shadow-[#fb6504]/25 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    <span>Izračunaj odmah</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Direct Utility Links Strip */}
            <div className="pt-3 flex flex-wrap justify-center items-center gap-4 text-xs font-mono text-slate-400">
              <button
                onClick={() => openQuoteWithCategory('auto')}
                className="hover:text-white transition-colors flex items-center gap-1.5"
              >
                <Car className="w-3.5 h-3.5 text-[#fb6504]" />
                <span>Toyota VIP Kasko</span>
              </button>
              <span>&bull;</span>
              <Link to="/kalkulator-prijepisa" className="hover:text-white transition-colors flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span>Prijepis vozila (NN 92/21)</span>
              </Link>
              <span>&bull;</span>
              <Link to="/prijava-stete" className="hover:text-white transition-colors flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>Prijava štete (FNOL)</span>
              </Link>
              <span>&bull;</span>
              <Link to="/portal" className="hover:text-white transition-colors flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Portal Moj Život</span>
              </Link>
            </div>

            {/* Verified Operational Metrics */}
            <div className="pt-10 border-t border-white/[0.08] grid grid-cols-2 md:grid-cols-4 gap-6 text-left max-w-4xl mx-auto">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <span className="text-2xl sm:text-3xl font-black text-white font-mono block">
                  14.800+
                </span>
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mt-1 block">
                  Aktivnih polica ugovoreno
                </span>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono block">
                  99,4%
                </span>
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mt-1 block">
                  Isplaćenih odštetnih zahtjeva
                </span>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <span className="text-2xl sm:text-3xl font-black text-[#fb6504] font-mono block">
                  &lt; 24 sata
                </span>
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mt-1 block">
                  Prva obrada štete kod procjenitelja
                </span>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono block">
                  4.9 / 5
                </span>
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mt-1 block">
                  Ocjena zadovoljstva osiguranika
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STRATEGIC PARTNERS BAR */}
      <section className="bg-[#080c14] py-8 border-b border-white/[0.07]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-400">
              Ovlašteno poslovanje pod nadzorom HANFA-e uz vodeće osiguratelje u RH
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {partners.map((p, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/20 transition-all text-center"
              >
                <span className="text-xs font-bold text-white block truncate">{p.name}</span>
                <span className="text-[10px] font-mono text-[#fb6504] block mt-0.5">{p.role}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. THE PRODUCT &middot; 4 PILLARS (RankRush Bento Grid) */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#fb6504]">
            ARHITEKTURA SUSTAVA &bull; 4 STUPA PLATFORME
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Četiri razine. Jedna platforma.
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Spojili smo precizne zakonske kalkulatore, digitalnu prijavu šteta, klijentski trezor
            i ekskluzivna partnerstva za vozila i dom.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Pillar 01: Multi-Carrier Izračun & Usporedba (Large Bento Cell) */}
          <div className="lg:col-span-7 bg-[#0a0d16] rounded-3xl p-6 sm:p-8 border border-white/[0.08] shadow-2xl relative overflow-hidden flex flex-col justify-between group hover:border-[#fb6504]/40 transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#fb6504] uppercase tracking-wider">
                  01 &bull; AKTUARSKI IZRAČUN &amp; USPOREDBA
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  NN 92/21 TARIFE
                </span>
              </div>

              <h3 className="text-2xl font-bold text-white">
                Trenutni izračun za Auto, Imovinu i Prijepis vozila
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Algoritam automatski primjenjuje zakonske tablice snage motora (kW), starost vozila,
                bonuse od 0% do 50% i seizmičke koeficijente za stanove i kuće.
              </p>

              {/* Embedded Live Slider Simulation */}
              <div className="bg-white/[0.03] rounded-2xl p-4 border border-white/[0.06] space-y-4 pt-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-300">Snaga motora (kW):</span>
                  <span className="font-mono font-bold text-[#fb6504] text-sm">
                    {estKw} kW (~{Math.round(estKw * 1.36)} KS)
                  </span>
                </div>
                <Slider
                  min={30}
                  max={200}
                  step={1}
                  value={estKw}
                  onChange={(val) => setEstKw(val)}
                  unit="kW"
                />

                <div className="flex justify-between items-center text-xs pt-2 border-t border-white/[0.06]">
                  <span className="text-slate-400">Okvirna mjesečna rata s Kaskom:</span>
                  <span className="text-xl font-extrabold font-mono text-emerald-400">
                    {formatEuro(estResult.monthlyInstallment)}/mj.
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">Uključeno 10 licenciranih osiguratelja</span>
              <button
                onClick={() => openQuoteWithCategory('auto')}
                className="inline-flex items-center text-xs font-bold text-[#fb6504] hover:text-[#ff7b1a] transition-colors"
              >
                <span>Otvori puni kalkulator</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>

          {/* Pillar 02: 24/7 Digitalna Prijava Štete - FNOL (Right Bento Cell) */}
          <div className="lg:col-span-5 bg-[#0a0d16] rounded-3xl p-6 sm:p-8 border border-white/[0.08] shadow-2xl relative overflow-hidden flex flex-col justify-between group hover:border-rose-500/40 transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-rose-400 uppercase tracking-wider">
                  02 &bull; DIGITALNA OBRADA ŠTETA (FNOL)
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  24/7 ONLINE
                </span>
              </div>

              <h3 className="text-2xl font-bold text-white">
                Prijava štete bez odlaska u poslovnicu
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                4-koraka postupak s učitavanjem foto-dokumentacije, policijskog zapisnika i direktnim
                unosom IBAN-a za brzu isplatu nespornog dijela štete.
              </p>

              {/* Status Simulation Tag */}
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-mono">Referenca spisa:</span>
                  <span className="font-mono font-bold text-white">ST-2026-481920</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-[11px]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Zaprimljeno &bull; Procjenitelj dodijeljen unutar 24h</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">Direktan link s likvidatorom</span>
              <Link
                to="/prijava-stete"
                className="inline-flex items-center text-xs font-bold text-rose-400 hover:text-rose-300 transition-colors"
              >
                <span>Prijavi štetu</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>

          {/* Pillar 03: Moj Život Portal & Trezor (Bottom Left Cell) */}
          <div className="lg:col-span-5 bg-[#0a0d16] rounded-3xl p-6 sm:p-8 border border-white/[0.08] shadow-2xl relative overflow-hidden flex flex-col justify-between group hover:border-emerald-500/40 transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  03 &bull; PORTAL &quot;MOJ ŽIVOT&quot; &amp; TREZOR
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  PDF &amp; QR KOD
                </span>
              </div>

              <h3 className="text-2xl font-bold text-white">
                Digitalni novčanik svih vaših polica
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Preuzmite policu i međunarodnu Zelenu kartu jednim klikom. Upozorenja o obnovi 30 dana
                ranije sprječavaju gubitak stečenog 50% bonusa.
              </p>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span className="font-medium text-slate-200">Zelena karta (PDF)</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.06] text-slate-300">
                  Instant preuzimanje
                </span>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">Zahtjevi za aneksom online</span>
              <Link
                to="/portal"
                className="inline-flex items-center text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <span>Uđi u portal</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>

          {/* Pillar 04: Ekskluzivni Toyota Centar Zagreb VIP Kasko (Bottom Right Cell) */}
          <div className="lg:col-span-7 bg-[#0a0d16] rounded-3xl p-6 sm:p-8 border border-white/[0.08] shadow-2xl relative overflow-hidden flex flex-col justify-between group hover:border-[#fb6504]/40 transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#fb6504] uppercase tracking-wider">
                  04 &bull; TOYOTA CENTAR ZAGREB &amp; GENERALI
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#fb6504]/10 text-[#fb6504] border border-[#fb6504]/20">
                  EKSKLUZIVNI PROGRAM
                </span>
              </div>

              <h3 className="text-2xl font-bold text-white">
                Toyota VIP Kasko: popravci isključivo u ovlaštenom servisu
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                U suradnji s Generali osiguranjem i Toyota Centrom Zagreb osiguravamo originalne dijelove,
                zamjensko hibridno vozilo odmah te <strong>50% popusta na osiguranje doma</strong>.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                  <span className="font-bold text-white block">100% Original</span>
                  <span className="text-[10px] text-slate-400">Dijelovi i jamstvo</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                  <span className="font-bold text-white block">Hibridno vozilo</span>
                  <span className="text-[10px] text-slate-400">Zamjensko bez čekanja</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                  <span className="font-bold text-emerald-400 block">-50% Dom</span>
                  <span className="text-[10px] text-slate-400">Kombinirani bonus</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">Generali polica s Toyota certifikatom</span>
              <button
                onClick={() => openQuoteWithCategory('auto')}
                className="inline-flex items-center text-xs font-bold text-[#fb6504] hover:text-[#ff7b1a] transition-colors"
              >
                <span>Ugovori Toyota Kasko</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE HONEST COMPARISON MATRIX (RankRush Style) */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.07]">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-slate-400">
            USPOREDBA TRŽIŠTA &bull; POTPUNA TRANSPARENTNOST
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Iskrena usporedba kanala osiguranja
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Zašto više od 14.000 ugovaratelja bira digitalnu platformu Agencije Život.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse bg-[#0a0d16] rounded-2xl overflow-hidden border border-white/[0.08]">
            <thead>
              <tr className="border-b border-white/[0.08] text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                <th className="py-4 px-6">Mogućnosti i standardi</th>
                <th className="py-4 px-6 text-[#fb6504] font-bold bg-white/[0.02]">
                  Agencija Život (Generali &amp; Toyota)
                </th>
                <th className="py-4 px-6">Klasične fizičke poslovnice</th>
                <th className="py-4 px-6">Generički web agregatori</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-slate-300">
              <tr className="hover:bg-white/[0.02]">
                <td className="py-4 px-6 font-medium text-white">Vrijeme izdavanja police</td>
                <td className="py-4 px-6 font-bold text-emerald-400 font-mono bg-white/[0.02]">
                  &lt; 60 sekundi (online)
                </td>
                <td className="py-4 px-6 text-slate-400">Čekanje u redu (1 do 3 dana)</td>
                <td className="py-4 px-6 text-slate-400">Proslijeđivanje pozivnom centru</td>
              </tr>
              <tr className="hover:bg-white/[0.02]">
                <td className="py-4 px-6 font-medium text-white">Automatski prijenos 50% bonusa</td>
                <td className="py-4 px-6 font-bold text-emerald-400 font-mono bg-white/[0.02]">
                  DA (izravna HUO provjera)
                </td>
                <td className="py-4 px-6 text-slate-400">Često zahtijeva potvrde na papiru</td>
                <td className="py-4 px-6 text-slate-400">Ovisi o partnerskoj polici</td>
              </tr>
              <tr className="hover:bg-white/[0.02]">
                <td className="py-4 px-6 font-medium text-white">Ekskluzivni Toyota VIP Kasko Program</td>
                <td className="py-4 px-6 font-bold text-[#fb6504] font-mono bg-white/[0.02]">
                  DA (Toyota Centar Zagreb)
                </td>
                <td className="py-4 px-6 text-slate-400">NE (Standardne univerzalne tarife)</td>
                <td className="py-4 px-6 text-slate-400">NE</td>
              </tr>
              <tr className="hover:bg-white/[0.02]">
                <td className="py-4 px-6 font-medium text-white">24/7 Digitalna prijava štete s foto zapisnikom</td>
                <td className="py-4 px-6 font-bold text-emerald-400 font-mono bg-white/[0.02]">
                  DA (FNOL sustav s brojem predmeta)
                </td>
                <td className="py-4 px-6 text-slate-400">Samo radnim danom 08-16h</td>
                <td className="py-4 px-6 text-slate-400">Preusmjeravanje na telefon</td>
              </tr>
              <tr className="hover:bg-white/[0.02]">
                <td className="py-4 px-6 font-medium text-white">1-klik preuzimanje Zelene karte (PDF)</td>
                <td className="py-4 px-6 font-bold text-emerald-400 font-mono bg-white/[0.02]">
                  DA (Moj Život Trezor)
                </td>
                <td className="py-4 px-6 text-slate-400">Izdavanje na papiru</td>
                <td className="py-4 px-6 text-slate-400">Slanje poštom za par dana</td>
              </tr>
              <tr className="hover:bg-white/[0.02]">
                <td className="py-4 px-6 font-medium text-white">Licencirani HANFA savjetnik (ZO-88912)</td>
                <td className="py-4 px-6 font-bold text-emerald-400 font-mono bg-white/[0.02]">
                  DA (Osobni savjetnik u Zagrebu)
                </td>
                <td className="py-4 px-6 text-slate-400">Da (lokalni referent)</td>
                <td className="py-4 px-6 text-slate-400">Često automatizirani pozivni centri</td>
              </tr>
              <tr className="hover:bg-white/[0.02]">
                <td className="py-4 px-6 font-medium text-white">Naknada za ugovaratelja</td>
                <td className="py-4 px-6 font-bold text-emerald-400 font-mono bg-white/[0.02]">
                  0,00 € (100% BESPLATNO)
                </td>
                <td className="py-4 px-6 text-slate-400">0,00 €</td>
                <td className="py-4 px-6 text-slate-400">0,00 €</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. VERIFIED REVIEWS & SOCIAL PROOF */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.07]">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-emerald-400">
            DOKAZANO ZADOVOLJSTVO &bull; 4.9 / 5 ZVIJEZDA
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Iskustva stvarnih osiguranika
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Stvarna iskustva ugovaranja polica i rješavanja šteta diljem Hrvatske.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-[#0a0d16] rounded-2xl p-6 sm:p-8 border border-white/[0.08] shadow-xl flex flex-col justify-between space-y-4 hover:border-white/20 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-1 text-[#fb6504]">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#fb6504]" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
                  &quot;{t.quote}&quot;
                </p>
              </div>

              <div className="pt-4 border-t border-white/[0.06]">
                <p className="font-bold text-white text-sm">{t.author}</p>
                <p className="text-[11px] font-mono text-[#fb6504]">{t.role}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{t.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FAQ ACCORDION */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-white/[0.07]">
        <div className="text-center mb-14 space-y-3">
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#fb6504]">
            INFORMIRAJTE SE &bull; FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Često postavljana pitanja
          </h2>
          <p className="text-sm text-slate-400">
            Sve što trebate znati o ugovaranju polica, bonusima i prijavi šteta.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div
                key={idx}
                className="bg-[#0a0d16] rounded-2xl border border-white/[0.08] overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center space-x-4 hover:bg-white/[0.02] transition-colors"
                >
                  <span className="font-bold text-sm sm:text-base text-white">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 text-[#fb6504]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/[0.06] bg-white/[0.01]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. FINAL HIGH-CONVERTING CTA BANNER */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-r from-[#0b0f17] via-[#111726] to-[#0b0f17] p-8 sm:p-14 border border-white/[0.12] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#fb6504]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center md:text-left">
              <span className="inline-block px-3 py-1 rounded-full bg-[#fb6504]/20 text-[#fb6504] text-xs font-mono font-bold uppercase tracking-wider">
                STRUČNA PODRŠKA &bull; 01 4800 120
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white">
                Spremni za osiguranje bez skrivenih troškova?
              </h2>
              <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
                Nazovite nas na telefon u Zagrebu ili pokrenite online izračun u 60 sekundi.
                Osigurajte svoje vozilo, dom i obitelj uz jamstvo Generali osiguranja.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
              <a
                href="tel:014800120"
                className="flex items-center justify-center space-x-2 px-6 py-3.5 bg-white text-slate-900 hover:bg-slate-100 rounded-xl font-bold text-sm transition-all shadow-md"
              >
                <Phone className="w-4 h-4 text-[#fb6504]" />
                <span>01 4800 120</span>
              </a>
              <button
                onClick={() => openQuoteWithCategory('auto')}
                className="flex items-center justify-center space-x-2 px-6 py-3.5 bg-[#fb6504] hover:bg-[#ff7b1a] text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-[#fb6504]/25"
              >
                <span>Započni online</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Embedded Quote Modal */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        initialCategory={selectedCategory}
      />
    </div>
  );
}
