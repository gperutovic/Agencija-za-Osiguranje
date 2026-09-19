import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Car,
  Home,
  Heart,
  Activity,
  CheckCircle2,
  Shield,
  FileText,
  AlertCircle,
  ArrowLeft,
  Download,
  PhoneCall,
} from 'lucide-react';
import { AutoQuoteCalculator } from '../components/calculators/AutoQuoteCalculator';
import { PropertyQuoteCalculator } from '../components/calculators/PropertyQuoteCalculator';
import { LifeQuoteCalculator } from '../components/calculators/LifeQuoteCalculator';
import { HealthQuoteCalculator } from '../components/calculators/HealthQuoteCalculator';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';

interface ServiceDetailData {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  description: string;
  coverages: Array<{ name: string; desc: string }>;
  riders: Array<{ name: string; desc: string }>;
  ipidNotes: string[];
}

const SERVICES_DATA: Record<string, ServiceDetailData> = {
  auto: {
    title: 'Auto Odgovornost & Kasko Osiguranje',
    subtitle: 'Zakonita zaštita i sveobuhvatno kasko osiguranje za motorna vozila',
    icon: Car,
    description:
      'Generali obvezno auto osiguranje štiti vas od financijske odgovornosti za štete nanesene trećim osobama, dok kasko polica pokriva štetu na vašem vlastitom vozilu bez obzira na krivnju – uključujući prometne nezgode, tuču, provalu i vandalizam.',
    coverages: [
      {
        name: 'Obvezno osiguranje (AO)',
        desc: 'Zakonski propisani iznosi pokrića: do 6.450.000 € za štete na osobama i do 1.300.000 € za štete na stvarima po štetnom događaju.',
      },
      {
        name: 'Puni Kasko (Bez franšize)',
        desc: 'Pokriće šteta uslijed sudara, prevrnuća, udara predmeta, požara, eksplozije, oluje i tuče bez obveznog sudjelovanja u šteti.',
      },
      {
        name: 'Pomoć na cesti 24/7 (Asistencija)',
        desc: 'Besplatan popravak na licu mjesta, vuča vozila do najbližeg servisa, zamjensko vozilo do 5 dana i hotelski smještaj u RH i inozemstvu.',
      },
    ],
    riders: [
      { name: 'Zaštita bonusa', desc: 'Prva prijavljena šteta u godini ne utječe na vaš stečeni premijski stupanj (50% bonus).' },
      { name: 'Lom stakla', desc: 'Neograničeno pokriće za popravak ili zamjenu vjetrobranskog i bočnih stakala bez gubitka kasko bonusa.' },
      { name: 'Nalet na divljač', desc: 'Pokriće šteta nastalih udarom divljači ili domaćih životinja na javnim prometnicama.' },
    ],
    ipidNotes: [
      'Informativni dokument o proizvodu (IPID) izrađen sukladno EU Direktivi 2016/97.',
      'Pravo na raskid ugovora na daljinu unutar 14 dana sukladno Zakonu o zaštiti potrošača.',
      'Franšiza: mogućnost odabira 0%, 5% ili 10% učešća za povoljniju godišnju premiju.',
    ],
  },
  property: {
    title: 'Osiguranje Doma, Stana & Zaštita od Potresa',
    subtitle: 'Mir i sigurnost za vaše obiteljsko gnijezdo i cjelokupnu imovinu',
    icon: Home,
    description:
      'Polica osiguranja imovine Agencije Život i Generali osiguranja pruža cjelovito jamstvo obnove doma. Uključuje građevinski dio, zidne i podne obloge, ugradbenu opremu te sve pokretnine i namještaj u kućanstvu.',
    coverages: [
      {
        name: 'Požarni rizici i elementarne nepogode',
        desc: 'Požar, udar groma, eksplozija, oluja jača od 62 km/h, tuča, klizanje tla i odron stijena.',
      },
      {
        name: 'Posebno pokriće za potres',
        desc: 'Pokriće konstruktivnih i nekonstruktivnih oštećenja nastalih potresom na punu novonabavnu građevinsku vrijednost bez primjene podosiguranja.',
      },
      {
        name: 'Izlijevanje vode iz instalacija',
        desc: 'Puknuće vodovodnih ili kanalizacijskih cijevi, kvar na uređajima za grijanje te troškovi pronalaska kvara i sanacije zidova.',
      },
    ],
    riders: [
      { name: 'Provalna krađa i razbojništvo', desc: 'Otuđeni namještaj, tehnika, odjeća, novac i popravak oštećenih ulaznih vrata i brava.' },
      { name: 'Odgovornost iz posjeda nekretnine', desc: 'Šteta nanesena susjedima (npr. poplava susjednog stana, pad crijepa s krova).' },
      { name: 'Privremeni zamjenski smještaj', desc: 'Troškovi hotelskog ili unajmljenog smještaja do 12 mjeseci ako nekretnina postane nenastanjiva.' },
    ],
    ipidNotes: [
      'Polica je usklađena za vinkulaciju stambenih kredita kod svih poslovnih banaka u RH.',
      'Obračun naknade vrši se po novoj vrijednosti bez amortizacije.',
    ],
  },
  life: {
    title: 'Životno Osiguranje ŽIVOT+',
    subtitle: 'Financijski štit za obitelj i dugoročna kapitalizirana štednja',
    icon: Heart,
    description:
      'Program ŽIVOT+ spaja osigurateljnu zaštitu obitelji u nepredviđenim situacijama s mogućnošću sigurne štednje za mirovinu ili školovanje djece. Polica je idealan instrument za miran san i osiguranje kredita.',
    coverages: [
      {
        name: 'Osigurana svota za doživljenje',
        desc: 'Zajamčena isplata ugovorenog iznosa i pripisane dobiti po isteku trajanja police osiguranja.',
      },
      {
        name: 'Osiguranje za slučaj smrti',
        desc: 'Trenutačna isplata osigurane svote korisnicima police bez poreza na nasljedstvo i bez čekanja ostavinske rasprave.',
      },
      {
        name: 'Dopunsko osiguranje od posljedica nezgode',
        desc: 'Isplata postotka invaliditeta s progresijom do 300% i dnevne naknade za boravak u bolnici.',
      },
    ],
    riders: [
      { name: 'Pokriće za 20 teških bolesti', desc: 'Isplata ugovorene svote odmah po postavljanju dijagnoze za liječenje i skrb.' },
      { name: 'Oslobođenje od plaćanja premije', desc: 'Ako nastupi trajna nesposobnost za rad, Generali preuzima plaćanje vaših premija.' },
      { name: 'Vinkulacija u korist banke', desc: 'Besplatno izdavanje vinkulacijskog lista za potrebe stambenog kredita.' },
    ],
    ipidNotes: [
      'Minimalno trajanje osiguranja: 5 godina; maksimalno: do navršene 75. godine života.',
      'Mogućnost mirovanja ili predujma nakon isteka 3 godine ugovora.',
    ],
  },
  health: {
    title: 'Dodatno & Dopunsko Zdravstveno Osiguranje',
    subtitle: 'Prioritetni pristup vrhunskoj medicinskoj skrbi bez listi čekanja',
    icon: Activity,
    description:
      'Nemojte čekati mjesece na pregled. Polica dodatnog zdravstvenog osiguranja omogućuje vam termine unutar nekoliko dana u preko 300 renomiranih privatnih poliklinika diljem Hrvatske.',
    coverages: [
      {
        name: 'Specijalistički pregledi',
        desc: 'Kardiolog, dermatolog, neurolog, oftalmolog, ortoped, ginekolog, urolog i svi ostali specijalisti bez uputnice.',
      },
      {
        name: 'Moderna dijagnostika (MR, CT, UZV)',
        desc: 'Uključeni najsuvremeniji dijagnostički postupci, ultrazvuk srca, mamografija, endoskopija i laboratorijske pretrage krvi.',
      },
      {
        name: 'Godišnji sistematski pregled',
        desc: 'Detaljna preventivna provjera zdravstvenog stanja jednom godišnje u odabranoj partnerskoj ustanovi.',
      },
    ],
    riders: [
      { name: 'Dopunsko pokriće participacije', desc: '100% pokriveni troškovi participacije u javnom zdravstvu (bolnički dani, uputnice).' },
      { name: 'Pokriće B-liste lijekova', desc: 'Refundacija doplata za recepte s dopunske liste lijekova HZZO-a.' },
      { name: 'Fizikalna i medicinska rehabilitacija', desc: 'Paketi fizikalne terapije nakon operacija ili ozljeda lokomotornog sustava.' },
    ],
    ipidNotes: [
      'Mreža pokriva Zagreb, Split, Rijeku, Osijek, Pulu, Zadar i druge veće gradove.',
      'Rezervacija termina putem Generali medicinskog asistenta u roku 24 sata.',
    ],
  },
};

export const ServiceDetailPage: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();

  const service = serviceId ? SERVICES_DATA[serviceId] : null;

  if (!service) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center px-4">
        <AlertCircle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Program osiguranja nije pronađen</h2>
        <p className="text-sm text-slate-600 mb-6">
          Odabrana stranica ne postoji ili je premještena.
        </p>
        <Link to="/services">
          <Button variant="primary">Povratak na sve programe</Button>
        </Link>
      </div>
    );
  }

  const Icon = service.icon;

  const renderCalculator = () => {
    switch (serviceId) {
      case 'auto':
        return <AutoQuoteCalculator />;
      case 'property':
        return <PropertyQuoteCalculator />;
      case 'life':
        return <LifeQuoteCalculator />;
      case 'health':
        return <HealthQuoteCalculator />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-16 pb-24 text-slate-900 relative">
      {/* Header Banner */}
      <section className="relative overflow-hidden pt-12 pb-14">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 relative z-10">
          <Link
            to="/services"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-teal-700 hover:text-teal-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Svi programi osiguranja
          </Link>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200/80 text-teal-700 flex items-center justify-center shadow-xs">
              <Icon className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">{service.title}</h1>
              <p className="text-slate-500 text-sm mt-1 font-normal">{service.subtitle}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid: Details + Embedded Calculator */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Scope, Riders, IPID */}
          <div className="lg:col-span-6 space-y-8">
            <div className="p-6 sm:p-8 bg-white border border-slate-200/80 rounded-3xl space-y-6 shadow-bento">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Opis i svrha pokrića</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">{service.description}</p>
              </div>

              {/* Coverages */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-teal-800">
                  Temeljna pokrića police
                </h4>
                <div className="space-y-3">
                  {service.coverages.map((cov, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <h5 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        {cov.name}
                      </h5>
                      <p className="text-xs text-slate-500 mt-1 pl-6 leading-relaxed">{cov.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Riders */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-700">
                  Dopunska pokrića i opcije (Riders)
                </h4>
                <div className="space-y-3">
                  {service.riders.map((r, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <h5 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-amber-600" />
                        {r.name}
                      </h5>
                      <p className="text-xs text-slate-500 mt-1 pl-6 leading-relaxed">{r.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* IPID Notice */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-1.5 font-mono">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <FileText className="w-4 h-4 text-teal-700" />
                  <span>Informacije o proizvodu (IPID)</span>
                </div>
                {service.ipidNotes.map((note, idx) => (
                  <p key={idx} className="text-[11px] leading-relaxed">
                    &bull; {note}
                  </p>
                ))}
              </div>
            </div>

            {/* Advisor Callout */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 text-slate-900 flex items-center justify-between gap-4 shadow-bento">
              <div>
                <h4 className="font-bold text-base text-slate-900">Trebate pomoć ili ponudu za pravne osobe?</h4>
                <p className="text-xs text-slate-500 mt-1 font-normal">
                  Naši licencirani agenti pripremit će individualni paket po mjeri.
                </p>
              </div>
              <Link to="/contact">
                <Button variant="primary" size="sm" className="whitespace-nowrap font-mono font-bold">
                  Kontaktiraj brokera
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: Interactive Embedded Calculator */}
          <div className="lg:col-span-6 sticky top-24">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">
                  Izračunajte vašu premiju uživo
                </h3>
                <span className="text-xs font-mono text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full font-bold border border-teal-200 shadow-2xs">
                  Aktuarski izračun
                </span>
              </div>
              {renderCalculator()}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
