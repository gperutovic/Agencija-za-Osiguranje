import React, { useState } from 'react';
import { Phone, MessageCircle, Clock, X, CheckCircle2, Send, ShieldCheck } from 'lucide-react';
import { firestoreService } from '../../api/firestoreService';

export interface StickyMobileFABProps {
  onOpenQuote?: (category?: string) => void;
}

export const StickyMobileFAB: React.FC<StickyMobileFABProps> = () => {
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
        customerName: callbackName.trim(),
        customerEmail: 'telefonski-upit@agencija-zivot.hr',
        customerPhone: callbackPhone.trim(),
        type: 'phone',
        dateTime: new Date().toISOString(),
        topic: `POVRATNI POZIV: ${callbackTopic}`,
        status: 'scheduled',
      });
      setSubmittedSuccess(true);
      setTimeout(() => {
        setSubmittedSuccess(false);
        setIsCallbackModalOpen(false);
        setCallbackName('');
        setCallbackPhone('');
      }, 2800);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Sticky Bottom Action Bar for Mobile Viewports */}
      <div className="fixed bottom-0 left-0 right-0 z-40 px-3 py-2.5 bg-white/95 border-t border-slate-200 backdrop-blur-md md:hidden shadow-lg flex items-center gap-2">
        <a
          href="tel:+38514800120"
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-semibold border border-slate-200 transition-colors tabular-nums"
        >
          <Phone className="w-4 h-4 text-[#0F2942]" />
          <span>01 4800 120</span>
        </a>

        <button
          type="button"
          onClick={() => setIsCallbackModalOpen(true)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-[#0F2942] hover:bg-[#163859] text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
        >
          <Clock className="w-4 h-4 text-slate-200" />
          <span>Povratni poziv</span>
        </button>

        <a
          href="https://wa.me/38514800120?text=Po%C5%A1tovani%2C%20trebam%20savjet%20oko%20police%20osiguranja."
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white transition-colors"
          aria-label="WhatsApp kontakt"
        >
          <MessageCircle className="w-5 h-5" />
        </a>
      </div>

      {/* Floating Quick-Contact Trigger for Desktop/Tablet */}
      <div className="hidden md:block fixed bottom-6 right-6 z-40">
        <div className="relative">
          {isOpen && (
            <div className="absolute bottom-14 right-0 w-72 p-4 bg-white border border-slate-200 rounded-xl shadow-xl space-y-2.5">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                <span className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#0F2942]" />
                  <span>Izravni kontakt sa zastupnikom</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-slate-700 p-1 rounded transition-colors cursor-pointer"
                  aria-label="Zatvori kontakt izbornik"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <a
                href="tel:+38514800120"
                className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-900 text-xs border border-slate-200/80 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-[#0F2942]/10 text-[#0F2942] flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Telefonska linija</div>
                  <div className="text-[11px] text-slate-600 tabular-nums">01 4800 120 (Pon – Pet 08–18h)</div>
                </div>
              </a>

              <a
                href="https://wa.me/38514800120?text=Po%C5%A1tovani%2C%20trebam%20savjet%20oko%20police%20osiguranja."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-900 text-xs border border-slate-200/80 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">WhatsApp podrška</div>
                  <div className="text-[11px] text-slate-600">Izravan upit našem uredu</div>
                </div>
              </a>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setIsCallbackModalOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-[#0F2942] hover:bg-[#163859] text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                <Clock className="w-4 h-4" />
                <span>Zatražite povratni poziv</span>
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#0F2942] hover:bg-[#163859] text-white font-medium text-xs shadow-lg border border-slate-700/40 transition-colors cursor-pointer"
            aria-label="Kontakt s agencijom"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Trebate savjet?</span>
          </button>
        </div>
      </div>

      {/* Callback Modal Dialog */}
      {isCallbackModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Zahtjev za povratni poziv"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
        >
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-xl p-6 sm:p-7 shadow-xl text-slate-900 space-y-5">
            <button
              type="button"
              onClick={() => setIsCallbackModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Zatvori"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1.5 pr-6">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-100 text-[#0F2942] text-xs font-semibold">
                <Clock className="w-3.5 h-3.5" />
                <span>Brzi povratni poziv</span>
              </span>
              <h3 className="text-xl font-bold text-slate-900">
                Razgovarajte s ovlaštenim zastupnikom
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ostavite kontakt podatke i naš će vam se stručni tim javiti s usporedbom ponuda u najkraćem roku unutar radnog vremena.
              </p>
            </div>

            {submittedSuccess ? (
              <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2.5">
                <CheckCircle2 className="w-9 h-9 text-emerald-700 mx-auto" />
                <h4 className="text-sm font-bold text-emerald-900">Zahtjev je zaprimljen</h4>
                <p className="text-xs text-emerald-800">
                  Naš ovlašteni zastupnik kontaktirat će vas na broj{' '}
                  <span className="font-semibold tabular-nums">{callbackPhone}</span>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCallbackSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Ime i prezime</label>
                  <input
                    type="text"
                    required
                    placeholder="npr. Ivan Horvat"
                    value={callbackName}
                    onChange={(e) => setCallbackName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0F2942] focus:ring-2 focus:ring-[#0F2942]/10"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Broj telefona ili mobitela</label>
                  <input
                    type="tel"
                    required
                    placeholder="+385 91 ..."
                    value={callbackPhone}
                    onChange={(e) => setCallbackPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0F2942] focus:ring-2 focus:ring-[#0F2942]/10 tabular-nums"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Područje interesa</label>
                  <select
                    value={callbackTopic}
                    onChange={(e) => setCallbackTopic(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-[#0F2942] focus:ring-2 focus:ring-[#0F2942]/10"
                  >
                    <option>Auto osiguranje (AO i kasko)</option>
                    <option>Osiguranje doma i od potresa</option>
                    <option>Dopunsko i dodatno zdravstveno</option>
                    <option>Životno osiguranje i štednja</option>
                    <option>Poslovno osiguranje tvrtke ili obrta</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 rounded-lg bg-[#0F2942] hover:bg-[#163859] text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Slanje zahtjeva...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Zatraži povratni poziv</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};
