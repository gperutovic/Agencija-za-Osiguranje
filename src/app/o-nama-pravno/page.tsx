import React from 'react';
import {
  ShieldCheck,
  Building2,
  FileCheck,
  Scale,
  Lock,
  ExternalLink,
} from 'lucide-react';

export default function LegalImpressumPage() {
  return (
    <div className="w-full bg-[#06080c] text-slate-100 py-12 sm:py-20 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-[#fb6504] text-xs font-mono font-bold uppercase tracking-wider">
            <Scale className="w-3.5 h-3.5" />
            <span>Pravne informacije i usklađenost</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            O nama &amp; Pravne obavijesti
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Transparentnost, zakonitost poslovanja i puna usklađenost s propisima
            Republike Hrvatske, HANFA-e i Europske unije.
          </p>
        </div>

        {/* 1. Impressum & Corporate Details */}
        <div className="bg-[#0a0d16] rounded-3xl p-6 sm:p-8 border border-white/[0.08] shadow-2xl space-y-6">
          <div className="border-b border-white/[0.08] pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#fb6504]" />
              Temeljni podaci o društvu (Impressum)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-300">
            <div>
              <span className="text-slate-400 block text-xs font-mono">Puni naziv pravne osobe:</span>
              <strong className="text-white text-sm">ŽIVOT d.o.o. za poslove zastupanja u osiguranju</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-xs font-mono">Komercijalni naziv (Brand):</span>
              <strong className="text-[#fb6504] text-sm">AGENCIJA ŽIVOT</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-xs font-mono">Sjedište i adresa ureda:</span>
              <span className="text-white">Junija Palmotića 76, 10000 Zagreb, Hrvatska</span>
            </div>
            <div>
              <span className="text-slate-400 block text-xs font-mono">Osobni identifikacijski broj (OIB):</span>
              <span className="font-mono font-bold text-white">14329077049</span>
            </div>
            <div>
              <span className="text-slate-400 block text-xs font-mono">Matični broj subjekta (MBS):</span>
              <span className="font-mono font-bold text-white">080514170</span>
            </div>
            <div>
              <span className="text-slate-400 block text-xs font-mono">Nadležni registarski sud:</span>
              <span className="text-white">Trgovački sud u Zagrebu</span>
            </div>
            <div>
              <span className="text-slate-400 block text-xs font-mono">Službeni telefon:</span>
              <a href="tel:014800120" className="text-emerald-400 font-mono font-bold underline">
                01 4800 120
              </a>
            </div>
            <div>
              <span className="text-slate-400 block text-xs font-mono">Službena e-mail adresa:</span>
              <a href="mailto:osiguranje@agencija-zivot.hr" className="text-[#fb6504] font-mono underline">
                osiguranje@agencija-zivot.hr
              </a>
            </div>
          </div>
        </div>

        {/* 2. HANFA Regulatory Status */}
        <div className="bg-[#0a0d16] rounded-3xl p-6 sm:p-8 border border-white/[0.08] shadow-2xl space-y-4">
          <div className="border-b border-white/[0.08] pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Nadzor i registracija pri HANFA-i
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Društvo ŽIVOT d.o.o. upisano je u <strong>Registar distributera osiguranja</strong> pod brojem{' '}
            <strong className="text-emerald-400 font-mono">ZO-88912</strong> (Klasa: UP/I-983-02/24-01/12) koji vodi{' '}
            <strong>Hrvatska agencija za nadzor financijskih usluga (HANFA)</strong>, sa sjedištem
            na adresi Franje Račkog 6, 10000 Zagreb (
            <a
              href="https://www.hanfa.hr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#fb6504] underline font-semibold inline-flex items-center gap-1"
            >
              www.hanfa.hr <ExternalLink className="w-3 h-3" />
            </a>
            ).
          </p>
          <div className="bg-white/[0.02] p-4 rounded-2xl border border-white/[0.06] text-xs text-slate-300 font-mono">
            Upis u registar HANFA-e možete javno provjeriti u bilo kojem trenutku putem službene tražilice registara na internetskim stranicama nadzornog tijela.
          </div>
        </div>

        {/* 3. Pre-contractual Notice under IDD */}
        <div className="bg-[#0a0d16] rounded-3xl p-6 sm:p-8 border border-white/[0.08] shadow-2xl space-y-4">
          <div className="border-b border-white/[0.08] pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-[#fb6504]" />
              Predugovorne informacije za ugovaratelje (čl. 401. Zakona o osiguranju)
            </h2>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <p>
              Sukladno Direktivi o distribuciji osiguranja (IDD 2016/97) i Zakonu o osiguranju (NN 30/15, 112/18, 63/20, 133/20), prije sklapanja ugovora o osiguranju obavještavamo korisnika o sljedećem:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-300 text-xs">
              <li>
                <strong className="text-white">Pravni status:</strong> Društvo djeluje kao ovlašteni zastupnik u osiguranju u strateškom partnerstvu s <strong>Generali osiguranjem d.d.</strong> te u ekskluzivnom partnerstvu s <strong>Toyota Centrom Zagreb</strong> za Toyota VIP Kasko programe.
              </li>
              <li>
                <strong className="text-white">Vlasnički udjeli:</strong> Društvo nema izravan ili neizravan udio koji predstavlja 10% ili više glasačkih prava ili kapitala u bilo kojem društvu za osiguranje, niti ijedno društvo za osiguranje ima udio u našem kapitalu.
              </li>
              <li>
                <strong className="text-white">Naknada za uslugu:</strong> Za pružanje usluga distribucije osiguranja društvo <strong>ne naplaćuje nikakvu naknadu niti proviziju od klijenta</strong>. Naša se naknada isplaćuje isključivo kao ugovorena provizija od strane osiguravajućeg društva.
              </li>
              <li>
                <strong className="text-white">Zaštita interesa klijenta:</strong> Naš sustav provodi objektivnu analizu tržišta kako bi ponudio optimalan omjer cijene i pokrića prilagođen vašim potrebama.
              </li>
            </ul>
          </div>
        </div>

        {/* 4. Alternative Dispute Resolution (HUO & HGK) */}
        <div className="bg-[#0a0d16] rounded-3xl p-6 sm:p-8 border border-white/[0.08] shadow-2xl space-y-4">
          <div className="border-b border-white/[0.08] pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-purple-400" />
              Prigovori i izvansudsko rješavanje sporova
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Ako niste zadovoljni našom uslugom ili postupkom obrade odštetnog zahtjeva, imate pravo podnijeti pisani prigovor putem e-maila{' '}
            <strong className="text-white font-mono">prigovori@agencija-zivot.hr</strong> ili poštom na adresu sjedišta u Palmotićevoj 76, Zagreb. Na prigovor ćemo odgovoriti u roku od najkasnije 15 dana.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-white/[0.02] rounded-2xl border border-white/[0.06] text-xs text-slate-300">
              <strong className="block text-white mb-1 font-mono">Centar za mirenje pri HUO</strong>
              <p className="text-slate-400">Hrvatski ured za osiguranje</p>
              <p className="text-slate-400">Martićeva 71, 10000 Zagreb</p>
              <a
                href="https://www.huo.hr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#fb6504] font-semibold underline mt-2 inline-block font-mono"
              >
                www.huo.hr
              </a>
            </div>
            <div className="p-4 bg-white/[0.02] rounded-2xl border border-white/[0.06] text-xs text-slate-300">
              <strong className="block text-white mb-1 font-mono">Centar za mirenje pri HGK</strong>
              <p className="text-slate-400">Hrvatska gospodarska komora</p>
              <p className="text-slate-400">Rooseveltov trg 2, 10000 Zagreb</p>
              <a
                href="https://www.hgk.hr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#fb6504] font-semibold underline mt-2 inline-block font-mono"
              >
                www.hgk.hr
              </a>
            </div>
          </div>
        </div>

        {/* 5. GDPR & Data Privacy */}
        <div className="bg-[#0a0d16] rounded-3xl p-6 sm:p-8 border border-white/[0.08] shadow-2xl space-y-4">
          <div className="border-b border-white/[0.08] pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-400" />
              Zaštita privatnosti i obrada osobnih podataka (GDPR)
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Društvo obrađuje vaše osobne podatke (uključujući OIB, kontakt podatke i podatke o vozilu/imovini) isključivo u svrhu izrade informativnih izračuna, predugovornih radnji, sklapanja police i prijave štete. Svi podaci pohranjuju se na poslužiteljima unutar Europske unije uz 256-bitnu TLS enkripciju.
          </p>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Kao ispitanik imate pravo na pristup podacima, ispravak, brisanje, ograničenje obrade te prigovor Agenciji za zaštitu osobnih podataka (AZOP, Selska cesta 136, Zagreb).
          </p>
        </div>
      </div>
    </div>
  );
}
