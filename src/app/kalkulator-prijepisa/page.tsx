import React from 'react';
import { Calculator, HelpCircle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { VehicleTransferTool } from '../../components/calculators/VehicleTransferTool';

export const KalkulatorPrijepisaPage: React.FC = () => {
  return (
    <div className="w-full py-12 sm:py-16 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Interactive Vehicle Transfer Calculator */}
        <VehicleTransferTool standalone={true} />

        {/* Statutory Fee Schedule Breakdown */}
        <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-2.5">
              <Calculator className="w-5 h-5 text-[#0F2942]" />
              <h2 className="text-lg font-bold text-slate-900">
                Tarifni razredi upravne pristojbe po kW (NN 92/21)
              </h2>
            </div>
            <span className="text-xs font-medium text-slate-500">
              Pravilnik o upravnim pristojbama na stjecanje rabljenih motornih vozila
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider bg-slate-50">
                  <th className="py-3 px-4 font-semibold">Starost vozila od prve registracije</th>
                  <th className="py-3 px-4 font-semibold">Iznos pristojbe po kW</th>
                  <th className="py-3 px-4 font-semibold text-right">Primjer za vozilo od 85 kW</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700 tabular-nums">
                <tr>
                  <td className="py-3 px-4 font-medium text-slate-900">Do 1 godine</td>
                  <td className="py-3 px-4">6,64 € / kW</td>
                  <td className="py-3 px-4 text-right font-semibold text-[#0F2942]">564,40 €</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-slate-900">2 godine</td>
                  <td className="py-3 px-4">5,97 € / kW</td>
                  <td className="py-3 px-4 text-right font-semibold text-[#0F2942]">507,45 €</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-slate-900">3 godine</td>
                  <td className="py-3 px-4">5,31 € / kW</td>
                  <td className="py-3 px-4 text-right font-semibold text-[#0F2942]">451,35 €</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-slate-900">4 godine</td>
                  <td className="py-3 px-4">4,65 € / kW</td>
                  <td className="py-3 px-4 text-right font-semibold text-[#0F2942]">395,25 €</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-slate-900">5 godina</td>
                  <td className="py-3 px-4">3,98 € / kW</td>
                  <td className="py-3 px-4 text-right font-semibold text-[#0F2942]">338,30 €</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-slate-900">6 – 7 godina</td>
                  <td className="py-3 px-4">2,65 € – 3,32 € / kW</td>
                  <td className="py-3 px-4 text-right font-semibold text-[#0F2942]">225,25 € – 282,20 €</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-slate-900">8 – 10 godina</td>
                  <td className="py-3 px-4">1,99 € / kW</td>
                  <td className="py-3 px-4 text-right font-semibold text-emerald-700">169,15 €</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-slate-900">11 – 14 godina</td>
                  <td className="py-3 px-4">1,33 € / kW</td>
                  <td className="py-3 px-4 text-right font-semibold text-emerald-700">113,05 €</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-slate-900">15 – 20 godina</td>
                  <td className="py-3 px-4">0,40 € – 0,66 € / kW</td>
                  <td className="py-3 px-4 text-right font-semibold text-emerald-700">34,00 € – 56,10 €</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-slate-900">21 – 30 godina</td>
                  <td className="py-3 px-4">0,13 € / kW</td>
                  <td className="py-3 px-4 text-right font-semibold text-emerald-700">11,05 €</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Legal Exemptions & Procedures */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>Oslobođenja od plaćanja upravne pristojbe</span>
            </h3>
            <div className="text-xs sm:text-sm text-slate-600 space-y-2 leading-relaxed">
              <p>
                Upravna pristojba se <strong>ne plaća</strong> kada se vozilo stječe na temelju ugovora o darovanju između bračnih drugova, potomaka i predaka u uspravnoj liniji te posvojenika i posvojitelja.
              </p>
              <p>
                Pristojba se također ne obračunava ako je na stjecanje rabljenog motornog vozila već zaračunat PDV ili je vozilo kupljeno od pravne osobe u sustavu PDV-a uz izdani račun.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#0F2942] shrink-0" />
              <span>Postupak u stanici za tehnički pregled (STP)</span>
            </h3>
            <div className="text-xs sm:text-sm text-slate-600 space-y-2 leading-relaxed">
              <p>
                Kompletan postupak prijenosa vlasništva i naplate upravne pristojbe provodi se izravno u bilo kojoj stanici za tehnički pregled u Republici Hrvatskoj, neovisno o prebivalištu ugovornih strana.
              </p>
              <p>
                Prije same registracije vozila na novog vlasnika potrebno je pripremiti policu obveznog osiguranja od automobilske odgovornosti.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center gap-3 text-xs text-slate-600">
          <ShieldCheck className="w-4 h-4 text-[#0F2942] shrink-0" />
          <span>
            Izračun je informativne naravi i temelji se na važećim odredbama Zakona o posebnom porezu na motorna vozila. Službeni obračun izdaje stanica za tehnički pregled pri prijenosu vozila.
          </span>
        </div>
      </div>
    </div>
  );
};

export default KalkulatorPrijepisaPage;
