import React, { useState, useMemo } from 'react';
import {
  Car,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { calculateAutoPremium, formatEuro } from '../../lib/calculations';
import { Slider } from '../ui/Slider';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { ReactiveQuoteResult } from './ReactiveQuoteResult';

const REGISTRATION_ZONES = [
  { code: 'ZG', name: 'Zagreb i okolica' },
  { code: 'ST', name: 'Split i Dalmacija' },
  { code: 'RI', name: 'Rijeka i Kvarner' },
  { code: 'OS', name: 'Osijek i Slavonija' },
  { code: 'PU', name: 'Pula i Istra' },
  { code: 'ZD', name: 'Zadar' },
  { code: 'DU', name: 'Dubrovnik' },
  { code: 'VZ', name: 'Varaždin' },
  { code: 'KA', name: 'Karlovac' },
  { code: 'SK', name: 'Sisak' },
];

export const AutoQuoteWizard: React.FC = () => {
  const [step, setStep] = useState<1 | 2>(1);

  // Inputs
  const [kw, setKw] = useState(85);
  const [driverAge, setDriverAge] = useState(38);
  const [bonusPercent, setBonusPercent] = useState(50);
  const [registrationZone, setRegistrationZone] = useState('ZG');
  const [coverageType, setCoverageType] = useState<'ao_only' | 'ao_kasko' | 'kasko_only'>('ao_kasko');

  // Policyholder details
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Actuarial calculation
  const quoteEstimate = useMemo(() => {
    return calculateAutoPremium({
      kw,
      driverAge,
      bonusPercent,
      coverageType,
      franchiseAmount: 0,
      addons: {
        glassBreakage: false,
        roadAssistance: false,
        bonusProtection: false,
      },
    });
  }, [kw, driverAge, bonusPercent, coverageType]);

  const kwTicks = [
    { value: 45, label: '45 kW' },
    { value: 75, label: '75 kW' },
    { value: 110, label: '110 kW' },
    { value: 150, label: '150 kW' },
    { value: 200, label: '200 kW' },
  ];

  const bonusTicks = [
    { value: 0, label: '0% (Početnik)' },
    { value: 25, label: '25%' },
    { value: 50, label: '50% (Maksimalni)' },
  ];

  return (
    <div className="space-y-6 text-left">
      {step === 1 ? (
        <div className="space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-xl font-black text-slate-900">Izračun Auto Odgovornosti (AO) i Kaska</h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Prilagodite snagu, vozačku dob i bonus za trenutan izračun premije.
            </p>
          </div>

          {/* Coverage Type Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Vrsta osiguranja</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'ao_only' as const, label: 'Samo AO (Obvezno)', desc: 'Zakonski minimum' },
                { id: 'ao_kasko' as const, label: 'AO + Puni Kasko', desc: 'Preporučeno (Ušteda)' },
                { id: 'kasko_only' as const, label: 'Samo Kasko', desc: 'Imate već AO' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setCoverageType(t.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    coverageType === t.id
                      ? 'border-emerald-600 bg-emerald-50/70 text-emerald-900 font-bold shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                  }`}
                >
                  <p className="text-xs">{t.label}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-slate-50 rounded-2xl border border-slate-200/80">
            <Slider
              label="Snaga motora u kilovatima (kW)"
              value={kw}
              min={25}
              max={250}
              step={5}
              unit="kW"
              onChange={setKw}
              ticks={kwTicks}
            />

            <Slider
              label="Dob vozača (godine)"
              value={driverAge}
              min={18}
              max={85}
              step={1}
              unit="god."
              onChange={setDriverAge}
              helperText="Mladi vozači do 24 god. imaju zakonski faktor rizika."
            />

            <Slider
              label="Stečeni bonus-malus popust"
              value={bonusPercent}
              min={0}
              max={50}
              step={5}
              unit="%"
              onChange={setBonusPercent}
              ticks={bonusTicks}
            />

            {/* Registration Zone Selector */}
            <div className="space-y-2 text-left">
              <label className="block text-xs font-semibold text-slate-700">Registarsko područje</label>
              <select
                value={registrationZone}
                onChange={(e) => setRegistrationZone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white text-slate-800 focus:outline-none focus:border-blue-600 min-h-[44px]"
              >
                {REGISTRATION_ZONES.map((z) => (
                  <option key={z.code} value={z.code}>
                    {z.code} - {z.name}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500 font-mono">
                Registarsko područje određuje osnovnu tablicu rizika u RH.
              </p>
            </div>
          </div>

          {/* Real-time Summary Card */}
          <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">
                  {kw} kW &bull; {driverAge} god. &bull; {bonusPercent}% bonus ({registrationZone})
                </p>
                <p className="text-[11px] text-slate-600">
                  Okvirna premija: <strong>{formatEuro(quoteEstimate.totalAnnual)}</strong> godišnje
                </p>
              </div>
            </div>

            <Button
              variant="emerald"
              size="sm"
              onClick={() => setStep(2)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="font-bold text-xs"
            >
              Usporedi ponude
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-xl font-black text-slate-900">Usporedba i prilagodba auto police</h3>
              <p className="text-xs text-slate-500 font-mono">
                {kw} kW &bull; {driverAge} god. &bull; {bonusPercent}% bonus
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStep(1)}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Izmijeni parametre
            </Button>
          </div>

          <ReactiveQuoteResult
            baseAnnualPrice={quoteEstimate.totalAnnual}
            productName={`Auto Osiguranje (${coverageType === 'ao_kasko' ? 'AO + Kasko' : coverageType === 'ao_only' ? 'Obvezno AO' : 'Puni Kasko'})`}
            category="auto"
            inputsSummary={{ kw, driverAge, bonusPercent, registrationZone, coverageType }}
          />
        </div>
      )}
    </div>
  );
};
