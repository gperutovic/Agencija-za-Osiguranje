import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Car,
  HeartPulse,
  Home,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  Phone,
  Mail,
  User,
  X,
} from 'lucide-react';
import { calculateDopunskoHealth } from '../../lib/calculations/dopunsko-health';
import { calculateAutoInsurance } from '../../lib/calculations/auto-insurance';
import { formatEuro } from '../../lib/calculations';

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
  | 'imovina_potres'
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
  const [bonus, setBonus] = useState<string>('B10');
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

  useEffect(() => {
    if (isOpen) {
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

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF0055] to-rose-600 flex items-center justify-center text-white shadow-sm font-black">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Agent Savjetnik</h3>
                <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  ONLINE
                </span>
              </div>
              <p className="text-xs text-slate-500">Agencija Život • Licencirani HANFA savjetnik</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
            aria-label="Zatvori savjetnika"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Dialog Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          <AnimatePresence mode="wait">
            {/* STEP 1: Topic Selection */}
            {step === 'topic' && (
              <motion.div
                key="step-topic"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-500">
                    Korak 1 od 3
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 mt-1">
                    Dobar dan! Koje osiguranje danas uspoređujemo?
                  </h2>
                  <p className="text-sm text-slate-600 mt-1">
                    Pronaći ćemo za Vas najpovoljniju tarifu među 10 hrvatskih osiguratelja.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => handleTopicSelect('auto')}
                    className="p-5 rounded-2xl border-2 border-slate-200 hover:border-[#FF0055] hover:bg-rose-50/20 text-left transition-all group flex flex-col justify-between min-h-[140px]"
                  >
                    <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Car className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 group-hover:text-[#FF0055]">Auto & Kasko</h4>
                      <p className="text-xs text-slate-500 mt-0.5">50% bonusa & Toyota VIP</p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleTopicSelect('dopunsko')}
                    className="p-5 rounded-2xl border-2 border-slate-200 hover:border-[#FF0055] hover:bg-rose-50/20 text-left transition-all group flex flex-col justify-between min-h-[140px]"
                  >
                    <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <HeartPulse className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 group-hover:text-[#FF0055]">Dopunsko 2026</h4>
                      <p className="text-xs text-slate-500 mt-0.5">HZZO 15 € vs Privatno od 6,50 €</p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleTopicSelect('imovina')}
                    className="p-5 rounded-2xl border-2 border-slate-200 hover:border-[#FF0055] hover:bg-rose-50/20 text-left transition-all group flex flex-col justify-between min-h-[140px]"
                  >
                    <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Home className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 group-hover:text-[#FF0055]">Imovina & Dom</h4>
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
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-500">
                    Auto Osiguranje • Korak 2 od 3
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 mt-1">
                    Kolika je snaga motora vašeg vozila?
                  </h2>
                  <p className="text-sm text-slate-600 mt-1">
                    Snagu u kW možete pronaći u prometnoj dozvoli pod rubrikom P.2.
                  </p>
                </div>

                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-4">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl font-black text-blue-600">{kw}</span>
                    <span className="text-lg font-bold text-slate-600">kW</span>
                    <span className="text-sm text-slate-400 font-mono">({Math.round(kw * 1.36)} KS)</span>
                  </div>

                  <input
                    type="range"
                    min={30}
                    max={220}
                    value={kw}
                    onChange={(e) => setKw(parseInt(e.target.value, 10))}
                    className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />

                  <div className="flex justify-between text-xs text-slate-500 font-mono">
                    <span>45 kW (Gradski)</span>
                    <span>85 kW (Obiteljski)</span>
                    <span>150+ kW (Premium)</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4">
                  <button
                    onClick={() => setStep('topic')}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-semibold flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" /> Natrag
                  </button>
                  <button
                    onClick={() => setStep('auto_bonus')}
                    className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md flex items-center gap-2"
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
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-500">
                    Auto Osiguranje • Korak 3 od 3
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 mt-1">
                    Imate li stečeni bonus na polici?
                  </h2>
                  <p className="text-sm text-slate-600 mt-1">
                    Ako niste imali šteta, prenosimo vaš maksimalni bonus od 50%.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      setBonus('B10');
                      setStep('contact');
                    }}
                    className={`p-4 rounded-xl border-2 text-left transition-all min-h-[56px] flex items-center justify-between ${
                      bonus === 'B10' ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <strong className="block text-slate-900 text-sm">Da, imam 50% bonusa (B10)</strong>
                      <span className="text-xs text-slate-500">Maksimalni zakonski popust</span>
                    </div>
                    <Check className="w-5 h-5 text-emerald-600" />
                  </button>

                  <button
                    onClick={() => {
                      setBonus('B0');
                      setStep('contact');
                    }}
                    className="p-4 rounded-xl border-2 border-slate-200 hover:bg-slate-50 text-left transition-all min-h-[56px] flex items-center justify-between"
                  >
                    <div>
                      <strong className="block text-slate-900 text-sm">Prvo vozilo / Početnik (B0)</strong>
                      <span className="text-xs text-slate-500">Dodjeljujemo početničke pogodnosti</span>
                    </div>
                  </button>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="has-kasko-check"
                    checked={hasKasko}
                    onChange={(e) => setHasKasko(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <label htmlFor="has-kasko-check" className="text-xs font-semibold text-slate-800 cursor-pointer">
                    Želim u ponudu uključiti i ponudu za kasko (ili kasko stakla)
                  </label>
                </div>

                <div className="flex justify-between items-center pt-4">
                  <button
                    onClick={() => setStep('auto_kw')}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-semibold flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" /> Natrag
                  </button>
                  <button
                    onClick={() => setStep('contact')}
                    className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md flex items-center gap-2"
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
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600">
                    Dopunsko 2026 • Korak 2 od 3
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 mt-1">
                    Koliko imate godina?
                  </h2>
                  <p className="text-sm text-slate-600 mt-1">
                    HZZO polica je poskupjela na 15,00 €/mj. za sve, a privatne police ovise o dobi.
                  </p>
                </div>

                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-4">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl font-black text-emerald-600">{age}</span>
                    <span className="text-lg font-bold text-slate-600">godina</span>
                  </div>

                  <input
                    type="range"
                    min={18}
                    max={80}
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value, 10))}
                    className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />

                  <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-700">
                    {age <= 50 ? (
                      <span className="text-emerald-700 font-bold">
                        🎉 U vašoj dobi privatna polica kreće od samo{' '}
                        {age <= 30 ? '6,50 €/mj.' : age <= 40 ? '7,50 €/mj.' : '9,50 €/mj.'} (ušteda do 102 €/god.)!
                      </span>
                    ) : (
                      <span>HZZO solidarna polica nudi fiksnu cijenu, a privatna pruža pokriće B-liste lijekova.</span>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4">
                  <button
                    onClick={() => setStep('topic')}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-semibold flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" /> Natrag
                  </button>
                  <button
                    onClick={() => setStep('contact')}
                    className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md flex items-center gap-2"
                  >
                    Nastavi na kontakt <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* IMOVINA STEP: Type & Potres */}
            {step === 'imovina_type' && (
              <motion.div
                key="step-imovina-type"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-600">
                    Imovina & Dom • Korak 2 od 3
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 mt-1">
                    Kakvu nekretninu osiguravate?
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPropertyType('stan')}
                    className={`p-4 rounded-xl border-2 text-left min-h-[56px] transition-all ${
                      propertyType === 'stan'
                        ? 'border-amber-500 bg-amber-50/50'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <strong className="block text-slate-900 text-sm">Stan u zgradi</strong>
                    <span className="text-xs text-slate-500">Zidovi, stvari kućanstva, izljev vode</span>
                  </button>

                  <button
                    onClick={() => setPropertyType('kuca')}
                    className={`p-4 rounded-xl border-2 text-left min-h-[56px] transition-all ${
                      propertyType === 'kuca'
                        ? 'border-amber-500 bg-amber-50/50'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <strong className="block text-slate-900 text-sm">Obiteljska kuća</strong>
                    <span className="text-xs text-slate-500">Krov, fasada, instalacije, okućnica</span>
                  </button>
                </div>

                <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeEarthquake}
                    onChange={(e) => setIncludeEarthquake(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600"
                  />
                  <div>
                    <strong className="text-xs text-slate-900 block">Uključi rizik od potresa</strong>
                    <span className="text-[11px] text-slate-500">Građevinska vrijednost na novi standard</span>
                  </div>
                </label>

                <div className="flex justify-between items-center pt-4">
                  <button
                    onClick={() => setStep('topic')}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-semibold flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" /> Natrag
                  </button>
                  <button
                    onClick={() => setStep('contact')}
                    className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md flex items-center gap-2"
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
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF0055]">
                    Završni korak
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 mt-1">
                    Kome šaljemo ponudu s obračunatim popustom?
                  </h2>
                  <p className="text-sm text-slate-600 mt-1">
                    Vaša ponuda je pripremljena i čeka autorizaciju našeg brokera bez ikakve obveze.
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Ime i prezime
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ivan Horvat"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#FF0055]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Broj mobitela (WhatsApp / Poziv)
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="091 234 5678"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#FF0055]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      E-mail adresa za dostavu police
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ivan.horvat@email.hr"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#FF0055]"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4">
                  <button
                    type="button"
                    onClick={() => setStep('topic')}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-semibold flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" /> Promijeni unos
                  </button>
                  <button
                    type="submit"
                    className="px-7 py-3.5 rounded-xl bg-[#FF0055] hover:bg-[#d90048] text-white font-bold text-sm shadow-lg shadow-[#FF0055]/30 flex items-center gap-2 transition-transform hover:scale-105"
                  >
                    Pošalji besplatnu ponudu <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.form>
            )}

            {/* SUCCESS STEP */}
            {step === 'success' && (
              <motion.div
                key="step-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 space-y-4"
              >
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                  <ShieldCheck className="w-9 h-9" />
                </div>
                <h2 className="text-2xl font-black text-slate-900">
                  Hvala Vam, {name || 'poštovani klijentu'}!
                </h2>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Vaš zahtjev je zaprimljen u sustavu Agencije Život. Licencirani zastupnik priprema
                  usporednu tablicu Generali, Allianz i Croatia osiguranja i poslat će je na{' '}
                  <strong>{email || 'vaš e-mail'}</strong> u roku od 15 minuta.
                </p>
                <div className="pt-4">
                  <button
                    onClick={onClose}
                    className="px-8 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow"
                  >
                    Završi i zatvori
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
