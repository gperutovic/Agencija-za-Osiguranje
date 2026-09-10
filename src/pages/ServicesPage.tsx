import React from 'react';
import { Link } from 'react-router-dom';
import {
  Car,
  Home,
  Heart,
  Activity,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
  FileCheck,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Accordion } from '../components/common/Accordion';

export const ServicesPage: React.FC = () => {
  const programs = [
    {
      id: 'auto',
      title: 'Auto Odgovornost & Kasko Osiguranje',
      subtitle: 'Sigurna vožnja bez nepredviđenih financijskih izdataka',
      icon: Car,
      color: 'text-blue-600 bg-blue-50',
      badge: 'Najpopularnije',
      startingPrice: 'od 118,00 € god.',
      features: [
        'Zakonito obvezno osiguranje (AO) s prijenosom 50% bonusa',
        'Puni kasko bez franšize za nova i rabljena vozila',
        '24/7 Asistencija na cesti (vuča, smještaj, zamjensko vozilo)',
        'Zaštita stakala, nalet na divljač i štete na parkingu',
        'Pokriće vozača i putnika od posljedica nesretnog slučaja',
      ],
      idealFor: 'Vlasnike osobnih i gospodarskih vozila, kombija i motocikala.',
    },
    {
      id: 'property',
      title: 'Osiguranje Doma & Zaštita od Potresa',
      subtitle: 'Cjelovito pokriće za stanove, obiteljske kuće i vikendice',
      icon: Home,
      color: 'text-amber-600 bg-amber-50',
      badge: 'Potres uključen',
      startingPrice: 'od 0,95 €/m² god.',
      features: [
        'Građevinski dio objekta (zidovi, krov, instalacije, temelji)',
        'Stvari kućanstva, elektronika, namještaj i umjetnine',
        'Posebna klauzula za potres s punom novonabavnom vrijednosti',
        'Izlijevanje vode iz instalacija i troškovi privremenog smještaja',
        'Odgovornost vlasnika nekretnine prema susjedima i trećima',
      ],
      idealFor: 'Vlasnike stanova, kuća, iznajmljivače apartmana i korisnike stambenih kredita.',
    },
    {
      id: 'life',
      title: 'Životno Osiguranje ŽIVOT+',
      subtitle: 'Sigurnost za vaše najdraže i pametna dugoročna štednja',
      icon: Heart,
      color: 'text-rose-600 bg-rose-50',
      badge: 'Porezna pogodnost',
      startingPrice: 'od 25,00 € mj.',
      features: [
        'Osigurana svota za slučaj smrti uslijed bolesti ili nezgode',
        'Mješovito osiguranje s garantiranom isplatom po doživljenju',
        'Dopunsko pokriće za 20 teških bolesti (karcinom, infarkt, moždani udar)',
        'Prikladno za vinkulaciju u korist bankarskog stambenog kredita',
        'Osiguranje bez kompliciranih liječničkih pregleda do 50.000 €',
      ],
      idealFor: 'Obitelji s djecom, korisnike hipotekarnih kredita i one koji žele sigurnu štednju.',
    },
    {
      id: 'health',
      title: 'Dodatno & Dopunsko Zdravstveno Osiguranje',
      subtitle: 'Vrhunska medicinska skrb u privatnim poliklinikama bez čekanja',
      icon: Activity,
      color: 'text-emerald-600 bg-emerald-50',
      badge: 'Bez čekanja',
      startingPrice: 'od 18,00 € mj.',
      features: [
        'Pregledi kod liječnika specijalista unutar 48 do 72 sata',
        'Magnetska rezonanca (MR), CT, ultrazvuk i laboratorij bez uputnice',
        'Sistematski pregledi jednom godišnje u vrhunskim poliklinikama',
        'Dopunsko zdravstveno s punim pokrićem participacija i B-liste lijekova',
        'Fizikalna terapija i manji ambulantni zahvati',
      ],
      idealFor: 'Pojedince, obitelji i poslodavce koji žele nagraditi svoje zaposlenike.',
    },
  ];

  const faqs = [
    {
      title: 'Mogu li prenijeti postojeći bonus od 50% kod promjene osiguratelja?',
      content:
        'Da, apsolutno. Sukladno pravilima HUO-a (Hrvatski ured za osiguranje), vaš stečeni bonus na polici autoodgovornosti se prenosi automatski iz centralne baze bez ikakvog gubitka stečenog prava.',
    },
    {
      title: 'Koliko brzo se isplaćuje šteta prijavljena putem portala?',
      content:
        'Nakon digitalne prijave putem našeg FNOL sustava i dostave fotografija, naš procjenitelj obrađuje spis unutar 24 sata. Nesporni dio štete isplaćuje se na vaš IBAN u roku od 3 do 7 radnih dana od kompletiranja dokumentacije.',
    },
    {
      title: 'Mogu li vinkulirati policu životnog ili imovinskog osiguranja u korist banke?',
      content:
        'Da, sve naše police Generali osiguranja u potpunosti zadovoljavaju kriterije svih komercijalnih banaka u RH za potrebe vinkulacije stambenih ili gotovinskih kredita. Vinkulacijski list izdajemo unutar 1 radnog dana.',
    },
    {
      title: 'Kako funkcionira ugovaranje police online?',
      content:
        'Izračunajte ponudu u našem interaktivnom kalkulatoru, potvrdite parametre i naši agenti će vam poslati službenu ponudu s IPID obrascem. Policu možete platiti karticom ili bankovnom uplatom, a digitalni certifikat stiže na vaš email.',
    },
  ];

  return (
    <div className="space-y-16 pb-24 text-slate-100">
      {/* Hero Header */}
      <section className="relative overflow-hidden pt-12 pb-14 text-center space-y-4">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#fb6504]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono font-bold tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#fb6504] animate-pulse" />
            <span className="text-white">Distribucija Generali Osiguranja d.d.</span>
            <span className="text-slate-500">&bull;</span>
            <span className="text-[#ff7b1a]">HANFA Licenca</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight max-w-3xl mx-auto text-white">
            Osigurateljni programi skrojeni po vašoj mjeri
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed font-light">
            Istražite detalje svakog pokrića, usporedite uvjete i zatražite personaliziranu ponudu uz asistenciju licenciranih zastupnika Agencije Život.
          </p>
        </div>
      </section>

      {/* Program Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {programs.map((prog) => {
            const Icon = prog.icon;
            return (
              <div
                key={prog.id}
                className="p-8 bg-[#0a0d16]/90 border border-white/[0.08] hover:border-[#fb6504]/50 backdrop-blur-xl rounded-3xl flex flex-col justify-between shadow-2xl transition-all group"
              >
                <div className="space-y-6">
                  {/* Top Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white flex items-center justify-center group-hover:scale-110 group-hover:border-[#fb6504]/40 group-hover:text-[#ff7b1a] transition-all">
                        <Icon className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-[#ff7b1a] transition-colors">{prog.title}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">{prog.subtitle}</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-[#ff7b1a] whitespace-nowrap">
                      {prog.badge}
                    </span>
                  </div>

                  {/* Pricing Badge */}
                  <div className="bg-white/[0.02] p-3.5 rounded-2xl border border-white/[0.06] flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-mono">Početna okvirna cijena:</span>
                    <span className="font-mono font-bold text-[#ff7b1a] text-sm">
                      {prog.startingPrice}
                    </span>
                  </div>

                  {/* Features */}
                  <div className="space-y-2.5">
                    <p className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
                      Ključna pokrića i prednosti:
                    </p>
                    {prog.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-[#fb6504]/10 rounded-2xl text-xs text-slate-300 border border-[#fb6504]/20 font-mono">
                    <strong className="text-[#ff7b1a]">Preporučeno za:</strong> {prog.idealFor}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-6 mt-6 border-t border-white/[0.06] flex flex-col sm:flex-row gap-3">
                  <Link to={`/calculator?type=${prog.id}`} className="flex-1">
                    <Button variant="primary" className="w-full text-xs font-mono font-bold">
                      Izračunaj u kalkulatoru
                    </Button>
                  </Link>
                  <Link to={`/services/${prog.id}`} className="flex-1">
                    <Button variant="outline" className="w-full text-xs font-mono text-slate-300 hover:text-white">
                      Pregledaj detalje &rarr;
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#fb6504]" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#ff7b1a]">
              Česta Pitanja (FAQ)
            </span>
          </div>
          <h2 className="text-3xl font-extrabold text-white">
            Sve što trebate znati o ugovaranju osiguranja
          </h2>
        </div>

        <Accordion items={faqs} />
      </section>
    </div>
  );
};
