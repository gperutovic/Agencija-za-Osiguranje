import React, { useState, useMemo } from 'react';
import { 
  Home, 
  Building, 
  Flame, 
  Activity, 
  Droplets, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  FileCheck,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { OibInput } from '../ui/OibInput';
import { Tooltip } from '../ui/Tooltip';
import { calculatePropertyPremium } from '../../utils/ratingEngine';
import { leadService } from '../../services/firebase';

export const PropertyQuoteWizard: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Property Details
  const [propertyType, setPropertyType] = useState<'apartment' | 'house' | 'holiday_home'>('apartment');
  const [squareMeters, setSquareMeters] = useState(75);
  const [locationZone, setLocationZone] = useState('Zagreb (visoki rizik potresa)');
  const [buildingYear, setBuildingYear] = useState(2012);

  // Risk Addons
  const [includeEarthquake, setIncludeEarthquake] = useState(true);
  const [includeFlood, setIncludeFlood] = useState(true);
  const [includeWaterLeak, setIncludeWaterLeak] = useState(true);
  const [includeTheft, setIncludeTheft] = useState(true);
  const [deductible, setDeductible] = useState<0 | 100 | 250>(100);

  // Owner Info
  const [fullName, setFullName] = useState('Ana Horvat');
  const [email, setEmail] = useState('ana.horvat@email.hr');
  const [phone, setPhone] = useState('+385 91 234 5678');
  const [oib, setOib] = useState('26182105153');
  const [isOibValid, setIsOibValid] = useState(true);

  // State for submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedLeadRef, setSubmittedLeadRef] = useState<string | null>(null);

  // Premium Calculation
  const estimate = useMemo(() => {
    return calculatePropertyPremium({
      propertyType: propertyType === 'holiday_home' ? 'holiday' : propertyType,
      areaM2: squareMeters,
      constructionYear: buildingYear,
      includeContents: includeWaterLeak || includeTheft,
      includeEarthquake,
      includeFlood,
      deductibleTier: deductible,
    });
  }, [propertyType, squareMeters, buildingYear, locationZone, includeEarthquake, includeFlood, includeWaterLeak, includeTheft, deductible]);

  const handleSubmitLead = async (carrierName: string, annualPrice: number) => {
    setIsSubmitting(true);
    try {
      const ref = `PON-DOM-${Date.now().toString().slice(-6)}`;
      await leadService.saveLead({
        oib,
        name: fullName,
        email,
        phone,
        productType: 'property',
        status: 'new',
        data: {
          propertyType,
          squareMeters,
          locationZone,
          buildingYear,
          includeEarthquake,
          includeWaterLeak,
          includeTheft,
          deductible,
          selectedCarrier: carrierName,
          annualPremiumEur: annualPrice,
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
      
      {/* Steps indicator */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-5 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
            <Home className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
              Kalkulator osiguranja imovine i doma
            </span>
            <h3 className="text-lg font-black text-white">Zaštitite svoj dom od potresa i nepogoda</h3>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400">Korak {step} od 3</span>
        </div>
      </div>

      {/* Step 1: Nekretnina & Kvadratura */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h4 className="text-xl font-bold text-white">1. Odaberite tip i lokaciju nekretnine</h4>
            <p className="text-xs text-slate-400">
              Procjena pokriva građevinski dio i sve stvari u kućanstvu na novu građevinsku vrijednost.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'apartment', label: 'Stan / Apartman', icon: Building, desc: 'Stan u stambenoj zgradi' },
              { id: 'house', label: 'Obiteljska kuća', icon: Home, desc: 'Samostojeća ili dvojna kuća' },
              { id: 'holiday_home', label: 'Vikendica / Kuća za odmor', icon: Flame, desc: 'Povremeno nastanjena' },
            ].map((t) => {
              const Icon = t.icon;
              const isSelected = propertyType === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setPropertyType(t.id as any)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-emerald-600/15 border-emerald-500 ring-2 ring-emerald-500/20'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <div className="font-bold text-sm text-white">{t.label}</div>
                  <div className="text-[11px] text-slate-400">{t.desc}</div>
                </div>
              );
            })}
          </div>

          {/* Surface Area (m2) */}
          <div className="p-5 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">Neto stambena kvadratura</label>
              <span className="font-mono text-sm font-bold text-emerald-400">{squareMeters} m²</span>
            </div>
            <input
              type="range"
              min={25}
              max={280}
              step={5}
              value={squareMeters}
              onChange={(e) => setSquareMeters(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>25 m²</span>
              <span>75 m² (prosječan stan)</span>
              <span>150 m² (kuća)</span>
              <span>280 m²</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Lokacija nekretnine</label>
              <select
                value={locationZone}
                onChange={(e) => setLocationZone(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option>Zagreb (visoki rizik potresa)</option>
                <option>Sisačko-moslavačka (Petrinja/Glina)</option>
                <option>Rijeka i Kvarner</option>
                <option>Split i Dalmacija</option>
                <option>Istra (Pula, Rovinj, Poreč)</option>
                <option>Slavonija (Osijek, Slavonski Brod)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Godina izgradnje</label>
              <select
                value={buildingYear}
                onChange={(e) => setBuildingYear(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                {Array.from({ length: 30 }, (_, i) => 2026 - i).map((y) => (
                  <option key={y} value={y}>{y}. godina</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-900/30 transition-all cursor-pointer"
            >
              <span>Nastavi na rizike i franšizu</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Rizici & Franšiza */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h4 className="text-xl font-bold text-white">2. Odaberite rizike i klizač franšize</h4>
            <p className="text-xs text-slate-400">
              Prilagodite željena pokrića. Franšiza vam omogućuje dodatni popust na godišnju premiju.
            </p>
          </div>

          {/* Risk Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex items-start gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700">
              <input
                type="checkbox"
                checked={includeEarthquake}
                onChange={(e) => setIncludeEarthquake(e.target.checked)}
                className="mt-0.5 rounded border-slate-700 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
              />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-amber-400" />
                  <span>Osiguranje od potresa</span>
                </span>
                <p className="text-[11px] text-slate-400">Pokriva konstrukcijska oštećenja i pukotine na objektu.</p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700">
              <input
                type="checkbox"
                checked={includeWaterLeak}
                onChange={(e) => setIncludeWaterLeak(e.target.checked)}
                className="mt-0.5 rounded border-slate-700 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
              />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-blue-400" />
                  <span>Izljev vode iz instalacija</span>
                </span>
                <p className="text-[11px] text-slate-400">Puknuće vodovodnih i odvodnih cijevi te štete susjedima.</p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700">
              <input
                type="checkbox"
                checked={includeFlood}
                onChange={(e) => setIncludeFlood(e.target.checked)}
                className="mt-0.5 rounded border-slate-700 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
              />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-sky-400" />
                  <span>Poplava i bujica</span>
                </span>
                <p className="text-[11px] text-slate-400">Podzemne vode, prodor oborina i bujične poplave.</p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700">
              <input
                type="checkbox"
                checked={includeTheft}
                onChange={(e) => setIncludeTheft(e.target.checked)}
                className="mt-0.5 rounded border-slate-700 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
              />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                  <span>Provala i vandalizam</span>
                </span>
                <p className="text-[11px] text-slate-400">Otuđenje stvari, nakita, tehnike i razbijanje vrata/prozora.</p>
              </div>
            </label>
          </div>

          {/* Deductible (Franšiza) Selection */}
          <div className="p-5 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <span>Ugovorena franšiza (vlastito sudjelovanje)</span>
                <Tooltip term="franšiza" />
              </label>
              <span className="font-mono text-sm font-bold text-emerald-400">{deductible} €</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { val: 0, label: '0 € (Bez franšize)', desc: '100% isplata svake štete' },
                { val: 100, label: '100 € franšiza', desc: 'Preporučeni balans cijene' },
                { val: 250, label: '250 € franšiza', desc: 'Maksimalna ušteda premije' },
              ].map((f) => (
                <button
                  key={f.val}
                  type="button"
                  onClick={() => setDeductible(f.val as any)}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    deductible === f.val
                      ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="text-xs font-bold">{f.label}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{f.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Natrag na nekretninu</span>
            </button>

            <button
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-900/30 transition-all cursor-pointer"
            >
              <span>Izračunaj ponude</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Rezultat i Podaci o Vlasniku */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h4 className="text-xl font-bold text-white">3. Rezultati izračuna i usporedba</h4>
            <p className="text-xs text-slate-400">
              Prikazujemo ponude vodećih osiguratelja za {squareMeters} m² ({propertyType === 'apartment' ? 'Stan' : 'Kuća'}) u zoni {locationZone}.
            </p>
          </div>

          {/* Owner Details & OIB */}
          <div className="p-5 bg-slate-950/70 rounded-2xl border border-slate-800 space-y-4">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Podaci o ugovaratelju za izdavanje službene ponude:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400">Ime i prezime</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>

              <OibInput
                value={oib}
                onChange={(val, valid) => {
                  setOib(val);
                  setIsOibValid(valid);
                }}
                label="OIB vlasnika"
              />

              <div className="space-y-1">
                <label className="text-[11px] text-slate-400">Email za ponudu</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-400">Broj mobitela</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-white"
                />
              </div>
            </div>
          </div>

          {submittedLeadRef ? (
            <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
              <FileCheck className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
              <h4 className="text-lg font-bold text-white">Zahtjev za ponudu osiguranja doma zaprimljen!</h4>
              <p className="text-xs text-slate-300">
                Broj upita: <span className="font-mono font-bold text-emerald-400">{submittedLeadRef}</span>. Poslali smo detalje na <span className="text-white font-medium">{email}</span>.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {[
                {
                  id: 'generali',
                  name: 'Generali osiguranje d.d. (Paket Dom)',
                  badge: 'Preporučeno (potres i izljev uključen)',
                  price: estimate.annualPremium,
                  discountEur: 24,
                },
                {
                  id: 'croatia',
                  name: 'Croatia osiguranje d.d. (Croatia Imovina)',
                  badge: 'Najveća domaća kuća',
                  price: Math.round(estimate.annualPremium * 1.08),
                  discountEur: 15,
                },
                {
                  id: 'allianz',
                  name: 'Allianz Hrvatska d.d. (Moj Dom)',
                  badge: 'Brzi popravci u stanu',
                  price: Math.round(estimate.annualPremium * 1.05),
                  discountEur: 10,
                },
              ].map((c) => (
                <div
                  key={c.id}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{c.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-medium">
                        {c.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Uključeno: požar, oluja, potres, izljev vode, provala. Franšiza: {deductible} €.
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                    <div className="text-right">
                      <div className="text-xl font-bold font-mono text-white">
                        {c.price} € <span className="text-xs font-normal text-slate-400">/ god</span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        ili {Math.round(c.price / 12)} € / mj.
                      </div>
                    </div>

                    <button
                      onClick={() => handleSubmitLead(c.name, c.price)}
                      disabled={isSubmitting}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? 'Slanje...' : 'Zatraži ponudu'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Natrag na rizike</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

