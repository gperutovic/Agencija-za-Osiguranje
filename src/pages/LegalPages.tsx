import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertCircle, CheckCircle2, ExternalLink } from 'lucide-react';
import { BRAND_CONFIG } from '../config/brand';
import { useLanguage } from '../i18n/LanguageContext';
import { agencyRepository } from '../services/agencyRepository';
import { ComplaintRecord, Language } from '../types/domain';
import { isValidCroatianPhone, isValidOIB } from '../utils/croatianValidators';
import { formatDateHr } from '../utils/formatters';
import { COOKIE_CONSENT_KEY } from '../components/layout/CookieBanner';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useToast } from '../components/ui/Toast';

export const LegalDisclosuresPage: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <div className="bg-canvas py-14 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="space-y-3 pb-6 border-b border-hairline">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">
            {t('Zakon o osiguranju & EU IDD (2016/97)', 'Croatian Insurance Act & EU IDD (2016/97)')}
          </p>
          <h1 className="font-display text-4xl sm:text-5xl text-ink">
            {t('Pravne informacije i HANFA obavijesti', 'Legal Information & HANFA Disclosures')}
          </h1>
          <p className="text-sm sm:text-base text-ink-secondary">
            {t(
              'Obvezne pred-ugovorne informacije o društvu za zastupanje u osiguranju sukladno člancima 432. – 435. Zakona o osiguranju Republike Hrvatske.',
              'Mandatory pre-contractual insurance agency disclosures pursuant to Articles 432–435 of the Croatian Insurance Act.'
            )}
          </p>
        </div>

        <section className="rounded-editorial bg-canvas-warm border border-hairline p-6 sm:p-8 space-y-3 text-sm tabular-nums">
          <h2 className="font-sans text-base font-bold text-ink">
            {t('1. Podaci o društvu', '1. Company Details')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-ink-secondary">
            <div>
              <strong className="text-ink">{t('Tvrtka:', 'Legal Entity:')}</strong>{' '}
              {BRAND_CONFIG.legalName}
            </div>
            <div>
              <strong className="text-ink">{t('Status:', 'Status:')}</strong>{' '}
              {language === 'en' ? BRAND_CONFIG.legalStatusEn : BRAND_CONFIG.legalStatusHr}
            </div>
            <div>
              <strong className="text-ink">{t('Sjedište:', 'Headquarters:')}</strong>{' '}
              {BRAND_CONFIG.address}, {BRAND_CONFIG.postalCode} {BRAND_CONFIG.city}
            </div>
            <div>
              <strong className="text-ink">OIB / MBS:</strong> {BRAND_CONFIG.oib} / {BRAND_CONFIG.mbs}
            </div>
            <div>
              <strong className="text-ink">{t('Sudski registar:', 'Court Registry:')}</strong>{' '}
              {BRAND_CONFIG.courtRegistry}
            </div>
            <div>
              <strong className="text-ink">{t('Temeljni kapital:', 'Share Capital:')}</strong>{' '}
              {BRAND_CONFIG.shareCapital}
            </div>
            <div className="sm:col-span-2">
              <strong className="text-ink">{t('HANFA upisnik:', 'HANFA Registry:')}</strong>{' '}
              {BRAND_CONFIG.hanfaRegistrationNumber} —{' '}
              <a
                href={BRAND_CONFIG.hanfaRegistryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent font-semibold inline-flex items-center gap-1 hover:underline"
              >
                <span>{t('Provjeri na hanfa.hr', 'Verify on hanfa.hr')}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </section>

        <section className="space-y-3 text-sm text-ink-secondary leading-relaxed">
          <h2 className="font-sans text-base font-bold text-ink">
            {t(
              '2. Naknada za zastupanje (Remuneration Disclosure)',
              '2. Agency Remuneration Disclosure'
            )}
          </h2>
          <p>
            {t(
              `${BRAND_CONFIG.legalName} djeluje kao zastupnik u osiguranju u ime i za račun navedenih osiguravajućih društava. Za poslove distribucije osiguranja društvo prima isključivo proviziju koju isplaćuju osiguratelji iz obračunate premije. Ugovaratelj osiguranja ne snosi nikakav dodatni trošak ni agencijsku naknadu (0,00 €).`,
              `${BRAND_CONFIG.legalName} acts as an authorized insurance agency on behalf of the partner carriers listed below. For insurance distribution, the agency is compensated solely via commission paid by insurers from the calculated premium. Policyholders incur zero additional fees (€0.00).`
            )}
          </p>
        </section>

        <section className="space-y-3 text-sm text-ink-secondary leading-relaxed">
          <h2 className="font-sans text-base font-bold text-ink">
            {t('3. Popis zastupanih društava za osiguranje', '3. Represented Insurance Carriers')}
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {BRAND_CONFIG.partnerInsurers.map((p) => (
              <li key={p.id} className="p-3 rounded-lg border border-hairline text-ink font-medium">
                {p.name}
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-3 text-sm text-ink-secondary leading-relaxed">
          <h2 className="font-sans text-base font-bold text-ink">
            {t('4. Izvansudsko rješavanje sporova i prigovori', '4. Out-of-Court Dispute Resolution & Complaints')}
          </h2>
          <p>
            {t(
              'U slučaju nezadovoljstva uslugom, potrošači mogu podnijeti pisani prigovor putem stranice',
              'In case of dissatisfaction, consumers may submit a formal written complaint via our'
            )}{' '}
            <Link to="/prigovori" className="text-accent font-semibold underline">
              {t('Prigovori potrošača', 'Consumer Complaints')}
            </Link>{' '}
            {t('ili e-mailom na', 'page or by e-mail to')} {BRAND_CONFIG.complaintsEmail}.{' '}
            {t(
              'Za izvansudsko rješavanje sporova nadležan je Centar za mirenje pri Hrvatskom uredu za osiguranje (HUO):',
              'Out-of-court mediation is provided by the Mediation Center of the Croatian Insurance Bureau (HUO):'
            )}{' '}
            <a
              href={BRAND_CONFIG.huoMediationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent font-semibold underline"
            >
              huo.hr/centar-za-mirenje
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
};

export const PrivacyPage: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="bg-canvas py-14 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8 text-sm text-ink-secondary leading-relaxed">
        <div className="space-y-2 pb-6 border-b border-hairline">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">GDPR & AZOP</p>
          <h1 className="font-display text-4xl sm:text-5xl text-ink">
            {t('Politika zaštite privatnosti', 'Privacy Policy (GDPR)')}
          </h1>
        </div>
        <p>
          {t('Voditelj obrade osobnih podataka je', 'The data controller is')}{' '}
          <strong className="text-ink">{BRAND_CONFIG.legalName}</strong> ({BRAND_CONFIG.address},{' '}
          {BRAND_CONFIG.postalCode} {BRAND_CONFIG.city}, OIB: {BRAND_CONFIG.oib}).{' '}
          {t(
            'Osobne podatke obrađujemo u skladu s Općom uredbom o zaštiti podataka (EU 2016/679 — GDPR) i Zakonom o provedbi Opće uredbe o zaštiti podataka.',
            'We process personal data strictly in compliance with EU Regulation 2016/679 (GDPR) and the Croatian GDPR Implementation Act.'
          )}
        </p>
        <div className="space-y-2">
          <h2 className="font-sans text-base font-bold text-ink">
            {t('Koje podatke prikupljamo i zašto', 'What Data We Collect and Why')}
          </h2>
          <p>
            {t(
              'Prikupljamo isključivo nužne podatke za izradu informativnih i obvezujućih ponuda te podršku pri prijavi štete (ime, OIB, kontakt, podaci o vozilu ili nekretnini). Svaka privola bilježi se s vremenskom oznakom (timestamp), a marketinške obavijesti šalju se isključivo uz zasebnu, dobrovoljnu privolu.',
              'We collect only data strictly necessary to prepare binding insurance quotes and manage claims (name, OIB, contact info, insured asset details). Every consent is timestamped, and marketing messages require separate opt-in consent.'
            )}
          </p>
        </div>
        <div className="space-y-2">
          <h2 className="font-sans text-base font-bold text-ink">
            {t('Vaša prava (Pristup, Ispravak, Brisanje)', 'Your Rights (Access, Rectification, Erasure)')}
          </h2>
          <p>
            {t(
              'U svakom trenutku možete zatražiti uvid, ispravak, prijenos ili brisanje podataka slanjem zahtjeva na',
              'You may request access, correction, portability, or deletion of your personal data at any time by writing to'
            )}{' '}
            <strong className="text-ink">{BRAND_CONFIG.email}</strong>.{' '}
            {t(
              'Nadzorno tijelo je Agencija za zaštitu osobnih podataka (AZOP).',
              'The supervisory authority is the Croatian Personal Data Protection Agency (AZOP).'
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export const CookiesPage: React.FC = () => {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const resetCookies = () => {
    try {
      localStorage.removeItem(COOKIE_CONSENT_KEY);
    } catch {
      // ignore
    }
    showToast(
      t(
        'Postavke kolačića su poništene. Osvježite stranicu za ponovni odabir.',
        'Cookie preferences cleared. Refresh the page to select again.'
      ),
      'info'
    );
  };

  return (
    <div className="bg-canvas py-14 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8 text-sm text-ink-secondary leading-relaxed">
        <div className="space-y-2 pb-6 border-b border-hairline">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">
            {t('Postavke privatnosti', 'Privacy Preferences')}
          </p>
          <h1 className="font-display text-4xl sm:text-5xl text-ink">
            {t('Politika kolačića', 'Cookie Policy')}
          </h1>
        </div>
        <p>
          {t(
            'Koristimo samo nužnu lokalnu pohranu za čuvanje tijeka izračuna, jezičnog odabira (HR/EN) i sigurnosti prijave. Ne koristimo invazivne oglašivačke kolačiće trećih strana bez vaše izričite privole.',
            'We use only essential local/session storage for quote progress, language preference (HR/EN), and authentication security. We never load third-party ad trackers without your explicit consent.'
          )}
        </p>
        <Button variant="outline" onClick={resetCookies}>
          {t('Poništi pohranjene postavke kolačića', 'Reset Saved Cookie Preferences')}
        </Button>
      </div>
    </div>
  );
};

function createComplaintSchema(lang: Language) {
  const isEn = lang === 'en';
  return z.object({
    fullName: z
      .string()
      .trim()
      .min(3, isEn ? 'Enter your full name or company name.' : 'Unesite ime i prezime ili naziv tvrtke.'),
    oib: z.string().trim().refine((v) => isValidOIB(v), {
      message: isEn
        ? 'Enter a valid 11-digit Croatian OIB (ISO 7064 check).'
        : 'Unesite ispravan 11-znamenkasti OIB (ISO 7064 provjera).',
    }),
    email: z.string().trim().email(isEn ? 'Enter a valid e-mail address.' : 'Unesite ispravnu e-mail adresu.'),
    phone: z.string().trim().refine((v) => isValidCroatianPhone(v), {
      message: isEn ? 'Enter a valid Croatian phone number.' : 'Unesite ispravan hrvatski broj telefona.',
    }),
    address: z
      .string()
      .trim()
      .min(5, isEn ? 'Enter your postal address for written response.' : 'Unesite adresu za dostavu pisanog odgovora.'),
    policyNumber: z.string().trim().optional(),
    subject: z
      .string()
      .trim()
      .min(5, isEn ? 'Briefly state the subject of your complaint.' : 'Sažeto navedite predmet prigovora.'),
    description: z
      .string()
      .trim()
      .min(
        20,
        isEn
          ? 'Describe the details of your complaint (at least 20 characters).'
          : 'Opišite razloge prigovora (najmanje 20 znakova).'
      ),
  });
}

type ComplaintFormValues = z.infer<ReturnType<typeof createComplaintSchema>>;

export const ComplaintsPage: React.FC = () => {
  const { language, t } = useLanguage();
  const { showToast } = useToast();
  const [submitted, setSubmitted] = useState<ComplaintRecord | null>(null);
  const [submitError, setSubmitError] = useState('');

  const schema = useMemo(() => createComplaintSchema(language), [language]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ComplaintFormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: ComplaintFormValues) => {
    setSubmitError('');
    try {
      const saved = await agencyRepository.submitComplaint({
        fullName: values.fullName,
        oib: values.oib,
        email: values.email,
        phone: values.phone,
        address: values.address,
        policyNumber: values.policyNumber || undefined,
        subject: values.subject,
        description: values.description,
      });
      setSubmitted(saved);
      reset();
      showToast(
        t(
          `Prigovor urudžbiran pod oznakom ${saved.protocolNumber}.`,
          `Complaint logged under protocol ${saved.protocolNumber}.`
        ),
        'success'
      );
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : t('Urudžbiranje prigovora nije uspjelo.', 'Failed to submit complaint.');
      setSubmitError(msg);
      showToast(msg, 'error');
    }
  };

  return (
    <div className="bg-canvas py-14 sm:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="space-y-2 pb-6 border-b border-hairline">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">
            {t('Članak 401. Zakona o osiguranju', 'Article 401 — Croatian Insurance Act')}
          </p>
          <h1 className="font-display text-4xl sm:text-5xl text-ink">
            {t('Podnošenje prigovora potrošača', 'Submit a Formal Consumer Complaint')}
          </h1>
          <p className="text-sm sm:text-base text-ink-secondary">
            {t(
              'Na svaki pisani prigovor odgovaramo u zakonskom roku od najviše 15 dana od zaprimanja, uz izdavanje službenog urudžbenog broja.',
              'We respond to every written complaint within the statutory 15-day deadline and issue an official protocol number immediately.'
            )}
          </p>
        </div>

        {submitted ? (
          <div className="rounded-editorial bg-emerald-50 border border-emerald-200 p-6 space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-status-success shrink-0 mt-0.5" />
              <div className="space-y-1 text-sm text-ink">
                <h2 className="font-sans text-lg font-bold">
                  {t('Prigovor zaprimljen:', 'Complaint logged:')}{' '}
                  <span className="tabular-nums">{submitted.protocolNumber}</span>
                </h2>
                <p className="text-ink-secondary">
                  {t('Zakonski rok za naš pisani odgovor istječe', 'Statutory written response deadline:')}{' '}
                  <strong className="tabular-nums">{formatDateHr(submitted.statutoryDeadlineDate)}</strong>{' '}
                  ({t('15 dana', '15 days')}).{' '}
                  {t('Odgovor ćemo dostaviti na', 'We will deliver our response to')}{' '}
                  <strong>{submitted.email}</strong>.
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setSubmitted(null)}>
              {t('Podnesi novi prigovor', 'Submit another complaint')}
            </Button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="rounded-editorial bg-canvas-warm border border-hairline p-6 sm:p-8 space-y-4"
            noValidate
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={t('Ime i prezime / Tvrtka *', 'Full name / Company *')}
                error={errors.fullName?.message}
                {...register('fullName')}
              />
              <Input
                label={t('OIB (11 znamenki) *', 'Croatian OIB (11 digits) *')}
                placeholder="26182105152"
                maxLength={11}
                tabular
                error={errors.oib?.message}
                {...register('oib')}
              />
              <Input
                label={t('E-mail *', 'E-mail *')}
                type="email"
                error={errors.email?.message}
                {...register('email')}
              />
              <Input
                label={t('Telefon *', 'Phone *')}
                placeholder="+385 91 234 5678"
                tabular
                error={errors.phone?.message}
                {...register('phone')}
              />
            </div>
            <Input
              label={t('Adresa za pisani odgovor *', 'Address for written response *')}
              error={errors.address?.message}
              {...register('address')}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={t('Broj police (opcionalno)', 'Policy number (optional)')}
                tabular
                {...register('policyNumber')}
              />
              <Input
                label={t('Predmet prigovora *', 'Subject *')}
                error={errors.subject?.message}
                {...register('subject')}
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-ink">
                {t('Detaljno obrazloženje *', 'Detailed explanation *')}
              </label>
              <textarea
                rows={4}
                {...register('description')}
                className="w-full rounded-lg border border-hairline-strong bg-canvas p-3 text-sm text-ink focus:outline-none focus:border-accent"
              />
              {errors.description ? (
                <p role="alert" className="text-xs font-medium text-status-danger">
                  {errors.description.message}
                </p>
              ) : null}
            </div>
            {submitError ? (
              <div
                role="alert"
                className="rounded-lg bg-red-50 border border-red-200 p-3 flex items-start gap-2 text-xs text-status-danger font-medium"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{submitError}</span>
              </div>
            ) : null}
            <Button type="submit" size="lg" isLoading={isSubmitting}>
              {t('Urudžbiraj službeni prigovor', 'Log Official Complaint')}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};
