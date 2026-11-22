import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  FileText,
  Upload,
} from 'lucide-react';
import { BRAND_CONFIG } from '../config/brand';
import { useAuth } from '../context/AuthContext';
import { PRODUCT_CATALOG } from '../i18n/translations';
import { agencyRepository } from '../services/agencyRepository';
import { analyzeUploadedPolicyFile } from '../services/aiService';
import {
  ExtractedPolicyFields,
  ProductLine,
  SwitchAnalysisRecord,
} from '../types/domain';
import { isValidCroatianPhone } from '../utils/croatianValidators';
import { addDaysIso, formatDateHr, formatEur } from '../utils/formatters';
import { SwitchDocumentIllustration } from '../components/illustrations/EditorialIllustrations';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useToast } from '../components/ui/Toast';

export const SwitchAndSavePage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedFileMeta, setUploadedFileMeta] = useState<{
    name: string;
    size: number;
    parsedVia: 'gemini_ai' | 'local_analyzer';
  } | null>(null);

  const [fields, setFields] = useState<ExtractedPolicyFields | null>(null);
  const [customerName, setCustomerName] = useState(user?.fullName ?? '');
  const [customerEmail, setCustomerEmail] = useState(user?.email ?? '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone ?? '');
  const [formError, setFormError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [savedRecord, setSavedRecord] = useState<SwitchAnalysisRecord | null>(null);

  const processFile = async (file: File) => {
    const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (file.type && !allowed.includes(file.type)) {
      showToast('Podržani formati su PDF, JPG i PNG (do 10 MB).', 'error');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showToast('Datoteka je prevelika. Maksimalna veličina iznosi 10 MB.', 'error');
      return;
    }

    setIsAnalyzing(true);
    setSavedRecord(null);
    setFormError('');
    try {
      const result = await analyzeUploadedPolicyFile(file);
      setUploadedFileMeta({
        name: file.name,
        size: file.size,
        parsedVia: result.parsedVia,
      });
      setFields(result.extracted);
      showToast('Polica je učitana. Provjerite izdvojene podatke ispod.', 'success');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      void processFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      void processFile(file);
    }
  };

  const runSamplePolicy = () => {
    const sampleBlob = new Blob(['Sample Generali Auto Policy'], { type: 'application/pdf' });
    const sampleFile = new File([sampleBlob], 'croatia-auto-kasko-polica-2026.pdf', {
      type: 'application/pdf',
    });
    void processFile(sampleFile);
  };

  const estimatedNewPremium = fields
    ? Math.round(fields.currentAnnualPremium * 0.84 * 100) / 100
    : 0;
  const estimatedSavings = fields
    ? Math.max(15, Math.round((fields.currentAnnualPremium - estimatedNewPremium) * 100) / 100)
    : 0;
  const reminderDate = fields ? addDaysIso(fields.expiryDate, -30) : '';

  const handleRequestCompetingOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fields || !uploadedFileMeta) return;
    setFormError('');

    if (customerName.trim().length < 3) {
      setFormError('Unesite ime i prezime.');
      return;
    }
    if (!customerEmail.includes('@')) {
      setFormError('Unesite ispravnu e-mail adresu.');
      return;
    }
    if (!isValidCroatianPhone(customerPhone)) {
      setFormError('Unesite važeći hrvatski broj telefona (npr. +385 91 234 5678).');
      return;
    }

    setIsSaving(true);
    try {
      const saved = await agencyRepository.saveSwitchAnalysis({
        userId: user?.uid,
        fileName: uploadedFileMeta.name,
        fileSizeBytes: uploadedFileMeta.size,
        parsedVia: uploadedFileMeta.parsedVia,
        extractedPolicy: fields,
        estimatedNewAnnualPremium: estimatedNewPremium,
        estimatedAnnualSavings: estimatedSavings,
        reminderScheduledFor: reminderDate,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
      });
      setSavedRecord(saved);
      showToast(`Zahtjev ${saved.referenceNumber} je spremljen i podsjetnik je zakazan.`, 'success');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-canvas py-14 sm:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Editorial Page Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">
              Usporedi i uštedi
            </p>
            <h1 className="font-display text-4xl sm:text-5xl text-ink leading-tight">
              Već imaš policu? Pošalji nam je i pronaći ćemo bolju ponudu.
            </h1>
            <p className="text-base text-ink-secondary leading-relaxed">
              Učitajte PDF ili fotografiju svoje trenutne police. Izdvojit ćemo ključne uvjete,
              izračunati moguću uštedu kod 7 hrvatskih osiguratelja i postaviti automatski
              podsjetnik 30 dana prije isteka (skadence).
            </p>
          </div>
          <div className="hidden lg:flex lg:col-span-4 justify-end">
            <SwitchDocumentIllustration />
          </div>
        </div>

        {/* Upload Dropzone */}
        <section className="rounded-editorial bg-canvas-warm border border-hairline p-6 sm:p-10">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`rounded-editorial border-2 border-dashed bg-canvas p-8 sm:p-12 text-center transition-colors ${
              isDragging ? 'border-accent bg-accent-soft/40' : 'border-hairline-strong'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
              aria-label="Učitaj postojeću policu"
            />
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-canvas-warm border border-hairline flex items-center justify-center text-ink">
                <Upload className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="font-sans text-base font-semibold text-ink">
                  {isAnalyzing
                    ? 'Analiziramo dokument vaše police...'
                    : 'Povucite PDF, JPG ili PNG police ovdje'}
                </h2>
                <p className="text-xs text-ink-muted mt-1">
                  Podržani su svi hrvatski osiguratelji • Do 10 MB • Zaštićeno GDPR standardom
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
                <Button
                  isLoading={isAnalyzing}
                  onClick={() => fileInputRef.current?.click()}
                >
                  Odaberi datoteku
                </Button>
                <Button variant="outline" onClick={runSamplePolicy} disabled={isAnalyzing}>
                  Testiraj s oglednom policom
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Extracted Fields + Live Savings + Competing Offer Request */}
        {fields && uploadedFileMeta ? (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-step">
            {/* Editable Extracted Policy Fields */}
            <div className="lg:col-span-7 rounded-editorial bg-canvas border border-hairline p-6 sm:p-8 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-hairline">
                <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                  <FileText className="w-4 h-4 text-accent" strokeWidth={1.5} />
                  <span>{uploadedFileMeta.name}</span>
                </div>
                <Badge variant={uploadedFileMeta.parsedVia === 'gemini_ai' ? 'accent' : 'neutral'}>
                  {uploadedFileMeta.parsedVia === 'gemini_ai'
                    ? 'Gemini AI analiza'
                    : 'Automatska provjera — uredite po potrebi'}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-ink">Trenutni osiguratelj</label>
                  <select
                    value={fields.insurer}
                    onChange={(e) => setFields({ ...fields, insurer: e.target.value })}
                    className="w-full h-11 rounded-lg border border-hairline-strong bg-canvas px-3 text-sm text-ink focus:outline-none focus:border-accent"
                  >
                    {BRAND_CONFIG.partnerInsurers.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                    <option value="Ostalo osiguranje">Drugi osiguratelj</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-ink">Vrsta osiguranja</label>
                  <select
                    value={fields.productLine}
                    onChange={(e) =>
                      setFields({ ...fields, productLine: e.target.value as ProductLine })
                    }
                    className="w-full h-11 rounded-lg border border-hairline-strong bg-canvas px-3 text-sm text-ink focus:outline-none focus:border-accent"
                  >
                    {PRODUCT_CATALOG.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nameHr}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Broj police"
                  value={fields.policyNumber}
                  onChange={(e) => setFields({ ...fields, policyNumber: e.target.value })}
                  tabular
                />

                <Input
                  label="Datum isteka police (skadenca)"
                  type="date"
                  value={fields.expiryDate}
                  onChange={(e) => setFields({ ...fields, expiryDate: e.target.value })}
                  tabular
                />

                <Input
                  label="Trenutna godišnja premija (€)"
                  type="number"
                  min={20}
                  step={5}
                  value={fields.currentAnnualPremium}
                  onChange={(e) =>
                    setFields({
                      ...fields,
                      currentAnnualPremium: Math.max(20, Number(e.target.value) || 0),
                    })
                  }
                  tabular
                />

                <Input
                  label="Franšiza (€)"
                  type="number"
                  min={0}
                  step={50}
                  value={fields.deductible ?? 0}
                  onChange={(e) =>
                    setFields({ ...fields, deductible: Math.max(0, Number(e.target.value) || 0) })
                  }
                  tabular
                />
              </div>
            </div>

            {/* Right: Savings Card & One-Click Competing Offer */}
            <div className="lg:col-span-5 rounded-editorial bg-canvas-warm border border-hairline p-6 sm:p-8 space-y-6">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                  Procijenjena godišnja ušteda
                </p>
                <div className="text-4xl font-bold text-status-success tabular-nums">
                  {formatEur(estimatedSavings)}
                </div>
                <p className="text-xs text-ink-secondary tabular-nums">
                  Nova procijenjena premija: <strong>{formatEur(estimatedNewPremium)}</strong>{' '}
                  umjesto {formatEur(fields.currentAnnualPremium)}
                </p>
              </div>

              <div className="rounded-lg bg-canvas border border-hairline p-3.5 flex items-start gap-2.5 text-xs text-ink-secondary">
                <CalendarClock className="w-4 h-4 text-accent shrink-0 mt-0.5" strokeWidth={1.5} />
                <span>
                  Automatski podsjetnik prije isteka zakazujemo za{' '}
                  <strong className="text-ink tabular-nums">{formatDateHr(reminderDate)}</strong>{' '}
                  (30 dana prije skadence).
                </span>
              </div>

              {savedRecord ? (
                <div className="rounded-editorial bg-emerald-50 border border-emerald-200 p-4 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-status-success shrink-0 mt-0.5" />
                    <div className="text-xs text-ink space-y-1">
                      <p className="font-semibold">
                        Analiza {savedRecord.referenceNumber} je zaprimljena!
                      </p>
                      <p className="text-ink-secondary">
                        Zastupnik priprema konkurentnu ponudu i podsjetit će vas prije isteka police.
                      </p>
                    </div>
                  </div>
                  <Link
                    to={`/izracun/${fields.productLine}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
                  >
                    <span>Odmah pogledaj usporedbu uživo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleRequestCompetingOffer} className="space-y-3">
                  <Input
                    label="Ime i prezime *"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ana Horvat"
                  />
                  <Input
                    label="E-mail za dostavu ponude *"
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="ana@email.hr"
                  />
                  <Input
                    label="Mobitel *"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+385 91 234 5678"
                    tabular
                  />
                  {formError ? (
                    <p role="alert" className="text-xs font-medium text-status-danger">
                      {formError}
                    </p>
                  ) : null}
                  <Button type="submit" fullWidth size="lg" isLoading={isSaving}>
                    Zatraži bolju ponudu i podsjetnik
                  </Button>
                </form>
              )}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
};
