import React, { useState } from 'react';
import {
  AlertTriangle,
  PhoneCall,
  ShieldAlert,
  Car,
  Home,
  CloudLightning,
  Sparkles,
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
      icon: Sparkles,
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
      <div className="p-4 rounded-3xl bg-rose-500/10 border border-rose-500/20 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center shrink-0">
            <PhoneCall className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              Hitne službe u Republici Hrvatskoj &bull; 24/7 Dežurstvo
            </div>
            <p className="text-[11px] text-rose-200">
              U slučaju teže nezgode ili ozljeda najprije osigurajte mjesto događaja i nazovite hitne službe.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <a
            href="tel:112"
            className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-white font-bold border border-rose-500/30"
          >
            112 Hitna/Centar
          </a>
          <a
            href="tel:192"
            className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white font-bold border border-white/[0.1]"
          >
            192 Policija
          </a>
          <a
            href="tel:1987"
            className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold border border-amber-500/30"
          >
            1987 HAK Pomoć
          </a>
        </div>
      </div>

      {submittedClaimNumber ? (
        <Card className="p-8 bg-[#0a0d16]/95 border-emerald-500/30 backdrop-blur-xl text-center shadow-2xl space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-[#2dd4bf] flex items-center justify-center mx-auto shadow-[0_0_24px_rgba(45,212,191,0.25)]">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono text-emerald-400 font-bold tracking-widest uppercase">
              Prijava uspješno evidentirana
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Odštetni spis je otvoren u sustavu
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
              Vaša prijava štete je zaprimljena u Agenciji Život te proslijeđena nadležnom odjelu
              likvidacije osiguratelja. Procjenitelj će vas kontaktirati unutar 24 radna sata.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] max-w-md mx-auto flex items-center justify-between">
            <div className="text-left">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                Službeni broj spisa (Referenca)
              </span>
              <span className="text-2xl font-mono font-black text-[#ff7b1a]">
                {submittedClaimNumber}
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 font-mono text-xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
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
              className="font-mono text-xs shadow-[0_0_15px_rgba(251,101,4,0.3)]"
            >
              Povratak na nadzornu ploču
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="p-6 sm:p-8 bg-[#0a0d16]/90 border-white/[0.08] backdrop-blur-xl shadow-2xl text-white">
          {/* Progress Indicators */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-3">
              <span className="text-white font-bold">Korak {step} od 4</span>
              <span className="text-[#ff7b1a]">
                {step === 1
                  ? 'Kategorija štete'
                  : step === 2
                  ? 'Pojedinosti događaja'
                  : step === 3
                  ? 'Foto-dokumentacija'
                  : 'Isplata i suglasnost'}
              </span>
            </div>
            <div className="w-full bg-white/[0.05] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#fb6504] to-[#ff7b1a] h-full transition-all duration-300"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-3">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: INCIDENT TYPE SELECTION */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white">Kakav štetni događaj prijavljujete?</h3>
                <p className="text-xs text-slate-400 mt-1">
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
                      className={`p-4 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#fb6504] bg-[#fb6504]/10 shadow-[0_0_16px_rgba(251,101,4,0.25)]'
                          : 'border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15] hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                            isSelected
                              ? 'bg-[#fb6504] text-white'
                              : 'bg-white/[0.05] text-slate-400'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-sm text-white">{opt.title}</h4>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{opt.desc}</p>
                    </button>
                  );
                })}
              </div>

              {/* Policy selector */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Vezana polica osiguranja
                </label>
                <select
                  value={policyId}
                  onChange={(e) => setPolicyId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-[#fb6504]"
                >
                  {policies.length > 0 ? (
                    policies.map((p) => (
                      <option key={p.id} value={p.id} className="bg-[#0a0d16]">
                        {p.policyNumber} &bull; {p.type.toUpperCase()} ({p.insurer}) &bull; do{' '}
                        {formatDate(p.endDate)}
                      </option>
                    ))
                  ) : (
                    <option value="POL-GEN-2026" className="bg-[#0a0d16]">
                      POL-GEN-2026-HR &bull; Opća polica osiguranja
                    </option>
                  )}
                </select>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  variant="primary"
                  onClick={handleNext}
                  className="font-mono text-xs flex items-center gap-2"
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
                <h3 className="text-xl font-bold text-white">Gdje i kada se dogodila nezgoda?</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Navedite točne podatke radi bržeg postupka obrade i izlaska procjenitelja na uviđaj.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
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
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
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
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Opis nastanka štete i vidljiva oštećenja
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/[0.1] rounded-2xl text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#fb6504]"
                  placeholder="Opišite detaljno kako je došlo do događaja, tko je sudjelovao i koja su vidljiva oštećenja na vozilu ili objektu..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={policeInvolved}
                    onChange={(e) => setPoliceInvolved(e.target.checked)}
                    className="w-4 h-4 rounded text-[#fb6504] focus:ring-0 bg-white/[0.1] border-white/[0.2]"
                  />
                  <span className="text-xs text-white font-medium">
                    Policija je izašla na očevid / sastavljen je policijski zapisnik
                  </span>
                </label>

                {policeInvolved && (
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
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
                <Button variant="ghost" onClick={handlePrev} size="sm">
                  <ArrowLeft className="w-4 h-4 mr-1" /> Natrag
                </Button>
                <Button
                  variant="primary"
                  onClick={handleNext}
                  size="sm"
                  className="font-mono text-xs flex items-center gap-1.5"
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
                <h3 className="text-xl font-bold text-white">Foto-dokumentacija oštećenja</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Priložite fotografije oštećenja, Europsko izvješće ili policijski zapisnik (do 10 datoteka, maks. 15 MB po datoteci).
                </p>
              </div>

              <DamagePhotoUploader onFilesChanged={setEvidenceFiles} maxFiles={10} />

              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-[11px] text-slate-400 space-y-1">
                <p className="font-semibold text-white">Savjeti za kvalitetne fotografije:</p>
                <p>&bull; Slikajte širi kadar objekta/vozila s registarskom oznakom i okolinom.</p>
                <p>&bull; Slikajte detalje svakog oštećenog dijela izbliza pri dobrom osvjetljenju.</p>
                <p>&bull; Ako je dostupno, priložite sliku prometne dozvole ili računa kupljene opreme.</p>
              </div>

              <div className="flex items-center justify-between pt-4">
                <Button variant="ghost" onClick={handlePrev} size="sm">
                  <ArrowLeft className="w-4 h-4 mr-1" /> Natrag
                </Button>
                <Button
                  variant="primary"
                  onClick={handleNext}
                  size="sm"
                  className="font-mono text-xs flex items-center gap-1.5"
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
                <h3 className="text-xl font-bold text-white">Isplata odštete i autorizacija</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Unesite podatke vašeg tekućeg računa za izravnu uplatu nespornog dijela štete.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    IBAN račun za isplatu odštete
                  </label>
                  <Input
                    placeholder="HR1234567890123456789"
                    value={iban}
                    onChange={(e) => setIban(e.target.value.toUpperCase())}
                    maxLength={21}
                    required
                  />
                  <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                    Hrvatski IBAN (HR + 19 znamenki)
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
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
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={legalAccepted}
                    onChange={(e) => setLegalAccepted(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded text-[#fb6504] focus:ring-0 bg-white/[0.1] border-white/[0.2]"
                    required
                  />
                  <span className="text-xs text-slate-300 leading-relaxed">
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
                  className="font-mono text-xs flex items-center gap-2 shadow-[0_0_18px_rgba(244,63,94,0.3)]"
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
