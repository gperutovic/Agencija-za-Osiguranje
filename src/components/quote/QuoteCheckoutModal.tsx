import React, { useEffect, useId, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertCircle, CheckCircle2, Download, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { agencyRepository } from '../../services/agencyRepository';
import {
  CarrierOffer,
  CoverageCustomization,
  Language,
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

function createCheckoutSchema(lang: Language) {
  const isEn = lang === 'en';
  return z.object({
    fullName: z
      .string()
      .trim()
      .min(3, isEn ? 'Enter your full name.' : 'Unesite puno ime i prezime.'),
    oib: z.string().trim().refine((val) => isValidOIB(val), {
      message: isEn
        ? 'Invalid Croatian OIB (11 digits, ISO 7064 checksum).'
        : 'Uneseni OIB nije ispravan prema ISO 7064 kontrolnoj znamenci (11 znamenki).',
    }),
    email: z
      .string()
      .trim()
      .email(isEn ? 'Enter a valid e-mail address.' : 'Unesite ispravnu e-mail adresu.'),
    phone: z.string().trim().refine((val) => isValidCroatianPhone(val), {
      message: isEn
        ? 'Enter a valid Croatian phone number (e.g. +385 91 234 5678).'
        : 'Unesite ispravan hrvatski broj telefona (npr. +385 91 234 5678).',
    }),
    iban: z
      .string()
      .trim()
      .optional()
      .refine((val) => !val || isValidCroatianIban(val), {
        message: isEn
          ? 'IBAN must be a valid Croatian IBAN (HR + 19 digits).'
          : 'IBAN mora biti valjan hrvatski IBAN (HR + 19 znamenki).',
      }),
    ipidAcknowledged: z.boolean().refine((v) => v === true, {
      message: isEn
        ? 'Acknowledging the IPID document is legally required under EU IDD.'
        : 'Potvrda upoznavanja s IPID dokumentom je zakonski obvezna.',
    }),
    gdprEssential: z.boolean().refine((v) => v === true, {
      message: isEn
        ? 'GDPR data processing consent is required to issue a binding quote.'
        : 'Potrebna je privola za obradu podataka radi izrade ponude.',
    }),
    gdprMarketing: z.boolean(),
  });
}

type CheckoutFormValues = z.infer<ReturnType<typeof createCheckoutSchema>>;

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
  const { language, copy, t } = useLanguage();
  const { showToast } = useToast();
  const formId = useId();

  const [confirmedQuote, setConfirmedQuote] = useState<QuoteSubmission | null>(null);
  const [submitError, setSubmitError] = useState<string>('');
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const schema = useMemo(() => createCheckoutSchema(language), [language]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(schema),
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

  // Keep form cleanly synchronized whenever authenticated user or selected offer changes
  useEffect(() => {
    if (!offer) return;
    setSubmitError('');
    setConfirmedQuote(null);
    reset({
      fullName: user?.fullName ?? '',
      oib: user?.oib ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
      iban: '',
      ipidAcknowledged: false,
      gdprEssential: false,
      gdprMarketing: false,
    });
  }, [user, offer, reset]);

  if (!offer) return null;

  const isTravel = productLine === 'putno';

  const handleClose = () => {
    setConfirmedQuote(null);
    setSubmitError('');
    onClose();
  };

  const onSubmit = async (values: CheckoutFormValues) => {
    setSubmitError('');
    try {
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
      showToast(
        t(
          `Zahtjev ${saved.referenceNumber} je uspješno zaprimljen.`,
          `Quote request ${saved.referenceNumber} received.`
        ),
        'success'
      );
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : t('Slanje zahtjeva nije uspjelo. Pokušajte ponovno.', 'Failed to submit quote request.');
      setSubmitError(msg);
      showToast(msg, 'error');
    }
  };

  const handleDownloadQuotePdf = async (quote: QuoteSubmission) => {
    setDownloadingPdf(true);
    try {
      await downloadQuoteSummaryPdf(quote);
    } finally {
      setDownloadingPdf(false);
    }
  };

  return (
    <Modal
      isOpen={Boolean(offer)}
      onClose={handleClose}
      title={
        confirmedQuote
          ? t('Zahtjev za ponudu je zaprimljen', 'Binding quote request received')
          : t('Otključaj obvezujuću ponudu', 'Unlock binding offer')
      }
      subtitle={
        confirmedQuote
          ? `${t('Referentni broj', 'Reference')}: ${confirmedQuote.referenceNumber}`
          : isTravel
            ? `${offer.carrierName} • ${formatEur(offer.annualPrice)} ${copy.units.perTripShort}`
            : `${offer.carrierName} • ${formatEur(offer.annualPrice)} ${copy.units.perYearShort} (${formatEur(offer.monthlyPrice)} ${copy.units.perMonthShort})`
      }
      footer={
        confirmedQuote ? (
          <div className="flex flex-col sm:flex-row gap-2.5">
            <Button
              fullWidth
              variant="outline"
              isLoading={downloadingPdf}
              onClick={() => void handleDownloadQuotePdf(confirmedQuote)}
            >
              <Download className="w-4 h-4" strokeWidth={1.5} />
              <span>{t('Preuzmi sažetak ponude (PDF)', 'Download Quote Summary (PDF)')}</span>
            </Button>
            <Button fullWidth onClick={handleClose}>
              {t('Zatvori', 'Close')}
            </Button>
          </div>
        ) : (
          <Button type="submit" form={formId} fullWidth size="lg" isLoading={isSubmitting}>
            {t('Pošalji zahtjev za obvezujuću ponudu', 'Submit Binding Quote Request')}
          </Button>
        )
      }
    >
      {confirmedQuote ? (
        <div className="space-y-5">
          <div className="rounded-editorial bg-emerald-50 border border-emerald-200 p-4 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-status-success shrink-0 mt-0.5" strokeWidth={1.75} />
            <div className="text-sm text-ink space-y-1">
              <p className="font-semibold">
                {t(
                  `Ponuda ${confirmedQuote.referenceNumber} je spremljena i dodijeljena našem timu.`,
                  `Quote ${confirmedQuote.referenceNumber} has been saved and assigned to our team.`
                )}
              </p>
              <p className="text-xs text-ink-secondary">
                {t('Ovlašteni zastupnik dostavit će vam finalnu policu i uplatnicu na', 'A licensed advisor will send your final policy and payment slip to')}{' '}
                <strong>{confirmedQuote.customer.email}</strong>.{' '}
                {t('Bez ikakvih agencijskih naknada.', 'Zero agency fees.')}
              </p>
            </div>
          </div>

          <div className="rounded-editorial bg-canvas-warm border border-hairline p-4 space-y-2 text-sm tabular-nums">
            <div className="flex justify-between">
              <span className="text-ink-muted">{t('Osiguratelj', 'Insurer')}</span>
              <span className="font-semibold text-ink">{confirmedQuote.selectedOffer.carrierName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-muted">{t('OIB ugovaratelja', 'Policyholder OIB')}</span>
              <span className="font-semibold text-ink">{confirmedQuote.customer.oib}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-muted">{t('Premija', 'Premium')}</span>
              <span className="font-bold text-ink">
                {formatEur(confirmedQuote.selectedOffer.annualPrice)}{' '}
                {isTravel ? copy.units.perTripShort : copy.units.perYearShort}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <Input
            label={t('Ime i prezime *', 'Full name *')}
            placeholder="npr. Ana Horvat"
            error={errors.fullName?.message}
            {...register('fullName')}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={t('OIB (11 znamenki) *', 'Croatian OIB (11 digits) *')}
              placeholder="26182105152"
              maxLength={11}
              tabular
              error={errors.oib?.message}
              {...register('oib')}
            />
            <Input
              label={t('Mobitel / telefon *', 'Phone number *')}
              placeholder="+385 91 234 5678"
              tabular
              error={errors.phone?.message}
              {...register('phone')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={t('E-mail adresa *', 'E-mail address *')}
              type="email"
              placeholder="ana@email.hr"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label={t('IBAN (opcionalno)', 'IBAN (optional)')}
              helperText={t('Za SEPA izravno terećenje', 'For SEPA direct debit')}
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
                {t('Potvrđujem da sam zaprimio/la i upoznao/la se s', 'I confirm that I have received and reviewed the')}{' '}
                <button
                  type="button"
                  onClick={() => void downloadIpidPdf(offer, productLabel)}
                  className="text-accent font-semibold underline underline-offset-2"
                >
                  {t(`IPID informativnim dokumentom (${offer.ipidCode})`, `IPID Information Document (${offer.ipidCode})`)}
                </button>{' '}
                {t('te pred-ugovornim HANFA obavijestima. *', 'and pre-contractual HANFA disclosures. *')}
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
                {t(
                  'Suglasan/na sam s obradom osobnih podataka (OIB, kontakt, podaci o riziku) u svrhu izrade obvezujuće ponude sukladno GDPR-u. *',
                  'I consent to processing my personal data (OIB, contact, risk details) to prepare a binding quote under GDPR. *'
                )}
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
                {t(
                  'Želim primati podsjetnike o isteku polica i sezonske popuste (opcionalno).',
                  'I want to receive renewal reminders and seasonal discounts (optional).'
                )}
              </span>
            </label>
          </div>

          {submitError ? (
            <div
              role="alert"
              className="rounded-lg bg-red-50 border border-red-200 p-3 flex items-start gap-2 text-xs text-status-danger font-medium"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" strokeWidth={1.75} />
              <span>{submitError}</span>
            </div>
          ) : null}

          <div className="flex items-center gap-2 text-xs text-ink-muted">
            <ShieldCheck className="w-4 h-4 text-ink shrink-0" strokeWidth={1.5} />
            <span>
              {t(
                'Zapis privole bilježi se s vremenskom oznakom. 0 € agencijske naknade.',
                'Consent is logged with a timestamp. €0 agency fees.'
              )}
            </span>
          </div>
        </form>
      )}
    </Modal>
  );
};
