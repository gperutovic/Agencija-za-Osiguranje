import React from 'react';
import { Link } from 'react-router-dom';
import { Car, CheckCircle2, Calculator } from 'lucide-react';
import { AutoInsuranceCalculator } from '../../components/calculators/AutoInsuranceCalculator';
import { FAQ_AUTO } from '../../lib/content/insurance-data';

export default function AutoOsiguranjePage() {
  return (
    <div className="w-full py-12 sm:py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Editorial Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-100 border border-slate-200 text-[#0F2942] text-xs font-semibold uppercase tracking-wider">
            <Car className="w-3.5 h-3.5" />
            <span>Autoodgovornost, kasko i Toyota program</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Auto i kasko osiguranje po vašoj mjeri
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Izračunajte informativnu cijenu police obveznog osiguranja (AO) i kaska s punim prijenosom stečenog bonusa do 50% te mogućnošću ugovaranja Toyota Centar Zagreb VIP Kasko pokrića.
          </p>
        </div>

        {/* Highlights Strip */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-[#0F2942] uppercase tracking-wider">Prijenos bonusa</span>
            <h2 className="text-base font-bold text-slate-900">Priznavanje do 50% bonusa</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Stečeni bonus uredno prenosimo s prethodne police, uz opciju zaštite bonusa od gubitka nakon prve štete.
            </p>
          </div>
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-[#0F2942] uppercase tracking-wider">Toyota Centar Zagreb</span>
            <h2 className="text-base font-bold text-slate-900">VIP Kasko s Generali osiguranjem</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Popravci isključivo u ovlaštenom Toyota servisu originalnim dijelovima, uz osigurano zamjensko vozilo.
            </p>
          </div>
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-[#0F2942] uppercase tracking-wider">Registracija i prijepis</span>
            <h2 className="text-base font-bold text-slate-900">Spremno za tehnički pregled</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Polica i potvrda za STP dostavljaju se digitalno.{' '}
              <Link to="/kalkulator-prijepisa" className="text-[#0F2942] font-semibold underline inline-flex items-center gap-1">
                <Calculator className="w-3 h-3" /> Izračunajte i cijenu prijepisa
              </Link>
              .
            </p>
          </div>
        </div>

        {/* Interactive Calculator */}
        <AutoInsuranceCalculator />

        {/* Comparison Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">
              Usporedba paketa auto osiguranja
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Pregled razlika između zakonskog obveznog osiguranja, proširenog paketa i punog kaska.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                  <th className="p-4 font-semibold">Pokriće / Značajka</th>
                  <th className="p-4 font-semibold">Osnovno AO</th>
                  <th className="p-4 font-semibold">AO + Djelomični kasko</th>
                  <th className="p-4 font-semibold text-[#0F2942]">Puni Kasko / Toyota VIP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                <tr>
                  <td className="p-4 font-medium text-slate-900">Šteta prouzročena drugim vozilima i osobama</td>
                  <td className="p-4 text-emerald-700 font-semibold">Do zakonskog limita</td>
                  <td className="p-4 text-emerald-700 font-semibold">Do zakonskog limita</td>
                  <td className="p-4 text-emerald-700 font-semibold">Do zakonskog limita</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-slate-900">Lom i oštećenje vjetrobranskog stakla</td>
                  <td className="p-4 text-slate-400">Nije pokriveno</td>
                  <td className="p-4 text-emerald-700 font-semibold">Pokriveno po paketu</td>
                  <td className="p-4 text-emerald-700 font-semibold">Pokriveno bez franšize</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-slate-900">Vlastita odgovornost u prometnoj nezgodi</td>
                  <td className="p-4 text-slate-400">Nije pokriveno</td>
                  <td className="p-4 text-slate-400">Nije pokriveno</td>
                  <td className="p-4 text-emerald-700 font-semibold">Popravak prema ugovoru</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-slate-900">Krađa, tuča, poplava i vandalizam</td>
                  <td className="p-4 text-slate-400">Nije pokriveno</td>
                  <td className="p-4 text-slate-400">Nije pokriveno</td>
                  <td className="p-4 text-emerald-700 font-semibold">Potpuno kasko pokriće</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-slate-900">Zamjensko vozilo za vrijeme popravka</td>
                  <td className="p-4 text-slate-400">Nije uključeno</td>
                  <td className="p-4 text-slate-500">Ovisno o opciji asistencije</td>
                  <td className="p-4 text-emerald-700 font-semibold">Uključeno u Toyota VIP programu</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-bold text-slate-900">Česta pitanja o auto osiguranju</h2>
            <p className="text-xs text-slate-500">Informacije o prijenosu bonusa, polici i kasko uvjetima</p>
          </div>

          <div className="space-y-3">
            {FAQ_AUTO.map((faq, idx) => (
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
