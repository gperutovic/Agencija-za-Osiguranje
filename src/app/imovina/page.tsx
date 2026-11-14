import React from 'react';
import { Home, CheckCircle2 } from 'lucide-react';
import { PropertyCalculator } from '../../components/calculators/PropertyCalculator';
import { FAQ_PROPERTY } from '../../lib/content/insurance-data';

export default function ImovinaPage() {
  return (
    <div className="w-full py-12 sm:py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-100 border border-slate-200 text-[#0F2942] text-xs font-semibold uppercase tracking-wider">
            <Home className="w-3.5 h-3.5" />
            <span>Osiguranje stana, kuće i od potresa</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Zaštita doma, kućanstva i od rizika potresa
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Osigurajte nekretninu i pokretne stvari na novu građevinsku vrijednost od požara, izljeva vode, provalne krađe, oluje i potresa, uz uključenu odgovornost prema trećim osobama.
          </p>
        </div>

        {/* Value Strip */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-[#0F2942] uppercase tracking-wider">Nova vrijednost</span>
            <h2 className="text-base font-bold text-slate-900">Bez odbitka amortizacije</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Police na novu građevinsku vrijednost osiguravaju pokriće stvarnih troškova obnove ili sanacije oštećenih dijelova.
            </p>
          </div>
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-[#0F2942] uppercase tracking-wider">Zaštita od potresa</span>
            <h2 className="text-base font-bold text-slate-900">Građevinski dio i stvari</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Potres se ugovara kao dopunsko pokriće prema površini i građevinskoj vrijednosti s jasno definiranom franšizom.
            </p>
          </div>
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-[#0F2942] uppercase tracking-wider">Izljev vode i susjedi</span>
            <h2 className="text-base font-bold text-slate-900">Odgovornost prema trećima</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Uključuje troškove traženja puknuća cijevi te naknadu štete koju voda ili nezgoda prouzroče susjednom stanu.
            </p>
          </div>
        </div>

        {/* Interactive Calculator */}
        <PropertyCalculator />

        {/* Package Matrix */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">
              Usporedba paketa osiguranja imovine
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Pregled razina zaštite za stanove u zgradama i obiteljske kuće.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                  <th className="p-4 font-semibold">Rizik / Pokriće</th>
                  <th className="p-4 font-semibold">Osnovni paket</th>
                  <th className="p-4 font-semibold">Prošireni paket</th>
                  <th className="p-4 font-semibold text-[#0F2942]">Kompletna zaštita + Potres</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                <tr>
                  <td className="p-4 font-semibold text-slate-900">Požar, eksplozija, oluja i tuča</td>
                  <td className="p-4 text-emerald-700 font-semibold">Uključeno</td>
                  <td className="p-4 text-emerald-700 font-semibold">Uključeno</td>
                  <td className="p-4 text-emerald-700 font-semibold">Uključeno (nova vrijednost)</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-900">Izljev vode iz cijevi</td>
                  <td className="p-4 text-slate-400">Opcionalno</td>
                  <td className="p-4 text-emerald-700 font-semibold">Uključeno</td>
                  <td className="p-4 text-emerald-700 font-semibold">Uključeno + lociranje kvara</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-900">Potres (građevinski dio i stvari)</td>
                  <td className="p-4 text-slate-400">Nije uključeno</td>
                  <td className="p-4 text-slate-400">Nije uključeno</td>
                  <td className="p-4 text-emerald-700 font-semibold">Pokriveno po polici</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-900">Provalna krađa i razbojništvo</td>
                  <td className="p-4 text-slate-400">Nije uključeno</td>
                  <td className="p-4 text-emerald-700 font-semibold">Uključeno</td>
                  <td className="p-4 text-emerald-700 font-semibold">Uključeno + štete na vratima</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-900">Privatna odgovornost prema trećima</td>
                  <td className="p-4 text-slate-600 tabular-nums">Do 10.000 €</td>
                  <td className="p-4 text-slate-600 tabular-nums">Do 30.000 €</td>
                  <td className="p-4 text-emerald-700 font-semibold tabular-nums">Do 100.000 €</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-bold text-slate-900">Česta pitanja o osiguranju imovine</h2>
            <p className="text-xs text-slate-500">Informacije o procjeni građevinske vrijednosti, potresu i štetama</p>
          </div>

          <div className="space-y-3">
            {FAQ_PROPERTY.map((faq, idx) => (
              <div key={idx} className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0F2942] shrink-0" />
                  <span>{faq.question}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-6">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
