import React, { useState } from 'react';
import {
  ShieldCheck,
  Zap,
  PhoneCall,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Sparkles,
  ArrowRight,
  Clock,
  Car,
  ChevronRight,
  Check,
} from 'lucide-react';
import { formatEuro } from '../../lib/calculations';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { CARRIER_PARTNERS } from '../../data/mockData';

interface ReactiveQuoteResultProps {
  baseAnnualPrice: number;
  productName: string;
  category: 'auto' | 'property' | 'health' | 'travel';
  inputsSummary: Record<string, any>;
  onCompleteOnlineBind?: () => void;
  onRequestAgentCallback?: (name: string, phone: string) => Promise<void>;
}

export const ReactiveQuoteResult: React.FC<ReactiveQuoteResultProps> = ({
  baseAnnualPrice,
  productName,
  category,
  inputsSummary,
  onCompleteOnlineBind,
  onRequestAgentCallback,
}) => {
  // Interactive reactive sliders & riders state
  const [deductible, setDeductible] = useState<0 | 150 | 300>(0);
  const [glassBreakage, setGlassBreakage] = useState(true);
  const [roadAssistance, setRoadAssistance] = useState(true);
  const [bonusProtection, setBonusProtection] = useState(false);

  // Agent callback modal state
  const [isCallbackModalOpen, setIsCallbackModalOpen] = useState(false);
  const [callbackName, setCallbackName] = useState('');
  const [callbackPhone, setCallbackPhone] = useState('');
  const [callbackSuccess, setCallbackSuccess] = useState(false);
  const [isSubmittingCallback, setIsSubmittingCallback] = useState(false);

  // Online bind checkout modal state
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [selectedPaymentRail, setSelectedPaymentRail] = useState<'card' | 'keks' | 'aircash' | 'hub3a'>('card');
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  // Dynamic price calculation
  // Deductible discount: 0€ -> 100%, 150€ -> 85%, 300€ -> 72%
  let deductibleMultiplier = 1.0;
  if (deductible === 150) deductibleMultiplier = 0.88;
  if (deductible === 300) deductibleMultiplier = 0.76;

  let computedAnnual = baseAnnualPrice * deductibleMultiplier;

  // Addon pricing
  if (glassBreakage) computedAnnual += 45; // €3.75/mj
  if (roadAssistance) computedAnnual += 25; // €2.08/mj
  if (bonusProtection) computedAnnual += 18; // €1.50/mj

  const finalAnnual = parseFloat(computedAnnual.toFixed(2));
  const finalMonthly = parseFloat((finalAnnual / 12).toFixed(2));

  const handleCallbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!callbackName.trim() || !callbackPhone.trim()) return;

    setIsSubmittingCallback(true);
    try {
      if (onRequestAgentCallback) {
        await onRequestAgentCallback(callbackName, callbackPhone);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 600));
      }
      setCallbackSuccess(true);
      setTimeout(() => {
        setCallbackSuccess(false);
        setIsCallbackModalOpen(false);
      }, 3000);
    } catch {
      // fallback
    } finally {
      setIsSubmittingCallback(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Primary Calculated Price Showcase */}
      <Card className="p-6 sm:p-8 border-2 border-emerald-500/30 bg-gradient-to-br from-slate-900 to-slate-950 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-mono font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Vaš izračun uživo &bull; Ušteda do 35%</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {productName}
            </h3>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Statutarni izračun s uključenim popustima i odabranim pokrićima
            </p>
          </div>

          <div className="text-left md:text-right bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
            <span className="text-[11px] font-mono text-slate-400 block uppercase">
              Mjesečna rata
            </span>
            <div className="flex items-baseline gap-1 text-3xl sm:text-4xl font-black text-emerald-400 font-mono">
              <span>{formatEuro(finalMonthly)}</span>
              <span className="text-xs text-slate-400 font-normal">/ mj.</span>
            </div>
            <span className="text-xs text-slate-300 font-mono block mt-0.5">
              Godišnja premija: <strong>{formatEuro(finalAnnual)}</strong>
            </span>
          </div>
        </div>

        {/* Dynamic Reactive Sliders & Endorsement Toggles */}
        <div className="py-6 space-y-6 relative z-10">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-300">Franšiza (Vaše sudjelovanje u šteti):</span>
              <span className="font-mono text-emerald-400 font-bold">
                {deductible === 0 ? 'Bez franšize (0 €)' : `${deductible} €`}
              </span>
            </div>

            {/* Deductible Segmented Switcher */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { val: 0 as const, label: '0 € (Bez franšize)', desc: '100% pokriveno' },
                { val: 150 as const, label: '150 € franšiza', desc: 'Ušteda ~12%' },
                { val: 300 as const, label: '300 € franšiza', desc: 'Ušteda ~24%' },
              ].map((item) => (
                <button
                  key={item.val}
                  type="button"
                  onClick={() => setDeductible(item.val)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    deductible === item.val
                      ? 'bg-blue-600 border-blue-500 text-white shadow-md'
                      : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <p className="font-bold text-xs">{item.label}</p>
                  <p className="text-[10px] text-slate-200/70 font-mono mt-0.5">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Endorsement Toggles */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-semibold text-slate-300 block">
              Dodatna pokrića (klikom uključite u premiju):
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setGlassBreakage(!glassBreakage)}
                className={`p-3 rounded-xl border flex items-center justify-between text-left transition-all ${
                  glassBreakage
                    ? 'bg-emerald-950/60 border-emerald-600/80 text-white'
                    : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:border-slate-600'
                }`}
              >
                <div>
                  <p className="text-xs font-bold">Lom stakala</p>
                  <p className="text-[10px] font-mono text-emerald-400">+3,75 €/mj.</p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                    glassBreakage
                      ? 'bg-emerald-500 border-emerald-400 text-white'
                      : 'border-slate-600'
                  }`}
                >
                  {glassBreakage && <Check className="w-3.5 h-3.5" />}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRoadAssistance(!roadAssistance)}
                className={`p-3 rounded-xl border flex items-center justify-between text-left transition-all ${
                  roadAssistance
                    ? 'bg-emerald-950/60 border-emerald-600/80 text-white'
                    : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:border-slate-600'
                }`}
              >
                <div>
                  <p className="text-xs font-bold">Asistencija 24/7</p>
                  <p className="text-[10px] font-mono text-emerald-400">+2,08 €/mj.</p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                    roadAssistance
                      ? 'bg-emerald-500 border-emerald-400 text-white'
                      : 'border-slate-600'
                  }`}
                >
                  {roadAssistance && <Check className="w-3.5 h-3.5" />}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setBonusProtection(!bonusProtection)}
                className={`p-3 rounded-xl border flex items-center justify-between text-left transition-all ${
                  bonusProtection
                    ? 'bg-emerald-950/60 border-emerald-600/80 text-white'
                    : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:border-slate-600'
                }`}
              >
                <div>
                  <p className="text-xs font-bold">Zaštita bonusa</p>
                  <p className="text-[10px] font-mono text-emerald-400">+1,50 €/mj.</p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                    bonusProtection
                      ? 'bg-emerald-500 border-emerald-400 text-white'
                      : 'border-slate-600'
                  }`}
                >
                  {bonusProtection && <Check className="w-3.5 h-3.5" />}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Dual Conversion Buttons */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 relative z-10">
          <Button
            variant="emerald"
            size="lg"
            onClick={() => setIsCheckoutModalOpen(true)}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="flex-1 font-bold shadow-lg shadow-emerald-900/30"
          >
            Ugovori policu online
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => setIsCallbackModalOpen(true)}
            leftIcon={<PhoneCall className="w-4 h-4 text-emerald-400" />}
            className="text-white border-slate-700 hover:bg-slate-800 font-semibold text-xs sm:text-sm"
          >
            Zatraži poziv agenta (15 min)
          </Button>
        </div>
      </Card>

      {/* Multi-Carrier Live Price Comparison Matrix */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-sm text-slate-900">Usporedba ponuda vodećih osiguratelja</h4>
          <span className="text-[11px] font-mono text-slate-500">Ista pokrića &bull; Bez skrivenih troškova</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {CARRIER_PARTNERS.slice(0, 4).map((carrier, idx) => {
            // Slight natural variance between carriers
            const carrierPremium = parseFloat((finalAnnual * (1 + (idx - 1) * 0.04)).toFixed(2));
            const isBestRate = idx === 0;

            return (
              <Card key={carrier.id} className="p-4 border hover:border-blue-400 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between pb-2 border-b border-slate-100">
                    <div>
                      <h5 className="font-bold text-sm text-slate-900">{carrier.shortName}</h5>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Ocjena: {carrier.rating} ★ ({carrier.reviewCount})
                      </span>
                    </div>
                    {isBestRate && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold font-mono">
                        Najpovoljnije
                      </span>
                    )}
                  </div>

                  <div className="py-3">
                    <span className="text-[10px] font-mono text-slate-400 block">Godišnja premija</span>
                    <span className="text-xl font-black font-mono text-slate-900">
                      {formatEuro(carrierPremium)}
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      ili {formatEuro(carrierPremium / 12)} / mj.
                    </span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCheckoutModalOpen(true)}
                  className="w-full text-xs font-semibold hover:border-emerald-500 hover:text-emerald-700"
                >
                  Odaberi {carrier.shortName}
                </Button>
              </Card>
            );
          })}
        </div>
      </div>

      {/* MODAL 1: 15-Minute Callback Request */}
      {isCallbackModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 text-left space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">Besplatni poziv licenciranog agenta</h4>
                  <p className="text-xs text-slate-500 font-mono">Poziv unutar 15 minuta &bull; Bez obveze</p>
                </div>
              </div>
              <button
                onClick={() => setIsCallbackModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {callbackSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h5 className="font-bold text-slate-900 text-lg">Zahtjev je zaprimljen!</h5>
                <p className="text-xs text-slate-600 max-w-xs mx-auto">
                  Naš licencirani agent će vas kontaktirati na broj <strong>{callbackPhone}</strong> unutar 15 minuta.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCallbackSubmit} className="space-y-3 pt-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
                  Odabrani proizvod: <strong>{productName}</strong> ({formatEuro(finalMonthly)}/mj.)
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Vaše ime i prezime</label>
                  <input
                    type="text"
                    required
                    placeholder="npr. Ivan Horvat"
                    value={callbackName}
                    onChange={(e) => setCallbackName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600 min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Broj mobitela</label>
                  <input
                    type="tel"
                    required
                    placeholder="npr. 091 234 5678"
                    value={callbackPhone}
                    onChange={(e) => setCallbackPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600 min-h-[44px]"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={() => setIsCallbackModalOpen(false)}
                    className="w-1/3"
                  >
                    Odustani
                  </Button>
                  <Button
                    variant="emerald"
                    size="sm"
                    type="submit"
                    disabled={isSubmittingCallback}
                    className="w-2/3 font-bold"
                  >
                    {isSubmittingCallback ? 'Slanje...' : 'Potvrdi poziv u 15m'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: Digital Payment & Online Bind Checkout */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 text-left space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-lg">Sigurno online ugovaranje police</h4>
                <p className="text-xs text-slate-500 font-mono">
                  Iznos za naplatu: <strong>{formatEuro(finalAnnual)}</strong> (ili 12x {formatEuro(finalMonthly)})
                </p>
              </div>
              <button
                onClick={() => setIsCheckoutModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            {checkoutComplete ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h5 className="font-bold text-slate-900 text-lg">Polica je uspješno ugovorena!</h5>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Potvrda police i IPID obrazac poslani su na vašu e-mail adresu. Polica stupa na snagu u ugovorenom terminu.
                </p>
                <div className="pt-2">
                  <Button variant="emerald" onClick={() => setIsCheckoutModalOpen(false)}>
                    U redu, zatvori
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-700 block">Odaberite način plaćanja:</span>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => setSelectedPaymentRail('card')}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between ${
                        selectedPaymentRail === 'card'
                          ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span>Kartice (1-12 rata)</span>
                      <CreditCard className="w-4 h-4 text-blue-600" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedPaymentRail('keks')}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between ${
                        selectedPaymentRail === 'keks'
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span>KEKS Pay</span>
                      <span className="text-[10px] font-bold text-emerald-600">BRZO</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedPaymentRail('aircash')}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between ${
                        selectedPaymentRail === 'aircash'
                          ? 'border-rose-600 bg-rose-50 text-rose-900 font-bold'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span>Aircash novčanik</span>
                      <span className="text-[10px] font-bold text-rose-600">1-KLIK</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedPaymentRail('hub3a')}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between ${
                        selectedPaymentRail === 'hub3a'
                          ? 'border-slate-800 bg-slate-100 text-slate-900 font-bold'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span>2D Barkod HUB 3A</span>
                      <span className="text-[10px] text-slate-600">M-banking</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1 text-slate-600">
                  <p className="flex items-center gap-1 text-slate-900 font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Sigurna transakcija & HANFA zaštita potrošača
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Polica ima izravnu pravnu snagu. Preuzimanje digitalnog certifikata i Zelene karte omogućeno je odmah po autorizaciji.
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button variant="ghost" size="sm" onClick={() => setIsCheckoutModalOpen(false)} className="w-1/3">
                    Odustani
                  </Button>
                  <Button
                    variant="emerald"
                    size="sm"
                    onClick={() => {
                      setCheckoutComplete(true);
                      if (onCompleteOnlineBind) onCompleteOnlineBind();
                    }}
                    className="w-2/3 font-bold text-sm"
                  >
                    Dovrši i plati {formatEuro(finalAnnual)}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
