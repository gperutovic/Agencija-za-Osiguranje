import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import {
  CheckCircle2,
  FileCheck,
  Camera,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Copy,
  Check,
  ShieldCheck,
} from 'lucide-react';
import { fnolClaimSchema, FNOLClaimFormData } from '../../utils/validators';
import { DamagePhotoUploader } from './DamagePhotoUploader';
import { useClaims } from '../../hooks/useClaims';
import { usePolicies } from '../../hooks/usePolicies';
import { useAuth } from '../../hooks/useAuth';
import { generateClaimTrackingCode, formatCurrency, formatDate } from '../../utils/formatters';
import { Policy } from '../../types/database';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Card } from '../common/Card';

interface FNOLWizardProps {
  onSuccess?: (claimNumber: string) => void;
  initialPolicyId?: string;
}

export const FNOLWizard: React.FC<FNOLWizardProps> = ({ onSuccess, initialPolicyId }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { policies } = usePolicies(user?.uid);
  const { submitClaim, isSubmitting } = useClaims();

  const [step, setStep] = useState<number>(1);
  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);
  const [submittedClaimNumber, setSubmittedClaimNumber] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [legalAccepted, setLegalAccepted] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<FNOLClaimFormData>({
    resolver: zodResolver(fnolClaimSchema),
    defaultValues: {
      policyId: initialPolicyId || (policies[0]?.id ?? ''),
      incidentDate: new Date().toISOString().split('T')[0],
      incidentLocation: '',
      description: '',
      estimatedDamage: undefined,
      policeInvolved: false,
      iban: '',
    },
  });

  const formValues = watch();

  const handleNextStep = async () => {
    if (step === 1) {
      const valid = await trigger(['policyId', 'incidentDate', 'incidentLocation', 'iban']);
      if (valid) setStep(2);
    } else if (step === 2) {
      const valid = await trigger(['description', 'estimatedDamage', 'policeInvolved']);
      if (valid) setStep(3);
    } else if (step === 3) {
      setStep(4);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const onSubmit = async (data: FNOLClaimFormData) => {
    if (!legalAccepted) return;

    const trackingNumber = generateClaimTrackingCode();

    try {
      await submitClaim({
        claimData: {
          claimNumber: trackingNumber,
          policyId: data.policyId,
          userId: user?.uid || 'guest-policyholder',
          incidentDate: data.incidentDate,
          incidentLocation: data.incidentLocation,
          description: `${data.description}\n[IBAN za isplatu: ${data.iban}]${data.policeInvolved ? ' [Policijski očevid zatražen]' : ''}`,
          estimatedDamage: data.estimatedDamage,
          currency: 'EUR',
          evidenceUrls: [],
          status: 'submitted',
        },
        files: evidenceFiles,
      });

      setSubmittedClaimNumber(trackingNumber);
      if (onSuccess) {
        onSuccess(trackingNumber);
      }
    } catch (err) {
      console.error('Failed to submit claim:', err);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Success Screen
  if (submittedClaimNumber) {
    return (
      <Card className="max-w-2xl mx-auto p-8 sm:p-12 text-center shadow-xl border-emerald-100 bg-white">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
          Prijava uspješno zaprimljena
        </span>
        <h2 className="text-3xl font-extrabold text-slate-900 mb-3">
          Odštetni zahtjev je registriran
        </h2>
        <p className="text-slate-600 text-sm max-w-md mx-auto mb-8">
          Vaša prijava štete zaprimljena je pod službenim brojem spisa. Naš procjenitelj i likvidator šteta kontaktirat će vas u roku od 24 radna sata.
        </p>

        {/* Claim Reference Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 max-w-md mx-auto mb-8 text-left">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Broj odštetnog spisa
              </p>
              <p className="text-2xl font-mono font-bold text-brand-900 tracking-wider">
                {submittedClaimNumber}
              </p>
            </div>
            <button
              onClick={() => copyToClipboard(submittedClaimNumber)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-xl transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Kopirano' : 'Kopiraj'}
            </button>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-200/80 text-xs text-slate-500 space-y-1">
            <p><strong>Ovlašteni osiguratelj:</strong> Generali osiguranje d.d.</p>
            <p><strong>Zastupnik:</strong> Agencija Život d.o.o. Zagreb</p>
            <p><strong>Evidencija:</strong> HANFA Registar posrednika u osiguranju</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="primary"
            onClick={() => {
              setSubmittedClaimNumber(null);
              setStep(1);
            }}
          >
            Prijavi novu štetu
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.assign('/portal')}
          >
            Pregled u korisničkom portalu
          </Button>
        </div>
      </Card>
    );
  }

  // Wizard Steps Header
  const stepsMeta = [
    { num: 1, label: 'Podaci o polici i nezgodi', icon: FileCheck },
    { num: 2, label: 'Opis štete', icon: AlertTriangle },
    { num: 3, label: 'Fotografije i dokazi', icon: Camera },
    { num: 4, label: 'Pregled i slanje', icon: CheckCircle2 },
  ];

  const selectedPolicy = policies.find((p: Policy) => p.id === formValues.policyId);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Step Indicator */}
      <div className="mb-8">
        <div className="grid grid-cols-4 gap-2 sm:gap-4">
          {stepsMeta.map((s) => {
            const Icon = s.icon;
            const isActive = step === s.num;
            const isCompleted = step > s.num;
            return (
              <div
                key={s.num}
                className={`flex flex-col items-center text-center p-2 rounded-2xl transition-all ${
                  isActive
                    ? 'bg-brand-50 text-brand-900 border border-brand-200 shadow-sm'
                    : isCompleted
                    ? 'text-emerald-700'
                    : 'text-slate-400'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center mb-1.5 text-sm font-bold transition-all ${
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : isActive
                      ? 'bg-brand-600 text-white shadow'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                </div>
                <span className="text-[11px] font-semibold line-clamp-1">
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Wizard Form */}
      <Card className="p-6 sm:p-10 shadow-lg border-slate-200">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* STEP 1: Policy and Incident Basics */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Korak 1: Polica osiguranja i osnovni podaci
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Odaberite aktivnu policu na temelju koje podnosite odštetni zahtjev i unesite lokaciju nezgode.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Polica osiguranja
                </label>
                {policies.length > 0 ? (
                  <Select
                    value={formValues.policyId}
                    onChange={(e) => setValue('policyId', e.target.value)}
                    options={policies.map((p: Policy) => ({
                      value: p.id,
                      label: `${p.policyNumber} — ${p.type.toUpperCase()} (${p.insurer})`,
                    }))}
                  />
                ) : (
                  <Input
                    placeholder="Upišite broj police (npr. GEN-AO-2026-9912)"
                    {...register('policyId')}
                    error={errors.policyId?.message}
                  />
                )}
                {errors.policyId && (
                  <p className="text-xs text-rose-600 mt-1">{errors.policyId.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Datum nastanka štete
                  </label>
                  <Input
                    type="date"
                    max={new Date().toISOString().split('T')[0]}
                    {...register('incidentDate')}
                    error={errors.incidentDate?.message}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Mjesto nezgode (Grad, adresa)
                  </label>
                  <Input
                    placeholder="npr. Slavonska avenija, Zagreb"
                    {...register('incidentLocation')}
                    error={errors.incidentLocation?.message}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  IBAN tekućeg računa za isplatu naknade štete
                </label>
                <Input
                  placeholder="HR12 3456 7890 1234 5678 9"
                  {...register('iban')}
                  error={errors.iban?.message}
                />
                <p className="text-xs text-slate-500 mt-1">
                  U slučaju priznanja i likvidacije štete, naknada se isplaćuje izravno na navedeni račun u banci.
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: Damage Details */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Korak 2: Okolnosti i opis nastanka štete
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Opišite detaljno kako je došlo do štetnog događaja, oštećene dijelove i procijenjeni iznos ako je poznat.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Detaljan opis događaja (minimalno 20 znakova)
                </label>
                <textarea
                  rows={5}
                  placeholder="Opišite tijek događaja: vremenske uvjete, brzinu, kretanje drugih sudionika ili točan uzrok puknuća cijevi / požara / nezgode..."
                  className={`w-full px-4 py-3 rounded-2xl border text-sm text-slate-900 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                    errors.description ? 'border-rose-400' : 'border-slate-300'
                  }`}
                  {...register('description')}
                />
                {errors.description && (
                  <p className="text-xs text-rose-600 mt-1">{errors.description.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Okvirni procijenjeni iznos štete u EUR (opcionalno)
                </label>
                <Input
                  type="number"
                  placeholder="npr. 850"
                  {...register('estimatedDamage')}
                  error={errors.estimatedDamage?.message}
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1 w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
                    {...register('policeInvolved')}
                  />
                  <div>
                    <span className="text-sm font-semibold text-slate-800">
                      Na mjestu događaja izvršen je policijski očevid
                    </span>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Označite ako je nadležna Policijska postaja sastavila policijski zapisnik ili je ispunjeno Europsko izvješće o nezgodi.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* STEP 3: Damage Photos & Evidence */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Korak 3: Fotografije oštećenja i prateća dokumentacija
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Priložite jasne fotografije oštećenja iz više kutova, prometnu dozvolu, europsko izvješće ili račune popravka (do 15 MB po datoteci).
                </p>
              </div>

              <DamagePhotoUploader
                onFilesChanged={(files) => setEvidenceFiles(files)}
                maxFiles={10}
              />

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 text-amber-800 text-xs">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <strong>Savjet za bržu isplatu:</strong> Fotografirajte cjelokupno vozilo ili nekretninu s registarskim brojem ili kućnim brojem u kadru, zatim detaljne krupne planove oštećenih elemenata.
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Summary & Submission */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Korak 4: Pregled i službena verifikacija
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Provjerite točnost svih unesenih podataka prije slanja zahtjeva odjelu šteta.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3 text-sm">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Broj police:</span>
                  <span className="font-semibold text-slate-900">
                    {selectedPolicy?.policyNumber || formValues.policyId}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Datum i mjesto:</span>
                  <span className="font-semibold text-slate-900">
                    {formatDate(formValues.incidentDate)} ({formValues.incidentLocation})
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">IBAN za isplatu:</span>
                  <span className="font-mono font-medium text-slate-900">{formValues.iban}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Procjena štete:</span>
                  <span className="font-semibold text-slate-900">
                    {formValues.estimatedDamage ? formatCurrency(formValues.estimatedDamage) : 'Na uviđaju procjenitelja'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Broj priloženih dokaza:</span>
                  <span className="font-semibold text-slate-900">
                    {evidenceFiles.length} datoteka
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-1">Opis događaja:</span>
                  <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200 font-sans whitespace-pre-line">
                    {formValues.description}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-brand-50/60 border border-brand-100">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={legalAccepted}
                    onChange={(e) => setLegalAccepted(e.target.checked)}
                    className="mt-1 w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
                  />
                  <div className="text-xs text-slate-700 leading-relaxed">
                    Potvrđujem da su navedeni podaci istiniti, točni i potpuni pod materijalnom i kaznenom odgovornošću.
                    Upoznat/a sam s pravima iz Zakona o osiguranju (NN 30/15, 112/18) i ovlašćujem Agenciju Život d.o.o.
                    i Generali osiguranje d.d. za obradu podataka i uvid u evidencije radi likvidacije štete.
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between">
            {step > 1 ? (
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevStep}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Natrag
              </Button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <Button
                type="button"
                variant="primary"
                onClick={handleNextStep}
                className="flex items-center gap-2"
              >
                Dalje
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                variant="primary"
                disabled={!legalAccepted || isSubmitting}
                className="flex items-center gap-2 px-8"
              >
                {isSubmitting ? 'Slanje prijave...' : 'Pošalji odštetni zahtjev'}
                <ShieldCheck className="w-5 h-5" />
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
};
