import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle2, Download, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { agencyRepository } from '../../services/agencyRepository';
import {
  CarrierOffer,
  CoverageCustomization,
  ProductLine,
  ProductQuoteInput,
  QuoteSubmission,
} from '../../types/domain';
import {
  isValidCroatianIban,
  isValidCroatianPhone,
  isValidOIB,
  normalizeCroatianPhone,
} from '../../utils/croatianValidators';
import { downloadIpidPdf, downloadQuoteSummaryPdf } from '../../utils/documentGenerator';
import { formatEur } from '../../utils/formatters';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { useToast } from '../ui/Toast';

const checkoutSchema = z.object({
  fullName: z.string().trim().min(3, 'Unesite puno ime i prezime'),
  oib: z.string().trim().refine((val) => isValidOIB(val), {
    message: 'Uneseni OIB nije ispravan prema ISO 7064 kontrolnoj znamenci (11 znamenki).',
  }),
  email: z.string().trim().email('Unesite ispravnu e-mail adresu'),
  phone: z.string().trim().refine((val) => isValidCroatianPhone(val), {
    message: 'Unesite ispravan hrvatski broj telefona (npr. +385 91 234 5678).',
  }),
  iban: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || isValidCroatianIban(val), {
      message: 'IBAN mora biti valjan hrvatski IBAN (HR + 19 znamenki).',
    }),
  ipidAcknowledged: z.boolean().refine((v) => v === true, {
    message: 'Potvrda upoznavanja s IPID dokumentom je zakonski obvezna.',
  }),
  gdprEssential: z.boolean().refine((v) => v === true, {
    message: 'Potrebna je privola za obradu podataka radi izrade ponude.',
  }),
  gdprMarketing: z.boolean(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

interface QuoteCheckoutModalProps {
  offer: CarrierOffer | null;
  productLine: ProductLine;
  productLabel: string;
  bundleProducts: ProductLine[];
  inputs: ProductQuoteInput;
  customization: CoverageCustomization;
  onClose: () => void;
}

export const QuoteCheckoutModal: React.FC<QuoteCheckoutModalProps> = ({
  offer,
  productLine,
  productLabel,
  bundleProducts,
  inputs,
  customization,
  onClose,
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [confirmedQuote, setConfirmedQuote] = useState<QuoteSubmission | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      fullName: user?.fullName ?? '',
      oib: user?.oib ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
      iban: '',
      ipidAcknowledged: false,
      gdprEssential: false,
      gdprMarketing: false,
    },
  });

  if (!offer) return null;

  const handleClose = () => {
    setConfirmedQuote(null);
    reset();
    onClose();
  };

  const onSubmit = async (values: CheckoutFormValues) => {
    const saved = await agencyRepository.createQuote({
      userId: user?.uid,
      productLine,
      bundleProducts,
      inputs,
      customization,
      selectedOffer: offer,
      customer: {
        fullName: values.fullName,
        oib: values.oib,
        email: values.email,
        phone: normalizeCroatianPhone(values.phone),
        iban: values.iban?.trim() || undefined,
      },
      consents: {
        ipidAcknowledged: values.ipidAcknowledged,
        gdprEssential: values.gdprEssential,
        gdprMarketing: values.gdprMarketing,
        timestamp: new Date().toISOString(),
        policyVersion: '2026.1',
      },
      source: 'quote_engine',
    });

    setConfirmedQuote(saved);
    showToast(`Zahtjev ${saved.referenceNumber} je uspješno zaprimljen.`, 'success');
  };

  return (
    <Modal
      isOpen={Boolean(offer)}
      onClose={handleClose}
      title={confirmedQuote ? 'Zahtjev za ponudu je zaprimljen' : 'Otključaj obvezujuću ponudu'}
      subtitle={
        confirmedQuote
          ? `Referentni broj: ${confirmedQuote.referenceNumber}`
          : `${offer.carrierName} • ${formatEur(offer.annualPrice)} godišnje (${formatEur(offer.monthlyPrice)} / mj.)`
      }
    >
      {confirmedQuote ? (
        <div className="space-y-6">
          <div className="rounded-editorial bg-emerald-50 border border-emerald-200 p-4 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-status-success shrink-0 mt-0.5" strokeWidth={1.75} />
            <div className="text-sm text-ink space-y-1">
              <p className="font-semibold">
                Ponuda {confirmedQuote.referenceNumber} je spremljena i dodijeljena našem timu.
              </p>
              <p className="text-xs text-ink-secondary">
                Ovlašteni zastupnik dostavit će vam finalnu policu i uplatnicu na{' '}
                <strong>{confirmedQuote.customer.email}</strong>. Bez ikakvih agencijskih naknada.
              </p>
            </div>
          </div>

          <div className="rounded-editorial bg-canvas-warm border border-hairline p-4 space-y-2 text-sm tabular-nums">
            <div className="flex justify-between">
              <span className="text-ink-muted">Osiguratelj</span>
              <span className="font-semibold text-ink">{confirmedQuote.selectedOffer.carrierName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-muted">OIB ugovaratelja</span>
              <span className="font-semibold text-ink">{confirmedQuote.customer.oib}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-muted">Premija</span>
              <span className="font-bold text-ink">
                {formatEur(confirmedQuote.selectedOffer.annualPrice)} / god.
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5">
            <Button
              fullWidth
              variant="outline"
              onClick={() => downloadQuoteSummaryPdf(confirmedQuote)}
            >
              <Download className="w-4 h-4" strokeWidth={1.5} />
              <span>Preuzmi sažetak ponude (PDF)</span>
            </Button>
            <Button fullWidth onClick={handleClose}>
              Zatvori
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <Input
            label="Ime i prezime *"
            placeholder="npr. Ana Horvat"
            error={errors.fullName?.message}
            {...register('fullName')}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="OIB (11 znamenki) *"
              placeholder="26182105153"
              maxLength={11}
              tabular
              error={errors.oib?.message}
              {...register('oib')}
            />
            <Input
              label="Mobitel / telefon *"
              placeholder="+385 91 234 5678"
              tabular
              error={errors.phone?.message}
              {...register('phone')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="E-mail adresa *"
              type="email"
              placeholder="ana@email.hr"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="IBAN (opcionalno — za SEPA terećenje)"
              placeholder="HR1210010051863000160"
              tabular
              error={errors.iban?.message}
              {...register('iban')}
            />
          </div>

          {/* Mandatory Regulatory Checkboxes */}
          <div className="rounded-editorial bg-canvas-warm border border-hairline p-4 space-y-3 text-xs">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                className="mt-0.5 rounded border-hairline-strong accent-accent"
                {...register('ipidAcknowledged')}
              />
              <span className="text-ink leading-relaxed">
                Potvrđujem da sam zaprimio/la i upoznao/la se s{' '}
                <button
                  type="button"
                  onClick={() => downloadIpidPdf(offer, productLabel)}
                  className="text-accent font-semibold underline underline-offset-2"
                >
                  IPID informativnim dokumentom ({offer.ipidCode})
                </button>{' '}
                te pred-ugovornim HANFA obavijestima. *
              </span>
            </label>
            {errors.ipidAcknowledged ? (
              <p role="alert" className="text-status-danger font-medium">
                {errors.ipidAcknowledged.message}
              </p>
            ) : null}

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                className="mt-0.5 rounded border-hairline-strong accent-accent"
                {...register('gdprEssential')}
              />
              <span className="text-ink leading-relaxed">
                Suglasan/na sam s obradom osobnih podataka (OIB, kontakt, podaci o riziku) u svrhu
                izrade obvezujuće ponude sukladno GDPR-u. *
              </span>
            </label>
            {errors.gdprEssential ? (
              <p role="alert" className="text-status-danger font-medium">
                {errors.gdprEssential.message}
              </p>
            ) : null}

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                className="mt-0.5 rounded border-hairline-strong accent-accent"
                {...register('gdprMarketing')}
              />
              <span className="text-ink-secondary leading-relaxed">
                Želim primati podsjetnike o isteku polica i sezonske popuste (opcionalno).
              </span>
            </label>
          </div>

          <div className="flex items-center gap-2 text-xs text-ink-muted">
            <ShieldCheck className="w-4 h-4 text-ink shrink-0" strokeWidth={1.5} />
            <span>Zapis privole bilježi se s vremenskom oznakom. 0 € agencijske naknade.</span>
          </div>

          <button type="submit" className="sr-only" tabIndex={-1} aria-hidden="true">
            Pošalji
          </button>
          <Button
            type="button"
            fullWidth
            size="lg"
            isLoading={isSubmitting}
            onClick={() => void handleSubmit(onSubmit)()}
          >
            Pošalji zahtjev za obvezujuću ponudu
          </Button>
        </form>
      )}
    </Modal>
  );
};
