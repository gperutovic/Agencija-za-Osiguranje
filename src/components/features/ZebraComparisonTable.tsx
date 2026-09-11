import React, { useState } from 'react';
import { 
  Check, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  HelpCircle, 
  Star, 
  Tag, 
  Percent, 
  Zap 
} from 'lucide-react';
import { CarrierLogo } from './CarrierLogos';

interface CarrierOffer {
  id: string;
  name: string;
  monthlyEur: number;
  annualEur: number;
  hanfaSolvency: string;
  trustScore: number; // out of 5
  reviewCount: number;
  features: string[];
  bestFor: string;
  recommendedBadge?: string;
}

export const ZebraComparisonTable: React.FC = () => {
  // Smart Discount Discovery Engine (The Zebra signature feature)
  const [hasMultiPolicy, setHasMultiPolicy] = useState<boolean>(true);
  const [hasSafeDriver, setHasSafeDriver] = useState<boolean>(true);
  const [hasAntiTheft, setHasAntiTheft] = useState<boolean>(false);
  const [selectedCarrier, setSelectedCarrier] = useState<string>('croatia');

  // Compute active discount multiplier
  let discountPct = 0;
  if (hasMultiPolicy) discountPct += 15;
  if (hasSafeDriver) discountPct += 10;
  if (hasAntiTheft) discountPct += 8;

  const baseOffers: CarrierOffer[] = [
    {
      id: 'croatia',
      name: 'Croatia Osiguranje',
      monthlyEur: 28.5,
      annualEur: 342,
      hanfaSolvency: '99.8% (Tržišni lider)',
      trustScore: 4.9,
      reviewCount: 4820,
      features: [
        'Besplatna asistencija na cesti 24/7 (RH i EU)',
        'Zelena karta i zaštita bonusa uključeni',
        'Najšira mreža vlastitih procjenilišta šteta u RH'
      ],
      bestFor: 'Nacionalna pokrivenost i najbrža procjena šteta',
      recommendedBadge: 'Izbor Agencije Život'
    },
    {
      id: 'allianz',
      name: 'Allianz Hrvatska',
      monthlyEur: 29.8,
      annualEur: 358,
      hanfaSolvency: '99.5% (Globalni standard)',
      trustScore: 4.8,
      reviewCount: 3910,
      features: [
        'Allianz Pomoć na cesti s zamjenskim vozilom do 5 dana',
        'Osiguranje vozača i putnika od nezgode',
        'Praćenje statusa štete putem aplikacije'
      ],
      bestFor: 'Vrhunska mobilnost i zamjensko vozilo'
    },
    {
      id: 'generali',
      name: 'Generali Osiguranje',
      monthlyEur: 26.2,
      annualEur: 314,
      hanfaSolvency: '99.2%',
      trustScore: 4.7,
      reviewCount: 2750,
      features: [
        'Generali Leo asistencija 24/7',
        'Zaštita stakala bez franšize',
        'Pravna zaštita u prometnim sporovima'
      ],
      bestFor: 'Najbolji omjer cijene i pokrića stakala',
      recommendedBadge: 'Najpovoljnija Ponuda'
    },
    {
      id: 'wiener',
      name: 'Wiener Städtische VIG',
      monthlyEur: 27.9,
      annualEur: 335,
      hanfaSolvency: '99.1%',
      trustScore: 4.6,
      reviewCount: 1980,
      features: [
        'VIG Europska asistencija na cesti',
        'Kasko pokriće šteta od tuče i oluje',
        'Mogućnost obročnog plaćanja do 12 rata bez kamata'
      ],
      bestFor: 'Fleksibilno obročno plaćanje'
    },
    {
      id: 'grawe',
      name: 'Grawe Hrvatska',
      monthlyEur: 28.9,
      annualEur: 346,
      hanfaSolvency: '99.4%',
      trustScore: 4.8,
      reviewCount: 1840,
      features: [
        'GRAWE Auto Asistencija',
        'Povrat dijela premije za godine bez štete',
        'Osobni obiteljski savjetnik u vašem gradu'
      ],
      bestFor: 'Dugoročni bonusi i povrat premije'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Smart Discount Discovery Box */}
      <div className="rr-surface-card rounded-2xl p-6 border border-white/[0.08] relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#fb6504]/10 text-[#fb6504] border border-[#fb6504]/20">
              <Percent className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Smart Discount Discovery • Sustav Pametnih Popusta</h4>
              <p className="text-xs text-slate-400">Označite pogodnosti koje posjedujete za automatsko smanjenje ponuda:</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">Ukupni aktivirani popust:</span>
            <span className="text-sm font-mono font-bold text-emerald-400 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/25">
              -{discountPct}% POPUSTA
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <label className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
            hasMultiPolicy 
              ? 'bg-[#fb6504]/10 border-[#fb6504]/40' 
              : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05]'
          }`}>
            <input 
              type="checkbox" 
              checked={hasMultiPolicy} 
              onChange={(e) => setHasMultiPolicy(e.target.checked)} 
              className="w-4 h-4 rounded text-[#fb6504] focus:ring-[#fb6504]"
            />
            <div>
              <div className="text-xs font-bold text-white">Paket Dom + Auto (-15%)</div>
              <div className="text-[11px] text-slate-400">Posjedujete više od jedne police</div>
            </div>
          </label>

          <label className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
            hasSafeDriver 
              ? 'bg-[#fb6504]/10 border-[#fb6504]/40' 
              : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05]'
          }`}>
            <input 
              type="checkbox" 
              checked={hasSafeDriver} 
              onChange={(e) => setHasSafeDriver(e.target.checked)} 
              className="w-4 h-4 rounded text-[#fb6504] focus:ring-[#fb6504]"
            />
            <div>
              <div className="text-xs font-bold text-white">Siguran Vozač bez Štete (-10%)</div>
              <div className="text-[11px] text-slate-400">Najmanje 3 godine bez prijavljene štete</div>
            </div>
          </label>

          <label className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
            hasAntiTheft 
              ? 'bg-[#fb6504]/10 border-[#fb6504]/40' 
              : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05]'
          }`}>
            <input 
              type="checkbox" 
              checked={hasAntiTheft} 
              onChange={(e) => setHasAntiTheft(e.target.checked)} 
              className="w-4 h-4 rounded text-[#fb6504] focus:ring-[#fb6504]"
            />
            <div>
              <div className="text-xs font-bold text-white">Alarm / Garaža (-8%)</div>
              <div className="text-[11px] text-slate-400">Zaštićeno parkirno mjesto ili GPS</div>
            </div>
          </label>
        </div>
      </div>

      {/* Multi-Carrier Comparison Grid (The Zebra signature layout) */}
      <div className="grid grid-cols-1 gap-4">
        {baseOffers.map((offer) => {
          const finalAnnual = Math.round(offer.annualEur * (1 - discountPct / 100));
          const finalMonthly = Math.round((finalAnnual / 12) * 100) / 100;
          const isSelected = selectedCarrier === offer.id;

          return (
            <div 
              key={offer.id}
              onClick={() => setSelectedCarrier(offer.id)}
              className={`rr-surface-card rounded-2xl p-5 sm:p-6 border transition-all cursor-pointer relative overflow-hidden ${
                isSelected 
                  ? 'border-[#fb6504] shadow-[0_0_25px_-5px_rgba(251,101,4,0.25)] bg-[#0c101a]' 
                  : 'border-white/[0.06] hover:border-white/20 bg-white/[0.02]'
              }`}
            >
              {/* Badge if available */}
              {offer.recommendedBadge && (
                <div className="absolute top-0 right-0 bg-[#fb6504] text-white text-[10px] font-mono font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                  {offer.recommendedBadge}
                </div>
              )}

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                {/* Carrier info & rating */}
                <div className="space-y-2 lg:w-1/4">
                  <CarrierLogo name={offer.name} className="h-7" />
                  <div className="flex items-center gap-2 pt-1">
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-white">{offer.trustScore}</span>
                    <span className="text-[11px] text-slate-400 font-mono">({offer.reviewCount})</span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400">
                    HANFA: <span className="text-slate-300">{offer.hanfaSolvency}</span>
                  </div>
                </div>

                {/* Features & Best for */}
                <div className="lg:w-2/5 space-y-2">
                  <div className="text-xs font-bold text-slate-300">
                    Preporučeno za: <span className="text-white">{offer.bestFor}</span>
                  </div>
                  <ul className="space-y-1">
                    {offer.features.map((feat, idx) => (
                      <li key={idx} className="text-xs text-slate-400 flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pricing & Action */}
                <div className="lg:w-1/3 flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4 border-t lg:border-t-0 pt-4 lg:pt-0 border-white/[0.06]">
                  <div className="text-left lg:text-right">
                    <div className="flex items-baseline lg:justify-end gap-1.5">
                      <span className="text-2xl sm:text-3xl font-extrabold text-white">
                        {finalMonthly} €
                      </span>
                      <span className="text-xs text-slate-400 font-mono">/ mjesečno</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      ili <strong className="text-slate-200">{finalAnnual} €</strong> godišnje
                      {discountPct > 0 && (
                        <span className="text-emerald-400 ml-1 font-mono font-bold">(-{discountPct}%)</span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`Odabrali ste policu osiguratelja ${offer.name}. Preusmjeravamo vas na finalizaciju police.`);
                    }}
                    className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                      isSelected
                        ? 'rr-btn--primary shadow-md shadow-orange-500/20'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    <span>Odaberi Ponudu</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
