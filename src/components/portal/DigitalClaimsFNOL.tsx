import React, { useState } from 'react';
import {
  AlertTriangle,
  PhoneCall,
  ShieldAlert,
  Car,
  Home,
  CloudLightning,
  Lock,
  UserCheck,
  CheckCircle2,
  FileCheck,
  Camera,
  ArrowRight,
  ArrowLeft,
  Copy,
  Check,
  Send,
  LifeBuoy,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePolicies } from '../../hooks/usePolicies';
import { useClaims } from '../../hooks/useClaims';
import { generateClaimTrackingCode, formatCurrency, formatDate } from '../../utils/formatters';
import { Policy } from '../../types/database';
import { DamagePhotoUploader } from '../claims/DamagePhotoUploader';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';

interface DigitalClaimsFNOLProps {
  initialPolicyId?: string;
  onSuccess?: (claimNumber: string) => void;
}

type IncidentType =
  | 'collision'
  | 'glass_break'
  | 'water_leak'
  | 'hail_storm'
  | 'theft'
  | 'personal_injury';

export const DigitalClaimsFNOL: React.FC<DigitalClaimsFNOLProps> = ({
  initialPolicyId,
  onSuccess,
}) => {
  const { user } = useAuth();
  const { policies } = usePolicies(user?.uid);
  const { submitClaim, isSubmitting } = useClaims();

  const [step, setStep] = useState<number>(1);
  const [incidentType, setIncidentType] = useState<IncidentType>('collision');
  const [policyId, setPolicyId] = useState<string>(
    initialPolicyId || (policies[0]?.id ?? 'POL-2026-AUTO-HR')
  );
  const [incidentDate, setIncidentDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [incidentLocation, setIncidentLocation] = useState<string>('');
  const [policeInvolved, setPoliceInvolved] = useState<boolean>(false);
  const [policeStation, setPoliceStation] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [estimatedDamage, setEstimatedDamage] = useState<string>('');
  const [iban, setIban] = useState<string>('');
  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);
  const [legalAccepted, setLegalAccepted] = useState<boolean>(false);

  const [submittedClaimNumber, setSubmittedClaimNumber] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const incidentOptions = [
    {
      id: 'collision' as IncidentType,
      title: 'Prometna nezgoda / Sudar',
      desc: 'Šteta na karoseriji, sudar s drugim vozilom ili preprekom',
      icon: Car,
    },
    {
      id: 'glass_break' as IncidentType,
      title: 'Lom stakla na vozilu',
      desc: 'Puknuto ili oštećeno vjetrobransko / bočno staklo',
      icon: AlertTriangle,
    },
    {
      id: 'water_leak' as IncidentType,
      title: 'Izljev vode / Puknuće cijevi',
      desc: 'Šteta od vode u stanu, kući ili poslovnom prostoru',
      icon: Home,
    },
    {
      id: 'hail_storm' as IncidentType,
      title: 'Tuča / Oluja / Nepogoda',
      desc: 'Elementarna nepogoda, pad stabla, šteta od udara groma',
      icon: CloudLightning,
    },
    {
      id: 'theft' as IncidentType,
      title: 'Provalna krađa / Vandalizam',
      desc: 'Otuđenje imovine, provala ili namjerno oštećenje',
      icon: Lock,
    },
    {
      id: 'personal_injury' as IncidentType,
      title: 'Nezgoda / Tjelesna ozljeda',
      desc: 'Ozljeda na radu, u prometu ili sportu s trajnim posljedicama',
      icon: UserCheck,
    },
  ];

  const handleNext = () => {
    setErrorMsg(null);
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (!incidentLocation.trim()) {
        setErrorMsg('Molimo navedite točnu lokaciju nezgode (mjesto i ulicu).');
        return;
      }
      if (!description.trim()) {
        setErrorMsg('Molimo unesite kratak opis okolnosti nastanka štete.');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    }
  };

  const handlePrev = () => {
    setErrorMsg(null);
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanIban = iban.replace(/\s+/g, '').toUpperCase();
    if (!cleanIban.startsWith('HR') || cleanIban.length !== 21) {
      setErrorMsg('Molimo unesite ispravan hrvatski IBAN za isplatu štete (HR + 19 znamenki).');
      return;
    }

    if (!legalAccepted) {
      setErrorMsg('Molimo potvrdite točnost unesenih podataka.');
      return;
    }

    const trackingNumber = generateClaimTrackingCode();

    try {
      const selectedTypeMeta = incidentOptions.find((o) => o.id === incidentType)?.title || incidentType;
      
      await submitClaim({
        claimData: {
          claimNumber: trackingNumber,
          policyId: policyId || 'OPCA-POLICA',
          userId: user?.uid || 'portal-policyholder',
          incidentDate,
          incidentLocation,
          description: `[VRSTA ŠTETE: ${selectedTypeMeta}]\n${description}\n[IBAN za isplatu: ${cleanIban}]${
            policeInvolved ? ` [Policijski očevid: PP ${policeStation}]` : ''
          }`,
          estimatedDamage: estimatedDamage ? parseFloat(estimatedDamage) : undefined,
          currency: 'EUR',
          evidenceUrls: [],
          status: 'submitted',
          claimantName: user?.displayName || 'Osiguranik',
          claimantPhone: user?.phone || '+385 91 234 5678',
          claimantEmail: user?.email || 'osiguranik@domena.hr',
        },
        evidenceFiles,
      });

      setSubmittedClaimNumber(trackingNumber);
      if (onSuccess) onSuccess(trackingNumber);
    } catch (err: any) {
      setErrorMsg('Došlo je do pogreške pri slanju prijave. Pokušajte ponovno ili nazovite naš centar.');
    }
  };

  const handleCopyCode = () => {
    if (submittedClaimNumber) {
      navigator.clipboard.writeText(submittedClaimNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Emergency Hotline Alert Strip */}
      <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 border border-rose-200 text-rose-700 flex items-center justify-center shrink-0">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Hitne službe u Republici Hrvatskoj &bull; 24/7 Dežurstvo
            </div>
            <p className="text-xs text-slate-600">
              U slučaju teže nezgode ili ozljeda najprije osigurajte mjesto događaja i nazovite hitne službe.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs tabular-nums">
          <a
            href="tel:112"
            className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold transition-colors"
          >
            112 Hitna/Centar
          </a>
          <a
            href="tel:192"
            className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-900 font-semibold border border-slate-300 transition-colors"
          >
            192 Policija
          </a>
          <a
            href="tel:1987"
            className="px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-950 font-semibold border border-amber-300 transition-colors"
          >
            1987 HAK Pomoć
          </a>
        </div>
      </div>

      {submittedClaimNumber ? (
        <Card className="p-8 bg-white border border-emerald-200 text-center shadow-sm space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <span className="text-xs text-emerald-700 font-bold tracking-wider uppercase">
              Prijava uspješno evidentirana
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Odštetni spis je otvoren u sustavu
            </h3>
            <p className="text-sm text-slate-600 max-w-xl mx-auto">
              Vaša prijava štete je zaprimljena u Agenciji Život te proslijeđena nadležnom odjelu
              likvidacije osiguratelja. Naš tim kontaktirat će vas unutar jednog radnog dana.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 max-w-md mx-auto flex items-center justify-between gap-4">
            <div className="text-left">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Službeni broj spisa (Referenca)
              </span>
              <span className="text-2xl font-mono font-bold text-[#0F2942]">
                {submittedClaimNumber}
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 text-xs shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  Kopirano
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Kopiraj
                </>
              )}
            </Button>
          </div>

          <div className="pt-2 flex justify-center gap-4">
            <Button
              variant="primary"
              onClick={() => {
                setSubmittedClaimNumber(null);
                setStep(1);
              }}
              className="text-xs"
            >
              Nova prijava / povratak na pregled
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="p-6 sm:p-8 bg-white border border-slate-200 shadow-sm text-slate-900">
          {/* Progress Indicators */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2.5">
              <span className="text-slate-900 font-bold tabular-nums">Korak {step} od 4</span>
              <span className="text-[#0F2942] font-semibold">
                {step === 1
                  ? 'Kategorija štete'
                  : step === 2
                  ? 'Pojedinosti događaja'
                  : step === 3
                  ? 'Foto-dokumentacija'
                  : 'Isplata i suglasnost'}
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#0F2942] h-full transition-all duration-300"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-3">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: INCIDENT TYPE SELECTION */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Kakav štetni događaj prijavljujete?</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Odaberite primarnu vrstu oštećenja kako bismo pripremili odgovarajući obrazac.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {incidentOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = incidentType === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setIncidentType(opt.id)}
                      className={`p-4 rounded-xl text-left border transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#0F2942] bg-[#0F2942]/5 ring-1 ring-[#0F2942]'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'bg-[#0F2942] text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-sm text-slate-900">{opt.title}</h4>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{opt.desc}</p>
                    </button>
                  );
                })}
              </div>

              {/* Policy selector */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Vezana polica osiguranja
                </label>
                <select
                  value={policyId}
                  onChange={(e) => setPolicyId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#0F2942]"
                >
                  {policies.length > 0 ? (
                    policies.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.policyNumber} &bull; {p.type.toUpperCase()} ({p.insurer}) &bull; do{' '}
                        {formatDate(p.endDate)}
                      </option>
                    ))
                  ) : (
                    <option value="POL-GEN-2026">
                      POL-GEN-2026-HR &bull; Opća polica osiguranja
                    </option>
                  )}
                </select>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  variant="primary"
                  onClick={handleNext}
                  className="text-xs flex items-center gap-2"
                >
                  Dalje na pojedinosti <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: DETAILS */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Gdje i kada se dogodila nezgoda?</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Navedite točne podatke radi bržeg postupka obrade i izlaska procjenitelja na uviđaj.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Datum nezgode
                  </label>
                  <Input
                    type="date"
                    value={incidentDate}
                    onChange={(e) => setIncidentDate(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mjesto i adresa nezgode
                  </label>
                  <Input
                    placeholder="npr. Zagreb, Slavonska avenija kod raskrižja..."
                    value={incidentLocation}
                    onChange={(e) => setIncidentLocation(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Opis nastanka štete i vidljiva oštećenja
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:border-[#0F2942]"
                  placeholder="Opišite detaljno kako je došlo do događaja, tko je sudjelovao i koja su vidljiva oštećenja na vozilu ili objektu..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={policeInvolved}
                    onChange={(e) => setPoliceInvolved(e.target.checked)}
                    className="w-4 h-4 rounded accent-[#0F2942]"
                  />
                  <span className="text-xs text-slate-900 font-medium">
                    Policija je izašla na očevid / sastavljen je policijski zapisnik
                  </span>
                </label>

                {policeInvolved && (
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Nadležna policijska postaja (npr. I. PP Zagreb - Centar)
                    </label>
                    <Input
                      placeholder="Naziv ili broj policijske uprave / postaje"
                      value={policeStation}
                      onChange={(e) => setPoliceStation(e.target.value)}
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4">
                <Button variant="ghost" onClick={handlePrev} size="sm" type="button">
                  <ArrowLeft className="w-4 h-4 mr-1" /> Natrag
                </Button>
                <Button
                  variant="primary"
                  onClick={handleNext}
                  size="sm"
                  className="text-xs flex items-center gap-1.5"
                >
                  Dalje na fotografije <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: PHOTO & EVIDENCE UPLOAD */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Foto-dokumentacija oštećenja</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Priložite fotografije oštećenja, Europsko izvješće ili policijski zapisnik (do 10 datoteka, maks. 15 MB po datoteci).
                </p>
              </div>

              <DamagePhotoUploader onFilesChanged={setEvidenceFiles} maxFiles={10} />

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                <p className="font-semibold text-slate-900">Savjeti za kvalitetne fotografije:</p>
                <p>&bull; Slikajte širi kadar objekta/vozila s registarskom oznakom i okolinom.</p>
                <p>&bull; Slikajte detalje svakog oštećenog dijela izbliza pri dobrom osvjetljenju.</p>
                <p>&bull; Ako je dostupno, priložite sliku prometne dozvole ili računa kupljene opreme.</p>
              </div>

              <div className="flex items-center justify-between pt-4">
                <Button variant="ghost" onClick={handlePrev} size="sm" type="button">
                  <ArrowLeft className="w-4 h-4 mr-1" /> Natrag
                </Button>
                <Button
                  variant="primary"
                  onClick={handleNext}
                  size="sm"
                  className="text-xs flex items-center gap-1.5"
                >
                  Dalje na isplatu <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: PAYOUT & SUBMISSION */}
          {step === 4 && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Isplata odštete i autorizacija</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Unesite podatke vašeg tekućeg računa za izravnu uplatu nespornog dijela štete.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    IBAN račun za isplatu odštete
                  </label>
                  <Input
                    placeholder="HR1234567890123456789"
                    value={iban}
                    onChange={(e) => setIban(e.target.value.toUpperCase())}
                    maxLength={21}
                    required
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Hrvatski IBAN (HR + 19 znamenki)
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Okvirna procjena štete (€) <span className="text-slate-500 font-normal">(opcionalno)</span>
                  </label>
                  <Input
                    type="number"
                    placeholder="npr. 1200"
                    value={estimatedDamage}
                    onChange={(e) => setEstimatedDamage(e.target.value)}
                  />
                </div>
              </div>

              {/* Legal confirmation checkbox */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={legalAccepted}
                    onChange={(e) => setLegalAccepted(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded accent-[#0F2942]"
                    required
                  />
                  <span className="text-xs text-slate-700 leading-relaxed">
                    Izjavljujem pod materijalnom i kaznenom odgovornošću da su svi navedeni podaci
                    o nastanku štete istiniti i potpuni te ovlašćujem Agenciju Život d.o.o. i
                    osiguratelja za obradu podataka i kontaktiranje s ciljem likvidacije odštetnog
                    zahtjeva sukladno Zakonu o osiguranju (NN 30/15).
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-between pt-4">
                <Button variant="ghost" onClick={handlePrev} size="sm" type="button">
                  <ArrowLeft className="w-4 h-4 mr-1" /> Natrag
                </Button>
                <Button
                  variant="danger"
                  type="submit"
                  size="sm"
                  disabled={isSubmitting || !legalAccepted}
                  className="text-xs flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? 'Slanje prijave u tijeku...' : 'Potvrdi i podnesi prijavu štete'}
                </Button>
              </div>
            </form>
          )}
        </Card>
      )}
    </div>
  );
};
