import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AlertTriangle,
  Phone,
  CheckCircle2,
  Car,
  Home,
  HeartPulse,
  FileText,
  Download,
  ArrowRight,
  AlertCircle,
  CheckSquare,
  Upload,
} from 'lucide-react';
import { ClaimsIntakeForm } from '../components/claims/ClaimsIntakeForm';
import { JsonLd } from '../components/seo/JsonLd';
import { useInsurtechStore } from '../store/useInsurtechStore';
import {
  validateOIB,
  validateCroatianIBAN,
  formatEUR,
  normalizeOIBInput,
  normalizeCroatianIBANInput,
} from '../utils/validators';
import { generateSupportDocumentPdf } from '../utils/formatters';

type FnolCategory =
  | 'Prometna nesreća - AO/Kasko'
  | 'Šteta na imovini / Lom / Poplava'
  | 'Zdravstveni slučaj / Nezgoda';

const DAMAGE_ZONES_MAP: Record<FnolCategory, string[]> = {
  'Prometna nesreća - AO/Kasko': [
    'Prednji branik, maska i radar (ADAS)',
    'Prednje vjetrobransko staklo',
    'Lijeva bočna strana / vrata',
    'Desna bočna strana / vrata',
    'Stražnji branik i prtljažnik',
    'Krov i poklopac motora (tuča)',
    'Podvozje / Visokonaponska Hybrid baterija',
  ],
  'Šteta na imovini / Lom / Poplava': [
    'Kupaonica i vodovodne instalacije (izljev vode)',
    'Krovna konstrukcija i fasada (oluja / tuča)',
    'Dnevni boravak, parketi i namještaj',
    'Nosivi zidovi i dimnjak (potres)',
    'Kućanski uređaji i elektroinstalacije (udar groma)',
    'Ulazna vrata i stolarija (provalna krađa)',
  ],
  'Zdravstveni slučaj / Nezgoda': [
    'Specijalistički pregled i dijagnostika (MR / CT / UZV)',
    'Prijelom kosti / ortopedska ozljeda uslijed nezgode',
    'Bolničko liječenje i operativni zahvat',
    'Fizikalna terapija i rehabilitacija',
    'Troškovi lijekova s dopunske B-liste',
  ],
};

const CULPABILITY_OPTIONS: Record<FnolCategory, string[]> = {
  'Prometna nesreća - AO/Kasko': [
    'Drugi sudionik je isključivi krivac (potpisano Europsko izvješće)',
    'Kasko prijava — udar na parkingu / nepoznati počinitelj',
    'Kasko prijava — lom stakla ili nalet na divljač (bez gubitka bonusa)',
    'Vlastita odgovornost / podijeljena odgovornost (aktivacija Kasko police)',
  ],
  'Šteta na imovini / Lom / Poplava': [
    'Iznenadni događaj u vlastitom objektu (puknuće cijevi / požar)',
    'Elementarna nepogoda (oluja, tuča, poplava, potres)',
    'Šteta nastala iz susjednog stana / zajedničkih instalacija zgrade',
    'Provalna krađa ili vandalizam (uz policijski zapisnik)',
  ],
  'Zdravstveni slučaj / Nezgoda': [
    'Refundacija računa privatne poliklinike po polici zdravstvenog osiguranja',
    'Nesretni slučaj (nezgoda) u slobodno vrijeme ili na radu',
    'Hitna medicinska intervencija na putovanju u inozemstvu',
  ],
};

const CHECKLIST_OPTIONS = [
  'Europsko izvješće o prometnoj nesreći / Zapisnik o oštećenju',
  'Fotografije oštećenja iz više kutova (široki i detaljni plan)',
  'Preslika prometne dozvole i vozačke dozvole / Vlasnički list',
  'Policijski zapisnik ili potvrda o alkotestiranju (ako je policija izašla)',
  'Predračun ovlaštenog servisa (npr. Toyota Centar Zagreb) ili medicinski nalaz',
];

export default function PrijavaStetePage() {
  const { user, policies, submitNewClaim } = useInsurtechStore();
  const location = useLocation();
  const routeState = (location.state || {}) as {
    prefilledFnolDescription?: string;
    fnolIncidentType?: string;
  };

  const [mode, setMode] = useState<'guided_fnol' | 'classic_fnol'>('guided_fnol');
  const [category, setCategory] = useState<FnolCategory>('Prometna nesreća - AO/Kasko');
  const [policyNumber, setPolicyNumber] = useState<string>(
    policies[0]?.policyNumber || 'HR-GEN-882914-AO'
  );
  const [carrierName, setCarrierName] = useState<string>(
    policies[0]?.carrier || 'Generali osiguranje d.d.'
  );
  const [clientName, setClientName] = useState<string>(user.displayName || 'Marko Horvatić');
  const [clientOib, setClientOib] = useState<string>(user.oib || '24918274015');
  const [incidentDate, setIncidentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [incidentLocation, setIncidentLocation] = useState<string>('Zagreb, Slavonska avenija 48');
  const [culpability, setCulpability] = useState<string>(
    CULPABILITY_OPTIONS['Prometna nesreća - AO/Kasko'][0]
  );
  const [policeReportFiled, setPoliceReportFiled] = useState<boolean>(false);
  const [selectedZones, setSelectedZones] = useState<string[]>([
    'Prednji branik, maska i radar (ADAS)',
    'Prednje vjetrobransko staklo',
  ]);
  const [selectedChecklist, setSelectedChecklist] = useState<string[]>([
    CHECKLIST_OPTIONS[0],
    CHECKLIST_OPTIONS[1],
    CHECKLIST_OPTIONS[2],
  ]);
  const [estimatedAmountEur, setEstimatedAmountEur] = useState<number>(850);
  const [payoutIban, setPayoutIban] = useState<string>(user.iban || 'HR1223600003219847561');
  const [description, setDescription] = useState<string>(
    routeState.prefilledFnolDescription ||
      'Prilikom vožnje došlo je do oštećenja prednjeg vjetrobranskog stakla i prednjeg branika. Vozilo je vozno, tražim izvid i popravak u ovlaštenom servisu Toyota Centar Zagreb.'
  );

  useEffect(() => {
    if (routeState.prefilledFnolDescription) {
      setDescription(routeState.prefilledFnolDescription);
      if (
        routeState.fnolIncidentType?.toLowerCase().includes('izljev') ||
        routeState.fnolIncidentType?.toLowerCase().includes('poplav') ||
        routeState.fnolIncidentType?.toLowerCase().includes('imovin')
      ) {
        setCategory('Šteta na imovini / Lom / Poplava');
        setCulpability(CULPABILITY_OPTIONS['Šteta na imovini / Lom / Poplava'][0]);
        setSelectedZones([DAMAGE_ZONES_MAP['Šteta na imovini / Lom / Poplava'][0]]);
      }
    }
  }, [routeState.prefilledFnolDescription, routeState.fnolIncidentType]);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedClaim, setSubmittedClaim] = useState<any | null>(null);

  const handleCategoryChange = (newCat: FnolCategory) => {
    setCategory(newCat);
    setCulpability(CULPABILITY_OPTIONS[newCat][0]);
    setSelectedZones([DAMAGE_ZONES_MAP[newCat][0]]);
    setSubmittedClaim(null);
  };

  const toggleZone = (zone: string) => {
    setSelectedZones((prev) =>
      prev.includes(zone) ? prev.filter((z) => z !== zone) : [...prev, zone]
    );
  };

  const toggleChecklist = (item: string) => {
    setSelectedChecklist((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleSubmitGuidedFnol = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!policyNumber || policyNumber.trim().length < 4) {
      setErrorMsg('Molimo unesite valjanu Šifru police osiguranja.');
      return;
    }

    if (!validateOIB(clientOib)) {
      setErrorMsg('Uneseni OIB nije valjan prema ISO 7064 (MOD 11, 10) algoritmu.');
      return;
    }

    if (!validateCroatianIBAN(payoutIban)) {
      setErrorMsg('Uneseni IBAN mora započeti s HR i sadržavati točno 19 znamenki (ukupno 21 znak).');
      return;
    }

    if (selectedZones.length === 0) {
      setErrorMsg('Molimo označite barem jednu oštećenu zonu vozila/imovine.');
      return;
    }

    const created = submitNewClaim({
      policyId: policyNumber,
      policyNumber,
      clientName,
      clientOib,
      carrierName,
      incidentDate,
      location: incidentLocation,
      category,
      description,
      mediaUrls: ['https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=600&q=80'],
      iban: payoutIban,
      claimAmountRequested: estimatedAmountEur,
      damagedZones: selectedZones,
      culpability,
      policeReportFiled,
      documentChecklist: selectedChecklist,
    });

    setSubmittedClaim(created);
  };

  const howToSchema = {
    '@context': 'https://schema.org' as const,
    '@type': 'HowTo' as const,
    name: 'Kako prijaviti štetu na vozilu ili imovini u Hrvatskoj (FNOL)',
    description:
      'Vođeni postupak digitalne prijave štete u 5 faza uz sinkronizaciju s Korisničkim i Zastupničkim portalom Agencije Život.',
    step: [
      {
        '@type': 'HowToStep' as const,
        position: 1,
        name: '1. Zaprimljeno',
        text: 'Odaberite kategoriju štete, unesite Šifru police, OIB i IBAN te označite oštećene zone.',
      },
      {
        '@type': 'HowToStep' as const,
        position: 2,
        name: '2. Provjera dokumentacije',
        text: 'Licencirani zastupnik provjerava priloženo Europsko izvješće, fotografije i pokriće police.',
      },
      {
        '@type': 'HowToStep' as const,
        position: 3,
        name: '3. Predano osiguratelju',
        text: 'Spis se urudžbira u likvidaciju Generali osiguranja d.d. ili Toyota Centra Zagreb.',
      },
      {
        '@type': 'HowToStep' as const,
        position: 4,
        name: '4. Procjena štete',
        text: 'Procjenitelj vrši izvid i izdaje nalog za popravak ili obračun naknade.',
      },
      {
        '@type': 'HowToStep' as const,
        position: 5,
        name: '5. Isplata / Riješeno',
        text: 'Odobrena naknada isplaćuje se na verificirani HR IBAN ili izravno ovlaštenom servisu.',
      },
    ],
  };

  return (
    <div className="w-full bg-[#F8FAFC] min-h-screen py-10 sm:py-14 text-[#0F172A]">
      <JsonLd schema={howToSchema} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 text-left">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FEF2F2] border border-[#FECACA] text-[#C21817] text-xs font-mono font-bold">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>VOĐENI FNOL CENTAR ZA ŠTETE &bull; +385 91 450 1458</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
              Prijava šteta i praćenje likvidacije u 5 faza
            </h1>
            <p className="text-sm text-slate-600 max-w-2xl">
              Svaka prijavljena šteta odmah se sinkronizira u <strong>Korisnički portal</strong> (Moje prijavljene štete) i{' '}
              <strong>Zastupnički portal</strong> (Upravljanje štetama) uz validaciju OIB-a i HR IBAN računa.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => generateSupportDocumentPdf('euro_report')}
              className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-[#E2E8F0] text-xs font-bold text-[#0F172A] flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#C21817]" />
              <span>Europsko izvješće (PDF)</span>
            </button>
            <button
              type="button"
              onClick={() => setMode((m) => (m === 'guided_fnol' ? 'classic_fnol' : 'guided_fnol'))}
              className="px-3.5 py-2.5 rounded-xl bg-[#0F172A] text-white text-xs font-bold cursor-pointer"
            >
              {mode === 'guided_fnol' ? 'Preтраga statusa po broju spisa' : 'Povratak na vođeni FNOL čarobnjak'}
            </button>
          </div>
        </div>

        {mode === 'classic_fnol' ? (
          <ClaimsIntakeForm />
        ) : submittedClaim ? (
          <div className="bg-white rounded-3xl border-2 border-emerald-500 shadow-elevated p-8 max-w-3xl mx-auto text-left space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-xs font-mono font-bold text-emerald-700 uppercase">
                    FAZA 1 OD 5: ZAPRIMLJENO U KORISNIČKI I ZASTUPNIČKI PORTAL
                  </span>
                  <h2 className="text-2xl font-extrabold text-[#0F172A]">
                    Broj odštetnog spisa: <span className="font-mono text-[#C21817]">{submittedClaim.claimNumber}</span>
                  </h2>
                </div>
              </div>
              <span className="text-xl font-black font-mono text-[#0F172A] tabular-nums">
                {formatEUR(submittedClaim.claimAmountRequested || 0)}
              </span>
            </div>

            {/* 5-Phase Progress Preview */}
            <div className="grid grid-cols-5 gap-2 pt-1">
              {[
                '1. Zaprimljeno',
                '2. Provjera dokumentacije',
                '3. Predano osiguratelju',
                '4. Procjena štete',
                '5. Isplata / Riješeno',
              ].map((stepLabel, idx) => (
                <div
                  key={stepLabel}
                  className={`p-2.5 rounded-xl border text-center text-[11px] font-mono font-bold ${
                    idx === 0
                      ? 'bg-[#FEF2F2] border-[#C21817] text-[#C21817]'
                      : 'bg-[#F8FAFC] border-[#E2E8F0] text-slate-400'
                  }`}
                >
                  {stepLabel}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to="/korisnicki-portal"
                className="px-5 py-3 rounded-xl bg-[#C21817] hover:bg-[#991B1B] text-white font-bold text-xs flex items-center gap-2"
              >
                <span>Prati u Korisničkom portalu (Moje prijavljene štete)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/zastupnicki-portal"
                className="px-5 py-3 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold text-xs"
              >
                Otvori u Zastupničkom portalu (Trijaža šteta)
              </Link>
              <button
                type="button"
                onClick={() => setSubmittedClaim(null)}
                className="px-4 py-3 rounded-xl bg-slate-100 text-[#0F172A] font-bold text-xs cursor-pointer"
              >
                Nova prijava štete
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitGuidedFnol} className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
            <div className="lg:col-span-8 space-y-6">
              {/* Step 1: Category Selection */}
              <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-card p-6 sm:p-8 space-y-5">
                <h2 className="text-lg font-extrabold text-[#0F172A] border-b border-slate-100 pb-3">
                  1. Kategorija štetnog događaja i podaci o polici
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      id: 'Prometna nesreća - AO/Kasko' as FnolCategory,
                      icon: Car,
                      desc: 'Sudar, parking, lom stakla, tuča, Hybrid baterija',
                    },
                    {
                      id: 'Šteta na imovini / Lom / Poplava' as FnolCategory,
                      icon: Home,
                      desc: 'Izljev vode, požar, oluja, potres, provala',
                    },
                    {
                      id: 'Zdravstveni slučaj / Nezgoda' as FnolCategory,
                      icon: HeartPulse,
                      desc: 'Specijalistički računi, prijelomi, bolničko liječenje',
                    },
                  ].map((cat) => {
                    const Icon = cat.icon;
                    const active = category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleCategoryChange(cat.id)}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                          active
                            ? 'bg-[#FEF2F2] border-2 border-[#C21817] text-[#C21817]'
                            : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A] hover:border-slate-300'
                        }`}
                      >
                        <Icon className="w-5 h-5 mb-2 text-[#C21817]" />
                        <div className="text-xs font-extrabold">{cat.id}</div>
                        <div className="text-[11px] text-slate-500 mt-1">{cat.desc}</div>
                      </button>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Šifra police *</label>
                    <input
                      type="text"
                      value={policyNumber}
                      onChange={(e) => setPolicyNumber(e.target.value.toUpperCase())}
                      placeholder="HR-GEN-882914-AO"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] font-mono text-xs uppercase tabular-nums"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">OIB osiguranika (ISO 7064) *</label>
                    <input
                      type="text"
                      value={clientOib}
                      onChange={(e) => setClientOib(normalizeOIBInput(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] font-mono text-xs tabular-nums"
                      required
                    />
                    <span className={`text-[10px] font-mono ${validateOIB(clientOib) ? 'text-emerald-600' : 'text-[#C21817]'}`}>
                      {validateOIB(clientOib) ? '✓ Valjan ISO 7064 OIB' : 'Unesite 11-znamenkasti OIB'}
                    </span>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Ime i prezime osiguranika *</label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-xs font-semibold"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Datum nastanka štete *</label>
                    <input
                      type="date"
                      value={incidentDate}
                      onChange={(e) => setIncidentDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] font-mono text-xs"
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mjesto i adresa nastanka štete *</label>
                    <input
                      type="text"
                      value={incidentLocation}
                      onChange={(e) => setIncidentLocation(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Status odgovornosti / Okolnosti *</label>
                    <select
                      value={culpability}
                      onChange={(e) => setCulpability(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] text-xs font-semibold bg-white"
                    >
                      {CULPABILITY_OPTIONS[category].map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center pt-5">
                    <label className="flex items-center gap-2.5 text-xs font-bold text-[#0F172A] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={policeReportFiled}
                        onChange={(e) => setPoliceReportFiled(e.target.checked)}
                        className="w-4 h-4 accent-[#C21817]"
                      />
                      <span>Obavljen je službeni policijski očevid (MUP RH)</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Step 2: Damaged Zones & IBAN Validation */}
              <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-card p-6 sm:p-8 space-y-5">
                <h2 className="text-lg font-extrabold text-[#0F172A] border-b border-slate-100 pb-3">
                  2. Oštećene zone, dokumentacija i IBAN za isplatu
                </h2>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Označite oštećene zone ({category}):
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {DAMAGE_ZONES_MAP[category].map((zone) => {
                      const checked = selectedZones.includes(zone);
                      return (
                        <button
                          key={zone}
                          type="button"
                          onClick={() => toggleZone(zone)}
                          className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center gap-2.5 cursor-pointer ${
                            checked
                              ? 'bg-[#FEF2F2] border-[#C21817] text-[#C21817]'
                              : 'bg-[#F8FAFC] border-[#E2E8F0] text-slate-700'
                          }`}
                        >
                          <CheckSquare className={`w-4 h-4 shrink-0 ${checked ? 'text-[#C21817]' : 'text-slate-400'}`} />
                          <span>{zone}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      IBAN račun za isplatu naknade (HR + 19 znamenki) *
                    </label>
                    <input
                      type="text"
                      value={payoutIban}
                      onChange={(e) => setPayoutIban(normalizeCroatianIBANInput(e.target.value))}
                      placeholder="HR1223600003219847561"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] font-mono text-xs uppercase tabular-nums"
                      required
                    />
                    <span
                      className={`text-[10px] font-mono ${
                        validateCroatianIBAN(payoutIban) ? 'text-emerald-600' : 'text-[#C21817]'
                      }`}
                    >
                      {validateCroatianIBAN(payoutIban)
                        ? '✓ Valjan hrvatski IBAN (21 znak)'
                        : `${payoutIban.length}/21 znakova (format HR + 19 znamenki)`}
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Okvirna procjena štete (EUR)
                    </label>
                    <input
                      type="number"
                      min={50}
                      max={150000}
                      step={50}
                      value={estimatedAmountEur}
                      onChange={(e) => setEstimatedAmountEur(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] font-mono text-xs tabular-nums"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Detaljan opis štetnog događaja *
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-xs"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Right 4 Columns: Document Checklist & Submit */}
            <div className="lg:col-span-4">
              <div className="sticky top-24 bg-white rounded-3xl border border-[#E2E8F0] shadow-elevated p-6 space-y-5">
                <div className="border-b border-slate-100 pb-3">
                  <span className="text-[10px] font-mono uppercase font-bold text-[#C21817]">
                    DOKUMENTACIJSKA LISTA (FNOL)
                  </span>
                  <h3 className="text-base font-extrabold text-[#0F172A] mt-0.5">
                    Priložena dokumentacija uz prijavu
                  </h3>
                </div>

                <div className="space-y-2">
                  {CHECKLIST_OPTIONS.map((item) => {
                    const checked = selectedChecklist.includes(item);
                    return (
                      <label
                        key={item}
                        className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleChecklist(item)}
                          className="w-4 h-4 accent-[#C21817] mt-0.5 shrink-0"
                        />
                        <span className="text-slate-700 leading-snug">{item}</span>
                      </label>
                    );
                  })}
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-[#C21817] flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-4 px-5 rounded-xl bg-[#C21817] hover:bg-[#991B1B] text-white font-bold text-sm shadow-crimson-glow flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Podnesi FNOL prijavu štete</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
