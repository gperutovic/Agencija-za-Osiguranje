import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  FileText, 
  AlertTriangle, 
  Lock, 
  PhoneCall, 
  Award, 
  MapPin, 
  HelpCircle, 
  Building2, 
  TrendingUp, 
  ChevronDown 
} from 'lucide-react';
import { ValiantNavbar } from '../../components/valiant/Navbar';
import { ValiantFooter } from '../../components/valiant/Footer';
import { CarrierLogoRow } from '../../components/features/CarrierLogos';
import { LemonadeQuoteEngine } from '../../components/features/LemonadeQuoteEngine';
import { ZebraComparisonTable } from '../../components/features/ZebraComparisonTable';
import { PolicygeniusNeedsCalc } from '../../components/features/PolicygeniusNeedsCalc';
import { GeicoDigitalCardModal } from '../../components/features/GeicoDigitalCardModal';

export const ValiantHomePage: React.FC = () => {
  // Typewriter rotation for Croatian risk & lifestyle focus
  const rotatingHighlights = [
    'Zagrebu i cijeloj Hrvatskoj.',
    'Auto i Puni Kasko Pokriću.',
    'Zaštiti Doma od Potresa.',
    'Životnoj Sigurnosti Obitelji.',
    'Poduzetništvu i Industriji.'
  ];
  const [highlightIndex, setHighlightIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setHighlightIndex((prev) => (prev + 1) % rotatingHighlights.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  // Regional City Hub Selector for Croatian GEO SEO
  const [selectedCity, setSelectedCity] = useState<'zagreb' | 'split' | 'rijeka' | 'osijek'>('zagreb');

  const cityData = {
    zagreb: {
      name: 'Grad Zagreb i Zagrebačka Županija',
      address: 'Središnji Ured: Junija Palmotića 76, 10000 Zagreb',
      phone: '+385 1 4800 120',
      keyRisk: 'Pojačano pokriće od potresa (seizmički rider), gradski kasko i osiguranje od izljeva vode u stambenim zgradama.',
      partnerCenters: '4 vlastita procjenilišta šteta (Ilica, Radnička, Dubrava, Novi Zagreb)'
    },
    split: {
      name: 'Split i Splitsko-dalmatinska Županija',
      address: 'Regionalni Centar: Ulica Domovinskog rata 48, 21000 Split',
      phone: '+385 21 340 100',
      keyRisk: 'Kasko zaštita plovila, osiguranje turističkih apartmana od šteta gostiju i zaštita od požara otvorenog prostora.',
      partnerCenters: 'Mreža mobilnih procjenitelja za obalu i otoke (Hvar, Brač, Vis)'
    },
    rijeka: {
      name: 'Rijeka i Primorsko-goranska Županija',
      address: 'Poslovnica Rijeka: Korzo 16, 51000 Rijeka',
      phone: '+385 51 215 440',
      keyRisk: 'Zaštita od olujne bure i tuče, pomorsko kasko i transportno kargo osiguranje robe u luci Rijeka.',
      partnerCenters: 'Brza asistencija na autocesti A6 i riječkoj zaobilaznici'
    },
    osijek: {
      name: 'Osijek i Slavonija',
      address: 'Poslovnica Osijek: Kapucinska 25, 31000 Osijek',
      phone: '+385 31 200 800',
      keyRisk: 'Osiguranje poljoprivrednih kultura i mehanizacije, zaštita od ljetnih oluja i osiguranje obiteljskih gospodarstava (OPG).',
      partnerCenters: 'Procjena šteta na poljoprivrednim parcelama u roku od 24 sata'
    }
  };

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Kako mogu prenijeti svojih 50% bonusa na auto osiguranje (AO)?',
      a: 'Prijenos bonusa je 100% automatiziran. Dovoljno je unijeti registarsku oznaku i vaš OIB u naš kalkulator. Sustav automatski povlači vaš stečeni bonus iz baze Hrvatskog ureda za osiguranje (HUO), a bonus priznaju svi naši partneri (Croatia Osiguranje, Allianz, Generali, Wiener).'
    },
    {
      q: 'Je li Agencija Život ovlašteni posrednik pod nadzorom države?',
      a: 'Da. Tvrtka ŽIVOT d.o.o. posjeduje službeno rješenje i licencu Hrvatske agencije za nadzor financijskih usluga (HANFA, Klasa: UP/I-983-02/24-01/12). Svi ugovori sklopljeni preko našeg portala imaju identičnu pravnu snagu kao police potpisane na šalteru osiguratelja.'
    },
    {
      q: 'Kako funkcionira osiguranje od potresa za stanove i kuće u Zagrebu?',
      a: 'Ugovaranjem police imovine s uključenim potresnim pokrićem, osiguravate objekt na novu građevinsku vrijednost bez odbitka amortizacije. U slučaju novog potresa, osiguratelj pokriva troškove sanacije konstrukcije, zidova, instalacija i privremenog smještaja.'
    },
    {
      q: 'Vrijedi li digitalna polica i Zelena karta na tehničkom pregledu (STP)?',
      a: 'Apsolutno. Digitalna potvrda i bar-kod koji generiramo u aplikaciji službeno su integrirani sa sustavom stanica za tehnički pregled (STP) i MUP-a RH. Nije potrebno printanje na papiru, policajac ili djelatnik na tehničkom skenira QR kod direktno s vašeg mobitela.'
    },
    {
      q: 'Koliko brzo se isplaćuju nesporne štete putem digitalne prijave (FNOL)?',
      a: 'Sukladno Zakonu o osiguranju, osiguratelj je dužan riješiti nesporni dio odštete u roku od 14 dana. Putem našeg digitalnog sustava s fotografijama oštećenja, preko 74% jednostavnih šteta (npr. lom stakla, manja oštećenja karoserije) isplaćuje se u roku od 48 sati.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#06080c] text-slate-100 flex flex-col selection:bg-[#fb6504] selection:text-white">
      <ValiantNavbar />

      <main className="flex-1 space-y-16 sm:space-y-24">
        
        {/* ========================================================================= */}
        {/* SECTION 1: HERO OVERHAUL FOR CROATIAN MARKET                              */}
        {/* ========================================================================= */}
        <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 overflow-hidden">
          {/* Ambient Lighting Overlay */}
          <div className="ambient-glow-orange" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto space-y-6">
              
              {/* Eyebrow Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-slate-300">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                <span>OVLAŠTENI POSREDNIK U OSIGURANJU</span>
                <span className="text-slate-500">•</span>
                <span className="text-[#fb6504] font-bold">HANFA LICENCA RH</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15]">
                Pametno osiguranje za stvaran život u{' '}
                <span className="rr-orange block sm:inline mt-1 sm:mt-0 transition-all duration-300">
                  {rotatingHighlights[highlightIndex]}
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-slate-300 text-sm sm:text-base sm:leading-relaxed max-w-2xl mx-auto">
                Usporedite i ugovorite vodeće osiguratelje u Hrvatskoj — <strong>Croatia Osiguranje, Allianz, Generali, Wiener i Grawe</strong>. 
                Trenutni izračun u 90 sekundi uz Maya pametnog asistenta, podešavanje franšize klizačem, instant digitalna Zelena karta i brza isplata šteta.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
                <a
                  href="#maya-kalkulator"
                  className="rr-btn rr-btn--primary text-sm py-3.5 px-6 shadow-xl shadow-orange-950/40"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Izračunaj Premiju u 90 Sekundi</span>
                </a>

                <a
                  href="#usporedba-polica"
                  className="rr-btn rr-btn--ghost text-sm py-3.5 px-5"
                >
                  <span>Usporedi Sve Osiguratelje (The Zebra)</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-mono">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Prijenos 50% Bonusa</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>100% Online bez Papirologije</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Isplata Šteta u 48h</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2: OFFICIAL CARRIER LOGO ROW                                      */}
        {/* ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
              Ugovaramo s vodećim osigurateljima licenciranim u Republici Hrvatskoj
            </span>
          </div>
          <CarrierLogoRow />
        </section>

        {/* ========================================================================= */}
        {/* SECTION 3: LEMONADE ROLE MODEL • MAYA AI CONVERSATIONAL QUOTE & SLIDERS   */}
        {/* ========================================================================= */}
        <section id="maya-kalkulator" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
            <span className="rr-pill text-[11px] uppercase font-mono tracking-wider font-bold">
              Lemonade Inovacija
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Maya • Izračunajte i Prilagodite Policiju Klizačem
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Bez kompliciranih formulara. Podesite vlastitu franšizu i pokriće u realnom vremenu uz transparentan Giveback model.
            </p>
          </div>

          <LemonadeQuoteEngine />
        </section>

        {/* ========================================================================= */}
        {/* SECTION 4: THE ZEBRA ROLE MODEL • MULTI-CARRIER COMPARISON & DISCOUNTS    */}
        {/* ========================================================================= */}
        <section id="usporedba-polica" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
            <span className="rr-pill text-[11px] uppercase font-mono tracking-wider font-bold">
              The Zebra Standard
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Neovisna Usporedba Svih Vodećih Hrvatskih Osiguratelja
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Transparentan prikaz bonusa, solvencije HANFA-e i popusta na pakete polica na jednom mjestu.
            </p>
          </div>

          <ZebraComparisonTable />
        </section>

        {/* ========================================================================= */}
        {/* SECTION 5: POLICYGENIUS ROLE MODEL • DIME NEEDS CALC & BROKER SCHEDULER   */}
        {/* ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
            <span className="rr-pill text-[11px] uppercase font-mono tracking-wider font-bold">
              Policygenius Stručnost
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Izračunajte Točne Potrebe Životnog Osiguranja (DIME Metoda)
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Precizan izračun pokrića za stambeni kredit i obitelj, uz besplatno zakazivanje termina s ovlaštenim brokerom.
            </p>
          </div>

          <PolicygeniusNeedsCalc />
        </section>

        {/* ========================================================================= */}
        {/* SECTION 6: GEICO ROLE MODEL • DIGITAL CARD & 24/7 ROADSIDE SOS             */}
        {/* ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
            <span className="rr-pill text-[11px] uppercase font-mono tracking-wider font-bold">
              GEICO Standard Mobilnosti
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Digitalna Iskaznica u Novčaniku & Hitna Pomoć na Cesti
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Vaša polica i Zelena karta uvijek dostupni na mobitelu uz 1-klik hitnu asistenciju s GPS lociranjem.
            </p>
          </div>

          <GeicoDigitalCardModal />
        </section>

        {/* ========================================================================= */}
        {/* SECTION 7: CROATIAN REGIONAL GEO HUBS (SEO / LOCAL TARGETING)             */}
        {/* ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rr-surface-card rounded-2xl p-6 sm:p-8 border border-white/[0.08]">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
              <div>
                <span className="text-[11px] font-mono text-[#fb6504] font-bold uppercase tracking-wider">
                  Lokalna Prisutnost u Republici Hrvatskoj
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  Regionalni Centri i Mreža Procjenitelja Šteta
                </h3>
              </div>

              {/* City Pill Switcher */}
              <div className="flex flex-wrap gap-2">
                {(['zagreb', 'split', 'rijeka', 'osijek'] as const).map((cityKey) => (
                  <button
                    key={cityKey}
                    type="button"
                    onClick={() => setSelectedCity(cityKey)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                      selectedCity === cityKey
                        ? 'bg-[#fb6504] text-white shadow-md shadow-orange-500/30'
                        : 'bg-white/[0.04] text-slate-400 hover:text-white'
                    }`}
                  >
                    {cityKey}
                  </button>
                ))}
              </div>
            </div>

            {/* City Details Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[#fb6504]">
                  <MapPin className="w-5 h-5" />
                  <h4 className="text-base font-bold text-white">{cityData[selectedCity].name}</h4>
                </div>
                <div className="text-xs text-slate-300 font-mono">{cityData[selectedCity].address}</div>
                <div className="text-xs text-emerald-400 font-mono font-bold">
                  Telefon regionalnog ureda: {cityData[selectedCity].phone}
                </div>
                <div className="pt-2">
                  <span className="text-[11px] font-mono text-slate-400 block uppercase">Mreža Procjene:</span>
                  <span className="text-xs text-slate-200">{cityData[selectedCity].partnerCenters}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-mono text-[#fb6504] uppercase font-bold block mb-1">
                    Specifični Regionalni Rizici i Preporuke:
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {cityData[selectedCity].keyRisk}
                  </p>
                </div>
                <div className="pt-3 mt-3 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">Dolazak procjenitelja: &lt; 24 sata</span>
                  <a
                    href="tel:+38514800120"
                    className="text-xs text-[#fb6504] font-bold hover:underline flex items-center gap-1"
                  >
                    <span>Nazovi Poslovnicu</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 8: INSTITUTIONAL CROATIAN INSURANCE FAQS                          */}
        {/* ========================================================================= */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="text-center mb-8 space-y-2">
            <span className="rr-pill text-[11px] uppercase font-mono tracking-wider font-bold">
              Česta Pitanja & Pravni Okvir
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Sve Što Trebate Znati o Ugovaranju Osiguranja u RH
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Odgovori na najčešća pitanja klijenata sukladno smjernicama HANFA-e i Zakonu o osiguranju
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rr-surface-card rounded-xl border border-white/[0.08] overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02]"
                  >
                    <span className="text-sm font-bold text-white">{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#fb6504] transition-transform duration-200 shrink-0 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/[0.04]">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

      </main>

      <ValiantFooter />
    </div>
  );
};
