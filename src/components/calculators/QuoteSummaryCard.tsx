import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CalculatedQuoteEstimate, InsuranceProductType } from '../../types/insurance';
import { formatCurrency } from '../../utils/formatters';
import { Button } from '../common/Button';
import { useToast } from '../common/Toast';
import { useCreateQuote } from '../../hooks/useQuotes';
import { useAuth } from '../../context/AuthContext';
import { leadService } from '../../services/firebase';
import { Calendar, Share2, Send } from 'lucide-react';
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

    const cleanOib = oib.trim();
    const cleanName = fullName.trim();
    const cleanEmail = email.trim();
    const cleanPhone = phone.trim();

    try {
      await createQuoteMutation.mutateAsync({
        ...(user?.uid ? { userId: user.uid } : {}),
        customer: {
          fullName: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          ...(cleanOib ? { oib: cleanOib } : {}),
        },
        type: productType,
        inputs,
        calculatedEstimate: {
          annualPremium: estimate.annualPremium,
          monthlyPremium: estimate.monthlyPremium,
          currency: 'EUR',
          ...(estimate.deductible !== undefined ? { deductible: estimate.deductible } : {}),
          ...(estimate.coverageLimit !== undefined ? { coverageLimit: estimate.coverageLimit } : {}),
        },
        status: 'new',
      });

      await leadService.saveLead({
        oib: cleanOib,
        name: cleanName,
        fullName: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        productType,
        data: inputs,
        selectedInsurer: 'Generali osiguranje d.d.',
        annualPremium: estimate.annualPremium,
        status: 'new',
      });

      setIsSubmitted(true);
      setLeadModalOpen(false);
      toast.success(
        'Vaš zahtjev za ponudu je zaprimljen! Ovlašteni zastupnik Agencije Život kontaktirat će vas u najkraćem roku.'
      );
    } catch {
      toast.error('Došlo je do pogreške pri slanju upita.');
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 sticky top-28 text-slate-900">
        {/* Card Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Generali osiguranje d.d.
            </span>
            <h3 className="text-base font-bold text-[#0F2942] mt-1">
              Informativni izračun premije
            </h3>
          </div>
          <button
            type="button"
            onClick={handleShare}
            className="p-2 rounded-lg text-slate-400 hover:text-[#0F2942] hover:bg-slate-100 transition-colors"
            title="Podijeli izračun"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Pricing tiers */}
        <div className="space-y-3">
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              {t('calculators.summary.monthly')}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-bold tracking-tight tabular-nums text-[#0F2942]">
                {formatCurrency(estimate.monthlyPremium)}
              </span>
              <span className="text-xs font-medium text-slate-500">/ mj.</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="p-3 rounded-xl border border-slate-200 bg-white">
              <span className="text-[11px] text-slate-500 uppercase font-medium block mb-0.5">
                {t('calculators.summary.quarterly')}
              </span>
              <span className="font-bold text-slate-900 tabular-nums">
                {formatCurrency(estimate.quarterlyPremium)}
              </span>
            </div>

            <div className="p-3 rounded-xl border border-[#0F2942]/20 bg-[#0F2942]/5">
              <span className="text-[11px] text-[#0F2942] uppercase font-semibold block mb-0.5">
                {t('calculators.summary.annual')}
              </span>
              <span className="font-bold text-[#0F2942] tabular-nums">
                {formatCurrency(estimate.annualPremium)}
              </span>
            </div>
          </div>
        </div>

        {/* Itemized breakdown */}
        <div className="space-y-2 pt-3 border-t border-slate-200">
          <span className="text-xs font-semibold text-slate-700 block">Stavke obračuna:</span>
          <div className="space-y-1.5 text-xs">
            {estimate.itemizedBreakdown.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="text-slate-600">{item.title}</span>
                <span className="font-semibold tabular-nums text-slate-900">
                  {formatCurrency(item.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Coverage Limit indicator */}
        {estimate.coverageLimit && (
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
            <span className="text-slate-600 font-medium">Maksimalno pokriće:</span>
            <span className="font-bold tabular-nums text-[#0F2942]">
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
            className="w-full font-semibold"
          >
            {isSubmitted ? 'Pošalji novi upit' : t('calculators.summary.requestQuote')}
          </Button>

          {onBookAppointment && (
            <Button
              variant="outline"
              size="md"
              onClick={onBookAppointment}
              leftIcon={<Calendar className="w-4 h-4 text-[#0F2942]" />}
              className="w-full font-semibold"
            >
              {t('calculators.summary.bookAdvisor')}
            </Button>
          )}
        </div>

        {/* Legal disclaimer */}
        <p className="text-[11px] text-slate-500 leading-relaxed text-center">
          {t('calculators.summary.disclaimer')}
        </p>
      </div>

      {/* Lead capture modal */}
      <Modal
        isOpen={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
        title="Zatražite službenu ponudu osiguranja"
        description="Unesite vaše kontakt podatke. Ovlašteni zastupnik u osiguranju pripremit će službenu informativnu ponudu Generali osiguranja d.d."
      >
        <form onSubmit={handleLeadSubmit} className="space-y-4 text-slate-900">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Ime i prezime *</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="npr. Ana Horvat"
              className="w-full rounded-xl bg-white border border-slate-300 p-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0F2942] focus:ring-1 focus:ring-[#0F2942]"
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
                className="w-full rounded-xl bg-white border border-slate-300 p-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0F2942] focus:ring-1 focus:ring-[#0F2942]"
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
                className="w-full rounded-xl bg-white border border-slate-300 p-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0F2942] focus:ring-1 focus:ring-[#0F2942]"
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
              className="w-full rounded-xl bg-white border border-slate-300 p-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0F2942] focus:ring-1 focus:ring-[#0F2942]"
            />
          </div>

          <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 leading-relaxed border border-slate-200">
            Slanjem upita dajete privolu Agenciji Život d.o.o. za obradu podataka u svrhu izrade ponude sukladno IDD direktivi i GDPR pravilima.
          </div>

          <Button
            type="submit"
            variant="primary"
            isLoading={createQuoteMutation.isPending}
            className="w-full font-semibold py-3"
          >
            Pošalji zahtjev za ponudu
          </Button>
        </form>
      </Modal>
    </>
  );
};
