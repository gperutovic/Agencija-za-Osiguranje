import React, { useState, useMemo } from 'react';
import {
  Car,
  Calculator,
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Info,
  Sparkles,
} from 'lucide-react';
import { calculateVehicleTransferCost, formatEuro } from '../../lib/calculations';
import { Slider } from '../ui/Slider';
import { Button } from '../ui/Button';
import { QuoteModal } from '../quotes/QuoteModal';

interface VehicleTransferToolProps {
  standalone?: boolean;
}

export const VehicleTransferTool: React.FC<VehicleTransferToolProps> = ({
  standalone = true,
}) => {
  const [kw, setKw] = useState<number>(85); // 115 KS average
  const [ageYears, setAgeYears] = useState<number>(6);
  const [retainPlates, setRetainPlates] = useState<boolean>(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState<boolean>(false);

  // Approximate Horsepower (KS)
  const horsepower = Math.round(kw * 1.35962);

  const result = useMemo(() => {
    return calculateVehicleTransferCost(kw, ageYears, retainPlates);
  }, [kw, ageYears, retainPlates]);

  return (
    <div className="w-full">
      {standalone && (
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold uppercase tracking-wider mb-4">
            <Calculator className="w-3.5 h-3.5" />
            <span>Službeni Zakonski Izračun (NN 92/21)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Kalkulator Prijepisa Vozila
          </h1>
          <p className="mt-3 text-base text-slate-600">
            Izračunajte točan iznos upravne pristojbe i administrativnih troškova za prijenos
            vlasništva rabljenog motornog vozila u stanicama za tehnički pregled (STP).
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
        {/* Left Form Inputs */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Car className="w-5 h-5 text-blue-600" />
              Podaci o vozilu
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Unesite snagu iz prometne dozvole (polje P.2) i starost od prve registracije.
            </p>
          </div>

          {/* kW Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-slate-800">
                Snaga motora u kilovatima (kW)
              </label>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-500">~{horsepower} KS</span>
                <span className="px-3 py-1 bg-blue-50 text-blue-700 font-bold rounded-lg text-sm border border-blue-100">
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
            <div className="flex justify-between text-[11px] text-slate-600">
              <span>20 kW (27 KS)</span>
              <span>85 kW (115 KS)</span>
              <span>150 kW (204 KS)</span>
              <span>300 kW (408 KS)</span>
            </div>
          </div>

          {/* Age Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-slate-800">
                Starost vozila (od godine proizvodnje)
              </label>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 font-bold rounded-lg text-sm border border-blue-100">
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
            <div className="flex justify-between text-[11px] text-slate-600">
              <span>1 god. (novo)</span>
              <span>5 god.</span>
              <span>10 god.</span>
              <span>25+ god.</span>
            </div>
          </div>

          {/* License Plate Toggle */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80">
            <label className="flex items-start justify-between cursor-pointer">
              <div className="space-y-0.5 pr-4">
                <span className="text-sm font-semibold text-slate-900 block">
                  Zadržavanje postojećih registarskih pločica
                </span>
                <span className="text-xs text-slate-500 block">
                  Ako kupac i prodavatelj imaju prebivalište u istom registarskom području (npr. ZG u ZG), pločice se mogu zadržati uz uštedu od 8,63 €.
                </span>
              </div>
              <input
                type="checkbox"
                checked={retainPlates}
                onChange={(e) => setRetainPlates(e.target.checked)}
                className="w-5 h-5 mt-1 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
              />
            </label>
          </div>

          {/* Legal Note Box */}
          <div className="flex items-start space-x-3 text-xs text-slate-500 bg-blue-50/50 p-3.5 rounded-xl border border-blue-100">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p>
              Upravna pristojba na stjecanje rabljenih motornih vozila utvrđena je Zakonom o posebnom porezu na motorna vozila (Narodne novine br. 115/16, 127/17 i 92/21). Obveznik plaćanja je stjecatelj vozila.
            </p>
          </div>
        </div>

        {/* Right Cost Summary Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                <div>
                  <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                    Troškovnik prijenosa
                  </span>
                  <h4 className="text-lg font-bold text-white">Specifikacija za STP</h4>
                </div>
                <div className="p-2 bg-slate-800 rounded-xl text-blue-400">
                  <FileText className="w-5 h-5" />
                </div>
              </div>

              {/* Itemized list */}
              <div className="space-y-3.5 text-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-slate-300 font-medium">Upravna pristojba</span>
                    <span className="block text-[11px] text-slate-600">
                      {kw} kW × {formatEuro(result.ratePerKw)} / kW
                    </span>
                  </div>
                  <span className="font-semibold text-white">
                    {formatEuro(result.administrativeFee)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-slate-300 font-medium">Nova prometna dozvola</span>
                    <span className="block text-[11px] text-slate-600">Obrazac i ovjera</span>
                  </div>
                  <span className="font-semibold text-white">
                    {formatEuro(result.permitFee)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-slate-300 font-medium">Registarske pločice</span>
                    <span className="block text-[11px] text-slate-600">
                      {retainPlates ? 'Zadržane (0 €)' : 'Standardni par'}
                    </span>
                  </div>
                  <span className={`font-semibold ${retainPlates ? 'text-emerald-400' : 'text-white'}`}>
                    {retainPlates ? '0,00 €' : formatEuro(result.plateFee)}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-800">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-sm font-semibold text-slate-400">UKUPNO ZA UPLATU:</span>
                  <div className="text-right">
                    <span className="text-3xl font-extrabold text-emerald-400">
                      {formatEuro(result.totalCost)}
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-600 text-right">
                  Plaća se jednokratno u stanici za tehnički pregled
                </p>
              </div>

              {/* Steps at STP */}
              <div className="mt-6 pt-6 border-t border-slate-800/60 space-y-2 text-xs text-slate-300">
                <p className="font-semibold text-slate-200">Što ponijeti u STP:</p>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Kupoprodajni ugovor ili račun</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Original prometnu dozvolu prodavatelja</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Važeću osobnu iskaznicu ili OIB kupca</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Važeću policu auto osiguranja</span>
                </div>
              </div>
            </div>
          </div>

          {/* Insurance Cross-Sell Banner */}
          <div className="bg-gradient-to-br from-emerald-500/10 via-blue-500/10 to-indigo-500/10 rounded-2xl p-6 border border-emerald-500/20 text-slate-900 relative overflow-hidden">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-emerald-600 text-white rounded-xl shrink-0 shadow-md shadow-emerald-600/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="inline-flex items-center space-x-1.5 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Uštedite do 40% na polici</span>
                </div>
                <h4 className="text-base font-bold text-slate-900">
                  Trebate novo auto osiguranje?
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Prilikom prijepisa vozila prenesite svoj 50% bonus i usporedite ponude 10 osiguratelja uz instant aktivaciju police u STP-u.
                </p>
                <div className="mt-4">
                  <Button
                    variant="emerald"
                    size="sm"
                    className="w-full sm:w-auto"
                    onClick={() => setIsQuoteModalOpen(true)}
                  >
                    <span>Izračunaj auto osiguranje</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Quote Modal */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        initialCategory="auto"
      />
    </div>
  );
};
