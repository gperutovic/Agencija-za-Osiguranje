import React from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Award,
  Users,
  CheckCircle2,
  Building,
  Scale,
  FileText,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';

export const AboutUsPage: React.FC = () => {
  const team = [
    {
      name: 'Marija Šarić',
      role: 'Izvršna direktorica & Stariji broker',
      license: 'HANFA HR-HANFA-2024-88912',
      bio: 'Preko 15 godina iskustva u korporativnim i osobnim osiguranjima. Specijalist za upravljanje rizicima i flotna osiguranja.',
    },
    {
      name: 'Ivan Radić',
      role: 'Voditelj procjene i likvidacije šteta',
      license: 'HANFA HR-HANFA-2023-41094',
      bio: 'Ovlašteni procjenitelj motornih vozila i građevinskih šteta. Osigurava rješavanje odštetnih zahtjeva unutar zakonskih rokova.',
    },
    {
      name: 'Ana Horvat',
      role: 'Voditeljica klijentskog servisa & Životna osiguranja',
      license: 'HANFA HR-HANFA-2025-10294',
      bio: 'Stručnjakinja za mješovita životna osiguranja, privatne mirovinske planove i osiguranja vinkulirana u korist stambenih kredita.',
    },
  ];

  const values = [
    {
      title: 'Beskompromisna Transparentnost',
      desc: 'Sve premije, franšize, uvjeti i izuzeća jasno su predočeni prije ugovaranja. Bez sitnih slova i neugodnih iznenađenja.',
    },
    {
      title: 'Zastupanje Interesa Klijenta',
      desc: 'Kao ovlašteni zastupnik, naš primarni cilj je vaša financijska sigurnost i maksimalna brzina isplate u slučaju štetnog događaja.',
    },
    {
      title: 'Vrhunska Digitalna Rješenja',
      desc: 'Uveli smo najsuvremenije kalkulatore, digitalni trezor dokumenata i online prijavu šteta u 4 jednostavna koraka.',
    },
    {
      title: 'Snaga Generali Grupe',
      desc: 'Iza svake police stoji Generali osiguranje d.d. – jedan od najvećih i financijski najstabilnijih osiguratelja na svijetu.',
    },
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-navy-950 via-slate-900 to-navy-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-teal-300 text-xs font-bold uppercase tracking-wider">
            <Building className="w-4 h-4" />
            <span>O Agenciji Život d.o.o. Zagreb</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight max-w-3xl mx-auto">
            Vaš pouzdani partner za sigurniju i mirniju budućnost
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Spoj višedesetljetnog osigurateljnog iskustva Generali grupe i moderne hrvatske digitalne agencije posvećene zaštiti vaše obitelji i poslovanja.
          </p>
        </div>
      </section>

      {/* Legal & HANFA Status Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="p-8 sm:p-10 border-slate-200 bg-white shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2 text-brand-700">
                <Scale className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Službeni Pravni Status & Regulativa
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Ovlaštenje za obavljanje poslova zastupanja u osiguranju
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                <strong>ŽIVOT d.o.o. za poslove zastupanja u osiguranju</strong> registrirano je trgovačko društvo sa sjedištem u Zagrebu, Junija Palmotića 76. Poslove distribucije osiguranja obavljamo na temelju rješenja Hrvatske agencije za nadzor financijskih usluga (HANFA) <strong>Klasa: UP/I-983-02/24-01/12, Urbroj: 326-01-24-2</strong>, u skladu sa Zakonom o osiguranju (NN 30/15, 112/18, 63/20, 133/20).
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Društvo ima sklopljen ugovor o zastupanju s vodećim osigurateljem <strong>Generali osiguranje d.d. Zagreb</strong> te posjeduje važeće osiguranje od profesionalne odgovornosti do visine od 1.924.560 € po osiguranom slučaju.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">OIB Agencije</span>
                  <span className="font-mono font-bold text-slate-800">14329077049</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">MBS Registra</span>
                  <span className="font-mono font-bold text-slate-800">080514170</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Temeljni kapital</span>
                  <span className="font-bold text-slate-800">Uplaćen u cijelosti</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Sjedište</span>
                  <span className="font-bold text-slate-800">Zagreb, Palmotićeva 76</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center mx-auto shadow-inner">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base">HANFA Registar</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Uvid u registar ovlaštenih posrednika možete provjeriti izravno na službenim stranicama regulatora:
                </p>
              </div>
              <a
                href="https://www.hanfa.hr"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-xs font-bold text-brand-600 hover:text-brand-800 underline"
              >
                Provjeri u registru hanfa.hr &rarr;
              </a>
            </div>
          </div>
        </Card>
      </section>

      {/* Core Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
            Naša Načela Poslovanja
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900">
            Zašto klijenti biraju Agenciju Život?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {values.map((v, i) => (
            <Card key={i} className="p-6 bg-white border-slate-200 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base mb-1">{v.title}</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{v.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Leadership & Brokers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
            Stručni Tim
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900">
            Licencirani HANFA zastupnici i procjenitelji
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {team.map((m, i) => (
            <Card key={i} className="p-6 bg-white border-slate-200 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-navy-900 to-teal-700 text-white flex items-center justify-center font-bold text-xl">
                  {m.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">{m.name}</h4>
                  <p className="text-xs font-semibold text-brand-700 mt-0.5">{m.role}</p>
                  <p className="text-[11px] font-mono text-slate-400 mt-1">{m.license}</p>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
                  {m.bio}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-2xl font-bold">Želite nas posjetiti u uredu?</h3>
            <p className="text-slate-400 text-xs sm:text-sm">
              Junija Palmotića 76, 10000 Zagreb &bull; Radno vrijeme: Pon - Pet 08:00 - 17:00
            </p>
          </div>
          <Link to="/contact">
            <Button variant="teal" size="lg" className="font-bold whitespace-nowrap">
              Dogovori sastanak u uredu &rarr;
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};
