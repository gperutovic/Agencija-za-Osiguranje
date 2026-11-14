import React, { useState } from 'react';
import {
  ShieldCheck,
  PhoneCall,
  CheckCircle2,
  CreditCard,
  ArrowRight,
  Check,
} from 'lucide-react';
import { formatEuro } from '../../lib/calculations';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { CARRIER_PARTNERS } from '../../data/mockData';
import { firestoreService } from '../../api/firestoreService';
import { leadService } from '../../services/firebase';

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
  const [selectedPaymentRail, setSelectedPaymentRail] = useState<'card' | 'hub3a' | 'keks' | 'sepa'>('card');
  const [checkoutName, setCheckoutName] = useState('');
  const [checkoutPhone, setCheckoutPhone] = useState('');
  const [checkoutEmail, setCheckoutEmail] = useState('');
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [isSubmittingCheckout, setIsSubmittingCheckout] = useState(false);
  const [savedReference, setSavedReference] = useState<string | null>(null);
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  // Dynamic price calculation
  let deductibleMultiplier = 1.0;
  if (deductible === 150) deductibleMultiplier = 0.88;
  if (deductible === 300) deductibleMultiplier = 0.76;

  let computedAnnual = baseAnnualPrice * deductibleMultiplier;

  // Addon pricing
  if (glassBreakage) computedAnnual += 45;
  if (roadAssistance) computedAnnual += 25;
  if (bonusProtection) computedAnnual += 18;

  const finalAnnual = parseFloat(computedAnnual.toFixed(2));
  const finalMonthly = parseFloat((finalAnnual / 12).toFixed(2));

  const mappedProductType: 'auto' | 'property' | 'life' | 'health' =
    category === 'travel' ? 'health' : category;

  const handleCallbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!callbackName.trim() || !callbackPhone.trim()) return;

    setIsSubmittingCallback(true);
    try {
      if (onRequestAgentCallback) {
        await onRequestAgentCallback(callbackName, callbackPhone);
      } else {
        await leadService.saveLead({
          oib: '',
          name: callbackName.trim(),
          fullName: callbackName.trim(),
          email: '',
          phone: callbackPhone.trim(),
          productType: mappedProductType,
          data: {
            ...inputsSummary,
            originalCategory: category,
            deductible,
            glassBreakage,
            roadAssistance,
            bonusProtection,
          },
          annualPremium: finalAnnual,
          status: 'new',
          notes: `Povratni poziv: ${productName} (${formatEuro(finalAnnual)} god.)`,
        });
      }
      setCallbackSuccess(true);
      setTimeout(() => {
        setCallbackSuccess(false);
        setIsCallbackModalOpen(false);
      }, 3000);
    } catch (err) {
      console.error('Callback submission error:', err);
    } finally {
      setIsSubmittingCallback(false);
    }
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError(null);

    if (!checkoutName.trim() || !checkoutPhone.trim() || !checkoutEmail.trim()) {
      setCheckoutError('Molimo ispunite ime i prezime, broj telefona i e-mail adresu.');
      return;
    }

    setIsSubmittingCheckout(true);
    try {
      const quote = await firestoreService.createQuote({
        customer: {
          fullName: checkoutName.trim(),
          email: checkoutEmail.trim(),
          phone: checkoutPhone.trim(),
        },
        type: mappedProductType,
        inputs: {
          ...inputsSummary,
          originalCategory: category,
          deductible,
          glassBreakage,
          roadAssistance,
          bonusProtection,
          paymentRail: selectedPaymentRail,
        },
        calculatedEstimate: {
          annualPremium: finalAnnual,
          monthlyPremium: finalMonthly,
          currency: 'EUR',
        },
        status: 'new',
      });

      await leadService.saveLead({
        oib: '',
        name: checkoutName.trim(),
        fullName: checkoutName.trim(),
        email: checkoutEmail.trim(),
        phone: checkoutPhone.trim(),
        productType: mappedProductType,
        data: {
          ...inputsSummary,
          originalCategory: category,
          paymentRail: selectedPaymentRail,
          quoteId: quote.id,
        },
        annualPremium: finalAnnual,
        status: 'quoted',
        notes: `Online zahtjev za ugovaranje (${productName}, plaćanje: ${selectedPaymentRail})`,
      });

      setSavedReference(quote.id);
      setCheckoutComplete(true);
      if (onCompleteOnlineBind) onCompleteOnlineBind();
    } catch (err) {
      console.error('Checkout submission error:', err);
      setCheckoutError('Došlo je do pogreške pri spremanju zahtjeva. Pokušajte ponovno.');
    } finally {
      setIsSubmittingCheckout(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Primary Calculated Price Showcase */}
      <Card className="p-6 sm:p-8 border border-slate-200 bg-white text-slate-900 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F2942]/5 text-[#0F2942] border border-[#0F2942]/15 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Informativni izračun premije</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {productName}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Obračun prema odabranim parametrima i dopunskim pokrićima
            </p>
          </div>

          <div className="text-left md:text-right bg-[#0F2942] text-white p-4 sm:p-5 rounded-xl shrink-0">
            <span className="text-[11px] font-medium text-slate-300 block uppercase tracking-wider">
              Okvirna mjesečna rata
            </span>
            <div className="flex items-baseline gap-1.5 text-3xl sm:text-4xl font-bold text-white tabular-nums mt-0.5">
              <span>{formatEuro(finalMonthly)}</span>
              <span className="text-xs text-slate-300 font-normal">/ mj.</span>
            </div>
            <span className="text-xs text-slate-200 tabular-nums block mt-1">
              Godišnja premija: <strong>{formatEuro(finalAnnual)}</strong>
            </span>
          </div>
        </div>

        {/* Dynamic Reactive Sliders & Endorsement Toggles */}
        <div className="py-6 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-700">Franšiza (vlastito sudjelovanje u šteti):</span>
              <span className="tabular-nums text-[#0F2942] font-bold">
                {deductible === 0 ? 'Bez franšize (0 €)' : `${deductible} €`}
              </span>
            </div>

            {/* Deductible Segmented Switcher */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { val: 0 as const, label: '0 € (Bez franšize)', desc: '100% pokriveno' },
                { val: 150 as const, label: '150 € franšiza', desc: 'Popust ~12%' },
                { val: 300 as const, label: '300 € franšiza', desc: 'Popust ~24%' },
              ].map((item) => (
                <button
                  key={item.val}
                  type="button"
                  onClick={() => setDeductible(item.val)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    deductible === item.val
                      ? 'bg-[#0F2942] border-[#0F2942] text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <p className="font-bold text-xs tabular-nums">{item.label}</p>
                  <p
                    className={`text-[11px] mt-0.5 ${
                      deductible === item.val ? 'text-slate-200' : 'text-slate-500'
                    }`}
                  >
                    {item.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Endorsement Toggles */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-semibold text-slate-700 block">
              Dodatna pokrića (uključite prema potrebi):
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setGlassBreakage(!glassBreakage)}
                className={`p-3 rounded-xl border flex items-center justify-between text-left transition-all ${
                  glassBreakage
                    ? 'bg-[#0F2942]/5 border-[#0F2942] text-slate-900'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <div>
                  <p className="text-xs font-bold">Lom stakala</p>
                  <p className="text-[11px] tabular-nums text-[#0F2942] font-medium">+3,75 €/mj.</p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                    glassBreakage
                      ? 'bg-[#0F2942] border-[#0F2942] text-white'
                      : 'border-slate-300'
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
                    ? 'bg-[#0F2942]/5 border-[#0F2942] text-slate-900'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <div>
                  <p className="text-xs font-bold">Asistencija 24/7</p>
                  <p className="text-[11px] tabular-nums text-[#0F2942] font-medium">+2,08 €/mj.</p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                    roadAssistance
                      ? 'bg-[#0F2942] border-[#0F2942] text-white'
                      : 'border-slate-300'
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
                    ? 'bg-[#0F2942]/5 border-[#0F2942] text-slate-900'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <div>
                  <p className="text-xs font-bold">Zaštita bonusa</p>
                  <p className="text-[11px] tabular-nums text-[#0F2942] font-medium">+1,50 €/mj.</p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                    bonusProtection
                      ? 'bg-[#0F2942] border-[#0F2942] text-white'
                      : 'border-slate-300'
                  }`}
                >
                  {bonusProtection && <Check className="w-3.5 h-3.5" />}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Dual Conversion Buttons */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Button
            variant="primary"
            size="lg"
            onClick={() => {
              setCheckoutComplete(false);
              setCheckoutError(null);
              setIsCheckoutModalOpen(true);
            }}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="flex-1 font-semibold"
          >
            Zatražite policu prema izračunu
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => setIsCallbackModalOpen(true)}
            leftIcon={<PhoneCall className="w-4 h-4 text-[#0F2942]" />}
            className="text-slate-700 border-slate-300 hover:bg-slate-50 font-semibold text-xs sm:text-sm"
          >
            Zatražite povratni poziv
          </Button>
        </div>
      </Card>

      {/* Multi-Carrier Live Price Comparison Matrix */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="font-bold text-sm text-slate-900">Informativna usporedba osiguratelja</h4>
          <span className="text-xs text-slate-500">Usporedba istih pokrića &bull; Bez agencijske naknade</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {CARRIER_PARTNERS.slice(0, 4).map((carrier, idx) => {
            const carrierPremium = parseFloat((finalAnnual * (1 + (idx - 1) * 0.04)).toFixed(2));
            const isBestRate = idx === 0;

            return (
              <Card key={carrier.id} className="p-4 border border-slate-200 hover:border-[#0F2942]/40 bg-white flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between pb-2 border-b border-slate-100">
                    <div>
                      <h5 className="font-bold text-sm text-slate-900">{carrier.shortName}</h5>
                      <span className="text-[11px] text-slate-500">
                        Partnersko društvo
                      </span>
                    </div>
                    {isBestRate && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-semibold">
                        Najpovoljnije
                      </span>
                    )}
                  </div>

                  <div className="py-3 tabular-nums">
                    <span className="text-[11px] text-slate-500 block">Okvirna godišnja premija</span>
                    <span className="text-xl font-bold text-slate-900">
                      {formatEuro(carrierPremium)}
                    </span>
                    <span className="text-xs text-slate-500 block">
                      ili {formatEuro(carrierPremium / 12)} / mj.
                    </span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCheckoutComplete(false);
                    setCheckoutError(null);
                    setIsCheckoutModalOpen(true);
                  }}
                  className="w-full text-xs font-semibold"
                >
                  Odaberi {carrier.shortName}
                </Button>
              </Card>
            );
          })}
        </div>
      </div>

      {/* MODAL 1: Callback Request */}
      {isCallbackModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 text-left space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0F2942]/5 text-[#0F2942] flex items-center justify-center shrink-0">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">Povratni poziv licenciranog zastupnika</h4>
                  <p className="text-xs text-slate-500">Javljamo se u najkraćem roku radnim danom &bull; Bez obveze</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCallbackModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 text-lg font-bold"
                aria-label="Zatvori"
              >
                ✕
              </button>
            </div>

            {callbackSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h5 className="font-bold text-slate-900 text-lg">Zahtjev je zaprimljen</h5>
                <p className="text-xs text-slate-600 max-w-xs mx-auto">
                  Naš licencirani zastupnik kontaktirat će vas na broj <strong>{callbackPhone}</strong> unutar jednog radnog dana.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCallbackSubmit} className="space-y-3 pt-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 tabular-nums">
                  Odabrani proizvod: <strong>{productName}</strong> ({formatEuro(finalMonthly)}/mj.)
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Ime i prezime *</label>
                  <input
                    type="text"
                    required
                    placeholder="npr. Ivan Horvat"
                    value={callbackName}
                    onChange={(e) => setCallbackName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-[#0F2942] min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Broj mobitela *</label>
                  <input
                    type="tel"
                    required
                    placeholder="npr. 091 234 5678"
                    value={callbackPhone}
                    onChange={(e) => setCallbackPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-[#0F2942] min-h-[44px]"
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
                    variant="primary"
                    size="sm"
                    type="submit"
                    disabled={isSubmittingCallback}
                    className="w-2/3 font-semibold"
                  >
                    {isSubmittingCallback ? 'Slanje...' : 'Pošalji zahtjev za poziv'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: Offer & Policy Request Checkout */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 text-left space-y-4 my-auto">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-lg">Zahtjev za izradu police</h4>
                <p className="text-xs text-slate-500 tabular-nums">
                  Okvirni iznos: <strong>{formatEuro(finalAnnual)}</strong> godišnje (ili 12x {formatEuro(finalMonthly)})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCheckoutModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 font-bold text-lg"
                aria-label="Zatvori"
              >
                ✕
              </button>
            </div>

            {checkoutComplete ? (
              <div className="py-6 text-center space-y-4">
                <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h5 className="font-bold text-slate-900 text-lg">Zahtjev je uspješno zaprimljen</h5>
                <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                  Ovlašteni zastupnik pripremit će službenu ponudu, IPID obrazac i uplatnicu prema vašem izračunu te ih dostaviti na vašu e-mail adresu.
                </p>
                {savedReference && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <span className="text-slate-500 block">Referentni broj zahtjeva:</span>
                    <span className="font-mono font-bold text-[#0F2942]">{savedReference}</span>
                  </div>
                )}
                <div className="pt-2">
                  <Button variant="primary" onClick={() => setIsCheckoutModalOpen(false)}>
                    U redu, zatvori
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                {checkoutError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                    {checkoutError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Ime i prezime *</label>
                    <input
                      type="text"
                      required
                      placeholder="npr. Ana Horvat"
                      value={checkoutName}
                      onChange={(e) => setCheckoutName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-[#0F2942]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Telefon *</label>
                    <input
                      type="tel"
                      required
                      placeholder="npr. 091 234 5678"
                      value={checkoutPhone}
                      onChange={(e) => setCheckoutPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-[#0F2942]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">E-mail adresa za ponudu i IPID *</label>
                  <input
                    type="email"
                    required
                    placeholder="ana.horvat@domena.hr"
                    value={checkoutEmail}
                    onChange={(e) => setCheckoutEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-[#0F2942]"
                  />
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-700 block">Preferirani način plaćanja:</span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setSelectedPaymentRail('card')}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between ${
                        selectedPaymentRail === 'card'
                          ? 'border-[#0F2942] bg-[#0F2942]/5 text-[#0F2942] font-semibold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span>Kartice (1–12 rata)</span>
                      <CreditCard className="w-4 h-4 text-[#0F2942]" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedPaymentRail('hub3a')}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between ${
                        selectedPaymentRail === 'hub3a'
                          ? 'border-[#0F2942] bg-[#0F2942]/5 text-[#0F2942] font-semibold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span>2D barkod (HUB 3A)</span>
                      <span className="text-[11px] font-medium text-slate-500">m-Banking</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedPaymentRail('keks')}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between ${
                        selectedPaymentRail === 'keks'
                          ? 'border-[#0F2942] bg-[#0F2942]/5 text-[#0F2942] font-semibold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span>KEKS Pay</span>
                      <span className="text-[11px] font-medium text-slate-500">Mobilno</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedPaymentRail('sepa')}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between ${
                        selectedPaymentRail === 'sepa'
                          ? 'border-[#0F2942] bg-[#0F2942]/5 text-[#0F2942] font-semibold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span>Virman / SEPA</span>
                      <span className="text-[11px] font-medium text-slate-500">IBAN nalog</span>
                    </button>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1 text-slate-600">
                  <p className="flex items-center gap-1.5 text-slate-900 font-semibold">
                    <ShieldCheck className="w-4 h-4 text-[#0F2942]" />
                    Obrada prema IDD i GDPR standardima
                  </p>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Prije konačnog sklapanja ugovora dobit ćete standardizirani IPID dokument i konačni izračun police na potvrdu.
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsCheckoutModalOpen(false)}
                    className="w-1/3"
                  >
                    Odustani
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={isSubmittingCheckout}
                    className="w-2/3 font-semibold text-sm"
                  >
                    {isSubmittingCheckout ? 'Slanje zahtjeva...' : `Pošalji zahtjev (${formatEuro(finalAnnual)})`}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
