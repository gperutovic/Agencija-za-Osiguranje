import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle2, ExternalLink } from 'lucide-react';
import { BRAND_CONFIG } from '../config/brand';
import { agencyRepository } from '../services/agencyRepository';
import { ComplaintRecord } from '../types/domain';
import { isValidCroatianPhone, isValidOIB } from '../utils/croatianValidators';
import { formatDateHr } from '../utils/formatters';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useToast } from '../components/ui/Toast';

export const LegalDisclosuresPage: React.FC = () => (
  <div className="bg-canvas py-14 sm:py-20">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
      <div className="space-y-3 pb-6 border-b border-hairline">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">
          Zakon o osiguranju & EU IDD (2016/97)
        </p>
        <h1 className="font-display text-4xl sm:text-5xl text-ink">
          Pravne informacije i HANFA obavijesti
        </h1>
        <p className="text-sm sm:text-base text-ink-secondary">
          Obvezne pred-ugovorne informacije o društvu za zastupanje u osiguranju sukladno člancima
          432. – 435. Zakona o osiguranju Republike Hrvatske.
        </p>
      </div>

      <section className="rounded-editorial bg-canvas-warm border border-hairline p-6 sm:p-8 space-y-3 text-sm tabular-nums">
        <h2 className="font-sans text-base font-bold text-ink">1. Podaci o društvu</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-ink-secondary">
          <div>
            <strong className="text-ink">Tvrtka:</strong> {BRAND_CONFIG.legalName}
          </div>
          <div>
            <strong className="text-ink">Status:</strong> {BRAND_CONFIG.legalStatusHr}
          </div>
          <div>
            <strong className="text-ink">Sjedište:</strong> {BRAND_CONFIG.address},{' '}
            {BRAND_CONFIG.postalCode} {BRAND_CONFIG.city}
          </div>
          <div>
            <strong className="text-ink">OIB / MBS:</strong> {BRAND_CONFIG.oib} / {BRAND_CONFIG.mbs}
          </div>
          <div>
            <strong className="text-ink">Sudski registar:</strong> {BRAND_CONFIG.courtRegistry}
          </div>
          <div>
            <strong className="text-ink">Temeljni kapital:</strong> {BRAND_CONFIG.shareCapital}
          </div>
          <div className="sm:col-span-2">
            <strong className="text-ink">HANFA upisnik:</strong>{' '}
            {BRAND_CONFIG.hanfaRegistrationNumber} —{' '}
            <a
              href={BRAND_CONFIG.hanfaRegistryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent font-semibold inline-flex items-center gap-1 hover:underline"
            >
              <span>Provjeri na hanfa.hr</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      <section className="space-y-3 text-sm text-ink-secondary leading-relaxed">
        <h2 className="font-sans text-base font-bold text-ink">
          2. Naknada za zastupanje (Remuneration Disclosure)
        </h2>
        <p>
          {BRAND_CONFIG.legalName} djeluje kao zastupnik u osiguranju u ime i za račun navedenih
          osiguravajućih društava. Za poslove distribucije osiguranja društvo prima isključivo
          proviziju koju isplaćuju osiguratelji iz obračunate premije. Ugovaratelj osiguranja ne
          snosi nikakav dodatni trošak ni agencijsku naknadu (0,00 €).
        </p>
      </section>

      <section className="space-y-3 text-sm text-ink-secondary leading-relaxed">
        <h2 className="font-sans text-base font-bold text-ink">
          3. Popis zastupanih društava za osiguranje
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
          4. Izvansudsko rješavanje sporova i prigovori
        </h2>
        <p>
          U slučaju nezadovoljstva uslugom, potrošači mogu podnijeti pisani prigovor putem stranice{' '}
          <a href="/prigovori" className="text-accent font-semibold underline">
            Prigovori potrošača
          </a>{' '}
          ili e-mailom na {BRAND_CONFIG.complaintsEmail}. Za izvansudsko rješavanje sporova
          nadležan je Centar za mirenje pri Hrvatskom uredu za osiguranje (HUO):{' '}
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

export const PrivacyPage: React.FC = () => (
  <div className="bg-canvas py-14 sm:py-20">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8 text-sm text-ink-secondary leading-relaxed">
      <div className="space-y-2 pb-6 border-b border-hairline">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">GDPR & AZOP</p>
        <h1 className="font-display text-4xl sm:text-5xl text-ink">Politika zaštite privatnosti</h1>
      </div>
      <p>
        Voditelj obrade osobnih podataka je <strong className="text-ink">{BRAND_CONFIG.legalName}</strong>{' '}
        ({BRAND_CONFIG.address}, {BRAND_CONFIG.postalCode} {BRAND_CONFIG.city}, OIB:{' '}
        {BRAND_CONFIG.oib}). Osobne podatke obrađujemo u skladu s Općom uredbom o zaštiti podataka
        (EU 2016/679 — GDPR) i Zakonom o provedbi Opće uredbe o zaštiti podataka.
      </p>
      <div className="space-y-2">
        <h2 className="font-sans text-base font-bold text-ink">Koje podatke prikupljamo i zašto</h2>
        <p>
          Prikupljamo isključivo nužne podatke za izradu informativnih i obvezujućih ponuda te
          podršku pri prijavi štete (ime, OIB, kontakt, podaci o vozilu ili nekretnini). Svaka
          privola bilježi se s vremenskom oznakom (timestamp), a marketinške obavijesti šalju se
          isključivo uz zasebnu, dobrovoljnu privolu.
        </p>
      </div>
      <div className="space-y-2">
        <h2 className="font-sans text-base font-bold text-ink">Vaša prava (Pristup, Ispravak, Brisanje)</h2>
        <p>
          U svakom trenutku možete zatražiti uvid, ispravak, prijenos ili brisanje podataka slanjem
          zahtjeva na <strong className="text-ink">{BRAND_CONFIG.email}</strong>. Nadzorno tijelo
          je Agencija za zaštitu osobnih podataka (AZOP).
        </p>
      </div>
    </div>
  </div>
);

export const CookiesPage: React.FC = () => {
  const { showToast } = useToast();
  const resetCookies = () => {
    try {
      localStorage.removeItem('jasno_cookie_consent_v1');
    } catch {
      // ignore
    }
    showToast('Postavke kolačića su poništene. Osvježite stranicu za ponovni odabir.', 'info');
  };

  return (
    <div className="bg-canvas py-14 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8 text-sm text-ink-secondary leading-relaxed">
        <div className="space-y-2 pb-6 border-b border-hairline">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">
            Postavke privatnosti
          </p>
          <h1 className="font-display text-4xl sm:text-5xl text-ink">Politika kolačića</h1>
        </div>
        <p>
          Koristimo samo nužnu lokalnu pohranu za čuvanje tijeka izračuna, jezičnog odabira (HR/EN)
          i korisničke sesije. Ne koristimo invazivne oglašivačke kolačiće trećih strana bez vaše
          izričite privole.
        </p>
        <Button variant="outline" onClick={resetCookies}>
          Poništi pohranjene postavke kolačića
        </Button>
      </div>
    </div>
  );
};

const complaintSchema = z.object({
  fullName: z.string().trim().min(3, 'Unesite ime i prezime ili naziv tvrtke'),
  oib: z.string().trim().refine((v) => isValidOIB(v), {
    message: 'Unesite ispravan 11-znamenkasti OIB (ISO 7064 provjera).',
  }),
  email: z.string().trim().email('Unesite ispravnu e-mail adresu'),
  phone: z.string().trim().refine((v) => isValidCroatianPhone(v), {
    message: 'Unesite ispravan hrvatski broj telefona.',
  }),
  address: z.string().trim().min(5, 'Unesite adresu za dostavu pisanog odgovora'),
  policyNumber: z.string().trim().optional(),
  subject: z.string().trim().min(5, 'Sažeto navedite predmet prigovora'),
  description: z.string().trim().min(20, 'Opišite razloge prigovora (najmanje 20 znakova)'),
});

type ComplaintFormValues = z.infer<typeof complaintSchema>;

export const ComplaintsPage: React.FC = () => {
  const { showToast } = useToast();
  const [submitted, setSubmitted] = useState<ComplaintRecord | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ComplaintFormValues>({
    resolver: zodResolver(complaintSchema),
  });

  const onSubmit = async (values: ComplaintFormValues) => {
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
    showToast(`Prigovor urudžbiran pod oznakom ${saved.protocolNumber}.`, 'success');
  };

  return (
    <div className="bg-canvas py-14 sm:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="space-y-2 pb-6 border-b border-hairline">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">
            Članak 401. Zakona o osiguranju
          </p>
          <h1 className="font-display text-4xl sm:text-5xl text-ink">
            Podnošenje prigovora potrošača
          </h1>
          <p className="text-sm sm:text-base text-ink-secondary">
            Na svaki pisani prigovor odgovaramo u zakonskom roku od najviše 15 dana od zaprimanja,
            uz izdavanje službenog urudžbenog broja.
          </p>
        </div>

        {submitted ? (
          <div className="rounded-editorial bg-emerald-50 border border-emerald-200 p-6 space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-status-success shrink-0 mt-0.5" />
              <div className="space-y-1 text-sm text-ink">
                <h2 className="font-sans text-lg font-bold">
                  Prigovor zaprimljen: <span className="tabular-nums">{submitted.protocolNumber}</span>
                </h2>
                <p className="text-ink-secondary">
                  Zakonski rok za naš pisani odgovor istječe{' '}
                  <strong className="tabular-nums">{formatDateHr(submitted.statutoryDeadlineDate)}</strong>{' '}
                  (15 dana). Odgovor ćemo dostaviti na <strong>{submitted.email}</strong>.
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setSubmitted(null)}>
              Podnesi novi prigovor
            </Button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="rounded-editorial bg-canvas-warm border border-hairline p-6 sm:p-8 space-y-4"
            noValidate
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Ime i prezime / Tvrtka *" error={errors.fullName?.message} {...register('fullName')} />
              <Input label="OIB (11 znamenki) *" maxLength={11} tabular error={errors.oib?.message} {...register('oib')} />
              <Input label="E-mail *" type="email" error={errors.email?.message} {...register('email')} />
              <Input label="Telefon *" tabular error={errors.phone?.message} {...register('phone')} />
            </div>
            <Input label="Adresa za pisani odgovor *" error={errors.address?.message} {...register('address')} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Broj police (opcionalno)" tabular {...register('policyNumber')} />
              <Input label="Predmet prigovora *" error={errors.subject?.message} {...register('subject')} />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-ink">Detaljno obrazloženje *</label>
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
            <Button type="submit" size="lg" isLoading={isSubmitting}>
              Urudžbiraj službeni prigovor
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};
