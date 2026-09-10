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
    <div className="space-y-16 pb-24 text-slate-100">
      {/* Header Banner */}
      <section className="relative overflow-hidden pt-12 pb-14 text-center space-y-4">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#fb6504]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono font-bold tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#fb6504] animate-pulse" />
            <span className="text-white">O Agenciji Život d.o.o. Zagreb</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight max-w-3xl mx-auto text-white">
            Vaš pouzdani partner za sigurniju i mirniju budućnost
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed font-light">
            Spoj višedesetljetnog osigurateljnog iskustva Generali grupe i moderne hrvatske digitalne agencije posvećene zaštiti vaše obitelji i poslovanja.
          </p>
        </div>
      </section>

      {/* Legal & HANFA Status Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 border border-white/[0.08] bg-[#0a0d16]/90 backdrop-blur-xl rounded-3xl shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2 text-[#ff7b1a]">
                <Scale className="w-5 h-5" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider">
                  Službeni Pravni Status & Regulativa
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Ovlaštenje za obavljanje poslova zastupanja u osiguranju
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed font-light">
                <strong className="text-white">ŽIVOT d.o.o. za poslove zastupanja u osiguranju</strong> registrirano je trgovačko društvo sa sjedištem u Zagrebu, Junija Palmotića 76. Poslove distribucije osiguranja obavljamo na temelju rješenja Hrvatske agencije za nadzor financijskih usluga (HANFA) <strong className="font-mono text-[#ff7b1a]">Klasa: UP/I-983-02/24-01/12, Urbroj: 326-01-24-2</strong>, u skladu sa Zakonom o osiguranju (NN 30/15, 112/18, 63/20, 133/20).
              </p>
              <p className="text-sm text-slate-300 leading-relaxed font-light">
                Društvo ima sklopljen ugovor o zastupanju s vodećim osigurateljem <strong className="text-white">Generali osiguranje d.d. Zagreb</strong> te posjeduje važeće osiguranje od profesionalne odgovornosti do visine od 1.924.560 € po osiguranom slučaju.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/[0.08] text-xs font-mono">
                <div>
                  <span className="text-slate-500 block mb-0.5">OIB Agencije</span>
                  <span className="font-bold text-white">14329077049</span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5">MBS Registra</span>
                  <span className="font-bold text-white">080514170</span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5">Temeljni kapital</span>
                  <span className="font-bold text-white">Uplaćen u cijelosti</span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5">Sjedište</span>
                  <span className="font-bold text-white">Zagreb, Palmotićeva 76</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white/[0.02] p-6 rounded-3xl border border-white/[0.08] text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[#fb6504]/10 border border-[#fb6504]/20 text-[#ff7b1a] flex items-center justify-center mx-auto shadow-inner">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base">HANFA Registar</h4>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  Uvid u registar ovlaštenih posrednika možete provjeriti izravno na službenim stranicama regulatora:
                </p>
              </div>
              <a
                href="https://www.hanfa.hr"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-xs font-mono font-bold text-[#ff7b1a] hover:underline"
              >
                Provjeri u registru hanfa.hr &rarr;
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#fb6504]" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#ff7b1a]">
              Naša Načela Poslovanja
            </span>
          </div>
          <h2 className="text-3xl font-extrabold text-white">
            Zašto klijenti biraju Agenciju Život?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {values.map((v, i) => (
            <div key={i} className="p-6 bg-[#0a0d16]/90 border border-white/[0.08] backdrop-blur-xl rounded-3xl flex items-start gap-4 shadow-xl">
              <div className="w-10 h-10 rounded-2xl bg-[#fb6504]/10 border border-[#fb6504]/20 text-[#ff7b1a] flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base mb-1">{v.title}</h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Leadership & Brokers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#fb6504]" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#ff7b1a]">
              Stručni Tim
            </span>
          </div>
          <h2 className="text-3xl font-extrabold text-white">
            Licencirani HANFA zastupnici i procjenitelji
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {team.map((m, i) => (
            <div key={i} className="p-6 bg-[#0a0d16]/90 border border-white/[0.08] backdrop-blur-xl rounded-3xl flex flex-col justify-between shadow-xl group hover:border-[#fb6504]/40 transition-colors">
              <div className="space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#fb6504] to-[#ff7b1a] text-white flex items-center justify-center font-bold text-xl shadow-lg">
                  {m.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <h4 className="font-bold text-white text-base group-hover:text-[#ff7b1a] transition-colors">{m.name}</h4>
                  <p className="text-xs font-semibold text-[#ff7b1a] mt-0.5">{m.role}</p>
                  <p className="text-[11px] font-mono text-cyan-400 mt-1">{m.license}</p>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-white/[0.06] font-light">
                  {m.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0a0d16]/90 border border-white/[0.08] backdrop-blur-xl text-white rounded-3xl p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-2xl font-bold text-white">Želite nas posjetiti u uredu?</h3>
            <p className="text-slate-400 text-xs sm:text-sm font-mono">
              Junija Palmotića 76, 10000 Zagreb &bull; Radno vrijeme: Pon - Pet 08:00 - 17:00
            </p>
          </div>
          <Link to="/contact">
            <Button variant="primary" size="lg" className="font-mono font-bold whitespace-nowrap">
              Dogovori sastanak u uredu &rarr;
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};
