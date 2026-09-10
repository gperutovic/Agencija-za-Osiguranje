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
        type: productType,
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
      <div className="bg-white rounded-3xl border border-slate-200 shadow-elevated p-6 sm:p-8 space-y-6 sticky top-28">
        {/* Card Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200/60">
              Generali osiguranje d.d.
            </span>
            <h3 className="text-base font-black text-slate-900 mt-2">
              Informativni izračun premije
            </h3>
          </div>
          <button
            type="button"
            onClick={handleShare}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Podijeli izračun"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Pricing tiers */}
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-navy-950 to-navy-900 text-white space-y-1 shadow-md">
            <span className="text-[11px] font-bold text-teal-300 uppercase tracking-wider">
              {t('calculators.summary.monthly')}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black tracking-tight font-mono">
                {formatCurrency(estimate.monthlyPremium)}
              </span>
              <span className="text-xs text-slate-400">/ mj.</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70">
              <span className="text-[10px] text-slate-500 font-medium block">
                {t('calculators.summary.quarterly')}
              </span>
              <span className="font-bold text-slate-800 font-mono">
                {formatCurrency(estimate.quarterlyPremium)}
              </span>
            </div>

            <div className="p-3 rounded-xl border border-teal-200 bg-teal-50/50">
              <span className="text-[10px] text-teal-700 font-bold block">
                {t('calculators.summary.annual')}
              </span>
              <span className="font-bold text-teal-900 font-mono">
                {formatCurrency(estimate.annualPremium)}
              </span>
            </div>
          </div>
        </div>

        {/* Itemized breakdown */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-700 block">Stavke obračuna:</span>
          <div className="space-y-1.5 text-xs text-slate-600">
            {estimate.itemizedBreakdown.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-[11px]">
                <span className="text-slate-600">{item.title}</span>
                <span className="font-mono font-bold text-slate-800">
                  {formatCurrency(item.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Coverage Limit indicator */}
        {estimate.coverageLimit && (
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
            <span className="text-slate-500 text-[11px]">Maksimalno pokriće:</span>
            <span className="font-mono font-bold text-navy-900">
              {formatCurrency(estimate.coverageLimit)}
            </span>
          </div>
        )}

        {/* Action buttons */}
        <div className="space-y-2.5 pt-2">
          <Button
            variant="teal"
            size="md"
            onClick={() => setLeadModalOpen(true)}
            leftIcon={<Send className="w-4 h-4" />}
            className="w-full font-bold shadow-md"
          >
            {isSubmitted ? 'Pošalji novi upit' : t('calculators.summary.requestQuote')}
          </Button>

          {onBookAppointment && (
            <Button
              variant="outline"
              size="md"
              onClick={onBookAppointment}
              leftIcon={<Calendar className="w-4 h-4 text-teal-600" />}
              className="w-full font-bold"
            >
              {t('calculators.summary.bookAdvisor')}
            </Button>
          )}
        </div>

        {/* Legal disclaimer */}
        <p className="text-[10px] text-slate-400 leading-relaxed text-center">
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
        <form onSubmit={handleLeadSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Ime i prezime *</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="npr. Ana Horvat"
              className="w-full rounded-xl border border-slate-200 p-2.5 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Email adresa *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ana.horvat@email.hr"
                className="w-full rounded-xl border border-slate-200 p-2.5 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Kontakt telefon *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+385 91 234 5678"
                className="w-full rounded-xl border border-slate-200 p-2.5 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">OIB (opcionalno)</label>
            <input
              type="text"
              maxLength={11}
              value={oib}
              onChange={(e) => setOib(e.target.value)}
              placeholder="11 znamenki"
              className="w-full rounded-xl border border-slate-200 p-2.5 text-sm"
            />
          </div>

          <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500 leading-relaxed border border-slate-200">
            Slanjem upita dajete privolu Agenciji Život d.o.o. za obradu podataka u svrhu izrade ponude sukladno IDD direktivi i GDPR pravilima.
          </div>

          <Button
            type="submit"
            variant="teal"
            isLoading={createQuoteMutation.isPending}
            className="w-full font-bold py-3"
          >
            Pošalji zahtjev za ponudu
          </Button>
        </form>
      </Modal>
    </>
  );
};
