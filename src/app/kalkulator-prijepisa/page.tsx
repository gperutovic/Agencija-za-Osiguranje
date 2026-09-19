import React from 'react';
import { VehicleTransferTool } from '../../components/calculators/VehicleTransferTool';
import { FileText, CheckCircle2, HelpCircle } from 'lucide-react';

export default function VehicleTransferPage() {
  return (
    <div className="w-full text-slate-900 py-12 sm:py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Main Interactive Tool */}
        <VehicleTransferTool standalone={true} />

        {/* Detailed Statutory Tariff Table (NN 92/21) */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-bento space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-teal-600" />
              Zakonske tarife upravne pristojbe po kilovatu (kW)
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-mono">
              Uredba o izmjenama Zakona o posebnom porezu na motorna vozila (Narodne novine br. 92/21).
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-mono text-[11px] uppercase tracking-wider">
                  <th className="py-3.5 px-4">Starost vozila (godine)</th>
                  <th className="py-3.5 px-4">Iznos po kilovatu (€/kW)</th>
                  <th className="py-3.5 px-4">Primjer za vozilo od 85 kW (~115 KS)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 font-medium text-slate-900">Do 1 godine</td>
                  <td className="py-3 px-4 font-mono font-bold text-teal-700">6,64 €</td>
                  <td className="py-3 px-4 font-mono">564,40 €</td>
                </tr>
                <tr className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 font-medium text-slate-900">2 godine</td>
                  <td className="py-3 px-4 font-mono font-bold text-teal-700">5,97 €</td>
                  <td className="py-3 px-4 font-mono">507,45 €</td>
                </tr>
                <tr className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 font-medium text-slate-900">3 godine</td>
                  <td className="py-3 px-4 font-mono font-bold text-teal-700">5,31 €</td>
                  <td className="py-3 px-4 font-mono">451,35 €</td>
                </tr>
                <tr className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 font-medium text-slate-900">4 godine</td>
                  <td className="py-3 px-4 font-mono font-bold text-teal-700">4,65 €</td>
                  <td className="py-3 px-4 font-mono">395,25 €</td>
                </tr>
                <tr className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 font-medium text-slate-900">5 godina</td>
                  <td className="py-3 px-4 font-mono font-bold text-teal-700">3,98 €</td>
                  <td className="py-3 px-4 font-mono">338,30 €</td>
                </tr>
                <tr className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 font-medium text-slate-900">6 godina</td>
                  <td className="py-3 px-4 font-mono font-bold text-teal-700">3,32 €</td>
                  <td className="py-3 px-4 font-mono">282,20 €</td>
                </tr>
                <tr className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 font-medium text-slate-900">7 godina</td>
                  <td className="py-3 px-4 font-mono font-bold text-teal-700">2,65 €</td>
                  <td className="py-3 px-4 font-mono">225,25 €</td>
                </tr>
                <tr className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 font-medium text-slate-900">8 do 10 godina</td>
                  <td className="py-3 px-4 font-mono font-bold text-teal-700">1,99 €</td>
                  <td className="py-3 px-4 font-mono">169,15 €</td>
                </tr>
                <tr className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 font-medium text-slate-900">11 do 14 godina</td>
                  <td className="py-3 px-4 font-mono font-bold text-teal-700">1,33 €</td>
                  <td className="py-3 px-4 font-mono">113,05 €</td>
                </tr>
                <tr className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 font-medium text-slate-900">15 do 18 godina</td>
                  <td className="py-3 px-4 font-mono font-bold text-teal-700">0,66 €</td>
                  <td className="py-3 px-4 font-mono">56,10 €</td>
                </tr>
                <tr className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 font-medium text-slate-900">19 do 20 godina</td>
                  <td className="py-3 px-4 font-mono font-bold text-teal-700">0,40 €</td>
                  <td className="py-3 px-4 font-mono">34,00 €</td>
                </tr>
                <tr className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 font-medium text-slate-900">21 do 30 godina</td>
                  <td className="py-3 px-4 font-mono font-bold text-teal-700">0,13 €</td>
                  <td className="py-3 px-4 font-mono">11,05 €</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Informative Guidance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-bento space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Tko je oslobođen plaćanja upravne pristojbe?
            </h3>
            <div className="text-xs sm:text-sm text-slate-600 space-y-2 leading-relaxed">
              <p>
                Upravna pristojba se <strong>ne plaća</strong> ako se vozilo stječe na temelju ugovora o darovanju, a stjecatelj je bračni drug, potomak i predak koji čini uspravnu liniju te posvojenik i posvojitelj.
              </p>
              <p>
                Također, pristojba se ne plaća ako je na stjecanje rabljenog motornog vozila obračunat porez na dodanu vrijednost (PDV) ili ako je vozilo kupljeno od pravne osobe koja je u sustavu PDV-a uz izdan račun.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-bento space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-teal-600" />
              Gdje i kako se obavlja prijenos vlasništva?
            </h3>
            <div className="text-xs sm:text-sm text-slate-600 space-y-2 leading-relaxed">
              <p>
                Kompletan postupak prijenosa vlasništva i plaćanja pristojbe obavlja se isključivo u <strong>bilo kojoj stanici za tehnički pregled (STP)</strong> u Republici Hrvatskoj, neovisno o prebivalištu kupca ili prodavatelja.
              </p>
              <p>
                Nije više potrebno odlaziti u Poreznu upravu niti na policiju radi ovjere prometne dozvole. Sve se rješava na jednom šalteru u roku od 15 minuta.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
