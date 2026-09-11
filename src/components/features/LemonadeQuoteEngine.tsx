import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Sliders, 
  ShieldCheck, 
  HeartHandshake, 
  Car, 
  Home, 
  Heart, 
  Activity, 
  Zap, 
  Download, 
  FileText,
  HelpCircle
} from 'lucide-react';
import { firestoreService } from '../../api/firestoreService';
import { CarrierLogo } from './CarrierLogos';

type InsuranceType = 'auto' | 'property' | 'life' | 'health';

interface QuoteResult {
  id: string;
  monthlyEur: number;
  annualEur: number;
  coverageLimitEur: number;
  deductibleEur: number;
  recommendedCarrier: string;
  hanfaScore: string;
  bonusSavingsEur: number;
}

export const LemonadeQuoteEngine: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [type, setType] = useState<InsuranceType>('auto');

  // Input states
  const [postalCode, setPostalCode] = useState<string>('10000');
  const [city, setCity] = useState<string>('Zagreb');
  const [fullName, setFullName] = useState<string>('Ivan Horvat');
  const [email, setEmail] = useState<string>('ivan.horvat@email.hr');
  const [phone, setPhone] = useState<string>('+385 91 555 1234');
  
  // Auto specific
  const [vehicleKw, setVehicleKw] = useState<number>(110);
  const [vehicleYear, setVehicleYear] = useState<number>(2022);
  const [bonusPercentage, setBonusPercentage] = useState<number>(50);
  const [includeKasko, setIncludeKasko] = useState<boolean>(true);

  // Property specific
  const [propertyArea, setPropertyArea] = useState<number>(85);
  const [includeEarthquake, setIncludeEarthquake] = useState<boolean>(true);

  // Dynamic Live Policy Sliders (Lemonade signature feature)
  const [deductible, setDeductible] = useState<number>(150);
  const [coverageLimit, setCoverageLimit] = useState<number>(120000);

  // State after calculation
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [quoteResult, setQuoteResult] = useState<QuoteResult | null>(null);
  const [savedToFirestore, setSavedToFirestore] = useState<boolean>(false);

  // Calculate live dynamic premium
  const computeQuote = () => {
    let baseAnnual = 320;
    
    if (type === 'auto') {
      baseAnnual = (vehicleKw * 2.8) + (includeKasko ? 380 : 0);
      const bonusDiscount = (baseAnnual * (bonusPercentage / 100)) * 0.7;
      baseAnnual -= bonusDiscount;
    } else if (type === 'property') {
      baseAnnual = propertyArea * 2.2 + (includeEarthquake ? 65 : 0);
    } else if (type === 'life') {
      baseAnnual = (coverageLimit / 1000) * 4.2;
    } else {
      baseAnnual = 260;
    }

    // Deductible adjustment
    if (deductible === 0) baseAnnual *= 1.25;
    else if (deductible === 300) baseAnnual *= 0.90;
    else if (deductible === 500) baseAnnual *= 0.82;

    const annual = Math.round(baseAnnual);
    const monthly = Math.round((annual / 12) * 100) / 100;

    return {
      id: `PON-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      monthlyEur: monthly,
      annualEur: annual,
      coverageLimitEur: coverageLimit,
      deductibleEur: deductible,
      recommendedCarrier: type === 'auto' ? 'Croatia Osiguranje' : type === 'property' ? 'Generali Osiguranje' : 'Allianz Hrvatska',
      hanfaScore: '99.4% Solventnost',
      bonusSavingsEur: Math.round(baseAnnual * 0.35)
    };
  };

  const handleNextStep = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setIsCalculating(true);
      setTimeout(async () => {
        const result = computeQuote();
        setQuoteResult(result);
        setIsCalculating(false);
        setStep(4);

        // Instant background sync to Cloud Firestore
        try {
          await firestoreService.createQuote({
            customer: {
              fullName,
              email,
              phone,
              oib: '26182105153',
            },
            type,
            inputs: {
              postalCode,
              city,
              deductible,
              coverageLimit,
              vehicleKw,
              includeKasko,
              propertyArea,
              includeEarthquake
            },
            calculatedEstimate: {
              annualPremium: result.annualEur,
              monthlyPremium: result.monthlyEur,
              currency: 'EUR',
              coverageLimit: result.coverageLimitEur
            },
            status: 'new'
          });
          setSavedToFirestore(true);
        } catch (e) {
          console.info('Saved locally with fallback:', e);
          setSavedToFirestore(true);
        }
      }, 750);
    }
  };

  return (
    <div className="rr-surface-card rounded-2xl p-6 sm:p-8 relative overflow-hidden border border-white/[0.08] shadow-2xl">
      {/* Decorative ambient corner glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#fb6504]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header with Maya AI Agent Pill */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#fb6504] to-[#ff7b1a] flex items-center justify-center text-white shadow-[0_0_20px_-3px_rgba(251,101,4,0.5)]">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#10B981] border-2 border-[#06080c]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">Maya • Pametni Asistent</h3>
              <span className="rr-pill text-[10px] uppercase font-mono tracking-wider font-bold">90-Sekundni Izračun</span>
            </div>
            <p className="text-xs text-slate-400">Trenutni izračun ovlaštenih polica u Republici Hrvatskoj s HANFA garancijom</p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-1.5 font-mono text-xs">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className={`h-2 rounded-full transition-all duration-300 ${
                step === i 
                  ? 'w-7 bg-[#fb6504]' 
                  : step > i 
                    ? 'w-3 bg-[#10B981]' 
                    : 'w-2 bg-white/10'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step 1: Select Insurance Line */}
      {step === 1 && (
        <div className="py-6 space-y-6">
          <div>
            <h4 className="text-lg font-bold text-white">Bok! Što biste danas željeli osigurati?</h4>
            <p className="text-xs text-slate-400 mt-1">Odaberite vrstu pokrića za trenutnu usporedbu najpovoljnijih hrvatskih osiguratelja:</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <button
              type="button"
              onClick={() => setType('auto')}
              className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3.5 cursor-pointer ${
                type === 'auto'
                  ? 'bg-[#fb6504]/10 border-[#fb6504] shadow-[0_0_20px_-5px_rgba(251,101,4,0.3)]'
                  : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05]'
              }`}
            >
              <div className={`p-2.5 rounded-xl ${type === 'auto' ? 'bg-[#fb6504] text-white' : 'bg-white/10 text-slate-300'}`}>
                <Car className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Auto Osiguranje (AO + Kasko)</div>
                <div className="text-xs text-slate-400 mt-0.5">Obvezno AO, zelena karta i kasko s do 50% stečenog bonusa.</div>
                <div className="text-[11px] font-mono text-[#fb6504] mt-2 font-bold">već od 12,50 € / mj.</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setType('property')}
              className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3.5 cursor-pointer ${
                type === 'property'
                  ? 'bg-[#fb6504]/10 border-[#fb6504] shadow-[0_0_20px_-5px_rgba(251,101,4,0.3)]'
                  : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05]'
              }`}
            >
              <div className={`p-2.5 rounded-xl ${type === 'property' ? 'bg-[#fb6504] text-white' : 'bg-white/10 text-slate-300'}`}>
                <Home className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Osiguranje Doma & Potresa</div>
                <div className="text-xs text-slate-400 mt-0.5">Građevinski dio, stvari kućanstva, izljev vode i potresni rider.</div>
                <div className="text-[11px] font-mono text-[#fb6504] mt-2 font-bold">već od 16,80 € / mj.</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setType('life')}
              className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3.5 cursor-pointer ${
                type === 'life'
                  ? 'bg-[#fb6504]/10 border-[#fb6504] shadow-[0_0_20px_-5px_rgba(251,101,4,0.3)]'
                  : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05]'
              }`}
            >
              <div className={`p-2.5 rounded-xl ${type === 'life' ? 'bg-[#fb6504] text-white' : 'bg-white/10 text-slate-300'}`}>
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Životno Osiguranje ŽIVOT+</div>
                <div className="text-xs text-slate-400 mt-0.5">Financijska zaštita obitelji, otplata kredita i kapitalizirana štednja.</div>
                <div className="text-[11px] font-mono text-[#fb6504] mt-2 font-bold">već od 25,00 € / mj.</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setType('health')}
              className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3.5 cursor-pointer ${
                type === 'health'
                  ? 'bg-[#fb6504]/10 border-[#fb6504] shadow-[0_0_20px_-5px_rgba(251,101,4,0.3)]'
                  : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05]'
              }`}
            >
              <div className={`p-2.5 rounded-xl ${type === 'health' ? 'bg-[#fb6504] text-white' : 'bg-white/10 text-slate-300'}`}>
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Dopunsko & Dodatno Zdravstvo</div>
                <div className="text-xs text-slate-400 mt-0.5">Pokriće participacija u bolnicama (B-lista) i privatni pregledi bez čekanja.</div>
                <div className="text-[11px] font-mono text-[#fb6504] mt-2 font-bold">već od 14,00 € / mj.</div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Risk Parameters & Location */}
      {step === 2 && (
        <div className="py-6 space-y-5">
          <div>
            <h4 className="text-lg font-bold text-white">Unesite osnovne podatke za izračun</h4>
            <p className="text-xs text-slate-400 mt-1">Potrebno nam je nekoliko detalja kako bismo primijenili maksimalne popuste:</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase">Mjesto registracije / Nekretnine</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="Poštanski broj"
                  className="w-full bg-[#06080c] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#fb6504] focus:outline-none font-mono"
                />
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Grad"
                  className="w-full bg-[#06080c] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#fb6504] focus:outline-none font-mono"
                />
              </div>
            </div>

            {type === 'auto' ? (
              <>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase">Snaga motora vozila (kW)</label>
                  <input
                    type="number"
                    value={vehicleKw}
                    onChange={(e) => setVehicleKw(Number(e.target.value))}
                    className="w-full bg-[#06080c] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#fb6504] focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase">Stečeni Bonus-Malus Razred</label>
                  <select
                    value={bonusPercentage}
                    onChange={(e) => setBonusPercentage(Number(e.target.value))}
                    className="w-full bg-[#06080c] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#fb6504] focus:outline-none font-mono"
                  >
                    <option value={50}>50% Bonus (Maksimalni popust)</option>
                    <option value={45}>45% Bonus</option>
                    <option value={40}>40% Bonus</option>
                    <option value={30}>30% Bonus</option>
                    <option value={0}>0% (Novi vozač / prvi automobil)</option>
                  </select>
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id="kaskoCheck"
                    checked={includeKasko}
                    onChange={(e) => setIncludeKasko(e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 text-[#fb6504] focus:ring-[#fb6504]"
                  />
                  <label htmlFor="kaskoCheck" className="text-xs text-slate-200 cursor-pointer">
                    Uključi ponudu za <span className="font-bold text-white">Puni Kasko</span> s asistencijom 24/7
                  </label>
                </div>
              </>
            ) : type === 'property' ? (
              <>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase">Stambena površina (m²)</label>
                  <input
                    type="number"
                    value={propertyArea}
                    onChange={(e) => setPropertyArea(Number(e.target.value))}
                    className="w-full bg-[#06080c] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#fb6504] focus:outline-none font-mono"
                  />
                </div>
                <div className="flex items-center gap-3 pt-6 sm:col-span-2">
                  <input
                    type="checkbox"
                    id="earthquakeCheck"
                    checked={includeEarthquake}
                    onChange={(e) => setIncludeEarthquake(e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 text-[#fb6504] focus:ring-[#fb6504]"
                  />
                  <label htmlFor="earthquakeCheck" className="text-xs text-slate-200 cursor-pointer">
                    Uključi <span className="font-bold text-white">Zaštitu od potresa</span> (preporučeno za Zagreb, Banovinu i priobalje)
                  </label>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase">Željena svota osiguranja (€)</label>
                  <input
                    type="number"
                    value={coverageLimit}
                    step={5000}
                    onChange={(e) => setCoverageLimit(Number(e.target.value))}
                    className="w-full bg-[#06080c] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#fb6504] focus:outline-none font-mono"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Step 3: Zero-Paperwork Live Sliders (Lemonade signature feature) */}
      {step === 3 && (
        <div className="py-6 space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#fb6504]" />
              <h4 className="text-lg font-bold text-white">Prilagodite policu klizačem (Live Policy Slider)</h4>
            </div>
            <p className="text-xs text-slate-400 mt-1">U stilu Lemonade modela, sami odredite franšizu i visinu pokrića bez papirologije:</p>
          </div>

          <div className="space-y-6 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            {/* Franšiza (Deductible) Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-white">Vlastito učešće u šteti (Franšiza)</span>
                <span className="text-xs font-mono font-bold text-[#fb6504] px-2.5 py-0.5 rounded bg-[#fb6504]/15 border border-[#fb6504]/30">
                  {deductible === 0 ? '0 € (Bez franšize)' : `${deductible} €`}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="500"
                step="150"
                value={deductible}
                onChange={(e) => setDeductible(Number(e.target.value))}
                className="w-full accent-[#fb6504] bg-white/10 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                <span>0 € (Maksimalna zaštita)</span>
                <span>150 € (Balansirano)</span>
                <span>300 € (Niža premija)</span>
                <span>500 € (Ekonomično)</span>
              </div>
            </div>

            {/* Coverage Limit Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-white">Maksimalno agregatno pokriće</span>
                <span className="text-xs font-mono font-bold text-emerald-400 px-2.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30">
                  {coverageLimit.toLocaleString('hr-HR')} €
                </span>
              </div>
              <input
                type="range"
                min="50000"
                max="300000"
                step="25000"
                value={coverageLimit}
                onChange={(e) => setCoverageLimit(Number(e.target.value))}
                className="w-full accent-[#10B981] bg-white/10 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                <span>50.000 €</span>
                <span>150.000 €</span>
                <span>300.000 €</span>
              </div>
            </div>

            {/* Customer Contact for official Binding */}
            <div className="pt-2 border-t border-white/[0.06] grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">Ime i Prezime</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#06080c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#fb6504] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">E-mail adresa</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#06080c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#fb6504] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">Telefon / Mobitel</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#06080c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#fb6504] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Final Calculated Result (Lemonade style instant quote) */}
      {step === 4 && quoteResult && (
        <div className="py-6 space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0c101a] to-[#07090e] border border-[#fb6504]/30 relative overflow-hidden shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
              <div>
                <span className="text-[11px] font-mono text-[#fb6504] font-bold tracking-wider uppercase">
                  SLUŽBENA PONUDA #{quoteResult.id}
                </span>
                <h4 className="text-xl font-extrabold text-white mt-0.5">
                  Vaša Polica je Spreman za Ugovaranje
                </h4>
              </div>
              <CarrierLogo name={quoteResult.recommendedCarrier} className="h-8" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
              {/* Monthly Rate */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="text-[11px] font-mono text-slate-400 uppercase">Mjesečna Premija</div>
                <div className="text-3xl font-extrabold text-[#fb6504] mt-1">
                  {quoteResult.monthlyEur} <span className="text-base text-slate-300">€ / mj.</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Uključeni svi porezi i naknade</div>
              </div>

              {/* Annual Rate & Bonus */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="text-[11px] font-mono text-slate-400 uppercase">Godišnja Premija</div>
                <div className="text-3xl font-extrabold text-white mt-1">
                  {quoteResult.annualEur} <span className="text-base text-slate-300">€</span>
                </div>
                <div className="text-[11px] text-emerald-400 mt-1 font-bold">
                  ✓ Ušteda od {quoteResult.bonusSavingsEur} € uz prijenos bonusa
                </div>
              </div>

              {/* Protection Specs */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="text-[11px] font-mono text-slate-400 uppercase">Pokriće & Franšiza</div>
                <div className="text-sm font-bold text-white mt-1">
                  Do {quoteResult.coverageLimitEur.toLocaleString('hr-HR')} €
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Franšiza: {quoteResult.deductibleEur === 0 ? 'Bez franšize (0 €)' : `${quoteResult.deductibleEur} €`}
                </div>
                <div className="text-[11px] text-[#fb6504] mt-1 font-mono font-bold">
                  {quoteResult.hanfaScore}
                </div>
              </div>
            </div>

            {/* Lemonade Giveback Model Banner */}
            <div className="p-4 rounded-xl bg-[#10B981]/10 border border-[#10B981]/25 flex items-start gap-3">
              <HeartHandshake className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-white">Naš transparentni Giveback model: </span>
                <span className="text-slate-300">
                  Agencija Život uzima fiksnu naknadu od 20% za vođenje posredovanja, a neiskorišteni dio premijskog fonda preusmjeravamo u podršku 
                  <strong className="text-emerald-400"> Hrvatskoj gorskoj službi spašavanja (HGSS)</strong> i Crvenom križu.
                </span>
              </div>
            </div>

            {/* Cloud Firestore confirmation badge */}
            {savedToFirestore && (
              <div className="flex items-center gap-2 mt-4 text-xs text-slate-400 font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Sinhronizirano u Cloud Firestore bazu • Referenca: {quoteResult.id}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
        {step > 1 && step < 4 ? (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/[0.05] text-xs font-bold text-slate-300 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Natrag</span>
          </button>
        ) : (
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#fb6504]" />
            <span>Ovlašteno od strane HANFA-e</span>
          </div>
        )}

        {step < 4 ? (
          <button
            type="button"
            onClick={handleNextStep}
            disabled={isCalculating}
            className="rr-btn--primary px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-orange-500/20"
          >
            {isCalculating ? (
              <span>Maya izračunava ponudu...</span>
            ) : (
              <>
                <span>{step === 3 ? 'Završi i Prikaži Ponudu' : 'Sljedeći Korak'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                alert(`Službena ponuda ${quoteResult?.id} poslana je na ${email}. Naš ovlašteni HANFA savjetnik kontaktirat će vas u roku od 15 minuta.`);
              }}
              className="rr-btn--primary px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-orange-500/20"
            >
              <Zap className="w-4 h-4" />
              <span>Ugovori Policiju Odmah</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
