import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Car,
  ShieldCheck,
  BatteryCharging,
  Wrench,
  CheckCircle2,
  ArrowRight,
  Phone,
  Mail,
  Sparkles,
  Award,
  FileCheck2,
  AlertCircle,
} from 'lucide-react';
import {
  validateOIB,
  validateVIN,
  formatEUR,
  normalizeOIBInput,
  normalizeVINInput,
} from '../utils/validators';
import { useInsurtechStore } from '../store/useInsurtechStore';
import { generateSupportDocumentPdf } from '../utils/formatters';

interface ToyotaModelSpec {
  id: string;
  name: string;
  segment: string;
  powertrain: 'Hybrid' | 'Plug-in Hybrid / EV' | 'Diesel AWD';
  defaultKw: number;
  baseValueEur: number;
  highlight: string;
}

const TOYOTA_MODELS: ToyotaModelSpec[] = [
  {
    id: 'yaris',
    name: 'Toyota Yaris & Yaris Cross Hybrid',
    segment: 'Gradski & B-SUV Hybrid',
    powertrain: 'Hybrid',
    defaultKw: 85,
    baseValueEur: 26500,
    highlight: '5. generacija Toyota Hybrid Electric pogona + Toyota Safety Sense 3',
  },
  {
    id: 'corolla',
    name: 'Toyota Corolla Hatchback / Touring Sports / Sedan',
    segment: 'Kompaktni & Flotni lider',
    powertrain: 'Hybrid',
    defaultKw: 103,
    baseValueEur: 31500,
    highlight: 'Najprodavaniji model s minimalnim troškom održavanja i punim OEM kaskom',
  },
  {
    id: 'chr',
    name: 'Toyota C-HR 1.8 / 2.0 Hybrid & Plug-in',
    segment: 'Coupé Crossover',
    powertrain: 'Plug-in Hybrid / EV',
    defaultKw: 145,
    baseValueEur: 38900,
    highlight: 'Zaštita visokonaponske baterije, panoramskog krova i Matrix LED svjetala',
  },
  {
    id: 'rav4',
    name: 'Toyota RAV4 Hybrid & Plug-in AWD-i',
    segment: 'Obiteljski & Poslovni SUV',
    powertrain: 'Hybrid',
    defaultKw: 163,
    baseValueEur: 45500,
    highlight: 'Puni Kasko s 0 € franšize, zaštita AWD-i elektromotora i europska asistencija',
  },
  {
    id: 'landcruiser',
    name: 'Toyota Land Cruiser 250',
    segment: 'Premium Off-Road & Executive',
    powertrain: 'Diesel AWD',
    defaultKw: 150,
    baseValueEur: 86000,
    highlight: 'Ekskluzivni VIP Kasko paket s GPS zaštitom od krađe i punom vrijednosti',
  },
  {
    id: 'hilux',
    name: 'Toyota Hilux Double Cab Invincible / GR Sport',
    segment: 'Gospodarski & Terenski Pick-up',
    powertrain: 'Diesel AWD',
    defaultKw: 150,
    baseValueEur: 54000,
    highlight: 'Komercijalni i privatni AO + Kasko uz zamjensko gospodarsko vozilo u TCZ-u',
  },
  {
    id: 'lexus',
    name: 'Lexus LBX / NX / RX Hybrid & Takumi',
    segment: 'Luxury Mobility Division',
    powertrain: 'Plug-in Hybrid / EV',
    defaultKw: 182,
    baseValueEur: 68000,
    highlight: 'Concierge obrada šteta, zamjensko premium vozilo i OEM popravak u Zagrebu',
  },
];

export const ToyotaPartnershipPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, createInformativeOffer, setPrefilledQuoteTransfer } = useInsurtechStore();

  const [selectedModel, setSelectedModel] = useState<ToyotaModelSpec>(TOYOTA_MODELS[2]); // Default C-HR
  const [kwPower, setKwPower] = useState<number>(TOYOTA_MODELS[2].defaultKw);
  const [vehicleValue, setVehicleValue] = useState<number>(TOYOTA_MODELS[2].baseValueEur);
  const [includeAoBundle, setIncludeAoBundle] = useState<boolean>(true);
  const [includeBatteryShield, setIncludeBatteryShield] = useState<boolean>(true);
  const [includeOemGuarantee, setIncludeOemGuarantee] = useState<boolean>(true);
  const [includeReplacementCar, setIncludeReplacementCar] = useState<boolean>(true);
  const [deductibleEur, setDeductibleEur] = useState<number>(0);

  // Optional quick-bind / offer generation inputs with VIN & OIB validators
  const [vinInput, setVinInput] = useState<string>('JTMAB3FV80D123456');
  const [oibInput, setOibInput] = useState<string>(user.oib || '24918274015');
  const [plateInput, setPlateInput] = useState<string>('ZG-9281-TC');
  const [assignedTczAgent, setAssignedTczAgent] = useState<'hrvoje' | 'laura'>('hrvoje');
  const [offerCreatedCode, setOfferCreatedCode] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSelectModel = (model: ToyotaModelSpec) => {
    setSelectedModel(model);
    setKwPower(model.defaultKw);
    setVehicleValue(model.baseValueEur);
    setOfferCreatedCode(null);
  };

  // Actuarial Toyota Osiguranje calculation
  const baseAo = includeAoBundle ? Math.round((110 + kwPower * 1.35) * 0.5) : 0; // With 50% bonus
  let kaskoBase = vehicleValue * 0.0175 + 95;
  if (deductibleEur === 150) kaskoBase *= 0.88;
  if (deductibleEur === 300) kaskoBase *= 0.77;

  const batteryRider = includeBatteryShield ? 48 : 0;
  const oemRider = includeOemGuarantee ? 0 : -25; // Included in Toyota Osiguranje by default
  const replacementRider = includeReplacementCar ? 34 : 0;

  const grossTotal = baseAo + kaskoBase + batteryRider + oemRider + replacementRider;
  const bundleDiscount = includeAoBundle ? Math.round(grossTotal * 0.12 * 100) / 100 : 0; // 12% AO + Kasko Toyota bundle discount
  const netAnnualEur = Math.round((grossTotal - bundleDiscount) * 100) / 100;
  const monthlyEur = Math.round((netAnnualEur / 12) * 100) / 100;

  const activeRiders = [
    ...(includeAoBundle ? ['Obvezno AO osiguranje (50% bonusa B10) + Zelena karta'] : []),
    `Puni Toyota Kasko (franšiza ${formatEUR(deductibleEur)})`,
    ...(includeOemGuarantee ? ['Jamstvo popravka u Toyota Centru Zagreb s originalnim OEM dijelovima'] : []),
    ...(includeBatteryShield ? ['Zaštita visokonaponske Hybrid/EV baterije, invertera i ADAS radara'] : []),
    ...(includeReplacementCar ? ['Besplatno zamjensko Toyota vozilo za vrijeme servisnog popravka'] : []),
  ];

  const handleGenerateToyotaOffer = () => {
    setValidationError(null);
    if (!validateOIB(oibInput)) {
      setValidationError('Uneseni OIB nije valjan prema ISO 7064 (MOD 11, 10) algoritmu.');
      return;
    }
    if (vinInput && !validateVIN(vinInput)) {
      setValidationError('Broj šasije (VIN) mora sadržavati točno 17 alfanumeričkih znakova (bez slova I, O, Q).');
      return;
    }

    const created = createInformativeOffer({
      clientName: user.displayName || 'Marko Horvatić',
      clientOib: oibInput,
      clientEmail: user.email || 'marko.horvatic@gmail.com',
      clientPhone: user.phone || '+385 91 555 4321',
      productType: 'kasko',
      productTitle: `Toyota Osiguranje — ${selectedModel.name}`,
      carrier: 'Toyota Osiguranje (Generali osiguranje d.d. × Toyota Centar Zagreb)',
      assetDescription: `${selectedModel.name} (${kwPower} kW, VIN: ${vinInput}, Reg: ${plateInput})`,
      annualPremium: netAnnualEur,
      paymentDynamics: 'Mjesečno (12 rata)',
      deductibleEur,
      coverageLimitEur: vehicleValue,
      riders: activeRiders,
      assignedAgentId: assignedTczAgent,
      status: 'ponuda_spremna',
      notes: `Kalkulacija iz Toyota Centar Zagreb Mobility Huba (-12% AO+Kasko popust: -${formatEUR(bundleDiscount)}).`,
    });

    setOfferCreatedCode(created.offerNumber);
  };

  const handleTransferToWizard = () => {
    setPrefilledQuoteTransfer({
      productType: 'kasko',
      tierName: `Toyota Osiguranje — ${selectedModel.name}`,
      estimatedAnnualEur: netAnnualEur,
      deductibleEur,
      coverageLimitEur: vehicleValue,
      riders: activeRiders,
      vehicleModel: selectedModel.name,
      kwPower,
    });
    navigate('/zatrazi-ponudu');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] pb-20">
      {/* 1. Executive Mobility Hero Banner */}
      <section className="bg-[#0F172A] text-white border-b border-slate-800 pt-12 pb-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-5 text-left">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#C21817] text-white font-mono text-xs font-bold">
                  TOYOTA OSIGURANJE
                </span>
                <span className="px-3 py-1 rounded-full bg-[#1E293B] border border-slate-700 text-slate-200 font-mono text-xs font-bold">
                  TOYOTA CENTAR ZAGREB × GENERALI OSIGURANJE d.d.
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                Službeni centar za osiguranje{' '}
                <span className="text-[#F87171]">Toyota i Lexus vozila</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                Kao službeni partner <strong>Toyota Centra Zagreb</strong> i <strong>Generali osiguranja d.d.</strong>,
                Agencija Život osigurava specijalizirane police za nove i rabljene modele Yaris, Corolla, C-HR, RAV4,
                Land Cruiser, Hilux i Lexus — uz 100% jamstvo popravka u ovlaštenom servisu s originalnim OEM dijelovima.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-mono text-slate-300">
                <div className="flex items-center gap-2 bg-[#1E293B] px-3.5 py-2 rounded-xl border border-slate-700">
                  <Mail className="w-4 h-4 text-[#F87171]" />
                  <span>Hrvoje (TCZ): <strong>osiguranje@tcz.hr</strong></span>
                </div>
                <div className="flex items-center gap-2 bg-[#1E293B] px-3.5 py-2 rounded-xl border border-slate-700">
                  <Mail className="w-4 h-4 text-emerald-400" />
                  <span>Laura (TCZ): <strong>osiguranje2@tcz.hr</strong></span>
                </div>
                <button
                  type="button"
                  onClick={() => generateSupportDocumentPdf('toyota_terms')}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 font-bold cursor-pointer"
                >
                  Preuzmi uvjete Toyota Osiguranja (PDF)
                </button>
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="bg-[#1E293B] border border-slate-700 rounded-3xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-[#F87171] font-mono text-xs font-bold uppercase">
                  <Award className="w-4 h-4" />
                  <span>4 Stupa Toyota Osiguranja</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-200">
                  <li className="flex items-start gap-2.5">
                    <Wrench className="w-4 h-4 text-[#F87171] shrink-0 mt-0.5" />
                    <span><strong>100% Originalni OEM dijelovi</strong> i popravak u ovlaštenom servisu Toyota Centar Zagreb.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <BatteryCharging className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Zaštita Hybrid &amp; EV baterije</strong>, invertera i kalibracija Toyota Safety Sense radara.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Car className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                    <span><strong>Zamjensko Toyota vozilo</strong> bez naknade tijekom popravka kasko štete.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>-12% Paketni popust</strong> za istodobno ugovaranje Obveznog AO + Puni Kasko.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Showroom Model Selector & Specialized Toyota Calculator */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-10">
        {/* Model Showroom Grid */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-mono font-bold uppercase text-[#C21817]">
                KORAK 1 &bull; ODABERITE MODEL IZ TOYOTA / LEXUS SALONA
              </span>
              <h2 className="text-2xl font-extrabold text-[#0F172A]">
                Digitalni salon Toyota Centar Zagreb
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-500">
              Odabrani model: <strong className="text-[#0F172A]">{selectedModel.name}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {TOYOTA_MODELS.map((model) => {
              const isSelected = selectedModel.id === model.id;
              return (
                <button
                  key={model.id}
                  type="button"
                  onClick={() => handleSelectModel(model)}
                  className={`p-4 rounded-2xl text-left border transition-all flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-elevated'
                      : 'bg-white text-[#0F172A] border-[#E2E8F0] hover:border-[#C21817]'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          isSelected
                            ? 'bg-[#C21817] text-white'
                            : 'bg-[#FEF2F2] text-[#C21817] border border-[#FECACA]'
                        }`}
                      >
                        {model.powertrain}
                      </span>
                      <span className={`text-xs font-mono font-bold tabular-nums ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                        {model.defaultKw} kW
                      </span>
                    </div>
                    <div className="font-extrabold text-sm">{model.name}</div>
                    <p className={`text-[11px] leading-relaxed ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                      {model.highlight}
                    </p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-slate-200/20 flex items-center justify-between text-xs font-mono">
                    <span className={isSelected ? 'text-slate-400' : 'text-slate-500'}>Vrijednost:</span>
                    <span className="font-bold tabular-nums">{formatEUR(model.baseValueEur)}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Toyota Osiguranje Calculator & Live Offer Binding */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Configuration Controls */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E2E8F0] shadow-card p-6 sm:p-8 space-y-6 text-left">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs font-mono font-bold uppercase text-[#C21817]">
                KORAK 2 &bull; KONFIGURACIJA POKRIĆA I VALIDACIJA ŠASIJE (VIN)
              </span>
              <h3 className="text-xl font-extrabold text-[#0F172A] mt-1">
                Kalkulator programa Toyota Osiguranje — {selectedModel.name}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span>Snaga motora (kW):</span>
                  <span className="font-mono text-[#C21817] tabular-nums">{kwPower} kW</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={250}
                  step={1}
                  value={kwPower}
                  onChange={(e) => setKwPower(Number(e.target.value))}
                  className="w-full accent-[#C21817] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span>Osigurana vrijednost vozila:</span>
                  <span className="font-mono text-[#0F172A] tabular-nums">{formatEUR(vehicleValue)}</span>
                </div>
                <input
                  type="range"
                  min={15000}
                  max={110000}
                  step={500}
                  value={vehicleValue}
                  onChange={(e) => setVehicleValue(Number(e.target.value))}
                  className="w-full accent-[#C21817] cursor-pointer"
                />
              </div>
            </div>

            {/* Franchise / Deductible Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Razina učešća u kasko šteti (Franšiza):
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { val: 0, label: '0,00 € (Bez franšize)', desc: '100% isplata od prvog eura' },
                  { val: 150, label: '150,00 € (-12%)', desc: 'Optimalni omjer cijene' },
                  { val: 300, label: '300,00 € (-23%)', desc: 'Najniža godišnja premija' },
                ].map((tier) => (
                  <button
                    key={tier.val}
                    type="button"
                    onClick={() => setDeductibleEur(tier.val)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      deductibleEur === tier.val
                        ? 'bg-[#FEF2F2] border-[#C21817] text-[#C21817]'
                        : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A]'
                    }`}
                  >
                    <div className="font-mono font-bold text-xs tabular-nums">{tier.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{tier.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Specialized Toyota Riders */}
            <div className="space-y-2.5 pt-2">
              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-[#0F172A]">
                    Integrirani paket Obvezno AO (50% bonus) + Puni Kasko (-12% popust)
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Uključuje Zelenu kartu i automatski prijenos 50% bonusa u HUO bazi
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={includeAoBundle}
                  onChange={(e) => setIncludeAoBundle(e.target.checked)}
                  className="w-5 h-5 accent-[#C21817] cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-[#0F172A]">
                    Zaštita visokonaponske Hybrid / EV baterije, invertera i ADAS senzora
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Pokriva oštećenja hibridnog sustava, punjača i kalibraciju Toyota Safety Sense kamere
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={includeBatteryShield}
                  onChange={(e) => setIncludeBatteryShield(e.target.checked)}
                  className="w-5 h-5 accent-[#C21817] cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-[#0F172A]">
                    Jamstvo popravka u Toyota Centru Zagreb s originalnim OEM dijelovima
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Bez amortizacije dijelova i uz zadržavanje tvorničkog jamstva Toyota Relax (do 10 god.)
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={includeOemGuarantee}
                  onChange={(e) => setIncludeOemGuarantee(e.target.checked)}
                  className="w-5 h-5 accent-[#C21817] cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-[#0F172A]">
                    Zamjensko Toyota vozilo + 24/7 Pomoć na cesti (HR i EU)
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Preuzimanje zamjenskog vozila izravno u Toyota Centru Zagreb prilikom predaje vozila na popravak
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={includeReplacementCar}
                  onChange={(e) => setIncludeReplacementCar(e.target.checked)}
                  className="w-5 h-5 accent-[#C21817] cursor-pointer"
                />
              </label>
            </div>

            {/* Algorithmic VIN & OIB Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-100">
              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-600 mb-1">
                  Broj šasije (VIN - 17 znakova):
                </label>
                <input
                  type="text"
                  value={vinInput}
                  onChange={(e) => setVinInput(normalizeVINInput(e.target.value))}
                  placeholder="JTMAB3FV80D123456"
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] font-mono text-xs uppercase tabular-nums"
                />
                <span className={`text-[10px] font-mono ${validateVIN(vinInput) ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {validateVIN(vinInput) ? '✓ Valjan 17-znamenkasti VIN' : `${vinInput.length}/17 znakova (bez I,O,Q)`}
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-600 mb-1">
                  OIB ugovaratelja (ISO 7064):
                </label>
                <input
                  type="text"
                  value={oibInput}
                  onChange={(e) => setOibInput(normalizeOIBInput(e.target.value))}
                  placeholder="24918274015"
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] font-mono text-xs tabular-nums"
                />
                <span className={`text-[10px] font-mono ${validateOIB(oibInput) ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {validateOIB(oibInput) ? '✓ Valjan ISO 7064 OIB' : 'Unesite 11-znamenkasti OIB'}
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-600 mb-1">
                  Registarska oznaka:
                </label>
                <input
                  type="text"
                  value={plateInput}
                  onChange={(e) => setPlateInput(e.target.value.toUpperCase())}
                  placeholder="ZG-9281-TC"
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] font-mono text-xs uppercase tabular-nums"
                />
                <span className="text-[10px] font-mono text-slate-400">Ili &quot;NOVO VOZILO&quot;</span>
              </div>
            </div>
          </div>

          {/* Right: Live Calculation Summary & Direct Portal Sync */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-white rounded-3xl border-2 border-[#0F172A] shadow-elevated p-6 sm:p-7 space-y-5 text-left">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase font-bold text-[#C21817]">
                    SLUŽBENA KALKULACIJA &bull; TOYOTA CENTAR ZAGREB
                  </span>
                  <h4 className="text-lg font-extrabold text-[#0F172A]">{selectedModel.name}</h4>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#FEF2F2] text-[#C21817] border border-[#FECACA] font-mono text-[10px] font-bold">
                  -12% PAKET
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-bold text-slate-600">Ukupna godišnja premija:</span>
                  <span className="text-3xl font-black font-mono text-[#0F172A] tabular-nums">
                    {formatEUR(netAnnualEur)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-[#C21817] font-bold tabular-nums">
                  <span>Mjesečna rata (12x bez kamata):</span>
                  <span>{formatEUR(monthlyEur)} / mj.</span>
                </div>
                {bundleDiscount > 0 && (
                  <div className="flex items-center justify-between text-[11px] font-mono text-emerald-700 pt-1 border-t border-slate-200/70 tabular-nums">
                    <span>Obračunati AO + Kasko paketni popust:</span>
                    <span>-{formatEUR(bundleDiscount)}</span>
                  </div>
                )}
              </div>

              {/* Select TCZ Specialist */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  Odaberite zastupnika u Toyota Centru Zagreb:
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setAssignedTczAgent('hrvoje')}
                    className={`p-3 rounded-xl border text-left text-xs cursor-pointer ${
                      assignedTczAgent === 'hrvoje'
                        ? 'bg-[#0F172A] text-white border-[#0F172A]'
                        : 'bg-[#F8FAFC] text-[#0F172A] border-[#E2E8F0]'
                    }`}
                  >
                    <div className="font-bold">Hrvoje (TCZ)</div>
                    <div className="font-mono text-[10px] opacity-80">osiguranje@tcz.hr</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAssignedTczAgent('laura')}
                    className={`p-3 rounded-xl border text-left text-xs cursor-pointer ${
                      assignedTczAgent === 'laura'
                        ? 'bg-[#0F172A] text-white border-[#0F172A]'
                        : 'bg-[#F8FAFC] text-[#0F172A] border-[#E2E8F0]'
                    }`}
                  >
                    <div className="font-bold">Laura (TCZ)</div>
                    <div className="font-mono text-[10px] opacity-80">osiguranje2@tcz.hr</div>
                  </button>
                </div>
              </div>

              {validationError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-[#C21817] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              {offerCreatedCode ? (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Toyota informativna ponuda {offerCreatedCode} kreirana!</span>
                  </div>
                  <p className="text-[11px] text-emerald-700">
                    Ponuda je sinkronizirana u <strong>Korisnički portal</strong> (Informativne ponude) i{' '}
                    <strong>Zastupnički portal</strong> ({assignedTczAgent === 'hrvoje' ? 'osiguranje@tcz.hr' : 'osiguranje2@tcz.hr'}).
                  </p>
                  <div className="flex gap-2">
                    <Link
                      to="/korisnicki-portal"
                      className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-700 text-white font-bold text-xs text-center"
                    >
                      Otvori u Korisničkom portalu
                    </Link>
                    <Link
                      to="/zastupnicki-portal"
                      className="py-2.5 px-3 rounded-xl bg-[#0F172A] text-white font-bold text-xs text-center"
                    >
                      Agent CRM
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <button
                    type="button"
                    onClick={handleGenerateToyotaOffer}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#C21817] hover:bg-[#991B1B] text-white font-bold text-sm shadow-crimson-glow flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <FileCheck2 className="w-4 h-4" />
                    <span>Kreiraj Toyota ponudu u portalu</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleTransferToWizard}
                    className="w-full py-3 px-4 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-[#F87171]" />
                    <span>Prebaci u Zatraži ponudu (puni IDD obrazac)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToyotaPartnershipPage;
