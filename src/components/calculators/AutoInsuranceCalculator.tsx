import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Car,
  Shield,
  Zap,
  MapPin,
  Check,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Sliders,
  Award,
  Clock,
  FileCheck2,
  Download,
  Share2,
  QrCode,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import {
  calculateAutoInsurance,
  RegistrationZone,
  BonusClass,
} from '../../lib/calculations/auto-insurance';
import { formatEuro } from '../../lib/calculations';
import { generateIpidPdf } from '../../lib/services/ipidService';
import { Hub3aPaymentSlipModal } from '../payment/Hub3aPaymentSlipModal';
import { ShareQuoteModal } from '../quotes/ShareQuoteModal';
import { leadService } from '../../api/firestoreService';

interface AutoInsuranceCalculatorProps {
  onQuoteRequested?: (data: any) => void;
  className?: string;
}

export const AutoInsuranceCalculator: React.FC<AutoInsuranceCalculatorProps> = ({
  onQuoteRequested,
  className = '',
}) => {
  // Wizard active step: 1 (Vehicle & Driver) -> 2 (Multi-carrier comparison) -> 3 (Add-ons) -> 4 (Checkout & Slip)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Vehicle & Driver details
  const [kw, setKw] = useState<number>(85);
  const [cityZone, setCityZone] = useState<'ZG' | 'ST' | 'RI' | 'OS' | 'DU' | 'PU' | 'OSTALO'>('ZG');
  const [bonusPercent, setBonusPercent] = useState<number>(50); // 0% - 50%
  const [includeKasko, setIncludeKasko] = useState<boolean>(false);
  const [vehicleValueEuro, setVehicleValueEuro] = useState<number>(24000);
  const [kaskoDeductible, setKaskoDeductible] = useState<0 | 150 | 300>(150);
  const [isToyotaVehicle, setIsToyotaVehicle] = useState<boolean>(false);

  // Step 2: Selected carrier
  const [selectedCarrier, setSelectedCarrier] = useState<string>('Generali osiguranje d.d.');

  // Step 3: Add-ons
  const [glassBreakage, setGlassBreakage] = useState<boolean>(true); // Lom stakla bez franšize
  const [bonusProtection, setBonusProtection] = useState<boolean>(true); // Zaštita bonusa
  const [roadAssistance, setRoadAssistance] = useState<boolean>(true); // Asistencija 24/7 RH i EU
  const [passengerInsurance, setPassengerInsurance] = useState<boolean>(false); // Nezgoda vozača i putnika

  // Step 4: Checkout details & modals
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [licensePlate, setLicensePlate] = useState<string>('');
  const [isHub3aModalOpen, setIsHub3aModalOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Map city zone to formula registration zone
  const mappedZone: RegistrationZone = useMemo(() => {
    switch (cityZone) {
      case 'ZG':
        return 'zona_1';
      case 'ST':
      case 'RI':
      case 'DU':
        return 'zona_2';
      case 'OS':
        return 'zona_3';
      case 'PU':
      case 'OSTALO':
      default:
        return 'zona_ostalo';
    }
  }, [cityZone]);

  // Map bonusPercent (0..50) to BonusClass
  const mappedBonusClass: BonusClass = useMemo(() => {
    if (bonusPercent >= 50) return 'B10';
    if (bonusPercent >= 45) return 'B9';
    if (bonusPercent >= 40) return 'B8';
    if (bonusPercent >= 35) return 'B7';
    if (bonusPercent >= 30) return 'B6';
    if (bonusPercent >= 25) return 'B5';
    if (bonusPercent >= 20) return 'B4';
    if (bonusPercent >= 15) return 'B3';
    if (bonusPercent >= 10) return 'B2';
    if (bonusPercent >= 5) return 'B1';
    return 'B0';
  }, [bonusPercent]);

  const calculation = useMemo(() => {
    return calculateAutoInsurance({
      kw,
      zone: mappedZone,
      bonusClass: mappedBonusClass,
      includeKasko,
      vehicleValueEuro,
      kaskoDeductible,
      isToyotaVehicle,
      addons: {
        glassBreakage,
        bonusProtection,
        roadAssistance,
        passengerInsurance,
      },
    });
  }, [
    kw,
    mappedZone,
    mappedBonusClass,
    includeKasko,
    vehicleValueEuro,
    kaskoDeductible,
    isToyotaVehicle,
    glassBreakage,
    bonusProtection,
    roadAssistance,
    passengerInsurance,
  ]);

  // Multi-carrier offers based on actuarial computation
  const carrierOffers = useMemo(() => {
    const baseTotal = calculation.totalAnnual;
    return [
      {
        id: 'generali',
        name: 'Generali osiguranje d.d.',
        tag: 'Ekskluzivni strateški partner',
        priceAnnual: baseTotal,
        priceMonthly: parseFloat((baseTotal / 12).toFixed(2)),
        features: [
          '50% bonusa zajamčeno uz prijenos u bazi HUO',
          'Toyota VIP program s originalnim OEM dijelovima',
          'Besplatna Zelena karta u PDF-u unutar 60 sekundi',
          '24/7 mobilna asistencija u RH i cijeloj Europi',
        ],
        highlight: true,
      },
      {
        id: 'croatia',
        name: 'Croatia osiguranje d.d.',
        tag: 'Vodeća domaća mreža procjene',
        priceAnnual: parseFloat((baseTotal * 1.04).toFixed(2)),
        priceMonthly: parseFloat(((baseTotal * 1.04) / 12).toFixed(2)),
        features: [
          'Najšira mreža vlastitih STP stanica za tehnički pregled',
          'Mobilna procjena štete putem video poziva',
          'Djelomični kasko za divljač i staklo',
        ],
        highlight: false,
      },
      {
        id: 'allianz',
        name: 'Allianz Hrvatska d.d.',
        tag: 'Međunarodno priznata sigurnost',
        priceAnnual: parseFloat((baseTotal * 1.03).toFixed(2)),
        priceMonthly: parseFloat(((baseTotal * 1.03) / 12).toFixed(2)),
        features: [
          'Brza isplata nespornog dijela štete u 48h',
          'Allianz asistencija s pokrićem hotelskog smještaja',
          'Popust na kombinaciju s osiguranjem doma',
        ],
        highlight: false,
      },
      {
        id: 'wiener',
        name: 'Wiener osiguranje VIG d.d.',
        tag: 'Povoljni paketi i kasko franšize',
        priceAnnual: parseFloat((baseTotal * 0.98).toFixed(2)),
        priceMonthly: parseFloat(((baseTotal * 0.98) / 12).toFixed(2)),
        features: [
          'Konkurentne premije za vozila srednje klase',
          'Zaštita bonusa bez doplate kod obiteljskog paketa',
          'Popust za vozače bez prijavljenih šteta 3 godine',
        ],
        highlight: false,
      },
    ];
  }, [calculation.totalAnnual]);

  const activeOffer = useMemo(() => {
    return carrierOffers.find((c) => c.name === selectedCarrier) || carrierOffers[0];
  }, [carrierOffers, selectedCarrier]);

  const handleDownloadIpid = () => {
    generateIpidPdf({
      category: includeKasko ? 'kasko' : 'auto',
      carrierName: selectedCarrier,
      productName: includeKasko
        ? `${selectedCarrier} Puni Kasko (Franšiza ${kaskoDeductible} €)`
        : `${selectedCarrier} Obvezno AO (50% bonusa)`,
      customDetails: {
        kw,
        annualPremium: activeOffer.priceAnnual,
      },
    });
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    try {
      await leadService.saveLead({
        oib: '',
        name: fullName,
        email,
        phone,
        productType: 'auto',
        status: 'new',
        annualPremium: activeOffer.priceAnnual,
        selectedInsurer: selectedCarrier,
        data: {
          kw,
          cityZone,
          bonusPercent,
          includeKasko,
          vehicleValueEuro,
          kaskoDeductible,
          isToyotaVehicle,
          licensePlate,
          addons: { glassBreakage, bonusProtection, roadAssistance, passengerInsurance },
        },
      });
    } catch (err) {
      console.error(err);
    }

    if (onQuoteRequested) {
      onQuoteRequested({
        kw,
        cityZone,
        bonusPercent,
        includeKasko,
        carrier: selectedCarrier,
        price: activeOffer.priceAnnual,
      });
    }
  };

  return (
    <div
      className={`w-full bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/40 p-6 sm:p-8 lg:p-10 ${className}`}
    >
      {/* Top Header & Terminology Compliance Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-teal-500/10 text-teal-600 flex items-center justify-center font-bold">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-slate-900">
                Kalkulator Auto Osiguranja & Puni Kasko
              </h3>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-teal-50 text-teal-700 border border-teal-200 uppercase">
                OVLAŠTENI ZASTUPNIK
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Ekskluzivni strateški partner Generali osiguranja d.d. • Neovisna digitalna usporedba ponuda vodećih društava (Croatia, Allianz, Wiener, Triglav, LAQO)
            </p>
          </div>
        </div>

        {/* 4-Step Indicator */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto font-mono text-xs">
          {[
            { num: 1, label: 'Vozilo' },
            { num: 2, label: 'Društva' },
            { num: 3, label: 'Dodaci' },
            { num: 4, label: 'Polica' },
          ].map((s) => (
            <button
              key={s.num}
              type="button"
              onClick={() => setCurrentStep(s.num)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                currentStep === s.num
                  ? 'bg-teal-600 text-white font-bold shadow-xs'
                  : currentStep > s.num
                  ? 'bg-teal-50 text-teal-800 font-semibold border border-teal-200'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              <span>{s.num}.</span>
              <span className="hidden md:inline">{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Interactive Wizard Body */}
        <div className="lg:col-span-7 space-y-6">
          {/* ==================================================== */}
          {/* STEP 1: VEHICLE & DRIVER DETAILS */}
          {/* ==================================================== */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-mono font-bold uppercase text-teal-800">
                  Korak 1: Detalji o vozilu, snazi i registraciji
                </span>
                <span className="text-xs text-slate-400 font-mono">1 od 4</span>
              </div>

              {/* 1. kW Slider */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex justify-between items-baseline">
                  <label htmlFor="auto-kw-input" className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    Snaga motora u kilovatima (kW):
                  </label>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-950 font-mono">{kw}</span>
                    <span className="text-xs font-semibold text-slate-500">kW</span>
                    <span className="text-xs font-mono text-slate-400">
                      (~{Math.round(kw * 1.35962)} KS)
                    </span>
                  </div>
                </div>

                <input
                  id="auto-kw-input"
                  type="range"
                  min={25}
                  max={280}
                  step={1}
                  value={kw}
                  onChange={(e) => setKw(parseInt(e.target.value, 10))}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600 focus:outline-none"
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-500">
                  <span>Gradski (40 kW)</span>
                  <span>Kompakt (85 kW)</span>
                  <span>Limuzina / SUV (115+ kW)</span>
                  <span>280 kW</span>
                </div>
              </div>

              {/* 2. Bonus Transfer Slider 0% - 50% */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex justify-between items-baseline">
                  <label htmlFor="auto-bonus-input" className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-600" />
                    Prijenos stečenog bonusa (0% – 50%):
                  </label>
                  <span className="text-lg font-black text-emerald-700 bg-emerald-100/70 border border-emerald-300 px-2.5 py-0.5 rounded-lg font-mono">
                    -{bonusPercent}% popusta
                  </span>
                </div>
                <input
                  id="auto-bonus-input"
                  type="range"
                  min={0}
                  max={50}
                  step={5}
                  value={bonusPercent}
                  onChange={(e) => setBonusPercent(parseInt(e.target.value, 10))}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 focus:outline-none"
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-500">
                  <span>0% (Prvo vozilo / B0)</span>
                  <span>25% (Srednji bonus)</span>
                  <span className="font-bold text-emerald-700">50% (Maksimalni bonus / B10)</span>
                </div>
                <p className="text-[11px] text-slate-500 pt-1">
                  50% bonusa automatski prenosimo iz HUO baze ili s prethodnog vozila / člana obitelji.
                </p>
              </div>

              {/* 3. Registration Risk Zone (City) */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  Grad registracije (Rizična zona):
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {[
                    { code: 'ZG', name: 'Zagreb (Zona 1)' },
                    { code: 'ST', name: 'Split (Zona 2)' },
                    { code: 'RI', name: 'Rijeka (Zona 2)' },
                    { code: 'OS', name: 'Osijek (Zona 3)' },
                    { code: 'DU', name: 'Dubrovnik (Zona 2)' },
                    { code: 'PU', name: 'Pula (Zona 4)' },
                  ].map((city) => (
                    <button
                      key={city.code}
                      type="button"
                      onClick={() => setCityZone(city.code as any)}
                      className={`p-2 rounded-xl text-center border text-xs font-bold transition-all ${
                        cityZone === city.code
                          ? 'border-teal-600 bg-teal-600 text-white shadow-xs'
                          : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700'
                      }`}
                      title={city.name}
                    >
                      <span className="block text-sm font-mono">{city.code}</span>
                      <span className="text-[10px] opacity-80">{city.name.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. KASKO & TOYOTA VIP TOGGLES */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/70 to-indigo-50/70 border border-blue-200/80 space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeKasko}
                    onChange={(e) => setIncludeKasko(e.target.checked)}
                    className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-sm font-bold text-slate-900 block">
                      Ugovori Puni Kasko (Sudar, krađa, tuča, elementarne nepogode)
                    </span>
                    <span className="text-xs text-slate-500">
                      Cjelovita zaštita vlastitog vozila na novu nabavnu vrijednost
                    </span>
                  </div>
                </label>

                {includeKasko && (
                  <div className="space-y-4 pt-3 border-t border-blue-200/70">
                    {/* Toyota VIP Kasko Toggle */}
                    <label className="flex items-start gap-3 p-3.5 rounded-xl bg-white border-2 border-blue-300 cursor-pointer shadow-xs">
                      <input
                        type="checkbox"
                        checked={isToyotaVehicle}
                        onChange={(e) => setIsToyotaVehicle(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-blue-950 uppercase tracking-wide">
                            Toyota Centar Zagreb VIP Kasko Program
                          </span>
                          <span className="text-[10px] font-mono font-bold bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                            -15% VIP
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                          Popravak isključivo u Toyota Centar Zagreb s originalnim OEM dijelovima, besplatno zamjensko hibridno vozilo i fiksna franšiza.
                        </p>
                      </div>
                    </label>

                    {/* Franchise selector */}
                    <div>
                      <span className="text-xs font-semibold text-slate-700 block mb-1.5">
                        Odabir franšize (vlastito učešće u šteti):
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { val: 0, label: '0 € (Bez franšize)' },
                          { val: 150, label: '150 € (-12%)' },
                          { val: 300, label: '300 € (-26%)' },
                        ].map((f) => (
                          <button
                            key={f.val}
                            type="button"
                            onClick={() => setKaskoDeductible(f.val as 0 | 150 | 300)}
                            className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all ${
                              kaskoDeductible === f.val
                                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {f.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow flex items-center justify-center gap-2 transition-all"
              >
                <span>Dalje: Usporedba osiguravajućih društava</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* ==================================================== */}
          {/* STEP 2: MULTI-CARRIER COMPARISON TABLE */}
          {/* ==================================================== */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-mono font-bold uppercase text-teal-800">
                  Korak 2: Usporedba ponuda vodećih društava
                </span>
                <span className="text-xs text-slate-400 font-mono">2 od 4</span>
              </div>

              <div className="space-y-3">
                {carrierOffers.map((carrier) => {
                  const isSelected = selectedCarrier === carrier.name;
                  return (
                    <div
                      key={carrier.id}
                      onClick={() => setSelectedCarrier(carrier.name)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                        isSelected
                          ? 'border-teal-600 bg-teal-50/40 shadow-md'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      {carrier.highlight && (
                        <span className="absolute -top-2.5 right-4 bg-teal-600 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-full shadow-xs">
                          STRATEŠKI PARTNER
                        </span>
                      )}

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-black text-slate-900 text-base">{carrier.name}</h4>
                            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                              {carrier.tag}
                            </span>
                          </div>
                          <ul className="mt-2 space-y-1">
                            {carrier.features.map((feat, i) => (
                              <li key={i} className="text-xs text-slate-600 flex items-center gap-1.5">
                                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="text-left sm:text-right shrink-0">
                          <span className="text-xs text-slate-500 font-mono block">Godišnja premija</span>
                          <span className="text-2xl font-black text-slate-950 font-mono">
                            {formatEuro(carrier.priceAnnual)}
                          </span>
                          <span className="text-xs text-slate-500 block">
                            ili {formatEuro(carrier.priceMonthly)} / mj.
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCarrier(carrier.name);
                            }}
                            className={`mt-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                              isSelected
                                ? 'bg-teal-600 text-white'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {isSelected ? '✓ Odabrano' : 'Odaberi'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-5 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50"
                >
                  <ArrowLeft className="w-4 h-4 inline mr-1" /> Natrag
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="flex-1 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow flex items-center justify-center gap-2"
                >
                  <span>Dalje: Odabir dopunskih pokrića</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ==================================================== */}
          {/* STEP 3: ADD-ON CHECKBOXES */}
          {/* ==================================================== */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-mono font-bold uppercase text-teal-800">
                  Korak 3: Dopunska pokrića i zaštita
                </span>
                <span className="text-xs text-slate-400 font-mono">3 od 4</span>
              </div>

              <div className="space-y-3">
                {[
                  {
                    id: 'glass',
                    title: 'Lom stakla bez franšize',
                    price: 35,
                    desc: 'Pokriva zamjenu vjetrobranskog i bočnih stakala bez gubitka bonusa i bez franšize.',
                    checked: glassBreakage,
                    setter: setGlassBreakage,
                  },
                  {
                    id: 'bonus',
                    title: 'Zaštita 50% bonusa',
                    price: 20,
                    desc: 'Zadržavate maksimalni bonus i kod prve skrivljene prometne nezgode.',
                    checked: bonusProtection,
                    setter: setBonusProtection,
                  },
                  {
                    id: 'road',
                    title: 'Pomoć na cesti (Asistencija 24/7 u RH i EU)',
                    price: 25,
                    desc: 'Vučna služba, popravak na licu mjesta, zamjensko vozilo i smještaj putnika.',
                    checked: roadAssistance,
                    setter: setRoadAssistance,
                  },
                  {
                    id: 'passenger',
                    title: 'Nezgoda vozača i putnika',
                    price: 15,
                    desc: 'Isplata invalidnine i naknade za liječenje u slučaju teže prometne nesreće.',
                    checked: passengerInsurance,
                    setter: setPassengerInsurance,
                  },
                ].map((addon) => (
                  <label
                    key={addon.id}
                    className={`p-4 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                      addon.checked
                        ? 'border-teal-600 bg-teal-50/40'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={addon.checked}
                      onChange={(e) => addon.setter(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-sm">{addon.title}</span>
                        <span className="font-mono font-bold text-teal-700 text-xs">
                          +{addon.price} €/god.
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{addon.desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-5 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50"
                >
                  <ArrowLeft className="w-4 h-4 inline mr-1" /> Natrag
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="flex-1 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow flex items-center justify-center gap-2"
                >
                  <span>Pregled police & Ugovaranje</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ==================================================== */}
          {/* STEP 4: CHECKOUT, IPID & PAYMENT SLIP GENERATOR */}
          {/* ==================================================== */}
          {currentStep === 4 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-mono font-bold uppercase text-teal-800">
                  Korak 4: Podaci za izdavanje police i uplatnica
                </span>
                <span className="text-xs text-slate-400 font-mono">4 od 4</span>
              </div>

              {isSubmitted ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                  <FileCheck2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="text-lg font-black text-emerald-950">
                    Zahtjev za ugovaranje police je zaprimljen!
                  </h4>
                  <p className="text-xs text-emerald-800 leading-relaxed max-w-md mx-auto">
                    Ovlašteni zastupnik u osiguranju šalje Vam službenu ponudu s Generali / Croatia / Allianz policom na pregled u roku od 15 minuta.
                  </p>

                  <div className="flex flex-wrap justify-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsHub3aModalOpen(true)}
                      className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Otvori HUB 3A 2D uplatnicu</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadIpid}
                      className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold text-xs flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Preuzmi IPID obrazac (PDF)</span>
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleFinalSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Ime i prezime ugovaratelja *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Ivan Horvat"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Broj mobitela *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="091 234 5678"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        E-mail adresa za dostavu police *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ivan@email.hr"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Registarska oznaka vozila (opcionalno)
                      </label>
                      <input
                        type="text"
                        value={licensePlate}
                        onChange={(e) => setLicensePlate(e.target.value)}
                        placeholder="npr. ZG 1234-AB"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono uppercase focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  {/* Immediate Action Triggers (HUB 3A Slip, IPID, WhatsApp) */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                    <span className="text-xs font-mono font-bold uppercase text-slate-700 block">
                      Opcije plaćanja & Zakonski obrasci
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setIsHub3aModalOpen(true)}
                        className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-teal-500 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-2xs"
                      >
                        <QrCode className="w-4 h-4 text-teal-600" />
                        <span>HUB 3A Uplatnica</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleDownloadIpid}
                        className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-teal-500 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-2xs"
                      >
                        <Download className="w-4 h-4 text-blue-600" />
                        <span>IPID Obrazac (PDF)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsShareModalOpen(true)}
                        className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-2xs"
                      >
                        <Share2 className="w-4 h-4 text-emerald-600" />
                        <span>Spremi na WhatsApp</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="px-5 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50"
                    >
                      <ArrowLeft className="w-4 h-4 inline mr-1" /> Natrag
                    </button>

                    <button
                      type="submit"
                      className="flex-1 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                    >
                      <Sparkles className="w-4 h-4 text-teal-400" />
                      <span>Ugovori policu s 50% bonusa</span>
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          )}
        </div>

        {/* Right Calculation Summary Card */}
        <div className="lg:col-span-5 bg-slate-50 rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider font-bold text-slate-600">
                Pregled izračuna
              </span>
              <span className="text-[11px] font-mono text-teal-700 bg-teal-50 px-2 py-0.5 rounded font-bold border border-teal-200">
                {selectedCarrier.split(' ')[0]}
              </span>
            </div>

            {/* Price Box */}
            <div className="mt-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm text-left">
              <span className="text-xs font-mono text-slate-500 block">Ukupna godišnja premija</span>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-4xl font-black text-slate-950 tracking-tight font-mono">
                  {formatEuro(activeOffer.priceAnnual)}
                </span>
                <span className="text-xs font-medium text-slate-500">/ god.</span>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>Ili do 12 rata bez kamata:</span>
                <strong className="text-sm font-extrabold text-teal-700 font-mono">
                  {formatEuro(activeOffer.priceMonthly)} / mj.
                </strong>
              </div>
            </div>

            {/* Breakdown */}
            <div className="mt-5 space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-200/70">
                <span className="text-slate-600">Obvezno auto osiguranje (AO):</span>
                <span className="font-bold text-slate-900">{formatEuro(calculation.aoNetto)}</span>
              </div>

              {calculation.addonsTotal > 0 && (
                <div className="flex justify-between py-1.5 border-b border-slate-200/70">
                  <span className="text-slate-600">Dopunska pokrića (staklo, asistencija, bonus):</span>
                  <span className="font-bold text-slate-900">{formatEuro(calculation.addonsTotal)}</span>
                </div>
              )}

              {includeKasko && (
                <div className="flex justify-between py-1.5 border-b border-slate-200/70 text-blue-900 font-semibold">
                  <span>
                    Puni kasko {isToyotaVehicle ? '(Toyota VIP)' : ''} (Franšiza {kaskoDeductible} €):
                  </span>
                  <span>{formatEuro(calculation.kaskoAnnual)}</span>
                </div>
              )}

              <div className="flex justify-between py-1.5 border-b border-slate-200/70 text-emerald-800 font-semibold">
                <span>Uračunati popust na bonus ({bonusPercent}%):</span>
                <span>Zajamčen prijenos</span>
              </div>
            </div>

            {/* Direct 1-Click IPID Download button */}
            <div className="mt-5 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={handleDownloadIpid}
                className="w-full py-2.5 px-3 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-teal-600" />
                <span>Preuzmi službeni IPID obrazac (PDF)</span>
              </button>
            </div>
          </div>

          {/* Quick Payment & Share Rails Strip */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>Kanali naplate:</span>
              <span className="text-slate-700 font-bold">HUB 3A • KEKS • Kartice</span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsHub3aModalOpen(true)}
                className="flex-1 py-2 px-2 rounded-xl bg-white border border-slate-200 hover:border-teal-500 text-slate-700 text-xs font-bold flex items-center justify-center gap-1 shadow-2xs"
              >
                <QrCode className="w-3.5 h-3.5 text-teal-600" />
                <span>HUB 3A</span>
              </button>
              <button
                type="button"
                onClick={() => setIsShareModalOpen(true)}
                className="flex-1 py-2 px-2 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 text-slate-700 text-xs font-bold flex items-center justify-center gap-1 shadow-2xs"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* HUB 3A Payment Slip Modal */}
      <Hub3aPaymentSlipModal
        isOpen={isHub3aModalOpen}
        onClose={() => setIsHub3aModalOpen(false)}
        data={{
          payerName: fullName || 'Ugovaratelj osiguranja',
          amountEur: activeOffer.priceAnnual,
          paymentDescription: `Premija ${selectedCarrier.split(' ')[0]} AO ${licensePlate ? `(${licensePlate})` : ''}`,
        }}
      />

      {/* Share / Abandonment Recovery Modal */}
      <ShareQuoteModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        category="auto"
        summaryTitle={`Auto osiguranje (${kw} kW, ${bonusPercent}% bonusa)`}
        calculatedPriceEur={activeOffer.priceAnnual}
        monthlyPriceEur={activeOffer.priceMonthly}
        carrierName={selectedCarrier}
        details={{
          kw,
          cityZone,
          bonusPercent,
          includeKasko,
          licensePlate,
        }}
      />
    </div>
  );
};

export default AutoInsuranceCalculator;
