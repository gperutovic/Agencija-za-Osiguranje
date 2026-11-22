import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileImage,
  Phone,
  Search,
  Trash2,
  Upload,
} from 'lucide-react';
import { BRAND_CONFIG } from '../config/brand';
import { useAuth } from '../context/AuthContext';
import { PRODUCT_CATALOG } from '../i18n/translations';
import { agencyRepository } from '../services/agencyRepository';
import {
  ClaimAttachment,
  ClaimRecord,
  ClaimStage,
  PolicyRecord,
  ProductLine,
} from '../types/domain';
import {
  isValidCroatianPhone,
  isValidOIB,
  normalizeCroatianPhone,
} from '../utils/croatianValidators';
import { formatDateHr, formatDateTimeHr } from '../utils/formatters';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useToast } from '../components/ui/Toast';

export const CLAIM_STAGES: Array<{ id: ClaimStage; label: string }> = [
  { id: 'received', label: 'Zaprimljeno' },
  { id: 'insurer_review', label: 'U obradi kod osiguratelja' },
  { id: 'assessment', label: 'Procjena' },
  { id: 'paid', label: 'Isplaćeno' },
];

export const ClaimStageTimeline: React.FC<{ stage: ClaimStage }> = ({ stage }) => {
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
            <div className="mt-0.5">{item.label}</div>
          </div>
        );
      })}
    </div>
  );
};

export const ClaimsFnolPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [tab, setTab] = useState<'report' | 'track'>('report');
  const [step, setStep] = useState<number>(1);
  const [userPolicies, setUserPolicies] = useState<PolicyRecord[]>([]);

  // FNOL Form State
  const [policyNumber, setPolicyNumber] = useState('');
  const [productLine, setProductLine] = useState<ProductLine>('auto');
  const [carrierName, setCarrierName] = useState(BRAND_CONFIG.partnerInsurers[2]!.name);
  const [incidentDate, setIncidentDate] = useState(new Date().toISOString().slice(0, 10));
  const [incidentTime, setIncidentTime] = useState('14:30');
  const [incidentLocation, setIncidentLocation] = useState('');
  const [description, setDescription] = useState('');
  const [policeReportFiled, setPoliceReportFiled] = useState(false);
  const [attachments, setAttachments] = useState<ClaimAttachment[]>([]);
  const [claimantName, setClaimantName] = useState(user?.fullName ?? '');
  const [claimantOib, setClaimantOib] = useState(user?.oib ?? '');
  const [claimantEmail, setClaimantEmail] = useState(user?.email ?? '');
  const [claimantPhone, setClaimantPhone] = useState(user?.phone ?? '');
  const [gdprConsent, setGdprConsent] = useState(false);

  const [stepError, setStepError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedClaim, setSubmittedClaim] = useState<ClaimRecord | null>(null);

  // Tracker State
  const [searchRef, setSearchRef] = useState('STETA-2026-1042');
  const [trackedClaim, setTrackedClaim] = useState<ClaimRecord | null>(null);
  const [trackNotFound, setTrackNotFound] = useState(false);

  useEffect(() => {
    if (!user) return;
    setClaimantName(user.fullName);
    setClaimantOib(user.oib ?? '');
    setClaimantEmail(user.email);
    setClaimantPhone(user.phone);
    void agencyRepository.getPolicies(user.uid).then(setUserPolicies);
  }, [user]);

  const handleFilesSelected = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const tempClaimId = `draft-${Date.now()}`;
    const uploaded: ClaimAttachment[] = [];
    for (const file of Array.from(fileList)) {
      if (file.size > 10 * 1024 * 1024) {
        showToast(`Datoteka ${file.name} prelazi 10 MB.`, 'error');
        continue;
      }
      const att = await agencyRepository.uploadClaimAttachment(tempClaimId, file);
      uploaded.push(att);
    }
    setAttachments((prev) => [...prev, ...uploaded]);
    if (uploaded.length > 0) {
      showToast(`Dodano ${uploaded.length} dokument(a).`, 'success');
    }
  };

  const handleNext = () => {
    setStepError('');
    if (step === 1 && policyNumber.trim().length < 4) {
      setStepError('Unesite broj police osiguranja ili odaberite policu s popisa.');
      return;
    }
    if (step === 2 && (!incidentDate || incidentLocation.trim().length < 3)) {
      setStepError('Unesite datum i lokaciju štetnog događaja.');
      return;
    }
    if (step === 3 && description.trim().length < 15) {
      setStepError('Ukratko opišite okolnosti nastanka štete (najmanje 15 znakova).');
      return;
    }
    setStep((s) => Math.min(5, s + 1));
  };

  const handleSubmitClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    setStepError('');

    if (claimantName.trim().length < 3) {
      setStepError('Unesite puno ime i prezime prijavitelja.');
      return;
    }
    if (!isValidOIB(claimantOib)) {
      setStepError('Unesite ispravan 11-znamenkasti OIB (ISO 7064 provjera).');
      return;
    }
    if (!claimantEmail.includes('@')) {
      setStepError('Unesite ispravnu e-mail adresu.');
      return;
    }
    if (!isValidCroatianPhone(claimantPhone)) {
      setStepError('Unesite ispravan hrvatski broj telefona.');
      return;
    }
    if (!gdprConsent) {
      setStepError('Potrebna je GDPR privola za obradu prijave štete.');
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
      setTrackedClaim(saved);
      setSearchRef(saved.referenceNumber);
      showToast(`Prijava štete ${saved.referenceNumber} je uspješno zaprimljena.`, 'success');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTrackSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setTrackNotFound(false);
    const found = await agencyRepository.findClaimByReference(searchRef);
    setTrackedClaim(found);
    if (!found) setTrackNotFound(true);
  };

  return (
    <div className="bg-canvas py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Empathetic Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-hairline">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">
              Digitalna prijava štete (FNOL)
            </p>
            <h1 className="font-display text-4xl sm:text-5xl text-ink">
              Tu smo kad se dogodi nezgoda.
            </h1>
            <p className="text-sm sm:text-base text-ink-secondary max-w-xl">
              Prijavite štetu u 5 mirnih koraka. Dobivate trenutan referentni broj i zastupnika koji
              vodi postupak s osigurateljem umjesto vas.
            </p>
          </div>
          <a
            href={`tel:${BRAND_CONFIG.claimsPhone.replace(/\s+/g, '')}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-hairline bg-canvas-warm text-xs font-semibold text-ink hover:border-ink transition-colors tabular-nums shrink-0"
          >
            <Phone className="w-4 h-4 text-accent" strokeWidth={1.5} />
            <span>Hitna asistencija: {BRAND_CONFIG.claimsPhone}</span>
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
            Nova prijava štete
          </button>
          <button
            type="button"
            onClick={() => setTab('track')}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
              tab === 'track' ? 'bg-canvas text-ink shadow-subtle' : 'text-ink-secondary hover:text-ink'
            }`}
          >
            Prati status prijave
          </button>
        </div>

        {/* TAB 1: GUIDED 5-STEP FNOL */}
        {tab === 'report' ? (
          submittedClaim ? (
            <div className="rounded-editorial bg-canvas border border-hairline p-6 sm:p-10 space-y-6 animate-step">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-7 h-7 text-status-success shrink-0" strokeWidth={1.75} />
                <div className="space-y-1">
                  <Badge variant="success">Prijava zaprimljena</Badge>
                  <h2 className="font-display text-3xl text-ink">
                    Referentni broj: <span className="tabular-nums">{submittedClaim.referenceNumber}</span>
                  </h2>
                  <p className="text-sm text-ink-secondary">
                    Vaša prijava za policu <strong>{submittedClaim.policyNumber}</strong> ({submittedClaim.carrierName}) zaprimljena je s {submittedClaim.attachments.length} prilogom/a.
                  </p>
                </div>
              </div>

              <ClaimStageTimeline stage={submittedClaim.stage} />

              <div className="flex flex-wrap gap-3 pt-2">
                <Button onClick={() => setTab('track')}>Otvori praćenje statusa</Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSubmittedClaim(null);
                    setStep(1);
                    setAttachments([]);
                    setDescription('');
                  }}
                >
                  Prijavi novu štetu
                </Button>
              </div>
            </div>
          ) : (
            <div className="rounded-editorial bg-canvas border border-hairline p-6 sm:p-8 space-y-6">
              {/* Step Indicator */}
              <div className="flex items-center justify-between text-xs text-ink-muted tabular-nums pb-4 border-b border-hairline">
                <span className="font-semibold text-ink">Korak {step} od 5</span>
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
                  <h2 className="font-display text-3xl text-ink">1. Polica i vrsta štete</h2>
                  {userPolicies.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-ink-secondary">
                        Odaberite iz vašeg novčanika polica:
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
                      label="Broj police *"
                      placeholder="npr. GEN-AO-2026-441082"
                      value={policyNumber}
                      onChange={(e) => setPolicyNumber(e.target.value)}
                      tabular
                    />
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-ink">Vrsta osiguranja</label>
                      <select
                        value={productLine}
                        onChange={(e) => setProductLine(e.target.value as ProductLine)}
                        className="w-full h-11 rounded-lg border border-hairline-strong bg-canvas px-3 text-sm text-ink"
                      >
                        {PRODUCT_CATALOG.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.nameHr}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-ink">Osiguratelj</label>
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
                  <h2 className="font-display text-3xl text-ink">2. Kada i gdje se šteta dogodila?</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Datum nezgode *"
                      type="date"
                      value={incidentDate}
                      onChange={(e) => setIncidentDate(e.target.value)}
                      tabular
                    />
                    <Input
                      label="Okvirno vrijeme *"
                      type="time"
                      value={incidentTime}
                      onChange={(e) => setIncidentTime(e.target.value)}
                      tabular
                    />
                  </div>
                  <Input
                    label="Lokacija štetnog događaja (grad, ulica) *"
                    placeholder="npr. Zagreb, Savska cesta 41"
                    value={incidentLocation}
                    onChange={(e) => setIncidentLocation(e.target.value)}
                  />
                </div>
              ) : null}

              {step === 3 ? (
                <div className="space-y-5 animate-step">
                  <h2 className="font-display text-3xl text-ink">3. Opis štetnog događaja</h2>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-ink">
                      Opišite ukratko što se dogodilo i što je oštećeno *
                    </label>
                    <textarea
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Navedite smjer kretanja, vidljiva oštećenja ili okolnosti nastanka štete..."
                      className="w-full rounded-lg border border-hairline-strong p-3.5 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:border-accent"
                    />
                  </div>
                  <label className="flex items-center justify-between p-4 rounded-editorial border border-hairline cursor-pointer">
                    <span className="text-sm font-medium text-ink">
                      Je li pozvana policija i sastavljen zapisnik?
                    </span>
                    <input
                      type="checkbox"
                      checked={policeReportFiled}
                      onChange={(e) => setPoliceReportFiled(e.target.checked)}
                      className="w-5 h-5 accent-accent"
                    />
                  </label>
                </div>
              ) : null}

              {step === 4 ? (
                <div className="space-y-5 animate-step">
                  <h2 className="font-display text-3xl text-ink">
                    4. Fotografije i dokumentacija (Europsko izvješće)
                  </h2>
                  <p className="text-sm text-ink-secondary">
                    Priložite fotografije oštećenja, Europsko izvješće o nezgodi ili policijski
                    zapisnik (PDF / JPG / PNG).
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
                      accept=".pdf,image/*"
                      onChange={(e) => void handleFilesSelected(e.target.files)}
                      className="hidden"
                      aria-label="Priloži fotografije ili dokumente štete"
                    />
                    <Upload className="w-6 h-6 mx-auto text-ink" strokeWidth={1.5} />
                    <div className="text-sm font-medium text-ink">
                      Povucite fotografije ili PDF dokumente ovdje
                    </div>
                    <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                      Odaberi datoteke
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
                            aria-label="Ukloni prilog"
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
                  <h2 className="font-display text-3xl text-ink">5. Podaci prijavitelja i slanje</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Ime i prezime *"
                      value={claimantName}
                      onChange={(e) => setClaimantName(e.target.value)}
                      placeholder="Ana Horvat"
                    />
                    <Input
                      label="OIB (11 znamenki) *"
                      maxLength={11}
                      value={claimantOib}
                      onChange={(e) => setClaimantOib(e.target.value)}
                      placeholder="26182105153"
                      tabular
                    />
                    <Input
                      label="E-mail adresa *"
                      type="email"
                      value={claimantEmail}
                      onChange={(e) => setClaimantEmail(e.target.value)}
                      placeholder="ana@email.hr"
                    />
                    <Input
                      label="Mobitel / telefon *"
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
                      Suglasan/na sam s obradom i prosljeđivanjem podataka i fotografija nadležnom
                      osiguratelju radi rješavanja odštetnog zahtjeva (GDPR). *
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
                      <span>Natrag</span>
                    </Button>
                    <Button type="submit" size="lg" isLoading={isSubmitting}>
                      Pošalji prijavu štete
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
                      <span>Natrag</span>
                    </Button>
                    <Button onClick={handleNext}>
                      <span>Nastavi</span>
                      <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
                    </Button>
                  </div>
                </>
              ) : null}
            </div>
          )
        ) : (
          /* TAB 2: LIVE CLAIM STATUS TRACKER */
          <div className="space-y-6 animate-step">
            <form
              onSubmit={handleTrackSearch}
              className="rounded-editorial bg-canvas-warm border border-hairline p-5 sm:p-6 flex flex-col sm:flex-row gap-3 items-end"
            >
              <div className="flex-1 w-full">
                <Input
                  label="Referentni broj štete ili broj police"
                  value={searchRef}
                  onChange={(e) => setSearchRef(e.target.value)}
                  placeholder="STETA-2026-1042"
                  tabular
                />
              </div>
              <Button type="submit" className="w-full sm:w-auto">
                <Search className="w-4 h-4" strokeWidth={1.75} />
                <span>Provjeri status</span>
              </Button>
            </form>

            {trackNotFound ? (
              <div className="rounded-editorial border border-hairline p-6 text-sm text-ink-secondary">
                Nismo pronašli prijavu za unos <strong>{searchRef}</strong>. Pokušajte s oglednim
                brojem <strong className="tabular-nums">STETA-2026-1042</strong>.
              </div>
            ) : null}

            {trackedClaim ? (
              <div className="rounded-editorial bg-canvas border border-hairline p-6 sm:p-8 space-y-6">
                <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-hairline">
                  <div>
                    <div className="text-xs font-semibold text-ink-muted tabular-nums">
                      {trackedClaim.referenceNumber} • Polica {trackedClaim.policyNumber}
                    </div>
                    <h2 className="font-display text-3xl text-ink mt-1">
                      {trackedClaim.carrierName}
                    </h2>
                    <p className="text-xs text-ink-secondary mt-1">
                      {formatDateHr(trackedClaim.incidentDate)} u {trackedClaim.incidentTime} •{' '}
                      {trackedClaim.incidentLocation}
                    </p>
                  </div>
                  <Badge variant="accent">
                    {CLAIM_STAGES.find((s) => s.id === trackedClaim.stage)?.label}
                  </Badge>
                </div>

                <ClaimStageTimeline stage={trackedClaim.stage} />

                <div className="space-y-2.5 pt-2">
                  <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-ink-muted">
                    Kronologija obrade
                  </h3>
                  <ul className="space-y-2">
                    {trackedClaim.stageHistory.map((h, i) => (
                      <li
                        key={`${h.stage}-${i}`}
                        className="flex items-start justify-between gap-4 text-xs p-3 rounded-lg bg-canvas-warm border border-hairline"
                      >
                        <span className="text-ink font-medium">{h.note}</span>
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
