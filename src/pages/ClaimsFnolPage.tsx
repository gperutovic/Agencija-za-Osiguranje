import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  FileImage,
  Phone,
  Search,
  Trash2,
  Upload,
} from 'lucide-react';
import { BRAND_CONFIG } from '../config/brand';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import { PRODUCT_CATALOG } from '../i18n/translations';
import { agencyRepository } from '../services/agencyRepository';
import {
  ClaimAttachment,
  ClaimRecord,
  ClaimStage,
  Language,
  PolicyRecord,
  ProductLine,
  TrackedClaimPublic,
} from '../types/domain';
import {
  isValidCroatianPhone,
  isValidOIB,
  normalizeCroatianPhone,
} from '../utils/croatianValidators';
import { formatDateTimeHr } from '../utils/formatters';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useToast } from '../components/ui/Toast';

export const CLAIM_STAGES: Array<{ id: ClaimStage; label: string; labelEn: string }> = [
  { id: 'received', label: 'Zaprimljeno', labelEn: 'Received' },
  { id: 'insurer_review', label: 'U obradi kod osiguratelja', labelEn: 'Insurer Review' },
  { id: 'assessment', label: 'Procjena', labelEn: 'Assessment' },
  { id: 'paid', label: 'Isplaćeno', labelEn: 'Paid' },
];

export function getClaimStageLabel(stage: ClaimStage, lang: Language = 'hr'): string {
  const found = CLAIM_STAGES.find((s) => s.id === stage);
  if (!found) return stage;
  return lang === 'en' ? found.labelEn : found.label;
}

export const ClaimStageTimeline: React.FC<{ stage: ClaimStage }> = ({ stage }) => {
  const { language } = useLanguage();
  const activeIdx = CLAIM_STAGES.findIndex((s) => s.id === stage);
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
      {CLAIM_STAGES.map((item, idx) => {
        const done = idx <= activeIdx;
        const current = idx === activeIdx;
        return (
          <div
            key={item.id}
            className={`rounded-lg border p-3 text-xs ${
              current
                ? 'border-accent bg-accent-soft text-ink font-semibold'
                : done
                  ? 'border-emerald-200 bg-emerald-50 text-status-success font-semibold'
                  : 'border-hairline bg-canvas text-ink-muted'
            }`}
          >
            <div className="text-[10px] uppercase tracking-wider opacity-75 tabular-nums">
              0{idx + 1}
            </div>
            <div className="mt-0.5">{language === 'en' ? item.labelEn : item.label}</div>
          </div>
        );
      })}
    </div>
  );
};

export const ClaimsFnolPage: React.FC = () => {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const todayIso = new Date().toISOString().slice(0, 10);

  const [tab, setTab] = useState<'report' | 'track'>('report');
  const [step, setStep] = useState<number>(1);
  const [userPolicies, setUserPolicies] = useState<PolicyRecord[]>([]);

  // FNOL Form State
  const [policyNumber, setPolicyNumber] = useState('');
  const [productLine, setProductLine] = useState<ProductLine>('auto');
  const [carrierName, setCarrierName] = useState(BRAND_CONFIG.partnerInsurers[2]!.name);
  const [incidentDate, setIncidentDate] = useState(todayIso);
  const [incidentTime, setIncidentTime] = useState('14:30');
  const [incidentLocation, setIncidentLocation] = useState('');
  const [description, setDescription] = useState('');
  const [policeReportFiled, setPoliceReportFiled] = useState(false);
  const [policeStation, setPoliceStation] = useState('');
  const [policeReportNumber, setPoliceReportNumber] = useState('');
  const [attachments, setAttachments] = useState<ClaimAttachment[]>([]);
  const [claimantName, setClaimantName] = useState(user?.fullName ?? '');
  const [claimantOib, setClaimantOib] = useState(user?.oib ?? '');
  const [claimantEmail, setClaimantEmail] = useState(user?.email ?? '');
  const [claimantPhone, setClaimantPhone] = useState(user?.phone ?? '');
  const [gdprConsent, setGdprConsent] = useState(false);

  const [stepError, setStepError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedClaim, setSubmittedClaim] = useState<ClaimRecord | null>(null);

  // Secure Tracker State (referenceNumber + verificationFactor: last 4 digits of OIB or email)
  const [searchRef, setSearchRef] = useState('');
  const [verificationFactor, setVerificationFactor] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [trackedClaim, setTrackedClaim] = useState<TrackedClaimPublic | null>(null);
  const [trackNotFound, setTrackNotFound] = useState(false);

  useEffect(() => {
    if (!user) return;
    setClaimantName(user.fullName);
    setClaimantOib(user.oib ?? '');
    setClaimantEmail(user.email);
    setClaimantPhone(user.phone);
    void agencyRepository
      .getPolicies(user.uid)
      .then(setUserPolicies)
      .catch(() => setUserPolicies([]));
  }, [user]);

  const handleFilesSelected = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const tempClaimId = `draft-${Date.now()}`;
    const uploaded: ClaimAttachment[] = [];
    for (const file of Array.from(fileList)) {
      if (file.size > 10 * 1024 * 1024) {
        showToast(
          t(`Datoteka ${file.name} prelazi 10 MB.`, `File ${file.name} exceeds 10 MB.`),
          'error'
        );
        continue;
      }
      const att = await agencyRepository.uploadClaimAttachment(tempClaimId, file);
      uploaded.push(att);
    }
    setAttachments((prev) => [...prev, ...uploaded]);
    if (uploaded.length > 0) {
      showToast(
        t(`Dodano ${uploaded.length} dokument(a).`, `Added ${uploaded.length} attachment(s).`),
        'success'
      );
    }
  };

  const handleNext = () => {
    setStepError('');
    if (step === 1 && policyNumber.trim().length < 4) {
      setStepError(
        t(
          'Unesite broj police osiguranja ili odaberite policu s popisa.',
          'Enter your policy number or select one from your wallet.'
        )
      );
      return;
    }
    if (step === 2) {
      if (!incidentDate || incidentDate > todayIso) {
        setStepError(
          t(
            'Datum štetnog događaja ne može biti u budućnosti.',
            'Incident date cannot be in the future.'
          )
        );
        return;
      }
      if (incidentLocation.trim().length < 3) {
        setStepError(
          t('Unesite datum i lokaciju štetnog događaja.', 'Enter incident date and location.')
        );
        return;
      }
    }
    if (step === 3 && description.trim().length < 15) {
      setStepError(
        t(
          'Ukratko opišite okolnosti nastanka štete (najmanje 15 znakova).',
          'Briefly describe what happened (at least 15 characters).'
        )
      );
      return;
    }
    setStep((s) => Math.min(5, s + 1));
  };

  const handleSubmitClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    setStepError('');

    if (claimantName.trim().length < 3) {
      setStepError(t('Unesite puno ime i prezime prijavitelja.', 'Enter your full name.'));
      return;
    }
    if (!isValidOIB(claimantOib)) {
      setStepError(
        t(
          'Unesite ispravan 11-znamenkasti OIB (ISO 7064 provjera).',
          'Enter a valid 11-digit Croatian OIB (ISO 7064 check).'
        )
      );
      return;
    }
    if (!claimantEmail.includes('@')) {
      setStepError(t('Unesite ispravnu e-mail adresu.', 'Enter a valid e-mail address.'));
      return;
    }
    if (!isValidCroatianPhone(claimantPhone)) {
      setStepError(t('Unesite ispravan hrvatski broj telefona.', 'Enter a valid Croatian phone number.'));
      return;
    }
    if (!gdprConsent) {
      setStepError(
        t('Potrebna je GDPR privola za obradu prijave štete.', 'GDPR consent is required to submit a claim.')
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const saved = await agencyRepository.submitClaim({
        userId: user?.uid,
        policyNumber: policyNumber.trim().toUpperCase(),
        productLine,
        carrierName,
        claimantName: claimantName.trim(),
        claimantOib: claimantOib.trim(),
        claimantEmail: claimantEmail.trim(),
        claimantPhone: normalizeCroatianPhone(claimantPhone),
        incidentDate,
        incidentTime,
        incidentLocation: incidentLocation.trim(),
        description: description.trim(),
        policeReportFiled,
        policeStation: policeReportFiled ? policeStation.trim() || undefined : undefined,
        policeReportNumber: policeReportFiled ? policeReportNumber.trim() || undefined : undefined,
        attachments,
        consents: {
          ipidAcknowledged: true,
          gdprEssential: true,
          gdprMarketing: false,
          timestamp: new Date().toISOString(),
          policyVersion: '2026.1',
        },
      });
      setSubmittedClaim(saved);
      setTrackedClaim({
        referenceNumber: saved.referenceNumber,
        policyNumberMasked: `${saved.policyNumber.slice(0, 4)}••••${saved.policyNumber.slice(-3)}`,
        productLine: saved.productLine,
        carrierName: saved.carrierName,
        stage: saved.stage,
        stageHistory: saved.stageHistory,
        updatedAt: saved.updatedAt,
      });
      setSearchRef(saved.referenceNumber);
      setVerificationFactor(saved.claimantOib.slice(-4));
      showToast(
        t(
          `Prijava štete ${saved.referenceNumber} je uspješno zaprimljena.`,
          `Claim ${saved.referenceNumber} submitted successfully.`
        ),
        'success'
      );
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : t('Slanje prijave štete nije uspjelo.', 'Failed to submit claim.');
      setStepError(msg);
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTrackSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setTrackNotFound(false);
    if (searchRef.trim().length < 4 || verificationFactor.trim().length < 4) {
      setTrackNotFound(true);
      return;
    }
    setIsTracking(true);
    try {
      const found = await agencyRepository.trackClaimSecure(searchRef, verificationFactor);
      setTrackedClaim(found);
      if (!found) setTrackNotFound(true);
    } finally {
      setIsTracking(false);
    }
  };

  return (
    <div className="bg-canvas py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Empathetic Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-hairline">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">
              {t('Digitalna prijava štete (FNOL)', 'Digital Claims Intake (FNOL)')}
            </p>
            <h1 className="font-display text-4xl sm:text-5xl text-ink">
              {t('Tu smo kad se dogodi nezgoda.', 'Here for you when an incident happens.')}
            </h1>
            <p className="text-sm sm:text-base text-ink-secondary max-w-xl">
              {t(
                'Prijavite štetu u 5 mirnih koraka. Dobivate trenutan referentni broj i zastupnika koji vodi postupak s osigurateljem umjesto vas.',
                'File your claim in 5 calm steps. Get an instant reference number and a licensed advisor handling carrier communication for you.'
              )}
            </p>
          </div>
          <a
            href={`tel:${BRAND_CONFIG.claimsPhone.replace(/\s+/g, '')}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-hairline bg-canvas-warm text-xs font-semibold text-ink hover:border-ink transition-colors tabular-nums shrink-0 self-start sm:self-auto"
          >
            <Phone className="w-4 h-4 text-accent" strokeWidth={1.5} />
            <span>
              {t('Hitna asistencija:', '24/7 Emergency:')} {BRAND_CONFIG.claimsPhone}
            </span>
          </a>
        </div>

        {/* Tab Switcher */}
        <div className="inline-flex rounded-lg border border-hairline bg-canvas-warm p-1">
          <button
            type="button"
            onClick={() => setTab('report')}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
              tab === 'report' ? 'bg-canvas text-ink shadow-subtle' : 'text-ink-secondary hover:text-ink'
            }`}
          >
            {t('Nova prijava štete', 'File a New Claim')}
          </button>
          <button
            type="button"
            onClick={() => setTab('track')}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
              tab === 'track' ? 'bg-canvas text-ink shadow-subtle' : 'text-ink-secondary hover:text-ink'
            }`}
          >
            {t('Prati status prijave', 'Track Claim Status')}
          </button>
        </div>

        {/* TAB 1: GUIDED 5-STEP FNOL */}
        {tab === 'report' ? (
          submittedClaim ? (
            <div className="rounded-editorial bg-canvas border border-hairline p-6 sm:p-10 space-y-6 animate-step">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-7 h-7 text-status-success shrink-0" strokeWidth={1.75} />
                <div className="space-y-1">
                  <Badge variant="success">{t('Prijava zaprimljena', 'Claim received')}</Badge>
                  <h2 className="font-display text-3xl text-ink">
                    {t('Referentni broj:', 'Reference number:')}{' '}
                    <span className="tabular-nums">{submittedClaim.referenceNumber}</span>
                  </h2>
                  <p className="text-sm text-ink-secondary">
                    {t(
                      `Vaša prijava za policu ${submittedClaim.policyNumber} (${submittedClaim.carrierName}) zaprimljena je s ${submittedClaim.attachments.length} prilogom/a.`,
                      `Your claim for policy ${submittedClaim.policyNumber} (${submittedClaim.carrierName}) was received with ${submittedClaim.attachments.length} attachment(s).`
                    )}
                  </p>
                </div>
              </div>

              <ClaimStageTimeline stage={submittedClaim.stage} />

              <div className="flex flex-wrap gap-3 pt-2">
                <Button onClick={() => setTab('track')}>
                  {t('Otvori praćenje statusa', 'Open status tracker')}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSubmittedClaim(null);
                    setStep(1);
                    setAttachments([]);
                    setDescription('');
                  }}
                >
                  {t('Prijavi novu štetu', 'File another claim')}
                </Button>
              </div>
            </div>
          ) : (
            <div className="rounded-editorial bg-canvas border border-hairline p-6 sm:p-8 space-y-6">
              {/* Step Indicator */}
              <div className="flex items-center justify-between text-xs text-ink-muted tabular-nums pb-4 border-b border-hairline">
                <span className="font-semibold text-ink">
                  {t(`Korak ${step} od 5`, `Step ${step} of 5`)}
                </span>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span
                      key={s}
                      className={`h-1.5 w-8 rounded-full ${
                        s <= step ? 'bg-accent' : 'bg-hairline'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {step === 1 ? (
                <div className="space-y-5 animate-step">
                  <h2 className="font-display text-3xl text-ink">
                    {t('1. Polica i vrsta štete', '1. Policy & Claim Type')}
                  </h2>
                  {userPolicies.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-ink-secondary">
                        {t('Odaberite iz vašeg novčanika polica:', 'Select from your policy wallet:')}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {userPolicies.map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => {
                              setPolicyNumber(p.policyNumber);
                              setProductLine(p.productLine);
                              setCarrierName(p.carrierName);
                            }}
                            className={`p-3.5 rounded-lg border text-left transition-colors ${
                              policyNumber === p.policyNumber
                                ? 'border-accent bg-accent-soft'
                                : 'border-hairline hover:border-ink'
                            }`}
                          >
                            <div className="text-xs font-bold text-ink tabular-nums">
                              {p.policyNumber}
                            </div>
                            <div className="text-xs text-ink-secondary mt-0.5">{p.assetSummary}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label={t('Broj police *', 'Policy number *')}
                      placeholder="npr. GEN-AO-2026-441082"
                      value={policyNumber}
                      onChange={(e) => setPolicyNumber(e.target.value)}
                      tabular
                    />
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-ink">
                        {t('Vrsta osiguranja', 'Insurance line')}
                      </label>
                      <select
                        value={productLine}
                        onChange={(e) => setProductLine(e.target.value as ProductLine)}
                        className="w-full h-11 rounded-lg border border-hairline-strong bg-canvas px-3 text-sm text-ink"
                      >
                        {PRODUCT_CATALOG.map((p) => (
                          <option key={p.id} value={p.id}>
                            {language === 'en' ? p.nameEn : p.nameHr}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-ink">
                      {t('Osiguratelj', 'Insurer')}
                    </label>
                    <select
                      value={carrierName}
                      onChange={(e) => setCarrierName(e.target.value)}
                      className="w-full h-11 rounded-lg border border-hairline-strong bg-canvas px-3 text-sm text-ink"
                    >
                      {BRAND_CONFIG.partnerInsurers.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : null}

              {step === 2 ? (
                <div className="space-y-5 animate-step">
                  <h2 className="font-display text-3xl text-ink">
                    {t('2. Kada i gdje se šteta dogodila?', '2. When and where did it happen?')}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label={t('Datum nezgode *', 'Incident date *')}
                      type="date"
                      max={todayIso}
                      value={incidentDate}
                      onChange={(e) => setIncidentDate(e.target.value)}
                      tabular
                    />
                    <Input
                      label={t('Okvirno vrijeme *', 'Approximate time *')}
                      type="time"
                      value={incidentTime}
                      onChange={(e) => setIncidentTime(e.target.value)}
                      tabular
                    />
                  </div>
                  <Input
                    label={t('Lokacija štetnog događaja (grad, ulica) *', 'Incident location (city, street) *')}
                    placeholder={t('npr. Zagreb, Savska cesta 41', 'e.g. Zagreb, Savska cesta 41')}
                    value={incidentLocation}
                    onChange={(e) => setIncidentLocation(e.target.value)}
                  />
                </div>
              ) : null}

              {step === 3 ? (
                <div className="space-y-5 animate-step">
                  <h2 className="font-display text-3xl text-ink">
                    {t('3. Opis štetnog događaja', '3. Incident description')}
                  </h2>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-ink">
                      {t(
                        'Opišite ukratko što se dogodilo i što je oštećeno *',
                        'Briefly describe what happened and what was damaged *'
                      )}
                    </label>
                    <textarea
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder={t(
                        'Navedite smjer kretanja, vidljiva oštećenja ili okolnosti nastanka štete...',
                        'Describe circumstances, visible damage, or involved parties...'
                      )}
                      className="w-full rounded-lg border border-hairline-strong p-3.5 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:border-accent"
                    />
                  </div>

                  <div className="rounded-editorial border border-hairline p-4 space-y-4">
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-sm font-medium text-ink">
                        {t(
                          'Je li pozvana policija i sastavljen zapisnik?',
                          'Was the police called and a report filed?'
                        )}
                      </span>
                      <input
                        type="checkbox"
                        checked={policeReportFiled}
                        onChange={(e) => setPoliceReportFiled(e.target.checked)}
                        className="w-5 h-5 accent-accent"
                      />
                    </label>

                    {policeReportFiled ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-hairline animate-step">
                        <Input
                          label={t('Policijska postaja (opcionalno)', 'Police station (optional)')}
                          placeholder={t('npr. II. PGP Zagreb', 'e.g. Zagreb Police Dept.')}
                          value={policeStation}
                          onChange={(e) => setPoliceStation(e.target.value)}
                        />
                        <Input
                          label={t('Broj zapisnika (opcionalno)', 'Police report number (optional)')}
                          placeholder="npr. 511-19-2026-104"
                          value={policeReportNumber}
                          onChange={(e) => setPoliceReportNumber(e.target.value)}
                          tabular
                        />
                      </div>
                    ) : null}
                  </div>

                  {/* Quick Helper Checklist for European Accident Statement */}
                  <div className="rounded-editorial bg-canvas-warm border border-hairline p-4 space-y-2 text-xs">
                    <div className="flex items-center gap-2 font-semibold text-ink">
                      <ClipboardCheck className="w-4 h-4 text-accent" strokeWidth={1.75} />
                      <span>
                        {t(
                          'Brzi podsjetnik — Europsko izvješće o nezgodi',
                          'Quick Checklist — European Accident Statement'
                        )}
                      </span>
                    </div>
                    <ul className="space-y-1 text-ink-secondary list-disc pl-5">
                      <li>
                        {t(
                          'Fotografirajte oba vozila (ili oštećeni objekt) iz šireg kuta i izbliza.',
                          'Take both wide-angle and close-up photos of damage and plates.'
                        )}
                      </li>
                      <li>
                        {t(
                          'Razmijenite podatke s drugim sudionikom (ime, OIB, registracija, broj AO police).',
                          'Exchange details with any other party (name, plate, AO policy number).'
                        )}
                      </li>
                      <li>
                        {t(
                          'Oba vozača potpisuju Europsko izvješće — priložite fotografiju u idućem koraku.',
                          'Ensure both drivers sign the European Accident Statement and upload a photo next.'
                        )}
                      </li>
                    </ul>
                  </div>
                </div>
              ) : null}

              {step === 4 ? (
                <div className="space-y-5 animate-step">
                  <h2 className="font-display text-3xl text-ink">
                    {t(
                      '4. Fotografije i dokumentacija (Europsko izvješće)',
                      '4. Photos & Documentation'
                    )}
                  </h2>
                  <p className="text-sm text-ink-secondary">
                    {t(
                      'Priložite fotografije oštećenja, Europsko izvješće o nezgodi ili policijski zapisnik (PDF / JPG / PNG, do 10 MB).',
                      'Attach damage photos, European Accident Statement, or police report (PDF / JPG / PNG, up to 10 MB).'
                    )}
                  </p>
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      void handleFilesSelected(e.dataTransfer.files);
                    }}
                    className="rounded-editorial border-2 border-dashed border-hairline-strong bg-canvas-warm p-8 text-center space-y-3"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".pdf,image/jpeg,image/png,image/webp"
                      onChange={(e) => void handleFilesSelected(e.target.files)}
                      className="hidden"
                      aria-label={t('Priloži fotografije ili dokumente štete', 'Attach claim photos or documents')}
                    />
                    <Upload className="w-6 h-6 mx-auto text-ink" strokeWidth={1.5} />
                    <div className="text-sm font-medium text-ink">
                      {t(
                        'Povucite fotografije ili PDF dokumente ovdje',
                        'Drag and drop photos or PDF documents here'
                      )}
                    </div>
                    <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                      {t('Odaberi datoteke', 'Select files')}
                    </Button>
                  </div>

                  {attachments.length > 0 ? (
                    <div className="space-y-2">
                      {attachments.map((att) => (
                        <div
                          key={att.id}
                          className="flex items-center justify-between gap-3 p-3 rounded-lg border border-hairline bg-canvas"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {att.previewDataUrl ? (
                              <img
                                src={att.previewDataUrl}
                                alt={att.name}
                                className="w-10 h-10 rounded object-cover border border-hairline shrink-0"
                              />
                            ) : (
                              <FileImage className="w-5 h-5 text-ink-muted shrink-0" strokeWidth={1.5} />
                            )}
                            <div className="min-w-0">
                              <div className="text-xs font-semibold text-ink truncate">
                                {att.name}
                              </div>
                              <div className="text-[11px] text-ink-muted tabular-nums">
                                {Math.max(1, Math.round(att.sizeBytes / 1024))} KB
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setAttachments((prev) => prev.filter((item) => item.id !== att.id))
                            }
                            className="p-1.5 text-ink-muted hover:text-status-danger"
                            aria-label={t('Ukloni prilog', 'Remove attachment')}
                          >
                            <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : null}

              {step === 5 ? (
                <form onSubmit={handleSubmitClaim} className="space-y-5 animate-step" noValidate>
                  <h2 className="font-display text-3xl text-ink">
                    {t('5. Podaci prijavitelja i slanje', '5. Claimant details & submit')}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label={t('Ime i prezime *', 'Full name *')}
                      value={claimantName}
                      onChange={(e) => setClaimantName(e.target.value)}
                      placeholder="Ana Horvat"
                    />
                    <Input
                      label={t('OIB (11 znamenki) *', 'Croatian OIB (11 digits) *')}
                      maxLength={11}
                      value={claimantOib}
                      onChange={(e) => setClaimantOib(e.target.value)}
                      placeholder="26182105152"
                      tabular
                    />
                    <Input
                      label={t('E-mail adresa *', 'E-mail address *')}
                      type="email"
                      value={claimantEmail}
                      onChange={(e) => setClaimantEmail(e.target.value)}
                      placeholder="ana@email.hr"
                    />
                    <Input
                      label={t('Mobitel / telefon *', 'Phone number *')}
                      value={claimantPhone}
                      onChange={(e) => setClaimantPhone(e.target.value)}
                      placeholder="+385 91 234 5678"
                      tabular
                    />
                  </div>

                  <label className="flex items-start gap-2.5 p-4 rounded-editorial bg-canvas-warm border border-hairline text-xs text-ink cursor-pointer">
                    <input
                      type="checkbox"
                      checked={gdprConsent}
                      onChange={(e) => setGdprConsent(e.target.checked)}
                      className="mt-0.5 accent-accent"
                    />
                    <span>
                      {t(
                        'Suglasan/na sam s obradom i prosljeđivanjem podataka i fotografija nadležnom osiguratelju radi rješavanja odštetnog zahtjeva (GDPR). *',
                        'I consent to processing and forwarding claim details and photos to the relevant insurer for claims handling under GDPR. *'
                      )}
                    </span>
                  </label>

                  {stepError ? (
                    <p role="alert" className="text-xs font-medium text-status-danger">
                      {stepError}
                    </p>
                  ) : null}

                  <div className="flex items-center justify-between pt-3 border-t border-hairline">
                    <Button variant="ghost" onClick={() => setStep(4)}>
                      <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
                      <span>{t('Natrag', 'Back')}</span>
                    </Button>
                    <Button type="submit" size="lg" isLoading={isSubmitting}>
                      {t('Pošalji prijavu štete', 'Submit Claim')}
                    </Button>
                  </div>
                </form>
              ) : null}

              {step < 5 ? (
                <>
                  {stepError ? (
                    <p role="alert" className="text-xs font-medium text-status-danger">
                      {stepError}
                    </p>
                  ) : null}
                  <div className="flex items-center justify-between pt-4 border-t border-hairline">
                    <Button
                      variant="ghost"
                      disabled={step === 1}
                      onClick={() => {
                        setStepError('');
                        setStep((s) => Math.max(1, s - 1));
                      }}
                    >
                      <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
                      <span>{t('Natrag', 'Back')}</span>
                    </Button>
                    <Button onClick={handleNext}>
                      <span>{t('Nastavi', 'Continue')}</span>
                      <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
                    </Button>
                  </div>
                </>
              ) : null}
            </div>
          )
        ) : (
          /* TAB 2: SECURE LIVE CLAIM STATUS TRACKER (2nd factor verified via /api/claims/track) */
          <div className="space-y-6 animate-step">
            <form
              onSubmit={handleTrackSearch}
              className="rounded-editorial bg-canvas-warm border border-hairline p-5 sm:p-6 space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label={t('Referentni broj štete *', 'Claim reference number *')}
                  value={searchRef}
                  onChange={(e) => setSearchRef(e.target.value)}
                  placeholder="STETA-2026-1042"
                  tabular
                />
                <Input
                  label={t(
                    'Verifikacija: zadnje 4 znamenke OIB-a ili e-mail *',
                    'Verification: last 4 OIB digits or e-mail *'
                  )}
                  value={verificationFactor}
                  onChange={(e) => setVerificationFactor(e.target.value)}
                  placeholder={t('npr. 5152 ili ana@email.hr', 'e.g. 5152 or ana@email.hr')}
                />
              </div>
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <p className="text-xs text-ink-muted">
                  {t(
                    'Radi GDPR zaštite prikazujemo samo status i faze obrade bez osobnih podataka.',
                    'For GDPR privacy, only safe claim stage progress is displayed without PII.'
                  )}
                </p>
                <Button type="submit" isLoading={isTracking}>
                  <Search className="w-4 h-4" strokeWidth={1.75} />
                  <span>{t('Provjeri status', 'Check status')}</span>
                </Button>
              </div>
            </form>

            {trackNotFound ? (
              <div className="rounded-editorial border border-hairline p-6 text-sm text-ink-secondary">
                {t(
                  'Nismo pronašli prijavu za uneseni referentni broj i verifikacijski podatak. Provjerite točnost broja prijave i zadnje 4 znamenke OIB-a ili e-mail adrese.',
                  'No matching claim found for the provided reference number and verification factor. Please check both fields.'
                )}
              </div>
            ) : null}

            {trackedClaim ? (
              <div className="rounded-editorial bg-canvas border border-hairline p-6 sm:p-8 space-y-6">
                <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-hairline">
                  <div>
                    <div className="text-xs font-semibold text-ink-muted tabular-nums">
                      {trackedClaim.referenceNumber} • {t('Polica', 'Policy')}{' '}
                      {trackedClaim.policyNumberMasked}
                    </div>
                    <h2 className="font-display text-3xl text-ink mt-1">
                      {trackedClaim.carrierName}
                    </h2>
                    <p className="text-xs text-ink-secondary mt-1 tabular-nums">
                      {t('Zadnje ažuriranje:', 'Last updated:')}{' '}
                      {formatDateTimeHr(trackedClaim.updatedAt)}
                    </p>
                  </div>
                  <Badge variant="accent">
                    {getClaimStageLabel(trackedClaim.stage, language)}
                  </Badge>
                </div>

                <ClaimStageTimeline stage={trackedClaim.stage} />

                <div className="space-y-2.5 pt-2">
                  <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-ink-muted">
                    {t('Kronologija obrade', 'Processing timeline')}
                  </h3>
                  <ul className="space-y-2">
                    {trackedClaim.stageHistory.map((h, i) => (
                      <li
                        key={`${h.stage}-${i}`}
                        className="flex items-start justify-between gap-4 text-xs p-3 rounded-lg bg-canvas-warm border border-hairline"
                      >
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-accent">
                            {getClaimStageLabel(h.stage, language)}
                          </span>
                          <div className="text-ink font-medium">{h.note}</div>
                        </div>
                        <span className="text-ink-muted tabular-nums shrink-0">
                          {formatDateTimeHr(h.timestamp)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};
