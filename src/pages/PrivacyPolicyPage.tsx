import React from 'react';
import { Lock, ShieldCheck, FileText, UserCheck, ExternalLink } from 'lucide-react';
import { Card } from '../components/common/Card';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="space-y-12 pb-20">
      {/* Header */}
      <section className="bg-gradient-to-b from-navy-950 via-slate-900 to-navy-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold uppercase tracking-wider">
            <Lock className="w-4 h-4" />
            <span>Opća Uredba o Zaštiti Podataka (GDPR)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Politika privatnosti i obrada osobnih podataka
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            Usklađeno s Uredbom (EU) 2016/679 Europskog parlamenta i Vijeća te Zakonom o provedbi Opće uredbe o zaštiti podataka (NN 42/18).
          </p>
        </div>
      </section>

      {/* Main Privacy Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="p-8 sm:p-12 bg-white border-slate-200 shadow-sm space-y-8 text-sm text-slate-700 leading-relaxed">
          {/* 1. Voditelj obrade */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              1. Voditelji obrade osobnih podataka
            </h3>
            <p>
              Zajednički voditelji obrade vaših osobnih podataka su:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-xs text-slate-600">
              <li>
                <strong>ŽIVOT d.o.o. za poslove zastupanja u osiguranju</strong>, Junija Palmotića 76, 10000 Zagreb, OIB: 14329077049, e-pošta službenika za zaštitu podataka: <a href="mailto:dpo@agencija-zivot.hr" className="text-brand-600 underline">dpo@agencija-zivot.hr</a>
              </li>
              <li>
                <strong>Generali osiguranje d.d.</strong>, Ulica grada Vukovara 284, 10000 Zagreb, OIB: 28549721456
              </li>
            </ul>
          </div>

          {/* 2. Svrhe i pravne osnove obrade */}
          <div className="pt-6 border-t border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              2. Svrhe i pravne osnove obrade
            </h3>
            <p>Vaše osobne podatke prikupljamo i obrađujemo isključivo u sljedeće svrhe:</p>
            <div className="mt-3 space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <p className="font-bold text-slate-900">Sklapanje i izvršenje ugovora o osiguranju (čl. 6. st. 1. t. b GDPR)</p>
                <p className="text-slate-600 mt-0.5">Izrada informativnih izračuna, procjena rizika, izdavanje police i obrada plaćanja premije.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <p className="font-bold text-slate-900">Likvidacija šteta i isplata naknade (čl. 6. st. 1. t. b i c GDPR)</p>
                <p className="text-slate-600 mt-0.5">Procjena štete na vozilu ili imovini, provjera pokrića i isplata odštete na dostavljeni IBAN.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <p className="font-bold text-slate-900">Ispunjavanje zakonskih obveza (čl. 6. st. 1. t. c GDPR)</p>
                <p className="text-slate-600 mt-0.5">Vođenje evidencije prema Zakonu o osiguranju, Zakonu o sprječavanju pranja novca i računovodstvenim propisima.</p>
              </div>
            </div>
          </div>

          {/* 3. Vrste podataka koje obrađujemo */}
          <div className="pt-6 border-t border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              3. Kategorije osobnih podataka
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
              <li><strong>Temeljni identifikacijski podaci:</strong> Ime, prezime, OIB (verificiran ISO 7064 algoritmom), adresa prebivališta.</li>
              <li><strong>Kontakt podaci:</strong> Broj telefona, email adresa.</li>
              <li><strong>Podaci o predmetu osiguranja:</strong> Registarska oznaka, broj šasije (VIN), površina nekretnine, godina izgradnje.</li>
              <li><strong>Financijski podaci:</strong> Broj tekućeg računa (IBAN) za isplate šteta, povijest uplata.</li>
              <li><strong>Dokazna građa:</strong> Fotografije i videosnimke oštećenja, policijski zapisnici.</li>
            </ul>
          </div>

          {/* 4. Prava ispitanika */}
          <div className="pt-6 border-t border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              4. Vaša prava kao ispitanika
            </h3>
            <p>U skladu s Općom uredbom o zaštiti podataka, u svakom trenutku imate pravo na:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <strong className="block text-slate-900">Pravo na pristup i uvid</strong>
                <span className="text-slate-600">Pristup svim vašim podacima u korisničkom portalu Moj Život.</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <strong className="block text-slate-900">Pravo na ispravak</strong>
                <span className="text-slate-600">Ažuriranje netočnih ili nepotpunih podataka.</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <strong className="block text-slate-900">Pravo na brisanje ("Zaborav")</strong>
                <span className="text-slate-600">U mjeri u kojoj to nije u suprotnosti sa Zakonom o osiguranju (obvezno čuvanje 10 god).</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <strong className="block text-slate-900">Pravo na prenosivost podataka</strong>
                <span className="text-slate-600">Preuzimanje podataka u strukturiranom digitalnom obliku.</span>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <p className="font-bold text-slate-900">Nadzorno tijelo za zaštitu osobnih podataka u RH:</p>
              <p className="text-slate-600">Agencija za zaštitu osobnih podataka (AZOP), Selska cesta 136, 10000 Zagreb &bull; <a href="https://azop.hr" target="_blank" rel="noopener noreferrer" className="text-brand-600 underline">www.azop.hr</a></p>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
};
