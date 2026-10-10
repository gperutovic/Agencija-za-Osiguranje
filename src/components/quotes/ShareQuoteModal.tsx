import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Share2,
  Mail,
  MessageSquare,
  CheckCircle2,
  Sparkles,
  X,
  ArrowRight,
  Send,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { leadService } from '../../api/firestoreService';

interface ShareQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: 'auto' | 'property' | 'health' | 'life' | 'business';
  summaryTitle: string;
  calculatedPriceEur: number;
  monthlyPriceEur?: number;
  carrierName?: string;
  details?: Record<string, any>;
}

export const ShareQuoteModal: React.FC<ShareQuoteModalProps> = ({
  isOpen,
  onClose,
  category,
  summaryTitle,
  calculatedPriceEur,
  monthlyPriceEur,
  carrierName = 'Generali / Vodeći osiguratelji RH',
  details = {},
}) => {
  const [activeChannel, setActiveChannel] = useState<'whatsapp' | 'email'>('whatsapp');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [isSent, setIsSent] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const quoteMessage = `Pozdrav! Zanima me ugovaranje police:
• Proizvod: ${summaryTitle}
• Preporučeni osiguratelj: ${carrierName}
• Godišnja premija: ${calculatedPriceEur.toFixed(2)} €${
    monthlyPriceEur ? ` (${monthlyPriceEur.toFixed(2)} €/mj.)` : ''
  }
• Agencija Život (Ovlašteni zastupnik u osiguranju)
Možete li mi potvrditi uvjete police?`;

  const handleSendWhatsApp = async () => {
    setIsSubmitting(true);
    try {
      // Save lead to Firestore
      await leadService.saveLead({
        oib: details.oib || '',
        name: fullName || 'Klijent s weba',
        email: email || '',
        phone: phone || '',
        productType: category,
        status: 'new',
        annualPremium: calculatedPriceEur,
        selectedInsurer: carrierName,
        data: {
          channel: 'whatsapp',
          summaryTitle,
          ...details,
        },
      });

      // Encode and launch WhatsApp
      const cleanPhone = phone.replace(/\D/g, '');
      const waUrl = cleanPhone
        ? `https://wa.me/${cleanPhone.startsWith('0') ? '385' + cleanPhone.slice(1) : cleanPhone}?text=${encodeURIComponent(
            quoteMessage
          )}`
        : `https://wa.me/?text=${encodeURIComponent(quoteMessage)}`;

      window.open(waUrl, '_blank');
      setIsSent(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    try {
      await leadService.saveLead({
        oib: details.oib || '',
        name: fullName || 'Klijent s weba',
        email,
        phone,
        productType: category,
        status: 'new',
        annualPremium: calculatedPriceEur,
        selectedInsurer: carrierName,
        data: {
          channel: 'email',
          summaryTitle,
          ...details,
        },
      });
      setIsSent(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col my-auto"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                Spremi ponudu na WhatsApp ili E-mail
              </h3>
              <p className="text-xs text-slate-300">
                Pošaljite si sažetak izračuna i zaključajte cijenu na 30 dana
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-6">
          {/* Quote Overview Badge */}
          <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-800">
                {summaryTitle}
              </span>
              <p className="text-xs font-semibold text-slate-700">{carrierName}</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-slate-950 font-mono">
                {calculatedPriceEur.toFixed(2)} €
              </span>
              {monthlyPriceEur && (
                <span className="text-[11px] text-slate-500 block">
                  {monthlyPriceEur.toFixed(2)} € / mj.
                </span>
              )}
            </div>
          </div>

          {isSent ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="text-base font-bold text-emerald-950">Ponuda je uspješno spremljena!</h4>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Detalji izračuna s IPID obrascem i podacima za plaćanje poslani su. Naš ovlašteni zastupnik u osiguranju stoji vam na raspolaganju za sva dodatna pitanja.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
              >
                Zatvori
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Channel Tabs */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setActiveChannel('whatsapp')}
                  className={`py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    activeChannel === 'whatsapp'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveChannel('email')}
                  className={`py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    activeChannel === 'email'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  <span>E-mail</span>
                </button>
              </div>

              {activeChannel === 'whatsapp' ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Vaš broj mobitela (opcionalno)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="npr. 091 234 5678"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      Klikom na gumb dolje otvara se WhatsApp aplikacija s gotovim sažetkom ponude.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleSendWhatsApp}
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{isSubmitting ? 'Otvaranje...' : 'Otvori u WhatsAppu odmah'}</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSendEmail} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Ime i prezime *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ivan Horvat"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Vaša e-mail adresa *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ivan@email.hr"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Slanje...' : 'Pošalji ponudu na e-mail'}</span>
                  </button>
                </form>
              )}

              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                <span>
                  Vaši podaci su zaštićeni (SSL 256-bit). Ne šaljemo neželjenu poštu.
                </span>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
