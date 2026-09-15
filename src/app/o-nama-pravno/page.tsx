import React from 'react';
import {
  ShieldCheck,
  Building2,
  FileCheck,
  Scale,
  Lock,
  ExternalLink,
  Phone,
  Mail,
  MapPin,
  HelpCircle,
} from 'lucide-react';

export default function LegalImpressumPage() {
  return (
    <div className="w-full bg-slate-50 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold uppercase tracking-wider mb-4">
            <Scale className="w-3.5 h-3.5 text-blue-600" />
            <span>Pravne informacije i usklađenost</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            O nama i pravne obavijesti
          </h1>
          <p className="mt-3 text-base text-slate-600">
            Transparentnost, zakonitost poslovanja i regulatorna usklađenost s propisima
            Republike Hrvatske i Europske unije.
          </p>
        </div>

        {/* 1. Impressum & Corporate Details */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              Temeljni podaci o društvu (Impressum)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-700">
            <div>
              <span className="text-slate-500 block text-xs">Puni naziv pravne osobe:</span>
              <strong className="text-slate-900">Agencija za osiguranje d.o.o. za zastupanje u osiguranju</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-xs">Sjedište i adresa:</span>
              <span className="text-slate-900">Radnička cesta 80, 10000 Zagreb, Hrvatska</span>
            </div>
            <div>
              <span className="text-slate-500 block text-xs">Osobni identifikacijski broj (OIB):</span>
              <span className="font-mono font-bold text-slate-900">14329077049</span>
            </div>
            <div>
              <span className="text-slate-500 block text-xs">Matični broj subjekta (MBS):</span>
              <span className="font-mono font-bold text-slate-900">080514170</span>
            </div>
            <div>
              <span className="text-slate-500 block text-xs">Registarski sud:</span>
              <span className="text-slate-900">Trgovački sud u Zagrebu</span>
            </div>
            <div>
              <span className="text-slate-500 block text-xs">Temeljni kapital:</span>
              <span className="text-slate-900">20.000,00 EUR, uplaćen u cijelosti</span>
            </div>
            <div>
              <span className="text-slate-500 block text-xs">Korisnička podrška:</span>
              <a href="tel:015550666" className="text-blue-600 font-semibold underline">
                01 555 0666
              </a>
            </div>
            <div>
              <span className="text-slate-500 block text-xs">Službeni kontakt e-mail:</span>
              <a href="mailto:podrska@agencija-za-osiguranje.hr" className="text-blue-600 font-semibold underline">
                podrska@agencija-za-osiguranje.hr
              </a>
            </div>
          </div>
        </div>

        {/* 2. HANFA Regulatory Status */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              Nadzor i registracija pri HANFA-i
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Društvo je upisano u <strong>Registar distributera osiguranja</strong> pod brojem{' '}
            <strong className="text-slate-900 font-mono">ZO-88912</strong> koji vodi{' '}
            <strong>Hrvatska agencija za nadzor financijskih usluga (HANFA)</strong>, sa sjedištem
            na adresi Franje Račkog 6, 10000 Zagreb (
            <a
              href="https://www.hanfa.hr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline font-semibold inline-flex items-center gap-1"
            >
              www.hanfa.hr <ExternalLink className="w-3 h-3" />
            </a>
            ).
          </p>
          <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-100 text-xs text-emerald-900">
            Upis u registar HANFA-e možete javno provjeriti u bilo kojem trenutku putem službene tražilice registara na internetskim stranicama nadzornog tijela.
          </div>
        </div>

        {/* 3. Pre-contractual Notice under IDD (Insurance Distribution Directive) */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-blue-600" />
              Predugovorne informacije za ugovaratelje (čl. 401. Zakona o osiguranju)
            </h2>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <p>
              Sukladno Direktivi o distribuciji osiguranja (IDD 2016/97) i Zakonu o osiguranju (NN 30/15, 112/18, 63/20, 133/20), prije sklapanja ugovora o osiguranju obavještavamo korisnika o sljedećem:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-700 text-xs">
              <li>
                <strong>Pravni status:</strong> Društvo djeluje kao zastupnik u osiguranju na temelju ugovora o zastupanju sklopljenih s ovlaštenim osiguravajućim društvima u Republici Hrvatskoj.
              </li>
              <li>
                <strong>Vlasnički udjeli:</strong> Društvo nema izravan ili neizravan udio koji predstavlja 10% ili više glasačkih prava ili kapitala u bilo kojem društvu za osiguranje, niti ijedno društvo za osiguranje ima udio u našem kapitalu.
              </li>
              <li>
                <strong>Naknada za uslugu:</strong> Za pružanje usluga distribucije osiguranja društvo <strong>ne naplaćuje nikakvu naknadu niti proviziju od klijenta</strong>. Naša se naknada isplaćuje isključivo kao ugovorena provizija od strane osiguravajućeg društva čija se polica ugovori.
              </li>
              <li>
                <strong>Savjetovanje na temelju analize tržišta:</strong> Prilikom prezentacije ponuda, naš sustav i agenti provode objektivnu analizu uvjeta i premija dostupnih partnera kako bismo predložili pokriće koje najbolje odgovara vašim potrebama.
              </li>
            </ul>
          </div>
        </div>

        {/* 4. Alternative Dispute Resolution (HUO & HGK) */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Scale className="w-5 h-5 text-purple-600" />
              Prigovori i izvansudsko rješavanje sporova
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Ako niste zadovoljni našom uslugom ili postupkom obrade odštetnog zahtjeva, imate pravo podnijeti pisani prigovor putem e-maila{' '}
            <strong className="text-slate-900">prigovori@agencija-za-osiguranje.hr</strong> ili poštom na adresu sjedišta. Na prigovor ćemo odgovoriti u roku od najkasnije 15 dana.
          </p>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            U slučaju neriješenog spora, korisnik može pokrenuti postupak izvansudskog rješavanja spora pred:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
              <strong className="block text-slate-900 mb-1">Centar za mirenje pri HUO</strong>
              <p className="text-slate-500">Hrvatski ured za osiguranje</p>
              <p className="text-slate-500">Martićeva 71, 10000 Zagreb</p>
              <a
                href="https://www.huo.hr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 font-semibold underline mt-2 inline-block"
              >
                www.huo.hr
              </a>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
              <strong className="block text-slate-900 mb-1">Centar za mirenje pri HGK</strong>
              <p className="text-slate-500">Hrvatska gospodarska komora</p>
              <p className="text-slate-500">Rooseveltov trg 2, 10000 Zagreb</p>
              <a
                href="https://www.hgk.hr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 font-semibold underline mt-2 inline-block"
              >
                www.hgk.hr
              </a>
            </div>
          </div>
        </div>

        {/* 5. GDPR & Data Privacy */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-600" />
              Zaštita privatnosti i obrada osobnih podataka (GDPR)
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Društvo obrađuje vaše osobne podatke (uključujući OIB, kontakt podatke i podatke o vozilu/imovini) isključivo u svrhu izrade informativnih izračuna, predugovornih radnji, sklapanja police i prijave štete. Svi podaci pohranjuju se na sigurnim poslužiteljima unutar Europske unije uz 256-bitnu TLS enkripciju.
          </p>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Kao ispitanik imate pravo na pristup podacima, ispravak, brisanje, ograničenje obrade te prigovor Agenciji za zaštitu osobnih podataka (AZOP, Selska cesta 136, Zagreb).
          </p>
        </div>
      </div>
    </div>
  );
}
