import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ArrowRight,
  ArrowLeft,
  Check,
  Car,
  HeartPulse,
  Home,
  Phone,
  Mail,
  User,
  ShieldCheck,
} from 'lucide-react';
import { calculateDopunskoHealth } from '../../lib/calculations/dopunsko-health';
import { calculateAutoInsurance } from '../../lib/calculations/auto-insurance';
import { formatEuro } from '../../lib/calculations';
import { firestoreService } from '../../api/firestoreService';
import { leadService } from '../../services/firebase';

interface ConversationalWizardProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopic?: 'auto' | 'dopunsko' | 'imovina';
}

type StepId =
  | 'topic'
  | 'auto_kw'
  | 'auto_bonus'
  | 'dopunsko_age'
  | 'imovina_type'
  | 'contact'
  | 'success';

export const ConversationalWizard: React.FC<ConversationalWizardProps> = ({
  isOpen,
  onClose,
  initialTopic = 'auto',
}) => {
  const [topic, setTopic] = useState<'auto' | 'dopunsko' | 'imovina'>(initialTopic);
  const [step, setStep] = useState<StepId>('topic');

  // Auto state
  const [kw, setKw] = useState<number>(85);
  const [bonus, setBonus] = useState<'B10' | 'B0'>('B10');
  const [hasKasko, setHasKasko] = useState<boolean>(false);

  // Dopunsko state
  const [age, setAge] = useState<number>(30);

  // Imovina state
  const [propertyType, setPropertyType] = useState<'stan' | 'kuca'>('stan');
  const [includeEarthquake, setIncludeEarthquake] = useState<boolean>(true);

  // Contact state
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [quoteRef, setQuoteRef] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStep('topic');
      setQuoteRef(null);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTopicSelect = (selected: 'auto' | 'dopunsko' | 'imovina') => {
    setTopic(selected);
    if (selected === 'auto') setStep('auto_kw');
    else if (selected === 'dopunsko') setStep('dopunsko_age');
    else if (selected === 'imovina') setStep('imovina_type');
  };

  const computeEstimatedAnnual = () => {
    if (topic === 'auto') {
      const calc = calculateAutoInsurance({
        kw,
        zone: 'zona_1',
        bonusClass: bonus,
        includeKasko: hasKasko,
        vehicleValueEuro: 22000,
        kaskoDeductible: 150,
        addons: {
          glassBreakage: true,
          bonusProtection: true,
          roadAssistance: true,
          passengerInsurance: false,
        },
      });
      return calc.totalAnnual;
    }
    if (topic === 'dopunsko') {
      return calculateDopunskoHealth({ age, includeBList: true }).privateAnnual;
    }
    return propertyType === 'stan' ? (includeEarthquake ? 92 : 68) : includeEarthquake ? 135 : 98;
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !email.trim()) return;

    setIsSubmitting(true);
    const annualEstimate = computeEstimatedAnnual();
    const mappedType = topic === 'dopunsko' ? 'health' : topic === 'imovina' ? 'property' : 'auto';

    try {
      const savedQuote = await firestoreService.createQuote({
        customer: {
          fullName: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
        },
        type: mappedType,
        inputs:
          topic === 'auto'
            ? { kw, bonus, hasKasko }
            : topic === 'dopunsko'
            ? { age }
            : { propertyType, includeEarthquake },
        calculatedEstimate: {
          annualPremium: annualEstimate,
          monthlyPremium: Number((annualEstimate / 12).toFixed(2)),
          currency: 'EUR',
        },
        status: 'new',
      });

      await leadService.saveLead({
        oib: '',
        name: name.trim(),
        fullName: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        productType: mappedType,
        data:
          topic === 'auto'
            ? { kw, bonus, hasKasko }
            : topic === 'dopunsko'
            ? { age }
            : { propertyType, includeEarthquake },
        annualPremium: annualEstimate,
        status: 'new',
        notes: `Vođeni upitnik (${topic})`,
      });

      setQuoteRef(savedQuote.id);
      setStep('success');
    } catch (err) {
      console.error(err);
      setStep('success');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Vođeni odabir osiguranja"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97 }}
        className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#0F2942] flex items-center justify-center text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Vođeni odabir osiguranja</h3>
              <p className="text-xs text-slate-500">Agencija Život • Ovlašteni zastupnik u osiguranju</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Zatvori prozor"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Wizard Dialog Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          <AnimatePresence mode="wait">
            {/* STEP 1: Topic Selection */}
            {step === 'topic' && (
              <motion.div
                key="step-topic"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                className="space-y-6"
              >
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Korak 1 od 3
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900 mt-1">
                    Koju vrstu osiguranja želite ugovoriti?
                  </h2>
                  <p className="text-sm text-slate-600 mt-1">
                    Odaberite kategoriju kako bismo pripremili informativni izračun i usporedbu ponuda partnerskih osiguratelja.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => handleTopicSelect('auto')}
                    className="p-5 rounded-xl border border-slate-200 hover:border-[#0F2942] hover:bg-slate-50 text-left transition-colors group flex flex-col justify-between min-h-[132px] cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-lg bg-slate-100 group-hover:bg-[#0F2942] text-[#0F2942] group-hover:text-white flex items-center justify-center transition-colors">
                      <Car className="w-5 h-5" />
                    </div>
                    <div className="mt-3">
                      <h4 className="font-bold text-slate-900 text-sm">Auto i kasko</h4>
                      <p className="text-xs text-slate-500 mt-0.5">AO, bonus 50% i Toyota VIP Kasko</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTopicSelect('dopunsko')}
                    className="p-5 rounded-xl border border-slate-200 hover:border-[#0F2942] hover:bg-slate-50 text-left transition-colors group flex flex-col justify-between min-h-[132px] cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-lg bg-slate-100 group-hover:bg-[#0F2942] text-[#0F2942] group-hover:text-white flex items-center justify-center transition-colors">
                      <HeartPulse className="w-5 h-5" />
                    </div>
                    <div className="mt-3">
                      <h4 className="font-bold text-slate-900 text-sm">Dopunsko zdravstveno</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Usporedba s HZZO policom (15,00 €)</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTopicSelect('imovina')}
                    className="p-5 rounded-xl border border-slate-200 hover:border-[#0F2942] hover:bg-slate-50 text-left transition-colors group flex flex-col justify-between min-h-[132px] cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-lg bg-slate-100 group-hover:bg-[#0F2942] text-[#0F2942] group-hover:text-white flex items-center justify-center transition-colors">
                      <Home className="w-5 h-5" />
                    </div>
                    <div className="mt-3">
                      <h4 className="font-bold text-slate-900 text-sm">Imovina i dom</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Stan, kuća i zaštita od potresa</p>
                    </div>
                  </button>
                </div>
              </motion.div>
            )}

            {/* AUTO STEP: kW selection */}
            {step === 'auto_kw' && (
              <motion.div
                key="step-auto-kw"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                className="space-y-6"
              >
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Auto osiguranje • Korak 2 od 3
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900 mt-1">
                    Kolika je snaga motora vašeg vozila?
                  </h2>
                  <p className="text-sm text-slate-600 mt-1">
                    Podatak u kW nalazi se u prometnoj dozvoli pod rubrikom P.2.
                  </p>
                </div>

                <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-4">
                  <div className="flex items-baseline justify-center gap-2 tabular-nums">
                    <span className="text-4xl font-bold text-[#0F2942]">{kw}</span>
                    <span className="text-base font-semibold text-slate-600">kW</span>
                    <span className="text-sm text-slate-400">({Math.round(kw * 1.36)} KS)</span>
                  </div>

                  <input
                    type="range"
                    min={30}
                    max={220}
                    value={kw}
                    onChange={(e) => setKw(parseInt(e.target.value, 10))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0F2942]"
                  />

                  <div className="flex justify-between text-xs text-slate-500 tabular-nums">
                    <span>45 kW (Gradski)</span>
                    <span>85 kW (Obiteljski)</span>
                    <span>150+ kW (Viša klasa)</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('topic')}
                    className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-medium flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" /> Natrag
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep('auto_bonus')}
                    className="px-5 py-2.5 rounded-lg bg-[#0F2942] hover:bg-[#163859] text-white font-semibold text-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    Nastavi <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* AUTO STEP: Bonus selection */}
            {step === 'auto_bonus' && (
              <motion.div
                key="step-auto-bonus"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                className="space-y-6"
              >
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Auto osiguranje • Korak 3 od 3
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900 mt-1">
                    Imate li stečeni premijski bonus?
                  </h2>
                  <p className="text-sm text-slate-600 mt-1">
                    Stečeni bonus s prethodne police prenosimo u punom opsegu (do 50%).
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setBonus('B10');
                      setStep('contact');
                    }}
                    className={`p-4 rounded-xl border text-left transition-colors min-h-[60px] flex items-center justify-between cursor-pointer ${
                      bonus === 'B10' ? 'border-[#0F2942] bg-slate-50' : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <strong className="block text-slate-900 text-sm">Da, imam 50% bonusa (B10)</strong>
                      <span className="text-xs text-slate-500">Maksimalni premijski popust</span>
                    </div>
                    <Check className="w-4 h-4 text-[#0F2942]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setBonus('B0');
                      setStep('contact');
                    }}
                    className="p-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-left transition-colors min-h-[60px] flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <strong className="block text-slate-900 text-sm">Prvo vozilo / Početni razred (B0)</strong>
                      <span className="text-xs text-slate-500">Standardna prijava bez bonusa</span>
                    </div>
                  </button>
                </div>

                <label className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasKasko}
                    onChange={(e) => setHasKasko(e.target.checked)}
                    className="w-4 h-4 rounded accent-[#0F2942]"
                  />
                  <span className="text-xs font-medium text-slate-800">
                    Uključi u informativnu ponudu i izračun za kasko osiguranje
                  </span>
                </label>

                <div className="flex justify-between items-center pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('auto_kw')}
                    className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-medium flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" /> Natrag
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep('contact')}
                    className="px-5 py-2.5 rounded-lg bg-[#0F2942] hover:bg-[#163859] text-white font-semibold text-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    Nastavi na kontakt <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* DOPUNSKO STEP: Age */}
            {step === 'dopunsko_age' && (
              <motion.div
                key="step-dopunsko-age"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                className="space-y-6"
              >
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Dopunsko zdravstveno • Korak 2 od 3
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900 mt-1">
                    Vaša dob (navršene godine):
                  </h2>
                  <p className="text-sm text-slate-600 mt-1">
                    HZZO polica od veljače 2026. iznosi 15,00 € mjesečno za sve osiguranike, dok se premija privatnih polica određuje prema dobnoj skupini.
                  </p>
                </div>

                <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-4">
                  <div className="flex items-baseline justify-center gap-2 tabular-nums">
                    <span className="text-4xl font-bold text-[#0F2942]">{age}</span>
                    <span className="text-base font-semibold text-slate-600">godina</span>
                  </div>

                  <input
                    type="range"
                    min={18}
                    max={80}
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value, 10))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0F2942]"
                  />

                  <div className="p-3 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 tabular-nums">
                    {age <= 50 ? (
                      <span className="text-emerald-700 font-semibold">
                        Informativna ponuda privatnih osiguratelja u vašoj dobi kreće od{' '}
                        {age <= 30 ? '6,50 €/mj.' : age <= 40 ? '7,50 €/mj.' : '9,50 €/mj.'} (godišnja ušteda u odnosu na HZZO).
                      </span>
                    ) : (
                      <span>Usporedit ćemo vam HZZO tarifu s privatnim policama koje uključuju B-listu lijekova.</span>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('topic')}
                    className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-medium flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" /> Natrag
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep('contact')}
                    className="px-5 py-2.5 rounded-lg bg-[#0F2942] hover:bg-[#163859] text-white font-semibold text-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    Nastavi na kontakt <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* IMOVINA STEP */}
            {step === 'imovina_type' && (
              <motion.div
                key="step-imovina-type"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                className="space-y-6"
              >
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Osiguranje imovine • Korak 2 od 3
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900 mt-1">
                    Koju vrstu nekretnine osiguravate?
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPropertyType('stan')}
                    className={`p-4 rounded-xl border text-left min-h-[60px] transition-colors cursor-pointer ${
                      propertyType === 'stan'
                        ? 'border-[#0F2942] bg-slate-50'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <strong className="block text-slate-900 text-sm">Stan u zgradi</strong>
                    <span className="text-xs text-slate-500">Građevinski dio, stvari, izljev vode</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPropertyType('kuca')}
                    className={`p-4 rounded-xl border text-left min-h-[60px] transition-colors cursor-pointer ${
                      propertyType === 'kuca'
                        ? 'border-[#0F2942] bg-slate-50'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <strong className="block text-slate-900 text-sm">Obiteljska kuća</strong>
                    <span className="text-xs text-slate-500">Objekt, krovište, instalacije, oprema</span>
                  </button>
                </div>

                <label className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeEarthquake}
                    onChange={(e) => setIncludeEarthquake(e.target.checked)}
                    className="w-4 h-4 rounded accent-[#0F2942]"
                  />
                  <div>
                    <strong className="text-xs text-slate-900 block">Uključi pokriće od potresa</strong>
                    <span className="text-xs text-slate-500">Ugovaranje na novu građevinsku vrijednost objekta</span>
                  </div>
                </label>

                <div className="flex justify-between items-center pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('topic')}
                    className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-medium flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" /> Natrag
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep('contact')}
                    className="px-5 py-2.5 rounded-lg bg-[#0F2942] hover:bg-[#163859] text-white font-semibold text-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    Nastavi na kontakt <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* CONTACT STEP */}
            {step === 'contact' && (
              <motion.form
                key="step-contact"
                onSubmit={handleFinalSubmit}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                className="space-y-5"
              >
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Završni korak • Orijentacijski godišnji iznos: {formatEuro(computeEstimatedAnnual())}
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900 mt-1">
                    Kontakt podaci za slanje ponude
                  </h2>
                  <p className="text-sm text-slate-600 mt-1">
                    Naš ovlašteni zastupnik pripremit će službenu informativnu ponudu i IPID obrazac bez obveze ugovaranja.
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Ime i prezime
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ivan Horvat"
                        className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-[#0F2942]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Broj mobitela
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="091 234 5678"
                        className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-[#0F2942] tabular-nums"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      E-mail adresa za dostavu ponude
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ivan.horvat@email.hr"
                        className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-[#0F2942]"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('topic')}
                    className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-medium flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" /> Početak
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-lg bg-[#0F2942] hover:bg-[#163859] text-white font-semibold text-sm flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    <span>{isSubmitting ? 'Slanje...' : 'Pošalji upit za ponudu'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.form>
            )}

            {/* SUCCESS STEP */}
            {step === 'success' && (
              <motion.div
                key="step-success"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 space-y-4"
              >
                <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto">
                  <Check className="w-7 h-7" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  Hvala Vam, {name || 'poštovani klijentu'}
                </h2>
                <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Vaš upit {quoteRef ? `(referenca ${quoteRef})` : ''} je zaprimljen u sustavu Agencije Život.
                  Ovlašteni zastupnik priprema usporednu ponudu partnerskih osiguratelja i dostavit će je na{' '}
                  <strong>{email || 'vaš e-mail'}</strong>.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-lg bg-[#0F2942] hover:bg-[#163859] text-white font-semibold text-sm cursor-pointer"
                  >
                    Zatvori prozor
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default ConversationalWizard;
