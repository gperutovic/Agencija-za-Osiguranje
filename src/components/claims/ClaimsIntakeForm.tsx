import React, { useState } from 'react';
import {
  ShieldAlert,
  Car,
  Home,
  HeartPulse,
  Plane,
  Upload,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  Copy,
  Check,
  Search,
  PhoneCall,
  FileCheck,
} from 'lucide-react';
import { isValidOIB } from '../../lib/validation';
import { CARRIER_PARTNERS } from '../../lib/content/insurance-data';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

type ClaimCategory = 'collision' | 'property' | 'health' | 'travel';

export const ClaimsIntakeForm: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'new_claim' | 'track_status'>('new_claim');
  const [step, setStep] = useState<number>(1);
  const [copied, setCopied] = useState<boolean>(false);
  const [trackingCode, setTrackingCode] = useState<string | null>(null);

  // Form State
  const [category, setCategory] = useState<ClaimCategory>('collision');
  const [incidentDate, setIncidentDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [incidentLocation, setIncidentLocation] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const [carrierName, setCarrierName] = useState<string>('Generali osiguranje d.d.');
  const [policyNumber, setPolicyNumber] = useState<string>('');
  const [policeReportFiled, setPoliceReportFiled] = useState<boolean>(false);
  const [policeStation, setPoliceStation] = useState<string>('');

  const [claimantName, setClaimantName] = useState<string>('');
  const [claimantOib, setClaimantOib] = useState<string>('');
  const [claimantPhone, setClaimantPhone] = useState<string>('');
  const [claimantEmail, setClaimantEmail] = useState<string>('');
  const [iban, setIban] = useState<string>('');

  const [files, setFiles] = useState<string[]>([]);
  const [oibError, setOibError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  // Status Search State
  const [searchCode, setSearchCode] = useState<string>('');
  const [searchResult, setSearchResult] = useState<any | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const categories = [
    {
      id: 'collision' as ClaimCategory,
      title: 'Prometna nezgoda (Auto / Toyota VIP)',
      desc: 'Sudar, oštećenje na parkingu, lom stakla, tuča',
      icon: Car,
    },
    {
      id: 'property' as ClaimCategory,
      title: 'Šteta na imovini (ŽIVOT Dom)',
      desc: 'Izljev vode, požar, potres, provala u stan ili kuću',
      icon: Home,
    },
    {
      id: 'health' as ClaimCategory,
      title: 'Zdravstveni slučaj',
      desc: 'Bolnički troškovi, specijalistički pregled, lijekovi s B liste',
      icon: HeartPulse,
    },
    {
      id: 'travel' as ClaimCategory,
      title: 'Putno osiguranje',
      desc: 'Hitni medicinski troškovi u inozemstvu ili gubitak prtljage',
      icon: Plane,
    },
  ];

  const handleOibChange = (val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 11);
    setClaimantOib(cleaned);
    if (cleaned.length === 11) {
      if (!isValidOIB(cleaned)) {
        setOibError('Neispravan OIB prema kontrolnom broju (ISO 7064).');
      } else {
        setOibError(null);
      }
    } else {
      setOibError(null);
    }
  };

  const handleFileUploadMock = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileNames = Array.from(e.target.files).map((f) => f.name);
      setFiles((prev) => [...prev, ...fileNames]);
    }
  };

  const handleStepNext = () => {
    if (step === 3) {
      if (claimantOib && !isValidOIB(claimantOib)) {
        setOibError('Molimo unesite valjani 11-znamenkasti OIB.');
        return;
      }
    }
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const handleStepBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmitClaim = (e: React.FormEvent) => {
    e.preventDefault();
    const code = `ST-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    setTrackingCode(code);
    setSubmitSuccess(true);
  };

  const handleCopyCode = () => {
    if (trackingCode) {
      navigator.clipboard.writeText(trackingCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSearchClaim = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError(null);
    const cleaned = searchCode.trim().toUpperCase();
    if (!cleaned) {
      setSearchError('Molimo unesite broj prijave ili OIB.');
      return;
    }
    // Simulate lookup
    setSearchResult({
      code: cleaned.startsWith('ST-') ? cleaned : 'ST-2026-481920',
      carrier: 'Generali osiguranje d.d. (Agencija Život)',
      category: 'Prometna nezgoda (Toyota VIP Kasko)',
      status: 'Procjena štete u tijeku (Ovlašteni servis)',
      date: '15.09.2026',
      assignedAdjuster: 'M. Horvat, dipl. ing. (procjenitelj Generali)',
      estimatedResolution: '2 radna dana',
      steps: [
        { title: 'Prijava zaprimljena u digitalni sustav', done: true, date: '15.09.2026 09:15' },
        { title: 'Verifikacija pokrića i franšize', done: true, date: '15.09.2026 11:30' },
        { title: 'Procjena štete i odobrenje popravka', done: true, active: true, date: '15.09.2026' },
        { title: 'Likvidacija i naručivanje dijelova', done: false, date: 'Očekivano 17.09.' },
        { title: 'Završna isplata na IBAN', done: false, date: 'Završni korak' },
      ],
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto text-left">
      {/* Tab Switcher */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <button
            onClick={() => setActiveTab('new_claim')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all ${
              activeTab === 'new_claim'
                ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>01 &bull; NOVA PRIJAVA ŠTETE (FNOL)</span>
          </button>
          <button
            onClick={() => setActiveTab('track_status')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all ${
              activeTab === 'track_status'
                ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-sm border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Search className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>02 &bull; PROVJERA STATUSA SPISA</span>
          </button>
        </div>
      </div>

      {activeTab === 'track_status' ? (
        /* Status Tracker Tab */
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800 shadow-bento">
          <div className="max-w-xl mx-auto text-center space-y-4">
            <div className="w-12 h-12 bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 rounded-2xl flex items-center justify-center mx-auto border border-teal-200 dark:border-teal-800 shadow-sm">
              <Search className="w-6 h-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Praćenje statusa odštetnog zahtjeva
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Unesite referentni broj predmeta (npr. ST-2026-XXXXXX) ili OIB ugovaratelja za trenutačan uvid u fazu obrade kod procjenitelja.
            </p>

            <form onSubmit={handleSearchClaim} className="mt-6 flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Npr. ST-2026-784192 ili OIB"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                className="flex-1 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none uppercase placeholder:normal-case placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md shadow-teal-600/20 transition-all whitespace-nowrap"
              >
                Provjeri status
              </button>
            </form>
            {searchError && (
              <p className="text-xs text-rose-500 dark:text-rose-400 text-left font-mono">{searchError}</p>
            )}
          </div>

          {searchResult && (
            <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 max-w-2xl mx-auto space-y-6">
              <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/60 flex flex-wrap justify-between items-center gap-4">
                <div>
                  <span className="text-[10px] font-mono text-teal-700 dark:text-teal-400 uppercase tracking-wider block font-bold">
                    Broj predmeta
                  </span>
                  <p className="text-xl font-black text-slate-900 dark:text-white font-mono">{searchResult.code}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{searchResult.carrier}</p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60">
                    <Clock className="w-3.5 h-3.5 mr-1" />
                    {searchResult.status}
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-mono">
                    Procjenitelj: {searchResult.assignedAdjuster}
                  </p>
                </div>
              </div>

              {/* Steps Progress */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Kronologija rješavanja odštetnog spisa
                </h4>
                <div className="space-y-2.5">
                  {searchResult.steps.map((st: any, idx: number) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                        st.active
                          ? 'bg-teal-50 dark:bg-teal-950/30 border-teal-200 dark:border-teal-800 text-teal-950 dark:text-teal-200 font-semibold'
                          : st.done
                          ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
                          : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {st.done ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                        ) : st.active ? (
                          <Clock className="w-5 h-5 text-teal-600 dark:text-teal-400 animate-spin shrink-0" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600 shrink-0" />
                        )}
                        <span className="text-xs sm:text-sm">{st.title}</span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">{st.date}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-800/40 flex items-start space-x-3 text-xs text-slate-700 dark:text-slate-300">
                <PhoneCall className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                <p>
                  Imate dodatnih računa ili pitanja? Dežurni savjetnik Agencije Život dostupan je na{' '}
                  <a href="tel:014800120" className="text-teal-700 dark:text-teal-400 font-bold underline font-mono">
                    01 4800 120
                  </a>{' '}
                  uz poziv na broj predmeta {searchResult.code}.
                </p>
              </div>
            </div>
          )}
        </div>
      ) : submitSuccess ? (
        /* Confirmation Screen */
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200/80 dark:border-slate-800 shadow-bento text-center max-w-2xl mx-auto space-y-6">
          <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-800 shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
            Prijava uspješno zaprimljena u odjel likvidacije
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Vaš odštetni zahtjev je registriran
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
            Zahtjev je dodijeljen ovlaštenom procjenitelju osiguravajućeg društva{' '}
            <strong className="text-slate-900 dark:text-white">{carrierName}</strong>.
          </p>

          <div className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
            <div className="text-left">
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Službeni broj predmeta:
              </span>
              <span className="text-xl sm:text-2xl font-mono font-black text-teal-700 dark:text-teal-400">
                {trackingCode}
              </span>
            </div>
            <button
              onClick={handleCopyCode}
              className="flex items-center space-x-1.5 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Kopirano' : 'Kopiraj'}</span>
            </button>
          </div>

          <div className="text-left bg-slate-50 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <p className="font-mono font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
              Upute za daljnji postupak:
            </p>
            <p>1. Procjenitelj će vas kontaktirati unutar 24 radna sata radi termina izvida.</p>
            <p>2. Potvrda prijave poslana je na: <span className="font-mono text-slate-900 dark:text-white font-bold">{claimantEmail || 'uneseni e-mail'}</span>.</p>
            <p>3. Za hitne vuče ili zamjensko Toyota vozilo nazovite 24/7 dežurni broj 01 555 0666.</p>
          </div>

          <button
            onClick={() => {
              setSubmitSuccess(false);
              setStep(1);
            }}
            className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md shadow-teal-600/20 transition-all"
          >
            Nova prijava štete
          </button>
        </div>
      ) : (
        /* Multi-Step Intake Form */
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-bento overflow-hidden">
          {/* Progress Header */}
          <div className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 p-6">
            <div className="flex justify-between items-center max-w-3xl mx-auto">
              {[
                { s: 1, label: 'Vrsta štete' },
                { s: 2, label: 'Polica & Ugovor' },
                { s: 3, label: 'Podnositelj & IBAN' },
                { s: 4, label: 'Dokazi & Slanje' },
              ].map((item) => (
                <div key={item.s} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-xs transition-all ${
                      step === item.s
                        ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20 ring-2 ring-teal-500/20'
                        : step > item.s
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {step > item.s ? <CheckCircle2 className="w-5 h-5" /> : `0${item.s}`}
                  </div>
                  <span
                    className={`text-[11px] font-mono mt-2 hidden sm:block ${
                      step === item.s ? 'font-bold text-slate-900 dark:text-white' : 'text-slate-400'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 sm:p-10 space-y-6">
            {/* Step 1: Category & Details */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">1. O kakvoj se vrsti štete radi?</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
                    Odaberite kategoriju osiguranja pod kojom prijavljujete štetni događaj.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id)}
                        className={`p-4 rounded-2xl text-left border transition-all flex items-start space-x-3.5 ${
                          isSelected
                            ? 'border-teal-600 bg-teal-50/80 dark:bg-teal-950/40 shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30'
                        }`}
                      >
                        <div
                          className={`p-2.5 rounded-xl shrink-0 ${
                            isSelected ? 'bg-teal-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">{cat.title}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{cat.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Input
                    label="Datum nastanka štete"
                    type="date"
                    value={incidentDate}
                    onChange={(e) => setIncidentDate(e.target.value)}
                    required
                  />
                  <Input
                    label="Mjesto nastanka štete (Grad / adresa)"
                    placeholder="npr. Slavonska avenija bb, Zagreb"
                    value={incidentLocation}
                    onChange={(e) => setIncidentLocation(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 font-mono">
                    Kratak opis štetnog događaja
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Opišite što se točno dogodilo, oštećenja na vozilu/objektu, te eventualne druge sudionike..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-teal-500"
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 2: Policy & Insurer */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">2. Podaci o osiguranju</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
                    Navedite osiguratelja kod kojeg imate ugovorenu policu.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 font-mono">
                    Odaberite osiguravajuće društvo
                  </label>
                  <select
                    value={carrierName}
                    onChange={(e) => setCarrierName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="Generali osiguranje d.d.">Generali osiguranje d.d. (Strateški partner)</option>
                    <option value="Toyota VIP Kasko (Generali)">Toyota VIP Kasko (Toyota Centar Zagreb)</option>
                    {CARRIER_PARTNERS.map((carrier) => (
                      <option key={carrier.id} value={carrier.name}>
                        {carrier.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Broj police osiguranja (ako je pri ruci)"
                    placeholder="npr. 010-94827104"
                    value={policyNumber}
                    onChange={(e) => setPolicyNumber(e.target.value)}
                    helperText="Možete pronaći na polici ili u portalu Moj Život"
                  />
                  <div className="bg-teal-50/50 dark:bg-teal-950/20 p-4 rounded-2xl border border-teal-100 dark:border-teal-800/40">
                    <span className="text-[11px] font-mono text-teal-700 dark:text-teal-400 font-bold block mb-1">
                      Nemate broj police kod sebe?
                    </span>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      Bez brige, naši agenti će po vašem OIB-u automatski pronaći aktivnu policu u registru osiguratelja.
                    </p>
                  </div>
                </div>

                {/* Police Report */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-3">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        Je li policija obavila očevid na mjestu događaja?
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        Za veće štete ili ozlijeđene osobe obavezan je policijski zapisnik.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={policeReportFiled}
                      onChange={(e) => setPoliceReportFiled(e.target.checked)}
                      className="w-5 h-5 text-teal-600 rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-teal-500 cursor-pointer accent-teal-600"
                    />
                  </label>

                  {policeReportFiled && (
                    <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                      <Input
                        label="Nadležna policijska postaja (PP)"
                        placeholder="npr. I. Prometna policijska postaja Zagreb (Heinzelova)"
                        value={policeStation}
                        onChange={(e) => setPoliceStation(e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Claimant & IBAN */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">3. Podaci za isplatu i kontakt</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
                    Unesite podatke oštećenika ili ugovaratelja za isplatu odštete.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Ime i prezime / Naziv tvrtke"
                    placeholder="Ivan Horvat"
                    value={claimantName}
                    onChange={(e) => setClaimantName(e.target.value)}
                    required
                  />
                  <div>
                    <Input
                      label="OIB (11 znamenki)"
                      placeholder="12345678901"
                      value={claimantOib}
                      onChange={(e) => handleOibChange(e.target.value)}
                      maxLength={11}
                      error={oibError || undefined}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Broj mobitela"
                    type="tel"
                    placeholder="+385 91 234 5678"
                    value={claimantPhone}
                    onChange={(e) => setClaimantPhone(e.target.value)}
                    required
                  />
                  <Input
                    label="E-mail adresa"
                    type="email"
                    placeholder="ivan.horvat@email.hr"
                    value={claimantEmail}
                    onChange={(e) => setClaimantEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Input
                    label="IBAN za isplatu odštete (Hrvatska banka)"
                    placeholder="HR12 3456 7890 1234 5678 9"
                    value={iban}
                    onChange={(e) => setIban(e.target.value.toUpperCase())}
                    helperText="Odšteta se isplaćuje izravno na vaš račun nakon odobrenja"
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 4: Evidence & Review */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">4. Prilaganje dokaza i potvrda</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
                    Priložite fotografije oštećenja, europsko izvješće ili račune.
                  </p>
                </div>

                {/* Upload Zone */}
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-teal-500 rounded-3xl p-6 sm:p-8 text-center bg-slate-50/50 dark:bg-slate-800/30 cursor-pointer transition-colors relative">
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    onChange={handleFileUploadMock}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="w-12 h-12 bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-teal-200 dark:border-teal-800 shadow-sm">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    Kliknite ovdje ili odvucite datoteke za prijenos
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
                    JPG, PNG, PDF do 15 MB po datoteci
                  </p>
                </div>

                {/* File list */}
                {files.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 uppercase">
                      Priloženi dokumenti ({files.length}):
                    </p>
                    <div className="space-y-1.5">
                      {files.map((name, i) => (
                        <div key={i} className="flex items-center space-x-2 text-xs text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-mono">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Summary Box */}
                <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300 space-y-2 font-mono">
                  <p className="font-bold text-slate-900 dark:text-white text-sm mb-2">Sažetak prijave:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div><span className="text-slate-500 dark:text-slate-400">Kategorija:</span> {category}</div>
                    <div><span className="text-slate-500 dark:text-slate-400">Osiguratelj:</span> {carrierName}</div>
                    <div><span className="text-slate-500 dark:text-slate-400">Podnositelj:</span> {claimantName || 'Nije navedeno'}</div>
                    <div><span className="text-slate-500 dark:text-slate-400">OIB:</span> {claimantOib || 'Nije navedeno'}</div>
                    <div><span className="text-slate-500 dark:text-slate-400">Telefon:</span> {claimantPhone || 'Nije navedeno'}</div>
                    <div><span className="text-slate-500 dark:text-slate-400">IBAN:</span> {iban || 'Nije navedeno'}</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-xs text-slate-600 dark:text-slate-400">
                  <input
                    type="checkbox"
                    required
                    id="consent"
                    className="w-4 h-4 mt-0.5 text-teal-600 rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 cursor-pointer accent-teal-600"
                  />
                  <label htmlFor="consent" className="cursor-pointer leading-relaxed">
                    Potvrđujem točnost navedenih podataka i suglasan sam s obradom osobnih podataka u svrhu rješavanja odštetnog zahtjeva sukladno Zakonu o osiguranju i GDPR propisima.
                  </label>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between items-center pt-8 mt-8 border-t border-slate-100 dark:border-slate-800">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleStepBack}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Natrag</span>
                </button>
              ) : (
                <div />
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleStepNext}
                  className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 flex items-center gap-1.5 transition-all"
                >
                  <span>Nastavi</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmitClaim}
                  disabled={!claimantName || !claimantOib || !claimantPhone}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-all disabled:opacity-50"
                >
                  <span>Pošalji prijavu štete</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
