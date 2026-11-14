import React, { useState } from 'react';
import {
  FileText,
  Search,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Car,
  Home,
  HeartPulse,
  Briefcase,
  PhoneCall,
  Copy,
  Check,
  AlertCircle,
} from 'lucide-react';
import { isValidOIB } from '../../lib/validation';
import { CARRIER_PARTNERS } from '../../lib/content/insurance-data';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { DamagePhotoUploader } from './DamagePhotoUploader';
import { ClaimStatusTimeline } from './ClaimStatusTimeline';
import { useClaims } from '../../hooks/useClaims';
import { firestoreService } from '../../api/firestoreService';
import { Claim } from '../../types/database';
import { useAuth } from '../../context/AuthContext';

export interface ClaimsIntakeFormProps {
  mode?: 'submit' | 'status';
  onModeChange?: (mode: 'submit' | 'status') => void;
  showInternalToggle?: boolean;
}

export const ClaimsIntakeForm: React.FC<ClaimsIntakeFormProps> = ({
  mode,
  onModeChange,
  showInternalToggle = false,
}) => {
  const { user: userProfile } = useAuth();
  const { submitClaim, isSubmitting } = useClaims(userProfile?.uid);

  const [internalTab, setInternalTab] = useState<'submit' | 'status'>('submit');
  const activeTab = mode ?? internalTab;

  const setActiveTab = (next: 'submit' | 'status') => {
    setInternalTab(next);
    if (onModeChange) onModeChange(next);
  };

  const [step, setStep] = useState<number>(1);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [trackingCode, setTrackingCode] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Lookup state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searching, setSearching] = useState<boolean>(false);
  const [foundClaim, setFoundClaim] = useState<Claim | null>(null);
  const [notFoundError, setNotFoundError] = useState<string | null>(null);

  // Form states
  const [category, setCategory] = useState<string>('auto');
  const [incidentDate, setIncidentDate] = useState<string>('');
  const [incidentLocation, setIncidentLocation] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const [carrierName, setCarrierName] = useState<string>('Generali osiguranje d.d.');
  const [policyNumber, setPolicyNumber] = useState<string>('');
  const [policeReportFiled, setPoliceReportFiled] = useState<boolean>(false);
  const [policeStation, setPoliceStation] = useState<string>('');

  const [claimantName, setClaimantName] = useState<string>('');
  const [claimantOib, setClaimantOib] = useState<string>('');
  const [oibError, setOibError] = useState<string | null>(null);
  const [claimantPhone, setClaimantPhone] = useState<string>('');
  const [claimantEmail, setClaimantEmail] = useState<string>('');
  const [iban, setIban] = useState<string>('');

  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);

  const handleOibChange = (val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 11);
    setClaimantOib(cleaned);
    if (cleaned.length === 11) {
      if (!isValidOIB(cleaned)) {
        setOibError('OIB kontrolna znamenka nije ispravna.');
      } else {
        setOibError(null);
      }
    } else if (cleaned.length > 0) {
      setOibError('OIB mora sadržavati 11 znamenki.');
    } else {
      setOibError(null);
    }
  };

  const canProceedToNextStep = (): boolean => {
    if (step === 1) {
      return Boolean(incidentDate && incidentLocation.trim() && description.trim());
    }
    if (step === 2) {
      return Boolean(carrierName);
    }
    if (step === 3) {
      if (!claimantName.trim() || !claimantPhone.trim() || !claimantEmail.trim()) return false;
      if (claimantOib && !isValidOIB(claimantOib)) return false;
      return true;
    }
    return true;
  };

  const handleSubmitClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (claimantOib && !isValidOIB(claimantOib)) {
      setOibError('Molimo unesite ispravan OIB od 11 znamenki.');
      setStep(3);
      return;
    }

    const code = `ST-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      await submitClaim({
        claimData: {
          claimNumber: code,
          policyId: policyNumber.trim() || 'pol-upit',
          userId: userProfile?.uid || 'guest-claimant',
          incidentDate: incidentDate || new Date().toISOString().split('T')[0],
          incidentLocation: incidentLocation.trim(),
          description: description.trim(),
          currency: 'EUR',
          status: 'submitted',
          iban: iban.trim() || undefined,
          policeInvolved: policeReportFiled,
          claimantName: claimantName.trim(),
          claimantPhone: claimantPhone.trim(),
          claimantEmail: claimantEmail.trim(),
          claimantOib: claimantOib.trim() || undefined,
          carrierName,
          category,
          brokerNotes: policeReportFiled && policeStation ? `PP: ${policeStation.trim()}` : undefined,
        },
        evidenceFiles,
      });

      setTrackingCode(code);
      setSubmitSuccess(true);
    } catch (err) {
      console.error(err);
      setSubmitError('Pogreška pri slanju prijave štete. Provjerite podatke i pokušajte ponovo.');
    }
  };

  const handleSearchClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    setNotFoundError(null);
    setFoundClaim(null);

    try {
      const match = await firestoreService.getClaimByNumberOrOib(searchQuery);
      if (match) {
        setFoundClaim(match);
      } else {
        setNotFoundError(
          `Nije pronađen odštetni spis za upit "${searchQuery.trim()}". Provjerite referentni broj (npr. ST-2026-0814) ili OIB ugovaratelja.`
        );
      }
    } catch {
      setNotFoundError('Došlo je do pogreške pri pretraživanju registra šteta.');
    } finally {
      setSearching(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(trackingCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const categories = [
    {
      id: 'auto',
      title: 'Auto osiguranje i kasko',
      desc: 'Prometna nezgoda, tuča, oštećenje parkiranog vozila ili lom stakla.',
      icon: Car,
    },
    {
      id: 'property',
      title: 'Imovina, stan i kuća',
      desc: 'Puknuće cijevi, požar, oluja, potres ili provalna krađa.',
      icon: Home,
    },
    {
      id: 'health',
      title: 'Zdravlje i nezgoda',
      desc: 'Povrat troškova liječenja, dijagnostika ili nezgoda.',
      icon: HeartPulse,
    },
    {
      id: 'business',
      title: 'Poslovni subjekti',
      desc: 'Flote vozila, poslovni prostori, roba u skladištu i odgovornost.',
      icon: Briefcase,
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      {showInternalToggle && (
        <div className="flex justify-center mb-6">
          <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab('submit')}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === 'submit'
                  ? 'bg-[#0F2942] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Nova prijava štete</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('status')}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === 'status'
                  ? 'bg-[#0F2942] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Status predmeta</span>
            </button>
          </div>
        </div>
      )}

      {activeTab === 'status' ? (
        <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="max-w-xl">
            <h3 className="text-lg font-bold text-slate-900">Provjera statusa odštetnog predmeta</h3>
            <p className="text-xs text-slate-600 mt-1">
              Unesite službeni broj spisa (npr. <span className="font-semibold tabular-nums">ST-2026-0814</span>) ili OIB prijavitelja (npr. <span className="font-semibold tabular-nums">26182105153</span>).
            </p>
          </div>

          <form onSubmit={handleSearchClaim} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="Broj spisa (ST-2026-XXXX) ili 11-znamenkasti OIB"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={searching} className="shrink-0">
              {searching ? 'Pretraživanje...' : 'Provjeri status'}
            </Button>
          </form>

          {notFoundError && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>{notFoundError}</span>
            </div>
          )}

          {foundClaim && (
            <div className="space-y-4">
              <ClaimStatusTimeline claim={foundClaim} />

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3 text-xs text-slate-700">
                <PhoneCall className="w-4 h-4 text-[#0F2942] shrink-0 mt-0.5" />
                <p>
                  Za dopunu dokumentacije ili pitanja obratite se našem odjelu šteta na{' '}
                  <a href="tel:+38514800120" className="font-semibold text-[#0F2942] underline tabular-nums">
                    01 4800 120
                  </a>{' '}
                  uz poziv na referentni broj <strong>{foundClaim.claimNumber || foundClaim.id}</strong>.
                </p>
              </div>
            </div>
          )}
        </div>
      ) : submitSuccess ? (
        <div className="bg-white rounded-xl p-8 sm:p-10 border border-slate-200 shadow-sm text-center max-w-2xl mx-auto space-y-6">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="inline-block text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-md">
              Prijava štete zaprimljena
            </span>
            <h2 className="text-2xl font-bold text-slate-900">
              Odštetni zahtjev je evidentiran
            </h2>
            <p className="text-slate-600 text-sm max-w-md mx-auto">
              Prijava je proslijeđena na obradu za osiguravajuće društvo{' '}
              <strong className="text-slate-900">{carrierName}</strong>.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="text-left">
              <span className="text-xs text-slate-500 block">Referentni broj predmeta:</span>
              <span className="text-xl font-bold text-[#0F2942] tabular-nums">{trackingCode}</span>
            </div>
            <button
              type="button"
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Kopirano' : 'Kopiraj'}</span>
            </button>
          </div>

          <div className="text-left bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5 text-xs text-slate-700">
            <p className="font-bold text-slate-900 uppercase tracking-wider mb-1">Daljnji koraci:</p>
            <p>1. Ovlašteni zastupnik kontaktirat će vas unutar 24 radna sata radi uputa o izvidniku.</p>
            <p>
              2. Potvrda i status spisa dostupni su putem kartice &quot;Status predmeta&quot; koristeći broj{' '}
              <strong className="tabular-nums">{trackingCode}</strong> ili vaš OIB.
            </p>
            <p>3. Za hitnu pomoć na cesti ili vučnu službu nazovite 01 555 0666.</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setSubmitSuccess(false);
                setStep(1);
              }}
            >
              Nova prijava
            </Button>
            <Button
              type="button"
              onClick={() => {
                setSearchQuery(trackingCode);
                setSubmitSuccess(false);
                setActiveTab('status');
              }}
            >
              Provjeri status spisa
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmitClaim} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Progress Header */}
          <div className="bg-slate-50 border-b border-slate-200 p-5 sm:p-6">
            <div className="flex justify-between items-center max-w-3xl mx-auto">
              {[
                { s: 1, label: 'Štetni događaj' },
                { s: 2, label: 'Polica i osiguratelj' },
                { s: 3, label: 'Podnositelj i IBAN' },
                { s: 4, label: 'Dokazi i slanje' },
              ].map((item) => (
                <div key={item.s} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs tabular-nums transition-colors ${
                      step === item.s
                        ? 'bg-[#0F2942] text-white'
                        : step > item.s
                        ? 'bg-emerald-700 text-white'
                        : 'bg-white text-slate-400 border border-slate-300'
                    }`}
                  >
                    {step > item.s ? <Check className="w-4 h-4" /> : item.s}
                  </div>
                  <span
                    className={`text-xs mt-1.5 hidden sm:block ${
                      step === item.s ? 'font-bold text-[#0F2942]' : 'text-slate-500'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {submitError && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800">
                {submitError}
              </div>
            )}

            {/* Step 1 */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">1. Osnovni podaci o štetnom događaju</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Odaberite kategoriju osiguranja te navedite datum, mjesto i opis događaja.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id)}
                        className={`p-4 rounded-xl text-left border transition-colors flex items-start gap-3 cursor-pointer ${
                          isSelected
                            ? 'border-[#0F2942] bg-slate-50'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div
                          className={`p-2 rounded-lg shrink-0 ${
                            isSelected ? 'bg-[#0F2942] text-white' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{cat.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{cat.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                  <Input
                    label="Datum nastanka štete"
                    type="date"
                    value={incidentDate}
                    onChange={(e) => setIncidentDate(e.target.value)}
                    required
                  />
                  <Input
                    label="Mjesto nastanka štete"
                    placeholder="npr. Slavonska avenija bb, Zagreb"
                    value={incidentLocation}
                    onChange={(e) => setIncidentLocation(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Opis štetnog događaja *
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Opišite okolnosti nastanka štete, vidljiva oštećenja te eventualne druge sudionike..."
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0F2942] focus:ring-2 focus:ring-[#0F2942]/10"
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">2. Podaci o polici i očevidu</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Navedite osiguratelja kod kojeg je polica ugovorena te informaciju o policijskom očevidu.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Osiguravajuće društvo
                  </label>
                  <select
                    value={carrierName}
                    onChange={(e) => setCarrierName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-sm font-medium text-slate-900 focus:outline-none focus:border-[#0F2942]"
                  >
                    <option value="Generali osiguranje d.d.">Generali osiguranje d.d.</option>
                    <option value="Toyota VIP Kasko (Generali)">Toyota Centar Zagreb VIP Kasko (Generali)</option>
                    {CARRIER_PARTNERS.filter((c) => c.id !== 'generali').map((carrier) => (
                      <option key={carrier.id} value={carrier.name}>
                        {carrier.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Broj police (opcionalno)"
                    placeholder="npr. GEN-AO-2025-912"
                    value={policyNumber}
                    onChange={(e) => setPolicyNumber(e.target.value)}
                    helperText="Dostupno na ugovoru ili u portalu za klijente"
                  />
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <span className="text-xs font-bold text-[#0F2942] block mb-1">
                      Nemate broj police pri ruci?
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Naš ured će na temelju vašeg OIB-a provjeriti aktivnu policu u partnerskom sustavu.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <label className="flex items-center justify-between cursor-pointer gap-4">
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        Je li policija obavila očevid na mjestu događaja?
                      </span>
                      <span className="text-xs text-slate-500">
                        Za veće štete, krađu ili prometne nezgode s ozlijeđenima potreban je policijski zapisnik.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={policeReportFiled}
                      onChange={(e) => setPoliceReportFiled(e.target.checked)}
                      className="w-5 h-5 accent-[#0F2942] rounded cursor-pointer shrink-0"
                    />
                  </label>

                  {policeReportFiled && (
                    <div className="pt-3 border-t border-slate-200">
                      <Input
                        label="Nadležna policijska postaja"
                        placeholder="npr. I. Postaja prometne policije Zagreb"
                        value={policeStation}
                        onChange={(e) => setPoliceStation(e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">3. Podaci prijavitelja i IBAN</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Unesite kontakt podatke za komunikaciju i račun za eventualnu isplatu odštete.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Ime i prezime ili naziv tvrtke *"
                    placeholder="Ivan Horvat"
                    value={claimantName}
                    onChange={(e) => setClaimantName(e.target.value)}
                    required
                  />
                  <Input
                    label="OIB (11 znamenki)"
                    placeholder="12345678901"
                    value={claimantOib}
                    onChange={(e) => handleOibChange(e.target.value)}
                    maxLength={11}
                    error={oibError || undefined}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Broj mobitela *"
                    type="tel"
                    placeholder="+385 91 234 5678"
                    value={claimantPhone}
                    onChange={(e) => setClaimantPhone(e.target.value)}
                    required
                  />
                  <Input
                    label="E-mail adresa *"
                    type="email"
                    placeholder="ivan.horvat@email.hr"
                    value={claimantEmail}
                    onChange={(e) => setClaimantEmail(e.target.value)}
                    required
                  />
                </div>

                <Input
                  label="IBAN za isplatu odštete (opcionalno)"
                  placeholder="HR12 3456 7890 1234 5678 9"
                  value={iban}
                  onChange={(e) => setIban(e.target.value.toUpperCase())}
                  helperText="Isplata odštete vrši se izravno s računa osiguratelja na vaš IBAN"
                />
              </div>
            )}

            {/* Step 4 */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">4. Prilozi i završni pregled prijave</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Priložite fotografije oštećenja, europsko izvješće o nezgodi ili zapisnik ako ih imate.
                  </p>
                </div>

                <DamagePhotoUploader onFilesChanged={setEvidenceFiles} />

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5 text-slate-700">
                  <p className="font-bold text-slate-900 mb-1">Sažetak prijave:</p>
                  <p>
                    <strong>Osiguratelj:</strong> {carrierName}
                  </p>
                  <p>
                    <strong>Događaj:</strong> {incidentDate} • {incidentLocation}
                  </p>
                  <p>
                    <strong>Prijavitelj:</strong> {claimantName} ({claimantPhone}, {claimantEmail})
                  </p>
                  <p>
                    <strong>Priložene datoteke:</strong> {evidenceFiles.length}
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Footer */}
            <div className="pt-5 border-t border-slate-200 flex items-center justify-between gap-3">
              {step > 1 ? (
                <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
                  <ArrowLeft className="w-4 h-4 mr-1.5" />
                  Natrag
                </Button>
              ) : (
                <div />
              )}

              {step < 4 ? (
                <Button
                  type="button"
                  disabled={!canProceedToNextStep()}
                  onClick={() => setStep(step + 1)}
                >
                  Nastavi
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Pohrana prijave...' : 'Pošalji prijavu štete'}
                </Button>
              )}
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
