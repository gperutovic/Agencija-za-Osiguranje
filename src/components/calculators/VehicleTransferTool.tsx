import React, { useState, useMemo } from 'react';
import {
  Car,
  Calculator,
  FileText,
  ShieldCheck,
  CheckCircle2,
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
    <div className="w-full text-left">
      {standalone && (
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-[#fb6504] text-xs font-mono font-bold uppercase tracking-wider">
            <Calculator className="w-3.5 h-3.5" />
            <span>Službeni Zakonski Izračun (NN 92/21)</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Kalkulator Prijepisa Vozila
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Izračunajte točan iznos upravne pristojbe i administrativnih troškova za prijenos
            vlasništva rabljenog motornog vozila u stanicama za tehnički pregled (STP).
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
        {/* Left Form Inputs (Dark Obsidian) */}
        <div className="lg:col-span-7 bg-[#0a0d16] rounded-3xl p-6 sm:p-8 border border-white/[0.08] shadow-2xl space-y-8">
          <div className="border-b border-white/[0.08] pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Car className="w-5 h-5 text-[#fb6504]" />
              Podaci o vozilu
            </h3>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Unesite snagu iz prometne dozvole (polje P.2) i starost od prve registracije.
            </p>
          </div>

          {/* kW Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-200">
                Snaga motora u kilovatima (kW)
              </label>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-400 font-mono">~{horsepower} KS</span>
                <span className="px-3 py-1 bg-[#fb6504]/10 text-[#fb6504] font-mono font-bold rounded-lg text-sm border border-[#fb6504]/20">
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
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>20 kW (27 KS)</span>
              <span>85 kW (115 KS)</span>
              <span>150 kW (204 KS)</span>
              <span>300 kW (408 KS)</span>
            </div>
          </div>

          {/* Age Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-200">
                Starost vozila (od godine proizvodnje)
              </label>
              <span className="px-3 py-1 bg-white/[0.05] text-white font-mono font-bold rounded-lg text-sm border border-white/10">
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
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>1 god. (novo)</span>
              <span>5 god.</span>
              <span>10 god.</span>
              <span>25+ god.</span>
            </div>
          </div>

          {/* License Plate Toggle */}
          <div className="bg-white/[0.03] rounded-2xl p-4 border border-white/[0.06]">
            <label className="flex items-start justify-between cursor-pointer">
              <div className="space-y-1 pr-4">
                <span className="text-xs font-bold text-white block">
                  Zadržavanje postojećih registarskih pločica
                </span>
                <span className="text-[11px] text-slate-400 block leading-relaxed">
                  Ako kupac i prodavatelj imaju prebivalište u istom registarskom području (npr. ZG u ZG), pločice se mogu zadržati uz uštedu od 8,63 €.
                </span>
              </div>
              <input
                type="checkbox"
                checked={retainPlates}
                onChange={(e) => setRetainPlates(e.target.checked)}
                className="w-5 h-5 mt-1 text-[#fb6504] rounded border-white/20 bg-white/5 focus:ring-[#fb6504] cursor-pointer"
              />
            </label>
          </div>

          {/* Legal Note Box */}
          <div className="flex items-start space-x-3 text-xs text-slate-300 bg-white/[0.02] p-4 rounded-2xl border border-white/[0.06]">
            <Info className="w-4 h-4 text-[#fb6504] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Upravna pristojba na stjecanje rabljenih motornih vozila utvrđena je Zakonom o posebnom porezu na motorna vozila (Narodne novine br. 115/16, 127/17 i 92/21). Obveznik plaćanja je stjecatelj vozila.
            </p>
          </div>
        </div>

        {/* Right Cost Summary Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#080c14] text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/[0.12] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#fb6504]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-6">
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#fb6504] uppercase tracking-wider">
                    Troškovnik prijenosa
                  </span>
                  <h4 className="text-lg font-bold text-white">Specifikacija za STP</h4>
                </div>
                <div className="p-2.5 bg-white/[0.05] rounded-xl text-[#fb6504] border border-white/10">
                  <FileText className="w-5 h-5" />
                </div>
              </div>

              {/* Itemized list */}
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-slate-300 font-medium">Upravna pristojba</span>
                    <span className="block text-[11px] font-mono text-slate-400">
                      {kw} kW &times; {formatEuro(result.ratePerKw)} / kW
                    </span>
                  </div>
                  <span className="font-semibold text-white font-mono">
                    {formatEuro(result.administrativeFee)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-slate-300 font-medium">Nova prometna dozvola</span>
                    <span className="block text-[11px] font-mono text-slate-400">Obrazac i ovjera u STP</span>
                  </div>
                  <span className="font-semibold text-white font-mono">
                    {formatEuro(result.permitFee)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-slate-300 font-medium">Registarske pločice</span>
                    <span className="block text-[11px] font-mono text-slate-400">
                      {retainPlates ? 'Zadržane (0 €)' : 'Standardni novi par'}
                    </span>
                  </div>
                  <span className={`font-semibold font-mono ${retainPlates ? 'text-emerald-400' : 'text-white'}`}>
                    {retainPlates ? '0,00 €' : formatEuro(result.plateFee)}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/[0.08]">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-xs font-mono uppercase text-slate-400 font-semibold">
                    UKUPNO ZA UPLATU U STP:
                  </span>
                  <div className="text-right">
                    <span className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono">
                      {formatEuro(result.totalCost)}
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 text-right font-mono">
                  Plaća se jednokratno u stanici za tehnički pregled
                </p>
              </div>

              {/* Steps at STP */}
              <div className="mt-6 pt-6 border-t border-white/[0.06] space-y-2 text-xs text-slate-300">
                <p className="font-semibold text-white text-[11px] font-mono uppercase tracking-wider">
                  Potrebna dokumentacija za STP:
                </p>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Kupoprodajni ugovor ili račun</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Original prometna dozvola prodavatelja</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Važeća osobna iskaznica ili OIB kupca</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Važeća polica auto osiguranja</span>
                </div>
              </div>
            </div>
          </div>

          {/* Toyota & Generali Cross-Sell Banner */}
          <div className="bg-gradient-to-br from-[#fb6504]/10 via-emerald-500/5 to-transparent rounded-3xl p-6 border border-[#fb6504]/25 text-white relative overflow-hidden">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-[#fb6504] text-white rounded-2xl shrink-0 shadow-lg shadow-[#fb6504]/25">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="inline-flex items-center space-x-1.5 text-[#fb6504] text-[10px] font-mono font-bold uppercase tracking-wider mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Toyota Centar Zagreb &bull; Generali Partner</span>
                </div>
                <h4 className="text-base font-bold text-white">
                  Kupujete vozilo? Ugovorite osiguranje
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Prenesite svoj 50% bonus i ugovorite Toyota VIP Kasko ili policu Generali osiguranja
                  uz instant aktivaciju za tehnički pregled.
                </p>
                <div className="mt-4">
                  <button
                    onClick={() => setIsQuoteModalOpen(true)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#fb6504] hover:bg-[#ff7b1a] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
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

      {/* Embedded Quote Modal */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        initialCategory="auto"
      />
    </div>
  );
};
