import React from 'react';
import { Shield, Scale, Building, AlertCircle, FileCheck, ExternalLink } from 'lucide-react';
import { Card } from '../components/common/Card';

export const LegalNoticePage: React.FC = () => {
  return (
    <div className="space-y-12 pb-20">
      {/* Header */}
      <section className="bg-gradient-to-b from-navy-950 via-slate-900 to-navy-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold uppercase tracking-wider">
            <Scale className="w-4 h-4" />
            <span>Pravne Obavijesti & Distribucija Osiguranja</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Regulatorni status, nadzor i rješavanje pritužbi
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            Sukladno odredbama Zakona o osiguranju (NN 30/15, 112/18, 63/20, 133/20) i Direktive (EU) 2016/97 o distribuciji osiguranja (IDD).
          </p>
        </div>
      </section>

      {/* Main Legal Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="p-8 sm:p-12 bg-white border-slate-200 shadow-sm space-y-8 text-sm text-slate-700 leading-relaxed">
          {/* Section 1 */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Building className="w-5 h-5 text-brand-600" />
              1. Podaci o distributeru osiguranja
            </h3>
            <p className="mb-2">
              <strong>ŽIVOT d.o.o. za poslove zastupanja u osiguranju</strong> (u daljnjem tekstu: Agencija) obavlja djelatnost zastupanja u osiguranju kao ovlašteni ugovorni partner društva <strong>Generali osiguranje d.d. Zagreb</strong>.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
              <li>Sjedište: Junija Palmotića 76, 10000 Zagreb, Republika Hrvatska</li>
              <li>Matični broj subjekta (MBS): 080514170 (Trgovački sud u Zagrebu)</li>
              <li>Osobni identifikacijski broj (OIB): 14329077049</li>
              <li>Rješenje o ovlaštenju HANFA: Klasa: UP/I-983-02/24-01/12, Urbroj: 326-01-24-2</li>
              <li>Polica osiguranja od profesionalne odgovornosti: sklopljena kod Generali osiguranje d.d., br. GEN-PI-2026-001</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="pt-6 border-t border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-brand-600" />
              2. Nadzorno tijelo i registar
            </h3>
            <p>
              Nadzor nad obavljanjem poslova distribucije osiguranja provodi:
            </p>
            <div className="mt-2 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <p className="font-bold text-slate-900">Hrvatska agencija za nadzor financijskih usluga (HANFA)</p>
              <p className="text-slate-600">Franje Račkoga 6, 10000 Zagreb, Hrvatska</p>
              <a
                href="https://www.hanfa.hr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-600 font-semibold hover:underline inline-flex items-center gap-1 mt-1"
              >
                www.hanfa.hr <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Uvid u registar ovlaštenih zastupnika i posrednika dostupan je javno na službenim internetskim stranicama HANFA-e.
            </p>
          </div>

          {/* Section 3 */}
          <div className="pt-6 border-t border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-brand-600" />
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
          <div className="pt-6 border-t border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-brand-600" />
              4. Postupak pritužbi i izvansudsko rješavanje sporova
            </h3>
            <p>
              Klijenti i ugovaratelji osiguranja imaju pravo podnijeti prigovor na rad Agencije ili postupanje zastupnika:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600 mt-2">
              <li>Pisanim putem na adresu: ŽIVOT d.o.o., Junija Palmotića 76, 10000 Zagreb</li>
              <li>Putem elektroničke pošte: <a href="mailto:prigovori@agencija-zivot.hr" className="text-brand-600 underline">prigovori@agencija-zivot.hr</a></li>
            </ul>
            <p className="mt-3">
              Agencija će na svaki uredno zaprimljeni prigovor odgovoriti pisanim putem u roku od najviše 15 dana od dana zaprimanja.
            </p>
            <p className="mt-2">
              U slučaju nezadovoljstva rješenjem prigovora, stranke mogu pokrenuti postupak izvansudskog rješavanja spora pri:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <p className="font-bold text-slate-900">Pravobraniteljstvo na području osiguranja</p>
                <p className="text-slate-500">pri Hrvatskom uredu za osiguranje (HUO)</p>
                <p className="text-slate-500">Martićeva 71, 10000 Zagreb &bull; www.huo.hr</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <p className="font-bold text-slate-900">Centar za mirenje</p>
                <p className="text-slate-500">pri Hrvatskoj gospodarskoj komori (HGK)</p>
                <p className="text-slate-500">Rooseveltov trg 2, 10000 Zagreb &bull; www.hgk.hr</p>
              </div>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
};
