import React, { useState } from 'react';
import {
  ShieldAlert,
  Car,
  Home,
  HeartPulse,
  Plane,
  Camera,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  ArrowRight,
  ArrowLeft,
  Copy,
  Check,
  Search,
  PhoneCall,
} from 'lucide-react';
import { isValidOIB } from '../../lib/validation';
import { CARRIER_PARTNERS } from '../../data/mockData';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

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
  
  const [carrierName, setCarrierName] = useState<string>('Croatia osiguranje');
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
      title: 'Prometna nezgoda (Auto / Kasko)',
      desc: 'Sudar, oštećenje na parkingu, lom stakla, tuča',
      icon: Car,
    },
    {
      id: 'property' as ClaimCategory,
      title: 'Šteta na imovini',
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
      carrier: 'Croatia osiguranje',
      category: 'Prometna nezgoda (AO)',
      status: 'Procjena štete u tijeku',
      date: '14.09.2026',
      assignedAdjuster: 'M. Horvat, dipl. ing. (procjenitelj)',
      estimatedResolution: '2 do 4 radna dana',
      steps: [
        { title: 'Prijava zaprimljena', done: true, date: '14.09.2026 09:15' },
        { title: 'Verifikacija pokrića police', done: true, date: '14.09.2026 11:30' },
        { title: 'Procjena štete i izvid', done: true, active: true, date: '15.09.2026' },
        { title: 'Likvidacija i obračun', done: false, date: 'Očekivano 18.09.' },
        { title: 'Isplata na IBAN', done: false, date: 'Završni korak' },
      ],
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Tab Switcher */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex p-1.5 bg-slate-100 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('new_claim')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'new_claim'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-emerald-600" />
            <span>Nova prijava štete (FNOL)</span>
          </button>
          <button
            onClick={() => setActiveTab('track_status')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'track_status'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Search className="w-4 h-4 text-blue-600" />
            <span>Provjera statusa prijavljene štete</span>
          </button>
        </div>
      </div>

      {activeTab === 'track_status' ? (
        /* Status Tracker Tab */
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200 shadow-sm">
          <div className="max-w-xl mx-auto text-center">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100">
              <Search className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Praćenje statusa odštetnog zahtjeva</h2>
            <p className="text-sm text-slate-600 mt-2">
              Unesite jedinstveni broj prijave (npr. ST-2026-XXXXXX) ili OIB ugovaratelja za trenutni uvid u fazu obrade kod osiguratelja.
            </p>

            <form onSubmit={handleSearchClaim} className="mt-6 flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Npr. ST-2026-784192 ili OIB"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                className="flex-1 px-4 py-3 border border-slate-300 rounded-xl text-slate-900 font-medium text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase placeholder:normal-case"
              />
              <Button variant="primary" type="submit" size="md">
                Provjeri status
              </Button>
            </form>
            {searchError && (
              <p className="text-xs text-red-600 mt-2 text-left">{searchError}</p>
            )}
          </div>

          {searchResult && (
            <div className="mt-10 pt-8 border-t border-slate-100 max-w-2xl mx-auto">
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 mb-6 flex flex-wrap justify-between items-center gap-4">
                <div>
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                    Broj predmeta
                  </span>
                  <p className="text-lg font-extrabold text-slate-900">{searchResult.code}</p>
                  <p className="text-xs text-slate-500">{searchResult.carrier} • {searchResult.category}</p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    <Clock className="w-3.5 h-3.5 mr-1" />
                    {searchResult.status}
                  </span>
                  <p className="text-xs text-slate-500 mt-1">
                    Procjenitelj: {searchResult.assignedAdjuster}
                  </p>
                </div>
              </div>

              {/* Steps Progress */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Kronologija rješavanja
                </h4>
                <div className="space-y-3">
                  {searchResult.steps.map((st: any, idx: number) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-3.5 rounded-xl border ${
                        st.active
                          ? 'bg-blue-50/70 border-blue-200 text-blue-950 font-semibold'
                          : st.done
                          ? 'bg-emerald-50/40 border-emerald-100 text-slate-700'
                          : 'bg-slate-50 border-slate-100 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {st.done ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        ) : st.active ? (
                          <Clock className="w-5 h-5 text-blue-600 animate-spin shrink-0" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-slate-300 shrink-0" />
                        )}
                        <span className="text-sm">{st.title}</span>
                      </div>
                      <span className="text-xs font-medium text-slate-500">{st.date}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 p-4 rounded-xl bg-blue-50/60 border border-blue-100 flex items-start space-x-3 text-xs text-blue-900">
                <PhoneCall className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p>
                  Imate dodatnih pitanja ili novih računa? Javite se našem dežurnom agentu na{' '}
                  <a href="tel:015550666" className="font-bold underline">
                    01 555 0666
                  </a>{' '}
                  uz poziv na broj predmeta {searchResult.code}.
                </p>
              </div>
            </div>
          )}
        </div>
      ) : submitSuccess ? (
        /* Confirmation Screen */
        <div className="bg-white rounded-2xl p-8 sm:p-12 border border-slate-200 shadow-sm text-center max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md shadow-emerald-500/10">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Prijava uspješno zaprimljena u sustav
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-4">
            Vaš odštetni zahtjev je registriran
          </h2>
          <p className="text-slate-600 text-sm mt-2 max-w-md mx-auto">
            Zahtjev je proslijeđen odjelu likvidacije šteta u društvu{' '}
            <span className="font-semibold text-slate-900">{carrierName}</span>.
          </p>

          <div className="my-8 p-5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div className="text-left">
              <span className="text-xs text-slate-500 block">Referentni broj prijave:</span>
              <span className="text-xl font-mono font-bold text-blue-700">{trackingCode}</span>
            </div>
            <button
              onClick={handleCopyCode}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Kopirano!' : 'Kopiraj'}</span>
            </button>
          </div>

          <div className="text-left bg-blue-50/50 p-4 rounded-xl border border-blue-100 space-y-2 text-xs text-slate-700 mb-8">
            <p className="font-semibold text-blue-900">Sljedeći koraci:</p>
            <p>1. U roku od 24 radna sata kontaktirat će vas ovlašteni procjenitelj radi dogovora izvida.</p>
            <p>2. Potvrda prijave s uputama poslana je na vašu e-mail adresu: <span className="font-semibold">{claimantEmail || 'uneseni e-mail'}</span>.</p>
            <p>3. Za dodatna pitanja naš tim za pomoć pri štetama dostupan je na 01 555 0666.</p>
          </div>

          <Button
            variant="primary"
            onClick={() => {
              setSubmitSuccess(false);
              setStep(1);
            }}
          >
            Nova prijava štete
          </Button>
        </div>
      ) : (
        /* Multi-Step Intake Form */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Progress Header */}
          <div className="bg-slate-50 border-b border-slate-200 p-6">
            <div className="flex justify-between items-center max-w-3xl mx-auto">
              {[
                { s: 1, label: 'Vrsta štete' },
                { s: 2, label: 'Podaci o polici' },
                { s: 3, label: 'Podnositelj & IBAN' },
                { s: 4, label: 'Dokazi & Slanje' },
              ].map((item) => (
                <div key={item.s} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                      step === item.s
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 ring-4 ring-blue-100'
                        : step > item.s
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {step > item.s ? <CheckCircle2 className="w-5 h-5" /> : item.s}
                  </div>
                  <span
                    className={`text-xs mt-2 hidden sm:block ${
                      step === item.s ? 'font-bold text-blue-900' : 'text-slate-500'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 sm:p-10">
            {/* Step 1: Category & Details */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">1. O kakvoj se vrsti štete radi?</h3>
                  <p className="text-xs text-slate-500 mt-1">
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
                        className={`p-4 rounded-xl text-left border-2 transition-all flex items-start space-x-3.5 ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div
                          className={`p-2.5 rounded-lg shrink-0 ${
                            isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{cat.title}</p>
                          <p className="text-xs text-slate-500 mt-1">{cat.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
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
                  <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                    Kratak opis štetnog događaja
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Opišite što se točno dogodilo, oštećenja na vozilu/objektu, te eventualne druge sudionike..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 2: Policy & Insurer */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">2. Podaci o osiguranju</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Navedite osiguratelja kod kojeg imate ugovorenu policu.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                    Odaberite osiguravajuće društvo
                  </label>
                  <select
                    value={carrierName}
                    onChange={(e) => setCarrierName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {CARRIER_PARTNERS.map((carrier) => (
                      <option key={carrier.id} value={carrier.name}>
                        {carrier.name} ({carrier.marketShare} udjela)
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
                    helperText="Možete pronaći na vrhu police ili u digitalnom novčaniku"
                  />
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <span className="text-xs font-semibold text-slate-500 block mb-1">
                      Nemate broj police kod sebe?
                    </span>
                    <p className="text-xs text-slate-600">
                      Bez brige, naši agenti će po vašem OIB-u automatski pronaći aktivnu policu u registru osiguratelja.
                    </p>
                  </div>
                </div>

                {/* Police Report */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <span className="text-sm font-semibold text-slate-900 block">
                        Je li policija obavila očevid na mjestu događaja?
                      </span>
                      <span className="text-xs text-slate-500">
                        Za veće štete ili ozlijeđene osobe obavezan je policijski zapisnik.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={policeReportFiled}
                      onChange={(e) => setPoliceReportFiled(e.target.checked)}
                      className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                    />
                  </label>

                  {policeReportFiled && (
                    <div className="pt-3 border-t border-slate-200">
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
                  <h3 className="text-xl font-bold text-slate-900">3. Podaci za isplatu i kontakt</h3>
                  <p className="text-xs text-slate-500 mt-1">
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
                    helperText="Odšteta se isplaćuje izravno na vaš tekući ili žiro račun nakon odobrenja"
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 4: Evidence & Review */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">4. Prilaganje dokaza i potvrda</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Priložite fotografije oštećenja, europsko izvješće ili račune kako biste ubrzali obradu.
                  </p>
                </div>

                {/* Upload Zone */}
                <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-6 sm:p-8 text-center bg-slate-50/50 cursor-pointer transition-colors relative">
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    onChange={handleFileUploadMock}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-slate-800">
                    Kliknite ovdje ili odvucite datoteke za prijenos
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    JPG, PNG, PDF do 15 MB po datoteci (fotografije oštećenja, europsko izvješće)
                  </p>
                </div>

                {/* File list */}
                {files.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-600 uppercase">Priloženi dokumenti ({files.length}):</p>
                    <div className="space-y-1.5">
                      {files.map((name, i) => (
                        <div key={i} className="flex items-center space-x-2 text-xs text-slate-700 bg-slate-100 p-2 rounded-lg">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Summary Box */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-2">
                  <p className="font-bold text-slate-900 text-sm mb-2">Sažetak prijave:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div><span className="text-slate-500">Kategorija:</span> {category}</div>
                    <div><span className="text-slate-500">Osiguratelj:</span> {carrierName}</div>
                    <div><span className="text-slate-500">Podnositelj:</span> {claimantName || 'Nije navedeno'}</div>
                    <div><span className="text-slate-500">OIB:</span> {claimantOib || 'Nije navedeno'}</div>
                    <div><span className="text-slate-500">Telefon:</span> {claimantPhone || 'Nije navedeno'}</div>
                    <div><span className="text-slate-500">IBAN:</span> {iban || 'Nije navedeno'}</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-xs text-slate-500">
                  <input
                    type="checkbox"
                    required
                    id="consent"
                    className="w-4 h-4 mt-0.5 text-blue-600 rounded border-slate-300 cursor-pointer"
                  />
                  <label htmlFor="consent" className="cursor-pointer">
                    Potvrđujem točnost navedenih podataka i suglasan sam s obradom osobnih podataka u svrhu rješavanja odštetnog zahtjeva sukladno Zakonu o osiguranju i GDPR propisima.
                  </label>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between items-center pt-8 mt-8 border-t border-slate-100">
              {step > 1 ? (
                <Button variant="ghost" size="md" onClick={handleStepBack}>
                  <ArrowLeft className="w-4 h-4 mr-1.5" />
                  <span>Natrag</span>
                </Button>
              ) : (
                <div />
              )}

              {step < 4 ? (
                <Button variant="primary" size="md" onClick={handleStepNext}>
                  <span>Nastavi</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              ) : (
                <Button
                  variant="emerald"
                  size="md"
                  onClick={handleSubmitClaim}
                  disabled={!claimantName || !claimantOib || !claimantPhone}
                >
                  <span>Pošalji prijavu štete</span>
                  <CheckCircle2 className="w-4 h-4 ml-1.5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
