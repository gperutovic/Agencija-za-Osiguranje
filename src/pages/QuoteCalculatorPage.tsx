import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Calculator,
  Car,
  Home,
  Heart,
  Activity,
  ShieldCheck,
  Zap,
  Clock,
  Sparkles,
} from 'lucide-react';
import { AutoQuoteCalculator } from '../components/calculators/AutoQuoteCalculator';
import { PropertyQuoteCalculator } from '../components/calculators/PropertyQuoteCalculator';
import { LifeQuoteCalculator } from '../components/calculators/LifeQuoteCalculator';
import { HealthQuoteCalculator } from '../components/calculators/HealthQuoteCalculator';

export const QuoteCalculatorPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeType = searchParams.get('type') || 'auto';

  const handleTabChange = (type: string) => {
    setSearchParams({ type });
  };

  const tabs = [
    { id: 'auto', label: 'Auto & Kasko', icon: Car, desc: 'AO + Kasko + Asistencija' },
    { id: 'property', label: 'Imovina & Potres', icon: Home, desc: 'Građevina + Stvari' },
    { id: 'life', label: 'Životno ŽIVOT+', icon: Heart, desc: 'Zaštita + Štednja' },
    { id: 'health', label: 'Zdravstveno', icon: Activity, desc: 'Specijalisti + Lijekovi' },
  ];

  return (
    <div className="space-y-12 pb-20">
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-navy-950 via-slate-900 to-navy-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Aktuarski Izračun Premije Uživo &bull; Generali Tarife 2026</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight max-w-3xl mx-auto">
            Izračunajte točnu cijenu osiguranja za 60 sekundi
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Transparentan izračun sa svim primijenjenim bonusima, franšizama i popustima. Bez obveze ugovaranja.
          </p>
        </div>
      </section>

      {/* Interactive Tabs Bar */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeType === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col items-center sm:items-start gap-2 ${
                  isSelected
                    ? 'bg-brand-600 text-white border-brand-600 shadow-lg scale-[1.02]'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold leading-tight">{tab.label}</p>
                  <p
                    className={`text-[11px] mt-0.5 hidden sm:block ${
                      isSelected ? 'text-teal-100' : 'text-slate-400'
                    }`}
                  >
                    {tab.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Active Calculator Container */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="transition-all duration-300">
          {activeType === 'auto' && <AutoQuoteCalculator />}
          {activeType === 'property' && <PropertyQuoteCalculator />}
          {activeType === 'life' && <LifeQuoteCalculator />}
          {activeType === 'health' && <HealthQuoteCalculator />}
        </div>

        {/* Reassurance Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-10 text-xs text-slate-600">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-teal-600 shrink-0" />
            <div>
              <p className="font-bold text-slate-900">Službene Generali Tarife</p>
              <p className="text-slate-500">Isti uvjeti i cijene kao u poslovnici.</p>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center gap-3">
            <Zap className="w-8 h-8 text-teal-600 shrink-0" />
            <div>
              <p className="font-bold text-slate-900">Prijenos 50% Bonusa</p>
              <p className="text-slate-500">Priznajemo bonus svih osiguratelja u RH.</p>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center gap-3">
            <Clock className="w-8 h-8 text-teal-600 shrink-0" />
            <div>
              <p className="font-bold text-slate-900">Pravna Sigurnost</p>
              <p className="text-slate-500">Izdavanje police i IPID-a prema zakonu.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
