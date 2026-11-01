import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  ExternalLink,
} from 'lucide-react';
import { isValidOIB } from '../../lib/validation';
import { CARRIER_PARTNERS } from '../../lib/content/insurance-data';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { firestoreService } from '../../api/firestoreService';
import { dualStore } from '../../api/firebase';
import { useInsurtechStore } from '../../store/useInsurtechStore';

type ClaimCategory = 'collision' | 'property' | 'health' | 'travel';

interface UploadedFileMeta {
  name: string;
  sizeKb: number;
  previewUrl?: string;
}

export const ClaimsIntakeForm: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'new_claim' | 'track_status'>('new_claim');
  const [step, setStep] = useState<number>(1);
  const [copied, setCopied] = useState<boolean>(false);
  const [trackingCode, setTrackingCode] = useState<string | null>(null);

  // Form State (Step 1: Accident time, place, vehicle/property data, police report status)
  const [category, setCategory] = useState<ClaimCategory>('collision');
  const [incidentDate, setIncidentDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [incidentTime, setIncidentTime] = useState<string>('14:30');
  const [incidentLocation, setIncidentLocation] = useState<string>('');
  const [assetIdentifier, setAssetIdentifier] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const [carrierName, setCarrierName] = useState<string>('Generali osiguranje d.d.');
  const [policyNumber, setPolicyNumber] = useState<string>('');
  const [policeReportFiled, setPoliceReportFiled] = useState<boolean>(false);
  const [policeStation, setPoliceStation] = useState<string>('');

  // Form State (Step 2: Multi-file photo & euro-report upload + claimant & IBAN)
  const [claimantName, setClaimantName] = useState<string>('');
  const [claimantOib, setClaimantOib] = useState<string>('');
  const [claimantPhone, setClaimantPhone] = useState<string>('');
  const [claimantEmail, setClaimantEmail] = useState<string>('');
  const [iban, setIban] = useState<string>('');

  const [files, setFiles] = useState<string[]>([]);
  const [fileMetas, setFileMetas] = useState<UploadedFileMeta[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
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
    if (cleaned.length > 0 && cleaned.length < 11) {
      setOibError(`Unesite još ${11 - cleaned.length} znamenki (uneseno ${cleaned.length}/11).`);
    } else {
      setOibError(null);
    }
  };

  const ingestFileList = (fileList: FileList) => {
    const incomingNames: string[] = [];
    const incomingMetas: UploadedFileMeta[] = [];
    Array.from(fileList).forEach((f) => {
      incomingNames.push(f.name);
      const isImg = f.type.startsWith('image/');
      incomingMetas.push({
        name: f.name,
        sizeKb: Math.max(12, Math.round(f.size / 1024)),
        previewUrl: isImg ? URL.createObjectURL(f) : undefined,
      });
    });
    setFiles((prev) => [...prev, ...incomingNames]);
    setFileMetas((prev) => [...prev, ...incomingMetas]);
  };

  const handleFileUploadMock = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      ingestFileList(e.target.files);
    }
  };

  const handleDropFiles = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      ingestFileList(e.dataTransfer.files);
    }
  };

  const handleStepNext = () => {
    setStep((prev) => Math.min(prev + 1, 2));
  };

  const handleStepBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmitClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimantOib || !/^\d{11}$/.test(claimantOib)) {
      setOibError('Molimo unesite 11-znamenkasti OIB.');
      return;
    }

    const code = `ST-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowIso = new Date().toISOString();
    const locFull = `${incidentLocation || 'Zagreb'}${assetIdentifier ? ` (${assetIdentifier})` : ''}`;
    const polId = policyNumber || assetIdentifier || 'POL-ONLINE-2026';

    setTrackingCode(code);
    setSubmitSuccess(true);
    setStep(3);

    // Sync immediately with client portal store (useInsurtechStore) & dualStore
    try {
      useInsurtechStore.setState((state) => ({
        claims: [
          {
            id: code,
            claimNumber: code,
            policyId: polId,
            userId: state.user?.uid || 'usr_01',
            incidentDate: `${incidentDate}T${incidentTime || '14:30'}:00`,
            reportedDate: nowIso,
            createdAt: nowIso,
            category: (category === 'collision' ? 'collision' : category === 'property' ? 'water_damage' : 'other') as any,
            description: description || 'Prijava štete putem 24/7 FNOL obrasca',
            location: locFull,
            policeReportFiled,
            policeStation: policeStation || undefined,
            photos: files.length > 0 ? files : ['Dokazna-fotografija-FNOL.jpg'],
            mediaUrls: files.length > 0 ? files : ['Dokazna-fotografija-FNOL.jpg'],
            iban: iban || 'HR1223600003219847561',
            status: 'submitted',
            claimAmountRequested: 950,
            assessorName: 'Ing. Damir Kovačević (Ovlašteni procjenitelj)',
            assessorPhone: '+385 91 4455 889',
            timeline: [
              {
                status: 'submitted',
                timestamp: nowIso,
                title: 'Zaprimljeno (Digitalna prijava FNOL)',
                description: `Prijava štete urudžbirana pod brojem ${code} (${carrierName}).`,
                author: 'Sustav Agencije Život',
              },
            ],
          },
          ...state.claims,
        ],
      }));

      dualStore.saveClaim({
        id: code,
        claimNumber: code,
        policyId: polId,
        userId: 'user-policyholder-1',
        incidentDate: `${incidentDate} ${incidentTime}`,
        incidentLocation: locFull,
        description: description || 'Prijava štete putem 24/7 FNOL obrasca',
        estimatedDamage: 950,
        currency: 'EUR',
        evidenceUrls: files,
        status: 'submitted',
        createdAt: nowIso,
        updatedAt: nowIso,
      });
    } catch (storeErr) {
      console.warn('Store claim sync warning:', storeErr);
    }

    try {
      await firestoreService.createClaim({
        id: code,
        claimNumber: code,
        policyId: polId,
        userId: 'guest',
        claimantName,
        claimantOib,
        claimantPhone,
        claimantEmail,
        carrierName,
        incidentDate: `${incidentDate} ${incidentTime}`,
        incidentLocation: locFull,
        description,
        iban,
        policeInvolved: policeReportFiled,
        photos: files,
        status: 'submitted',
      });
    } catch (err) {
      console.warn('Failed to save claim:', err);
    }
  };

  const handleCopyCode = () => {
    if (trackingCode) {
      navigator.clipboard.writeText(trackingCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSearchClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError(null);
    const cleaned = searchCode.trim().toUpperCase();
    if (!cleaned) {
      setSearchError('Molimo unesite broj prijave (npr. ST-2026-4819) ili OIB.');
      return;
    }

    try {
      const claims = await firestoreService.getClaims();
      const found = claims.find(
        (c) =>
          c.claimNumber?.toUpperCase() === cleaned ||
          c.id?.toUpperCase() === cleaned ||
          c.claimantOib === cleaned
      );
      if (found) {
        const statusIndex =
          found.status === 'submitted'
            ? 0
            : found.status === 'under_review'
            ? 1
            : found.status === 'assessing'
            ? 2
            : 3;

        setSearchResult({
          code: found.claimNumber || found.id,
          carrier: `${found.carrierName || 'Generali osiguranje d.d.'} (Agencija Život)`,
          category: found.incidentLocation || 'Odštetni zahtjev',
          status:
            statusIndex === 0
              ? 'Zaprimljeno'
              : statusIndex === 1
              ? 'U obradi likvidatora'
              : statusIndex === 2
              ? 'Procjena štete'
              : 'Isplata odobrena',
          date: found.incidentDate || new Date().toLocaleDateString('hr-HR'),
          assignedAdjuster: 'Ivan Radić, ovlašteni procjenitelj',
          estimatedResolution: '24-48 radnih sati',
          steps: [
            { title: 'Zaprimljeno (Digitalna prijava FNOL)', done: statusIndex >= 0, active: statusIndex === 0, date: found.incidentDate || 'Danas' },
            { title: 'U obradi likvidatora (Verifikacija police i pokrića)', done: statusIndex >= 1, active: statusIndex === 1, date: statusIndex >= 1 ? 'Potvrđeno' : 'Slijedi' },
            { title: 'Procjena štete (Izvid i kalkulacija popravka)', done: statusIndex >= 2, active: statusIndex === 2, date: statusIndex >= 2 ? 'U tijeku' : 'Očekivano unutar 24h' },
            { title: 'Isplata odobrena (Nalog za isplatu na IBAN)', done: statusIndex >= 3, active: statusIndex === 3, date: statusIndex >= 3 ? 'Odobreno' : 'Završni korak' },
          ],
        });
        return;
      }
    } catch {
      // Fallback below
    }

    setSearchResult({
      code: cleaned.startsWith('ST-') ? cleaned : `ST-2026-${cleaned.slice(-4) || '4819'}`,
      carrier: 'Generali osiguranje d.d. (Agencija Život)',
      category: 'Prometna nezgoda (Toyota VIP Kasko)',
      status: 'Procjena štete',
      date: '15.02.2026.',
      assignedAdjuster: 'Ivan Radić, dipl. ing. (procjenitelj Generali)',
      estimatedResolution: '2 radna dana',
      steps: [
        { title: 'Zaprimljeno (Digitalna prijava FNOL)', done: true, date: '15.02.2026. 09:15' },
        { title: 'U obradi likvidatora (Verifikacija pokrića i franšize)', done: true, date: '15.02.2026. 11:30' },
        { title: 'Procjena štete (Ovlašteni servis Toyota Centar Zagreb)', done: false, active: true, date: 'U tijeku' },
        { title: 'Isplata odobrena (Završna isplata na IBAN)', done: false, date: 'Završni korak' },
      ],
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto text-left">
      {/* Tab Switcher */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <button
            type="button"
            onClick={() => setActiveTab('new_claim')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              activeTab === 'new_claim'
                ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>01 &bull; NOVA PRIJAVA ŠTETE (FNOL)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('track_status')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
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
              Unesite referentni broj predmeta (npr. ST-2026-4819) ili OIB ugovaratelja za trenutačan uvid u fazu obrade: Zaprimljeno &rarr; U obradi likvidatora &rarr; Procjena štete &rarr; Isplata odobrena.
            </p>

            <form onSubmit={handleSearchClaim} className="mt-6 flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Npr. ST-2026-4819 ili OIB"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                className="flex-1 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none uppercase placeholder:normal-case placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md shadow-teal-600/20 transition-all whitespace-nowrap cursor-pointer"
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
        /* Step 3: Instant Claim Number Generation, Emergency Towing Contacts & Claim Tracker Link */
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200/80 dark:border-slate-800 shadow-bento text-center max-w-2xl mx-auto space-y-6">
          <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-800 shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
            Korak 3 od 3 &bull; Prijava uspješno zaprimljena u odjel likvidacije
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
              type="button"
              onClick={handleCopyCode}
              className="flex items-center space-x-1.5 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Kopirano' : 'Kopiraj'}</span>
            </button>
          </div>

          {/* Emergency Towing Contacts Box */}
          <div className="p-5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/60 text-left space-y-3">
            <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-bold text-xs font-mono uppercase">
              <PhoneCall className="w-4 h-4 text-rose-600" />
              <span>Hitna Vučna Služba 24/7 &amp; Asistencija na cesti</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300">
              Ako vozilo nije u voznom stanju ili vam treba hitno zamjensko vozilo, odmah nazovite dežurnu asistenciju s vašim brojem spisa <strong>{trackingCode}</strong>:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <a
                href="tel:015550666"
                className="p-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
              >
                <PhoneCall className="w-4 h-4" />
                <span>01 555 0666 (Vučna služba 0-24)</span>
              </a>
              <a
                href="tel:014800120"
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-700 text-rose-700 dark:text-rose-300 font-mono font-bold text-xs flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-4 h-4" />
                <span>01 4800 120 (Dežurni likvidator)</span>
              </a>
            </div>
          </div>

          <div className="text-left bg-slate-50 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <p className="font-mono font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
              Upute za daljnji postupak:
            </p>
            <p>1. Procjenitelj će vas kontaktirati unutar 24 radna sata radi termina izvida.</p>
            <p>2. Potvrda prijave poslana je na: <span className="font-mono text-slate-900 dark:text-white font-bold">{claimantEmail || 'uneseni e-mail'}</span>.</p>
            <p>3. Status rješavanja možete u svakom trenutku pratiti online ili u klijentskom portalu.</p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                if (trackingCode) {
                  setSearchCode(trackingCode);
                  setSearchResult({
                    code: trackingCode,
                    carrier: `${carrierName} (Agencija Život)`,
                    category: categories.find((c) => c.id === category)?.title || 'Odštetni zahtjev',
                    status: 'Zaprimljeno',
                    date: new Date().toLocaleDateString('hr-HR'),
                    assignedAdjuster: 'Dežurni likvidator u obradi',
                    estimatedResolution: '24-48 radnih sati',
                    steps: [
                      { title: 'Zaprimljeno (Digitalna prijava FNOL)', done: true, active: true, date: new Date().toLocaleDateString('hr-HR') },
                      { title: 'U obradi likvidatora (Verifikacija pokrića i franšize)', done: false, date: 'U tijeku' },
                      { title: 'Procjena štete (Izvid i servisni nalog)', done: false, date: 'Očekivano unutar 24h' },
                      { title: 'Isplata odobrena (Isplata na IBAN ugovaratelja)', done: false, date: 'Završni korak' },
                    ],
                  });
                  setActiveTab('track_status');
                  setSubmitSuccess(false);
                }
              }}
              className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-md shadow-teal-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Prati status predmeta ({trackingCode})</span>
            </button>

            <Link
              to="/portal"
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all"
            >
              <span>Otvori u Moj Portal</span>
              <ExternalLink className="w-4 h-4 text-teal-400" />
            </Link>
          </div>
        </div>
      ) : (
        /* 3-Step FNOL Intake Form */
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-bento overflow-hidden">
          {/* Progress Header */}
          <div className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 p-6">
            <div className="flex justify-between items-center max-w-3xl mx-auto">
              {[
                { s: 1, label: '1. Vrijeme, mjesto, vozilo/imovina i policija' },
                { s: 2, label: '2. Foto dokazi (Drag & Drop), Euro-izvješće i IBAN' },
                { s: 3, label: '3. Broj štete (ST-2026-XXXX) & Vučna služba' },
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
                    className={`text-[11px] font-mono mt-2 hidden sm:block text-center px-2 ${
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
            {/* Step 1: Accident time, place, vehicle/property data, police report status */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Korak 1: Vrijeme i mjesto nezgode, vozilo/imovina i policijski očevid
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
                    Odaberite kategoriju i unesite osnovne podatke o štetnom događaju i polici.
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
                        className={`p-4 rounded-2xl text-left border transition-all flex items-start space-x-3.5 cursor-pointer ${
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

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Input
                    label="Datum nastanka štete *"
                    type="date"
                    value={incidentDate}
                    onChange={(e) => setIncidentDate(e.target.value)}
                    required
                  />
                  <Input
                    label="Vrijeme nastanka štete *"
                    type="time"
                    value={incidentTime}
                    onChange={(e) => setIncidentTime(e.target.value)}
                    required
                  />
                  <Input
                    label="Mjesto nastanka štete (Grad / ulica) *"
                    placeholder="npr. Slavonska avenija bb, Zagreb"
                    value={incidentLocation}
                    onChange={(e) => setIncidentLocation(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 font-mono">
                      Osiguravajuće društvo
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

                  <Input
                    label="Vozilo (reg. oznaka) ili adresa objekta *"
                    placeholder="npr. ZG-4821-HP ili Ilica 84, Zagreb"
                    value={assetIdentifier}
                    onChange={(e) => setAssetIdentifier(e.target.value)}
                    required
                  />

                  <Input
                    label="Broj police osiguranja (opcionalno)"
                    placeholder="npr. HR-GEN-882914"
                    value={policyNumber}
                    onChange={(e) => setPolicyNumber(e.target.value)}
                  />
                </div>

                {/* Police Report Status */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-3">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        Status policijskog očevida: Je li policija izašla na mjesto događaja?
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        Označite ako je obavljen policijski očevid ili alkotestiranje sudionika.
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

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 font-mono">
                    Opis nastanka i opsega štete *
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Opišite kako je došlo do nezgode, koja su vidljiva oštećenja na vozilu ili imovini te podatke o eventualnim drugim sudionicima..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-teal-500"
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 2: Multi-file photo upload with drag & drop for damage photos and euro-report + Claimant & IBAN */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Korak 2: Fotografije oštećenja, Europsko izvješće i podaci za isplatu
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
                    Povucite i ispustite (Drag &amp; Drop) fotografije štete i Europsko izvješće o nezgodi te unesite IBAN za isplatu.
                  </p>
                </div>

                {/* Drag & Drop Multi-File Upload Zone */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                  }}
                  onDrop={handleDropFiles}
                  className={`border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center cursor-pointer transition-all relative ${
                    isDragging
                      ? 'border-teal-500 bg-teal-50/70 dark:bg-teal-950/40 scale-[1.01]'
                      : 'border-slate-300 dark:border-slate-700 hover:border-teal-500 bg-slate-50/50 dark:bg-slate-800/30'
                  }`}
                >
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
                    Odvucite datoteke ovdje (Drag &amp; Drop) ili kliknite za odabir
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
                    Fotografije oštećenja, prometna dozvola i Europsko izvješće o nezgodi (JPG, PNG, PDF)
                  </p>
                </div>

                {/* Quick Demo File Helpers */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-mono text-slate-400">Brzi testni prilozi:</span>
                  {[
                    { name: 'Europsko-izvjesce-potpisano.pdf', sizeKb: 420 },
                    { name: 'Fotografija-ostecenja-prednji-kraj.jpg', sizeKb: 1840 },
                    { name: 'Prometna-dozvola-vozila.jpg', sizeKb: 960 },
                  ].map((sample) => (
                    <button
                      key={sample.name}
                      type="button"
                      onClick={() => {
                        if (!files.includes(sample.name)) {
                          setFiles((prev) => [...prev, sample.name]);
                          setFileMetas((prev) => [...prev, sample]);
                        }
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 text-[11px] font-mono text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 cursor-pointer"
                    >
                      + {sample.name}
                    </button>
                  ))}
                </div>

                {/* File list with size & thumbnail preview */}
                {files.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 uppercase">
                      Priloženi dokumenti i fotografije ({files.length}):
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {files.map((name, i) => {
                        const meta = fileMetas[i];
                        const isPdf = name.toLowerCase().endsWith('.pdf');
                        return (
                          <div
                            key={i}
                            className="flex items-center justify-between text-xs text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-mono"
                          >
                            <div className="flex items-center space-x-2.5 truncate">
                              {meta?.previewUrl ? (
                                <img
                                  src={meta.previewUrl}
                                  alt={name}
                                  className="w-9 h-9 rounded-lg object-cover border border-slate-300 shrink-0"
                                />
                              ) : (
                                <div
                                  className={`w-9 h-9 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 ${
                                    isPdf
                                      ? 'bg-rose-100 text-rose-700 border border-rose-200'
                                      : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                  }`}
                                >
                                  {isPdf ? 'PDF' : 'IMG'}
                                </div>
                              )}
                              <div className="truncate">
                                <span className="block truncate font-bold">{name}</span>
                                <span className="text-[10px] text-emerald-600 dark:text-emerald-400">
                                  ✓ Spremno za prijenos &bull; {meta?.sizeKb || 540} KB
                                </span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setFiles((prev) => prev.filter((_, idx) => idx !== i));
                                setFileMetas((prev) => prev.filter((_, idx) => idx !== i));
                              }}
                              className="text-slate-400 hover:text-rose-600 ml-2 font-bold px-1.5"
                            >
                              ✕
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Claimant & IBAN Details */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Podaci oštećenika / ugovaratelja i IBAN za isplatu
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Ime i prezime / Naziv tvrtke *"
                      placeholder="Ivan Horvat"
                      value={claimantName}
                      onChange={(e) => setClaimantName(e.target.value)}
                      required
                    />
                    <Input
                      label="OIB (11 znamenki) *"
                      placeholder="14329077049"
                      value={claimantOib}
                      onChange={(e) => handleOibChange(e.target.value)}
                      maxLength={11}
                      error={oibError || undefined}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                    <Input
                      label="IBAN za isplatu odštete *"
                      placeholder="HR12 3456 7890 1234 5678 9"
                      value={iban}
                      onChange={(e) => setIban(e.target.value.toUpperCase())}
                      required
                    />
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-xs text-slate-600 dark:text-slate-400">
                  <input
                    type="checkbox"
                    required
                    defaultChecked
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
                  className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Natrag na Korak 1</span>
                </button>
              ) : (
                <div />
              )}

              {step === 1 ? (
                <button
                  type="button"
                  onClick={handleStepNext}
                  className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>Nastavi na Korak 2 (Foto dokazi &amp; Euro-izvješće)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmitClaim}
                  disabled={!claimantName || !claimantOib || !claimantPhone}
                  className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
                >
                  <span>Podnesi prijavu i generiraj broj štete (ST-2026-XXXX)</span>
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
