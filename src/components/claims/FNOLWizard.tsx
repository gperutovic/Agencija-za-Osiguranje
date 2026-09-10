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
      <Card className="max-w-2xl mx-auto p-8 sm:p-12 text-center shadow-2xl border-white/[0.08] bg-[#0a0d16]/90 backdrop-blur-xl text-white">
        <div className="w-20 h-20 bg-[#fb6504]/10 border border-[#fb6504]/20 text-[#fb6504] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_25px_rgba(251,101,4,0.3)]">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <span className="rr-pill mb-3">
          <span className="rr-pill__dot bg-[#fb6504]" />
          Prijava uspješno zaprimljena
        </span>
        <h2 className="text-3xl font-extrabold text-white mb-3">
          Odštetni zahtjev je registriran
        </h2>
        <p className="text-slate-400 text-sm max-w-md mx-auto mb-8">
          Vaša prijava štete zaprimljena je pod službenim brojem spisa. Naš procjenitelj i likvidator šteta kontaktirat će vas u roku od 24 radna sata.
        </p>

        {/* Claim Reference Box */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 max-w-md mx-auto mb-8 text-left">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider">
                Broj odštetnog spisa
              </p>
              <p className="text-2xl font-mono font-bold text-[#ff7b1a] tracking-wider mt-0.5">
                {submittedClaimNumber}
              </p>
            </div>
            <button
              onClick={() => copyToClipboard(submittedClaimNumber)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-white/[0.06] hover:bg-white/[0.1] rounded-xl border border-white/[0.08] transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-[#2dd4bf]" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Kopirano' : 'Kopiraj'}
            </button>
          </div>
          <div className="mt-4 pt-4 border-t border-white/[0.08] text-xs text-slate-400 space-y-1 font-mono text-[11px]">
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
            className="text-slate-300 hover:text-white"
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
                    ? 'bg-[#fb6504]/10 text-white border border-[#fb6504]/30 shadow-[0_0_15px_rgba(251,101,4,0.15)]'
                    : isCompleted
                    ? 'text-[#2dd4bf]'
                    : 'text-slate-500'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center mb-1.5 text-sm font-bold transition-all ${
                    isCompleted
                      ? 'bg-[#2dd4bf] text-[#06080c] shadow-[0_0_10px_rgba(45,212,191,0.3)]'
                      : isActive
                      ? 'bg-gradient-to-r from-[#fb6504] to-[#ff7b1a] text-white shadow-[0_0_15px_#fb6504]'
                      : 'bg-white/[0.04] text-slate-500 border border-white/[0.08]'
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
      <Card className="p-6 sm:p-10 shadow-2xl border-white/[0.08] bg-[#0a0d16]/90 backdrop-blur-xl text-white">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* STEP 1: Policy and Incident Basics */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white">
                  Korak 1: Polica osiguranja i osnovni podaci
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  Odaberite aktivnu policu na temelju koje podnosite odštetni zahtjev i unesite lokaciju nezgode.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
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
                  <p className="text-xs text-rose-400 mt-1">{errors.policyId.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
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
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
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
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  IBAN tekućeg računa za isplatu naknade štete
                </label>
                <Input
                  placeholder="HR12 3456 7890 1234 5678 9"
                  {...register('iban')}
                  error={errors.iban?.message}
                />
                <p className="text-xs text-slate-500 mt-1 font-mono text-[11px]">
                  U slučaju priznanja i likvidacije štete, naknada se isplaćuje izravno na navedeni račun u banci.
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: Damage Details */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white">
                  Korak 2: Okolnosti i opis nastanka štete
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  Opišite detaljno kako je došlo do štetnog događaja, oštećene dijelove i procijenjeni iznos ako je poznat.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Detaljan opis događaja (minimalno 20 znakova)
                </label>
                <textarea
                  rows={5}
                  placeholder="Opišite tijek događaja: vremenske uvjete, brzinu, kretanje drugih sudionika ili točan uzrok puknuća cijevi / požara / nezgode..."
                  className={`w-full px-4 py-3 rounded-2xl border text-sm text-white bg-[#0d121f] placeholder-slate-500 shadow-sm focus:outline-none focus:border-[#fb6504] focus:ring-1 focus:ring-[#fb6504] ${
                    errors.description ? 'border-rose-500/50' : 'border-white/[0.1]'
                  }`}
                  {...register('description')}
                />
                {errors.description && (
                  <p className="text-xs text-rose-400 mt-1">{errors.description.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Okvirni procijenjeni iznos štete u EUR (opcionalno)
                </label>
                <Input
                  type="number"
                  placeholder="npr. 850"
                  {...register('estimatedDamage')}
                  error={errors.estimatedDamage?.message}
                />
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1 w-4 h-4 accent-[#fb6504] rounded cursor-pointer"
                    {...register('policeInvolved')}
                  />
                  <div>
                    <span className="text-sm font-semibold text-white">
                      Na mjestu događaja izvršen je policijski očevid
                    </span>
                    <p className="text-xs text-slate-400 mt-0.5">
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
                <h3 className="text-xl font-bold text-white">
                  Korak 3: Fotografije oštećenja i prateća dokumentacija
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  Priložite jasne fotografije oštećenja iz više kutova, prometnu dozvolu, europsko izvješće ili račune popravka (do 15 MB po datoteci).
                </p>
              </div>

              <DamagePhotoUploader
                onFilesChanged={(files) => setEvidenceFiles(files)}
                maxFiles={10}
              />

              <div className="bg-[#fb6504]/10 border border-[#fb6504]/20 rounded-2xl p-4 flex gap-3 text-slate-200 text-xs">
                <AlertTriangle className="w-5 h-5 text-[#fb6504] shrink-0" />
                <div>
                  <strong className="text-[#ff7b1a]">Savjet za bržu isplatu:</strong> Fotografirajte cjelokupno vozilo ili nekretninu s registarskim brojem ili kućnim brojem u kadru, zatim detaljne krupne planove oštećenih elemenata.
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Summary & Submission */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white">
                  Korak 4: Pregled i službena verifikacija
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  Provjerite točnost svih unesenih podataka prije slanja zahtjeva odjelu šteta.
                </p>
              </div>

              <div className="bg-white/[0.03] rounded-2xl p-5 border border-white/[0.08] space-y-3 text-sm">
                <div className="flex justify-between py-1 border-b border-white/[0.06]">
                  <span className="text-slate-400">Broj police:</span>
                  <span className="font-semibold text-white font-mono">
                    {selectedPolicy?.policyNumber || formValues.policyId}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/[0.06]">
                  <span className="text-slate-400">Datum i mjesto:</span>
                  <span className="font-semibold text-white">
                    {formatDate(formValues.incidentDate)} ({formValues.incidentLocation})
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/[0.06]">
                  <span className="text-slate-400">IBAN za isplatu:</span>
                  <span className="font-mono font-medium text-[#2dd4bf]">{formValues.iban}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/[0.06]">
                  <span className="text-slate-400">Procjena štete:</span>
                  <span className="font-semibold text-[#ff7b1a] font-mono">
                    {formValues.estimatedDamage ? formatCurrency(formValues.estimatedDamage) : 'Na uviđaju procjenitelja'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/[0.06]">
                  <span className="text-slate-400">Broj priloženih dokaza:</span>
                  <span className="font-semibold text-white font-mono">
                    {evidenceFiles.length} datoteka
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Opis događaja:</span>
                  <p className="text-xs text-slate-300 bg-white/[0.02] p-3 rounded-xl border border-white/[0.08] font-sans whitespace-pre-line">
                    {formValues.description}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={legalAccepted}
                    onChange={(e) => setLegalAccepted(e.target.checked)}
                    className="mt-1 w-4 h-4 accent-[#fb6504] rounded cursor-pointer"
                  />
                  <div className="text-xs text-slate-300 leading-relaxed">
                    Potvrđujem da su navedeni podaci istiniti, točni i potpuni pod materijalnom i kaznenom odgovornošću.
                    Upoznat/a sam s pravima iz Zakona o osiguranju (NN 30/15, 112/18) i ovlašćujem Agenciju Život d.o.o.
                    i Generali osiguranje d.d. za obradu podataka i uvid u evidencije radi likvidacije štete.
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="mt-8 pt-6 border-t border-white/[0.08] flex items-center justify-between">
            {step > 1 ? (
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevStep}
                className="flex items-center gap-2 text-slate-300 hover:text-white"
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
                className="flex items-center gap-2 shadow-[0_0_20px_-3px_rgba(251,101,4,0.4)]"
              >
                Dalje
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                variant="primary"
                disabled={!legalAccepted || isSubmitting}
                className="flex items-center gap-2 px-8 shadow-[0_0_20px_-3px_rgba(251,101,4,0.4)]"
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
