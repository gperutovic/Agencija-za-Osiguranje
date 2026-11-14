import React from 'react';
import { HeartPulse, CheckCircle2 } from 'lucide-react';
import { DopunskoCalculator } from '../../components/calculators/DopunskoCalculator';
import { FAQ_DOPUNSKO } from '../../lib/content/insurance-data';

export default function DopunskoZdravstvenoPage() {
  return (
    <div className="w-full py-12 sm:py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Editorial Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-100 border border-slate-200 text-[#0F2942] text-xs font-semibold uppercase tracking-wider">
            <HeartPulse className="w-3.5 h-3.5" />
            <span>Dopunsko zdravstveno osiguranje 2026.</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Usporedite cijenu dopunskog zdravstvenog osiguranja
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Nakon usklađenja cijene HZZO police na 15,00 € mjesečno od 1. veljače 2026., provjerite kolika je premija privatnih osiguratelja prema vašoj dobi uz dodatno pokriće B-liste lijekova.
          </p>
        </div>

        {/* Key Context Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-[#0F2942] uppercase tracking-wider">Cijena prema dobi</span>
            <h2 className="text-base font-bold text-slate-900">Već od 6,50 € mjesečno</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Za osiguranike mlađe od 50 godina privatne police nude nižu mjesečnu premiju od zakonskih 15,00 € kod HZZO-a.
            </p>
          </div>
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-[#0F2942] uppercase tracking-wider">Dopunska lista lijekova</span>
            <h2 className="text-base font-bold text-slate-900">Pokriće B-liste lijekova</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Mogućnost uključivanja pokrića nadoplata za lijekove s dopunske liste HZZO-a do ugovorenog godišnjeg limita.
            </p>
          </div>
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-[#0F2942] uppercase tracking-wider">Jednostavan prijelaz</span>
            <h2 className="text-base font-bold text-slate-900">Bez karence kod prelaska</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pri prelasku s postojeće police dopunskog osiguranja bez prekida pokrića, prava vrijede odmah bez razdoblja čekanja.
            </p>
          </div>
        </div>

        {/* Interactive Calculator */}
        <DopunskoCalculator />

        {/* Comparison Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">
              Usporedba HZZO i privatnog dopunskog osiguranja (2026.)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Pregled ključnih razlika u cijeni, opsegu pokrića participacija i lijekova s B-liste.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                  <th className="p-4 font-semibold">Kriterij usporedbe</th>
                  <th className="p-4 font-semibold">HZZO dopunsko</th>
                  <th className="p-4 font-semibold text-[#0F2942]">Privatno (Generali / Allianz / Croatia)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700 tabular-nums">
                <tr>
                  <td className="p-4 font-semibold text-slate-900">Mjesečna premija (18 – 30 god.)</td>
                  <td className="p-4 text-slate-600">15,00 € / mj. (180,00 € / god.)</td>
                  <td className="p-4 font-bold text-emerald-700">Od 6,50 € / mj. (ušteda 102,00 € god.)</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-900">Mjesečna premija (31 – 40 god.)</td>
                  <td className="p-4 text-slate-600">15,00 € / mj. (180,00 € / god.)</td>
                  <td className="p-4 font-bold text-emerald-700">Od 7,50 € / mj. (ušteda 90,00 € god.)</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-900">Mjesečna premija (41 – 50 god.)</td>
                  <td className="p-4 text-slate-600">15,00 € / mj. (180,00 € / god.)</td>
                  <td className="p-4 font-bold text-emerald-700">Od 9,50 € / mj. (ušteda 66,00 € god.)</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-900">Participacije u javnom zdravstvu</td>
                  <td className="p-4 text-emerald-700 font-semibold">100% pokriveno</td>
                  <td className="p-4 text-emerald-700 font-semibold">100% pokriveno</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-900">Dopunska B-lista lijekova</td>
                  <td className="p-4 text-slate-500">Nije uključeno</td>
                  <td className="p-4 text-emerald-700 font-semibold">Dostupno do 200 € godišnje</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-900">Karenca pri kontinuiranom prijelazu</td>
                  <td className="p-4 text-slate-600">30 dana kod novog sklapanja</td>
                  <td className="p-4 text-emerald-700 font-semibold">Bez karence uz važeću policu</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-bold text-slate-900">Česta pitanja o dopunskom osiguranju</h2>
            <p className="text-xs text-slate-500">Odgovori na pitanja o cijeni, prijelazu i pokriću lijekova</p>
          </div>

          <div className="space-y-3">
            {FAQ_DOPUNSKO.map((faq, idx) => (
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
