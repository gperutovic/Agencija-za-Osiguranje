import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ShieldCheck,
  Zap,
  Clock,
  Award,
  ChevronRight,
  Car,
  Home,
  Heart,
  Activity,
  ArrowRight,
  CheckCircle2,
  FileText,
  Star,
  PhoneCall,
  UserCheck,
} from 'lucide-react';
import { TrustBadgeBanner } from '../components/layout/TrustBadgeBanner';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';

export const HomePage: React.FC = () => {
  const { t } = useTranslation();

  const products = [
    {
      id: 'auto',
      title: 'Auto Odgovornost & Kasko',
      icon: Car,
      tag: '50% Bonus + Asistencija 24/7',
      desc: 'Obvezno osiguranje od automobilske odgovornosti i kasko pokriće bez franšize uz besplatnu vuču i zamjensko vozilo diljem Europe.',
      priceStarting: 'od 118 € / god.',
      accent: 'text-[#ff7b1a]',
      borderHover: 'hover:border-[#fb6504]/50',
    },
    {
      id: 'property',
      title: 'Osiguranje Doma & Potresa',
      icon: Home,
      tag: 'Građevinski dio + Stvari kućanstva',
      desc: 'Sveobuhvatna zaštita od potresa, požara, izlijevanja vode iz vodovodnih cijevi, oluje, provalne krađe i odgovornosti prema trećima.',
      priceStarting: 'od 0,95 €/m² god.',
      accent: 'text-amber-400',
      borderHover: 'hover:border-amber-500/50',
    },
    {
      id: 'life',
      title: 'Životno Osiguranje ŽIVOT+',
      icon: Heart,
      tag: 'Zaštita obitelji + Sigurna štednja',
      desc: 'Financijska sigurnost vaših najmilijih, otplata stambenog kredita i pokriće za 20 teških bolesti uz zajamčeni povrat uplaćenih sredstava.',
      priceStarting: 'od 25 € / mjesečno',
      accent: 'text-rose-400',
      borderHover: 'hover:border-rose-500/50',
    },
    {
      id: 'health',
      title: 'Dodatno & Dopunsko Zdravstvo',
      icon: Activity,
      tag: 'Specijalisti bez čekanja + B-lista',
      desc: 'Pregledi u najboljim privatnim poliklinikama u roku 48h, magnetska rezonanca, laboratorijska dijagnostika i pokriće participacije za lijekove.',
      priceStarting: 'od 18 € / mjesečno',
      accent: 'text-emerald-400',
      borderHover: 'hover:border-emerald-500/50',
    },
  ];

  const stats = [
    { value: '14.800+', label: 'Aktivnih ugovorenih polica' },
    { value: '99,4%', label: 'Isplaćenih odštetnih zahtjeva' },
    { value: '< 24 sata', label: 'Prosječno vrijeme obrade štete' },
    { value: '4.9 / 5', label: 'Ocjena zadovoljstva osiguranika' },
  ];

  const testimonials = [
    {
      quote:
        'Kada mi je pukla cijev u kupaonici, prijavio sam štetu putem portala Moj Život u 23 sata. Ujutro u 9h procjenitelj je već potvrdio uviđaj, a isplata je sjela unutar 3 dana. Vrhunska profesionalnost!',
      author: 'Marko Horvat',
      location: 'Zagreb, Maksimir',
      product: 'Osiguranje stana i potresa',
      rating: 5,
    },
    {
      quote:
        'Kao obrtnik nemam vremena čekati u redovima. Agencija Život mi je složila kombiniranu policu za dostavna vozila uz 50% bonusa i puni kasko. Cijena 20% povoljnija nego drugdje, a agentica Marija je uvijek dostupna.',
      author: 'Elena Kovač',
      location: 'Split, Obrt Kovač Transport',
      product: 'Flotno kasko osiguranje',
      rating: 5,
    },
    {
      quote:
        'Ugovaranje životnog osiguranja za potrebe stambenog kredita trajalo je svega 15 minuta. Zastupnik mi je transparentno objasnio sve opcije bez skrivenih troškova. Svaka preporuka za Agenciju Život!',
      author: 'Davor Jurić',
      location: 'Rijeka',
      product: 'Životno osiguranje za kredit',
      rating: 5,
    },
  ];

  return (
    <div className="space-y-24 pb-24 text-slate-100">
      {/* HERO SECTION WITH RANKRUSH GLOW */}
      <section className="relative overflow-hidden pt-16 pb-28">
        {/* Ambient Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#fb6504]/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-40 right-10 w-[400px] h-[400px] bg-[#22d3ee]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] text-xs font-mono font-bold tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#fb6504] animate-pulse" />
                <span className="text-white">Ovlašteni partner Generali osiguranja d.d.</span>
                <span className="text-slate-500">&bull;</span>
                <span className="text-[#ff7b1a]">HANFA Licenca</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-white">
                Pametno osiguranje za{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fb6504] via-[#ff7b1a] to-amber-400">
                  stvaran život
                </span>
                .
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed font-light">
                Digitalna platforma Agencije Život spaja trenutačni izračun premija za 60 sekundi, online ugovaranje polica i 24/7 digitalnu prijavu šteta s pravnom snagom vodećeg europskog osiguratelja.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <Link to="/calculator">
                  <Button
                    variant="primary"
                    size="lg"
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                    className="w-full sm:w-auto text-base font-extrabold"
                  >
                    Izračunaj svoju premiju
                  </Button>
                </Link>

                <Link to="/portal">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto text-base font-bold"
                  >
                    Korisnički portal Moj Život
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-white/[0.08] grid grid-cols-3 gap-4 text-xs font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#ff7b1a] shrink-0" />
                  <span>Bez skrivenih naknada</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Trenutačna polica na email</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>24/7 Prijava šteta</span>
                </div>
              </div>
            </div>

            {/* Right Card / Interactive RankRush Teaser */}
            <div className="lg:col-span-5">
              <div className="bg-[#0a0d16]/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/[0.1] shadow-2xl space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#fb6504]/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] relative z-10">
                  <div>
                    <h3 className="text-xl font-bold text-white">Ekspresni Izračun</h3>
                    <p className="text-xs text-slate-400 font-mono">Odaberite osiguranje i saznajte uštedu</p>
                  </div>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-[#fb6504]/15 text-[#ff7b1a] border border-[#fb6504]/30">
                    60 sec
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 relative z-10">
                  {[
                    { type: 'auto', label: 'Auto & Kasko', icon: Car, color: 'group-hover:text-[#ff7b1a]' },
                    { type: 'property', label: 'Dom i Potres', icon: Home, color: 'group-hover:text-amber-400' },
                    { type: 'life', label: 'Životno', icon: Heart, color: 'group-hover:text-rose-400' },
                    { type: 'health', label: 'Zdravstveno', icon: Activity, color: 'group-hover:text-emerald-400' },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.type}
                        to={`/calculator?type=${item.type}`}
                        className="p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/[0.16] transition-all flex flex-col items-center text-center gap-2 group hover:scale-[1.02]"
                      >
                        <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] text-slate-300 flex items-center justify-center group-hover:bg-[#fb6504]/20 group-hover:text-[#ff7b1a] group-hover:border-[#fb6504]/30 transition-colors">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className={`text-xs font-bold text-white transition-colors ${item.color}`}>
                          {item.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs text-slate-400 flex items-center gap-3 relative z-10">
                  <UserCheck className="w-5 h-5 text-[#ff7b1a] shrink-0" />
                  <span>
                    Želite personalizirani savjet? Dogovorite besplatni termin s licenciranim HANFA brokerom.
                  </span>
                </div>

                <Link to="/contact" className="block relative z-10">
                  <Button variant="outline" className="w-full text-xs font-mono font-bold">
                    Zakaži savjetovanje s agentom
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BADGE BANNER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <TrustBadgeBanner />
      </div>

      {/* PRODUCT PROGRAMS - BENTO GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#fb6504]" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#ff7b1a]">
              Naši Programi Osiguranja
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Potpuna sigurnost za vas, vašu obitelj i imovinu
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Izaberite provjerene police Generali osiguranja prilagođene vašim specifičnim potrebama uz konkurentne premije i podršku ovlaštenih agenata.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.id}
                className={`p-6 flex flex-col justify-between bg-[#0a0d16]/90 border border-white/[0.08] ${p.borderHover} backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-2xl transition-all group relative overflow-hidden`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white flex items-center justify-center group-hover:scale-110 group-hover:border-[#fb6504]/40 group-hover:text-[#ff7b1a] transition-all">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono font-bold text-slate-400">
                      {p.priceStarting}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-[#ff7b1a] transition-colors">
                      {p.title}
                    </h3>
                    <span className="inline-block text-[10px] font-mono font-bold px-2 py-0.5 rounded-full mt-2 bg-white/[0.04] border border-white/[0.08] text-slate-300">
                      {p.tag}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {p.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-white/[0.06] flex flex-col gap-2">
                  <Link to={`/calculator?type=${p.id}`}>
                    <Button variant="primary" size="sm" className="w-full text-xs font-mono font-bold">
                      Izračunaj ponudu
                    </Button>
                  </Link>
                  <Link to={`/services/${p.id}`}>
                    <Button variant="ghost" size="sm" className="w-full text-xs font-mono text-slate-400 hover:text-white">
                      Saznaj više detalja &rarr;
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="relative overflow-hidden bg-[#0a0d16]/90 border-y border-white/[0.08] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((s, idx) => (
              <div key={idx} className="space-y-2">
                <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-[#ff7b1a] font-mono">
                  {s.value}
                </p>
                <p className="text-xs sm:text-sm text-slate-400 font-medium font-mono">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DIGITAL CLAIMS HIGHLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-[#0a0d16]/90 border border-white/[0.08] rounded-3xl p-8 sm:p-12 shadow-2xl overflow-hidden backdrop-blur-xl">
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#fb6504]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400">
                  Šteta se dogodila? Bez panike.
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Digitalna prijava štete (FNOL) u 4 jednostavna koraka
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Zaboravite papirnate formulare i čekanje na šalteru. Učitajte fotografije mobitelom, unesite lokaciju i IBAN. Naš tim odmah pokreće procjenu i isplatu.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center font-mono font-bold text-[#ff7b1a] shrink-0">
                    1
                  </div>
                  <div>
                    <strong className="text-white">Unos podataka:</strong> Odaberite svoju policu i lokaciju događaja.
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center font-mono font-bold text-[#ff7b1a] shrink-0">
                    2
                  </div>
                  <div>
                    <strong className="text-white">Fotografije oštećenja:</strong> Učitajte slike izravno s telefona do 15 MB.
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center font-mono font-bold text-[#ff7b1a] shrink-0">
                    3
                  </div>
                  <div>
                    <strong className="text-white">Službeni broj spisa:</strong> Dobivate instant kod formata ST-2026-XXXX.
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center font-mono font-bold text-[#ff7b1a] shrink-0">
                    4
                  </div>
                  <div>
                    <strong className="text-white">Brza isplata na IBAN:</strong> Likvidacija po odobrenju procjenitelja.
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Link to="/claims">
                  <Button variant="danger" size="lg" className="text-sm font-mono font-bold">
                    Prijavi štetu odmah &rarr;
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white/[0.02] p-6 rounded-3xl border border-white/[0.08] shadow-xl space-y-4">
              <h4 className="font-bold text-white text-sm">Status Vašeg Odštetnog Spisa</h4>
              <p className="text-xs text-slate-400 font-mono">
                Već imate otvoren spis? Pratite status u realnom vremenu uz vaš broj štete (npr. ST-2026-4819).
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-mono font-bold text-white">ST-2026-4819</span>
                  <span className="ml-auto text-emerald-400 font-mono font-semibold">Odobreno za isplatu</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="font-mono font-bold text-white">ST-2026-9142</span>
                  <span className="ml-auto text-amber-400 font-mono font-semibold">Uviđaj procjenitelja</span>
                </div>
              </div>

              <Link to="/claims" className="block text-center text-xs font-mono font-bold text-[#ff7b1a] hover:underline pt-2">
                Provjeri status postojećeg spisa &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CLIENT TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#fb6504]" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#ff7b1a]">
              Iskustva Naših Osiguranika
            </span>
          </div>
          <h2 className="text-3xl font-extrabold text-white">
            Povjerenje građana i poduzetnika diljem Hrvatske
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div key={idx} className="p-6 bg-[#0a0d16]/90 border border-white/[0.08] backdrop-blur-xl rounded-3xl flex flex-col justify-between shadow-xl">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-[#ff7b1a]">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#ff7b1a]" />
                  ))}
                </div>
                <p className="text-xs text-slate-300 italic leading-relaxed">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-white/[0.06] text-xs font-mono">
                <p className="font-bold text-white">{t.author}</p>
                <p className="text-slate-400">{t.location}</p>
                <span className="inline-block text-[10px] font-semibold text-[#ff7b1a] bg-white/[0.04] border border-white/[0.08] px-2 py-0.5 rounded mt-1">
                  {t.product}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-[#0a0d16]/90 border border-white/[0.08] rounded-3xl p-8 sm:p-14 text-white text-center space-y-6 shadow-2xl overflow-hidden backdrop-blur-xl">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#fb6504]/15 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Osigurajte svoju budućnost već danas
            </h2>
            <p className="text-slate-300 text-sm sm:text-base font-light">
              Pridružite se tisućama zadovoljnih klijenata koji su odabrali Agenciju Život i Generali osiguranje za pouzdanog partnera.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <Link to="/calculator">
              <Button variant="primary" size="lg" className="font-extrabold px-8 font-mono">
                Izračunaj besplatnu ponudu
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg" className="font-bold font-mono">
                Kontaktirajte naše brokere
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
