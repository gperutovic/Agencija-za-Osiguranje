import React, { useState } from 'react';
import { Phone, MessageCircle, Clock, X, CheckCircle2, Send, ShieldCheck } from 'lucide-react';
import { firestoreService } from '../../api/firestoreService';

export const StickyMobileFAB: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCallbackModalOpen, setIsCallbackModalOpen] = useState(false);
  const [callbackName, setCallbackName] = useState('');
  const [callbackPhone, setCallbackPhone] = useState('');
  const [callbackTopic, setCallbackTopic] = useState('Auto osiguranje (AO i kasko)');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleCallbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!callbackName.trim() || !callbackPhone.trim()) return;

    setIsSubmitting(true);
    try {
      await firestoreService.createAppointment({
        customerName: callbackName,
        customerEmail: 'telefonski-upit@agencija-zivot.hr',
        customerPhone: callbackPhone,
        type: 'phone',
        dateTime: new Date().toISOString(),
        topic: `HITNI POZIV (15 min): ${callbackTopic}`,
        status: 'scheduled',
      });
      setSubmittedSuccess(true);
      setTimeout(() => {
        setSubmittedSuccess(false);
        setIsCallbackModalOpen(false);
        setCallbackName('');
        setCallbackPhone('');
      }, 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Sticky Bottom Action Bar for Mobile Viewports */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-3 bg-slate-950/90 border-t border-slate-800 backdrop-blur-xl md:hidden shadow-2xl flex items-center gap-2">
        <a
          href="tel:+38514800120"
          className="flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 active:scale-95 transition-all"
        >
          <Phone className="w-4 h-4 text-emerald-400" />
          <span>+385 1 4800 120</span>
        </a>

        <button
          onClick={() => setIsCallbackModalOpen(true)}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-900/30 active:scale-95 transition-all"
        >
          <Clock className="w-4 h-4 text-amber-300" />
          <span>Nazovite me (15m)</span>
        </button>

        <a
          href="https://wa.me/38514800120?text=Po%C5%A1tovani%2C%20zanimaju%20me%20ponude%20za%20osiguranje."
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95 transition-all shadow-lg shadow-emerald-900/30"
          aria-label="WhatsApp kontakt"
        >
          <MessageCircle className="w-5 h-5" />
        </a>
      </div>

      {/* Floating Action Badge for Desktop/Tablet */}
      <div className="hidden md:block fixed bottom-6 right-6 z-40">
        <div className="relative">
          {isOpen && (
            <div className="absolute bottom-16 right-0 w-72 p-4 bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl space-y-3 animate-in fade-in slide-in-from-bottom-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  <span>Brzi kontakt s agentom</span>
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-white text-xs"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <a
                href="tel:+38514800120"
                className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-medium border border-slate-700/50 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-white">Besplatni poziv</div>
                  <div className="text-[11px] text-slate-400">+385 1 4800 120</div>
                </div>
              </a>

              <a
                href="https://wa.me/38514800120?text=Po%C5%A1tovani%2C%20zanimaju%20me%20ponude%20za%20osiguranje."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-medium border border-slate-700/50 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-white">WhatsApp chat</div>
                  <div className="text-[11px] text-slate-400">Odgovor unutar par minuta</div>
                </div>
              </a>

              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsCallbackModalOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-900/30"
              >
                <Clock className="w-4 h-4 text-amber-300" />
                <span>Nazovite me u roku od 15 min</span>
              </button>
            </div>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-2xl shadow-blue-950/50 border border-white/20 transition-all hover:scale-105 active:scale-95"
            aria-label="Podrška agenata"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Agent online</span>
            <Phone className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>

      {/* 15-Minute Callback Modal Dialog */}
      {isCallbackModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-white space-y-6">
            <button
              onClick={() => setIsCallbackModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-[11px] font-bold uppercase">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Besplatni povratni poziv</span>
              </span>
              <h3 className="text-xl font-black text-white">
                Nazovite me u roku od 15 minuta
              </h3>
              <p className="text-xs text-slate-400">
                Ostavite svoj kontakt i licencirani HANFA zastupnik pripremit će izračune i javiti vam se u najkraćem roku.
              </p>
            </div>

            {submittedSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
                <h4 className="text-sm font-bold text-emerald-300">Zahtjev zaprimljen!</h4>
                <p className="text-xs text-slate-300">
                  Naš broker će vas kontaktirati na broj <span className="font-mono text-white font-semibold">{callbackPhone}</span> unutar sljedećih 15 minuta.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCallbackSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Vaše ime i prezime</label>
                  <input
                    type="text"
                    required
                    placeholder="npr. Ivan Horvat"
                    value={callbackName}
                    onChange={(e) => setCallbackName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Broj telefona (RH mobitel)</label>
                  <input
                    type="tel"
                    required
                    placeholder="+385 91 ..."
                    value={callbackPhone}
                    onChange={(e) => setCallbackPhone(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Područje osiguranja</label>
                  <select
                    value={callbackTopic}
                    onChange={(e) => setCallbackTopic(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option>Auto osiguranje (AO i kasko)</option>
                    <option>Osiguranje doma i potres</option>
                    <option>Dopunsko i dodatno zdravstveno</option>
                    <option>Životno osiguranje i štednja</option>
                    <option>Poslovno osiguranje tvrtke / obrta</option>
                  </select>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-900/40 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Slanje zahtjeva...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Potvrdi zahtjev za poziv</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};
