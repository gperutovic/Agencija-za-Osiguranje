import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CalculatedQuoteEstimate, InsuranceProductType } from '../../types/insurance';
import { formatCurrency } from '../../utils/formatters';
import { Button } from '../common/Button';
import { useToast } from '../common/Toast';
import { useCreateQuote } from '../../hooks/useQuotes';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldCheck,
  Calendar,
  Share2,
  CheckCircle2,
  Euro,
  FileCheck,
  Send,
} from 'lucide-react';
import { Modal } from '../common/Modal';

export interface QuoteSummaryCardProps {
  productType: InsuranceProductType;
  inputs: Record<string, any>;
  estimate: CalculatedQuoteEstimate;
  onBookAppointment?: () => void;
}

export const QuoteSummaryCard: React.FC<QuoteSummaryCardProps> = ({
  productType,
  inputs,
  estimate,
  onBookAppointment,
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user } = useAuth();
  const createQuoteMutation = useCreateQuote();

  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [fullName, setFullName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [oib, setOib] = useState(user?.oib || '');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Poveznica s izračunom kopirana u međuspremnik!');
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone) {
      toast.error('Molimo popunite sva obvezna polja.');
      return;
    }

    try {
      await createQuoteMutation.mutateAsync({
        userId: user?.uid,
        customer: {
          fullName,
          email,
          phone,
          oib: oib || undefined,
        },
        type: productType as any,
        inputs,
        calculatedEstimate: {
          annualPremium: estimate.annualPremium,
          monthlyPremium: estimate.monthlyPremium,
          currency: 'EUR',
          deductible: estimate.deductible,
          coverageLimit: estimate.coverageLimit,
        },
        status: 'new',
      });

      setIsSubmitted(true);
      setLeadModalOpen(false);
      toast.success(
        'Vaš zahtjev za ponudu je zaprimljen! Zastupnik Agencije Život kontaktirat će vas u najkraćem roku.'
      );
    } catch {
      toast.error('Došlo je do pogreške pri slanju upita.');
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-bento p-6 sm:p-8 space-y-6 sticky top-28 text-slate-900 dark:text-white">
        {/* Card Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200/80 dark:border-teal-800">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
              Generali osiguranje d.d.
            </span>
            <h3 className="text-base font-black text-slate-900 dark:text-white mt-2">
              Informativni izračun premije
            </h3>
          </div>
          <button
            type="button"
            onClick={handleShare}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Podijeli izračun"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Pricing tiers */}
        <div className="space-y-3">
          <div className="p-5 rounded-2xl bg-gradient-to-br from-teal-900 via-slate-900 to-slate-950 border border-teal-800/30 text-white space-y-1 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-28 h-28 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
            <span className="text-[10px] font-mono font-bold text-teal-300 uppercase tracking-wider block">
              {t('calculators.summary.monthly')}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black tracking-tight font-mono text-white">
                {formatCurrency(estimate.monthlyPremium)}
              </span>
              <span className="text-xs font-mono text-slate-300">/ mj.</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold block">
                {t('calculators.summary.quarterly')}
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {formatCurrency(estimate.quarterlyPremium)}
              </span>
            </div>

            <div className="p-3 rounded-xl border border-teal-200 dark:border-teal-800/50 bg-teal-50/50 dark:bg-teal-950/30">
              <span className="text-[10px] text-teal-700 dark:text-teal-300 uppercase font-bold block">
                {t('calculators.summary.annual')}
              </span>
              <span className="font-bold text-teal-800 dark:text-teal-200">
                {formatCurrency(estimate.annualPremium)}
              </span>
            </div>
          </div>
        </div>

        {/* Itemized breakdown */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Stavke obračuna:</span>
          <div className="space-y-1.5 text-xs">
            {estimate.itemizedBreakdown.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500 dark:text-slate-400">{item.title}</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {formatCurrency(item.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Coverage Limit indicator */}
        {estimate.coverageLimit && (
          <div className="p-3 rounded-xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/40 text-xs flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 text-[11px] font-mono">Maksimalno pokriće:</span>
            <span className="font-mono font-bold text-teal-700 dark:text-teal-400">
              {formatCurrency(estimate.coverageLimit)}
            </span>
          </div>
        )}

        {/* Action buttons */}
        <div className="space-y-2.5 pt-2">
          <Button
            variant="primary"
            size="md"
            onClick={() => setLeadModalOpen(true)}
            leftIcon={<Send className="w-4 h-4" />}
            className="w-full font-bold shadow-md shadow-teal-600/20"
          >
            {isSubmitted ? 'Pošalji novi upit' : t('calculators.summary.requestQuote')}
          </Button>

          {onBookAppointment && (
            <Button
              variant="outline"
              size="md"
              onClick={onBookAppointment}
              leftIcon={<Calendar className="w-4 h-4 text-teal-600 dark:text-teal-400" />}
              className="w-full font-bold"
            >
              {t('calculators.summary.bookAdvisor')}
            </Button>
          )}
        </div>

        {/* Legal disclaimer */}
        <p className="text-[10px] text-slate-500 leading-relaxed text-center font-mono">
          {t('calculators.summary.disclaimer')}
        </p>
      </div>

      {/* Lead capture modal */}
      <Modal
        isOpen={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
        title="Zatražite službenu ponudu osiguranja"
        description="Unesite vaše kontakt podatke. Licencirani agent pripremit će personaliziranu policu Generali osiguranja."
      >
        <form onSubmit={handleLeadSubmit} className="space-y-4 text-slate-900 dark:text-white">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Ime i prezime *</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="npr. Ana Horvat"
              className="w-full rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Email adresa *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ana.horvat@email.hr"
                className="w-full rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Kontakt telefon *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+385 91 234 5678"
                className="w-full rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">OIB (opcionalno)</label>
            <input
              type="text"
              maxLength={11}
              value={oib}
              onChange={(e) => setOib(e.target.value)}
              placeholder="11 znamenki"
              className="w-full rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed border border-slate-200 dark:border-slate-700">
            Slanjem upita dajete privolu Agenciji Život d.o.o. za obradu podataka u svrhu izrade ponude sukladno IDD direktivi i GDPR pravilima.
          </div>

          <Button
            type="submit"
            variant="primary"
            isLoading={createQuoteMutation.isPending}
            className="w-full font-bold py-3 shadow-md shadow-teal-600/20"
          >
            Pošalji zahtjev za ponudu
          </Button>
        </form>
      </Modal>
    </>
  );
};
