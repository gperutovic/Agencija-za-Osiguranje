import React, { useState, useMemo } from 'react';
import { 
  HeartPulse, 
  Stethoscope, 
  Pill, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  FileCheck,
  Building2,
  ShieldCheck
} from 'lucide-react';
import { OibInput } from '../ui/OibInput';
import { Tooltip } from '../ui/Tooltip';
import { calculateHealthPremium } from '../../utils/ratingEngine';
import { leadService } from '../../services/firebase';

export const HealthQuoteWizard: React.FC = () => {
  const [healthType, setHealthType] = useState<'dopunsko' | 'dodatno' | 'combo'>('combo');
  const [includeBList, setIncludeBList] = useState(true);
  const [checkupTier, setCheckupTier] = useState<'basic' | 'optimal' | 'premium'>('optimal');
  const [ageGroup, setAgeGroup] = useState<'18-35' | '36-50' | '51-65' | '65+'>('36-50');

  // Personal Info
  const [fullName, setFullName] = useState('Marko Kovačević');
  const [email, setEmail] = useState('marko.kovacevic@email.hr');
  const [phone, setPhone] = useState('+385 98 123 4567');
  const [oib, setOib] = useState('79213456782');
  const [isOibValid, setIsOibValid] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedLeadRef, setSubmittedLeadRef] = useState<string | null>(null);

  // Price Calculation in EUR
  const basePrices = useMemo(() => {
    let dopunskoMonthly = 9.5; // Croatia / Generali standard
    if (includeBList) dopunskoMonthly += 3.5;

    let dodatnoMonthly = 18;
    if (checkupTier === 'optimal') dodatnoMonthly = 28;
    if (checkupTier === 'premium') dodatnoMonthly = 42;

    if (ageGroup === '51-65') {
      dodatnoMonthly *= 1.25;
    } else if (ageGroup === '65+') {
      dodatnoMonthly *= 1.5;
    }

    let totalMonthly = 0;
    if (healthType === 'dopunsko') totalMonthly = dopunskoMonthly;
    else if (healthType === 'dodatno') totalMonthly = dodatnoMonthly;
    else totalMonthly = Math.round((dopunskoMonthly + dodatnoMonthly) * 0.9); // 10% paketni popust

    return {
      monthly: Math.round(totalMonthly * 100) / 100,
      annual: Math.round(totalMonthly * 12),
    };
  }, [healthType, includeBList, checkupTier, ageGroup]);

  const handleSubmitLead = async (carrierName: string) => {
    setIsSubmitting(true);
    try {
      const ref = `PON-MED-${Date.now().toString().slice(-6)}`;
      await leadService.saveLead({
        oib,
        name: fullName,
        email,
        phone,
        productType: 'health',
        status: 'new',
        data: {
          healthType,
          includeBList,
          checkupTier,
          ageGroup,
          selectedCarrier: carrierName,
          monthlyPremiumEur: basePrices.monthly,
          annualPremiumEur: basePrices.annual,
          referenceNumber: ref,
        },
      });

      setSubmittedLeadRef(ref);
    } catch (err) {
      console.error(err);
      alert('Došlo je do greške.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl text-slate-100 space-y-8">
      
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-5">
        <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center font-black">
          <HeartPulse className="w-5 h-5" />
        </div>
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-rose-400 font-bold">
            Zdravstveno osiguranje (Dopunsko i Dodatno)
          </span>
          <h3 className="text-lg font-black text-white">Pregledi bez čekanja i 100% pokrivena participacija</h3>
        </div>
      </div>

      {/* Package Mode Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          {
            id: 'dopunsko',
            title: 'Samo Dopunsko',
            desc: 'Pokriva HZZO participaciju i B-listu lijekova bez limita.',
            badge: 'Zakonska participacija',
          },
          {
            id: 'dodatno',
            title: 'Samo Dodatno',
            desc: 'Privatni specijalistički pregledi, MR, CT i sistematski pregled.',
            badge: 'Bez čekanja',
          },
          {
            id: 'combo',
            title: 'Kombinirani Paket (Zlatni)',
            desc: 'Dopunsko + Dodatno s 10% trajnog agencijskog popusta.',
            badge: 'Najbolja zaštita',
          },
        ].map((pkg) => {
          const isSelected = healthType === pkg.id;
          return (
            <div
              key={pkg.id}
              onClick={() => setHealthType(pkg.id as any)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 relative ${
                isSelected
                  ? 'bg-rose-600/15 border-rose-500 ring-2 ring-rose-500/20 shadow-xl'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 font-bold">
                  {pkg.badge}
                </span>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-rose-400" />}
              </div>
              <h4 className="font-bold text-sm text-white">{pkg.title}</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">{pkg.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* B-List Drugs */}
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={includeBList}
              onChange={(e) => setIncludeBList(e.target.checked)}
              className="mt-0.5 rounded border-slate-700 text-rose-600 focus:ring-rose-500 w-4 h-4"
            />
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-white flex items-center gap-1">
                <Pill className="w-3.5 h-3.5 text-rose-400" />
                <span>Uključi doplata za B-listu lijekova (+3.50 €/mj)</span>
              </span>
              <p className="text-[11px] text-slate-400">
                Pokriva razliku u cijeni za skuplje i inovativne lijekove s dopunske liste HZZO-a.
              </p>
            </div>
          </label>
        </div>

        {/* Age Group */}
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
          <label className="text-xs font-bold text-slate-300">Dobna skupina osiguranika</label>
          <div className="grid grid-cols-4 gap-1.5 pt-1">
            {(['18-35', '36-50', '51-65', '65+'] as const).map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setAgeGroup(a)}
                className={`py-2 px-1 text-center rounded-xl text-xs font-semibold border transition-all ${
                  ageGroup === a
                    ? 'bg-rose-600/20 border-rose-500 text-rose-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {a} god.
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Systematic Checkup Tier (If Dodatno or Combo) */}
      {(healthType === 'dodatno' || healthType === 'combo') && (
        <div className="space-y-3 p-5 bg-slate-950/60 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Stethoscope className="w-4 h-4 text-rose-400" />
              <span>Godišnji sistematski pregled (odabir paketa):</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'basic', label: 'Basic Paket', spec: 'Krv, urin, EKG, UZV abdomena, pregled internista' },
              { id: 'optimal', label: 'Optimal Paket (Preporučeno)', spec: 'Basic + UZV srca, UZV štitnjače, ginekolog / urolog' },
              { id: 'premium', label: 'Premium VIP', spec: 'Optimal + MR ili CT po preporuci, alergotestovi, dermatolog' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setCheckupTier(t.id as any)}
                className={`p-3 rounded-xl text-left border transition-all ${
                  checkupTier === t.id
                    ? 'bg-rose-600/20 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="text-xs font-bold">{t.label}</div>
                <div className="text-[10px] text-slate-400 mt-1 leading-snug">{t.spec}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Driver / Insured Info & OIB */}
      <div className="p-5 bg-slate-950/70 rounded-2xl border border-slate-800 space-y-4">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Podaci za izdavanje zdravstvene iskaznice:
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] text-slate-400">Ime i prezime osiguranika</label>
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
            label="OIB osiguranika"
          />

          <div className="space-y-1">
            <label className="text-[11px] text-slate-400">Email za policu i iskaznicu</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-slate-400">Kontakt telefon</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-white"
            />
          </div>
        </div>
      </div>

      {/* Result Card & Insurer Offers */}
      {submittedLeadRef ? (
        <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
          <FileCheck className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
          <h4 className="text-lg font-bold text-white">Zahtjev za zdravstveno osiguranje je zaprimljen!</h4>
          <p className="text-xs text-slate-300">
            Referenca: <span className="font-mono font-bold text-emerald-400">{submittedLeadRef}</span>. Polica i digitalna iskaznica stižu na <span className="text-white font-medium">{email}</span>.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white">Preporučene ponude osiguratelja:</h4>
            <span className="text-xs text-slate-400 font-mono">Cijene u EUR (€)</span>
          </div>

          {[
            {
              id: 'croatia',
              name: 'Croatia osiguranje d.d.',
              badge: 'Preko 600 partnerskih poliklinika',
              rating: '4.9★',
              desc: 'Digitalna kartica u aplikaciji, naručivanje unutar 48 sati bez uputnice.',
            },
            {
              id: 'generali',
              name: 'Generali osiguranje d.d.',
              badge: 'Partner Agencije Život (-10%)',
              rating: '4.8★',
              desc: 'Uključeni lijekovi s B-liste i besplatno drugo liječničko mišljenje.',
            },
            {
              id: 'merkur',
              name: 'Merkur osiguranje d.d.',
              badge: 'Specijalist za zdravlje & Fit',
              rating: '4.8★',
              desc: 'Wellness i preventivni programi te brza refundacija troškova.',
            },
          ].map((c) => (
            <div
              key={c.id}
              className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white">{c.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 font-medium">
                    {c.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{c.desc}</p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                <div className="text-right">
                  <div className="text-xl font-bold font-mono text-white">
                    {basePrices.monthly} € <span className="text-xs font-normal text-slate-400">/ mj.</span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    ({basePrices.annual} € / god)
                  </div>
                </div>

                <button
                  onClick={() => handleSubmitLead(c.name)}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Slanje...' : 'Ugovori policu'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

