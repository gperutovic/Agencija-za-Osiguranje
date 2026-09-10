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
      color: 'from-blue-600 to-indigo-700',
      accentBg: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      id: 'property',
      title: 'Osiguranje Doma & Potresa',
      icon: Home,
      tag: 'Građevinski dio + Stvari kućanstva',
      desc: 'Sveobuhvatna zaštita od potresa, požara, izlijevanja vode iz vodovodnih cijevi, oluje, provalne krađe i odgovornosti prema trećima.',
      priceStarting: 'od 0,95 €/m² god.',
      color: 'from-amber-600 to-orange-700',
      accentBg: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    {
      id: 'life',
      title: 'Životno Osiguranje ŽIVOT+',
      icon: Heart,
      tag: 'Zaštita obitelji + Sigurna štednja',
      desc: 'Financijska sigurnost vaših najmilijih, otplata stambenog kredita i pokriće za 20 teških bolesti uz zajamčeni povrat uplaćenih sredstava.',
      priceStarting: 'od 25 € / mjesečno',
      color: 'from-rose-600 to-pink-700',
      accentBg: 'bg-rose-50 text-rose-700 border-rose-200',
    },
    {
      id: 'health',
      title: 'Dodatno & Dopunsko Zdravstvo',
      icon: Activity,
      tag: 'Specijalisti bez čekanja + B-lista',
      desc: 'Pregledi u najboljim privatnim poliklinikama u roku 48h, magnetska rezonanca, laboratorijska dijagnostika i pokriće participacije za lijekove.',
      priceStarting: 'od 18 € / mjesečno',
      color: 'from-emerald-600 to-teal-700',
      accentBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
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
    <div className="space-y-20 pb-20">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-navy-900 to-slate-900 text-white pt-24 pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.15),transparent_50%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/20 border border-brand-400/30 text-teal-300 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span>Ovlašteni zastupnik Generali osiguranja d.d. &bull; HANFA Licenca</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
                Pametno osiguranje za <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-emerald-400">stvaran život</span>.
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
                Spoj digitalne brzine i stručnog savjetovanja. Izračunajte premiju za 60 sekundi, ugovorite policu online i prijavite štetu u realnom vremenu uz pravnu sigurnost vodećeg europskog osiguratelja.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <Link to="/calculator">
                  <Button
                    variant="teal"
                    size="lg"
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                    className="w-full sm:w-auto text-base font-extrabold shadow-lg shadow-teal-900/30"
                  >
                    Izračunaj svoju premiju
                  </Button>
                </Link>

                <Link to="/portal">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto text-base font-bold bg-white/10 hover:bg-white/20 text-white border-white/20"
                  >
                    Korisnički portal Moj Život
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Bez skrivenih naknada</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Trenutačna polica na email</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>24/7 Digitalna prijava šteta</span>
                </div>
              </div>
            </div>

            {/* Right Card / Interactive Teaser */}
            <div className="lg:col-span-5">
              <div className="bg-white/10 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/20 shadow-2xl space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/15">
                  <div>
                    <h3 className="text-xl font-bold text-white">Ekspresni Izračun</h3>
                    <p className="text-xs text-slate-300">Odaberite osiguranje i saznajte uštedu</p>
                  </div>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-teal-500/30 text-teal-300 border border-teal-400/30">
                    60 sec
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { type: 'auto', label: 'Auto & Kasko', icon: Car },
                    { type: 'property', label: 'Dom i Potres', icon: Home },
                    { type: 'life', label: 'Životno', icon: Heart },
                    { type: 'health', label: 'Zdravstveno', icon: Activity },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.type}
                        to={`/calculator?type=${item.type}`}
                        className="p-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 transition-all flex flex-col items-center text-center gap-2 group hover:scale-[1.02]"
                      >
                        <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center group-hover:bg-teal-500 group-hover:text-white transition-colors">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-white group-hover:text-teal-300">
                          {item.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>

                <div className="p-4 rounded-2xl bg-navy-950/60 border border-white/10 text-xs text-slate-300 flex items-center gap-3">
                  <UserCheck className="w-5 h-5 text-teal-400 shrink-0" />
                  <span>
                    Želite personalizirani savjet? Dogovorite besplatni termin s licenciranim brokerom.
                  </span>
                </div>

                <Link to="/contact">
                  <Button variant="outline" className="w-full text-xs font-bold bg-transparent border-white/30 text-white hover:bg-white/10">
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

      {/* PRODUCT PROGRAMS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
            Naši Programi Osiguranja
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Potpuna sigurnost za vas, vašu obitelj i imovinu
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Izaberite provjerene police Generali osiguranja prilagođene vašim specifičnim potrebama uz konkurentne premije i podršku ovlaštenih agenata.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => {
            const Icon = p.icon;
            return (
              <Card
                key={p.id}
                className="p-6 flex flex-col justify-between hover:shadow-xl transition-all border-slate-200 group bg-white"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-500 font-mono">
                      {p.priceStarting}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                      {p.title}
                    </h3>
                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1.5 border ${p.accentBg}`}>
                      {p.tag}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {p.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex flex-col gap-2">
                  <Link to={`/calculator?type=${p.id}`}>
                    <Button variant="primary" size="sm" className="w-full text-xs font-bold">
                      Izračunaj ponudu
                    </Button>
                  </Link>
                  <Link to={`/services/${p.id}`}>
                    <Button variant="ghost" size="sm" className="w-full text-xs text-slate-600 hover:text-slate-900">
                      Saznaj više detalja &rarr;
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((s, idx) => (
              <div key={idx} className="space-y-2">
                <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-emerald-400 font-mono">
                  {s.value}
                </p>
                <p className="text-xs sm:text-sm text-slate-300 font-medium">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DIGITAL CLAIMS HIGHLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-50 to-brand-50/40 rounded-3xl p-8 sm:p-12 border border-slate-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                Šteta se dogodila? Bez panike.
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Digitalna prijava štete (FNOL) u 4 jednostavna koraka
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Zaboravite papirnate formulare i čekanje na šalteru. Učitajte fotografije mobitelom, unesite lokaciju i IBAN. Naš tim odmah pokreće procjenu i isplatu.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white shadow-xs border border-slate-200 flex items-center justify-center font-bold text-brand-600 shrink-0">
                    1
                  </div>
                  <div>
                    <strong>Unos podataka o nezgodi:</strong> Odaberite svoju policu i lokaciju događaja.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white shadow-xs border border-slate-200 flex items-center justify-center font-bold text-brand-600 shrink-0">
                    2
                  </div>
                  <div>
                    <strong>Fotografije oštećenja:</strong> Učitajte slike izravno s pametnog telefona do 15 MB.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white shadow-xs border border-slate-200 flex items-center justify-center font-bold text-brand-600 shrink-0">
                    3
                  </div>
                  <div>
                    <strong>Službeni broj spisa:</strong> Dobivate instant kod formata ST-2026-XXXX za praćenje.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white shadow-xs border border-slate-200 flex items-center justify-center font-bold text-brand-600 shrink-0">
                    4
                  </div>
                  <div>
                    <strong>Brza isplata na IBAN:</strong> Likvidacija po odobrenju procjenitelja.
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Link to="/claims">
                  <Button variant="danger" size="lg" className="text-sm font-bold">
                    Prijavi štetu odmah &rarr;
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-md space-y-4">
              <h4 className="font-bold text-slate-900 text-sm">Status Vašeg Odštetnog Spisa</h4>
              <p className="text-xs text-slate-500">
                Već imate otvoren spis? Pratite status u realnom vremenu uz vaš broj štete (npr. ST-2026-4819).
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-mono font-bold text-slate-800">ST-2026-4819</span>
                  <span className="ml-auto text-emerald-700 font-semibold">Odobreno za isplatu</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="font-mono font-bold text-slate-800">ST-2026-9142</span>
                  <span className="ml-auto text-amber-700 font-semibold">Uviđaj procjenitelja</span>
                </div>
              </div>

              <Link to="/claims" className="block text-center text-xs font-bold text-brand-600 hover:text-brand-800 pt-2">
                Provjeri status postojećeg spisa &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CLIENT TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
            Iskustva Naših Osiguranika
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900">
            Povjerenje građana i poduzetnika diljem Hrvatske
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <Card key={idx} className="p-6 bg-white border-slate-200 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-600 italic leading-relaxed">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 text-xs">
                <p className="font-bold text-slate-900">{t.author}</p>
                <p className="text-slate-500">{t.location}</p>
                <span className="inline-block text-[10px] font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded mt-1">
                  {t.product}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-navy-950 via-brand-950 to-navy-900 rounded-3xl p-8 sm:p-14 text-white text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Osigurajte svoju budućnost već danas
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              Pridružite se tisućama zadovoljnih klijenata koji su odabrali Agenciju Život i Generali osiguranje za pouzdanog partnera.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/calculator">
              <Button variant="teal" size="lg" className="font-extrabold px-8">
                Izračunaj besplatnu ponudu
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg" className="bg-white/10 text-white border-white/20 hover:bg-white/20 font-bold">
                Kontaktirajte naše brokere
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
