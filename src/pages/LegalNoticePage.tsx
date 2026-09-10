import React from 'react';
import { Shield, Scale, Building, AlertCircle, FileCheck, ExternalLink } from 'lucide-react';
import { Card } from '../components/common/Card';

export const LegalNoticePage: React.FC = () => {
  return (
    <div className="space-y-12 pb-24 text-slate-100">
      {/* Header */}
      <section className="relative overflow-hidden pt-12 pb-14 text-center space-y-4">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#fb6504]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono font-bold tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#fb6504] animate-pulse" />
            <span className="text-white">Pravne Obavijesti & Distribucija Osiguranja</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Regulatorni status, nadzor i rješavanje pritužbi
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed font-light">
            Sukladno odredbama Zakona o osiguranju (NN 30/15, 112/18, 63/20, 133/20) i Direktive (EU) 2016/97 o distribuciji osiguranja (IDD).
          </p>
        </div>
      </section>

      {/* Main Legal Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 bg-[#0a0d16]/90 border border-white/[0.08] backdrop-blur-xl rounded-3xl shadow-2xl space-y-8 text-sm text-slate-300 leading-relaxed font-light">
          {/* Section 1 */}
          <div>
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <Building className="w-5 h-5 text-[#ff7b1a]" />
              1. Podaci o distributeru osiguranja
            </h3>
            <p className="mb-2">
              <strong className="text-white">ŽIVOT d.o.o. za poslove zastupanja u osiguranju</strong> (u daljnjem tekstu: Agencija) obavlja djelatnost zastupanja u osiguranju kao ovlašteni ugovorni partner društva <strong className="text-white">Generali osiguranje d.d. Zagreb</strong>.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-slate-400 font-mono">
              <li>Sjedište: Junija Palmotića 76, 10000 Zagreb, Republika Hrvatska</li>
              <li>Matični broj subjekta (MBS): 080514170 (Trgovački sud u Zagrebu)</li>
              <li>Osobni identifikacijski broj (OIB): 14329077049</li>
              <li>Rješenje o ovlaštenju HANFA: Klasa: UP/I-983-02/24-01/12, Urbroj: 326-01-24-2</li>
              <li>Polica osiguranja od profesionalne odgovornosti: sklopljena kod Generali osiguranje d.d., br. GEN-PI-2026-001</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="pt-6 border-t border-white/[0.08]">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#ff7b1a]" />
              2. Nadzorno tijelo i registar
            </h3>
            <p>
              Nadzor nad obavljanjem poslova distribucije osiguranja provodi:
            </p>
            <div className="mt-3 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs font-mono">
              <p className="font-bold text-white">Hrvatska agencija za nadzor financijskih usluga (HANFA)</p>
              <p className="text-slate-400">Franje Račkoga 6, 10000 Zagreb, Hrvatska</p>
              <a
                href="https://www.hanfa.hr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#ff7b1a] font-semibold hover:underline inline-flex items-center gap-1 mt-1.5"
              >
                www.hanfa.hr <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="mt-2 text-xs text-slate-500 font-mono">
              Uvid u registar ovlaštenih zastupnika i posrednika dostupan je javno na službenim internetskim stranicama HANFA-e.
            </p>
          </div>

          {/* Section 3 */}
          <div className="pt-6 border-t border-white/[0.08]">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-[#ff7b1a]" />
              3. Sukob interesa i priroda naknade
            </h3>
            <p>
              Agencija djeluje u ime i za račun osiguratelja Generali osiguranje d.d. Agencija ne posjeduje izravan ili neizravan udio koji predstavlja više od 10% glasačkih prava ili kapitala u bilo kojem društvu za osiguranje, niti osiguratelj posjeduje udio u Agenciji.
            </p>
            <p className="mt-2">
              Za poslove zastupanja u osiguranju Agencija prima proviziju koja je uračunata u premiju osiguranja, odnosno naknadu koju isplaćuje društvo za osiguranje, stoga ugovaratelj ne plaća nikakvu dodatnu naknadu za posredovanje.
            </p>
          </div>

          {/* Section 4 */}
          <div className="pt-6 border-t border-white/[0.08]">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-[#ff7b1a]" />
              4. Postupak pritužbi i izvansudsko rješavanje sporova
            </h3>
            <p>
              Klijenti i ugovaratelji osiguranja imaju pravo podnijeti prigovor na rad Agencije ili postupanje zastupnika:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-slate-400 font-mono mt-2">
              <li>Pisanim putem na adresu: ŽIVOT d.o.o., Junija Palmotića 76, 10000 Zagreb</li>
              <li>Putem elektroničke pošte: <a href="mailto:prigovori@agencija-zivot.hr" className="text-[#ff7b1a] underline">prigovori@agencija-zivot.hr</a></li>
            </ul>
            <p className="mt-3">
              Agencija će na svaki uredno zaprimljeni prigovor odgovoriti pisanim putem u roku od najviše 15 dana od dana zaprimanja.
            </p>
            <p className="mt-2">
              U slučaju nezadovoljstva rješenjem prigovora, stranke mogu pokrenuti postupak izvansudskog rješavanja spora pri:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 text-xs font-mono">
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <p className="font-bold text-white">Pravobraniteljstvo na području osiguranja</p>
                <p className="text-slate-400">pri Hrvatskom uredu za osiguranje (HUO)</p>
                <p className="text-slate-500">Martićeva 71, 10000 Zagreb &bull; www.huo.hr</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <p className="font-bold text-white">Centar za mirenje</p>
                <p className="text-slate-400">pri Hrvatskoj gospodarskoj komori (HGK)</p>
                <p className="text-slate-500">Rooseveltov trg 2, 10000 Zagreb &bull; www.hgk.hr</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
