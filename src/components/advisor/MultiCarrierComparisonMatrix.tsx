import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Building2,
  Clock,
  Car,
  Award,
} from 'lucide-react';

interface CarrierOffer {
  id: string;
  name: string;
  tagline: string;
  logoText: string;
  isRecommended: boolean;
  badge?: string;
  annualPrice: number;
  monthlyPrice: number;
  franchiseAmount: number;
  assistanceCoverage: string;
  replacementVehicleDays: number;
  payoutSpeedDays: string;
  exclusivePerk: string;
  savingsVsMarket: number;
}

const CARRIER_OFFERS: CarrierOffer[] = [
  {
    id: 'generali',
    name: 'Generali osiguranje d.d.',
    tagline: 'Strateški partner Agencije Život & Toyota Centra Zagreb',
    logoText: 'GENERALI',
    isRecommended: true,
    badge: 'Najbolji omjer cijene i pokrića',
    annualPrice: 284.50,
    monthlyPrice: 23.70,
    franchiseAmount: 0,
    assistanceCoverage: 'Hrvatska + Europa 24/7 (do 3.000 €)',
    replacementVehicleDays: 5,
    payoutSpeedDays: '48 sati (brza likvidacija)',
    exclusivePerk: '0 € franšiza na lom stakla + Toyota VIP uvjeti popravka',
    savingsVsMarket: 72.00,
  },
  {
    id: 'croatia',
    name: 'Croatia osiguranje d.d.',
    tagline: 'Nacionalni osiguratelj s najvećom mrežom procjenilišta',
    logoText: 'CROATIA',
    isRecommended: false,
    annualPrice: 318.00,
    monthlyPrice: 26.50,
    franchiseAmount: 150,
    assistanceCoverage: 'Hrvatska (do 1.500 €)',
    replacementVehicleDays: 3,
    payoutSpeedDays: '3-5 radnih dana',
    exclusivePerk: 'Besplatna procjena u bilo kojoj stanici za tehnički pregled',
    savingsVsMarket: 38.50,
  },
  {
    id: 'allianz',
    name: 'Allianz Hrvatska d.d.',
    tagline: 'Globalna snaga i visoki standardi putne asistencije',
    logoText: 'ALLIANZ',
    isRecommended: false,
    annualPrice: 335.00,
    monthlyPrice: 27.90,
    franchiseAmount: 150,
    assistanceCoverage: 'Europa 24/7 (Global Assistance)',
    replacementVehicleDays: 4,
    payoutSpeedDays: '3 radna dana',
    exclusivePerk: 'Aplikacijsko praćenje statusa popravka u stvarnom vremenu',
    savingsVsMarket: 21.50,
  },
  {
    id: 'wiener',
    name: 'Wiener osiguranje VIG',
    tagline: 'Povoljna osnovna premija za pažljive vozače',
    logoText: 'WIENER VIG',
    isRecommended: false,
    annualPrice: 298.00,
    monthlyPrice: 24.80,
    franchiseAmount: 200,
    assistanceCoverage: 'Hrvatska (osnovni paket)',
    replacementVehicleDays: 2,
    payoutSpeedDays: '5 radnih dana',
    exclusivePerk: 'Popust na ugovaranje police kućanstva uz auto',
    savingsVsMarket: 58.50,
  },
];

interface MultiCarrierComparisonMatrixProps {
  onSelectCarrier?: (carrier: CarrierOffer) => void;
  className?: string;
}

export const MultiCarrierComparisonMatrix: React.FC<MultiCarrierComparisonMatrixProps> = ({
  onSelectCarrier,
  className = '',
}) => {
  const [selectedCarrierId, setSelectedCarrierId] = useState<string>('generali');

  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-8 space-y-6 ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Neovisna agencijska aukcija &bull; Usporedba tržišta</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Transparentna ponuda vodećih osiguratelja u RH
          </h3>
          <p className="text-xs text-slate-500">
            Agencija Život traži ponude za vas kod 4 najveća osiguratelja kako bi vam osigurala maksimalan popust i najbržu isplatu.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-2xl text-xs text-slate-600 dark:text-slate-300 font-mono">
          <TrendingDown className="w-4 h-4 text-emerald-600" />
          <span>Ušteda do 72 € kroz agencijski popust</span>
        </div>
      </div>

      {/* Grid of Carriers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {CARRIER_OFFERS.map((carrier) => {
          const isSelected = selectedCarrierId === carrier.id;
          const isRec = carrier.isRecommended;

          return (
            <div
              key={carrier.id}
              onClick={() => {
                setSelectedCarrierId(carrier.id);
                onSelectCarrier?.(carrier);
              }}
              className={`p-5 rounded-3xl border transition-all flex flex-col justify-between cursor-pointer relative ${
                isRec
                  ? 'border-emerald-500 bg-gradient-to-b from-emerald-50/50 to-white dark:from-emerald-950/20 dark:to-slate-900 shadow-md ring-2 ring-emerald-500/20'
                  : isSelected
                  ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/20 shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-900'
              }`}
            >
              {isRec && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white shadow-sm">
                  Preporuka Agencije
                </span>
              )}

              <div className="space-y-4">
                <div className="pt-1">
                  <span className="font-mono font-black text-xs tracking-wider text-slate-400 block uppercase">
                    {carrier.logoText}
                  </span>
                  <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white mt-0.5">
                    {carrier.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{carrier.tagline}</p>
                </div>

                {/* Price Box */}
                <div className="p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 text-center">
                  <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white">
                    {carrier.annualPrice.toFixed(2)} €
                  </div>
                  <div className="text-xs text-slate-500 font-semibold mt-0.5">
                    ili {carrier.monthlyPrice.toFixed(2)} € / mj.
                  </div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                    Ušteda: -{carrier.savingsVsMarket.toFixed(2)} €
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span>Franšiza:</span>
                    <strong className="font-mono text-slate-900 dark:text-white">
                      {carrier.franchiseAmount === 0 ? '0 € (Bez franšize)' : `${carrier.franchiseAmount} €`}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span>Asistencija:</span>
                    <strong className="text-right text-[11px] text-slate-900 dark:text-white">
                      {carrier.assistanceCoverage}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span>Zamjensko vozilo:</span>
                    <strong className="font-mono text-slate-900 dark:text-white">
                      do {carrier.replacementVehicleDays} dana
                    </strong>
                  </div>

                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span>Brzina isplate:</span>
                    <strong className="font-mono text-emerald-600 dark:text-emerald-400">
                      {carrier.payoutSpeedDays}
                    </strong>
                  </div>
                </div>

                {/* Exclusive Perk Banner */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300">
                  <strong className="text-slate-900 dark:text-white block font-semibold mb-0.5">
                    Agencijska prednost:
                  </strong>
                  {carrier.exclusivePerk}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    isRec
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                      : isSelected
                      ? 'bg-blue-600 hover:bg-blue-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <span>{isSelected ? 'Odabrana ponuda' : 'Odaberi ovu ponudu'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-blue-600" />
          <span>Sve cijene uključuju zakonski porez na premije osiguranja i važeći bonus od 50%.</span>
        </div>
        <div className="font-mono font-bold text-slate-700 dark:text-slate-300">
          Agencija Život d.o.o. &bull; HANFA ZO-88912
        </div>
      </div>
    </div>
  );
};
