import React, { useState, useMemo } from 'react';
import {
  Car,
  Calculator,
  FileText,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Info,
} from 'lucide-react';
import { calculateVehicleTransferCost, formatEuro } from '../../lib/calculations';
import { Slider } from '../ui/Slider';
import { QuoteModal } from '../quotes/QuoteModal';

interface VehicleTransferToolProps {
  standalone?: boolean;
}

export const VehicleTransferTool: React.FC<VehicleTransferToolProps> = ({
  standalone = true,
}) => {
  const [kw, setKw] = useState<number>(85);
  const [ageYears, setAgeYears] = useState<number>(6);
  const [retainPlates, setRetainPlates] = useState<boolean>(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState<boolean>(false);

  const horsepower = Math.round(kw * 1.35962);

  const result = useMemo(() => {
    return calculateVehicleTransferCost(kw, ageYears, retainPlates);
  }, [kw, ageYears, retainPlates]);

  return (
    <div className="w-full text-left">
      {standalone && (
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-slate-100 border border-slate-200 text-[#0F2942] text-xs font-semibold uppercase tracking-wider">
            <Calculator className="w-3.5 h-3.5" />
            <span>Zakonski izračun prema NN 92/21</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Kalkulator prijepisa rabljenog vozila
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Izračunajte točan iznos upravne pristojbe i administrativnih naknada za prijenos vlasništva u stanicama za tehnički pregled (STP).
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
        {/* Left Form Inputs */}
        <div className="lg:col-span-7 bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-7">
          <div className="border-b border-slate-200 pb-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Car className="w-5 h-5 text-[#0F2942]" />
              <span>Podaci o motornom vozilu</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Unesite snagu motora iz prometne dozvole (rubrika P.2) i starost vozila od godine proizvodnje.
            </p>
          </div>

          {/* kW Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-slate-800">
                Snaga motora u kilovatima (kW)
              </label>
              <div className="flex items-center space-x-2 tabular-nums">
                <span className="text-xs text-slate-500">~{horsepower} KS</span>
                <span className="px-2.5 py-1 bg-slate-100 text-[#0F2942] font-bold rounded-md text-sm border border-slate-200">
                  {kw} kW
                </span>
              </div>
            </div>
            <Slider
              min={20}
              max={300}
              step={1}
              value={kw}
              onChange={(val) => setKw(val)}
              unit="kW"
            />
            <div className="flex justify-between text-xs text-slate-500 tabular-nums">
              <span>20 kW</span>
              <span>85 kW (115 KS)</span>
              <span>150 kW</span>
              <span>300 kW</span>
            </div>
          </div>

          {/* Age Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-slate-800">
                Starost vozila
              </label>
              <span className="px-2.5 py-1 bg-slate-100 text-[#0F2942] font-bold rounded-md text-sm border border-slate-200 tabular-nums">
                {ageYears} {ageYears === 1 ? 'godina' : ageYears < 5 ? 'godine' : 'godina'}
              </span>
            </div>
            <Slider
              min={1}
              max={25}
              step={1}
              value={ageYears}
              onChange={(val) => setAgeYears(val)}
              unit="god."
            />
            <div className="flex justify-between text-xs text-slate-500 tabular-nums">
              <span>1 god. (novo)</span>
              <span>5 god.</span>
              <span>10 god.</span>
              <span>25+ god.</span>
            </div>
          </div>

          {/* License Plate Toggle */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <label className="flex items-start justify-between cursor-pointer gap-4">
              <div className="space-y-1">
                <span className="text-sm font-semibold text-slate-900 block">
                  Zadržavanje postojećih registarskih pločica
                </span>
                <span className="text-xs text-slate-600 block leading-relaxed">
                  Ako kupac i prodavatelj imaju prebivalište u istom registarskom području, postojeće pločice mogu se zadržati uz uštedu od 8,63 €.
                </span>
              </div>
              <input
                type="checkbox"
                checked={retainPlates}
                onChange={(e) => setRetainPlates(e.target.checked)}
                className="w-5 h-5 mt-1 accent-[#0F2942] rounded cursor-pointer shrink-0"
              />
            </label>
          </div>

          {/* Legal Note Box */}
          <div className="flex items-start space-x-3 text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <Info className="w-4 h-4 text-[#0F2942] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Upravna pristojba na stjecanje rabljenih motornih vozila propisana je Zakonom o posebnom porezu na motorna vozila (Narodne novine br. 115/16, 127/17 i 92/21). Obveznik plaćanja je stjecatelj vozila pri promjeni vlasništva u STP-u.
            </p>
          </div>
        </div>

        {/* Right Cost Summary Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0F2942] text-white rounded-xl p-6 sm:p-7 shadow-md border border-slate-800">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
              <div>
                <span className="text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Troškovnik prijenosa
                </span>
                <h4 className="text-lg font-bold text-white">Specifikacija za STP</h4>
              </div>
              <div className="p-2.5 bg-white/10 rounded-lg text-white">
                <FileText className="w-5 h-5" />
              </div>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-slate-100 font-medium">Upravna pristojba</span>
                  <span className="block text-xs text-slate-400 tabular-nums">
                    {kw} kW × {formatEuro(result.ratePerKw)} / kW
                  </span>
                </div>
                <span className="font-semibold text-white tabular-nums">
                  {formatEuro(result.administrativeFee)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <span className="text-slate-100 font-medium">Nova prometna dozvola</span>
                  <span className="block text-xs text-slate-400">Obrazac i ovjera u STP</span>
                </div>
                <span className="font-semibold text-white tabular-nums">
                  {formatEuro(result.permitFee)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <span className="text-slate-100 font-medium">Registarske pločice</span>
                  <span className="block text-xs text-slate-400">
                    {retainPlates ? 'Zadržane postojeće' : 'Standardni novi par'}
                  </span>
                </div>
                <span className={`font-semibold tabular-nums ${retainPlates ? 'text-emerald-300' : 'text-white'}`}>
                  {retainPlates ? '0,00 €' : formatEuro(result.plateFee)}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-white/15">
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-xs uppercase text-slate-300 font-semibold">
                  Ukupno za uplatu u STP:
                </span>
                <span className="text-3xl font-bold text-emerald-300 tabular-nums">
                  {formatEuro(result.totalCost)}
                </span>
              </div>
              <p className="text-xs text-slate-400 text-right">
                Plaća se jednokratno u stanici za tehnički pregled
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-white/10 space-y-2 text-xs text-slate-300">
              <p className="font-semibold text-white text-xs uppercase tracking-wider mb-1">
                Potrebni dokumenti u STP-u:
              </p>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                <span>Kupoprodajni ugovor ili račun prodavatelja</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                <span>Originalna prometna dozvola vozila</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                <span>Osobna iskaznica ili OIB kupca</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                <span>Polica obveznog auto osiguranja na novog vlasnika</span>
              </div>
            </div>
          </div>

          {/* Partner Cross-Sell Card */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-start space-x-4">
              <div className="p-2.5 bg-slate-100 text-[#0F2942] rounded-lg shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                  Generali osiguranje • Toyota Centar Zagreb
                </span>
                <h4 className="text-base font-bold text-slate-900">
                  Pripremite policu osiguranja prije registracije
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Prenesite stečeni bonus do 50% na novo ili rabljeno vozilo i zatražite ponudu za AO ili kasko osiguranje prije odlaska na tehnički pregled.
                </p>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => setIsQuoteModalOpen(true)}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-[#0F2942] hover:bg-[#163859] text-white font-semibold text-xs shadow-sm transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Izračunaj auto osiguranje</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        initialCategory="auto"
      />
    </div>
  );
};
