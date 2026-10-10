import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  CheckCircle2,
  TrendingDown,
  Sparkles,
  Info,
  PhoneCall,
  ArrowRight,
  Pill,
  Smartphone,
  Hospital,
  AlertCircle,
  Download,
  Share2,
  QrCode,
  Calendar,
  Check,
  X,
  Stethoscope,
} from 'lucide-react';
import {
  calculateDopunskoHealth,
  HZZO_STATUTORY_MONTHLY_2026,
  HZZO_STATUTORY_ANNUAL_2026,
} from '../../lib/calculations/dopunsko-health';
import { formatEuro } from '../../lib/calculations';
import { generateIpidPdf } from '../../lib/services/ipidService';
import { Hub3aPaymentSlipModal } from '../payment/Hub3aPaymentSlipModal';
import { ShareQuoteModal } from '../quotes/ShareQuoteModal';
import { leadService } from '../../api/firestoreService';

interface DopunskoCalculatorProps {
  onSelectPlan?: (carrierName: string, monthlyPrice: number) => void;
  className?: string;
}

export const DopunskoCalculator: React.FC<DopunskoCalculatorProps> = ({
  onSelectPlan,
  className = '',
}) => {
  const [age, setAge] = useState<number>(28);
  const [includeBList, setIncludeBList] = useState<boolean>(true);
  const [includeSpecialistFastTrack, setIncludeSpecialistFastTrack] = useState<boolean>(true);
  const [selectedCarrier, setSelectedCarrier] = useState<string>('Generali Osiguranje');

  // Modal states
  const [showBindModal, setShowBindModal] = useState<boolean>(false);
  const [isHub3aModalOpen, setIsHub3aModalOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);

  // Form input states
  const [contactPhone, setContactPhone] = useState<string>('');
  const [contactEmail, setContactEmail] = useState<string>('');
  const [contactName, setContactName] = useState<string>('');

  const baseResult = useMemo(() => {
    return calculateDopunskoHealth({ age, includeBList });
  }, [age, includeBList]);

  // Adjust for specialist fast-track add-on if chosen (+4.50 €/mo for private clinic MR/CT/sistematski)
  const specialistAddonMonthly = includeSpecialistFastTrack ? 4.5 : 0;
  const privateMonthly = parseFloat((baseResult.privateMonthly + specialistAddonMonthly).toFixed(2));
  const privateAnnual = parseFloat((privateMonthly * 12).toFixed(2));
  const annualSavings = parseFloat(
    Math.max(0, HZZO_STATUTORY_ANNUAL_2026 - baseResult.privateAnnual).toFixed(2)
  );

  const handleOpenBind = (carrier: string) => {
    setSelectedCarrier(carrier);
    if (onSelectPlan) {
      onSelectPlan(carrier, privateMonthly);
    } else {
      setShowBindModal(true);
    }
  };

  const handleDownloadIpid = () => {
    generateIpidPdf({
      category: 'dopunsko',
      carrierName: selectedCarrier,
      productName: `${selectedCarrier} Dopunsko i Dodatno zdravstveno`,
      customDetails: {
        age,
        annualPremium: privateAnnual,
      },
    });
  };

  const handleConfirmBind = async () => {
    try {
      await leadService.saveLead({
        oib: '',
        name: contactName || 'Klijent Dopunsko',
        email: contactEmail,
        phone: contactPhone,
        productType: 'health',
        status: 'new',
        annualPremium: privateAnnual,
        selectedInsurer: selectedCarrier,
        data: {
          age,
          includeBList,
          includeSpecialistFastTrack,
          monthlyPrice: privateMonthly,
        },
      });
    } catch (e) {
      console.error(e);
    }

    alert(
      `Hvala Vam! Zahtjev za ugovaranje police (${selectedCarrier}) je zaprimljen. Naš ovlašteni zastupnik u osiguranju kontaktirat će Vas u roku od 15 minuta.`
    );
    setShowBindModal(false);
  };

  return (
    <div
      className={`w-full bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/40 p-6 sm:p-8 lg:p-10 ${className}`}
    >
      {/* 2026 HZZO Reform Statutory Benchmark Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-rose-50/80 via-amber-50/60 to-teal-50/80 border border-rose-200/80 mb-8">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center font-bold shrink-0">
            <Info className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded">
                REFORMA ZDRAVSTVA 2026
              </span>
              <span className="text-[10px] font-mono text-teal-800 bg-teal-100 px-2 py-0.5 rounded font-bold">
                OVLAŠTENI ZASTUPNIK
              </span>
            </div>
            <p className="text-sm font-bold text-slate-900 mt-1">
              Referentna HZZO polica poskupjela na <strong className="text-rose-600 font-mono">15,00 € / mj.</strong> (180,00 € god.) — privatne police dostupne već od <strong className="text-teal-700 font-mono">9,50 € / mj.</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
            <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
            Ušteda do 102 €/god.
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Sliders & Checkboxes */}
        <div className="lg:col-span-6 space-y-6">
          {/* Age Slider */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex justify-between items-baseline mb-1">
              <label htmlFor="dopunsko-age-input" className="text-sm font-bold text-slate-900 flex items-center gap-2">
                Vaša trenutna dob:
                <span className="text-xs font-normal text-slate-500">(18 – 80 god.)</span>
              </label>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-rose-600 font-mono tracking-tight">{age}</span>
                <span className="text-xs font-semibold text-slate-600">godina</span>
              </div>
            </div>

            <input
              id="dopunsko-age-input"
              type="range"
              min={18}
              max={80}
              value={age}
              onChange={(e) => setAge(parseInt(e.target.value, 10))}
              className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-600 focus:outline-none"
              aria-label="Odaberite vašu dob"
            />

            <div className="flex justify-between text-xs font-mono text-slate-600 mt-2">
              <span>18 god (od 6,50 €)</span>
              <span>35 god (od 7,50 €)</span>
              <span>50 god (od 9,50 €)</span>
              <span>80 god</span>
            </div>
          </div>

          {/* Checkboxes: B-list & Private Clinic Fast-Track */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
              Izbor dopunskih pokrića i brzog pristupa
            </p>

            {/* Checkbox 1: B-List */}
            <label className="flex items-start gap-3 cursor-pointer group p-2 rounded-xl hover:bg-white transition-colors">
              <input
                type="checkbox"
                checked={includeBList}
                onChange={(e) => setIncludeBList(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-rose-600 focus:ring-rose-600 border-slate-300"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Pill className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                    Pokriće dopunske B-liste lijekova (do 200 € / god.)
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pokriva nadoplate za originalne i inovativne recepte koje HZZO odbija financirati.
                </p>
              </div>
            </label>

            {/* Checkbox 2: Specialist Fast-track (MR/CT/Sistematski) */}
            <label className="flex items-start gap-3 cursor-pointer group p-2 rounded-xl hover:bg-white transition-colors border-t border-slate-200/60 pt-3">
              <input
                type="checkbox"
                checked={includeSpecialistFastTrack}
                onChange={(e) => setIncludeSpecialistFastTrack(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-rose-600 focus:ring-rose-600 border-slate-300"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-teal-600" />
                    <span className="text-sm font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
                      Privatne klinike & Specijalistički pregledi bez čekanja
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-teal-700">+4,50 €/mj.</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Brzi pristup MR, CT, ultrazvuku i godišnjem sistematskom pregledu u poliklinikama (Medikol, Sv. Katarina, Croatia Poliklinika).
                </p>
              </div>
            </label>

            {/* m-Doktor Banner */}
            <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-xs text-slate-600">
              <span className="flex items-center gap-1.5 font-medium">
                <Smartphone className="w-4 h-4 text-blue-500" />
                m-Doktor video konzultacije 24/7
              </span>
              <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-mono">
                Uključeno bez doplate
              </span>
            </div>
          </div>

          {/* Actuarial Notice Card */}
          <div
            className={`p-4 rounded-2xl text-xs leading-relaxed border transition-colors ${
              baseResult.isHzzoOptimal
                ? 'bg-amber-50/80 border-amber-200 text-amber-900'
                : 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {baseResult.isHzzoOptimal ? (
                <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              ) : (
                <Sparkles className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              )}
              <p>
                <strong>Aktuarski savjetnik (Agencija Život):</strong> {baseResult.recommendationText}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Comparison Card, Savings Counter & Actions */}
        <div className="lg:col-span-6 bg-slate-50 rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-between space-y-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider font-bold text-slate-600">
              Usporedba mjesečnih troškova (2026. godina)
            </span>

            {/* Side-by-Side Comparison Cards */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              {/* HZZO Card */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 text-left relative overflow-hidden">
                <span className="text-[11px] font-mono font-bold text-slate-500 block">
                  HZZO Zakonska Polica
                </span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl sm:text-3xl font-black text-slate-500 line-through decoration-rose-500 decoration-2 font-mono">
                    {formatEuro(HZZO_STATUTORY_MONTHLY_2026)}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">/ mj.</span>
                </div>
                <span className="text-[11px] text-slate-600 block mt-1 font-mono">
                  180,00 € godišnje
                </span>
                <span className="mt-3 inline-block text-[10px] uppercase font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200/50">
                  +33% skuplje u 2026.
                </span>
              </div>

              {/* Private Carrier Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-white to-emerald-50/40 border-2 border-emerald-500 text-left shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg font-mono">
                  PREPORUKA
                </div>
                <span className="text-[11px] font-mono font-bold text-emerald-800 block">
                  Privatni Osiguratelj
                </span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl sm:text-3xl font-black text-emerald-700 font-mono">
                    {formatEuro(privateMonthly)}
                  </span>
                  <span className="text-xs text-slate-600 font-medium">/ mj.</span>
                </div>
                <span className="text-[11px] text-emerald-700 font-semibold block mt-1 font-mono">
                  {formatEuro(privateAnnual)} godišnje
                </span>
                <span className="mt-3 inline-block text-[10px] uppercase font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  {includeBList ? 'B-lista uključena' : 'Osnovno pokriće'}
                </span>
              </div>
            </div>

            {/* Annual Savings Counter Banner */}
            {!baseResult.isHzzoOptimal && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-between shadow-lg shadow-emerald-500/20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <TrendingDown className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-xs text-emerald-100 font-mono font-medium block">
                      Vaša izravna godišnja ušteda
                    </span>
                    <span className="text-2xl font-black text-white font-mono">
                      do {formatEuro(annualSavings)} / god.
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold bg-white/20 px-2.5 py-1 rounded-full text-white">
                  -{Math.round((annualSavings / HZZO_STATUTORY_ANNUAL_2026) * 100)}%
                </span>
              </motion.div>
            )}

            {/* Carrier Options List */}
            <div className="mt-5 space-y-2">
              <span className="text-xs font-mono text-slate-600 uppercase font-bold block">
                Licencirani osiguratelji u ponudi (Allianz, Generali, Croatia)
              </span>
              <div className="space-y-2">
                {[
                  { name: 'Generali Osiguranje', diff: 0, tag: 'Glavni partner' },
                  { name: 'Allianz Hrvatska', diff: 0.5, tag: 'B-lista do 200 €' },
                  { name: 'Croatia Osiguranje', diff: 0.8, tag: 'Vlastite poliklinike' },
                ].map((c) => {
                  const monthlyC = parseFloat((privateMonthly + c.diff).toFixed(2));
                  const isSelected = selectedCarrier === c.name;
                  return (
                    <div
                      key={c.name}
                      onClick={() => setSelectedCarrier(c.name)}
                      className={`p-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'border-emerald-600 bg-white shadow-sm'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{c.name}</span>
                          <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            {c.tag}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500">0 dana karence pri prijelazu</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-base font-extrabold text-slate-950 font-mono">
                          {formatEuro(monthlyC)} / mj.
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCarrier(c.name);
                            setShowBindModal(true);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          Odaberi
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* IPID One-Click Download */}
            <div className="mt-4 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={handleDownloadIpid}
                className="w-full py-2.5 px-3 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-teal-600" />
                <span>Preuzmi službeni IPID obrazac dopunskog osiguranja (PDF)</span>
              </button>
            </div>
          </div>

          {/* Quick Actions Footer Strip (HUB 3A & WhatsApp) */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsHub3aModalOpen(true)}
                className="py-2.5 px-3 rounded-xl bg-white border border-slate-200 hover:border-teal-500 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-all"
              >
                <QrCode className="w-4 h-4 text-teal-600" />
                <span>HUB 3A Uplatnica</span>
              </button>

              <button
                type="button"
                onClick={() => setIsShareModalOpen(true)}
                className="py-2.5 px-3 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-all"
              >
                <Share2 className="w-4 h-4 text-emerald-600" />
                <span>Spremi na WhatsApp</span>
              </button>
            </div>

            <button
              onClick={() => handleOpenBind(selectedCarrier)}
              className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
            >
              <span>Ugovori policu online bez provizije</span>
              <ArrowRight className="w-4 h-4 text-teal-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Bind Intake Modal */}
      <AnimatePresence>
        {showBindModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4"
            >
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-emerald-600" />
                  <h3 className="text-base font-bold text-slate-900">Ugovaranje police dopunskog</h3>
                </div>
                <button
                  onClick={() => setShowBindModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                <p>
                  <strong>Odabrani osiguratelj:</strong> {selectedCarrier}
                </p>
                <p>
                  <strong>Mjesečna premija:</strong> {formatEuro(privateMonthly)} / mj.
                </p>
                <p>
                  <strong>Godišnja ušteda vs HZZO:</strong> do {formatEuro(annualSavings)}
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ime i prezime *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Ivan Horvat"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-rose-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Broj mobitela / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="091 234 5678"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-rose-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    E-mail za dostavu police *
                  </label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="ivan.horvat@email.hr"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-rose-600"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleConfirmBind}
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md"
              >
                Potvrdi i dovrši ugovaranje
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* HUB 3A Payment Slip Modal */}
      <Hub3aPaymentSlipModal
        isOpen={isHub3aModalOpen}
        onClose={() => setIsHub3aModalOpen(false)}
        data={{
          payerName: contactName || 'Ugovaratelj dopunskog',
          amountEur: privateAnnual,
          paymentDescription: `Premija ${selectedCarrier} dopunsko zdravstveno (dob ${age})`,
        }}
      />

      {/* WhatsApp / Email Share Modal */}
      <ShareQuoteModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        category="health"
        summaryTitle={`Dopunsko zdravstveno (dob ${age} god.)`}
        calculatedPriceEur={privateAnnual}
        monthlyPriceEur={privateMonthly}
        carrierName={selectedCarrier}
        details={{
          age,
          includeBList,
          includeSpecialistFastTrack,
          savings: annualSavings,
        }}
      />
    </div>
  );
};

export default DopunskoCalculator;
