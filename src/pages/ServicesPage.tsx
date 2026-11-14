import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Home, Heart, Activity, ArrowRight, Check } from 'lucide-react';
import { Accordion } from '../components/common/Accordion';

export const ServicesPage: React.FC = () => {
  const programs = [
    {
      id: 'auto',
      calculatorPath: '/auto-osiguranje',
      title: 'Auto odgovornost i kasko osiguranje',
      subtitle: 'Zaštita u prometu bez nepredviđenih troškova',
      icon: Car,
      startingPrice: 'od 118,00 € god.',
      features: [
        'Obvezno auto osiguranje (AO) uz prijenos stečenog bonusa do 50%',
        'Puni kasko program i specijalizirani Toyota Centar Zagreb VIP Kasko',
        'Asistencija na cesti u Hrvatskoj i Europi uz opciju zamjenskog vozila',
        'Dodatna zaštita stakala, naleta na divljač i očuvanja bonusa',
        'Osiguranje vozača i putnika od posljedica nesretnog slučaja',
      ],
      idealFor: 'Vlasnike osobnih, gospodarskih i službenih vozila.',
    },
    {
      id: 'property',
      calculatorPath: '/imovina',
      title: 'Osiguranje doma i zaštita od potresa',
      subtitle: 'Zaštita za stanove, obiteljske kuće i kućanstvo',
      icon: Home,
      startingPrice: 'od 0,95 €/m² god.',
      features: [
        'Osiguranje građevinskog dijela objekta na novu vrijednost',
        'Zaštita namještaja, uređaja i pokretnih stvari kućanstva',
        'Opcija dopunskog pokrića za rizik od potresa',
        'Izljev vode iz cijevi uključujući trošak lociranja kvara',
        'Odgovornost prema trećim osobama za štete prema susjedima',
      ],
      idealFor: 'Vlasnike stanova, obiteljskih kuća i korisnike stambenih kredita.',
    },
    {
      id: 'life',
      calculatorPath: '/services/life',
      title: 'Životno osiguranje ŽIVOT+',
      subtitle: 'Dugoročna financijska sigurnost obitelji i vinkulacija kredita',
      icon: Heart,
      startingPrice: 'od 25,00 € mj.',
      features: [
        'Osigurana svota za slučaj smrti uslijed bolesti ili nezgode',
        'Mješovito osiguranje života s isplatom po doživljenju',
        'Dopunsko pokriće za slučaj teških bolesti i kirurških zahvata',
        'Prilagođeno vinkulaciji u korist banaka pri podizanju stambenih kredita',
        'Fleksibilna mjesečna, kvartalna ili godišnja dinamika uplate',
      ],
      idealFor: 'Obitelji, hranitelje kućanstva i korisnike dugoročnih kredita.',
    },
    {
      id: 'health',
      calculatorPath: '/dopunsko-zdravstveno',
      title: 'Dopunsko i dodatno zdravstveno osiguranje',
      subtitle: 'Pokriće bolničkih participacija, lijekova s B-liste i privatne dijagnostike',
      icon: Activity,
      startingPrice: 'od 6,50 € mj.',
      features: [
        'Usporedba privatnih polica s cijenom HZZO dopunskog osiguranja (15,00 €)',
        'Mogućnost uključivanja nadoplate za lijekove s dopunske B-liste',
        'Specijalistički pregledi i laboratorijska dijagnostika u privatnim poliklinikama',
        'Preventivni godišnji sistematski pregledi za građane i tvrtke',
        'Bez karence pri urednom prijelazu s važeće police',
      ],
      idealFor: 'Pojedince, obitelji i poslodavce koji brinu o zdravlju zaposlenika.',
    },
  ];

  const faqs = [
    {
      title: 'Mogu li prenijeti postojeći bonus od 50% kod promjene osiguratelja?',
      content:
        'Da. Sukladno pravilima Hrvatskog ureda za osiguranje (HUO), stečeni premijski stupanj na polici autoodgovornosti uredno se prenosi između ovlaštenih osiguratelja bez gubitka prava.',
    },
    {
      title: 'Koliko traje obrada prijave štete?',
      content:
        'Nakon zaprimanja elektroničke prijave s potrebnim fotografijama i zapisnikom, naš ured koordinira spis s procjeniteljem u roku od 24 radna sata.',
    },
    {
      title: 'Mogu li vinkulirati policu osiguranja imovine ili života u korist banke?',
      content:
        'Da, sve police Generali osiguranja i partnerskih društava u potpunosti zadovoljavaju uvjete poslovnih banaka u RH za vinkulaciju stambenih i hipotekarnih kredita.',
    },
    {
      title: 'Naplaćuje li Agencija Život naknadu za usporedbu ponuda?',
      content:
        'Ne. Kao ovlašteni zastupnik u osiguranju, klijentima ne naplaćujemo naknadu za savjetovanje niti pripremu informativnih ponuda. Premija je identična službenim cjenicima društava.',
    },
  ];

  return (
    <div className="bg-slate-50 text-slate-900 pb-20">
      {/* Header */}
      <section className="bg-white border-b border-slate-200 pt-12 pb-12 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <span className="inline-block px-3 py-1 rounded-md bg-slate-100 border border-slate-200 text-xs font-semibold text-[#0F2942] uppercase tracking-wider">
            Katalog programa osiguranja
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Programi osiguranja za građane i poslovne subjekte
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Pregledajte ključna pokrića po pojedinoj vrsti osiguranja, izračunajte okvirnu premiju i zatražite službenu ponudu s IPID dokumentacijom.
          </p>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {programs.map((prog) => {
            const Icon = prog.icon;
            return (
              <div
                key={prog.id}
                className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-lg bg-slate-100 text-[#0F2942] flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-slate-900">{prog.title}</h2>
                        <p className="text-xs text-slate-500 mt-0.5">{prog.subtitle}</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-[#0F2942] shrink-0 tabular-nums">
                      {prog.startingPrice}
                    </span>
                  </div>

                  <ul className="space-y-2.5 pt-2 border-t border-slate-100">
                    {prog.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                        <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <p className="text-xs text-slate-500 pt-1">
                    <strong className="text-slate-700">Preporučeno za:</strong> {prog.idealFor}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5 pt-4 border-t border-slate-100">
                  <Link
                    to={prog.calculatorPath}
                    className="flex-1 py-2.5 px-4 rounded-lg bg-[#0F2942] hover:bg-[#163859] text-white text-xs sm:text-sm font-semibold text-center inline-flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Izračunaj premiju</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to={`/services/${prog.id}`}
                    className="flex-1 py-2.5 px-4 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold text-center transition-colors"
                  >
                    Detalji programa
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-slate-900">Najčešća pitanja o ugovaranju</h2>
          <p className="text-xs text-slate-500">Sažeti odgovori o prijenosu bonusa, vinkulaciji i štetama</p>
        </div>

        <Accordion items={faqs} />
      </section>
    </div>
  );
};
