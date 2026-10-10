import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  ShieldCheck,
  Waves,
  Lock,
  Building,
  Sparkles,
  ArrowRight,
  Check,
  Download,
  Share2,
  QrCode,
  Calendar,
  AlertTriangle,
  Flame,
  Activity,
  Users,
} from 'lucide-react';
import { formatEuro } from '../../lib/calculations';
import { generateIpidPdf } from '../../lib/services/ipidService';
import { Hub3aPaymentSlipModal } from '../payment/Hub3aPaymentSlipModal';
import { ShareQuoteModal } from '../quotes/ShareQuoteModal';
import { leadService } from '../../api/firestoreService';

interface PropertyCalculatorProps {
  className?: string;
  onQuoteRequested?: (data: any) => void;
}

export const PropertyCalculator: React.FC<PropertyCalculatorProps> = ({
  className = '',
  onQuoteRequested,
}) => {
  const [propertyType, setPropertyType] = useState<'stan' | 'kuca'>('stan');
  const [squareMeters, setSquareMeters] = useState<number>(75);
  const [buildYear, setBuildYear] = useState<number>(2012);

  // Coverage Toggles
  const [includeEarthquake, setIncludeEarthquake] = useState<boolean>(true);
  const [includeContents, setIncludeContents] = useState<boolean>(true); // Stvari kućanstva
  const [includeWaterLeak, setIncludeWaterLeak] = useState<boolean>(true); // Izljev vode
  const [includeTheft, setIncludeTheft] = useState<boolean>(true); // Provalna krađa
  const [includeLiability, setIncludeLiability] = useState<boolean>(true); // Privatna odgovornost prema trećima
  const [deductibleEuro, setDeductibleEuro] = useState<0 | 150 | 300>(0);

  // Selected carrier
  const [selectedCarrier, setSelectedCarrier] = useState<string>('Generali osiguranje d.d.');

  // Modals & form state
  const [isHub3aModalOpen, setIsHub3aModalOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [address, setAddress] = useState<string>('');

  const calculation = useMemo(() => {
    // Base rate per square meter: apartments ~ 0.42 €/m², houses ~ 0.58 €/m²
    const baseRatePerMeter = propertyType === 'stan' ? 0.42 : 0.58;
    let annual = squareMeters * baseRatePerMeter;

    // Earthquake based on reconstruction value (građevinska vrijednost bez podosiguranja)
    // Older buildings (>1968 before earthquake codes) have a small risk factor
    const ageFactor = buildYear < 1968 ? 1.25 : buildYear < 2000 ? 1.1 : 1.0;
    if (includeEarthquake) {
      annual += squareMeters * 0.38 * ageFactor;
    }

    // Household goods (stvari kućanstva)
    if (includeContents) {
      annual += squareMeters * 0.22;
    }

    // Water leak
    if (includeWaterLeak) {
      annual += 22.0;
    }

    // Theft
    if (includeTheft) {
      annual += 18.0;
    }

    // Third-party private liability (odgovornost prema trećima)
    if (includeLiability) {
      annual += 14.0;
    }

    // Deductible discount
    if (deductibleEuro === 150) {
      annual *= 0.88; // -12%
    } else if (deductibleEuro === 300) {
      annual *= 0.78; // -22%
    }

    const annualTotal = parseFloat(Math.max(48.0, annual).toFixed(2));
    const monthlyInstallment = parseFloat((annualTotal / 12).toFixed(2));

    // Nova građevinska vrijednost bez podosiguranja (standard: 1.400 €/m² za stanove, 1.250 €/m² za kuće)
    const buildingReconstructionValue = squareMeters * (propertyType === 'stan' ? 1400 : 1250);
    const contentsValue = squareMeters * 400; // 400 €/m² za stvari kućanstva

    return {
      annualTotal,
      monthlyInstallment,
      buildingReconstructionValue,
      contentsValue,
      liabilityLimit: 50000,
    };
  }, [
    propertyType,
    squareMeters,
    buildYear,
    includeEarthquake,
    includeContents,
    includeWaterLeak,
    includeTheft,
    includeLiability,
    deductibleEuro,
  ]);

  const carrierOffers = useMemo(() => {
    const baseTotal = calculation.annualTotal;
    return [
      {
        id: 'generali',
        name: 'Generali osiguranje d.d.',
        tag: 'Glavni strateški partner',
        price: baseTotal,
        highlight: true,
        features: [
          'Potres na punu novu građevinsku vrijednost bez podosiguranja',
          'Hitne intervencije majstora 24/7 (vodoinstalater, bravar, staklar)',
          'Odgovornost prema trećima do 50.000 € uključena',
        ],
      },
      {
        id: 'wiener',
        name: 'Wiener osiguranje VIG d.d.',
        tag: 'Specijalist za imovinu i potres',
        price: parseFloat((baseTotal * 0.98).toFixed(2)),
        features: [
          'Kompletan paket "Moj Dom" s popustom na novogradnju',
          'Privremeni smještaj do 12 mjeseci u slučaju potresa ili požara',
        ],
      },
      {
        id: 'croatia',
        name: 'Croatia osiguranje d.d.',
        tag: 'Domaća tradicija & mreža procjene',
        price: parseFloat((baseTotal * 1.04).toFixed(2)),
        features: [
          'Najbrži izvid šteta nakon elementarnih nepogoda',
          'Pokriće solarnih panela i toplinskih pumpi',
        ],
      },
      {
        id: 'allianz',
        name: 'Allianz Hrvatska d.d.',
        tag: 'Vrhunska zaštita kućanstva',
        price: parseFloat((baseTotal * 1.02).toFixed(2)),
        features: [
          'Allianz asistencija doma s uključenim popravkom kućanskih aparata',
          'Bez odbitne franšize za izljev vode',
        ],
      },
    ];
  }, [calculation.annualTotal]);

  const activeOffer = useMemo(() => {
    return carrierOffers.find((c) => c.name === selectedCarrier) || carrierOffers[0];
  }, [carrierOffers, selectedCarrier]);

  const handleDownloadIpid = () => {
    generateIpidPdf({
      category: 'imovina',
      carrierName: selectedCarrier,
      productName: `${selectedCarrier} Osiguranje Doma i Potresa`,
      customDetails: {
        squareMeters,
        annualPremium: activeOffer.price,
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    try {
      await leadService.saveLead({
        oib: '',
        name: fullName || 'Klijent Imovina',
        email,
        phone,
        productType: 'property',
        status: 'new',
        annualPremium: activeOffer.price,
        selectedInsurer: selectedCarrier,
        data: {
          propertyType,
          squareMeters,
          buildYear,
          includeEarthquake,
          includeContents,
          includeLiability,
          address,
        },
      });
    } catch (err) {
      console.error(err);
    }

    if (onQuoteRequested) {
      onQuoteRequested({
        propertyType,
        squareMeters,
        buildYear,
        includeEarthquake,
        carrier: selectedCarrier,
        price: activeOffer.price,
      });
    }
  };

  return (
    <div
      className={`w-full bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/40 p-6 sm:p-8 lg:p-10 ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 mb-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
            <Home className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-slate-900">
                Kalkulator Osiguranja Doma, Potresa i Odgovornosti
              </h3>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-teal-50 text-teal-700 border border-teal-200 uppercase">
                OVLAŠTENI ZASTUPNIK
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Generali & Wiener paketi • Zaštita na novu građevinsku vrijednost bez podosiguranja • Usporedba vodećih društava
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-amber-50 text-amber-800 border border-amber-200 self-start sm:self-auto">
          Izračun u 45 sekundi
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Form Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Property Type Selector */}
          <div>
            <label className="text-sm font-bold text-slate-900 block mb-2">1. Vrsta nekretnine:</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPropertyType('stan')}
                className={`py-3.5 px-4 rounded-2xl border-2 text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  propertyType === 'stan'
                    ? 'border-amber-600 bg-amber-50/50 text-amber-950 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                }`}
              >
                <Building className="w-4 h-4 text-amber-600" />
                <span>Stan u stambenoj zgradi</span>
              </button>

              <button
                type="button"
                onClick={() => setPropertyType('kuca')}
                className={`py-3.5 px-4 rounded-2xl border-2 text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  propertyType === 'kuca'
                    ? 'border-amber-600 bg-amber-50/50 text-amber-950 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                }`}
              >
                <Home className="w-4 h-4 text-amber-600" />
                <span>Obiteljska kuća</span>
              </button>
            </div>
          </div>

          {/* 2. Square Meters & Build Year Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Square footage (m²) */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex justify-between items-baseline">
                <label htmlFor="property-sqm-input" className="text-xs font-bold text-slate-700">
                  Površina nekretnine:
                </label>
                <span className="text-xl font-black text-slate-950 font-mono">
                  {squareMeters} m²
                </span>
              </div>
              <input
                id="property-sqm-input"
                type="range"
                min={20}
                max={350}
                step={1}
                value={squareMeters}
                onChange={(e) => setSquareMeters(parseInt(e.target.value, 10))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600 focus:outline-none"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>20 m²</span>
                <span>80 m²</span>
                <span>350 m²</span>
              </div>
            </div>

            {/* Build Year */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex justify-between items-baseline">
                <label htmlFor="property-year-input" className="text-xs font-bold text-slate-700">
                  Godina izgradnje:
                </label>
                <span className="text-xl font-black text-slate-950 font-mono">
                  {buildYear}.
                </span>
              </div>
              <input
                id="property-year-input"
                type="range"
                min={1930}
                max={2026}
                step={1}
                value={buildYear}
                onChange={(e) => setBuildYear(parseInt(e.target.value, 10))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600 focus:outline-none"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>1930.</span>
                <span>1968. (Anti-seizmik)</span>
                <span>2026.</span>
              </div>
            </div>
          </div>

          {/* 3. Coverage Checkboxes: Earthquake, Contents, Liability */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
            <span className="text-xs font-mono uppercase tracking-wider font-bold text-slate-700 block">
              Odabir ključnih pokrića i zaštita od potresa
            </span>

            {/* Earthquake Toggle */}
            <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl bg-white border-2 border-amber-300 shadow-2xs">
              <input
                type="checkbox"
                checked={includeEarthquake}
                onChange={(e) => setIncludeEarthquake(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-black text-slate-900">
                      Zaštita od potresa (Nova građevinska vrijednost)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                    BEZ PODOSIGURANJA
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Pokriva trošak cjelokupne građevinske sanacije ili ponovne izgradnje do iznosa od{' '}
                  <strong className="text-slate-900 font-mono">
                    {formatEuro(calculation.buildingReconstructionValue)}
                  </strong>{' '}
                  bez odbitka amortizacije.
                </p>
              </div>
            </label>

            {/* Household Contents (Stvari kućanstva) */}
            <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl bg-white border border-slate-200 hover:border-slate-300">
              <input
                type="checkbox"
                checked={includeContents}
                onChange={(e) => setIncludeContents(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-teal-600" />
                    <span className="text-sm font-bold text-slate-900">
                      Stvari kućanstva (Namještaj, tehnika, odjeća)
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-500">
                    do {formatEuro(calculation.contentsValue)}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pokriva uništenje ili oštećenje pokretnina uslijed požara, potresa, izljeva vode i provalne krađe.
                </p>
              </div>
            </label>

            {/* Third-Party Private Liability (Odgovornost prema trećima) */}
            <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl bg-white border border-slate-200 hover:border-slate-300">
              <input
                type="checkbox"
                checked={includeLiability}
                onChange={(e) => setIncludeLiability(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-bold text-slate-900">
                      Privatna odgovornost prema trećim osobama
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-500">
                    do {formatEuro(calculation.liabilityLimit)}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Štite vas ako npr. izljev vode iz vaše perilice poplavi stan susjeda ispod vas ili dijete nehotice ošteti tuđu imovinu.
                </p>
              </div>
            </label>
          </div>

          {/* Franchise Selector */}
          <div>
            <span className="text-xs font-bold text-slate-700 block mb-2">
              Franšiza (vlastito učešće u šteti):
            </span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { val: 0, label: '0 € (Bez franšize - 100% isplata)' },
                { val: 150, label: '150 € (-12% premija)' },
                { val: 300, label: '300 € (-22% premija)' },
              ].map((f) => (
                <button
                  key={f.val}
                  type="button"
                  onClick={() => setDeductibleEuro(f.val as 0 | 150 | 300)}
                  className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all ${
                    deductibleEuro === f.val
                      ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Calculation Summary Card */}
        <div className="lg:col-span-5 bg-slate-50 rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider font-bold text-slate-600">
                Izračun premije doma
              </span>
              <span className="text-[11px] font-mono text-amber-800 bg-amber-100 px-2 py-0.5 rounded font-bold">
                {selectedCarrier.split(' ')[0]}
              </span>
            </div>

            {/* Price Box */}
            <div className="mt-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm text-left">
              <span className="text-xs font-mono text-slate-500 block">Ukupna godišnja premija</span>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-4xl font-black text-slate-950 font-mono tracking-tight">
                  {formatEuro(activeOffer.price)}
                </span>
                <span className="text-xs font-medium text-slate-500">/ god.</span>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>Ili do 12 rata bez kamata:</span>
                <strong className="text-sm font-extrabold text-amber-700 font-mono">
                  {formatEuro(calculation.monthlyInstallment)} / mj.
                </strong>
              </div>
            </div>

            {/* Policy Coverage Details */}
            <div className="mt-5 space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-200/70">
                <span className="text-slate-600">Nova građevinska vrijednost:</span>
                <span className="font-bold text-slate-900 font-mono">
                  {formatEuro(calculation.buildingReconstructionValue)}
                </span>
              </div>

              {includeContents && (
                <div className="flex justify-between py-1.5 border-b border-slate-200/70">
                  <span className="text-slate-600">Stvari kućanstva (nova vrijednost):</span>
                  <span className="font-bold text-slate-900 font-mono">
                    {formatEuro(calculation.contentsValue)}
                  </span>
                </div>
              )}

              {includeEarthquake && (
                <div className="flex justify-between py-1.5 border-b border-slate-200/70 text-amber-900 font-bold">
                  <span>Pokriće potresa:</span>
                  <span>Uključeno bez franšize</span>
                </div>
              )}

              {includeLiability && (
                <div className="flex justify-between py-1.5 border-b border-slate-200/70 text-blue-900">
                  <span>Privatna odgovornost:</span>
                  <span className="font-mono font-bold">do {formatEuro(calculation.liabilityLimit)}</span>
                </div>
              )}
            </div>

            {/* Carrier Choices */}
            <div className="mt-5 space-y-2">
              <span className="text-[11px] font-mono text-slate-500 uppercase font-bold block">
                Usporedba vodećih osiguratelja (Generali & Wiener)
              </span>
              <div className="space-y-1.5">
                {carrierOffers.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCarrier(c.name)}
                    className={`p-2.5 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-all ${
                      selectedCarrier === c.name
                        ? 'border-amber-600 bg-amber-50/40 font-bold'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <span>{c.name}</span>
                    <span className="font-mono text-slate-900">{formatEuro(c.price)} / god.</span>
                  </div>
                ))}
              </div>
            </div>

            {/* IPID Download Button */}
            <div className="mt-4 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={handleDownloadIpid}
                className="w-full py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-amber-700" />
                <span>Preuzmi službeni IPID obrazac osiguranja doma (PDF)</span>
              </button>
            </div>
          </div>

          {/* Form / Actions */}
          <div className="pt-2 border-t border-slate-200 space-y-3">
            {submitted ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <Check className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="text-sm font-bold text-emerald-950">Izračun je zabilježen!</p>
                <p className="text-xs text-emerald-800">
                  Ovlašteni zastupnik u osiguranju šalje vam službenu policu na pregled.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Vaše ime i prezime"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-amber-600"
                />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Broj mobitela (npr. 091 234 5678)"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-amber-600"
                />

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsHub3aModalOpen(true)}
                    className="py-2.5 px-3 rounded-xl bg-white border border-slate-200 hover:border-teal-500 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <QrCode className="w-4 h-4 text-teal-600" />
                    <span>HUB 3A Uplatnica</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsShareModalOpen(true)}
                    className="py-2.5 px-3 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <Share2 className="w-4 h-4 text-emerald-600" />
                    <span>WhatsApp</span>
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Zatraži ponudu osiguranja doma</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* HUB 3A Payment Slip Modal */}
      <Hub3aPaymentSlipModal
        isOpen={isHub3aModalOpen}
        onClose={() => setIsHub3aModalOpen(false)}
        data={{
          payerName: fullName || 'Ugovaratelj osiguranja doma',
          amountEur: activeOffer.price,
          paymentDescription: `Premija ${selectedCarrier} Dom (${squareMeters} m2)`,
        }}
      />

      {/* Share Quote Modal */}
      <ShareQuoteModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        category="property"
        summaryTitle={`Osiguranje doma (${squareMeters} m², ${propertyType})`}
        calculatedPriceEur={activeOffer.price}
        monthlyPriceEur={calculation.monthlyInstallment}
        carrierName={selectedCarrier}
        details={{
          propertyType,
          squareMeters,
          buildYear,
          includeEarthquake,
          includeContents,
        }}
      />
    </div>
  );
};

export default PropertyCalculator;
