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
  HelpCircle,
} from 'lucide-react';
import { AutoQuoteWizard } from '../components/quotes/AutoQuoteWizard';
import { PropertyQuoteWizard } from '../components/quotes/PropertyQuoteWizard';
import { HealthQuoteWizard } from '../components/quotes/HealthQuoteWizard';
import { NeedsAssessmentQuiz } from '../components/quotes/NeedsAssessmentQuiz';
import { LifeQuoteCalculator } from '../components/calculators/LifeQuoteCalculator';

export const QuoteCalculatorPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeType = searchParams.get('type') || 'auto';

  const handleTabChange = (type: string) => {
    setSearchParams({ type });
  };

  const tabs = [
    { id: 'auto', label: 'Auto & Kasko', icon: Car, desc: 'AO + Kasko + Asistencija' },
    { id: 'property', label: 'Imovina & Dom', icon: Home, desc: 'Građevina + Stvari + Potres' },
    { id: 'health', label: 'Zdravstveno', icon: Activity, desc: 'Dopunsko + Dodatno' },
    { id: 'needs', label: 'Pametni Savjetnik', icon: HelpCircle, desc: 'Analiza potreba (IDD)' },
    { id: 'life', label: 'Životno Osiguranje', icon: Heart, desc: 'Zaštita obitelji + Štednja' },
  ];

  return (
    <div className="space-y-12 pb-24 text-slate-100">
      {/* Header Banner */}
      <section className="relative overflow-hidden pt-12 pb-14 text-center space-y-4">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#fb6504]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono font-bold tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#fb6504] animate-pulse" />
            <span className="text-white">Aktuarski Izračun Premije Uživo</span>
            <span className="text-slate-500">&bull;</span>
            <span className="text-[#ff7b1a]">Generali Tarife 2026</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight max-w-3xl mx-auto text-white">
            Izračunajte točnu cijenu osiguranja za{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fb6504] to-[#ff7b1a]">
              60 sekundi
            </span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed font-light">
            Transparentan izračun sa svim primijenjenim bonusima, franšizama i popustima. Bez obveze ugovaranja.
          </p>
        </div>
      </section>

      {/* Interactive Tabs Bar */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeType === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`p-4 rounded-3xl border text-left transition-all flex flex-col items-center sm:items-start gap-2 backdrop-blur-xl ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#fb6504] to-[#ff7b1a] text-white border-transparent shadow-[0_0_20px_rgba(251,101,4,0.35)] scale-[1.02]'
                    : 'bg-[#0a0d16]/90 text-slate-300 border-white/[0.08] hover:border-white/[0.16] hover:bg-white/[0.04]'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-white/[0.05] border border-white/[0.08] text-slate-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold leading-tight">{tab.label}</p>
                  <p
                    className={`text-[11px] font-mono mt-0.5 hidden sm:block ${
                      isSelected ? 'text-white/80' : 'text-slate-400'
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
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="transition-all duration-300">
          {activeType === 'auto' && <AutoQuoteWizard />}
          {activeType === 'property' && <PropertyQuoteWizard />}
          {activeType === 'health' && <HealthQuoteWizard />}
          {activeType === 'needs' && <NeedsAssessmentQuiz />}
          {activeType === 'life' && <LifeQuoteCalculator />}
        </div>

        {/* Reassurance Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-10 text-xs text-slate-300">
          <div className="p-4 rounded-3xl bg-[#0a0d16]/90 border border-white/[0.08] backdrop-blur-xl flex items-center gap-3 shadow-lg">
            <ShieldCheck className="w-8 h-8 text-[#ff7b1a] shrink-0" />
            <div>
              <p className="font-bold text-white font-mono">Službene Generali Tarife</p>
              <p className="text-slate-400">Isti uvjeti i cijene kao u poslovnici.</p>
            </div>
          </div>
          <div className="p-4 rounded-3xl bg-[#0a0d16]/90 border border-white/[0.08] backdrop-blur-xl flex items-center gap-3 shadow-lg">
            <Zap className="w-8 h-8 text-amber-400 shrink-0" />
            <div>
              <p className="font-bold text-white font-mono">Prijenos 50% Bonusa</p>
              <p className="text-slate-400">Priznajemo bonus svih osiguratelja u RH.</p>
            </div>
          </div>
          <div className="p-4 rounded-3xl bg-[#0a0d16]/90 border border-white/[0.08] backdrop-blur-xl flex items-center gap-3 shadow-lg">
            <Clock className="w-8 h-8 text-cyan-400 shrink-0" />
            <div>
              <p className="font-bold text-white font-mono">Pravna Sigurnost</p>
              <p className="text-slate-400">Izdavanje police i IPID-a prema zakonu.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
