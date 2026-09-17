import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  FileText,
  MessageSquare,
  ShieldCheck,
  CreditCard,
  QrCode,
  Download,
  Clock,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { CalculatedQuoteEstimate, Advisor, InsuranceProductType } from '../../types/insurance';

interface QuoteSummaryCardProps {
  productType: InsuranceProductType;
  estimate: CalculatedQuoteEstimate;
  assetLabel?: string;
  advisor: Advisor;
  onBindOnline?: () => void;
  className?: string;
}

export const QuoteSummaryCard: React.FC<QuoteSummaryCardProps> = ({
  productType,
  estimate,
  assetLabel = 'Toyota RAV4 2.5 Hybrid (ZG-4821-HP)',
  advisor,
  onBindOnline,
  className = '',
}) => {
  const [billingFrequency, setBillingFrequency] = useState<'monthly' | 'annual'>('monthly');
  const [isBreakdownOpen, setIsBreakdownOpen] = useState(false);
  const [isBindingModalOpen, setIsBindingModalOpen] = useState(false);
  const [isBoundSuccess, setIsBoundSuccess] = useState(false);

  const priceDisplay =
    billingFrequency === 'monthly'
      ? {
          amount: estimate.monthlyPremium.toFixed(2),
          period: '/ mjesečno',
          subtext: `Ukupno godišnje: ${estimate.annualPremium.toFixed(2)} € (12 obroka bez kamata)`,
        }
      : {
          amount: estimate.annualPremium.toFixed(2),
          period: '/ godišnje',
          subtext: `Jednokratno plaćanje uz dodatni popust na gotovinu / SEPA nalog`,
        };

  const generateWhatsAppMessage = () => {
    const text = encodeURIComponent(
      `Poštovani ${advisor.name},\n\n` +
      `Zainteresiran sam za ponudu osiguranja preko portala Agencije Život:\n` +
      `• Predmet: ${assetLabel}\n` +
      `• Vrsta: ${productType.toUpperCase()}\n` +
      `• Izračunata premija: ${estimate.annualPremium.toFixed(2)} €/god (${estimate.monthlyPremium.toFixed(2)} €/mj)\n` +
      `• Franšiza: ${estimate.deductible || 0} €\n\n` +
      `Molim Vas detaljnu provjeru uvjeta i pripremu službene ponude.`
    );
    return `https://wa.me/${advisor.whatsappNumber}?text=${text}`;
  };

  const handleSimulateOnlineBinding = () => {
    setIsBindingModalOpen(true);
  };

  const handleConfirmBind = () => {
    setIsBoundSuccess(true);
    setTimeout(() => {
      setIsBindingModalOpen(false);
      setIsBoundSuccess(false);
      onBindOnline?.();
    }, 2000);
  };

  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden ${className}`}
    >
      {/* Top Value Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-5 sm:p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 translate-x-4 -translate-y-4 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Sparkles className="w-3 h-3" />
              Službena neobvezujuća ponuda
            </div>
            <h3 className="text-lg sm:text-xl font-black tracking-tight text-white">
              {assetLabel}
            </h3>
            <p className="text-xs text-slate-400">
              Uključena sva odabrana pokrića i zakonski primijenjen bonus od 50%
            </p>
          </div>

          {/* Billing Switcher: Monthly / Annual */}
          <div className="inline-flex p-1 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setBillingFrequency('monthly')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                billingFrequency === 'monthly'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Mjesečno
            </button>
            <button
              type="button"
              onClick={() => setBillingFrequency('annual')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                billingFrequency === 'annual'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Godišnje
            </button>
          </div>
        </div>
      </div>

      {/* Main Pricing Split */}
      <div className="p-5 sm:p-7 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Vaša prilagođena premija
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white font-mono">
                {priceDisplay.amount} €
              </span>
              <span className="text-sm font-semibold text-slate-500">{priceDisplay.period}</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">{priceDisplay.subtext}</p>
          </div>

          <div className="sm:text-right space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1 rounded-xl border border-emerald-200 dark:border-emerald-800/40">
              <ShieldCheck className="w-3.5 h-3.5" />
              Ušteda primjenom bonusa: {estimate.discountsTotal.toFixed(2)} €
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              Franšiza: {estimate.deductible || 0} € &bull; Pokriće do:{' '}
              {estimate.coverageLimit?.toLocaleString('hr-HR')} €
            </div>
          </div>
        </div>

        {/* Collapsible Itemized Breakdown */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setIsBreakdownOpen(!isBreakdownOpen)}
            className="w-full flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 py-1"
          >
            <span>Struktura i stavke pokrića ({estimate.itemizedBreakdown.length} stavki)</span>
            <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
              {isBreakdownOpen ? 'Sakrij detalje' : 'Prikaži detalje'}
              {isBreakdownOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </span>
          </button>

          <AnimatePresence>
            {isBreakdownOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs"
              >
                {estimate.itemizedBreakdown.map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-1 text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-2 truncate pr-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </span>
                    <span className="font-mono font-semibold text-slate-900 dark:text-white shrink-0">
                      {item.amount.toFixed(2)} €
                    </span>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 1-CLICK ACTIONS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Action 1: Bind Online */}
          <button
            type="button"
            onClick={handleSimulateOnlineBinding}
            className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Ugovori policu online</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Action 2: Review with WhatsApp Agent */}
          <a
            href={generateWhatsAppMessage()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm border border-slate-700 shadow-sm transition-all"
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>Pregledaj s agentom (WhatsApp)</span>
          </a>
        </div>

        {/* Trust Badges */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>0 € agencijske provizije (čl. 401. Zakona o osiguranju)</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Instant PDF polica</span>
            <span>&bull;</span>
            <span>Zelena karta s QR kodom</span>
          </div>
        </div>
      </div>

      {/* MODAL: 1-CLICK BINDING MODAL */}
      <AnimatePresence>
        {isBindingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5"
            >
              {isBoundSuccess ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <h4 className="text-xl font-black text-slate-900 dark:text-white">
                    Polica je uspješno ugovorena!
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Službena digitalna polica i potvrda poslane su na vaš e-mail i pohranjene u vašem korisničkom novčaniku.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-black text-slate-900 dark:text-white">
                        Brzo digitalno ugovaranje police
                      </h4>
                      <p className="text-xs text-slate-500">
                        Odaberite željeni način uplate premije
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsBindingModalOpen(false)}
                      className="text-slate-400 hover:text-slate-600 text-sm font-bold"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                    <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                      <span>{assetLabel}</span>
                      <span className="font-mono">{estimate.annualPremium.toFixed(2)} €</span>
                    </div>
                    <div className="text-slate-500">
                      Izdavatelj: Partner Generali osiguranje d.d. &bull; Licenca HANFA ZO-88912
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Način plaćanja:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-semibold">
                      <div className="p-3 rounded-xl border-2 border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-300 flex flex-col items-center justify-center gap-1.5">
                        <QrCode className="w-5 h-5" />
                        <span>KEKS Pay / QR</span>
                      </div>
                      <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex flex-col items-center justify-center gap-1.5 text-slate-700 dark:text-slate-300">
                        <CreditCard className="w-5 h-5" />
                        <span>Kartice do 12 rata</span>
                      </div>
                      <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex flex-col items-center justify-center gap-1.5 text-slate-700 dark:text-slate-300">
                        <FileText className="w-5 h-5" />
                        <span>SEPA Uplatnica</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsBindingModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                    >
                      Odustani
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmBind}
                      className="px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md"
                    >
                      Potvrdi i aktiviraj pokriće
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
