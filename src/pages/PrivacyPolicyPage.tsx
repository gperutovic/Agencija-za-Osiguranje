import React from 'react';
import { Lock, ShieldCheck, FileText, UserCheck, ExternalLink } from 'lucide-react';
import { Card } from '../components/common/Card';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="space-y-12 pb-24 text-slate-100">
      {/* Header */}
      <section className="relative overflow-hidden pt-12 pb-14 text-center space-y-4">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#fb6504]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono font-bold tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#fb6504] animate-pulse" />
            <span className="text-white">Opća Uredba o Zaštiti Podataka (GDPR)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Politika privatnosti i obrada osobnih podataka
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed font-light">
            Usklađeno s Uredbom (EU) 2016/679 Europskog parlamenta i Vijeća te Zakonom o provedbi Opće uredbe o zaštiti podataka (NN 42/18).
          </p>
        </div>
      </section>

      {/* Main Privacy Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 bg-[#0a0d16]/90 border border-white/[0.08] backdrop-blur-xl rounded-3xl shadow-2xl space-y-8 text-sm text-slate-300 leading-relaxed font-light">
          {/* 1. Voditelj obrade */}
          <div>
            <h3 className="text-lg font-bold text-white mb-2">
              1. Voditelji obrade osobnih podataka
            </h3>
            <p>
              Zajednički voditelji obrade vaših osobnih podataka su:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-xs text-slate-400 font-mono">
              <li>
                <strong className="text-white">ŽIVOT d.o.o. za poslove zastupanja u osiguranju</strong>, Junija Palmotića 76, 10000 Zagreb, OIB: 14329077049, e-pošta službenika za zaštitu podataka: <a href="mailto:dpo@agencija-zivot.hr" className="text-[#ff7b1a] underline">dpo@agencija-zivot.hr</a>
              </li>
              <li>
                <strong className="text-white">Generali osiguranje d.d.</strong>, Ulica grada Vukovara 284, 10000 Zagreb, OIB: 28549721456
              </li>
            </ul>
          </div>

          {/* 2. Svrhe i pravne osnove obrade */}
          <div className="pt-6 border-t border-white/[0.08]">
            <h3 className="text-lg font-bold text-white mb-2">
              2. Svrhe i pravne osnove obrade
            </h3>
            <p>Vaše osobne podatke prikupljamo i obrađujemo isključivo u sljedeće svrhe:</p>
            <div className="mt-3 space-y-3 text-xs font-mono">
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <p className="font-bold text-white">Sklapanje i izvršenje ugovora o osiguranju (čl. 6. st. 1. t. b GDPR)</p>
                <p className="text-slate-400 mt-0.5 font-sans">Izrada informativnih izračuna, procjena rizika, izdavanje police i obrada plaćanja premije.</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <p className="font-bold text-white">Likvidacija šteta i isplata naknade (čl. 6. st. 1. t. b i c GDPR)</p>
                <p className="text-slate-400 mt-0.5 font-sans">Procjena štete na vozilu ili imovini, provjera pokrića i isplata odštete na dostavljeni IBAN.</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <p className="font-bold text-white">Ispunjavanje zakonskih obveza (čl. 6. st. 1. t. c GDPR)</p>
                <p className="text-slate-400 mt-0.5 font-sans">Vođenje evidencije prema Zakonu o osiguranju, Zakonu o sprječavanju pranja novca i računovodstvenim propisima.</p>
              </div>
            </div>
          </div>

          {/* 3. Vrste podataka koje obrađujemo */}
          <div className="pt-6 border-t border-white/[0.08]">
            <h3 className="text-lg font-bold text-white mb-2">
              3. Kategorije osobnih podataka
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-xs text-slate-400">
              <li><strong className="text-white">Temeljni identifikacijski podaci:</strong> Ime, prezime, OIB (verificiran ISO 7064 algoritmom), adresa prebivališta.</li>
              <li><strong className="text-white">Kontakt podaci:</strong> Broj telefona, email adresa.</li>
              <li><strong className="text-white">Podaci o predmetu osiguranja:</strong> Registarska oznaka, broj šasije (VIN), površina nekretnine, godina izgradnje.</li>
              <li><strong className="text-white">Financijski podaci:</strong> Broj tekućeg računa (IBAN) za isplate šteta, povijest uplata.</li>
              <li><strong className="text-white">Dokazna građa:</strong> Fotografije i videosnimke oštećenja, policijski zapisnici.</li>
            </ul>
          </div>

          {/* 4. Prava ispitanika */}
          <div className="pt-6 border-t border-white/[0.08]">
            <h3 className="text-lg font-bold text-white mb-2">
              4. Vaša prava kao ispitanika
            </h3>
            <p>U skladu s Općom uredbom o zaštiti podataka, u svakom trenutku imate pravo na:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <strong className="block text-white">Pravo na pristup i uvid</strong>
                <span className="text-slate-400">Pristup svim vašim podacima u korisničkom portalu Moj Život.</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <strong className="block text-white">Pravo na ispravak</strong>
                <span className="text-slate-400">Ažuriranje netočnih ili nepotpunih podataka.</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <strong className="block text-white">Pravo na brisanje ("Zaborav")</strong>
                <span className="text-slate-400">U mjeri u kojoj to nije u suprotnosti sa Zakonom o osiguranju (obvezno čuvanje 10 god).</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <strong className="block text-white">Pravo na prenosivost podataka</strong>
                <span className="text-slate-400">Preuzimanje podataka u strukturiranom digitalnom obliku.</span>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs font-mono">
              <p className="font-bold text-white">Nadzorno tijelo za zaštitu osobnih podataka u RH:</p>
              <p className="text-slate-400">Agencija za zaštitu osobnih podataka (AZOP), Selska cesta 136, 10000 Zagreb &bull; <a href="https://azop.hr" target="_blank" rel="noopener noreferrer" className="text-[#ff7b1a] underline">www.azop.hr</a></p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
