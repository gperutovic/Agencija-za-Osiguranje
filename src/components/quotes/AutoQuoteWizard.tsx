import React, { useState, useMemo } from 'react';
import { 
  Car, 
  User, 
  Shield, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  Wrench, 
  Clock, 
  Building2,
  FileCheck,
  Send,
  AlertCircle
} from 'lucide-react';
import { OibInput } from '../ui/OibInput';
import { Tooltip } from '../ui/Tooltip';
import { calculateAutoPremium } from '../../utils/ratingEngine';
import { leadService } from '../../services/firebase';

interface CarrierOffer {
  carrierId: string;
  name: string;
  badge: string;
  annualPremium: number;
  monthlyPremium: number;
  features: string[];
  discountEur: number;
  rating: number;
}

export const AutoQuoteWizard: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Vehicle State
  const [licensePlate, setLicensePlate] = useState('ZG-8821-VK');
  const [makeModel, setMakeModel] = useState('Volkswagen Golf VII 1.6 TDI');
  const [kwPower, setKwPower] = useState(81); // 110 KS
  const [vehicleYear, setVehicleYear] = useState(2019);
  const [usageType, setUsageType] = useState<'private' | 'commercial'>('private');

  // Step 2: Driver State
  const [fullName, setFullName] = useState('Ivan Horvat');
  const [email, setEmail] = useState('ivan.horvat@email.hr');
  const [phone, setPhone] = useState('+385 91 234 5678');
  const [oib, setOib] = useState('26182105153');
  const [isOibValid, setIsOibValid] = useState(true);
  const [bonusPercentage, setBonusPercentage] = useState(50);
  const [experienceYears, setExperienceYears] = useState(12);
  const [cityZone, setCityZone] = useState('Zagreb (ZG)');

  // Step 3: Package & Addons State
  const [packageType, setPackageType] = useState<'ao_only' | 'ao_plus' | 'full_kasko'>('ao_plus');
  const [includeGlass, setIncludeGlass] = useState(true);
  const [includeBonusProtection, setIncludeBonusProtection] = useState(true);
  const [includeAssistance, setIncludeAssistance] = useState(true);

  // Step 4: Submission State
  const [selectedCarrier, setSelectedCarrier] = useState('generali');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedLeadRef, setSubmittedLeadRef] = useState<string | null>(null);

  // Actuarial Calculation
  const vehicleAge = new Date().getFullYear() - vehicleYear;
  const estimate = useMemo(() => {
    return calculateAutoPremium({
      kwPower,
      vehicleAge,
      bonusPercentage,
      usageType,
      includeKasko: packageType === 'full_kasko',
      includeAssistance,
      includeGlass,
      includeBonusProtection,
    });
  }, [kwPower, vehicleAge, bonusPercentage, usageType, packageType, includeAssistance, includeGlass, includeBonusProtection]);

  // Comparative Croatian Insurer Matrix
  const carrierOffers: CarrierOffer[] = useMemo(() => {
    const base = estimate.annualPremium;
    return [
      {
        carrierId: 'generali',
        name: 'Generali osiguranje d.d.',
        badge: 'Preporuka agencije (-12% popust)',
        annualPremium: Math.round(base * 0.88),
        monthlyPremium: Math.round((base * 0.88) / 12),
        discountEur: Math.round(base * 0.12),
        rating: 4.9,
        features: [
          'Besplatna vuča vozila do 500 km u RH i EU',
          'Zamjensko vozilo do 5 radnih dana',
          'Prijava štete 100% online putem mobitela',
        ],
      },
      {
        carrierId: 'croatia',
        name: 'Croatia osiguranje d.d.',
        badge: 'Najveća servisna mreža u RH',
        annualPremium: Math.round(base * 0.95),
        monthlyPremium: Math.round((base * 0.95) / 12),
        discountEur: Math.round(base * 0.05),
        rating: 4.8,
        features: [
          'Preko 140 procjenilišta i partnerskih servisa',
          'Zelena karta uključena odmah uz policu',
          'Pravna pomoć kod prometnih sporova',
        ],
      },
      {
        carrierId: 'allianz',
        name: 'Allianz Hrvatska d.d.',
        badge: 'Premium asistencija & Hibridi',
        annualPremium: Math.round(base * 0.98),
        monthlyPremium: Math.round((base * 0.98) / 12),
        discountEur: Math.round(base * 0.02),
        rating: 4.8,
        features: [
          'Allianz Globalna 24/7 asistencija na cesti',
          'Pokriće punjača i baterije za EV / hibride',
          'Isplata nespornog dijela štete u 14 dana',
        ],
      },
      {
        carrierId: 'wiener',
        name: 'Wiener Städtische VIG',
        badge: 'Najpovoljniji kasko paket',
        annualPremium: Math.round(base * 0.92),
        monthlyPremium: Math.round((base * 0.92) / 12),
        discountEur: Math.round(base * 0.08),
        rating: 4.7,
        features: [
          'Povoljna fiksna franšiza na kasko pokrića',
          'Pokriće šteta od divljači i naleta na životinje',
          'Popust na ugovaranje više vozila u obitelji',
        ],
      },
    ];
  }, [estimate]);

  const handleNextFromStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleNextFromStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOibValid) {
      alert('Molimo unesite valjani 11-znamenkasti hrvatski OIB.');
      return;
    }
    setStep(3);
  };

  const handleNextFromStep3 = () => {
    setStep(4);
  };

  const handleSubmitLead = async (offer: CarrierOffer) => {
    setIsSubmitting(true);
    try {
      const ref = `PON-AO-${Date.now().toString().slice(-6)}`;
      await leadService.saveLead({
        oib,
        name: fullName,
        email,
        phone,
        productType: 'auto',
        status: 'new',
        data: {
          licensePlate,
          makeModel,
          kwPower,
          vehicleYear,
          usageType,
          bonusPercentage,
          cityZone,
          packageType,
          selectedCarrier: offer.name,
          annualPremiumEur: offer.annualPremium,
          monthlyPremiumEur: offer.monthlyPremium,
          referenceNumber: ref,
        },
      });

      setSubmittedLeadRef(ref);
    } catch (err) {
      console.error(err);
      alert('Došlo je do greške prilikom slanja ponude.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl text-slate-100">
      
      {/* Wizard Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-800 -translate-y-1/2 z-0" />
          
          {[
            { num: 1, title: 'Vozilo', icon: Car },
            { num: 2, title: 'Vozač i OIB', icon: User },
            { num: 3, title: 'Paket pokrića', icon: Shield },
            { num: 4, title: 'Usporedba ponuda', icon: Sparkles },
          ].map((s) => {
            const Icon = s.icon;
            const isDone = step > s.num;
            const isCurrent = step === s.num;

            return (
              <div key={s.num} className="relative z-10 flex flex-col items-center gap-1.5">
                <button
                  type="button"
                  disabled={step < s.num}
                  onClick={() => setStep(s.num as any)}
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs transition-all ${
                    isCurrent
                      ? 'bg-blue-600 text-white ring-4 ring-blue-500/20 shadow-lg shadow-blue-900/40'
                      : isDone
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-500 border border-slate-700/50'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                </button>
                <span className={`text-[11px] font-medium hidden sm:block ${isCurrent ? 'text-white' : 'text-slate-400'}`}>
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* STEP 1: PODACI O VOZILU */}
      {/* ========================================================= */}
      {step === 1 && (
        <form onSubmit={handleNextFromStep1} className="space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-bold">
              Korak 1 od 4: Identifikacija vozila
            </span>
            <h3 className="text-2xl font-black text-white">Unesite osnovne podatke o vozilu</h3>
            <p className="text-xs text-slate-400">
              Izračun se temelji na snazi motora (kW) i starosti vozila prema propisanim tarifama osiguratelja.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Registarska oznaka</label>
              <input
                type="text"
                required
                value={licensePlate}
                onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
                placeholder="npr. ZG-1234-AB"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-mono text-white tracking-wider focus:outline-none focus:border-blue-500 uppercase"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Marka i model vozila</label>
              <input
                type="text"
                required
                value={makeModel}
                onChange={(e) => setMakeModel(e.target.value)}
                placeholder="npr. Škoda Octavia 2.0 TDI"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* kW Engine Power Slider */}
          <div className="space-y-2 p-5 bg-slate-950/60 rounded-2xl border border-slate-800/80">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <span>Snaga motora u kilovatima (kW)</span>
                <Tooltip text="Snaga motora u kW ključni je čimbenik za određivanje osnovne premije obveznog auto osiguranja (AO) u RH. 1 kW = 1.36 KS.">
                  <span className="text-[10px] text-blue-400 underline">info</span>
                </Tooltip>
              </label>
              <span className="font-mono text-sm font-bold text-blue-400">
                {kwPower} kW <span className="text-xs text-slate-400">({Math.round(kwPower * 1.36)} KS)</span>
              </span>
            </div>
            <input
              type="range"
              min={30}
              max={220}
              step={1}
              value={kwPower}
              onChange={(e) => setKwPower(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>30 kW (gradski)</span>
              <span>75 kW (prosjek)</span>
              <span>110 kW (viša klasa)</span>
              <span>220+ kW (sportski)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Godina proizvodnje</label>
              <select
                value={vehicleYear}
                onChange={(e) => setVehicleYear(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
              >
                {Array.from({ length: 22 }, (_, i) => 2026 - i).map((y) => (
                  <option key={y} value={y}>{y}. godina ({2026 - y} god. starosti)</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Namjena korištenja</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setUsageType('private')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    usageType === 'private'
                      ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Osobno / Privatno
                </button>
                <button
                  type="button"
                  onClick={() => setUsageType('commercial')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    usageType === 'commercial'
                      ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Gospodarsko / Taxi
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-900/30 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <span>Nastavi na podatke o vozaču</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* ========================================================= */}
      {/* STEP 2: PODACI O VOZAČU & OIB */}
      {/* ========================================================= */}
      {step === 2 && (
        <form onSubmit={handleNextFromStep2} className="space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-bold">
              Korak 2 od 4: Podaci o ugovaratelju i bonitetu
            </span>
            <h3 className="text-2xl font-black text-white">Podaci o vozaču i OIB validacija</h3>
            <p className="text-xs text-slate-400">
              OIB je obvezan za provjeru vašeg bonus-malus razreda u središnjem registru HUO-a.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Ime i prezime ugovaratelja</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ime i prezime"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* OIB with ISO 7064 MOD 11, 10 Validator */}
            <OibInput
              value={oib}
              onChange={(val, valid) => {
                setOib(val);
                setIsOibValid(valid);
              }}
              label="OIB ugovaratelja"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Email za primitak police</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vas.email@domena.hr"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Kontakt mobitel (+385)</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+385 91 ..."
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <span>Bonus-malus razred</span>
                <Tooltip term="bonus-malus" />
              </label>
              <select
                value={bonusPercentage}
                onChange={(e) => setBonusPercentage(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value={50}>50% - Maksimalni bonus (bez prijavljenih šteta)</option>
                <option value={40}>40% popusta</option>
                <option value={30}>30% popusta</option>
                <option value={20}>20% popusta</option>
                <option value={0}>0% - Osnovni razred (prvo vozilo / mladi vozač)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Grad registracije / Registarsko područje</label>
              <select
                value={cityZone}
                onChange={(e) => setCityZone(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option>Zagreb (ZG)</option>
                <option>Split (ST)</option>
                <option>Rijeka (RI)</option>
                <option>Osijek (OS)</option>
                <option>Zadar (ZD)</option>
                <option>Dubrovnik (DU)</option>
                <option>Varaždin (VŽ)</option>
                <option>Pula (PU)</option>
                <option>Slavonski Brod (SB)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Natrag na vozilo</span>
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-900/30 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <span>Odabir paketa pokrića</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* ========================================================= */}
      {/* STEP 3: ODABIR PAKETA POKRIĆA */}
      {/* ========================================================= */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-bold">
              Korak 3 od 4: Prilagodba police
            </span>
            <h3 className="text-2xl font-black text-white">Odaberite razinu zaštite</h3>
            <p className="text-xs text-slate-400">
              Kombinirajte obvezno osiguranje s asistencijom na cesti i kasko zaštitom.
            </p>
          </div>

          {/* Three Tier Package Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: Samo AO */}
            <div
              onClick={() => setPackageType('ao_only')}
              className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                packageType === 'ao_only'
                  ? 'bg-blue-600/10 border-blue-500 ring-2 ring-blue-500/20 shadow-xl'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase">Osnovno</span>
                {packageType === 'ao_only' && <CheckCircle2 className="w-5 h-5 text-blue-400" />}
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Samo Obvezno (AO)</h4>
                <p className="text-[11px] text-slate-400 mt-1">Zakonski propisani minimum pokrića za registraciju.</p>
              </div>
              <ul className="text-[11px] text-slate-300 space-y-1.5 pt-2 border-t border-slate-800/80">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Štete prema trećim osobama</span>
                </li>
                <li className="flex items-center gap-1.5 text-slate-500">
                  <span>✕ Nema asistencije na cesti</span>
                </li>
              </ul>
            </div>

            {/* Card 2: AO + Asistencija (Preporučeno) */}
            <div
              onClick={() => setPackageType('ao_plus')}
              className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 relative ${
                packageType === 'ao_plus'
                  ? 'bg-blue-600/15 border-blue-500 ring-2 ring-blue-500/30 shadow-2xl'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-[9px] uppercase tracking-wider">
                Najpopularniji izbor
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-400 uppercase">Optimalno</span>
                {packageType === 'ao_plus' && <CheckCircle2 className="w-5 h-5 text-blue-400" />}
              </div>
              <div>
                <h4 className="text-base font-bold text-white">AO + Asistencija 24/7</h4>
                <p className="text-[11px] text-slate-400 mt-1">Obvezno osiguranje uz potpunu pomoć na cesti u RH i EU.</p>
              </div>
              <ul className="text-[11px] text-slate-300 space-y-1.5 pt-2 border-t border-slate-800/80">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Obvezno AO osiguranje</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Vuča i popravak na licu mjesta</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Zamjensko vozilo u slučaju kvara</span>
                </li>
              </ul>
            </div>

            {/* Card 3: Puni Kasko */}
            <div
              onClick={() => setPackageType('full_kasko')}
              className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                packageType === 'full_kasko'
                  ? 'bg-blue-600/10 border-blue-500 ring-2 ring-blue-500/20 shadow-xl'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-400 uppercase">Maksimalno</span>
                {packageType === 'full_kasko' && <CheckCircle2 className="w-5 h-5 text-blue-400" />}
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Puni Kasko Paket</h4>
                <p className="text-[11px] text-slate-400 mt-1">Potpuna sigurnost vašeg vozila od svih nepredviđenih rizika.</p>
              </div>
              <ul className="text-[11px] text-slate-300 space-y-1.5 pt-2 border-t border-slate-800/80">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Sve iz paketa Asistencije</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Štete vlastitom krivnjom i sudar</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Tuča, oluja, pad stabla, krađa</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Addon Checkboxes */}
          <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Dodatna dopunska pokrića uz policu:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700 text-xs">
                <input
                  type="checkbox"
                  checked={includeGlass}
                  onChange={(e) => setIncludeGlass(e.target.checked)}
                  className="rounded border-slate-700 text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span className="text-slate-200">Zaštita stakala (+35 €)</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700 text-xs">
                <input
                  type="checkbox"
                  checked={includeBonusProtection}
                  onChange={(e) => setIncludeBonusProtection(e.target.checked)}
                  className="rounded border-slate-700 text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span className="text-slate-200">Zaštita bonusa (+22 €)</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700 text-xs">
                <input
                  type="checkbox"
                  checked={includeAssistance}
                  onChange={(e) => setIncludeAssistance(e.target.checked)}
                  className="rounded border-slate-700 text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span className="text-slate-200">24/7 Asistencija (+28 €)</span>
              </label>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Natrag na vozača</span>
            </button>

            <button
              type="button"
              onClick={handleNextFromStep3}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-900/30 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <span>Usporedi ponude osiguratelja</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* STEP 4: REZULTAT & USPOREDBA OSIGURATELJA */}
      {/* ========================================================= */}
      {step === 4 && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Izračun završen • Vozilo: {licensePlate}</span>
              </span>
              <h3 className="text-2xl font-black text-white mt-1">Usporedba ponuda osiguratelja</h3>
              <p className="text-xs text-slate-400">
                Kao neovisna agencija, jamčimo jednake ili niže cijene nego izravno kod osiguratelja.
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Ugovaratelj / OIB</span>
              <div className="text-sm font-bold text-white">{fullName}</div>
              <div className="text-xs font-mono text-emerald-400">{oib} (50% bonus)</div>
            </div>
          </div>

          {submittedLeadRef ? (
            <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                <FileCheck className="w-8 h-8 animate-bounce" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-black text-white">Vaš zahtjev za ponudu je zaprimljen!</h4>
                <p className="text-sm text-slate-300">
                  Referentni broj ponude: <span className="font-mono font-bold text-emerald-400">{submittedLeadRef}</span>
                </p>
                <p className="text-xs text-slate-400 max-w-lg mx-auto pt-2">
                  Licencirani broker Agencije Život pregledao je kalkulaciju i unutar nekoliko minuta na email <span className="text-white font-medium">{email}</span> stiže službena polica s primijenjenim agencijskim popustom i uplatnicom.
                </p>
              </div>
              <div className="pt-2">
                <a
                  href="/portal"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-lg"
                >
                  <span>Otvori Korisnički Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {carrierOffers.map((offer) => {
                const isSelected = selectedCarrier === offer.carrierId;
                return (
                  <div
                    key={offer.carrierId}
                    className={`p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-5 ${
                      isSelected
                        ? 'bg-blue-600/10 border-blue-500/80 shadow-xl'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-base font-extrabold text-white">{offer.name}</h4>
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-[10px] font-bold">
                          {offer.badge}
                        </span>
                      </div>

                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-300">
                        {offer.features.map((feat, idx) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex sm:flex-col items-end justify-between sm:justify-center border-t sm:border-t-0 sm:border-l border-slate-800 pt-3 sm:pt-0 sm:pl-6 shrink-0 gap-2">
                      <div className="text-right">
                        <div className="text-2xl font-black text-white font-mono">
                          {offer.annualPremium} € <span className="text-xs font-sans font-normal text-slate-400">/ god</span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          ili {offer.monthlyPremium} € / mj. (obročno)
                        </div>
                        {offer.discountEur > 0 && (
                          <div className="text-[10px] text-emerald-400 font-bold">
                            Ušteda: {offer.discountEur} € agencijskog popusta
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          setSelectedCarrier(offer.carrierId);
                          handleSubmitLead(offer);
                        }}
                        disabled={isSubmitting}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-lg shadow-emerald-950/40 cursor-pointer disabled:opacity-50"
                      >
                        {isSubmitting && selectedCarrier === offer.carrierId ? (
                          <span>Priprema ponude...</span>
                        ) : (
                          <>
                            <span>Zatraži službenu ponudu</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Prilagodi pokrića</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

